import { useAppStore } from "@/features/app-store/useAppStore";

export const SongFollowing = () => {
	const { song } = useAppStore();
	const { credits, lyrics, translation } = song ?? {};

	return (
		<div className="flex flex-col gap-[1rem]">
			{credits ? (
				<div>
					<h2 className="border-b border-[currentColor] font-bold">Credits</h2>
					<div className="whitespace-pre-line">{credits}</div>
				</div>
			) : null}
			{lyrics ? (
				<div>
					<h2 className="border-b border-[currentColor] font-bold">Lyrics</h2>
					<div className="whitespace-pre-line">{lyrics}</div>
				</div>
			) : null}
			{translation ? (
				<div>
					<h2 className="border-b border-[currentColor] font-bold">
						Translation
					</h2>
					<div className="whitespace-pre-line">{translation}</div>
				</div>
			) : null}
		</div>
	);
};
