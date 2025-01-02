"use server";

import { cookies } from "next/headers";

import { userActiveUnset } from "./userActiveUnset";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";

type Signout = ({
	uid,
	fuid,
}: {
	uid: string | null;
	fuid: string | null;
}) => Promise<void>;

export const signOut: Signout = async ({ uid, fuid }) => {
	if (uid) {
		try {
			await userActiveUnset({ uid, fuid });
		} catch (error) {
			console.error("Error unsetting user active", error);
		}
	}
	(await cookies()).delete(SESSION_COOKIE_NAME);
};
