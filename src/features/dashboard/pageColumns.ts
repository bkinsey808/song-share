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
import { SectionId } from "@/features/sections/types";

type DashboardComponent = () => JSX.Element;
type Sections = Partial<
	Record<
		SectionId,
		{ title: DashboardComponent | string; section: DashboardComponent }
	>
>;

export const SECTIONS: Sections = {
	[sectionId.SONG_SET]: {
		title: PlaylistTitle,
		section: PlaylistSection,
	},
	[sectionId.SONG_SET_LIBRARY]: {
		title: PlaylistLibraryTitle,
		section: PlaylistLibrarySection,
	},
	[sectionId.SONG]: {
		title: SongTitle,
		section: SongSection,
	},
	[sectionId.SONG_LIBRARY]: {
		title: SongLibraryTitle,
		section: SongLibrarySection,
	},
	[sectionId.QR]: {
		title: "QR",
		section: QRSection,
	},
};

const leftSections: SectionId[] = [sectionId.SONG, sectionId.SONG_SET];
// const centerSections: SectionId[] = [SectionId.SONG_LIBRARY, SectionId.SONG];
const rightSections: SectionId[] = [
	sectionId.SONG_LIBRARY,
	sectionId.SONG_SET_LIBRARY,
	sectionId.QR,
];

export const pageColumns = [leftSections, rightSections];
