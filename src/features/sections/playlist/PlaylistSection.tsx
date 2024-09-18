"use client";

import { PlaylistFollowing } from "./PlaylistFollowing";
import { PlaylistForm } from "./PlaylistForm";
import { useAppStore } from "@/features/app-store/useAppStore";

export const PlaylistSection = () => {
	const { fuid } = useAppStore();

	return <>{fuid ? <PlaylistFollowing /> : <PlaylistForm />}</>;
};
