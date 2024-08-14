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
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";

export const SongSetSection = () => {
	const { isSignedIn } = useAppStore();
	const {
		songSetId,
		songSet,
		songLibrary,
		songSetSubmit,
		setIsSongSetUnsaved,
		songSetNewClick,
		setSongSetForm,
		songSetDeleteClick,
		songSetSongLoadClick,
		activeSongId,
		activeSongClick,
		setActiveSongId,
	} = useAppStore();

	const defaultValues = useMemo(
		() => {
			const defaultSongSet: SongSet = {
				songSetName: songSet?.songSetName ?? "",
				sharer: songSet?.sharer ?? "",
				songSetSongList: songSet?.songSetSongList ?? [],
				songSetSongs: songSet?.songSetSongs ?? {},
			};
			return defaultSongSet;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	console.log({ defaultValues, activeSongId });

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
				<form
					onSubmit={async (e) => {
						console.log(e);
						await songSetSubmit(e);
					}}
				>
					<FormField
						control={form.control}
						name="songSetName"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Song Set Name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="p-[1rem]">
						<Grid gridClassName="grid-cols-[1.5rem,3fr,2fr,1fr]">
							<GridHeader>
								<div></div>
								<div>Song Name</div>
								<div>Sharer</div>
								<div>Options</div>
							</GridHeader>
							<RadioGroup
								name="activeSongId"
								id="activeSongId"
								value={activeSongId ?? ""}
							>
								{songIds.map((songId) => (
									<GridRow key={songId}>
										<RadioGroupItem
											className="self-center"
											id={songId}
											value={songId}
											onClick={activeSongClick(songId)}
										/>
										<div>{songLibrary[songId].songName}</div>
										<div>{songLibrary[songId].sharer}</div>
										<div>
											<Button
												onClick={songSetSongLoadClick({ songId, songSetId })}
											>
												Load
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
