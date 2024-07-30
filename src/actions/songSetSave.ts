"use server";

import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { flatten, safeParse } from "valibot";

import { extendSession } from "./extendSession";
import { ActionResultType } from "@/features/app-store/enums";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { UserDoc } from "@/features/firebase/types";
import { SongSetFieldKey } from "@/features/sections/song-set/enums";
import {
	SongSetLibrarySongSetSchema,
	SongSetSchema,
} from "@/features/sections/song-set/schemas";
import type { SlimSongSet, SongSet } from "@/features/sections/song-set/types";

const getFormError = (formError: string) => {
	console.error(formError);
	return {
		actionResultType: ActionResultType.ERROR as ActionResultType.ERROR,
		formError,
	};
};

export type SongSetSaveResult =
	| {
			actionResultType: ActionResultType.SUCCESS;
			songSetId: string;
	  }
	| {
			actionResultType: ActionResultType.ERROR;
			formError?: string;
			fieldErrors?:
				| {
						[fieldKey in SongSetFieldKey]?: string[];
				  }
				| undefined;
	  };

export const songSetSave = async ({
	songSet,
	songSetId,
}: {
	songSet: SongSet;
	songSetId: string | null;
}): Promise<SongSetSaveResult> => {
	try {
		const result = safeParse(SongSetSchema, songSet);
		if (!result.success) {
			return {
				actionResultType: ActionResultType.ERROR,
				fieldErrors: flatten<typeof SongSetSchema>(result.issues).nested,
			};
		}

		const sessionCookieData = await extendSession();
		if (!sessionCookieData) {
			return getFormError("Session expired");
		}

		const username = sessionCookieData.username;

		if (!username) {
			return getFormError("Username not found");
		}

		const userDocRef = doc(db, "users", sessionCookieData.email);
		const userDoc = await getDoc(userDocRef);
		if (!userDoc.exists()) {
			return getFormError("User not found");
		}

		const userDocData = userDoc.data();
		if (!userDocData) {
			return getFormError("User data not found");
		}

		const userDocResult = safeParse(UserDocSchema, userDocData);
		if (!userDocResult.success) {
			return getFormError("User data is invalid");
		}

		const slimSongSet: SlimSongSet = {
			songSetName: songSet.songSetName,
			sharer: username,
		};

		const userDocSongSets = userDocResult.output.songSets;

		// first, confirm user owns the songSet
		if (songSetId && !userDocSongSets[songSetId]) {
			return getFormError("User does not own this songSet");
		}

		// second update the songSet in the songSets collection, or create it if it doesn't exist
		const songSetsCollection = collection(db, "songSets");
		const songSetDocRef = songSetId
			? doc(songSetsCollection, songSetId)
			: doc(songSetsCollection);

		const songSetSnapshot = await getDoc(songSetDocRef);
		const songSetData = songSetSnapshot.data();
		if (!songSetData && songSetId) {
			return getFormError("SongSet data not found");
		}

		if (songSetData) {
			const songSetResult = safeParse(SongSetLibrarySongSetSchema, songSetData);
			if (!songSetResult.success) {
				console.log(songSetData);
				return getFormError("SongSet data is invalid");
			}

			const songSetLibrarySongSet = songSetResult.output;
			if (songSetId && songSetLibrarySongSet.sharer !== username) {
				return getFormError("User does not own this songSet");
			}
		}

		await setDoc(songSetDocRef, {
			...songSet,
			sharer: username,
		});

		const newSongSetId = songSetDocRef.id;

		// third, update the slimSongSet in the userDoc
		const newSongSets: UserDoc["songSets"] = {
			...userDocSongSets,
			[songSetId ?? newSongSetId]: slimSongSet,
		};

		await setDoc(userDocRef, {
			...userDocResult.output,
			songSets: newSongSets,
		});

		return {
			actionResultType: ActionResultType.SUCCESS,
			songSetId: songSetId ?? newSongSetId,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save songSet");
	}
};
