"use server";

import { flatten } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { songGet } from "./songGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { serverParse } from "@/features/global/serverParse";
import { SongSchema } from "@/features/sections/song/schemas";
import type { Song } from "@/features/sections/song/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const getFormError = (formError: string) => {
	console.error(formError);
	return {
		actionResultType: actionResultType.ERROR,
		formError,
		fieldErrors: undefined,
	};
};

const saveOrCreateSong = async (
	songId: string | null,
	uid: string,
	song: Song,
) => {
	if (song.sharer && song.sharer !== uid) {
		throw new Error("User does not own this song");
	}
	if (!song.sharer) {
		song.sharer = uid;
	}
	if (songId) {
		const songResult = await songGet(songId);
		if (songResult.actionResultType === actionResultType.ERROR) {
			console.warn("Song not found");
		} else {
			if (!!songResult.song.sharer && songResult.song.sharer !== uid) {
				throw new Error("User does not own this song");
			}
		}
		await db
			.collection(collectionNameGet(collection.SONGS))
			.doc(songId)
			.set(song);
		return songId;
	}
	const result = await db
		.collection(collectionNameGet(collection.SONGS))
		.add(song);
	songId = result.id;
	return songId;
};

export const songSave = async ({
	song,
	songId,
}: {
	song: Song;
	songId: string | null;
}) => {
	try {
		const songParseResult = serverParse(SongSchema, song);
		if (!songParseResult.success) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: flatten<typeof SongSchema>(songParseResult.issues).nested,
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

		const newSongId = await saveOrCreateSong(songId, uid, song);
		const newSongIds = songId
			? userDoc.songIds
			: Array.from(new Set([...userDoc.songIds, newSongId]));

		await db.collection(collectionNameGet(collection.USERS)).doc(uid).update({
			songIds: newSongIds,
			songId: newSongId,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			songId: newSongId,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save song");
	}
};
