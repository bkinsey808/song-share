import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";

import { AppModal, SectionId } from "./enums";
import { Song, SongLibrary } from "@/features/sections/song/types";

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
	lyrics: string | null;
	translation: string | null;
	sharer: string | null;
	credits: string | null;
	songLibrary: SongLibrary;
	isSongUnsaved: boolean;
	setIsSongUnsaved: (unsavedSong: boolean) => void;
	setAppModal: (modal: AppModal | null) => void;
	songSubmit: (
		form: UseFormReturn<Song>,
	) => (e: FormEvent<HTMLFormElement>) => void;
	openSections: SectionId[];
	sectionToggle: (sectionId: SectionId) => void;
	songLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songNewClick: (form: UseFormReturn<Song>) => () => void;
};
