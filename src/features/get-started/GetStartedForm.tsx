"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { JSX, useEffect } from "react";
import { useForm } from "react-hook-form";

import { GetStartedFormSchema } from "./schemas";
import { GetStartedForm as GetStartedFormType } from "./types";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/features/app-store/useAppStore";

export const GetStartedForm = (): JSX.Element => {
	const { getStartedFormSubmit, getStartedFormSet } = useAppStore();

	const form = useForm<GetStartedFormType>({
		resolver: valibotResolver(GetStartedFormSchema),
		defaultValues: {
			songLeaderUserName: "",
		},
	});

	// set settings form
	useEffect(() => {
		if (form) {
			getStartedFormSet(form);
		}
	}, [form, getStartedFormSet]);

	return (
		<Form form={form}>
			<form onSubmit={getStartedFormSubmit}>
				<div className="flex gap-[2rem]">
					<FormField
						name="songLeaderUserName"
						control={form.control}
						render={({
							field: { name, onBlur, onChange, ref, value, disabled },
						}) => (
							<FormItem>
								<FormLabel>Song Leader Username</FormLabel>
								<FormControl>
									<Input
										placeholder="Song Leader Username"
										autoFocus={true}
										name={name}
										onBlur={onBlur}
										onChange={onChange}
										ref={ref}
										value={value}
										disabled={!!disabled}
									/>
								</FormControl>
								<FormDescription>
									Get started by entering the username of the song leader you
									wish to follow
								</FormDescription>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="mt-[1rem] flex gap-[0.5rem]">
					<Button type="submit" disabled={form.formState.isSubmitting}>
						Follow this Song Leader
					</Button>
				</div>
			</form>
		</Form>
	);
};
