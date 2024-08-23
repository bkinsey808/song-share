"use server";

import { sessionCookieGet } from "./sessionCookieGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";
import { SongSetSchema } from "@/features/sections/song-set/schemas";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songSetGet = async (songSetId: string) => {
	try {
		const cookieResult = await sessionCookieGet();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const songSetDoc = await db
			.collection(collection.SONG_SETS)
			.doc(songSetId)
			.get();
		if (!songSetDoc.exists) {
			return actionErrorMessageGet("Song set not found");
		}
		const songSetData = songSetDoc.data();

		const songSetParseResult = serverParse(SongSetSchema, songSetData);
		if (!songSetParseResult.success) {
			return actionErrorMessageGet("Song data invalid");
		}

		const songSet = songSetParseResult.output;

		return {
			actionResultType: actionResultType.SUCCESS,
			songSet,
		};
	} catch (error) {
		return actionErrorMessageGet("Error getting song set");
	}
};
