import { QRSection } from "../sections/qr/QRSection";
import { sectionId } from "@/features/sections/consts";
import { PlaylistLibrarySection } from "@/features/sections/playlist-library/PlaylistLibrarySection";
import { PlaylistLibraryTitle } from "@/features/sections/playlist-library/PlaylistLibraryTitle";
import { PlaylistSection } from "@/features/sections/playlist/PlaylistSection";
import { PlaylistTitle } from "@/features/sections/playlist/PlaylistTitle";
import { SongLibrarySection } from "@/features/sections/song-library/SongLibrarySection";
import { SongLibraryTitle } from "@/features/sections/song-library/SongLibraryTitle";
import { SongSection } from "@/features/sections/song/SongSection";
import { SongTitle } from "@/features/sections/song/SongTitle";
import { SectionId, Sections } from "@/features/sections/types";

export const SECTIONS: Sections = {
	[sectionId.PLAYLIST]: {
		title: PlaylistTitle,
		section: PlaylistSection,
		buttonLabel: "Playlist",
	},
	[sectionId.PLAYLIST_LIBRARY]: {
		title: PlaylistLibraryTitle,
		section: PlaylistLibrarySection,
		buttonLabel: "Playlist Library",
	},
	[sectionId.SONG]: {
		title: SongTitle,
		section: SongSection,
		buttonLabel: "Song",
	},
	[sectionId.SONG_LIBRARY]: {
		title: SongLibraryTitle,
		section: SongLibrarySection,
		buttonLabel: "Song Library",
	},
	[sectionId.QR]: {
		title: "QR",
		section: QRSection,
		buttonLabel: "QR",
	},
};

const leftSections: SectionId[] = [sectionId.SONG, sectionId.SONG_LIBRARY];
// const centerSections: SectionId[] = [SectionId.SONG_LIBRARY, SectionId.SONG];
const rightSections: SectionId[] = [
	sectionId.PLAYLIST,
	sectionId.PLAYLIST_LIBRARY,
	sectionId.QR,
];

export const pageColumns = [leftSections, rightSections];
