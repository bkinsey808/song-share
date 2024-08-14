import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

import { getKeys } from "../global/getKeys";
import { signInResultType } from "./consts";
import { getSessionWarningTimestamp } from "./getSessionWarningTimestamp";
import { signIn } from "@/actions/signIn";
import { toast } from "@/components/ui/use-toast";
import type { Get, Set } from "@/features/app-store/types";
import { appModal } from "@/features/modal/consts";

export const signInClick = (set: Set, get: Get) => () => {
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

			const { setOpenAppModal, songLibrary, songSetLibrary } = get();

			switch (signInResult.signInResultType) {
				case signInResultType.NEW:
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
					setOpenAppModal(appModal.REGISTER);

					break;
				case signInResultType.EXISTING:
					// Add to the existing song library
					const userDocSongs = signInResult.songs;
					const userDocSongIds = getKeys(userDocSongs);
					const newSongLibrary = userDocSongIds.reduce((acc, songId) => {
						const existingSong = songLibrary[songId];
						const slimSong = userDocSongs[songId];
						acc[songId] = {
							...existingSong,
							...slimSong,
						};
						return acc;
					}, songLibrary);

					// Add to the existing song set library
					const userDocSongSets = signInResult.songSets;
					const userDocSongSetIds = getKeys(userDocSongSets);
					const newSongSetLibrary = userDocSongSetIds.reduce(
						(acc, songSetId) => {
							const existingSongSet = songSetLibrary[songSetId];
							const slimSongSet = userDocSongSets[songSetId];
							acc[songSetId] = {
								...existingSongSet,
								...slimSongSet,
							};
							return acc;
						},
						songSetLibrary,
					);

					set({
						isSignedIn: true,
						isSigningIn: false,
						lastSignInCheck: 0,
						sessionCookieData: {
							email: signInResult.userData.email,
							picture: signInResult.userData.picture,
							username: signInResult.userData.username,
							roles: signInResult.userData.roles,
							sessionWarningTimestamp: getSessionWarningTimestamp(),
						},
						songLibrary: newSongLibrary,
						songSetLibrary: newSongSetLibrary,
						songId: signInResult.songId,
						songSetId: signInResult.songSetId,
						activeSongId: signInResult.activeSongId,
						activeSongSetId: signInResult.activeSongSetId,
					});
					setOpenAppModal(null);
					toast({ title: "Welcome back!" });
			}
		} catch (error) {
			console.error(error);
		}
	})();
};
