"use client";

import { SongFollowing } from "./SongFollowing";
import { SongForm } from "./SongForm";
import { useAppStore } from "@/features/app-store/useAppStore";

export const SongSection = () => {
	const { fuid } = useAppStore();

	return (
		<section data-title="Song Section">
			{fuid ? <SongFollowing /> : <SongForm />}
		</section>
	);
};
