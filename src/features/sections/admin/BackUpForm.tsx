"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { JSX, useEffect } from "react";
import { useForm } from "react-hook-form";

import { backUpFormFieldData, backUpFormFieldKey } from "./consts";
import { BackUpFormSchema } from "./schemas";
import { BackUpForm as BackUpFormType } from "./types";
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
import { useAppStore } from "@/features/app-store/useAppStore";

export const BackUpForm = (): JSX.Element => {
	const { backUpFormSubmit, backUpFormSet } = useAppStore();

	const form = useForm<BackUpFormType>({
		resolver: valibotResolver(BackUpFormSchema),
		defaultValues: {
			[backUpFormFieldKey.FROM_PREFIX]: "",
			[backUpFormFieldKey.TO_PREFIX]: "",
		},
	});

	useEffect(() => {
		if (form) {
			backUpFormSet(form);
		}
	}, [form, backUpFormSet]);

	return (
		<Form form={form}>
			{form.formState.errors.root && (
				<div className="text-red-500">{form.formState.errors.root.message}</div>
			)}
			<form onSubmit={backUpFormSubmit}>
				<div className="flex gap-[2rem]">
					<FormField
						name={backUpFormFieldKey.FROM_PREFIX}
						control={form.control}
						render={({
							field: { name, onBlur, onChange, ref, value, disabled },
						}) => (
							<FormItem>
								<FormLabel>
									{backUpFormFieldData[backUpFormFieldKey.FROM_PREFIX].label}
								</FormLabel>
								<FormControl>
									<Input
										name={name}
										onBlur={onBlur}
										onChange={onChange}
										ref={ref}
										value={value}
										disabled={!!disabled}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name={backUpFormFieldKey.TO_PREFIX}
						control={form.control}
						render={({
							field: { name, onBlur, onChange, ref, value, disabled },
						}) => (
							<FormItem>
								<FormLabel>
									{backUpFormFieldData[backUpFormFieldKey.TO_PREFIX].label}
								</FormLabel>
								<FormControl>
									<Input
										name={name}
										onBlur={onBlur}
										onChange={onChange}
										ref={ref}
										value={value}
										disabled={!!disabled}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex gap-[0.5rem]">
					<Button type="submit" disabled={form.formState.isSubmitting}>
						Save
					</Button>
				</div>
			</form>
		</Form>
	);
};
