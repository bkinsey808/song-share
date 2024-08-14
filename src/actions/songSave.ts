"use server";

import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { flatten } from "valibot";

import { extendSession } from "./extendSession";
import { getUserDoc } from "./getUserDoc";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { UserDoc } from "@/features/firebase/types";
import { serverParse } from "@/features/global/serverParse";
import { SongSchema } from "@/features/sections/song/schemas";
import type { SlimSong, Song } from "@/features/sections/song/types";

const getFormError = (formError: string) => {
	console.error(formError);
	return {
		actionResultType: actionResultType.ERROR,
		formError,
		fieldErrors: undefined,
	};
};

export const songSave = async ({
	song,
	songId,
}: {
	song: Song;
	songId: string | null;
}) => {
	try {
		const result = serverParse(SongSchema, song);
		if (!result.success) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: flatten<typeof SongSchema>(result.issues).nested,
			};
		}

		const extendSessionResult = await extendSession();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return getFormError("Session expired");
		}

		const sessionCookieData = extendSessionResult.sessionCookieData;

		const username = sessionCookieData.username;

		if (!username) {
			return getFormError("Username not found");
		}

		const userDocResult = await getUserDoc();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return getFormError("Failed to get user doc");
		}
		const { userDoc, userDocRef } = userDocResult;

		const userDocSongs = userDoc.songs;

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
			const songResult = serverParse(SongSchema, songData);
			if (!songResult.success) {
				console.warn(songData);
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
		const slimSong: SlimSong = {
			songName: song.songName,
			sharer: username,
		};

		// third, update the slimSong in the userDoc
		const newSongs: UserDoc["songs"] = {
			...userDocSongs,
			[songId ?? newSongId]: slimSong,
		};

		await updateDoc(userDocRef, {
			songId,
			songs: newSongs,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			songId: songId ?? newSongId,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save song");
	}
};
