"use server";

import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

import { extendSession } from "./extendSession";
import { getSong } from "./getSong";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
import { serverParse } from "@/features/global/serverParse";

export const songDelete = async (songId: string) => {
	try {
		if (!songId) {
			return getActionErrorMessage("Song ID is required");
		}

		const extendSessionResult = await extendSession();

		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Session expired");
		}

		const sessionCookieData = extendSessionResult.sessionCookieData;

		if (!sessionCookieData) {
			return getActionErrorMessage("Session expired");
		}

		const username = sessionCookieData.username;

		if (!username) {
			return getActionErrorMessage("Username not found");
		}

		const userDocRef = doc(db, "users", sessionCookieData.email);
		const userDoc = await getDoc(userDocRef);
		if (!userDoc.exists()) {
			return getActionErrorMessage("User not found");
		}

		const userDocData = userDoc.data();
		if (!userDocData) {
			return getActionErrorMessage("User data not found");
		}

		const userDocResult = serverParse(UserDocSchema, userDocData);
		if (!userDocResult.success) {
			return getActionErrorMessage("User data is invalid");
		}

		const userDocSongs = userDocResult.output.songs;

		// first, confirm user owns the song
		if (!userDocSongs[songId]) {
			return getActionErrorMessage("User does not own this song");
		}

		const songResult = await getSong(songId);
		if (songResult.actionResultType === actionResultType.ERROR) {
			return songResult;
		}
		const { song, songDocRef } = songResult;

		if (song.sharer !== username) {
			return getActionErrorMessage("User does not own this song");
		}

		// delete the song form the songs collection
		await deleteDoc(songDocRef);

		delete userDocSongs[songId];

		// update user doc songs with the deleted song removed
		await updateDoc(userDocRef, {
			songs: userDocSongs,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
		};
	} catch (error) {
		console.error({ error });
		return getActionErrorMessage("Failed to delete song");
	}
};
