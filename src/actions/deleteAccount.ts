"use server";

import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { safeParse } from "valibot";

import { getSessionCookieData } from "./getSessionCookieData";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { DeleteAccountResultType } from "@/features/auth/enums";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { getKeys } from "@/features/global/getKeys";

export type DeleteAccountResult =
	| { result: DeleteAccountResultType.SUCCESS }
	| { result: DeleteAccountResultType.ERROR; message: string };

export const deleteAccount = async (): Promise<DeleteAccountResult> => {
	try {
		const sessionCookieData = await getSessionCookieData();

		if (!sessionCookieData) {
			return {
				result: DeleteAccountResultType.ERROR,
				message: "Session cookie data is missing",
			};
		}

		const { username, email } = sessionCookieData;

		const userDocumentSnapshot = await getDoc(doc(db, "users", email));
		const userDocumentData = userDocumentSnapshot.data();

		if (!userDocumentData) {
			return {
				result: DeleteAccountResultType.ERROR,
				message: "User does not exist",
			};
		}

		const userDoc = safeParse(UserDocSchema, userDocumentData);

		if (!userDoc.success) {
			return {
				result: DeleteAccountResultType.ERROR,
				message: "UserDoc data is missing or invalid",
			};
		}

		const songs = userDoc.output.songs;
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
			return {
				result: DeleteAccountResultType.ERROR,
				message: "Failed to delete songs",
			};
		}

		if (username === null) {
			return {
				result: DeleteAccountResultType.ERROR,
				message: "Username is not defined",
			};
		}

		await deleteDoc(doc(db, "users", email));
		await deleteDoc(doc(db, "usernames", username));

		cookies().delete(SESSION_COOKIE_NAME);

		return { result: DeleteAccountResultType.SUCCESS };
	} catch (error) {
		console.error({ error });
		return {
			result: DeleteAccountResultType.ERROR,
			message: "Error deleting account",
		};
	}
};
