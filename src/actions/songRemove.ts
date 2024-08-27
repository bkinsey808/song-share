"use server";

import { sessionExtend } from "./sessionExtend";
import { songSetGet } from "./songSetGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { SongSet } from "@/features/sections/song-set/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songRemove = async ({
	songId,
	songSetId,
}: {
	songId: string;
	songSetId: string;
}) => {
	try {
		const sessionExtendResult = await sessionExtend();
		if (sessionExtendResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { uid } = sessionExtendResult.sessionCookieData;

		const songSetResult = await songSetGet(songSetId);
		if (songSetResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Song set not found");
		}

		const { songSet } = songSetResult;
		if (songSet.sharer !== uid) {
			return actionErrorMessageGet(
				"You are not authorized to remove this song",
			);
		}

		const newSongIds = songSet.songIds.filter((id) => id !== songId);
		const newSongSet: SongSet = {
			...songSet,
			songIds: newSongIds,
		};

		await db.collection(collection.SONG_SETS).doc(songSetId).update({
			songIds: newSongIds,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			songSet: newSongSet,
		};
	} catch (error) {
		console.error(error);
		return actionErrorMessageGet("An error occurred");
	}
};
