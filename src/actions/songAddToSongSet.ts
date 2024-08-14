"use server";

import { doc, setDoc } from "firebase/firestore";

import { extendSession } from "./extendSession";
import { getSong } from "./getSong";
import { getSongSet } from "./getSongSet";
import { getUserDoc } from "./getUserDoc";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { UserDoc } from "@/features/firebase/types";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
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
		const extendSessionResult = await extendSession();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;

		const { username, email } = sessionCookieData;
		if (!username) {
			return getActionErrorMessage("Username not found");
		}

		const songResult = await getSong(songId);
		if (songResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Song not found");
		}
		const existingSong = songResult.song;

		const songSetResult = await getSongSet(songSetId);
		if (songSetResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Song set not found");
		}
		const existingSongSet = songSetResult.songSet;

		const songSetSongList = existingSongSet.songSetSongList;
		if (!songSetSongList) {
			return getActionErrorMessage("Song set song list not found");
		}

		const newSongSetSongList = [...songSetSongList, songId];

		const songSetSongs = existingSongSet.songSetSongs;
		if (!songSetSongs) {
			return getActionErrorMessage("Song set songs not found");
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

		const userDocResult = await getUserDoc();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("User doc not found");
		}
		const existinguserDoc = userDocResult.userDoc;

		const userSongSets = existinguserDoc.songSets;
		if (!userSongSets) {
			return getActionErrorMessage("User song sets not found");
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
		await setDoc(doc(db, "users", email), newUserDoc);

		return {
			actionResultType: actionResultType.SUCCESS,
			songSet: newSongSet,
		};
	} catch (error) {
		return getActionErrorMessage("Failed to add song to song set");
	}
};
