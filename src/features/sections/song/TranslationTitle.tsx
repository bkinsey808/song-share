"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const TranslationTitle = () => {
	const { song } = useAppStore();

	return (
		<div className="flex-grow overflow-hidden text-ellipsis text-nowrap">
			<span>
				Translation{song?.translation ? `: ${song?.translation}` : null}
			</span>
		</div>
	);
};
