"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	AvatarIcon,
	Cross1Icon,
	HandIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import { FormEvent, JSX, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
	SongRequestsSort,
	songRequestsSortDefault,
	songRequestsSortOptions,
} from "./consts";
import { SongRequestsGridFormSchema } from "./schemas";
import { useSortedFilteredSongRequestSongIds } from "./slice";
import { SongRequestsGridForm } from "./types";
import { Badge } from "@/components/ui/badge";
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
import { tw } from "@/features/global/tw";
import { useFormSubmitOnChange } from "@/features/global/useFormSubmitOnChange";

export const SongRequestsGrid = (): JSX.Element => {
	const {
		songLoadClick,
		songActiveId,
		songNameGet,
		songActiveClick,
		fuid,
		songRequestsSort,
		songRequestsSortSet,
		songRequestsSearch,
		songRequestsGridFormSubmit,
		songRequestsGridFormSet,
		songRequests,
		usernameGet,
		songRequestRemoveClick,
		songRequestsRemoveAllClick,
	} = useAppStore();

	const form = useForm<SongRequestsGridForm>({
		resolver: valibotResolver(SongRequestsGridFormSchema),
		defaultValues: {
			sort: songRequestsSort,
			search: songRequestsSearch ?? "",
		},
	});

	// set form
	useEffect(() => {
		if (form) {
			songRequestsGridFormSet(form);
		}
	}, [form, songRequestsGridFormSet]);

	// update form if sort ever changes
	useEffect(() => {
		form.setValue("sort", songRequestsSort);
	}, [form, songRequestsSort]);

	const [sortSearch, setSortSearch] = useState("");

	const songIds = useSortedFilteredSongRequestSongIds();

	useFormSubmitOnChange({
		form,
		onSubmit: songRequestsGridFormSubmit,
	});

	return (
		<>
			{/* isDirty: {form.formState.isDirty.toString()} */}
			<Form form={form}>
				<form
					onSubmit={songRequestsGridFormSubmit}
					className="flex gap-[1rem] pr-[0.1rem]"
				>
					<FormField
						name="search"
						control={form.control}
						render={({
							field: { name, onBlur, onChange, ref, value, disabled },
						}) => (
							<FormItem className="w-[10rem] flex-grow">
								<FormLabel>Search</FormLabel>
								<FormControl>
									<Input
										className="h-[1.6rem]"
										name={name}
										onBlur={onBlur}
										onChange={onChange}
										ref={ref}
										value={value}
										disabled={!!disabled}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						name="sort"
						control={form.control}
						render={({
							field: { name, onBlur, onChange, ref, value, disabled },
						}) => (
							<FormItem className="h-[3rem] w-[10rem]">
								<FormLabel>Sort</FormLabel>
								<FormControl>
									<Combobox
										options={songRequestsSortOptions}
										label="sort"
										search={sortSearch}
										setSearch={setSortSearch}
										disabled={form.formState.isSubmitting || !!disabled}
										valueDefault={songRequestsSortDefault}
										{...{ name, onBlur, onChange, ref, value }}
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
					(form.getValues("sort") === songRequestsSortDefault &&
						form.getValues("search") === "")
				}
				onClick={() => {
					form.reset({ sort: songRequestsSortDefault, search: "" });
					const formEvent = new Event("submit", {
						bubbles: true,
						cancelable: true,
					});
					void songRequestsGridFormSubmit(
						formEvent as unknown as FormEvent<HTMLFormElement>,
					);
				}}
			>
				Reset Search and Sort
			</Button>
			<Grid gridClassName={tw`grid-cols-[1.5rem,3fr,1fr]`}>
				<GridHeader>
					<div></div>
					<Button
						variant="outline"
						className="justify-start"
						onClick={() => {
							if (songRequestsSort === SongRequestsSort.SONG_NAME_ASC) {
								songRequestsSortSet(SongRequestsSort.SONG_NAME_DESC)();
							} else {
								songRequestsSortSet(SongRequestsSort.SONG_NAME_ASC)();
							}
						}}
					>
						<span className="flex gap-[0.3rem] align-middle">
							<span className="mt-[0.2rem]">
								{songRequestsSort === SongRequestsSort.SONG_NAME_ASC ? (
									<ArrowUpIcon />
								) : null}
								{songRequestsSort === SongRequestsSort.SONG_NAME_DESC ? (
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
							<div className="flex gap-[0.5rem]">
								<Button
									variant="outline"
									title="Remove all requests for this song"
									onClick={songRequestsRemoveAllClick(songId)}
								>
									<TrashIcon className="text-[1rem] text-destructive" />
								</Button>
							</div>
							<div className="col-span-full flex flex-wrap gap-x-[1rem] gap-y-[0.5rem]">
								{songRequests?.[songId]?.map((userId) => (
									<Badge key={userId} variant="secondary" className="pr-0">
										<HandIcon className="mr-[0.2rem] inline" />
										<AvatarIcon className="mr-[0.2rem] inline" />
										<div>{usernameGet(userId)}</div>
										<Button
											variant="secondary"
											onClick={songRequestRemoveClick({ songId, userId })}
											title="Cancel Song Request for this user"
										>
											<Cross1Icon />
										</Button>
									</Badge>
								))}
							</div>
						</GridRow>
					))}
				</RadioGroup>
			</Grid>
		</>
	);
};
