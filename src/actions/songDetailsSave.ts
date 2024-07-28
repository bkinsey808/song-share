"use server";

import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { flatten, safeParse } from "valibot";

import { extendSession } from "./extendSession";
import { ActionResultType } from "@/features/app-store/enums";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { UserDoc } from "@/features/firebase/types";
import { SongDetailsFieldKey } from "@/features/sections/song/enums";
import { SongSchema } from "@/features/sections/song/schemas";
import type { SlimSong, SongDetails } from "@/features/sections/song/types";

export type SongDetailsSaveResult =
	| {
			actionResultType: ActionResultType.SUCCESS;
			songId: string;
	  }
	| {
			actionResultType: ActionResultType.ERROR;
			formError?: string;
			fieldErrors?:
				| {
						[fieldKey in SongDetailsFieldKey]?: string[];
				  }
				| undefined;
	  };

export const songDetailsSave = async ({
	songDetails,
	songId,
}: {
	songDetails: SongDetails;
	songId: string | null;
}): Promise<SongDetailsSaveResult> => {
	try {
		const result = safeParse(SongSchema, songDetails);
		if (!result.success) {
			return {
				actionResultType: ActionResultType.ERROR,
				fieldErrors: flatten<typeof SongSchema>(result.issues).nested,
			};
		}

		const sessionCookieData = await extendSession();
		if (!sessionCookieData) {
			return {
				actionResultType: ActionResultType.ERROR,
				formError: "Session expired",
			};
		}

		const username = sessionCookieData.username;

		if (!username) {
			return {
				actionResultType: ActionResultType.ERROR,
				formError: "Username not found",
			};
		}

		const userDocRef = doc(db, "users", sessionCookieData.email);
		const userDoc = await getDoc(userDocRef);
		if (!userDoc.exists()) {
			return {
				actionResultType: ActionResultType.ERROR,
				formError: "User not found",
			};
		}
		const userDocData = userDoc.data();
		if (!userDocData) {
			return {
				actionResultType: ActionResultType.ERROR,
				formError: "User data not found",
			};
		}
		const userDocResult = safeParse(UserDocSchema, userDocData);
		if (!userDocResult.success) {
			return {
				actionResultType: ActionResultType.ERROR,
				formError: "User data is invalid",
			};
		}

		const slimSong: SlimSong = {
			songName: songDetails.songName,
			sharer: username,
		};

		const userDocSongs = userDocResult.output.songs;

		// first, confirm user owns the song
		if (songId && !userDocSongs[songId]) {
			return {
				actionResultType: ActionResultType.ERROR,
				formError: "User does not own this song",
			};
		}

		// second update the song in the songs collection, or create it if it doesn't exist
		const songsCollection = collection(db, "songs");
		const songDocRef = songId
			? doc(songsCollection, songId)
			: doc(songsCollection);
		await setDoc(songDocRef, {
			...songDetails,
			sharer: username,
		});

		const newSongId = songDocRef.id;

		// third, update the slimSong in the userDoc
		const newSongs: UserDoc["songs"] = {
			...userDocSongs,
			[songId ?? newSongId]: slimSong,
		};

		await setDoc(userDocRef, {
			...userDocResult.output,
			songs: newSongs,
		});

		return {
			actionResultType: ActionResultType.SUCCESS,
			songId: songId ?? newSongId,
		};
	} catch (error) {
		console.error({ error });
		return {
			actionResultType: ActionResultType.ERROR,
			formError: "Failed to save song",
		};
	}
};
