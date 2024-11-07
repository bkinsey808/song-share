import { sectionId } from "@/features/sections/consts";
import { SectionId } from "@/features/sections/types";

const leftSections: SectionId[] = [
	sectionId.ABOUT,
	sectionId.SONG,
	sectionId.SONG_LIBRARY,
];
// const centerSections: SectionId[] = [SectionId.SONG_LIBRARY, SectionId.SONG];
const rightSections: SectionId[] = [
	sectionId.PLAYLIST,
	sectionId.PLAYLIST_LIBRARY,
	sectionId.USER_LIBRARY,
	sectionId.QR,
];

export const pageColumns = [leftSections, rightSections];
