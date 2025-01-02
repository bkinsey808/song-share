"use client";

import { JSX } from "react";

import { SongFollowing } from "./SongFollowing";
import { SongForm } from "./SongForm";
import { useAppStore } from "@/features/app-store/useAppStore";
import { SongLog } from "@/features/sections/song-log/SongLog";

export const SongSection = (): JSX.Element => {
	const { fuid } = useAppStore();

	return (
		<section data-title="Song Section">
			{fuid ? (
				<SongFollowing />
			) : (
				<>
					<SongForm />
					<SongLog />
				</>
			)}
		</section>
	);
};
