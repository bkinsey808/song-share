import { Get } from "@/features/app-store/types";
import { sectionId } from "@/features/sections/consts";
import { SectionId } from "@/features/sections/types";

export const getDashboardSections = (get: Get) => () => {
	const { isSignedIn } = get();

	const leftSections: SectionId[] = [sectionId.SONG, sectionId.SONG_LIBRARY];
	// const centerSections: SectionId[] = [SectionId.SONG_LIBRARY, SectionId.SONG];
	const rightSections: SectionId[] = [
		sectionId.PLAYLIST,
		sectionId.PLAYLIST_LIBRARY,
		...(isSignedIn ? [sectionId.LOG, sectionId.SETTINGS] : []),
		sectionId.QR,
	];

	return [leftSections, rightSections];
};
