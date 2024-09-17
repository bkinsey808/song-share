"use server";

import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";
import { PlaylistSchema } from "@/features/sections/playlist/schemas";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const playlistGet = async (playlistId: string) => {
	try {
		const playlistDoc = await db
			.collection(collection.SONG_SETS)
			.doc(playlistId)
			.get();
		if (!playlistDoc.exists) {
			console.warn("Song set not found");
			return actionErrorMessageGet("Song set not found");
		}
		const playlistData = playlistDoc.data();

		const playlistParseResult = serverParse(PlaylistSchema, playlistData);
		if (!playlistParseResult.success) {
			console.warn("Song data invalid");
			return actionErrorMessageGet("Song data invalid");
		}

		const playlist = playlistParseResult.output;

		return {
			actionResultType: actionResultType.SUCCESS,
			playlist,
		};
	} catch (error) {
		console.warn("Error getting playlist");
		return actionErrorMessageGet("Error getting playlist");
	}
};