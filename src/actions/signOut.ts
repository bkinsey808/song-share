"use server";

import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/features/auth/consts";

export const signOut = () => {
	cookies().delete(SESSION_COOKIE_NAME);
};
