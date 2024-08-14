"use server";

import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { flatten } from "valibot";

import { extendSession } from "./extendSession";
import { getUserDoc } from "./getUserDoc";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { UserDoc } from "@/features/firebase/types";
import { serverParse } from "@/features/global/serverParse";
import { SongSetSchema } from "@/features/sections/song-set/schemas";
import type { SlimSongSet, SongSet } from "@/features/sections/song-set/types";

const getFormError = (formError: string) => {
	console.error(formError);
	return {
		actionResultType: actionResultType.ERROR,
		formError,
		fieldErrors: [],
	};
};

export const songSetSave = async ({
	songSet,
	songSetId,
}: {
	songSet: SongSet;
	songSetId: string | null;
}) => {
	console.log("songSetSave");
	try {
		const result = serverParse(SongSetSchema, songSet);
		if (!result.success) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: flatten<typeof SongSetSchema>(result.issues).nested,
			};
		}

		const extendSessionResult = await extendSession();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return getFormError("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;

		const username = sessionCookieData.username;
		if (!username) {
			return getFormError("Username not found");
		}

		const userDocResult = await getUserDoc();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return getFormError("Failed to get user doc");
		}
		const { userDoc, userDocRef } = userDocResult;

		const slimSongSet: SlimSongSet = {
			songSetName: songSet.songSetName,
			sharer: sessionCookieData.username,
		};

		const userDocSongSets = userDoc.songSets;

		// first, confirm user owns the songSet
		if (songSetId && !userDocSongSets[songSetId]) {
			return getFormError("User does not own this song set");
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
			const songSetResult = serverParse(SongSetSchema, songSetData);
			if (!songSetResult.success) {
				return getFormError("SongSet data is invalid");
			}

			const songSetLibrarySongSet = songSetResult.output;
			if (songSetId && songSetLibrarySongSet.sharer !== username) {
				return getFormError("User does not own this song set");
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

		await updateDoc(userDocRef, {
			songSetId,
			songSets: newSongSets,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			songSetId: songSetId ?? newSongSetId,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save songSet");
	}
};
