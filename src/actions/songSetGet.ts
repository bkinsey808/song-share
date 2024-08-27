"use server";

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
		const songSetDoc = await db
			.collection(collection.SONG_SETS)
			.doc(songSetId)
			.get();
		if (!songSetDoc.exists) {
			console.warn("Song set not found");
			return actionErrorMessageGet("Song set not found");
		}
		const songSetData = songSetDoc.data();

		const songSetParseResult = serverParse(SongSetSchema, songSetData);
		if (!songSetParseResult.success) {
			console.warn("Song data invalid");
			return actionErrorMessageGet("Song data invalid");
		}

		const songSet = songSetParseResult.output;

		return {
			actionResultType: actionResultType.SUCCESS,
			songSet,
		};
	} catch (error) {
		console.warn("Error getting song set");
		return actionErrorMessageGet("Error getting song set");
	}
};
