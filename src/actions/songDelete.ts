import { update } from "effect/Differ";
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	setDoc,
	updateDoc,
} from "firebase/firestore";

import { extendSession } from "./extendSession";
import { ActionResultType } from "@/features/app-store/enums";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
import { serverParse } from "@/features/global/serverParse";
import { SongSchema } from "@/features/sections/song/schemas";

export const songDelete = async (songId: string) => {
	try {
		if (!songId) {
			return getActionErrorMessage("Song ID is required");
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

		const userDocSongs = userDocResult.output.songs;

		// first, confirm user owns the song
		if (!userDocSongs[songId]) {
			return getActionErrorMessage("User does not own this song");
		}

		const songsCollection = collection(db, "songs");
		const songDocRef = doc(songsCollection, songId);
		const songSnapshot = await getDoc(songDocRef);

		const songData = songSnapshot.data();
		if (!songData) {
			return getActionErrorMessage("Song data not found");
		}

		const songResult = serverParse(SongSchema, songData);
		if (!songResult.success) {
			console.log(songData);
			return getActionErrorMessage("Song data is invalid");
		}

		const songLibrarySong = songResult.output;
		if (songLibrarySong.sharer !== username) {
			return getActionErrorMessage("User does not own this song");
		}

		// delete the song form the songs collection
		await deleteDoc(songDocRef);

		delete userDocSongs[songId];

		// update user doc songs with the deleted song removed
		await updateDoc(userDocRef, {
			songs: userDocSongs,
		});

		return {
			actionResultType: ActionResultType.SUCCESS as const,
		};
	} catch (error) {
		console.error({ error });
		return getActionErrorMessage("Failed to delete song");
	}
};
