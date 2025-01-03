import { doc, onSnapshot } from "firebase/firestore";
import { safeParse } from "valibot";

import { collectionNameGet } from "../firebase/collectionNameGet";
import { useFirestoreClient } from "../firebase/useFirebaseClient";
import { getKeys } from "../global/getKeys";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { collection } from "@/features/firebase/consts";
import {
	UserDocSchema,
	UserPublicDocSchema,
} from "@/features/firebase/schemas";

type UserSubscribe = (
	get: AppSliceGet,
	set: AppSliceSet,
) => ({
	uid,
	db,
	clearDb,
}: {
	uid: string;
	db: ReturnType<ReturnType<typeof useFirestoreClient>["getDb"]>;
	clearDb: ReturnType<typeof useFirestoreClient>["clearDb"];
}) => void;

export const userSubscribe: UserSubscribe =
	(get, set) =>
	({ uid, db, clearDb }) => {
		if (!db) {
			return;
		}
		const userUnsubscribeFn = onSnapshot(
			doc(db, collectionNameGet(collection.USERS), uid),
			// eslint-disable-next-line complexity
			(userSnapshot) => {
				if (userSnapshot.metadata.fromCache) {
					clearDb();
					return;
				}

				if (!userSnapshot.exists) {
					console.warn(`User ${uid} does not exist`);
					return;
				}
				const userData = userSnapshot.data();
				if (!userData) {
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
			(error) => {
				console.log("got error");
				console.error(error);
			},
		);

		const userPublicUnsubscribeFn = onSnapshot(
			doc(db, collectionNameGet(collection.USERS_PUBLIC), uid),
			// eslint-disable-next-line complexity
			(userPublicSnapshot) => {
				if (!userPublicSnapshot.exists) {
					console.warn(`User public ${uid} does not exist`);
					return;
				}
				const userPublicData = userPublicSnapshot.data();
				if (!userPublicData) {
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
