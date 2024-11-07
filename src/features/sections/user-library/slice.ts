import { Unsubscribe } from "firebase/firestore";
import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { userLibrarySortData, userLibrarySortDefault } from "./consts";
import {
	UserLibrary,
	UserLibraryGridForm,
	UserLibrarySort,
	UsersActive,
} from "./types";
import { userActiveIs } from "./userActiveIs";
import { userLibraryGridFormSubmit } from "./userLibraryGridFormSubmit";
import { userLibrarySubscribe } from "./userLibrarySubscribe";
import { userLibraryUnsubscribe } from "./userLibraryUnsubscribe";
import { userLoadClick } from "./userLoadClick";
import { usernameGet } from "./usernameGet";
import {
	AppSlice,
	sliceResetFns,
	useAppStore,
} from "@/features/app-store/useAppStore";
import { UserPublicDoc } from "@/features/firebase/types";
import { searchTextGet } from "@/features/global/searchTextGet";

type UserLibrarySliceState = {
	userLibrary: UserLibrary;
	userIds: string[];
	usersActive: UsersActive;
	userLibraryUnsubscribeFns: Record<string, Unsubscribe>;
	userLibrarySort: UserLibrarySort;
	userLibrarySearch: string;
	userLibraryGridForm: UseFormReturn<UserLibraryGridForm> | null;
};

const userLibrarySliceInitialState: UserLibrarySliceState = {
	userLibrary: {},
	userIds: [],
	usersActive: {},
	userLibraryUnsubscribeFns: {},
	userLibrarySort: userLibrarySortDefault,
	userLibrarySearch: "",
	userLibraryGridForm: null,
};

export type UserLibrarySlice = UserLibrarySliceState & {
	userLoadClick: (
		userId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	userLibrarySubscribe: () => void;
	userLibraryUnsubscribe: () => void;
	userSet: ({
		userId,
		userPublicDoc,
	}: {
		userId: string;
		userPublicDoc: UserPublicDoc;
	}) => void;
	userLibraryGridFormSet: (form: UseFormReturn<UserLibraryGridForm>) => void;
	userLibrarySortSet: (sort: UserLibrarySort) => () => void;
	userLibraryGridFormSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
	usernameGet: (uid: string) => string | undefined;
	isActiveGet: (uid: string) => boolean;
	userIdsSet: (userIds: string[]) => void;
	usersActiveSet: (usersActive: UsersActive) => void;
};

type AppUserLibrarySlice = StateCreator<AppSlice, [], [], UserLibrarySlice>;

export const createUserLibrarySlice: AppUserLibrarySlice = (set, get) => {
	sliceResetFns.add(() => set(userLibrarySliceInitialState));
	return {
		...userLibrarySliceInitialState,
		userLoadClick,
		userLibrarySubscribe: userLibrarySubscribe(get, set),
		userLibraryUnsubscribe: userLibraryUnsubscribe(get),
		userLibraryGridFormSet: (form) => set({ userLibraryGridForm: form }),
		userLibrarySortSet: (sort) => () => {
			set({
				userLibrarySort: sort,
			});
		},
		userSet: ({ userId, userPublicDoc }) => {
			if (userId) {
				// had to do it this way because otherwise component wouldn't re-render
				set((innerState) => ({
					...innerState,
					userLibrary: {
						...innerState.userLibrary,
						[userId]: userPublicDoc,
					},
				}));
			}
		},
		userLibraryGridFormSubmit: userLibraryGridFormSubmit(get, set),
		usernameGet: usernameGet(get),
		isActiveGet: userActiveIs(get),
		userIdsSet: (userIds) => {
			set({ userIds });
		},
		usersActiveSet: (usersActive) => {
			set({ usersActive });
		},
	};
};

export const useSortedFilteredUserIds = () =>
	useAppStore((state) => {
		const search = state.userLibrarySearch.toLowerCase();
		const filteredUserIds = state.userIds.filter((userId) => {
			const user = state.userLibrary[userId];

			if (!user) {
				return false;
			}

			if (searchTextGet(user.username).includes(search)) {
				return true;
			}

			return false;
		});
		const sortData = state.userLibrarySort
			? userLibrarySortData[state.userLibrarySort]
			: undefined;
		if (!sortData) {
			return [];
		}
		return filteredUserIds.sort(sortData.sort(state.userLibrary));
	});
