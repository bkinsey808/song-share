"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { SongSetDeleteConfirmModal } from "./SongSetDeleteConfirmModal";
import { SongSetSchema } from "./schemas";
import { SongSet } from "./types";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	useAppSliceStore,
	useAppStore,
} from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";

export const SongSetSection = () => {
	const { isSignedIn } = useAppSliceStore();
	const {
		songSetId,
		songSet,
		songLibrary,
		songSetSubmit,
		setIsSongSetUnsaved,
		isSongSetUnsaved,
		songSetNewClick,
		setSongSetForm,
		songSetDeleteClick,
		songSetSongLoadClick,
	} = useAppStore();

	const defaultValues: SongSet = useMemo(
		() => ({
			songSetName: songSet?.songSetName ?? "",
			sharer: songSet?.sharer ?? "",
			songSetSongList: songSet?.songSetSongList ?? [],
			songSetSongs: songSet?.songSetSongs ?? {},
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const songIds = songSet.songSetSongList ?? [];

	const form = useForm<SongSet>({
		resolver: valibotResolver(SongSetSchema),
		defaultValues,
	});

	// keep unsavedSongSet in sync with form state
	useEffect(() => {
		setIsSongSetUnsaved(form.formState.isDirty);
	}, [form.formState.isDirty, setIsSongSetUnsaved]);

	// handle load song set from song set library
	useEffect(() => {
		form.reset(defaultValues);
	}, [form, defaultValues]);

	// set song form
	useEffect(() => {
		setSongSetForm(form);
	}, [form, setSongSetForm]);

	return (
		<div suppressHydrationWarning={true}>
			<SongSetDeleteConfirmModal />
			<Form {...form}>
				<div suppressHydrationWarning={true}>
					isDirty: {isSongSetUnsaved.toString()}
				</div>
				<form onSubmit={songSetSubmit}>
					<FormField
						control={form.control}
						name="songSetName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Song Set name</FormLabel>
								<FormControl>
									<Input placeholder="Song Set Name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Grid gridClassName="grid-cols-[3fr,2fr,1fr]">
						<GridHeader>
							<div>Song Name</div>
							<div>Sharer</div>
							<div>Options</div>
						</GridHeader>
						{songIds.map((songId) => (
							<GridRow key={songId}>
								<div>{songLibrary[songId].songName}</div>
								<div>{songLibrary[songId].sharer}</div>
								<div>
									<Button onClick={songSetSongLoadClick({ songId, songSetId })}>
										Load
									</Button>
								</div>
							</GridRow>
						))}
					</Grid>

					{isSignedIn ? (
						<div className="flex gap-[0.5rem]">
							<Button type="submit" disabled={form.formState.isSubmitting}>
								Save
							</Button>
							{songSetId ? <Button>Save As...</Button> : null}
							<Button onClick={songSetNewClick}>New</Button>
							{songSetId ? (
								<Button variant="destructive" onClick={songSetDeleteClick}>
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
