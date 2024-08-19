"use server";

import { collection, doc, getDoc } from "firebase/firestore";

import { sessionCookieGet } from "./sessionCookieGet";
import { actionResultType } from "@/features/app-store/consts";
import { dbServer } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";
import { SongSetSchema } from "@/features/sections/song-set/schemas";

export const songSetGet = async (songSetId: string) => {
	try {
		const cookieResult = await sessionCookieGet();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const songSetsCollection = collection(dbServer, "songSets");
		const songSetDocRef = doc(songSetsCollection, songSetId);
		const songSetDocSnapshot = await getDoc(songSetDocRef);
		if (!songSetDocSnapshot.exists()) {
			return actionErrorMessageGet("Song set not found");
		}

		const songSetData = songSetDocSnapshot.data();
		if (!songSetData) {
			return actionErrorMessageGet("Song set data not found");
		}

		const songSetParseResult = serverParse(SongSetSchema, songSetData);
		if (!songSetParseResult.success) {
			return actionErrorMessageGet("Song data invalid");
		}

		const songSet = songSetParseResult.output;

		return {
			actionResultType: actionResultType.SUCCESS,
			songSet,
			songSetDocRef,
		};
	} catch (error) {
		return actionErrorMessageGet("Error getting song set");
	}
};
