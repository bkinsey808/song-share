import { FormEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";

import { AppModal, SectionId } from "./enums";
import { SongDetails, SongLibrary } from "@/features/sections/song/types";

export type Get = () => AppStore;
export type Set = (
	partial:
		| AppStore
		| Partial<AppStore>
		| ((state: AppStore) => AppStore | Partial<AppStore>),
	replace?: boolean | undefined,
) => void;

export type AppStore = {
	appModal: AppModal | null;
	songId: string | null;
	songName: string | null;
	translation: string | null;
	sharer: string | null;
	credits: string | null;
	songLibrary: SongLibrary;
	setAppModal: (modal: AppModal | null) => void;
	songDetailsSubmit: (
		form: UseFormReturn<SongDetails>,
	) => (e: React.FormEvent<HTMLFormElement>) => void;
	openSections: SectionId[];
	toggleSection: (sectionId: SectionId) => void;
};
