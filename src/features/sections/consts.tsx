import { AboutButtonLabel } from "./about/AboutButtonLabel";
import { AdminSection } from "./admin/AdminSection";
import { QRButtonLabel } from "./qr/QRButtonLabel";
import { UserLibraryTitle } from "./user-library/UserLibraryTitle";
import { IconBrand } from "@/features/design-system/IconBrand";
import { AboutSection } from "@/features/sections/about/AboutSection";
import { LogButtonLabel } from "@/features/sections/log/LogButtonLabel";
import { LogSection } from "@/features/sections/log/LogSection";
import { LogTitle } from "@/features/sections/log/LogTitle";
import { PlaylistLibraryButtonLabel } from "@/features/sections/playlist-library/PlaylistLibraryButtonLabel";
import { PlaylistLibrarySection } from "@/features/sections/playlist-library/PlaylistLibrarySection";
import { PlaylistLibraryTitle } from "@/features/sections/playlist-library/PlaylistLibraryTitle";
import { PlaylistButtonLabel } from "@/features/sections/playlist/PlaylistButtonLabel";
import { PlaylistSection } from "@/features/sections/playlist/PlaylistSection";
import { PlaylistTitle } from "@/features/sections/playlist/PlaylistTitle";
import { QRSection } from "@/features/sections/qr/QRSection";
import { SettingsButtonLabel } from "@/features/sections/settings/SettingsButtonLabel";
import { SettingsSection } from "@/features/sections/settings/SettingsSection";
import { SongLibraryButtonLabel } from "@/features/sections/song-library/SongLibraryButtonLabel";
import { SongLibrarySection } from "@/features/sections/song-library/SongLibrarySection";
import { SongLibraryTitle } from "@/features/sections/song-library/SongLibraryTitle";
import { SongRequestsButtonLabel } from "@/features/sections/song-requests/SongRequestsButtonLabel";
import { SongRequestsSection } from "@/features/sections/song-requests/SongRequestsSection";
import { SongRequestsTitle } from "@/features/sections/song-requests/SongRequestsTitle";
import { SongButtonLabel } from "@/features/sections/song/SongButtonLabel";
import { SongSection } from "@/features/sections/song/SongSection";
import { SongTitle } from "@/features/sections/song/SongTitle";
import { Sections } from "@/features/sections/types";
import { UserLibraryButtonLabel } from "@/features/sections/user-library/UserLibraryButtonLabel";
import { UserLibrarySection } from "@/features/sections/user-library/UserLibrarySection";

export const sectionId = {
	SONG: "SONG",
	PLAYLIST: "SONG_SET",
	SONG_LIBRARY: "SONG_LIBRARY",
	PLAYLIST_LIBRARY: "SONG_SET_LIBRARY",
	TRANSLATION: "TRANSLATION",
	LYICS: "LYICS",
	CREDITS: "CREDITS",
	SONG_KEY_SCALE: "SONG_KEY_SCALE",
	LOG: "LOG",
	SONG_LOG: "SONG_LOG",
	SETTINGS: "SETTINGS",
	QR: "QR",
	ABOUT: "ABOUT",
	WHY_SIGN_IN: "WHY_SIGN_IN",
	WHY_JOIN: "WHY_JOIN",
	USER_LIBRARY: "USER_LIBRARY",
	SONG_REQUESTS: "SONG_REQUESTS",
	ADMIN: "ADMIN",
} as const;

export const sectionData: Sections = {
	[sectionId.PLAYLIST]: {
		title: PlaylistTitle,
		section: PlaylistSection,
		buttonLabel: PlaylistButtonLabel,
	},
	[sectionId.PLAYLIST_LIBRARY]: {
		title: PlaylistLibraryTitle,
		section: PlaylistLibrarySection,
		buttonLabel: PlaylistLibraryButtonLabel,
	},
	[sectionId.SONG]: {
		title: SongTitle,
		section: SongSection,
		buttonLabel: SongButtonLabel,
	},
	[sectionId.SONG_LIBRARY]: {
		title: SongLibraryTitle,
		section: SongLibrarySection,
		buttonLabel: SongLibraryButtonLabel,
	},
	[sectionId.SONG_REQUESTS]: {
		title: SongRequestsTitle,
		section: SongRequestsSection,
		buttonLabel: SongRequestsButtonLabel,
	},
	[sectionId.LOG]: {
		title: LogTitle,
		section: LogSection,
		buttonLabel: LogButtonLabel,
	},
	[sectionId.SETTINGS]: {
		title: "Settings",
		section: SettingsSection,
		buttonLabel: SettingsButtonLabel,
	},
	[sectionId.QR]: {
		title: "QR",
		section: QRSection,
		buttonLabel: QRButtonLabel,
	},
	[sectionId.ABOUT]: {
		title: () => (
			<>
				About <IconBrand />
			</>
		),
		section: AboutSection,
		buttonLabel: AboutButtonLabel,
	},
	[sectionId.USER_LIBRARY]: {
		title: UserLibraryTitle,
		section: UserLibrarySection,
		buttonLabel: UserLibraryButtonLabel,
	},

	[sectionId.ADMIN]: {
		title: "Admin",
		buttonLabel: "Admin",
		section: AdminSection,
	},
};
