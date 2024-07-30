import { doc, getDoc, setDoc } from "firebase/firestore";

import { extendSession } from "./extendSession";
import { ActionResultType } from "@/features/app-store/enums";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { serverParse } from "@/features/global/serverParse";
import { SongSetLibrarySongSetSchema } from "@/features/sections/song-set/schemas";
import {
	SlimSongSet,
	SongSetLibrarySongSet,
} from "@/features/sections/song-set/types";

export type SongSetLoadResult =
	| {
			actionResultType: ActionResultType.SUCCESS;
			songSetLibrarySongSet: SongSetLibrarySongSet;
	  }
	| {
			actionResultType: ActionResultType.ERROR;
			error: string;
	  };

export const songSetLoad = async (
	songSetId: string,
): Promise<SongSetLoadResult> => {
	try {
		const sessionCookieData = await extendSession();
		if (!sessionCookieData) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "Session expired",
			};
		}

		const { username, email } = sessionCookieData;

		if (!username) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "Username not found",
			};
		}

		if (!email) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "Email not found",
			};
		}

		const songSetDocSnapshot = await getDoc(doc(db, "songSets", songSetId));
		if (!songSetDocSnapshot.exists()) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "Song Set not found",
			};
		}

		const songSetData = songSetDocSnapshot.data();
		if (!songSetData) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "Song Set data not found",
			};
		}

		const songSetLibrarySongSetParseResult = serverParse(
			SongSetLibrarySongSetSchema,
			songSetData,
		);
		if (!songSetLibrarySongSetParseResult.success) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "Song Set data invalid",
			};
		}

		const songSetLibrarySongSet = songSetLibrarySongSetParseResult.output;

		// update user's song library
		const userDocSnapshot = await getDoc(doc(db, "users", email));
		if (!userDocSnapshot.exists()) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: `User not found: ${email}`,
			};
		}

		const userDocData = userDocSnapshot.data();
		if (!userDocData) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "User data not found",
			};
		}

		const userDocResult = serverParse(UserDocSchema, userDocData);
		if (!userDocResult.success) {
			return {
				actionResultType: ActionResultType.ERROR,
				error: "User data invalid",
			};
		}
		const userDoc = userDocResult.output;
		const oldSlimSongSet = userDoc.songSets[songSetId];

		const newSlimSongSet: SlimSongSet = {
			songSetName: songSetLibrarySongSet.songSetName,
			sharer: username,
		};

		const slimSongsAreEqual =
			JSON.stringify(oldSlimSongSet) === JSON.stringify(newSlimSongSet);

		if (!slimSongsAreEqual) {
			userDoc.songSets[songSetId] = newSlimSongSet;
			await setDoc(doc(db, "users", username), userDoc);
		}

		return {
			actionResultType: ActionResultType.SUCCESS,
			songSetLibrarySongSet: songSetLibrarySongSetParseResult.output,
		};
	} catch (error) {
		console.error(error);
		return {
			actionResultType: ActionResultType.ERROR,
			error: "An error occurred",
		};
	}
};
