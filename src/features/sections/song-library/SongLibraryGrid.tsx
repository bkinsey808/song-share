"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "@radix-ui/react-icons";
import { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
	SongLibrarySort,
	songLibrarySortDefault,
	songLibrarySortOptions,
} from "./consts";
import { SongLibraryGridFormSchema } from "./schemas";
import { useSortedFilteredSongIds } from "./slice";
import { SongLibraryGridForm } from "./types";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/features/app-store/useAppStore";
import { tw } from "@/features/global/tw";
import { useFormSubmitOnChange } from "@/features/global/useFormSubmitOnChange";
import { Grid } from "@/features/grid/Grid";
import { GridHeader } from "@/features/grid/GridHeader";
import { GridRow } from "@/features/grid/GridRow";

export const SongLibraryGrid = () => {
	const {
		songLoadClick,
		songActiveId,
		songNameGet,
		songKeyGet,
		songActiveClick,
		fuid,
		songLibrarySort,
		songLibrarySortSet,
		songLibrarySearch,
		songLibraryGridFormSubmit,
		songLibraryGridFormSet,
		isSignedIn,
		songDeleteClick,
		isSharer,
	} = useAppStore();

	const form = useForm<SongLibraryGridForm>({
		resolver: valibotResolver(SongLibraryGridFormSchema),
		defaultValues: {
			sort: songLibrarySort,
			search: songLibrarySearch ?? "",
		},
	});

	// set form
	useEffect(() => {
		if (form) {
			songLibraryGridFormSet(form);
		}
	}, [form, songLibraryGridFormSet]);

	// update form if sort ever changes
	useEffect(() => {
		form.setValue("sort", songLibrarySort);
	}, [form, songLibrarySort]);

	const [sortSearch, setSortSearch] = useState("");

	const songIds = useSortedFilteredSongIds();

	useFormSubmitOnChange({
		form,
		onSubmit: songLibraryGridFormSubmit,
	});

	return (
		<>
			{/* isDirty: {form.formState.isDirty.toString()} */}
			<Form {...form}>
				<form
					onSubmit={songLibraryGridFormSubmit}
					className="flex gap-[1rem] pr-[0.1rem]"
				>
					<FormField
						name="search"
						control={form.control}
						render={({ field }) => (
							<FormItem className="w-[10rem] flex-grow">
								<FormLabel>Search</FormLabel>
								<FormControl>
									<Input className="h-[1.6rem]" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						name="sort"
						control={form.control}
						render={({ field }) => (
							<FormItem className="h-[3rem] w-[10rem]">
								<FormLabel>Sort</FormLabel>
								<FormControl>
									<Combobox
										options={songLibrarySortOptions}
										label="sort"
										search={sortSearch}
										setSearch={setSortSearch}
										disabled={form.formState.isSubmitting}
										valueDefault={songLibrarySortDefault}
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</form>
			</Form>
			<Button
				className="mb-[1rem] mt-[0.2rem]"
				disabled={
					form.formState.isSubmitting ||
					(form.getValues("sort") === songLibrarySortDefault &&
						form.getValues("search") === "")
				}
				onClick={() => {
					form.reset({ sort: songLibrarySortDefault, search: "" });
					const formEvent = new Event("submit", {
						bubbles: true,
						cancelable: true,
					});
					void songLibraryGridFormSubmit(
						formEvent as unknown as FormEvent<HTMLFormElement>,
					);
				}}
			>
				Reset Search and Sort
			</Button>
			<RadioGroup
				name="songActiveId"
				id="songActiveId"
				value={songActiveId ?? ""}
				disabled={!isSignedIn}
			>
				<Grid
					fixedClassName={tw`grid-cols-[1.5rem,15rem]`}
					scrollingClassName={tw`grid-cols-[2rem,4rem]`}
				>
					<GridHeader>
						<div></div>
						<Button
							variant="outline"
							className="justify-start font-bold"
							onClick={() => {
								if (songLibrarySort === SongLibrarySort.SONG_NAME_ASC) {
									songLibrarySortSet(SongLibrarySort.SONG_NAME_DESC)();
								} else {
									songLibrarySortSet(SongLibrarySort.SONG_NAME_ASC)();
								}
							}}
						>
							<span className="flex gap-[0.3rem] align-middle">
								<span className="mt-[0.2rem]">
									{songLibrarySort === SongLibrarySort.SONG_NAME_ASC ? (
										<ArrowUpIcon />
									) : null}
									{songLibrarySort === SongLibrarySort.SONG_NAME_DESC ? (
										<ArrowDownIcon />
									) : null}
								</span>
								Song Name
							</span>
						</Button>
						<div>Key</div>
						<div>Options</div>
					</GridHeader>
					{songIds.map((songId) => (
						<GridRow key={songId}>
							<div className="grid items-center justify-center">
								<RadioGroupItem
									className="self-center"
									id={songId}
									disabled={!!fuid}
									value={songId}
									onClick={songActiveClick({
										songId,
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
							<div>{songKeyGet(songId)}</div>
							<div>
								{isSharer(songId) ? (
									<Button
										type="button"
										variant="outline"
										size="icon"
										className="size-8 shrink-0"
										onClick={songDeleteClick(songId)}
									>
										<TrashIcon
											className="size-4 text-destructive"
											aria-hidden="true"
										/>
										<span className="sr-only">Delete Song</span>
									</Button>
								) : null}
							</div>
						</GridRow>
					))}
				</Grid>
			</RadioGroup>
		</>
	);
};
