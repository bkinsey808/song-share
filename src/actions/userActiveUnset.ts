"use server";

import { Collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { UserPublicDocSchema } from "@/features/firebase/schemas";
import { serverParse } from "@/features/global/serverParse";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/** delete the active user */
export const userActiveUnset = async ({
	uid,
	fuid,
}: {
	uid: string;
	fuid: string;
}) => {
	// get the fuid user public doc
	const fuidUserPublicDocSnapshot = await db
		.collection(Collection.USERS_PUBLIC)
		.doc(fuid)
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
	delete fuidUserPublicDoc.usersActive[uid];

	// update the fuid user public doc
	await db
		.collection(Collection.USERS_PUBLIC)
		.doc(fuid)
		.update({ usersActive: fuidUserPublicDoc.usersActive });
};