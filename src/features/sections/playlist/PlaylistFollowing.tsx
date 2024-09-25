import { useAppStore } from "@/features/app-store/useAppStore";

export const PlaylistFollowing = () => {
	const { playlistId, songLibrary, playlistLibrary } = useAppStore();
	const playlist = playlistId ? playlistLibrary[playlistId] : undefined;
	const songs = playlist?.songs ?? [];

	return (
		<div className="flex flex-col gap-[1rem]">
			{songs.length > 0 ? (
				<div>
					<h2 className="border-b border-[currentColor] font-bold">Songs</h2>
					<ul>
						{songs.map(({ songId }) => (
							<li key={songId}>{songLibrary[songId]?.songName}</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
};
