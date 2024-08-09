"use server";

import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { flatten } from "valibot";

import { extendSession } from "./extendSession";
import { ActionResultType } from "@/features/app-store/enums";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { UserDoc } from "@/features/firebase/types";
import { serverParse } from "@/features/global/serverParse";
import { SongSetSchema } from "@/features/sections/song-set/schemas";
import type { SlimSongSet, SongSet } from "@/features/sections/song-set/types";

const getFormError = (formError: string) => {
	console.error(formError);
	return {
		actionResultType: ActionResultType.ERROR as ActionResultType.ERROR,
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
	try {
		const result = serverParse(SongSetSchema, songSet);
		if (!result.success) {
			return {
				actionResultType: ActionResultType.ERROR as const,
				fieldErrors: flatten<typeof SongSetSchema>(result.issues).nested,
			};
		}

		const extendSessionResult = await extendSession();

		if (extendSessionResult.actionResultType === ActionResultType.ERROR) {
			return getFormError("Session expired");
		}

		const sessionCookieData = extendSessionResult.sessionCookieData;

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

		const userDocResult = serverParse(UserDocSchema, userDocData);
		if (!userDocResult.success) {
			console.log({
				userDocData,
				issues: userDocResult.issues,
				path: userDocResult.issues[0].path,
			});
			return getFormError("User data is invalid");
		}

		const slimSongSet: SlimSongSet = {
			songSetName: songSet.songSetName,
			sharer: sessionCookieData.username,
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
			const songSetResult = serverParse(SongSetSchema, songSetData);
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
