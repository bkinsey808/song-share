"use client";

import { JSX } from "react";

import { useAppStore } from "../app-store/useAppStore";
import { dashboardPath } from "../path/path";
import { Button } from "@/components/ui/button";

export const RegisterSignInButton = (): JSX.Element => {
	const { signInClick } = useAppStore();

	return (
		<Button onClick={signInClick(dashboardPath)} className="mt-[1rem]">
			Register / Sign In
		</Button>
	);
};
