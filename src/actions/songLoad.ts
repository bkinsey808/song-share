import { doc, getDoc, setDoc } from "firebase/firestore";

import { extendSession } from "./extendSession";
import { ActionResultType } from "@/features/app-store/enums";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { serverParse } from "@/features/global/serverParse";
import { SongSchema } from "@/features/sections/song/schemas";
import { SlimSong, Song } from "@/features/sections/song/types";

export type SongLoadResult =
	| {
			actionResultType: ActionResultType.SUCCESS;
			songLibrarySong: Song;
	  }
	| {
			actionResultType: ActionResultType.ERROR;
			error: string;
	  };

export const songLoad = async (songId: string): Promise<SongLoadResult> => {
	try {
		const sessionCookieData = await extendSession();
		if (!sessionCookieData) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "Session expired",
			};
		}

		const { username, email } = sessionCookieData;

		if (!username) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "Username not found",
			};
		}

		if (!email) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "Email not found",
			};
		}

		const songDocSnapshot = await getDoc(doc(db, "songs", songId));
		if (!songDocSnapshot.exists()) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "Song not found",
			};
		}

		const songData = songDocSnapshot.data();
		if (!songData) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "Song data not found",
			};
		}

		const songParseResult = serverParse(SongSchema, songData);
		if (!songParseResult.success) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "Song data invalid",
			};
		}

		const song = songParseResult.output;

		// update user's song library
		const userDocSnapshot = await getDoc(doc(db, "users", email));
		if (!userDocSnapshot.exists()) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: `User not found: ${email}`,
			};
		}

		const userDocData = userDocSnapshot.data();
		if (!userDocData) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "User data not found",
			};
		}

		const userDocResult = serverParse(UserDocSchema, userDocData);
		if (!userDocResult.success) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "User data invalid",
			};
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
			actionResultType: ActionResultType.SUCCESS,
			songLibrarySong: songParseResult.output,
		};
	} catch (error) {
		console.error(error);
		return {
			actionResultType: ActionResultType.ERROR,
			error: "An error occurred",
		};
	}
};
