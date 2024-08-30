import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

import { signInResultType } from "./consts";
import { sessionWarningTimestampGet } from "./sessionWarningTimestampGet";
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
			const { email, uid } = userCredential.user;
			if (!email) {
				throw new Error("Email is not defined");
			}

			const { setOpenAppModal, fuid, songIds, songSetIds } = get();

			const signInResult = await signIn(uid);

			switch (signInResult.signInResultType) {
				case signInResultType.NEW:
					set({
						isSignedIn: false,
						isSigningIn: false,
						sessionCookieData: {
							uid,
							email,
							picture: userCredential.user.photoURL ?? null,
							username: null,
							roles: [],
							sessionWarningTimestamp: sessionWarningTimestampGet(),
						},
					});
					setOpenAppModal(appModal.REGISTER);

					break;
				case signInResultType.EXISTING:
					set({
						isSignedIn: true,
						isSigningIn: false,
						lastSignInCheck: 0,
						sessionCookieData: {
							uid: signInResult.userData.uid,
							email: signInResult.userData.email,
							picture: signInResult.userData.picture,
							username: signInResult.userData.username,
							roles: signInResult.userData.roles,
							sessionWarningTimestamp: sessionWarningTimestampGet(),
						},
						songIds: Array.from(new Set([...signInResult.songIds, ...songIds])),
						songSetIds: Array.from(
							new Set([...signInResult.songSetIds, ...songSetIds]),
						),
						songId: signInResult.songId,
						songSetId: signInResult.songSetId,
						songActiveId: signInResult.songActiveId,
						songSetActiveId: signInResult.songSetActiveId,
						fuid: uid === fuid ? null : uid,
					});

					setOpenAppModal(null);
					toast({ title: "Welcome back!" });
			}
		} catch (error) {
			console.error(error);
		}
	})();
};
