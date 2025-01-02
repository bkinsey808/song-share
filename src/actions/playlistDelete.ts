"use server";

import { playlistGet } from "./playlistGet";
import { sessionExtend } from "./sessionExtend";
import { userDocGet } from "./userDocGet";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const playlistDelete = async (
	playlistId: string,
): Promise<
	| {
			actionResultType: "ERROR";
			message: string;
	  }
	| {
			actionResultType: "SUCCESS";
			playlistIds: string[];
	  }
> => {
	try {
		if (!playlistId) {
			return actionErrorMessageGet("Playlist id is required");
		}

		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;

		const { uid } = sessionCookieData;

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === ActionResultType.ERROR) {
			return userDocResult;
		}
		const { userDoc } = userDocResult;

		const { playlistIds } = userDoc;
		const newPlaylistIds = (playlistIds ?? []).filter(
			(id) => id !== playlistId,
		);

		const playlistResult = await playlistGet(playlistId);
		if (playlistResult.actionResultType === ActionResultType.ERROR) {
			return playlistResult;
		}
		const { playlist } = playlistResult;

		if (playlist.sharer !== uid) {
			return actionErrorMessageGet("User does not own this song");
		}

		// delete the playlist from the playlists collection
		await db
			.collection(collectionNameGet(collection.PLAYLISTS))
			.doc(playlistId)
			.delete();

		// update user doc songs with the deleted song removed
		await db.collection(collectionNameGet(collection.USERS)).doc(uid).update({
			playlistIds: newPlaylistIds,
		});

		return {
			actionResultType: ActionResultType.SUCCESS,
			playlistIds: newPlaylistIds,
		};
	} catch (error) {
		console.error({ error });
		return actionErrorMessageGet("Failed to delete playlist");
	}
};
