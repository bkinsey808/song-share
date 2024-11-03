import { doc, onSnapshot } from "firebase/firestore";
import { safeParse } from "valibot";

import { Get, Set } from "@/features/app-store/types";
import { Collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseClient";
import {
	UserDocSchema,
	UserPublicDocSchema,
} from "@/features/firebase/schemas";

export const userSubscribe = (get: Get, set: Set) => (uid: string) => {
	const userUnsubscribeFn = onSnapshot(
		doc(db, Collection.USERS, uid),
		(userSnapshot) => {
			if (!userSnapshot.exists) {
				console.warn(`User ${uid} does not exist`);
				return;
			}
			const userData = userSnapshot.data();
			if (!userData) {
				console.warn(`No data found for user ${uid}`);
				return;
			}
			const userParseResult = safeParse(UserDocSchema, userData);
			if (!userParseResult.success) {
				console.warn(`Invalid data for user ${uid}`);
				return;
			}
			const {
				songIds,
				playlistIds,
				songId,
				playlistId,
				email,
				roles,
				timeZone,
				userIds,
			} = userParseResult.output;
			const { sessionCookieData, settingsForm } = get();
			if (!sessionCookieData) {
				console.warn("No session cookie data found");
				return;
			}
			const newSessionCookieData = { ...sessionCookieData, email, roles };
			set({
				songIds,
				playlistIds: playlistIds ?? [],
				songId,
				playlistId: playlistId ?? null,
				sessionCookieData: newSessionCookieData,
				timeZone: timeZone ?? null,
				userIds: userIds ?? [],
			});
			settingsForm?.reset({
				timeZone: timeZone ?? undefined,
				useSystemTimeZone: !timeZone,
			});
		},
	);

	const userPublicUnsubscribeFn = onSnapshot(
		doc(db, Collection.USERS_PUBLIC, uid),
		(userPublicSnapshot) => {
			if (!userPublicSnapshot.exists) {
				console.warn(`User public ${uid} does not exist`);
				return;
			}
			const userPublicData = userPublicSnapshot.data();
			if (!userPublicData) {
				console.warn(`No data found for user public ${uid}`);
				return;
			}
			const userPublicParseResult = safeParse(
				UserPublicDocSchema,
				userPublicData,
			);
			if (!userPublicParseResult.success) {
				console.warn(`Invalid data for user public ${uid}`);
				return;
			}
			const { picture, songActiveId, playlistActiveId, username, usersActive } =
				userPublicParseResult.output;
			const { sessionCookieData } = get();
			if (!sessionCookieData) {
				console.warn("No session cookie data found");
				return;
			}
			const newSessionCookieData = {
				...sessionCookieData,
				picture,
				username,
			};
			set({
				songActiveId,
				playlistActiveId: playlistActiveId ?? null,
				sessionCookieData: newSessionCookieData,
				usersActive: usersActive ?? {},
			});
		},
	);

	set({ userUnsubscribeFn, userPublicUnsubscribeFn });
};
