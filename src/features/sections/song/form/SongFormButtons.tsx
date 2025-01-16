import { JSX } from "react";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";

export const SongFormButtons = (): JSX.Element | null => {
	const {
		songId,
		songNewClick,
		songDeleteClick,
		playlistSongAddButtonShouldShow,
		playlistSongAdding,
		playlistSongAddClick,
		songRequestAddClick,
		songRequestAdded,
		songRequestRemoveClick,
		songRequestPending,
		songForm,
	} = useAppStore();

	if (!songForm) {
		return null;
	}

	return (
		<div className="flex flex-wrap gap-[0.5rem]">
			<Button type="submit" disabled={songForm.formState.isSubmitting}>
				Save Song
			</Button>
			{songId ? <Button>Save Song As...</Button> : null}
			{playlistSongAddButtonShouldShow() ? (
				<Button disabled={playlistSongAdding} onClick={playlistSongAddClick()}>
					Add Song to Playlist
				</Button>
			) : null}
			<Button onClick={songNewClick}>New Song</Button>
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

			{songId ? (
				<Button variant="destructive" onClick={songDeleteClick(songId)}>
					Delete Song
				</Button>
			) : null}
		</div>
	);
};
