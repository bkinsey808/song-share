"use server";

import { collection, doc, getDoc } from "firebase/firestore";

import { getSessionCookieData } from "./getSessionCookieData";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
import { serverParse } from "@/features/global/serverParse";
import { SongSetSchema } from "@/features/sections/song-set/schemas";

export const getSongSet = async (songSetId: string) => {
	try {
		const cookieResult = await getSessionCookieData();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Session expired");
		}

		const songSetsCollection = collection(db, "songSets");
		const songSetDocRef = doc(songSetsCollection, songSetId);
		const songSetDocSnapshot = await getDoc(songSetDocRef);
		if (!songSetDocSnapshot.exists()) {
			return getActionErrorMessage("Song set not found");
		}

		const songSetData = songSetDocSnapshot.data();
		if (!songSetData) {
			return getActionErrorMessage("Song set data not found");
		}

		const songSetParseResult = serverParse(SongSetSchema, songSetData);
		if (!songSetParseResult.success) {
			return getActionErrorMessage("Song data invalid");
		}

		const songSet = songSetParseResult.output;

		return {
			actionResultType: actionResultType.SUCCESS,
			songSet,
			songSetDocRef,
		};
	} catch (error) {
		return getActionErrorMessage("Error getting song set");
	}
};
