import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { create } from "zustand";

import { AppModal } from "../app-store/enums";
import { getKeys } from "../global/getKeys";
import { Writeable } from "../global/types";
import { SongLibrary } from "../music/types";
import { Role, SignInResultType } from "./enums";
import { signIn } from "@/actions/signIn";
import { signOut } from "@/actions/signOut";
import { useAppStore } from "@/features/app-store/useAppStore";
import "@/features/firebase/firebase";

interface User {
	username: string;
	picture: string | null;
	roles: Role[];
}

interface AuthStore {
	user: null | User;
	signIn: (user: User) => void;
	signInClick: () => void;
	isSignedIn: () => boolean;
	manageAccountClick: () => void;
	signOutClick: () => void;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
	user: null,
	signIn: (user) => set({ user }),
	signOut: () => set({ user: null }),
	isSignedIn: () => get().user !== null,
	signInClick: () => {
		void (async () => {
			try {
				const auth = getAuth();
				const provider = new GoogleAuthProvider();

				const userCredential = await signInWithPopup(auth, provider);
				const email = userCredential.user.email;
				if (!email) {
					throw new Error("Email is not defined");
				}
				const signInResult = await signIn(email);

				switch (signInResult.signInResultType) {
					case SignInResultType.NEW:
						// setOpenAuthModal(AuthModal.REGISTER);
						break;
					case SignInResultType.EXISTING:
						// signIn({
						// 	username: signInResult.userData.username,
						// 	picture: signInResult.userData.picture ?? null,
						// 	roles: signInResult.userData.roles as Role[],
						// });

						// invoke this store's signIn method
						useAuthStore.getState().signIn({
							username: signInResult.userData.username,
							picture: signInResult.userData.picture ?? null,
							roles: signInResult.userData.roles as Role[],
						});

						const songs = signInResult.songs;
						const songIds = getKeys(songs);

						const songLibrary = useAppStore.getState().songLibrary;

						const newSongLibrary = songIds.reduce((acc, songId) => {
							const existingSong = songLibrary[songId];
							const slimSong = songs[songId];
							acc[songId] = {
								...existingSong,
								...slimSong,
							};
							return acc;
						}, {} as Writeable<SongLibrary>);

						useAppStore.setState({ songLibrary: newSongLibrary });

					// setLastSignInCheck(0);
				}
			} catch (error) {
				console.error(error);
			}
		})();
	},
	manageAccountClick: () => {
		// set modal to manage account in the app store
		useAppStore.setState({ appModal: AppModal.MANAGE_ACCOUNT });
	},
	signOutClick: () => {
		signOut();
		set({ user: null });
		useAppStore.setState({ appModal: null });
	},
}));
