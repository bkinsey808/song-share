"use server";

import { flatten } from "valibot";

import { playlistGet } from "./playlistGet";
import { sessionExtend } from "./sessionExtend";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { serverParse } from "@/features/global/serverParse";
import { PlaylistSchema } from "@/features/sections/playlist/schemas";
import type { Playlist } from "@/features/sections/playlist/types";

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

const saveOrCreatePlaylist = async (
	playlistId: string | null,
	uid: string,
	playlist: Playlist,
) => {
	if (playlist.sharer && playlist.sharer !== uid) {
		throw new Error("User does not own this playlist");
	}

	if (!playlist.sharer) {
		playlist.sharer = uid;
	}

	if (playlistId) {
		const playlistResult = await playlistGet(playlistId);
		if (playlistResult.actionResultType === actionResultType.ERROR) {
			throw new Error("Playlist not found");
		}
		if (playlistResult.playlist.sharer !== uid) {
			throw new Error("User does not own this playlist");
		}
		await db
			.collection(collectionNameGet(collection.PLAYLISTS))
			.doc(playlistId)
			.update(playlist);
		return playlistId;
	}

	const result = await db
		.collection(collectionNameGet(collection.PLAYLISTS))
		.add(playlist);
	playlistId = result.id;
	return playlistId;
};

export const playlistSave = async ({
	playlist,
	playlistId,
}: {
	playlist: Playlist;
	playlistId: string | null;
}) => {
	try {
		const result = serverParse(PlaylistSchema, playlist);
		if (!result.success) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: flatten<typeof PlaylistSchema>(result.issues).nested,
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

		if (playlistId) {
			const playlistResult = await playlistGet(playlistId);
			if (playlistResult.actionResultType === actionResultType.ERROR) {
				return getFormError("Playlist not found");
			}
			if (
				!!playlistResult.playlist.sharer &&
				playlistResult.playlist.sharer !== uid
			) {
				return getFormError("User does not own this playlist");
			}
		}

		const newPlaylistId = await saveOrCreatePlaylist(playlistId, uid, playlist);
		const newPlaylistIds = playlistId
			? userDoc.playlistIds
			: Array.from(new Set([...(userDoc.playlistIds ?? []), newPlaylistId]));

		if (!playlistId) {
			await db.collection(collectionNameGet(collection.USERS)).doc(uid).update({
				playlistIds: newPlaylistIds,
				playlistId: newPlaylistId,
			});
		}

		return {
			actionResultType: actionResultType.SUCCESS,
			playlistId: newPlaylistId,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save playlist");
	}
};
