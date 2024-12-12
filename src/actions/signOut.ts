"use server";

import { cookies } from "next/headers";

import { userActiveUnset } from "./userActiveUnset";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";

export const signOut = async ({
	uid,
	fuid,
}: {
	uid: string | null;
	fuid: string | null;
}) => {
	if (uid) {
		try {
			await userActiveUnset({ uid, fuid });
		} catch (error) {
			console.error("Error unsetting user active", error);
		}
	}
	(await cookies()).delete(SESSION_COOKIE_NAME);
};
