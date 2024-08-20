"use server";

import { doc, setDoc } from "firebase/firestore";

import { sessionExtend } from "./sessionExtend";
import { songGet } from "./songGet";
import { songSetGet } from "./songSetGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { UserDoc } from "@/features/firebase/types";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { SongSet } from "@/features/sections/song-set/types";
import { Song } from "@/features/sections/song/types";

export const songAddToSongSet = async ({
	songId,
	song,
	songSetId,
}: {
	songId: string;
	song: Song;
	songSetId: string;
}) => {
	console.log({ song });
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;

		const { username, uid } = sessionCookieData;
		if (!username) {
			return actionErrorMessageGet("Username not found");
		}

		const songResult = await songGet(songId);
		if (songResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Song not found");
		}
		const existingSong = songResult.song;

		const songSetResult = await songSetGet(songSetId);
		if (songSetResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Song set not found");
		}
		const existingSongSet = songSetResult.songSet;

		const songSetSongList = existingSongSet.songSetSongList;
		if (!songSetSongList) {
			return actionErrorMessageGet("Song set song list not found");
		}

		const newSongSetSongList = [...songSetSongList, songId];

		const songSetSongs = existingSongSet.songSetSongs;
		if (!songSetSongs) {
			return actionErrorMessageGet("Song set songs not found");
		}

		const newSongSetSongs: SongSet["songSetSongs"] = {
			...songSetSongs,
			[songId]: {
				songKey: "",
			},
		};

		const newSongSet: SongSet = {
			...existingSongSet,
			songSetSongList: newSongSetSongList,
			songSetSongs: newSongSetSongs,
		};

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("User doc not found");
		}
		const existinguserDoc = userDocResult.userDoc;

		const userSongSets = existinguserDoc.songSets;
		if (!userSongSets) {
			return actionErrorMessageGet("User song sets not found");
		}

		// update songDocSong
		const newSongDocSong: Song = {
			...existingSong,
			...song,
			sharer: existingSong.sharer,
		};

		const newUserDocSongs: UserDoc["songs"] = {
			...existinguserDoc.songs,
			[songId]: {
				songName: song.songName,
				sharer: existingSong.sharer,
			},
		};

		const newUserSongSets: UserDoc["songSets"] = {
			...userSongSets,
			[songSetId]: {
				songSetName: existingSongSet.songSetName,
				sharer: existingSongSet.sharer,
			},
		};

		const newUserDoc = {
			...existinguserDoc,
			songs: newUserDocSongs,
			songSets: newUserSongSets,
		};

		await setDoc(doc(db, "songs", songId), newSongDocSong);
		await setDoc(doc(db, "songSets", songSetId), newSongSet);
		await setDoc(doc(db, "users", uid), newUserDoc);

		return {
			actionResultType: actionResultType.SUCCESS,
			songSet: newSongSet,
		};
	} catch (error) {
		return actionErrorMessageGet("Failed to add song to song set");
	}
};
