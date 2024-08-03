"use server";

import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { cookies } from "next/headers";

import { getSessionCookieData } from "./getSessionCookieData";
import { ActionResultType } from "@/features/app-store/enums";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
import { getKeys } from "@/features/global/getKeys";
import { serverParse } from "@/features/global/serverParse";

export const deleteAccount = async () => {
	try {
		const sessionCookieData = await getSessionCookieData();

		if (!sessionCookieData) {
			return getActionErrorMessage("Session cookie data is missing");
		}

		const { username, email } = sessionCookieData;

		const userDocumentSnapshot = await getDoc(doc(db, "users", email));
		const userDocumentData = userDocumentSnapshot.data();

		if (!userDocumentData) {
			return getActionErrorMessage("User does not exist");
		}

		const userDoc = serverParse(UserDocSchema, userDocumentData);

		if (!userDoc.success) {
			return getActionErrorMessage("UserDoc data is missing or invalid");
		}

		const songs = userDoc.output.songSets;
		const songIds = getKeys(songs);
		const deleteSongPromises = songIds.map((songId) =>
			deleteDoc(doc(db, "songs", songId)),
		);
		const songDeleteResult = await Promise.allSettled(deleteSongPromises);

		// check to see if any of the song deletes failed
		const failedDeletes = songDeleteResult.filter(
			(result) => result.status === "rejected",
		);
		if (failedDeletes.length > 0) {
			return getActionErrorMessage("Failed to delete songs");
		}

		if (username === null) {
			return getActionErrorMessage("Username is not defined");
		}

		await deleteDoc(doc(db, "users", email));
		await deleteDoc(doc(db, "usernames", username));

		cookies().delete(SESSION_COOKIE_NAME);

		return { actionResultType: ActionResultType.SUCCESS as const };
	} catch (error) {
		console.error({ error });
		return getActionErrorMessage("Error deleting account");
	}
};
