"use server";

import { sessionCookieGet } from "./sessionCookieGet";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";
import { SongSchema } from "@/features/sections/song/schemas";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songGet = async (songId: string) => {
	try {
		const cookieResult = await sessionCookieGet();
		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const songDoc = await db.collection("songs").doc(songId).get();
		if (!songDoc.exists) {
			return actionErrorMessageGet("Song not found");
		}
		const songData = songDoc.data();

		const songParseResult = serverParse(SongSchema, songData);
		if (!songParseResult.success) {
			console.warn(songData);
			return actionErrorMessageGet("Song data invalid");
		}

		const song = songParseResult.output;

		return { actionResultType: actionResultType.SUCCESS, song };
	} catch (error) {
		return actionErrorMessageGet("Error getting song");
	}
};
