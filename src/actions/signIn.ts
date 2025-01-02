"use server";

import { cookies } from "next/headers";

import { userActiveSet } from "./userActiveSet";
import { userDocGet } from "./userDocGet";
import { userPublicDocGet } from "./userPublicDocGet";
import { ActionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { SignInResultType } from "@/features/auth/consts";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { sessionTokenEncode } from "@/features/auth/sessionTokenEncode";
import { sessionWarningTimestampGet } from "@/features/auth/sessionWarningTimestampGet";
import { SessionCookieData } from "@/features/auth/types";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { SongRequests } from "@/features/sections/song-requests/types";

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

type SignIn = ({
	uid,
	fuid,
	songIds,
	playlistIds,
	userIds,
}: {
	uid: string;
	fuid: string | null;
	songIds: string[];
	playlistIds: string[];
	userIds: string[];
}) => Promise<
	| {
			signInResultType: "EXISTING";
			userData: SessionCookieData;
			songIds: string[];
			playlistIds: string[];
			userIds: string[];
			songId: string | null;
			playlistId: string | null;
			songActiveId: string | null;
			playlistActiveId: string | null;
			timeZone: string | null;
			songRequests: SongRequests;
			usersActive: Record<string, string>;
			fullScreenActive: boolean;
	  }
	| {
			signInResultType: "NEW";
	  }
	| {
			signInResultType: "ERROR";
			message: string;
	  }
>;

export const signIn: SignIn = async ({
	uid,
	fuid,
	songIds = [],
	playlistIds = [],
	userIds = [],
}) => {
	try {
		const existingUserDocResult = await userDocGet(uid);
		if (existingUserDocResult.actionResultType === ActionResultType.ERROR) {
			return {
				signInResultType: SignInResultType.NEW,
			};
		}
		const existingUserDoc = existingUserDocResult.userDoc;

		const existingUserPublicResult = await userPublicDocGet(uid);
		if (existingUserPublicResult.actionResultType === ActionResultType.ERROR) {
			return {
				signInResultType: SignInResultType.ERROR,
				message: "UserPublicDoc data is invalid",
			};
		}
		const existingUserPublicDoc = existingUserPublicResult.userPublicDoc;

		const sessionCookieData: SessionCookieData = {
			uid,
			email: existingUserDoc.email,
			roles: existingUserDoc.roles,
			username: existingUserPublicDoc.username ?? null,
			picture: existingUserPublicDoc.picture ?? null,
			sessionWarningTimestamp: sessionWarningTimestampGet(),
		};

		const sessionToken = await sessionTokenEncode(sessionCookieData);

		(await cookies()).set(
			SESSION_COOKIE_NAME,
			sessionToken,
			sessionCookieOptions,
		);

		const { usersActive } = await userActiveSet({
			uid,
			fuid,
		});

		const newSongIds = Array.from(
			new Set([...songIds, ...existingUserDoc.songIds]),
		);
		const newPlaylistIds = Array.from(
			new Set([...playlistIds, ...(existingUserDoc.playlistIds ?? [])]),
		);
		const newUserIds = Array.from(
			new Set([...userIds, ...(existingUserDoc.userIds ?? [])]),
		);

		// write newSongIds, newPlaylistIds, newUserIds to the database
		await db.collection(collectionNameGet(collection.USERS)).doc(uid).update({
			songIds: newSongIds,
			playlistIds: newPlaylistIds,
			userIds: newUserIds,
		});

		const { songId, playlistId, timeZone } = existingUserDoc;
		const { songActiveId, playlistActiveId, songRequests } =
			existingUserPublicDoc;

		return {
			signInResultType: SignInResultType.EXISTING,
			userData: sessionCookieData,
			songIds: newSongIds,
			playlistIds: newPlaylistIds,
			userIds: newUserIds,
			songId,
			playlistId: playlistId ?? null,
			songActiveId,
			playlistActiveId: playlistActiveId ?? null,
			timeZone: timeZone ?? null,
			songRequests,
			usersActive,
			fullScreenActive: existingUserDoc.fullScreenActive ?? false,
		};
	} catch (error) {
		console.error({ error });

		return {
			signInResultType: SignInResultType.ERROR,
			message: "Failed to sign in",
		};
	}
};
