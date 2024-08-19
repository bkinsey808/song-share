"use server";

import { doc, updateDoc } from "firebase/firestore";

import { sessionExtend } from "./sessionExtend";
import { actionResultType } from "@/features/app-store/consts";
import { dbServer } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

export const songSetActiveSet = async (songSetId: string | null) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;
		const { email } = sessionCookieData;
		if (!email) {
			return actionErrorMessageGet("Email not found");
		}

		const userDocRef = doc(dbServer, "users", email);
		await updateDoc(userDocRef, { activeSongSetId: songSetId });

		return { actionResultType: actionResultType.SUCCESS };
	} catch (error) {
		return actionErrorMessageGet("Error setting active song set");
	}
};
