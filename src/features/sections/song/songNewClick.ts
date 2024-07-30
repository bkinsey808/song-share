import { UseFormReturn } from "react-hook-form";

import { Song } from "./types";
import { Set } from "@/features/app-store/types";
import { useAuthStore } from "@/features/auth/useAuthStore";

export const songNewClick = (set: Set) => (form: UseFormReturn<Song>) => () => {
	const username = useAuthStore.getState().sessionCookieData?.username;

	set({
		songId: null,
		song: {
			songName: null,
			credits: null,
			lyrics: null,
			translation: null,
			sharer: username ?? null,
		},
	});
	const newSong: Song = {
		songName: "",
		credits: "",
		lyrics: "",
		translation: "",
		sharer: username ?? "",
	};
	form.reset(newSong);
};
