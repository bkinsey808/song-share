"use server";

import { playlistGet } from "./playlistGet";
import { sessionExtend } from "./sessionExtend";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const playlistActiveSet = async (
	playlistId: string | null,
): Promise<
	| {
			actionResultType: "ERROR";
			message: string;
	  }
	| {
			actionResultType: "SUCCESS";
			songActiveId: string | null;
	  }
> => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;
		const { uid } = sessionCookieData;
		const { userPublicDoc } = extendSessionResult;
		const { songActiveId } = userPublicDoc;

		if (playlistId) {
			const playlistResult = await playlistGet(playlistId);
			if (playlistResult.actionResultType === ActionResultType.ERROR) {
				return actionErrorMessageGet("Playlist not found");
			}
			const playlist = playlistResult.playlist;
			const { songs } = playlist;

			if (
				songs.length > 0 &&
				(!songActiveId ||
					(songActiveId &&
						!songs.find(({ songId }) => songId === songActiveId)))
			) {
				await db
					.collection(collectionNameGet(collection.USERS_PUBLIC))
					.doc(uid)
					.update({
						playlistActiveId: playlistId,
						songActiveId: songs[0].songId,
					});
			} else {
				await db
					.collection(collectionNameGet(collection.USERS_PUBLIC))
					.doc(uid)
					.update({ playlistActiveId: playlistId });
			}

			return {
				actionResultType: ActionResultType.SUCCESS,
				songActiveId,
			};
		}

		await db
			.collection(collectionNameGet(collection.USERS_PUBLIC))
			.doc(uid)
			.update({ playlistActiveId: playlistId });

		return { actionResultType: ActionResultType.SUCCESS, songActiveId: null };
	} catch (error) {
		return actionErrorMessageGet("Error setting active playlist");
	}
};
