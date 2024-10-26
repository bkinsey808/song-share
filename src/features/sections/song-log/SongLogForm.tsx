import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { SongLogFormSchema } from "./schemas";
import { songLogDefaultGet } from "./songLogDefaultGet";
import { SongLogForm as SongLogFormType } from "./types";
import { Button } from "@/components/ui/button";
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

export const SongLogForm = () => {
	const {
		timeZoneGet,
		songLogFormSet,
		songLogSubmit,
		songLogNewClick,
		songLogDeleteClick,
		songId,
	} = useAppStore();
	const timeZone = timeZoneGet();

	const form = useForm<SongLogFormType>({
		resolver: valibotResolver(SongLogFormSchema),
		defaultValues: { ...songLogDefaultGet(), songId: songId ?? "" },
	});

	// set song log form
	useEffect(() => {
		if (form) {
			songLogFormSet(form);
		}
	}, [form, songLogFormSet]);

	const logId = form.getValues("logId");
	const formSongId = form.getValues("songId");

	return (
		<>
			{/* isDirty: {form.formState.isDirty.toString()}
			<pre>{JSON.stringify(form.getValues(), null, 2)}</pre> */}
			<Form {...form}>
				<form onSubmit={songLogSubmit(form)}>
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
						name="notes"
						control={form.control}
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Song Log Notes</FormLabel>
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
							Save Song Log
						</Button>
						<Button onClick={songLogNewClick({ form, songId })}>
							New Song Log
						</Button>
						{logId ? (
							<Button
								variant="destructive"
								onClick={songLogDeleteClick({
									songId: formSongId,
									logId,
									form,
									shouldClearSongId: false,
								})}
							>
								Delete Song Log
							</Button>
						) : null}
					</div>
				</form>
			</Form>
		</>
	);
};
