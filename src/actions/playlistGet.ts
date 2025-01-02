"use server";

import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";
import { PlaylistSchema } from "@/features/sections/playlist/schemas";
import { Playlist } from "@/features/sections/playlist/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const playlistGet = async (
	playlistId: string,
): Promise<
	| { actionResultType: "SUCCESS"; playlist: Playlist }
	| {
			actionResultType: "ERROR";
			message: string;
	  }
> => {
	try {
		const playlistDoc = await db
			.collection(collectionNameGet(collection.PLAYLISTS))
			.doc(playlistId)
			.get();
		if (!playlistDoc.exists) {
			console.warn("Playlist not found");
			return actionErrorMessageGet("Playlist not found");
		}
		const playlistData = playlistDoc.data();

		const playlistParseResult = serverParse(PlaylistSchema, playlistData);
		if (!playlistParseResult.success) {
			console.warn("Song data invalid");
			return actionErrorMessageGet("Song data invalid");
		}

		const playlist = playlistParseResult.output;

		return {
			actionResultType: ActionResultType.SUCCESS,
			playlist,
		};
	} catch (error) {
		console.warn("Error getting playlist");
		return actionErrorMessageGet("Error getting playlist");
	}
};
