import { sectionId } from "@/features/sections/consts";
import { SongLibrarySection } from "@/features/sections/song-library/SongLibrarySection";
import { SongLibraryTitle } from "@/features/sections/song-library/SongLibraryTitle";
import { SongSetLibrarySection } from "@/features/sections/song-set-library/SongSetLibrarySection";
import { SongSetLibraryTitle } from "@/features/sections/song-set-library/SongSetLibraryTitle";
import { SongSetSection } from "@/features/sections/song-set/SongSetSection";
import { SongSetTitle } from "@/features/sections/song-set/SongSetTitle";
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
		title: SongSetTitle,
		section: SongSetSection,
	},
	[sectionId.SONG_SET_LIBRARY]: {
		title: SongSetLibraryTitle,
		section: SongSetLibrarySection,
	},
	[sectionId.SONG]: {
		title: SongTitle,
		section: SongSection,
	},
	[sectionId.SONG_LIBRARY]: {
		title: SongLibraryTitle,
		section: SongLibrarySection,
	},
};

const leftSections: SectionId[] = [sectionId.SONG, sectionId.SONG_SET];
// const centerSections: SectionId[] = [SectionId.SONG_LIBRARY, SectionId.SONG];
const rightSections: SectionId[] = [
	sectionId.SONG_LIBRARY,
	sectionId.SONG_SET_LIBRARY,
];

export const pageColumns = [leftSections, rightSections];