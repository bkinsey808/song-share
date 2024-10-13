"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { PlaylistDeleteConfirmModal } from "./PlaylistDeleteConfirmModal";
import { PlaylistSchema } from "./schemas";
import { usePlaylist } from "./slice";
import { Playlist } from "./types";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/features/app-store/useAppStore";
import { useSongLogData } from "@/features/sections/song-log/slice";

export const PlaylistForm = () => {
	const { isSignedIn } = useAppStore();
	const {
		playlistId,
		playlistSubmit,
		playlistIsUnsaved,
		playlistIsUnsavedSet,
		playlistNewClick,
		playlistFormSet,
		playlistDeleteClick,
		playlistDefaultGet,
	} = useAppStore();

	const playlist = usePlaylist();

	const form = useForm<Playlist>({
		resolver: valibotResolver(PlaylistSchema),
		defaultValues: playlistDefaultGet(),
	});

	// keep unsavedPlaylist in sync with form state
	useEffect(() => {
		playlistIsUnsavedSet(form.formState.isDirty);
	}, [form.formState.isDirty, playlistIsUnsavedSet]);

	// set playlist form
	useEffect(() => {
		playlistFormSet(form);
	}, [form, playlistFormSet]);

	useEffect(() => {
		form.reset(playlist);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, playlistId]);

	const songLogData = useSongLogData(
		playlist?.songs?.map(({ songId }) => songId) ?? [],
	);

	console.log({ songLogData });

	return (
		<div>
			<PlaylistDeleteConfirmModal />
			Saved? {playlistIsUnsaved ? "No" : "Yes"}
			<Form {...form}>
				<form onSubmit={playlistSubmit}>
					<FormField
						control={form.control}
						name="playlistName"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Playlist Name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{isSignedIn ? (
						<div className="flex gap-[0.5rem]">
							<Button type="submit" disabled={form.formState.isSubmitting}>
								Save Playlist
							</Button>
							{playlistId ? <Button>Save As...</Button> : null}
							<Button onClick={playlistNewClick}>New Playlist</Button>
							{playlistId ? (
								<Button variant="destructive" onClick={playlistDeleteClick}>
									Delete Playlist
								</Button>
							) : null}
						</div>
					) : null}
				</form>
			</Form>
		</div>
	);
};
