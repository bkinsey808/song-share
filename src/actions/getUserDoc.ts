"use server";

import { doc, getDoc } from "firebase/firestore";

import { getSessionCookieData } from "./getSessionCookieData";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
import { serverParse } from "@/features/global/serverParse";

export const getUserDoc = async () => {
	try {
		const cookieResult = await getSessionCookieData();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Session expired");
		}

		const sessionCookieData = cookieResult.sessionCookieData;
		const email = sessionCookieData.email;

		const userDocRef = doc(db, "users", email);
		const userDocSnapshot = await getDoc(userDocRef);
		if (!userDocSnapshot.exists()) {
			return getActionErrorMessage(`User not found: ${email}`);
		}

		const userDocData = userDocSnapshot.data();
		if (!userDocData) {
			return getActionErrorMessage("User data not found");
		}

		const userDocResult = serverParse(UserDocSchema, userDocData);
		if (!userDocResult.success) {
			return getActionErrorMessage("User data invalid");
		}

		const userDoc = userDocResult.output;

		return { actionResultType: actionResultType.SUCCESS, userDoc, userDocRef };
	} catch (error) {
		return getActionErrorMessage("Error getting user doc");
	}
};
