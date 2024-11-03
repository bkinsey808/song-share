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
	if (uid && fuid) {
		await userActiveUnset({ uid, fuid });
	}
	(await cookies()).delete(SESSION_COOKIE_NAME);
};
