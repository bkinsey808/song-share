"use server";

import { sessionExtend } from "./sessionExtend";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const logDelete = async (logId: string) => {
	try {
		if (!logId) {
			return actionErrorMessageGet("Log ID is required");
		}

		const sessionExtendResult = await sessionExtend();
		if (sessionExtendResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { uid } = sessionExtendResult.sessionCookieData;

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("User not found");
		}
		const { userDoc } = userDocResult;
		const { logIds = [], logs = {} } = userDoc;

		const newLogIds = logIds.filter(
			(logIdObject) => logIdObject.logId !== logId,
		);
		const newLogs = { ...logs };
		delete newLogs[logId];

		// update user doc with the deleted log removed
		await db.collection(collection.USERS).doc(uid).update({
			logIds: newLogIds,
			logs: newLogs,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
		};
	} catch (error) {
		console.error({ error });
		return actionErrorMessageGet("Failed to delete song");
	}
};
