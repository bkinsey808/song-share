"use server";

import { doc, updateDoc } from "firebase/firestore";

import { sessionExtend } from "./sessionExtend";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

export const songActiveSet = async (songId: string | null) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;
		const { uid } = sessionCookieData;

		const userDocRef = doc(db, "users", uid);
		await updateDoc(userDocRef, { activeSongId: songId });

		return { actionResultType: actionResultType.SUCCESS };
	} catch (error) {
		return actionErrorMessageGet("Error setting active song");
	}
};
