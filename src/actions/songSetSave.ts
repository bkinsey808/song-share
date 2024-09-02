"use server";

import { flatten } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { songSetGet } from "./songSetGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { serverParse } from "@/features/global/serverParse";
import { SongSetSchema } from "@/features/sections/song-set/schemas";
import type { SongSet } from "@/features/sections/song-set/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const getFormError = (formError: string) => {
	console.error(formError);
	return {
		actionResultType: actionResultType.ERROR,
		formError,
		fieldErrors: [],
	};
};

const saveOrCreateSongSet = async (
	songSetId: string | null,
	uid: string,
	songSet: SongSet,
) => {
	if (songSet.sharer && songSet.sharer !== uid) {
		throw new Error("User does not own this song set");
	}
	if (!songSet.sharer) {
		songSet.sharer = uid;
	}
	if (songSetId) {
		const songSetResult = await songSetGet(songSetId);
		if (songSetResult.actionResultType === actionResultType.ERROR) {
			throw new Error("Song set not found");
		}
		if (songSetResult.songSet.sharer !== uid) {
			throw new Error("User does not own this song set");
		}
		await db.collection(collection.SONG_SETS).doc(songSetId).set(songSet);
		return songSetId;
	}
	const result = await db.collection(collection.SONG_SETS).add(songSet);
	songSetId = result.id;
	return songSetId;
};

export const songSetSave = async ({
	songSet,
	songSetId,
}: {
	songSet: SongSet;
	songSetId: string | null;
}) => {
	try {
		const result = serverParse(SongSetSchema, songSet);
		if (!result.success) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: flatten<typeof SongSetSchema>(result.issues).nested,
			};
		}

		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return getFormError("Session expired");
		}
		const { sessionCookieData } = extendSessionResult;
		const { uid } = sessionCookieData;

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return getFormError("Failed to get user doc");
		}
		const { userDoc } = userDocResult;

		if (songSetId) {
			const songSetResult = await songSetGet(songSetId);
			if (songSetResult.actionResultType === actionResultType.ERROR) {
				return getFormError("Song set not found");
			}
			if (
				!!songSetResult.songSet.sharer &&
				songSetResult.songSet.sharer !== uid
			) {
				return getFormError("User does not own this song set");
			}
		}

		const newSongSetId = await saveOrCreateSongSet(songSetId, uid, songSet);
		const newSongSetIds = songSetId
			? userDoc.songSetIds
			: Array.from(new Set([...userDoc.songSetIds, newSongSetId]));

		if (!songSetId) {
			await db.collection(collection.USERS).doc(uid).update({
				songSetIds: newSongSetIds,
				songSetId: newSongSetId,
			});
		}

		return {
			actionResultType: actionResultType.SUCCESS,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save song set");
	}
};
