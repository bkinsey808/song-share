"use server";

import { flatten } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { getFormError } from "@/features/form/getFormError";
import { serverParse } from "@/features/global/serverParse";
import { SettingsSchema } from "@/features/sections/settings/schemas";
import { Settings } from "@/features/sections/settings/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

type SettingsSave = ({ settings }: { settings: Settings }) => Promise<
	| {
			actionResultType: "SUCCESS";
			timeZone: string | null;
	  }
	| {
			actionResultType: "ERROR";
			formError?: string;
			fieldErrors?: ReturnType<typeof flatten>["nested"];
	  }
>;

export const settingsSave: SettingsSave = async ({ settings }) => {
	try {
		const settingsParseResult = serverParse(SettingsSchema, settings);
		if (!settingsParseResult.success) {
			return {
				actionResultType: ActionResultType.ERROR,
				fieldErrors: flatten<typeof SettingsSchema>(settingsParseResult.issues)
					.nested,
			};
		}

		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === ActionResultType.ERROR) {
			return getFormError("Session expired");
		}

		const { sessionCookieData } = extendSessionResult;
		const { uid } = sessionCookieData;

		await db
			.collection(collectionNameGet(collection.USERS))
			.doc(uid)
			.update({
				timeZone: settings.useSystemTimeZone ? null : settings.timeZone,
			});

		return {
			actionResultType: ActionResultType.SUCCESS,
			timeZone: settings.timeZone ?? null,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save settings");
	}
};
