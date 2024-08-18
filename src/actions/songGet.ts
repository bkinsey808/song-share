"use server";

import { collection, doc, getDoc } from "firebase/firestore";

import { sessionCookieGet } from "./sessionCookieGet";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";
import { SongSchema } from "@/features/sections/song/schemas";

export const songGet = async (songId: string) => {
	try {
		const cookieResult = await sessionCookieGet();
		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const songsCollection = collection(db, "songs");
		const songDocRef = doc(songsCollection, songId);
		const songDocSnapshot = await getDoc(songDocRef);
		if (!songDocSnapshot.exists()) {
			return actionErrorMessageGet("Song not found");
		}

		const songData = songDocSnapshot.data();
		if (!songData) {
			return actionErrorMessageGet("Song data not found");
		}

		const songParseResult = serverParse(SongSchema, songData);
		if (!songParseResult.success) {
			console.warn(songData);
			return actionErrorMessageGet("Song data invalid");
		}

		const song = songParseResult.output;

		return { actionResultType: actionResultType.SUCCESS, song, songDocRef };
	} catch (error) {
		return actionErrorMessageGet("Error getting song");
	}
};
