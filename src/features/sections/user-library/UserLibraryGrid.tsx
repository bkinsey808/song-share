"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { FormEvent, JSX, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
	UserLibrarySort,
	userLibrarySortDefault,
	userLibrarySortOptions,
} from "./consts";
import { UserLibraryGridFormSchema } from "./schemas";
import { useSortedFilteredUserIds } from "./slice";
import { UserLibraryGridForm } from "./types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export const UserLibraryGrid = (): JSX.Element => {
	const {
		userLibrarySort,
		userLibrarySortSet,
		userLibrarySearch,
		userLibraryGridFormSubmit,
		userLibraryGridFormSet,
		fuid,
		usernameGet,
		isActiveGet,
	} = useAppStore();

	const form = useForm<UserLibraryGridForm>({
		resolver: valibotResolver(UserLibraryGridFormSchema),
		defaultValues: {
			sort: userLibrarySort,
			search: userLibrarySearch ?? "",
		},
	});

	// set form
	useEffect(() => {
		if (form) {
			userLibraryGridFormSet(form);
		}
	}, [form, userLibraryGridFormSet]);

	// update form if sort ever changes
	useEffect(() => {
		form.setValue("sort", userLibrarySort);
	}, [form, userLibrarySort]);

	const [sortSearch, setSortSearch] = useState("");

	const userIds = useSortedFilteredUserIds();

	useFormSubmitOnChange({
		form,
		onSubmit: userLibraryGridFormSubmit,
	});

	return (
		<>
			{/* isDirty: {form.formState.isDirty.toString()} */}
			<Form form={form}>
				<form
					onSubmit={userLibraryGridFormSubmit}
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
						render={({ field: { onChange, ref, value, disabled } }) => (
							<FormItem className="h-[3rem] w-[10rem]">
								<FormLabel>Sort</FormLabel>
								<FormControl>
									<Combobox
										options={userLibrarySortOptions}
										label="sort"
										search={sortSearch}
										setSearch={setSortSearch}
										disabled={form.formState.isSubmitting || !!disabled}
										valueDefault={userLibrarySortDefault}
										onChange={onChange}
										ref={ref}
										value={value}
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
					(form.getValues("sort") === userLibrarySortDefault &&
						form.getValues("search") === "")
				}
				onClick={() => {
					form.reset({ sort: userLibrarySortDefault, search: "" });
					const formEvent = new Event("submit", {
						bubbles: true,
						cancelable: true,
					});
					void userLibraryGridFormSubmit(
						formEvent as unknown as FormEvent<HTMLFormElement>,
					);
				}}
			>
				Reset Search and Sort
			</Button>
			<Grid gridClassName={tw`grid-cols-[1.5rem,3fr,3rem,1fr]`}>
				<GridHeader>
					<div></div>
					<Button
						variant="outline"
						className="justify-start"
						onClick={() => {
							if (userLibrarySort === UserLibrarySort.USERNAME_ASC) {
								userLibrarySortSet(UserLibrarySort.USERNAME_DESC)();
							} else {
								userLibrarySortSet(UserLibrarySort.USERNAME_ASC)();
							}
						}}
					>
						<span className="flex gap-[0.3rem] align-middle">
							<span className="mt-[0.2rem]">
								{userLibrarySort === UserLibrarySort.USERNAME_ASC ? (
									<ArrowUpIcon />
								) : null}
								{userLibrarySort === UserLibrarySort.USERNAME_DESC ? (
									<ArrowDownIcon />
								) : null}
							</span>
							Username
						</span>
					</Button>
					<div>Active</div>
					<div>Options</div>
				</GridHeader>
				<RadioGroup name="fuid" id="fuid" value={fuid ?? ""}>
					{userIds.map((userId) => (
						<GridRow key={userId}>
							<div className="align-center grid justify-center">
								<RadioGroupItem
									className="self-center"
									id={userId}
									disabled={true}
									value={userId}
								/>
							</div>

							<div>{usernameGet(userId)}</div>
							<div>
								<Checkbox value={isActiveGet(userId)} disabled={true} />
							</div>
							<div></div>
						</GridRow>
					))}
				</RadioGroup>
			</Grid>
		</>
	);
};
