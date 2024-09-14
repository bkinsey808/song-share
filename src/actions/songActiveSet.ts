"use server";

import { safeParse } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { PlaylistSchema } from "@/features/sections/playlist/schemas";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songActiveSet = async ({
	songId,
	playlistId,
}: {
	songId: string | null;
	playlistId: string | null;
}) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;
		const { uid } = sessionCookieData;

		const userPublicGetResult = await db
			.collection(collection.USERS_PUBLIC)
			.doc(uid)
			.get();
		if (!userPublicGetResult.exists) {
			return actionErrorMessageGet("Public user not found");
		}

		const userPublic = userPublicGetResult.data();
		if (!userPublic) {
			return actionErrorMessageGet("Public user not found");
		}

		if (playlistId) {
			const playlistResult = await db
				.collection(collection.SONG_SETS)
				.doc(playlistId)
				.get();

			if (!playlistResult.exists) {
				return actionErrorMessageGet("Song set not found");
			}

			const playlist = playlistResult.data();
			if (!playlist) {
				return actionErrorMessageGet("Song set not found");
			}

			const playlistParseResult = safeParse(PlaylistSchema, playlist);
			if (!playlistParseResult.success) {
				return actionErrorMessageGet("Invalid song set data");
			}
			const playlistData = playlistParseResult.output;
			const { songIds } = playlistData;
			if (songId && !songIds.includes(songId)) {
				return actionErrorMessageGet("Song not in song set");
			}
		}

		await db
			.collection(collection.USERS_PUBLIC)
			.doc(uid)
			.update({ songActiveId: songId, playlistActiveId: playlistId });

		return {
			actionResultType: actionResultType.SUCCESS,
		};
	} catch (error) {
		return actionErrorMessageGet("Error setting active song");
	}
};
