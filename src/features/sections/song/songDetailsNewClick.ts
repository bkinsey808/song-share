import { UseFormReturn } from "react-hook-form";

import { SongDetails } from "./types";
import { Set } from "@/features/app-store/types";

export const songDetailsNewClick =
	(set: Set) => (form: UseFormReturn<SongDetails>) => () => {
		set({
			songId: null,
			songName: null,
			translation: null,
			sharer: null,
			credits: null,
		});
		form.reset({
			songName: "",
			translation: "",
		});
	};
