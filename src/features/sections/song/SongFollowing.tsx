import { AvatarIcon, HandIcon } from "@radix-ui/react-icons";

import { useSong } from "./slice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";

export const SongFollowing = () => {
	const song = useSong();
	const {
		isSignedIn,
		songRequestAddClick,
		songId,
		songRequestPending,
		songRequestAdded,
		songRequestRemoveClick,
		songRequests,
		usernameGet,
	} = useAppStore();
	const { credits, lyrics, translation } = song ?? {};

	const songRequestUserIds = songId ? (songRequests?.[songId] ?? []) : [];

	return (
		<div className="flex flex-col gap-[1rem]">
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
			{credits ? (
				<div>
					<h2 className="border-b border-[currentColor] font-bold">Credits</h2>
					<div className="whitespace-pre-line">{credits}</div>
				</div>
			) : null}
			{songRequestUserIds.length > 0 ? (
				<div>
					<h2 className="mb-[0.5rem] border-b border-[currentColor] font-bold">
						Requested by
					</h2>
					{songRequestUserIds.map((userId) => (
						<Badge className="mr-[0.5rem]" key={userId} variant="secondary">
							<HandIcon className="mr-[0.2rem] inline" />
							<AvatarIcon className="mr-[0.2rem] inline" />
							<div>{usernameGet(userId)}</div>
						</Badge>
					))}
				</div>
			) : null}

			{isSignedIn && songId ? (
				<div>
					{songId && !songRequestAdded(songId) ? (
						<Button
							disabled={songRequestPending}
							onClick={songRequestAddClick(songId)}
						>
							Request Song
						</Button>
					) : null}

					{songId && songRequestAdded(songId) ? (
						<Button
							disabled={songRequestPending}
							onClick={songRequestRemoveClick({ songId })}
						>
							Cancel Request Song
						</Button>
					) : null}
				</div>
			) : null}
		</div>
	);
};
