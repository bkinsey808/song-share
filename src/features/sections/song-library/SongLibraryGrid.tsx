"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
	SongLibrarySort,
	songLibrarySortDefault,
	songLibrarySortOptions,
} from "./consts";
import { SongLibraryGridFormSchema } from "./schemas";
import { useSortedSongIds } from "./slice";
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
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";
import { useFormSubmitOnChange } from "@/features/global/useFormSubmitOnChange";

export const SongLibraryGrid = () => {
	const {
		songLoadClick,
		songActiveId,
		songNameGet,
		songActiveClick,
		fuid,
		songLibrarySort,
		songLibrarySortSet,
		songLibrarySearch,
		songLibraryGridFormSubmit,
		songLibraryGridFormSet,
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

	const songIds = useSortedSongIds();

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
					className="mb-[1rem] flex gap-[1rem] pr-[0.1rem]"
				>
					<FormField
						name="sort"
						control={form.control}
						render={({ field }) => (
							<FormItem className="h-[3rem] w-[10rem]">
								<FormLabel>Sort By</FormLabel>
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
				</form>
			</Form>
			<Grid gridClassName="grid-cols-[1.5rem,3fr,1fr]">
				<GridHeader>
					<div></div>
					<Button
						variant="outline"
						className="justify-start"
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
					<div>Options</div>
				</GridHeader>
				<RadioGroup
					name="songActiveId"
					id="songActiveId"
					value={songActiveId ?? ""}
				>
					{songIds.map((songId) => (
						<GridRow key={songId}>
							<div className="align-center grid justify-center">
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
							<div></div>
						</GridRow>
					))}
				</RadioGroup>
			</Grid>
		</>
	);
};
