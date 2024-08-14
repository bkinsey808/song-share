"use server";

import { collection, doc, getDoc } from "firebase/firestore";

import { getSessionCookieData } from "./getSessionCookieData";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
import { serverParse } from "@/features/global/serverParse";
import { SongSchema } from "@/features/sections/song/schemas";

export const getSong = async (songId: string) => {
	try {
		const cookieResult = await getSessionCookieData();
		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Session expired");
		}

		const songsCollection = collection(db, "songs");
		const songDocRef = doc(songsCollection, songId);
		const songDocSnapshot = await getDoc(songDocRef);
		if (!songDocSnapshot.exists()) {
			return getActionErrorMessage("Song not found");
		}

		const songData = songDocSnapshot.data();
		if (!songData) {
			return getActionErrorMessage("Song data not found");
		}

		const songParseResult = serverParse(SongSchema, songData);
		if (!songParseResult.success) {
			console.warn(songData);
			return getActionErrorMessage("Song data invalid");
		}

		const song = songParseResult.output;

		return { actionResultType: actionResultType.SUCCESS, song, songDocRef };
	} catch (error) {
		return getActionErrorMessage("Error getting song");
	}
};
