import { Song } from "./types";
import { useAppStore } from "@/features/app-store/useAppStore";

export const useSong = (): Song =>
	useAppStore((state) =>
		state.songId ? state.songLibrary[state.songId] : state.songDefaultGet(),
	);
