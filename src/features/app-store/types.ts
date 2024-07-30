import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";

import { SongSet, SongSetLibrary } from "../sections/song-set/types";
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
	songSetId: string | null;
	songName: string | null;
	songSetName: string | null;
	songSharer: string | null;
	songSetSharer: string | null;
	lyrics: string | null;
	translation: string | null;
	credits: string | null;
	songLibrary: SongLibrary;
	songSetLibrary: SongSetLibrary;
	isSongUnsaved: boolean;
	isSongSetUnsaved: boolean;
	setIsSongUnsaved: (unsavedSong: boolean) => void;
	setIsSongSetUnsaved: (unsavedSongSet: boolean) => void;
	setAppModal: (modal: AppModal | null) => void;
	songSubmit: (
		form: UseFormReturn<Song>,
	) => (e: FormEvent<HTMLFormElement>) => void;
	songSetSubmit: (
		form: UseFormReturn<SongSet>,
	) => (e: FormEvent<HTMLFormElement>) => void;
	openSections: SectionId[];
	sectionToggle: (sectionId: SectionId) => void;
	songLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songSetLoadClick: (
		songSetId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songNewClick: (form: UseFormReturn<Song>) => () => void;
	songSetNewClick: (form: UseFormReturn<SongSet>) => () => void;
};
