import { AppSliceGet } from "@/features/app-store/types";
import { sectionId } from "@/features/sections/consts";
import { SectionId } from "@/features/sections/types";

export const sectionsFollowingGet = (get: AppSliceGet) => () => {
	const { isSignedIn } = get();

	const leftSections: SectionId[] = [
		sectionId.ABOUT,
		sectionId.SONG,
		sectionId.SONG_LIBRARY,
		sectionId.SONG_REQUESTS,
	];

	const rightSections: SectionId[] = [
		sectionId.PLAYLIST,
		sectionId.PLAYLIST_LIBRARY,
		sectionId.USER_LIBRARY,
		...(isSignedIn ? [sectionId.SETTINGS] : []),
		sectionId.QR,
	];

	return [leftSections, rightSections];
};
