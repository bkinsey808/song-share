"use server";

import { sessionCookieGet } from "./sessionCookieGet";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { UserPublicDocSchema } from "@/features/firebase/schemas";
import { UserPublicDoc } from "@/features/firebase/types";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export const userPublicDocGet = async (
	uid?: string,
): Promise<
	| { actionResultType: "SUCCESS"; userPublicDoc: UserPublicDoc }
	| { actionResultType: "ERROR"; message: string }
> => {
	try {
		if (!uid) {
			const cookieResult = await sessionCookieGet();

			if (cookieResult.actionResultType === ActionResultType.ERROR) {
				return actionErrorMessageGet("Session expired");
			}

			const sessionCookieData = cookieResult.sessionCookieData;
			uid = sessionCookieData.uid;
		}

		const userPublicDocSnapshot = await db
			.collection(collectionNameGet(collection.USERS_PUBLIC))
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
			actionResultType: ActionResultType.SUCCESS,
			userPublicDoc,
		};
	} catch (error) {
		return actionErrorMessageGet("Error getting user public doc");
	}
};
