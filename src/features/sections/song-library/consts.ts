import { Song } from "../song/types";

export const songLibrarySort = {
	SONG_NAME_ASC: "SONG_NAME_ASC",
	SONG_NAME_DESC: "SONG_NAME_DESC",
} as const;

export const songLibrarySortData = {
	[songLibrarySort.SONG_NAME_ASC]: {
		label: "Song Name (A-Z)",
		sort:
			(songLibrary: Record<string, Song>) =>
			(aSongId: string, bSongId: string) => {
				const a = songLibrary[aSongId]?.songName;
				const b = songLibrary[bSongId]?.songName;
				return a.localeCompare(b);
			},
	},
	[songLibrarySort.SONG_NAME_DESC]: {
		label: "Song Name (Z-A)",
		sort:
			(songLibrary: Record<string, Song>) =>
			(aSongId: string, bSongId: string) => {
				const a = songLibrary[aSongId]?.songName;
				const b = songLibrary[bSongId]?.songName;
				return b.localeCompare(a);
			},
	},
};
