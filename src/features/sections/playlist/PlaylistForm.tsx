"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { PlaylistDeleteConfirmModal } from "./PlaylistDeleteConfirmModal";
import { PlaylistSchema } from "./schemas";
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
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";

export const PlaylistForm = () => {
	const { isSignedIn } = useAppStore();
	const {
		playlistId,
		playlist,
		songLibrary,
		playlistSubmit,
		playlistIsUnsavedSet,
		playlistNewClick,
		playlistFormSet,
		playlistDeleteClick,
		songRemoveClick,
		songActiveId,
		songActiveClick,
		fuid,
		songLoadClick,
	} = useAppStore();

	const defaultValues = useMemo(
		() => {
			const defaultPlaylist: Playlist = {
				playlistName: playlist?.playlistName ?? "",
				sharer: playlist?.sharer ?? "",
				songIds: playlist?.songIds ?? [],
			};
			return defaultPlaylist;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const songIds = Array.from(new Set(playlist?.songIds)) ?? [];

	const form = useForm<Playlist>({
		resolver: valibotResolver(PlaylistSchema),
		defaultValues,
	});

	// keep unsavedPlaylist in sync with form state
	useEffect(() => {
		playlistIsUnsavedSet(form.formState.isDirty);
	}, [form.formState.isDirty, playlistIsUnsavedSet]);

	// handle load playlist from playlist library
	useEffect(() => {
		form.reset(defaultValues);
	}, [form, defaultValues]);

	// set song form
	useEffect(() => {
		playlistFormSet(form);
	}, [form, playlistFormSet]);

	return (
		<div>
			<PlaylistDeleteConfirmModal />
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

					<div className="p-[1rem]">
						<Grid gridClassName="grid-cols-[1.5rem,2fr,1fr]">
							<GridHeader>
								<div></div>
								<div>Song Name</div>
								<div>Options</div>
							</GridHeader>
							<RadioGroup
								name="songActiveId"
								id="songActiveId"
								value={songActiveId ?? ""}
							>
								{playlistId &&
									songIds.map((songId) => (
										<GridRow key={songId}>
											<RadioGroupItem
												className="self-center"
												id={songId}
												disabled={!!fuid}
												value={songId}
												onClick={songActiveClick({ songId, playlistId })}
											/>
											<div>{songLibrary[songId]?.songName}</div>
											<div className="flex gap-[0.5rem]">
												<Button onClick={songLoadClick(songId)}>Load</Button>
												<Button
													variant="destructive"
													onClick={songRemoveClick({ songId, playlistId })}
												>
													Remove
												</Button>
											</div>
										</GridRow>
									))}
							</RadioGroup>
						</Grid>
					</div>

					{isSignedIn ? (
						<div className="flex gap-[0.5rem]">
							<Button type="submit" disabled={form.formState.isSubmitting}>
								Save
							</Button>
							{playlistId ? <Button>Save As...</Button> : null}
							<Button onClick={playlistNewClick}>New</Button>
							{playlistId ? (
								<Button variant="destructive" onClick={playlistDeleteClick}>
									Delete
								</Button>
							) : null}
						</div>
					) : null}
				</form>
			</Form>
		</div>
	);
};
