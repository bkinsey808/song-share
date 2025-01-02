import { role } from "../auth/consts";
import { AppSliceGet } from "@/features/app-store/types";
import { sectionId } from "@/features/sections/consts";
import { SectionId } from "@/features/sections/types";

type SectionsDashboardGet = (
	get: AppSliceGet,
) => () => [SectionId[], SectionId[]];

export const sectionsDashboardGet: SectionsDashboardGet = (get) => () => {
	const { isSignedIn, sessionCookieData } = get();
	const { roles } = sessionCookieData ?? {};

	const leftSections: SectionId[] = [
		sectionId.ABOUT,
		sectionId.SONG,
		sectionId.SONG_LIBRARY,
		sectionId.SONG_REQUESTS,
		sectionId.USER_LIBRARY,
	];
	// const centerSections: SectionId[] = [SectionId.SONG_LIBRARY, SectionId.SONG];
	const rightSections: SectionId[] = [
		sectionId.PLAYLIST,
		sectionId.PLAYLIST_LIBRARY,
		...(isSignedIn ? [sectionId.LOG, sectionId.SETTINGS, sectionId.QR] : []),
		...(roles?.includes(role.ADMIN) ? [sectionId.ADMIN] : []),
	];

	return [leftSections, rightSections];
};
