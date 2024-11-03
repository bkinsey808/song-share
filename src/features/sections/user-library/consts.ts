import { UserLibrary } from "./types";

export const UserLibrarySort = {
	USERNAME_ASC: "USERNAME_ASC",
	USERNAME_DESC: "USERNAME_DESC",
} as const;

export const userLibrarySortDefault = UserLibrarySort.USERNAME_ASC;

export const userLibrarySortData = {
	[UserLibrarySort.USERNAME_ASC]: {
		label: "Username (A-Z)",
		sort: (userLibrary: UserLibrary) => (aUserId: string, bUserId: string) => {
			const a = userLibrary[aUserId]?.username;
			const b = userLibrary[bUserId]?.username;
			return a?.localeCompare(b);
		},
	},
	[UserLibrarySort.USERNAME_DESC]: {
		label: "Username (Z-A)",
		sort: (userLibrary: UserLibrary) => (aUserId: string, bUserId: string) => {
			const a = userLibrary[aUserId]?.username;
			const b = userLibrary[bUserId]?.username;
			return b?.localeCompare(a);
		},
	},
} as const;

export const userLibrarySortOptions = Object.entries(userLibrarySortData).map(
	([value, { label }]) => ({
		value,
		label,
	}),
);
