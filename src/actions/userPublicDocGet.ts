"use server";

import { sessionCookieGet } from "./sessionCookieGet";
import { actionResultType } from "@/features/app-store/consts";
import { Collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { UserPublicDocSchema } from "@/features/firebase/schemas";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export const userPublicDocGet = async (uid?: string) => {
	try {
		if (!uid) {
			const cookieResult = await sessionCookieGet();

			if (cookieResult.actionResultType === actionResultType.ERROR) {
				return actionErrorMessageGet("Session expired");
			}

			const sessionCookieData = cookieResult.sessionCookieData;
			uid = sessionCookieData.uid;
		}

		const userPublicDocSnapshot = await db
			.collection(Collection.USERS_PUBLIC)
			.doc(uid)
			.get();
		if (!userPublicDocSnapshot.exists) {
			return actionErrorMessageGet("Public User not found");
		}
		const userPublicDocData = userPublicDocSnapshot.data();

		if (!userPublicDocData) {
			return actionErrorMessageGet("Public User data not found");
		}

		const userPublicDocResult = serverParse(
			UserPublicDocSchema,
			userPublicDocData,
		);
		if (!userPublicDocResult.success) {
			return actionErrorMessageGet("Public User data invalid");
		}

		const userPublicDoc = userPublicDocResult.output;

		return {
			actionResultType: actionResultType.SUCCESS,
			userPublicDoc,
		};
	} catch (error) {
		return actionErrorMessageGet("Error getting user public doc");
	}
};
