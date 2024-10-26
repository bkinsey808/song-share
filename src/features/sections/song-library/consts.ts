import { Song } from "../song/types";

export const SongLibrarySort = {
	SONG_NAME_ASC: "SONG_NAME_ASC",
	SONG_NAME_DESC: "SONG_NAME_DESC",
} as const;

export const songLibrarySortDefault = SongLibrarySort.SONG_NAME_ASC;

export const songLibrarySortData = {
	[SongLibrarySort.SONG_NAME_ASC]: {
		label: "Song Name (A-Z)",
		sort:
			(songLibrary: Record<string, Song>) =>
			(aSongId: string, bSongId: string) => {
				const a = songLibrary[aSongId]?.songName;
				const b = songLibrary[bSongId]?.songName;
				return a?.localeCompare(b);
			},
	},
	[SongLibrarySort.SONG_NAME_DESC]: {
		label: "Song Name (Z-A)",
		sort:
			(songLibrary: Record<string, Song>) =>
			(aSongId: string, bSongId: string) => {
				const a = songLibrary[aSongId]?.songName;
				const b = songLibrary[bSongId]?.songName;
				return b?.localeCompare(a);
			},
	},
} as const;

export const songLibrarySortOptions = Object.entries(songLibrarySortData).map(
	([value, { label }]) => ({
		value,
		label,
	}),
);
