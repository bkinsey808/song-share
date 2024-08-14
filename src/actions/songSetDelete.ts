"use server";

import { deleteDoc, updateDoc } from "firebase/firestore";

import { extendSession } from "./extendSession";
import { getSongSet } from "./getSongSet";
import { getUserDoc } from "./getUserDoc";
import { actionResultType } from "@/features/app-store/consts";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";

export const songSetDelete = async (songSetId: string) => {
	try {
		if (!songSetId) {
			return getActionErrorMessage("Song set id is required");
		}

		const extendSessionResult = await extendSession();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;

		const username = sessionCookieData.username;

		if (!username) {
			return getActionErrorMessage("Username not found");
		}

		const userDocResult = await getUserDoc();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return userDocResult;
		}
		const { userDoc, userDocRef } = userDocResult;

		const userDocSongSets = userDoc.songSets;

		// first, confirm user owns the song
		if (!userDocSongSets[songSetId]) {
			return getActionErrorMessage("User does not own this song set");
		}

		const songSetResult = await getSongSet(songSetId);
		if (songSetResult.actionResultType === actionResultType.ERROR) {
			return songSetResult;
		}
		const { songSet, songSetDocRef } = songSetResult;

		if (songSet.sharer !== username) {
			return getActionErrorMessage("User does not own this song");
		}

		// delete the song set from the song sets collection
		await deleteDoc(songSetDocRef);

		delete userDocSongSets[songSetId];

		// update user doc songs with the deleted song removed
		await updateDoc(userDocRef, {
			songSets: userDocSongSets,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
		};
	} catch (error) {
		console.error({ error });
		return getActionErrorMessage("Failed to delete song set");
	}
};
