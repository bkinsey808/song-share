import { doc, onSnapshot } from "firebase/firestore";
import { safeParse } from "valibot";

import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { UserPublicDocSchema } from "@/features/firebase/schemas";
import { useFirestoreClient } from "@/features/firebase/useFirebaseClient";
import { getKeys } from "@/features/global/getKeys";

export const userLibrarySubscribe =
	(get: AppSliceGet, set: AppSliceSet) =>
	({
		db,
		clearDb,
	}: {
		db: ReturnType<ReturnType<typeof useFirestoreClient>["getDb"]>;
		clearDb: ReturnType<typeof useFirestoreClient>["clearDb"];
	}) => {
		if (!db) {
			return;
		}
		const { userIds, userLibrary, userLibraryUnsubscribeFns } = get();
		const currentlySubscribedUserIds = getKeys(userLibraryUnsubscribeFns);

		const newSubscriptionUserIds = userIds.filter(
			(userId) => !currentlySubscribedUserIds.includes(userId),
		);

		const userIdsToUnsubscribe = currentlySubscribedUserIds.filter(
			(unsubscribeUserId) => !userIds.includes(unsubscribeUserId),
		);

		userIdsToUnsubscribe.forEach((unsubscribeUserId) => {
			const unsubscribeFn = userLibraryUnsubscribeFns[unsubscribeUserId];
			unsubscribeFn();
			delete userLibraryUnsubscribeFns[unsubscribeUserId];
		});

		newSubscriptionUserIds.forEach((subscribeUserId) => {
			const unsubscribeFn = onSnapshot(
				doc(db, collectionNameGet(collection.USERS_PUBLIC), subscribeUserId),
				(userPublicSnapshot) => {
					if (userPublicSnapshot.metadata.fromCache) {
						clearDb();
						return;
					}

					if (!userPublicSnapshot.exists) {
						console.warn(`User ${subscribeUserId} does not exist`);
						return;
					}
					const userPublicData = userPublicSnapshot.data();
					if (!userPublicData) {
						console.warn(`No data found for user ${subscribeUserId}`);
						return;
					}
					const userPublicParseResult = safeParse(
						UserPublicDocSchema,
						userPublicData,
					);
					if (!userPublicParseResult.success) {
						console.warn(`Invalid data for user ${subscribeUserId}`);
						return;
					}
					const userPublicDoc = userPublicParseResult.output;
					const { userSet, usersActiveSet } = get();
					const dbUsersActive = userPublicDoc.usersActive ?? {};
					const newUsersActive = dbUsersActive;

					userSet({
						userId: subscribeUserId,
						userPublicDoc,
					});
					usersActiveSet(newUsersActive);
				},
			);
			userLibraryUnsubscribeFns[subscribeUserId] = unsubscribeFn;
		});

		set({
			userLibrary,
			userLibraryUnsubscribeFns,
		});
	};
