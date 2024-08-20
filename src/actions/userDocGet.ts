"use server";

import { doc, getDoc } from "firebase/firestore";

import { sessionCookieGet } from "./sessionCookieGet";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";

export const userDocGet = async () => {
	try {
		const cookieResult = await sessionCookieGet();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const sessionCookieData = cookieResult.sessionCookieData;
		const uid = sessionCookieData.uid;

		const userDocRef = doc(db, "users", uid);
		const userDocSnapshot = await getDoc(userDocRef);
		if (!userDocSnapshot.exists()) {
			return actionErrorMessageGet(`User not found: ${uid}`);
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

		return { actionResultType: actionResultType.SUCCESS, userDoc, userDocRef };
	} catch (error) {
		return actionErrorMessageGet("Error getting user doc");
	}
};
