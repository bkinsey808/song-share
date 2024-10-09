import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { LogDeleteConfirmModal } from "./LogDeleteConfirmModal";
import { logDefaultGet } from "./logDefaultGet";
import { LogFormSchema } from "./schemas";
import { LogForm as LogFormType } from "./types";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import TimestampPicker from "@/components/ui/timestamp-picker";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const LogForm = () => {
	const {
		timeZoneGet,
		logFormSet,
		logSubmit,
		logNewClick,
		logDeleteClick,
		logId,
		songLibrary,
	} = useAppStore();
	const timeZone = timeZoneGet();
	const songIds = getKeys(songLibrary);
	const songOptions = useMemo(() => {
		return songIds.map((songId) => {
			const song = songLibrary[songId];
			const songNameLowerCase = song.songName.toLocaleLowerCase();
			return {
				value: songId,
				label: song.songName,
				search: `${songNameLowerCase} ${songNameLowerCase.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`,
			};
		});
	}, [songIds, songLibrary]);

	const defaultValues: LogFormType = useMemo(
		() => {
			const defaultLog = logDefaultGet();
			const defaultLogForm: LogFormType = {
				...defaultLog,
				logId: "",
			};
			return defaultLogForm;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const form = useForm<LogFormType>({
		resolver: valibotResolver(LogFormSchema),
		defaultValues,
	});

	// set log form
	useEffect(() => {
		if (form) {
			logFormSet(form);
		}
	}, [form, logFormSet]);

	const [search, setSearch] = useState("");

	return (
		<>
			<LogDeleteConfirmModal />
			<Form {...form}>
				<form onSubmit={logSubmit}>
					<div className="flex gap-[1rem]">
						<FormField
							name="date"
							control={form.control}
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Log Date Time</FormLabel>
									<FormControl>
										<TimestampPicker {...field} timeZone={timeZone} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							name="songId"
							control={form.control}
							render={({ field }) => (
								<FormItem className="flex flex-grow flex-col">
									<FormLabel>Song</FormLabel>
									<FormControl>
										<Combobox
											{...field}
											options={songOptions.filter((option) =>
												option.search.includes(search.toLocaleLowerCase()),
											)}
											search={search}
											setSearch={setSearch}
											label="song"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>

					<FormField
						name="notes"
						control={form.control}
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Log Notes</FormLabel>
								<FormControl>
									<Textarea
										autoResize={true}
										{...field}
										disabled={form.formState.isSubmitting}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<div className="flex gap-[0.5rem]">
						<Button type="submit" disabled={form.formState.isSubmitting}>
							Save
						</Button>
						<Button onClick={logNewClick}>New</Button>
						{logId ? (
							<Button variant="destructive" onClick={logDeleteClick}>
								Delete
							</Button>
						) : null}
					</div>
				</form>
			</Form>
		</>
	);
};
