import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";

import { Nullable } from "../global/types";
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

// each property in Song type needs to be nullable.
// type AppSong is derived from Song
export type AppSong = Nullable<Song>;
export type AppSongSet = Nullable<SongSet>;

export type AppStore = {
	appModal: AppModal | null;
	songId: string | null;
	song: AppSong;
	songSet: AppSongSet;
	songSetId: string | null;
	songLibrary: SongLibrary;
	songSetLibrary: SongSetLibrary;
	isSongUnsaved: boolean;
	isSongSetUnsaved: boolean;
	setIsSongUnsaved: (unsavedSong: boolean) => void;
	setIsSongSetUnsaved: (unsavedSongSet: boolean) => void;
	setAppModal: (modal: AppModal | null) => void;
	songSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	songSetSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	openSections: SectionId[];
	sectionToggle: (sectionId: SectionId) => void;
	songLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songSetLoadClick: (
		songSetId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songNewClick: () => void;
	songSetNewClick: () => void;
	songDeleteClick: () => void;
	songSetDeleteClick: () => void;
	deletingSong: boolean;
	deletingSongSet: boolean;
	songDeleteConfirmClick: () => Promise<void> | undefined;
	songSetDeleteConfirmClick: () => Promise<void> | undefined;
	songForm: UseFormReturn<Song> | null;
	songSetForm: UseFormReturn<SongSet> | null;
	setSongForm: (songForm: UseFormReturn<Song>) => void;
	setSongSetForm: (songSetForm: UseFormReturn<SongSet>) => void;
};
