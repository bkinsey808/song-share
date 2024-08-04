"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { SongSetDeleteConfirmModal } from "./SongSetDeleteConfirmModal";
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
		songSet,
		songSetSubmit,
		setIsSongSetUnsaved,
		isSongSetUnsaved,
		songSetNewClick,
		setSongSetForm,
		songSetDeleteClick,
	} = useAppStore();

	const defaultValues: SongSet = useMemo(
		() => ({
			songSetName: songSet?.songSetName ?? "",
			sharer: songSet?.sharer ?? "",
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

	// handle load song set from song set library
	useEffect(() => {
		form.reset(defaultValues);
	}, [form, defaultValues]);

	// set song form
	useEffect(() => {
		setSongSetForm(form);
	}, [form, setSongSetForm]);

	return (
		<div suppressHydrationWarning={true}>
			<SongSetDeleteConfirmModal />
			<Form {...form}>
				<div suppressHydrationWarning={true}>
					isDirty: {isSongSetUnsaved.toString()}
				</div>
				<form onSubmit={songSetSubmit}>
					<FormField
						control={form.control}
						name="songSetName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Song Set name</FormLabel>
								<FormControl>
									<Input placeholder="Song Set Name" {...field} />
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
							<Button onClick={songSetNewClick}>New</Button>
							{songSetId ? (
								<Button variant="destructive" onClick={songSetDeleteClick}>
									Delete
								</Button>
							) : null}
						</div>
					) : null}
				</form>
			</Form>
		</div>
	);
};
