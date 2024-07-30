import { UseFormReturn } from "react-hook-form";

import { Song } from "./types";
import { Set } from "@/features/app-store/types";

export const songNewClick = (set: Set) => (form: UseFormReturn<Song>) => () => {
	set({
		songId: null,
		songName: null,
		translation: null,
		songSharer: null,
		credits: null,
	});
	const newSong: Song = {
		songName: "",
		lyrics: "",
		translation: "",
	};
	form.reset(newSong);
};