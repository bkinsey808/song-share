"use server";

import { doc, updateDoc } from "firebase/firestore";

import { extendSession } from "./extendSession";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";

export const setActiveSongSet = async (songSetId: string | null) => {
	try {
		const extendSessionResult = await extendSession();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;
		const { email } = sessionCookieData;
		if (!email) {
			return getActionErrorMessage("Email not found");
		}

		const userDocRef = doc(db, "users", email);
		await updateDoc(userDocRef, { activeSongSetId: songSetId });

		return { actionResultType: actionResultType.SUCCESS };
	} catch (error) {
		return getActionErrorMessage("Error setting active song set");
	}
};
