"use server";

import { doc } from "firebase/firestore";

import { sessionCookieGet } from "./sessionCookieGet";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebaseServer";
import { backUpFormFieldKey } from "@/features/sections/admin/consts";
import { BackUpForm } from "@/features/sections/admin/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const backUp = async ({ fromPrefix, toPrefix }: BackUpForm) => {
	try {
		if (!fromPrefix || !toPrefix) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: { root: ["Prefixes are required"] },
			};
		}
		if (toPrefix === fromPrefix) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: { root: ["Cannot overwrite same prefix"] },
			};
		}
		if (toPrefix === "production") {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: {
					[backUpFormFieldKey.TO_PREFIX]: ["Cannot overwrite production"],
				},
			};
		}

		const cookieResult = await sessionCookieGet();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: { root: ["Session expired"] },
			};
		}

		const collections = await db.listCollections();
		const collectionNames = collections
			.map((collection) => collection.id)
			.filter((collectionName) => collectionName.startsWith(`${fromPrefix}`));

		if (collectionNames.length === 0) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: {
					[backUpFormFieldKey.FROM_PREFIX]: [
						"No collections with from prefix found",
					],
				},
			};
		}

		console.log(collectionNames);

		const collectionPromises = collectionNames.map((collectionName) => {
			const collectionNameWithoutPrefix = collectionName.replace(
				`${fromPrefix}_`,
				"",
			);
			const fromCollection = collectionName;

			const toCollection = `${toPrefix}_${collectionNameWithoutPrefix}`;
			return db
				.collection(fromCollection)
				.get()
				.then((snapshot) => {
					console.log(toCollection);
					const promises = snapshot.docs.map((doc) => {
						const data = doc.data();
						return db.collection(toCollection).doc(doc.id).set(data);
					});
					return Promise.all(promises);
				});
		});
		const result = await Promise.allSettled(collectionPromises);
		const failedCollections = result.filter(
			(result) => result.status === "rejected",
		);
		if (failedCollections.length > 0) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: { root: ["Failed to backup collections"] },
			};
		}

		return { actionResultType: actionResultType.SUCCESS };
	} catch (error) {
		console.error(error);
		return {
			actionResultType: actionResultType.ERROR,
			fieldErrors: { root: ["Error backing up database"] },
		};
	}
};
