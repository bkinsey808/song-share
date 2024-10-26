import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

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
import { SongLogFormSchema } from "@/features/sections/song-log/schemas";
import { songLogDefaultGet } from "@/features/sections/song-log/songLogDefaultGet";
import { SongLogForm as SongLogFormType } from "@/features/sections/song-log/types";

export const LogForm = () => {
	const {
		timeZoneGet,
		logFormSet,
		songLibrary,
		songLogSubmit,
		songLogNewClick,
		songLogDeleteClick,
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

	const form = useForm<SongLogFormType>({
		resolver: valibotResolver(SongLogFormSchema),
		defaultValues: songLogDefaultGet(),
	});

	// set log form
	useEffect(() => {
		if (form) {
			logFormSet(form);
		}
	}, [form, logFormSet]);

	const [search, setSearch] = useState("");
	const logId = form.getValues("logId");

	return (
		<>
			{/* isDirty: {form.formState.isDirty.toString()}
			<pre>{JSON.stringify(form.getValues(), null, 2)}</pre> */}
			<Form {...form}>
				<form onSubmit={songLogSubmit(form)}>
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
							Save Log
						</Button>
						<Button onClick={songLogNewClick({ form })}>New Log</Button>
						{logId ? (
							<Button
								variant="destructive"
								onClick={songLogDeleteClick({
									songId: form.getValues("songId"),
									logId,
									form,
									shouldClearSongId: true,
								})}
							>
								Delete Log
							</Button>
						) : null}
					</div>
				</form>
			</Form>
		</>
	);
};
