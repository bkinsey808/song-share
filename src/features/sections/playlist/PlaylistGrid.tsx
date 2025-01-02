import { valibotResolver } from "@hookform/resolvers/valibot";
import { DragHandleDots2Icon, TrashIcon } from "@radix-ui/react-icons";
import { JSX, useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { PlaylistGridFormSchema } from "./schemas";
import { usePlaylist } from "./slice";
import { PlaylistGridForm } from "./types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Sortable,
	SortableDragHandle,
	SortableItem,
} from "@/components/ui/sortable";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";
import { tw } from "@/features/global/tw";
import { useFormSubmitOnChange } from "@/features/global/useFormSubmitOnChange";

export const PlaylistGrid = (): JSX.Element => {
	const {
		playlistId,
		songActiveId,
		songActiveClick,
		fuid,
		songLoadClick,
		songNameGet,
		playlistGridFormSubmit,
		playlistGridFormSet,
	} = useAppStore();

	const playlist = usePlaylist();

	const defaultValues = useMemo(() => {
		const playlistSongs = playlist?.songs ?? [];
		const defaultPlaylistForm: PlaylistGridForm = {
			songs: playlistSongs,
		};
		return defaultPlaylistForm;
	}, [playlist]);

	const form = useForm<PlaylistGridForm>({
		resolver: valibotResolver(PlaylistGridFormSchema),
		defaultValues,
	});

	const { fields, move, remove } = useFieldArray({
		control: form.control,
		name: "songs",
	});

	// we want to reset the form when the playlistId changes
	useEffect(() => {
		form.reset(defaultValues);
	}, [defaultValues, form, playlistId]);

	useFormSubmitOnChange({
		form,
		onSubmit: playlistGridFormSubmit,
	});

	// set playlist gridform
	useEffect(() => {
		playlistGridFormSet(form);
	}, [form, playlistGridFormSet]);

	return (
		<Form {...form}>
			{/* isDirty: {form.formState.isDirty.toString()} */}
			<form onSubmit={playlistGridFormSubmit}>
				<Grid gridClassName={tw`grid-cols-[1.5rem,2fr,5rem]`}>
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
												<div>
													<Button
														variant="outline"
														className="min-h-[2rem] w-full justify-start"
														onClick={songLoadClick(songId)}
														title="Load song"
													>
														{songNameGet(songId)}
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
			</form>
		</Form>
	);
};
