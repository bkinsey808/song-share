import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	updateDoc,
} from "firebase/firestore";

import { extendSession } from "./extendSession";
import { ActionResultType } from "@/features/app-store/enums";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
import { serverParse } from "@/features/global/serverParse";
import { SongSetSchema } from "@/features/sections/song-set/schemas";

export const songSetDelete = async (songSetId: string) => {
	try {
		if (!songSetId) {
			return getActionErrorMessage("Song set id is required");
		}

		const sessionCookieData = await extendSession();
		if (!sessionCookieData) {
			return getActionErrorMessage("Session expired");
		}

		const username = sessionCookieData.username;

		if (!username) {
			return getActionErrorMessage("Username not found");
		}

		const userDocRef = doc(db, "users", sessionCookieData.email);
		const userDoc = await getDoc(userDocRef);
		if (!userDoc.exists()) {
			return getActionErrorMessage("User not found");
		}

		const userDocData = userDoc.data();
		if (!userDocData) {
			return getActionErrorMessage("User data not found");
		}

		const userDocResult = serverParse(UserDocSchema, userDocData);
		if (!userDocResult.success) {
			return getActionErrorMessage("User data is invalid");
		}

		const userDocSongSets = userDocResult.output.songSets;

		// first, confirm user owns the song
		if (!userDocSongSets[songSetId]) {
			return getActionErrorMessage("User does not own this song set");
		}

		const songSetsCollection = collection(db, "songSets");
		const songSetDocRef = doc(songSetsCollection, songSetId);
		const songSetSnapshot = await getDoc(songSetDocRef);

		const songSetData = songSetSnapshot.data();
		if (!songSetData) {
			return getActionErrorMessage("Song set data not found");
		}

		const songSetResult = serverParse(SongSetSchema, songSetData);
		if (!songSetResult.success) {
			console.log(songSetData);
			return getActionErrorMessage("Song data is invalid");
		}

		const songSet = songSetResult.output;
		if (songSet.sharer !== username) {
			return getActionErrorMessage("User does not own this song");
		}

		// delete the song set from the song sets collection
		await deleteDoc(songSetDocRef);

		delete userDocSongSets[songSetId];

		// update user doc songs with the deleted song removed
		await updateDoc(userDocRef, {
			songSets: userDocSongSets,
		});

		return {
			actionResultType: ActionResultType.SUCCESS as const,
		};
	} catch (error) {
		console.error({ error });
		return getActionErrorMessage("Failed to delete song set");
	}
};
