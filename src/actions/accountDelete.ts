"use server";

import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { cookies } from "next/headers";

import { sessionCookieGet } from "./sessionCookieGet";
import { actionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { getKeys } from "@/features/global/getKeys";
import { serverParse } from "@/features/global/serverParse";

export const accountDelete = async () => {
	try {
		const cookieResult = await sessionCookieGet();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const sessionCookieData = cookieResult.sessionCookieData;

		const { username, email } = sessionCookieData;

		const userDocumentSnapshot = await getDoc(doc(db, "users", email));
		const userDocumentData = userDocumentSnapshot.data();

		if (!userDocumentData) {
			return actionErrorMessageGet("User does not exist");
		}

		const userDoc = serverParse(UserDocSchema, userDocumentData);

		if (!userDoc.success) {
			return actionErrorMessageGet("UserDoc data is missing or invalid");
		}

		const songs = userDoc.output.songs;
		const songIds = getKeys(songs);
		const deleteSongPromises = songIds.map((songId) =>
			deleteDoc(doc(db, "songs", songId)),
		);
		const songsDeleteResult = await Promise.allSettled(deleteSongPromises);

		// check to see if any of the song deletes failed
		const failedSongDeletes = songsDeleteResult.filter(
			(result) => result.status === "rejected",
		);
		if (failedSongDeletes.length > 0) {
			return actionErrorMessageGet("Failed to delete songs");
		}

		const songSets = userDoc.output.songSets;
		const songSetIds = getKeys(songSets);
		const deleteSongSetPromises = songSetIds.map((songSetId) =>
			deleteDoc(doc(db, "songSets", songSetId)),
		);
		const songSetsDeleteResult = await Promise.allSettled(
			deleteSongSetPromises,
		);

		// check to see if any of the song deletes failed
		const failedSongSetsDeletes = songSetsDeleteResult.filter(
			(result) => result.status === "rejected",
		);
		if (failedSongSetsDeletes.length > 0) {
			return actionErrorMessageGet("Failed to delete song sets");
		}

		if (username === null) {
			return actionErrorMessageGet("Username is not defined");
		}

		await deleteDoc(doc(db, "users", email));
		await deleteDoc(doc(db, "usernames", username));

		cookies().delete(SESSION_COOKIE_NAME);

		return { actionResultType: actionResultType.SUCCESS };
	} catch (error) {
		console.error({ error });
		return actionErrorMessageGet("Error deleting account");
	}
};
