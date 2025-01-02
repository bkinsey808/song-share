"use server";

import { safeParse } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { PlaylistSchema } from "@/features/sections/playlist/schemas";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

type SongActiveSet = ({
	songId,
	playlistId,
}: {
	songId: string | null;
	playlistId?: string | null | undefined;
}) => Promise<
	| {
			actionResultType: "SUCCESS";
	  }
	| {
			actionResultType: "ERROR";
			message: string;
	  }
>;

export const songActiveSet: SongActiveSet = async ({ songId, playlistId }) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;
		const { uid } = sessionCookieData;

		if (playlistId) {
			const playlistResult = await db
				.collection(collectionNameGet(collection.PLAYLISTS))
				.doc(playlistId)
				.get();

			if (!playlistResult.exists) {
				return actionErrorMessageGet("Playlist not found");
			}

			const playlist = playlistResult.data();
			if (!playlist) {
				return actionErrorMessageGet("Playlist not found");
			}

			const playlistParseResult = safeParse(PlaylistSchema, playlist);
			if (!playlistParseResult.success) {
				return actionErrorMessageGet("Invalid playlist data");
			}
			const playlistData = playlistParseResult.output;
			const { songs } = playlistData;
			if (songId && !songs.find((song) => song.songId === songId)) {
				return actionErrorMessageGet("Song not in playlist");
			}
		}

		await db
			.collection(collectionNameGet(collection.USERS_PUBLIC))
			.doc(uid)
			.update({
				songActiveId: songId,
				...(playlistId ? { playlistActiveId: playlistId } : {}),
			});

		return {
			actionResultType: ActionResultType.SUCCESS,
		};
	} catch (error) {
		return actionErrorMessageGet("Error setting active song");
	}
};
