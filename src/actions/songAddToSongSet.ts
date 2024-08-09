import { doc, getDoc, setDoc } from "firebase/firestore";

import { extendSession } from "./extendSession";
import { ActionResultType } from "@/features/app-store/enums";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { UserDoc } from "@/features/firebase/types";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
import { serverParse } from "@/features/global/serverParse";
import { SongSetSchema } from "@/features/sections/song-set/schemas";
import { SongSet } from "@/features/sections/song-set/types";
import { SongSchema } from "@/features/sections/song/schemas";
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
	try {
		const extendSessionResult = await extendSession();

		if (extendSessionResult.actionResultType === ActionResultType.ERROR) {
			return getActionErrorMessage("Session expired");
		}

		const sessionCookieData = extendSessionResult.sessionCookieData;

		if (!sessionCookieData) {
			return getActionErrorMessage("Session expired");
		}

		const { username, email } = sessionCookieData;

		if (!username) {
			return getActionErrorMessage("Username not found");
		}

		// get song data
		const songDocSnapshot = await getDoc(doc(db, "songs", songId));
		if (!songDocSnapshot.exists()) {
			return getActionErrorMessage("Song not found");
		}

		const songData = songDocSnapshot.data();
		if (!songData) {
			return getActionErrorMessage("Song data not found");
		}

		const songParseResult = serverParse(SongSchema, songData);
		if (!songParseResult.success) {
			return getActionErrorMessage("Song data invalid");
		}

		const existingSong = songParseResult.output;

		// get song set data
		const songSetDocSnapshot = await getDoc(doc(db, "songSets", songSetId));
		if (!songSetDocSnapshot.exists()) {
			return getActionErrorMessage("Song set not found");
		}

		const songSetData = songSetDocSnapshot.data();
		if (!songSetData) {
			return getActionErrorMessage("Song set data not found");
		}

		const songSetParseResult = serverParse(SongSetSchema, songSetData);
		if (!songSetParseResult.success) {
			return getActionErrorMessage("Song set data invalid");
		}

		const existingSongSet = songSetParseResult.output;

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

		// update user's song set
		const userDocSnapshot = await getDoc(doc(db, "users", email));
		if (!userDocSnapshot.exists()) {
			return getActionErrorMessage(`User not found: ${email}`);
		}

		const userDocData = userDocSnapshot.data();
		if (!userDocData) {
			return getActionErrorMessage("User data not found");
		}

		const userDocDataParseResult = serverParse(UserDocSchema, userDocData);
		if (!userDocDataParseResult.success) {
			return getActionErrorMessage("User data invalid");
		}

		const existinguserDoc = userDocDataParseResult.output;

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
			actionResultType: ActionResultType.SUCCESS as const,
			songSet: newSongSet,
		};
	} catch (error) {
		return getActionErrorMessage("Failed to add song to song set");
	}
};
