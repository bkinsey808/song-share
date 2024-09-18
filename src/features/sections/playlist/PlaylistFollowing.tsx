import { useAppStore } from "@/features/app-store/useAppStore";

export const PlaylistFollowing = () => {
	const { playlist, songLibrary } = useAppStore();
	const songIds = playlist?.songIds ?? [];

	return (
		<div className="flex flex-col gap-[1rem]">
			{songIds.length > 0 ? (
				<div>
					<h2 className="border-b border-[currentColor] font-bold">Songs</h2>
					<ul>
						{songIds.map((songId) => (
							<li key={songId}>{songLibrary[songId]?.songName}</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
};
