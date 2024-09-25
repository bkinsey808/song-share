"use server";

import { playlistGet } from "./playlistGet";
import { sessionExtend } from "./sessionExtend";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const playlistDelete = async (playlistId: string) => {
	try {
		if (!playlistId) {
			return actionErrorMessageGet("Playlist id is required");
		}

		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;

		const { uid } = sessionCookieData;

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return userDocResult;
		}
		const { userDoc } = userDocResult;

		const { playlistIds } = userDoc;
		const newPlaylistIds = (playlistIds ?? []).filter(
			(id) => id !== playlistId,
		);

		const playlistResult = await playlistGet(playlistId);
		if (playlistResult.actionResultType === actionResultType.ERROR) {
			return playlistResult;
		}
		const { playlist } = playlistResult;

		if (playlist.sharer !== uid) {
			return actionErrorMessageGet("User does not own this song");
		}

		// delete the playlist from the playlists collection
		await db.collection(collection.SONG_SETS).doc(playlistId).delete();

		// update user doc songs with the deleted song removed
		await db.collection(collection.USERS).doc(uid).update({
			playlistIds: newPlaylistIds,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			playlistIds: newPlaylistIds,
		};
	} catch (error) {
		console.error({ error });
		return actionErrorMessageGet("Failed to delete playlist");
	}
};
