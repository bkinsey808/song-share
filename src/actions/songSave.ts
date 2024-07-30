"use server";

import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { flatten, safeParse } from "valibot";

import { extendSession } from "./extendSession";
import { ActionResultType } from "@/features/app-store/enums";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { UserDoc } from "@/features/firebase/types";
import { SongFieldKey } from "@/features/sections/song/enums";
import {
	SongLibrarySongSchema,
	SongSchema,
} from "@/features/sections/song/schemas";
import type { SlimSong, Song } from "@/features/sections/song/types";

const getFormError = (formError: string) => {
	console.error(formError);
	return {
		actionResultType: ActionResultType.ERROR as ActionResultType.ERROR,
		formError,
	};
};

export type SongSaveResult =
	| {
			actionResultType: ActionResultType.SUCCESS;
			songId: string;
	  }
	| {
			actionResultType: ActionResultType.ERROR;
			formError?: string;
			fieldErrors?:
				| {
						[fieldKey in SongFieldKey]?: string[];
				  }
				| undefined;
	  };

export const songSave = async ({
	song,
	songId,
}: {
	song: Song;
	songId: string | null;
}): Promise<SongSaveResult> => {
	try {
		const result = safeParse(SongSchema, song);
		if (!result.success) {
			return {
				actionResultType: ActionResultType.ERROR,
				fieldErrors: flatten<typeof SongSchema>(result.issues).nested,
			};
		}

		const sessionCookieData = await extendSession();
		if (!sessionCookieData) {
			return getFormError("Session expired");
		}

		const username = sessionCookieData.username;

		if (!username) {
			return getFormError("Username not found");
		}

		const userDocRef = doc(db, "users", sessionCookieData.email);
		const userDoc = await getDoc(userDocRef);
		if (!userDoc.exists()) {
			return getFormError("User not found");
		}

		const userDocData = userDoc.data();
		if (!userDocData) {
			return getFormError("User data not found");
		}

		const userDocResult = safeParse(UserDocSchema, userDocData);
		if (!userDocResult.success) {
			return getFormError("User data is invalid");
		}

		const slimSong: SlimSong = {
			songSetName: song.songName,
			sharer: username,
		};

		const userDocSongs = userDocResult.output.songSets;

		// first, confirm user owns the song
		if (songId && !userDocSongs[songId]) {
			return getFormError("User does not own this song");
		}

		// second update the song in the songs collection, or create it if it doesn't exist
		const songsCollection = collection(db, "songs");
		const songDocRef = songId
			? doc(songsCollection, songId)
			: doc(songsCollection);

		const songSnapshot = await getDoc(songDocRef);
		const songData = songSnapshot.data();
		if (!songData && songId) {
			return getFormError("Song data not found");
		}

		if (songData) {
			const songResult = safeParse(SongLibrarySongSchema, songData);
			if (!songResult.success) {
				console.log(songData);
				return getFormError("Song data is invalid");
			}

			const songLibrarySong = songResult.output;
			if (songId && songLibrarySong.sharer !== username) {
				return getFormError("User does not own this song");
			}
		}

		await setDoc(songDocRef, {
			...song,
			sharer: username,
		});

		const newSongId = songDocRef.id;

		// third, update the slimSong in the userDoc
		const newSongs: UserDoc["songSets"] = {
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
		return getFormError("Failed to save song");
	}
};
