import { SectionId } from "@/features/app-store/enums";
import { SongLibrarySection } from "@/features/sections/song-library/SongLibrarySection";
import { SongLibraryTitle } from "@/features/sections/song-library/SongLibraryTitle";
import { SongSetLibrarySection } from "@/features/sections/song-set-library/SongSetLibrarySection";
import { SongSetLibraryTitle } from "@/features/sections/song-set-library/SongSetLibraryTitle";
import { SongSetSection } from "@/features/sections/song-set/SongSetSection";
import { SongSetTitle } from "@/features/sections/song-set/SongSetTitle";
import { SongSection } from "@/features/sections/song/SongSection";
import { SongTitle } from "@/features/sections/song/SongTitle";

type DashboardComponent = () => JSX.Element;
type Sections = Partial<
	Record<
		SectionId,
		{ title: DashboardComponent | string; section: DashboardComponent }
	>
>;

export const SECTIONS: Sections = {
	[SectionId.SONG_SET]: {
		title: SongSetTitle,
		section: SongSetSection,
	},
	[SectionId.SONG_SET_LIBRARY]: {
		title: SongSetLibraryTitle,
		section: SongSetLibrarySection,
	},
	[SectionId.SONG]: {
		title: SongTitle,
		section: SongSection,
	},
	[SectionId.SONG_LIBRARY]: {
		title: SongLibraryTitle,
		section: SongLibrarySection,
	},
};

const leftSections: SectionId[] = [
	SectionId.SONG_SET_LIBRARY,
	SectionId.SONG_SET,
];
// const centerSections: SectionId[] = [SectionId.SONG_LIBRARY, SectionId.SONG];
const rightSections: SectionId[] = [SectionId.SONG_LIBRARY, SectionId.SONG];

export const pageColumns = [leftSections, rightSections];
