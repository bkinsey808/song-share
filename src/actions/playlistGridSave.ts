"use server";

import { flatten } from "valibot";

import { playlistGet } from "./playlistGet";
import { sessionExtend } from "./sessionExtend";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { getFormError } from "@/features/form/getFormError";
import { serverParse } from "@/features/global/serverParse";
import {
	PlaylistGridFormSchema,
	PlaylistSchema,
} from "@/features/sections/playlist/schemas";
import type { PlaylistGridForm } from "@/features/sections/playlist/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const playlistGridSave = async ({
	playlistGridFormValues,
	playlistId,
}: {
	playlistGridFormValues: PlaylistGridForm;
	playlistId: string | null;
}): Promise<
	| {
			actionResultType: "SUCCESS";
	  }
	| {
			actionResultType: "ERROR";
			formError?: string;
			fieldErrors?: ReturnType<typeof flatten>["nested"];
	  }
> => {
	try {
		if (!playlistId) {
			return getFormError("No playlist ID");
		}

		const result = serverParse(PlaylistGridFormSchema, playlistGridFormValues);
		if (!result.success) {
			return {
				actionResultType: ActionResultType.ERROR,
				fieldErrors: flatten<typeof PlaylistSchema>(result.issues).nested,
			};
		}

		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === ActionResultType.ERROR) {
			return getFormError("Session expired");
		}
		const { sessionCookieData } = extendSessionResult;
		const { uid } = sessionCookieData;

		const playlistResult = await playlistGet(playlistId);
		if (playlistResult.actionResultType === ActionResultType.ERROR) {
			return getFormError("Playlist not found");
		}
		if (
			!!playlistResult.playlist.sharer &&
			playlistResult.playlist.sharer !== uid
		) {
			return getFormError("User does not own this playlist");
		}

		await db
			.collection(collectionNameGet(collection.PLAYLISTS))
			.doc(playlistId)
			.update(playlistGridFormValues);

		return {
			actionResultType: ActionResultType.SUCCESS,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save playlist");
	}
};
