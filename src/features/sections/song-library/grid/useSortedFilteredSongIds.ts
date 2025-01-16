import { songLibrarySortData } from "../grid-form/consts";
import { useAppStore } from "@/features/app-store/useAppStore";
import { searchTextGet } from "@/features/global/searchTextGet";

export const useSortedFilteredSongIds = (): string[] =>
	useAppStore((state) => {
		const search = state.songLibrarySearch.toLowerCase();
		const filteredSongIds = state.songIds.filter((songId) => {
			const song = state.songLibrary[songId];

			if (!song || song.deleted) {
				return false;
			}

			if (
				searchTextGet(song.songName).includes(search) ||
				searchTextGet(song.lyrics).includes(search) ||
				searchTextGet(song.translation).includes(search) ||
				searchTextGet(song.credits).includes(search)
			) {
				return true;
			}

			const songLogs = state.songLogs[songId];

			if (
				songLogs?.some((songLog) =>
					searchTextGet(songLog.notes).includes(search),
				)
			) {
				return true;
			}

			return false;
		});
		const sortData = state.songLibrarySort
			? songLibrarySortData[state.songLibrarySort]
			: undefined;
		if (!sortData) {
			return [];
		}
		return filteredSongIds.sort(sortData.sort(state.songLibrary));
	});
