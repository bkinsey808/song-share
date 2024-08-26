"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const CreditsTitle = () => {
	const { song } = useAppStore();

	return (
		<div className="flex-grow overflow-hidden text-ellipsis text-nowrap">
			<span>Credits{song?.credits ? `: ${song?.credits}` : null}</span>
		</div>
	);
};
