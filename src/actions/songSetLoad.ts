import { doc, getDoc, setDoc } from "firebase/firestore";

import { extendSession } from "./extendSession";
import { ActionResultType } from "@/features/app-store/enums";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
import { serverParse } from "@/features/global/serverParse";
import { SongSetSchema } from "@/features/sections/song-set/schemas";
import { SlimSongSet } from "@/features/sections/song-set/types";

export const songSetLoad = async (songSetId: string) => {
	try {
		const sessionCookieData = await extendSession();
		if (!sessionCookieData) {
			return getActionErrorMessage("Session expired");
		}

		const { username, email } = sessionCookieData;

		if (!username) {
			return getActionErrorMessage("Username not found");
		}

		if (!email) {
			return getActionErrorMessage("Email not found");
		}

		const songSetDocSnapshot = await getDoc(doc(db, "songSets", songSetId));
		if (!songSetDocSnapshot.exists()) {
			return getActionErrorMessage("Song Set not found");
		}

		const songSetData = songSetDocSnapshot.data();
		if (!songSetData) {
			return getActionErrorMessage("Song Set data not found");
		}

		const songSetParseResult = serverParse(SongSetSchema, songSetData);
		if (!songSetParseResult.success) {
			return getActionErrorMessage("Song Set data invalid");
		}

		const songSetLibrarySongSet = songSetParseResult.output;

		// update user's song library
		const userDocSnapshot = await getDoc(doc(db, "users", email));
		if (!userDocSnapshot.exists()) {
			return getActionErrorMessage(`User not found: ${email}`);
		}

		const userDocData = userDocSnapshot.data();
		if (!userDocData) {
			return getActionErrorMessage("User data not found");
		}

		const userDocResult = serverParse(UserDocSchema, userDocData);
		if (!userDocResult.success) {
			return getActionErrorMessage("User data invalid");
		}
		const userDoc = userDocResult.output;
		const oldSlimSongSet = userDoc.songSets[songSetId];

		const newSlimSongSet: SlimSongSet = {
			songSetName: songSetLibrarySongSet.songSetName,
			sharer: username,
		};

		const slimSongsAreEqual =
			JSON.stringify(oldSlimSongSet) === JSON.stringify(newSlimSongSet);

		if (!slimSongsAreEqual) {
			userDoc.songSets[songSetId] = newSlimSongSet;
			await setDoc(doc(db, "users", username), userDoc);
		}

		return {
			actionResultType: ActionResultType.SUCCESS as const,
			songSetLibrarySongSet: songSetParseResult.output,
		};
	} catch (error) {
		console.error(error);
		return getActionErrorMessage("An error occurred");
	}
};
