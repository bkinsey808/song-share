"use server";

import { flatten } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { serverParse } from "@/features/global/serverParse";
import { LogFormSchema } from "@/features/sections/log/schemas";
import { LogForm } from "@/features/sections/log/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const getFormError = (formError: string) => {
	console.error(formError);
	return {
		actionResultType: actionResultType.ERROR,
		formError,
		fieldErrors: undefined,
	};
};

// eslint-disable-next-line @typescript-eslint/require-await
export const logSave = async (logFormValues: LogForm) => {
	if (!logFormValues.logId) {
		logFormValues = {
			...logFormValues,
			logId: crypto.randomUUID(),
		};
	}

	try {
		const logFormParseResult = serverParse(LogFormSchema, logFormValues);
		if (!logFormParseResult.success) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: flatten<typeof LogFormSchema>(logFormParseResult.issues)
					.nested,
			};
		}

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return getFormError("Failed to get user doc");
		}
		const { userDoc } = userDocResult;

		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return getFormError("Session expired");
		}
		const { sessionCookieData } = extendSessionResult;
		const { uid } = sessionCookieData;

		const { logs, logIds } = userDoc;
		const newLogIds = logIds?.find(
			(logId) => logId.logId === logFormValues.logId,
		)
			? logIds
			: [...(logIds ?? []), { logId: logFormValues.logId }];
		const newLogs = {
			...logs,
			[logFormValues.logId]: logFormValues,
		};

		await db.collection(collection.USERS).doc(uid).update({
			logIds: newLogIds,
			logs: newLogs,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			logId: logFormValues.logId,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save song");
	}
};
