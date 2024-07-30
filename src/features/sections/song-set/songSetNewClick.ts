import { UseFormReturn } from "react-hook-form";

import { SongSet } from "./types";
import { Set } from "@/features/app-store/types";

export const songSetNewClick =
	(set: Set) => (form: UseFormReturn<SongSet>) => () => {
		set({
			songSetId: null,
			songSetName: null,
			songSharer: null,
		});
		form.reset({
			songSetName: "",
		});
	};
