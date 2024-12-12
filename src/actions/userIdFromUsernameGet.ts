"use server";

import { actionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export const userIdFromUsernameGet = async (username: string) => {
	try {
		// get the username from the userNames collection
		const usernamesDoc = await db
			.collection(collectionNameGet(collection.USER_NAMES))
			.doc(username)
			.get();
		if (!usernamesDoc.exists) {
			return actionErrorMessageGet("Username not found");
		}
		const userNamesData = usernamesDoc.data();
		if (!userNamesData) {
			return actionErrorMessageGet("Username data invalid");
		}

		const userId = userNamesData.uid;
		if (!userId) {
			return actionErrorMessageGet("User ID not found");
		}

		return {
			actionResultType: actionResultType.SUCCESS,
			userId,
		};
	} catch (error) {
		return actionErrorMessageGet(String(error));
	}
};
