import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { SongLogDeleteConfirmModal } from "./SongLogDeleteConfirmModal";
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
import { logDefaultGet } from "@/features/sections/log/logDefaultGet";
import { LogFormSchema } from "@/features/sections/log/schemas";
import { LogForm as LogFormType } from "@/features/sections/log/types";

export const SongLogForm = () => {
	const {
		timeZoneGet,
		songLogFormSet,
		songLogSubmit,
		songLogNewClick,
		songLogDeleteClick,
		logId,
		songId,
	} = useAppStore();
	const timeZone = timeZoneGet();

	const defaultValues: LogFormType = useMemo(
		() => {
			const defaultLog = logDefaultGet();
			const defaultLogForm: LogFormType = {
				...defaultLog,
				songId: songId ?? "",
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

	// set song log form
	useEffect(() => {
		if (form) {
			songLogFormSet(form);
		}
	}, [form, songLogFormSet]);

	return (
		<>
			<SongLogDeleteConfirmModal />
			<Form {...form}>
				<form onSubmit={songLogSubmit}>
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
							Save
						</Button>
						<Button onClick={songLogNewClick}>New</Button>
						{logId ? (
							<Button variant="destructive" onClick={songLogDeleteClick}>
								Delete
							</Button>
						) : null}
					</div>
				</form>
			</Form>
		</>
	);
};
