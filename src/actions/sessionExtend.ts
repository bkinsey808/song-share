"use server";

import { cookies } from "next/headers";

import { sessionCookieGet } from "./sessionCookieGet";
import { userPublicDocGet } from "./userPublicDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { sessionTokenEncode } from "@/features/auth/sessionTokenEncode";
import { sessionWarningTimestampGet } from "@/features/auth/sessionWarningTimestampGet";
import { SessionCookieData } from "@/features/auth/types";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { jsDateTimeZone2iso } from "@/features/time-zone/jsDateTimeZone2iso";

export const sessionExtend = async () => {
	try {
		const cookieResult = await sessionCookieGet();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const sessionCookieData = cookieResult.sessionCookieData;

		const userPublicGetResult = await userPublicDocGet();
		if (userPublicGetResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Public user not found");
		}
		const { userPublicDoc } = userPublicGetResult;
		const { usersActive = {} } = userPublicDoc;
		const { uid } = sessionCookieData;
		usersActive[uid] = jsDateTimeZone2iso(new Date(), "UTC") ?? "";
		userPublicDoc.usersActive = usersActive;

		await db
			.collection(collectionNameGet(collection.USERS_PUBLIC))
			.doc(uid)
			.update({
				usersActive,
			});

		const sessionWarningTimestamp = sessionWarningTimestampGet();

		// Extend the session
		const newSessionCookieData: SessionCookieData = {
			...sessionCookieData,
			sessionWarningTimestamp,
		};

		const sessionToken = await sessionTokenEncode(sessionCookieData);

		(await cookies()).set(
			SESSION_COOKIE_NAME,
			sessionToken,
			sessionCookieOptions,
		);

		return {
			actionResultType: actionResultType.SUCCESS,
			sessionCookieData: newSessionCookieData,
			userPublicDoc,
		};
	} catch (error) {
		return actionErrorMessageGet("Error getting session");
	}
};
