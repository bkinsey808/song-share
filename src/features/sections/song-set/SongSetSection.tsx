"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { SongSetSchema } from "./schemas";
import { SongSet } from "./types";
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
import { useAuthStore } from "@/features/auth/useAuthStore";

export const SongSetSection = () => {
	const { isSignedIn } = useAuthStore();
	const {
		songSetId,
		songSetName,
		songSetSubmit,
		setIsSongSetUnsaved,
		isSongSetUnsaved,
		songSetNewClick,
	} = useAppStore();

	const defaultValues: SongSet = useMemo(
		() => ({
			songSetName: songSetName ?? "",
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const form = useForm<SongSet>({
		resolver: valibotResolver(SongSetSchema),
		defaultValues,
	});

	// keep unsavedSongSet in sync with form state
	useEffect(() => {
		setIsSongSetUnsaved(form.formState.isDirty);
	}, [form.formState.isDirty, setIsSongSetUnsaved]);

	// handle load songSet form songSet library
	useEffect(() => {
		form.reset({
			songSetName: songSetName ?? "",
		});
	}, [songSetName, form]);

	return (
		<div suppressHydrationWarning={true}>
			<Form {...form}>
				<div suppressHydrationWarning={true}>
					isDirty: {isSongSetUnsaved.toString()}
				</div>
				<form onSubmit={songSetSubmit(form)}>
					<FormField
						control={form.control}
						name="songSetName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>SongSet name</FormLabel>
								<FormControl>
									<Input placeholder="SongSet Name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{isSignedIn ? (
						<div className="flex gap-[0.5rem]">
							<Button type="submit" disabled={form.formState.isSubmitting}>
								Save
							</Button>
							{songSetId ? <Button>Save As...</Button> : null}
							<Button onClick={songSetNewClick(form)}>New</Button>
						</div>
					) : null}
				</form>
			</Form>
		</div>
	);
};
