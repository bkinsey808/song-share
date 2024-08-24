"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const SongTitle = () => {
	const { song, usernameGet } = useAppStore();

	return (
		<div className="flex flex-grow justify-between">
			<span>
				<span>Song{song?.songName ? `: ` : null}</span>
				<span className="overflow-hidden text-ellipsis text-nowrap">
					{song?.songName}
				</span>
			</span>
			{song?.sharer ? <span>Sharer: {usernameGet(song.sharer)}</span> : null}
		</div>
	);
};
