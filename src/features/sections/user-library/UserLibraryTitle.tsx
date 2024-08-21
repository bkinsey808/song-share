"use client";

import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const UserLibraryTitle = () => {
	const { userLibrary } = useAppStore();
	const numberOfUsers = getKeys(userLibrary).length;

	return (
		<>
			<div>User Library{numberOfUsers ? `: ` : null}</div>
			<div className="overflow-hidden text-ellipsis text-nowrap">
				({numberOfUsers})
			</div>
		</>
	);
};
