"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { DragHandleDots2Icon, TrashIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";

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
import {
	Sortable,
	SortableDragHandle,
	SortableItem,
} from "@/components/ui/sortable";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";

export const PlaylistForm = () => {
	const { isSignedIn } = useAppStore();
	const {
		playlistId,
		playlist,
		songLibrary,
		playlistSubmit,
		playlistIsUnsaved,
		playlistIsUnsavedSet,
		playlistNewClick,
		playlistFormSet,
		playlistDeleteClick,
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
				songs: playlist?.songs ?? [],
			};
			return defaultPlaylist;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const form = useForm<Playlist>({
		resolver: valibotResolver(PlaylistSchema),
		defaultValues,
	});

	const { fields, append, move, remove } = useFieldArray({
		control: form.control,
		name: "songs",
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

					<div className="p-[1rem]">
						<Grid gridClassName="grid-cols-[1.5rem,2fr,5rem]">
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
								<Sortable
									value={fields}
									onMove={({ activeIndex, overIndex }) =>
										move(activeIndex, overIndex)
									}
									overlay={
										<div className="grid grid-cols-[1.5rem,2fr,5rem] gap-[0.5rem]">
											<div className="h-[2rem] shrink-0 rounded-sm bg-primary/10" />
											<div className="h-[2rem] w-full rounded-sm bg-primary/10" />
											<div className="h-[2rem] shrink-0 rounded-sm bg-primary/10" />
										</div>
									}
								>
									{playlistId &&
										fields.map((field, index) => {
											const songId = field.songId;
											return (
												<SortableItem key={field.id} value={field.id} asChild>
													<GridRow key={songId}>
														<div className="align-center grid justify-center">
															<RadioGroupItem
																className="self-center"
																id={songId}
																disabled={!!fuid}
																value={songId}
																onClick={songActiveClick({
																	songId,
																	playlistId,
																})}
															/>
														</div>
														<div className="">
															<Button
																variant="outline"
																className="min-h-[2rem] w-full justify-start"
																onClick={songLoadClick(songId)}
																title="Load song"
															>
																{songLibrary[songId]?.songName}
															</Button>
														</div>
														<div className="flex gap-[0.5rem]">
															<SortableDragHandle
																variant="outline"
																size="icon"
																className="size-8 shrink-0"
																title="Drag to reorder"
															>
																<DragHandleDots2Icon
																	className="size-4"
																	aria-hidden="true"
																/>
															</SortableDragHandle>

															<Button
																variant="outline"
																onClick={() => remove(index)}
																title="Remove song from playlist"
															>
																<TrashIcon
																	className="size-4 text-destructive"
																	aria-hidden="true"
																/>
															</Button>
														</div>
													</GridRow>
												</SortableItem>
											);
										})}
								</Sortable>
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
