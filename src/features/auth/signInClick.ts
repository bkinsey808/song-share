import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

import { AppModal } from "../app-store/enums";
import { getKeys } from "../global/getKeys";
import { SongLibrary } from "../sections/song/types";
import { Role, SignInResultType } from "./enums";
import { getSessionWarningTimestamp } from "./getSessionWarningTimestamp";
import type { Set } from "./types";
import { signIn } from "@/actions/signIn";
import { toast } from "@/components/ui/use-toast";
import { useAppStore } from "@/features/app-store/useAppStore";

export const signInClick = (set: Set) => () => {
	void (async () => {
		try {
			const auth = getAuth();
			set({
				isSigningIn: true,
			});
			const provider = new GoogleAuthProvider();

			const userCredential = await signInWithPopup(auth, provider);
			const email = userCredential.user.email;
			if (!email) {
				throw new Error("Email is not defined");
			}
			const signInResult = await signIn(email);

			switch (signInResult.signInResultType) {
				case SignInResultType.NEW:
					set({
						isSignedIn: false,
						isSigningIn: false,
						sessionCookieData: {
							email,
							picture: userCredential.user.photoURL ?? null,
							username: null,
							roles: [],
							sessionWarningTimestamp: getSessionWarningTimestamp(),
						},
					});
					useAppStore.setState({
						appModal: AppModal.REGISTER,
					});

					break;
				case SignInResultType.EXISTING:
					const userDocSongs = signInResult.songs;
					const userDocSongIds = getKeys(userDocSongs);

					const songLibrary = useAppStore.getState().songLibrary;

					const newSongLibrary = userDocSongIds.reduce((acc, songId) => {
						const existingSong = songLibrary[songId];
						const slimSong = userDocSongs[songId];
						acc[songId] = {
							...existingSong,
							...slimSong,
						};
						return acc;
					}, {} as SongLibrary);

					useAppStore.setState({ songLibrary: newSongLibrary, appModal: null });

					set({
						isSignedIn: true,
						isSigningIn: false,
						lastSignInCheck: 0,
						sessionCookieData: {
							email: signInResult.userData.email,
							picture: signInResult.userData.picture ?? null,
							username: signInResult.userData.username,
							roles: signInResult.userData.roles as Role[],
							sessionWarningTimestamp: getSessionWarningTimestamp(),
						},
					});

					toast({ title: "Welcome back!" });
			}
		} catch (error) {
			console.error(error);
		}
	})();
};
