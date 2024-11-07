import { doc, onSnapshot } from "firebase/firestore";
import { safeParse } from "valibot";

import { getKeys } from "../global/getKeys";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { Collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseClient";
import {
	UserDocSchema,
	UserPublicDocSchema,
} from "@/features/firebase/schemas";

export const userSubscribe =
	(get: AppSliceGet, set: AppSliceSet) => (uid: string) => {
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
				} = userParseResult.output;
				const { sessionCookieData, settingsForm, fuid } = get();
				const localUserIds = get().userIds ?? [];
				const dbUserUserIds = userParseResult.output.userIds ?? [];
				const newUserIds = fuid
					? localUserIds
					: Array.from(new Set([...localUserIds, ...dbUserUserIds]));
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
					userIds: newUserIds,
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
				const {
					picture,
					songActiveId,
					playlistActiveId,
					username,
					usersActive,
					songRequests,
				} = userPublicParseResult.output;
				const { sessionCookieData, fuid } = get();
				const localUserIds = get().userIds ?? [];
				const dbUserUserIds = getKeys(
					userPublicParseResult.output.usersActive ?? {},
				);
				const newUserIds = fuid
					? Array.from(new Set([...localUserIds, ...dbUserUserIds]))
					: localUserIds;

				const localUsersActive = get().usersActive ?? {};
				const dbUsersActive = userPublicParseResult.output.usersActive ?? {};
				const newUsersActive = {
					...localUsersActive,
					...dbUsersActive,
				};

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
					usersActive: newUsersActive,
					songRequests: songRequests ?? {},
					userIds: newUserIds,
				});
			},
		);

		set({ userUnsubscribeFn, userPublicUnsubscribeFn });
	};
