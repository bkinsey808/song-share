"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { JSX, useEffect } from "react";
import { useForm } from "react-hook-form";

import { ResetButton } from "./ResetButton";
import { SearchFormField } from "./SearchFormField";
import { SortFormField } from "./SortFormField";
import { SongLibraryGridFormSchema } from "./schemas";
import { SongLibraryGridForm as SongLibraryGridFormType } from "./types";
import { Form } from "@/components/ui/form";
import { useAppStore } from "@/features/app-store/useAppStore";
import { useFormSubmitOnChange } from "@/features/global/useFormSubmitOnChange";

export const SongLibraryGridForm = (): JSX.Element => {
	const {
		songLibrarySort,
		songLibrarySearch,
		songLibraryGridFormSubmit,
		songLibraryGridFormSet,
	} = useAppStore();

	const form = useForm<SongLibraryGridFormType>({
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

	useFormSubmitOnChange({
		form,
		onSubmit: songLibraryGridFormSubmit,
	});

	return (
		<Form form={form}>
			<form onSubmit={songLibraryGridFormSubmit}>
				<div className="flex gap-[1rem] pr-[0.1rem]">
					<SearchFormField />
					<SortFormField />
				</div>
				<ResetButton />
			</form>
		</Form>
	);
};
