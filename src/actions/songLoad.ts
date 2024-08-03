import { doc, getDoc, setDoc } from "firebase/firestore";

import { extendSession } from "./extendSession";
import { ActionResultType } from "@/features/app-store/enums";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
import { serverParse } from "@/features/global/serverParse";
import { SongSchema } from "@/features/sections/song/schemas";
import { SlimSong } from "@/features/sections/song/types";

export const songLoad = async (songId: string) => {
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

		const songDocSnapshot = await getDoc(doc(db, "songs", songId));
		if (!songDocSnapshot.exists()) {
			return getActionErrorMessage("Song not found");
		}

		const songData = songDocSnapshot.data();
		if (!songData) {
			return getActionErrorMessage("Song data not found");
		}

		const songParseResult = serverParse(SongSchema, songData);
		if (!songParseResult.success) {
			return getActionErrorMessage("Song data invalid");
		}

		const song = songParseResult.output;

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
		const oldSlimSong = userDoc.songSets[songId];

		const newSlimSong: SlimSong = {
			songSetName: song.songName,
			sharer: username,
		};

		const slimSongsAreEqual =
			JSON.stringify(oldSlimSong) === JSON.stringify(newSlimSong);

		if (!slimSongsAreEqual) {
			userDoc.songSets[songId] = newSlimSong;
			await setDoc(doc(db, "users", username), userDoc);
		}

		return {
			actionResultType: ActionResultType.SUCCESS as const,
			songLibrarySong: songParseResult.output,
		};
	} catch (error) {
		console.error(error);
		return getActionErrorMessage("An error occurred");
	}
};
