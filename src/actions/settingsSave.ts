"use server";

import { flatten } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { actionResultType } from "@/features/app-store/consts";
import { Collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { serverParse } from "@/features/global/serverParse";
import { SettingsSchema } from "@/features/sections/settings/schemas";
import { Settings } from "@/features/sections/settings/types";

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

export const settingsSave = async ({ settings }: { settings: Settings }) => {
	try {
		const settingsParseResult = serverParse(SettingsSchema, settings);
		if (!settingsParseResult.success) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: flatten<typeof SettingsSchema>(settingsParseResult.issues)
					.nested,
			};
		}

		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return getFormError("Session expired");
		}

		const { sessionCookieData } = extendSessionResult;
		const { uid } = sessionCookieData;

		await db
			.collection(Collection.USERS)
			.doc(uid)
			.update({
				timeZone: settings.useSystemTimeZone ? null : settings.timeZone,
				wakeLockActive: settings.wakeLockActive,
			});

		return {
			actionResultType: actionResultType.SUCCESS,
			timeZone: settings.timeZone,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save settings");
	}
};
