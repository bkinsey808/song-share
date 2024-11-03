import { doc, onSnapshot } from "firebase/firestore";
import { safeParse } from "valibot";

import { Get, Set } from "@/features/app-store/types";
import { Collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseClient";
import { UserPublicDocSchema } from "@/features/firebase/schemas";
import { getKeys } from "@/features/global/getKeys";

export const userLibrarySubscribe = (get: Get, set: Set) => () => {
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
			doc(db, Collection.USERS_PUBLIC, subscribeUserId),
			(userPublicSnapshot) => {
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
				const { userSet } = get();

				userSet({
					userId: subscribeUserId,
					userPublicDoc,
				});
			},
		);
		userLibraryUnsubscribeFns[subscribeUserId] = unsubscribeFn;
	});

	set({
		userLibrary,
		userLibraryUnsubscribeFns,
	});
};
