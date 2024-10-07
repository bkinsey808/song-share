"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { SettingsSchema } from "./schemas";
import { Settings } from "./types";
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
import { useAppStore } from "@/features/app-store/useAppStore";

export const SettingsForm = () => {
	const timezoneOptions = useMemo(() => {
		return Intl.supportedValuesOf("timeZone").map((timeZone) => {
			const dt = DateTime.local().setZone(timeZone);
			const shortName = dt.toFormat("ZZZ"); // Short timezone name
			const longName = dt.toFormat("ZZZZ"); // Long timezone name

			return {
				value: timeZone,
				label: timeZone.replace(/_/g, " ").replace(/\//g, " / "),
				search:
					`${shortName}: ${timeZone} (${longName}) <${dt.toFormat("fff")}>`.toLocaleLowerCase(),
			};
		});
	}, []);

	const [search, setSearch] = useState("");

	const { settingsSubmit, setSettingsForm, timeZone } = useAppStore();

	const form = useForm<Settings>({
		resolver: valibotResolver(SettingsSchema),
		defaultValues: {
			useSystemTimeZone: !timeZone,
			timeZone: timeZone ?? undefined,
		},
	});

	// set settings form
	useEffect(() => {
		if (form) {
			setSettingsForm(form);
		}
	}, [form, setSettingsForm]);

	const useSystemTimeZone = form.getValues().useSystemTimeZone;
	useEffect(() => {
		if (useSystemTimeZone) {
			form.setValue("timeZone", undefined);
		}
	}, [form, useSystemTimeZone]);

	return (
		<Form {...form}>
			<form onSubmit={settingsSubmit}>
				<div className="flex gap-[2rem]">
					<FormField
						name="useSystemTimeZone"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Use System Timezone</FormLabel>
								<FormControl>
									<Checkbox
										className="block"
										{...field}
										onCheckedChange={() => field.onChange(!field.value)}
										checked={field.value}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						name="timeZone"
						control={form.control}
						render={({ field }) => (
							<FormItem className="flex-grow">
								<FormLabel>Time Zone</FormLabel>
								<FormControl>
									<Combobox
										options={timezoneOptions.filter((option) =>
											option.search.includes(search.toLocaleLowerCase()),
										)}
										label="timezone"
										search={search}
										setSearch={setSearch}
										disabled={form.formState.isSubmitting || useSystemTimeZone}
										{...field}
									/>
								</FormControl>
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
