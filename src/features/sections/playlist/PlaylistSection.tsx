"use client";

import { JSX } from "react";

import { PlaylistFollowing } from "./PlaylistFollowing";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistGrid } from "./PlaylistGrid";
import { useAppStore } from "@/features/app-store/useAppStore";

export const PlaylistSection = (): JSX.Element => {
	const { fuid } = useAppStore();

	return (
		<section data-title="Playlist Section">
			{fuid ? (
				<PlaylistFollowing />
			) : (
				<>
					<PlaylistForm />
					<PlaylistGrid />
				</>
			)}
		</section>
	);
};
