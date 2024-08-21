"use server";

import { flatten } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { songGet } from "./songGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebaseServer";
import { UserDoc } from "@/features/firebase/types";
import { serverParse } from "@/features/global/serverParse";
import { SongSchema } from "@/features/sections/song/schemas";
import type { SlimSong, Song } from "@/features/sections/song/types";

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
	if (songId) {
		const songResult = await songGet(songId);
		if (songResult.actionResultType === actionResultType.ERROR) {
			throw new Error("Song not found");
		}
		if (songResult.song.sharer !== uid) {
			throw new Error("User does not own this song");
		}
		await db.collection("songs").doc(songId).set(song);
		return songId;
	}
	const result = await db.collection("songs").add(song);
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

		const sessionCookieData = extendSessionResult.sessionCookieData;

		const { uid } = sessionCookieData;

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return getFormError("Failed to get user doc");
		}
		const { userDoc } = userDocResult;

		// confirm user owns the song
		const userDocSongs = userDoc.songs;
		if (songId && !userDocSongs[songId]) {
			return getFormError("User does not own this song");
		}

		const newSongId = await saveOrCreateSong(songId, uid, song);

		const slimSong: SlimSong = {
			songName: song.songName,
			sharer: uid,
		};

		// update the slimSong in the userDoc
		const newSongs: UserDoc["songs"] = {
			...userDocSongs,
			[songId ?? newSongId]: slimSong,
		};

		await db
			.collection("users")
			.doc(uid)
			.update({
				songId: songId ?? newSongId,
				songs: newSongs,
			});

		return {
			actionResultType: actionResultType.SUCCESS,
			songId: songId ?? newSongId,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save song");
	}
};
