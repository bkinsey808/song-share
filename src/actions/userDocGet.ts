"use server";

import { sessionCookieGet } from "./sessionCookieGet";
import { actionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { UserDocSchema } from "@/features/firebase/schemas";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export const userDocGet = async (uid?: string) => {
	try {
		if (!uid) {
			const cookieResult = await sessionCookieGet();

			if (cookieResult.actionResultType === actionResultType.ERROR) {
				return actionErrorMessageGet("Session expired");
			}

			const sessionCookieData = cookieResult.sessionCookieData;
			uid = sessionCookieData.uid;
		}

		const userDocSnapshot = await db
			.collection(collectionNameGet(collection.USERS))
			.doc(uid)
			.get();
		if (!userDocSnapshot.exists) {
			return actionErrorMessageGet("User not found");
		}
		const userDocData = userDocSnapshot.data();

		if (!userDocData) {
			return actionErrorMessageGet("User data not found");
		}

		const userDocResult = serverParse(UserDocSchema, userDocData);
		if (!userDocResult.success) {
			return actionErrorMessageGet("User data invalid");
		}

		const userDoc = userDocResult.output;

		return { actionResultType: actionResultType.SUCCESS, userDoc };
	} catch (error) {
		return actionErrorMessageGet("Error getting user doc");
	}
};
