"use server";

import { cookies } from "next/headers";

import { sessionCookieGet } from "./sessionCookieGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const accountDelete = async () => {
	try {
		const cookieResult = await sessionCookieGet();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const sessionCookieData = cookieResult.sessionCookieData;
		const { uid, username } = sessionCookieData;
		if (!username) {
			return actionErrorMessageGet("Username is not defined");
		}

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Error getting user doc");
		}
		const { userDoc } = userDocResult;

		const songIds = userDoc.songIds;
		const deleteSongPromises = songIds.map((songId) =>
			db.collection(collection.SONGS).doc(songId).delete(),
		);
		const promiseSongsAllSettledResult =
			await Promise.allSettled(deleteSongPromises);

		// check to see if any of the song deletes failed
		const failedSongDeletes = promiseSongsAllSettledResult.filter(
			(result) => result.status === "rejected",
		);
		if (failedSongDeletes.length > 0) {
			return actionErrorMessageGet("Failed to delete songs");
		}

		const songSetIds = userDoc.songSetIds;
		const deleteSongSetPromises = songSetIds.map((songSetId) =>
			db.collection(collection.SONG_SETS).doc(songSetId).delete(),
		);
		const promiseSongSetsAllSettledResult = await Promise.allSettled(
			deleteSongSetPromises,
		);

		// check to see if any of the song deletes failed
		const failedSongSetsDeletes = promiseSongSetsAllSettledResult.filter(
			(result) => result.status === "rejected",
		);
		if (failedSongSetsDeletes.length > 0) {
			return actionErrorMessageGet("Failed to delete song sets");
		}

		await db.collection(collection.USERS).doc(uid).delete();
		await db.collection(collection.PUBLIC_USERS).doc(uid).delete();
		await db.collection(collection.USER_NAMES).doc(username).delete();

		cookies().delete(SESSION_COOKIE_NAME);

		return { actionResultType: actionResultType.SUCCESS };
	} catch (error) {
		console.error({ error });
		return actionErrorMessageGet("Error deleting account");
	}
};
