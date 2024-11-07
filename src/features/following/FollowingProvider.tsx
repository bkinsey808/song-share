"use client";

import { useParams } from "next/navigation";
import { ReactNode } from "react";

import { useFollowingSubscription } from "@/features/firebase/useFollowingSubscription";
import { useLibrarySubscription } from "@/features/firebase/useLibrarySubscription";
import { useUserLibrarySubscription } from "@/features/sections/user-library/useUserLibrarySubscription";

export const FollowingProvider = ({ children }: { children: ReactNode }) => {
	const params = useParams();
	const fuid = params.fuid;
	if (typeof fuid === "string") {
		useFollowingSubscription(fuid);
	}
	useLibrarySubscription();
	useUserLibrarySubscription();

	return <>{children}</>;
};
