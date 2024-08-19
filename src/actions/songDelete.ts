"use server";

import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

import { sessionExtend } from "./sessionExtend";
import { songGet } from "./songGet";
import { actionResultType } from "@/features/app-store/consts";
import { dbServer } from "@/features/firebase/firebaseServer";
import { UserDocSchema } from "@/features/firebase/schemas";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";

export const songDelete = async (songId: string) => {
	try {
		if (!songId) {
			return actionErrorMessageGet("Song ID is required");
		}

		const extendSessionResult = await sessionExtend();

		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const sessionCookieData = extendSessionResult.sessionCookieData;

		if (!sessionCookieData) {
			return actionErrorMessageGet("Session expired");
		}

		const username = sessionCookieData.username;

		if (!username) {
			return actionErrorMessageGet("Username not found");
		}

		const userDocRef = doc(dbServer, "users", sessionCookieData.email);
		const userDoc = await getDoc(userDocRef);
		if (!userDoc.exists()) {
			return actionErrorMessageGet("User not found");
		}

		const userDocData = userDoc.data();
		if (!userDocData) {
			return actionErrorMessageGet("User data not found");
		}

		const userDocResult = serverParse(UserDocSchema, userDocData);
		if (!userDocResult.success) {
			return actionErrorMessageGet("User data is invalid");
		}

		const userDocSongs = userDocResult.output.songs;

		// first, confirm user owns the song
		if (!userDocSongs[songId]) {
			return actionErrorMessageGet("User does not own this song");
		}

		const songResult = await songGet(songId);
		if (songResult.actionResultType === actionResultType.ERROR) {
			return songResult;
		}
		const { song, songDocRef } = songResult;

		if (song.sharer !== username) {
			return actionErrorMessageGet("User does not own this song");
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
		return actionErrorMessageGet("Failed to delete song");
	}
};
