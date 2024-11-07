"use client";

import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const UserLibraryTitle = () => {
	const { userLibrary } = useAppStore();
	const numberOfUsers = getKeys(userLibrary).length;

	return (
		<span>
			{numberOfUsers} user{numberOfUsers === 1 ? "" : "s"}
		</span>
	);
};
