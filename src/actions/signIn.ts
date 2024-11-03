"use server";

import { cookies } from "next/headers";

import { userActiveSet } from "./userActiveSet";
import { userDocGet } from "./userDocGet";
import { userPublicDocGet } from "./userPublicDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { signInResultType } from "@/features/auth/consts";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { sessionTokenEncode } from "@/features/auth/sessionTokenEncode";
import { sessionWarningTimestampGet } from "@/features/auth/sessionWarningTimestampGet";
import { SessionCookieData } from "@/features/auth/types";

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export const signIn = async ({
	uid,
	fuid,
}: {
	uid: string;
	fuid: string | null;
}) => {
	try {
		const existingUserDocResult = await userDocGet(uid);
		if (existingUserDocResult.actionResultType === actionResultType.ERROR) {
			return {
				signInResultType: signInResultType.NEW,
			};
		}
		const existingUserDoc = existingUserDocResult.userDoc;

		const existingUserPublicResult = await userPublicDocGet(uid);
		if (existingUserPublicResult.actionResultType === actionResultType.ERROR) {
			return {
				signInResultType: signInResultType.ERROR,
				message: "UserPublicDoc data is invalid",
			};
		}
		const existingUserPublicDoc = existingUserPublicResult.userPublicDoc;

		const sessionCookieData: SessionCookieData = {
			uid,
			...existingUserDoc,
			...existingUserPublicDoc,
			picture: existingUserPublicDoc.picture ?? null,
			sessionWarningTimestamp: sessionWarningTimestampGet(),
		};

		const sessionToken = await sessionTokenEncode(sessionCookieData);

		(await cookies()).set(
			SESSION_COOKIE_NAME,
			sessionToken,
			sessionCookieOptions,
		);

		if (fuid) {
			await userActiveSet({
				uid,
				fuid,
			});
		}

		const { songId, playlistId, songIds, playlistIds, timeZone } =
			existingUserDoc;
		const { songActiveId, playlistActiveId } = existingUserPublicDoc;

		return {
			signInResultType: signInResultType.EXISTING,
			userData: sessionCookieData,
			songIds,
			playlistIds,
			songId,
			playlistId,
			songActiveId,
			playlistActiveId,
			timeZone,
		};
	} catch (error) {
		console.error({ error });

		return {
			signInResultType: signInResultType.ERROR,
			message: "Failed to sign in",
		};
	}
};
