"use server";

import { flatten } from "valibot";

import { playlistGet } from "./playlistGet";
import { sessionExtend } from "./sessionExtend";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { serverParse } from "@/features/global/serverParse";
import {
	PlaylistGridFormSchema,
	PlaylistSchema,
} from "@/features/sections/playlist/schemas";
import type { PlaylistGridForm } from "@/features/sections/playlist/types";

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

export const playlistGridSave = async ({
	playlistGridFormValues,
	playlistId,
}: {
	playlistGridFormValues: PlaylistGridForm;
	playlistId: string | null;
}) => {
	try {
		if (!playlistId) {
			return getFormError("No playlist ID");
		}

		const result = serverParse(PlaylistGridFormSchema, playlistGridFormValues);
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

		await db
			.collection(collection.PLAYLISTS)
			.doc(playlistId)
			.update(playlistGridFormValues);

		return {
			actionResultType: actionResultType.SUCCESS,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save playlist");
	}
};
