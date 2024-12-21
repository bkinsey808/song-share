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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/features/app-store/useAppStore";

export const PlaylistForm = () => {
	const { isSignedIn } = useAppStore();
	const {
		playlistId,
		playlistSubmit,
		playlistIsUnsavedSet,
		playlistNewClick,
		playlistFormSet,
		playlistDeleteClick,
		playlistDefaultGet,
		playlistActiveId,
		playlistActiveClick,
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

	return (
		<div>
			<PlaylistDeleteConfirmModal />
			Playlist ID: {playlistId}
			{/* Saved? {playlistIsUnsaved ? "No" : "Yes"} */}
			<Form {...form}>
				<form onSubmit={playlistSubmit}>
					<div className="mr-[0.1rem] flex flex-wrap gap-[0.5rem]">
						{playlistId && isSignedIn ? (
							<RadioGroup
								name="playlistActiveId"
								id="playlistActiveId"
								value={playlistActiveId ?? ""}
							>
								<RadioGroupItem
									className="self-center"
									id={playlistId}
									value={playlistId}
									onClick={playlistActiveClick(playlistId)}
								/>
							</RadioGroup>
						) : null}

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
					</div>

					{isSignedIn ? (
						<div className="flex flex-wrap gap-[0.5rem]">
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
