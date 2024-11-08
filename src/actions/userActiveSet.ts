"use server";

import { userPublicDocGet } from "./userPublicDocGet";
import { Collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import {
	UserDocSchema,
	UserPublicDocSchema,
} from "@/features/firebase/schemas";
import { serverParse } from "@/features/global/serverParse";
import { jsDateTimeZone2iso } from "@/features/time-zone/jsDateTimeZone2iso";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const userActiveSet = async ({
	uid,
	fuid,
}: {
	uid: string;
	fuid: string | null;
}) => {
	// get the fuid user doc
	const fuidUserDocSnapshot = await db
		.collection(Collection.USERS)
		.doc(fuid ?? uid)
		.get();
	if (!fuidUserDocSnapshot.exists) {
		throw new Error("fuidUserDocSnapshot does not exist");
	}
	const fuidUserDocData = fuidUserDocSnapshot.data();
	if (!fuidUserDocData) {
		throw new Error("Invalid fuidUserDocData");
	}
	const fuidUserDocDataParseResult = serverParse(
		UserDocSchema,
		fuidUserDocData,
	);
	if (!fuidUserDocDataParseResult.success) {
		throw new Error("Invalid fuidUserDocDataParsed");
	}
	const fuidUserDoc = fuidUserDocDataParseResult.output;

	if (fuidUserDoc.userIds) {
		if (!fuidUserDoc.userIds.includes(uid)) {
			fuidUserDoc.userIds.push(uid);
		}
	} else {
		fuidUserDoc.userIds = [uid];
	}
	await db
		.collection(Collection.USERS)
		.doc(fuid ?? uid)
		.update({
			userIds: fuidUserDoc.userIds,
		});

	// get the fuid user public doc
	const fuidUserPublicDocSnapshot = await db
		.collection(Collection.USERS_PUBLIC)
		.doc(fuid ?? uid)
		.get();
	if (!fuidUserPublicDocSnapshot.exists) {
		throw new Error("fuidUserPublicDocSnapshot does not exist");
	}
	const fuidUserPublicDocData = fuidUserPublicDocSnapshot.data();
	if (!fuidUserPublicDocData) {
		throw new Error("Invalid fuidUserPublicDocData");
	}
	const fuidUserPublicDocDataParseResult = serverParse(
		UserPublicDocSchema,
		fuidUserPublicDocData,
	);
	if (!fuidUserPublicDocDataParseResult.success) {
		throw new Error("Invalid fuidUserPublicDocDataParsed");
	}
	const fuidUserPublicDoc = fuidUserPublicDocDataParseResult.output;

	if (!fuidUserPublicDoc.usersActive) {
		fuidUserPublicDoc.usersActive = {};
	}
	fuidUserPublicDoc.usersActive[uid] =
		jsDateTimeZone2iso(new Date(), "UTC") ?? "";

	// update the fuid user public doc
	await db
		.collection(Collection.USERS_PUBLIC)
		.doc(fuid ?? uid)
		.update({ usersActive: fuidUserPublicDoc.usersActive });

	return { usersActive: fuidUserPublicDoc.usersActive };
};
