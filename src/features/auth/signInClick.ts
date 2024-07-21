import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

import { AppModal } from "../app-store/enums";
import { getKeys } from "../global/getKeys";
import { Writeable } from "../global/types";
import { SongLibrary } from "../music/types";
import { Role, SignInResultType } from "./enums";
import type { Set } from "./types";
import { signIn } from "@/actions/signIn";
import { toast } from "@/components/ui/use-toast";
import { useAppStore } from "@/features/app-store/useAppStore";

export const signInClick = (set: Set) => () => {
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
					set({
						isSignedIn: false,
						sessionCookieData: {
							email,
							picture: userCredential.user.photoURL ?? null,
							username: null,
							roles: [],
						},
					});
					useAppStore.setState({
						appModal: AppModal.REGISTER,
					});

					break;
				case SignInResultType.EXISTING:
					set({
						isSignedIn: true,
						sessionCookieData: {
							email: signInResult.userData.email,
							picture: signInResult.userData.picture ?? null,
							username: signInResult.userData.username,
							roles: signInResult.userData.roles as Role[],
						},
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
					toast({ title: "Welcome back!" });

				// setLastSignInCheck(0);
			}
		} catch (error) {
			console.error(error);
		}
	})();
};
