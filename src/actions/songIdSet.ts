"use server";

import { sessionExtend } from "./sessionExtend";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

type SongIdSet = ({ songId }: { songId: string }) => Promise<
	| {
			actionResultType: "SUCCESS";
	  }
	| {
			actionResultType: "ERROR";
			message: string;
	  }
>;
export const songIdSet: SongIdSet = async ({ songId }) => {
	try {
		const sessionExtendResult = await sessionExtend();
		if (sessionExtendResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = sessionExtendResult.sessionCookieData;
		const { uid } = sessionCookieData;

		await db.collection(collectionNameGet(collection.USERS)).doc(uid).update({
			songId,
		});

		return {
			actionResultType: ActionResultType.SUCCESS,
		};
	} catch (error) {
		console.error(error);
		return actionErrorMessageGet("An error occurred");
	}
};
