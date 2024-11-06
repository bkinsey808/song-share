"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

// import { KeySection } from "../key/KeySection.tsx.ignore";
// import { KeyTitle } from "../key/KeyTitle.tsx.ignore";
// import { ScaleSection } from "../scale/ScaleSection.tsx.ignore";
// import { ScaleTitle } from "../scale/ScaleTitle.tsx.ignore";
import { SongDeleteConfirmModal } from "./SongDeleteConfirmModal";
import { SongSchema } from "./schemas";
import { useSong } from "./slice";
import { Song } from "./types";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/features/app-store/useAppStore";
import { SectionAccordion } from "@/features/section/SectionAccordion";
import { sectionId } from "@/features/sections/consts";

export const SongForm = () => {
	const { isSignedIn } = useAppStore();
	const {
		songId,
		songSubmit,
		songIsUnsavedSet,
		songNewClick,
		songFormSet,
		songDeleteClick,
		playlistSongAddButtonShouldShow,
		playlistSongAdding,
		playlistSongAddClick,
		songDefaultGet,
		songRequestAddClick,
		songRequestAdded,
		songRequestRemoveClick,
		songRequestPending,
	} = useAppStore();

	const song = useSong();

	const form = useForm<Song>({
		resolver: valibotResolver(SongSchema),
		defaultValues: songDefaultGet(),
	});

	// keep unsavedSong in sync with form state
	useEffect(() => {
		songIsUnsavedSet(form.formState.isDirty);
	}, [form.formState.isDirty, songIsUnsavedSet]);

	// set song form
	useEffect(() => {
		if (form) {
			songFormSet(form);
		}
	}, [form, songFormSet]);

	useEffect(() => {
		form.reset(song);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, songId]);

	return (
		<div>
			<SongDeleteConfirmModal />
			<Form {...form}>
				<form onSubmit={songSubmit}>
					<FormField
						name="songName"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder="Song Name"
										{...field}
										disabled={form.formState.isSubmitting}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<SectionAccordion
						sectionId={sectionId.LYICS}
						title={song?.lyrics}
						buttonLabel="Lyrics"
						buttonVariant="secondary"
					>
						<FormField
							name="lyrics"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											autoResize={true}
											{...field}
											disabled={form.formState.isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</SectionAccordion>

					<SectionAccordion
						sectionId={sectionId.TRANSLATION}
						title={song?.translation}
						buttonLabel="Translation"
						buttonVariant="secondary"
					>
						<FormField
							name="translation"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											autoResize={true}
											{...field}
											disabled={form.formState.isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</SectionAccordion>

					<SectionAccordion
						sectionId={sectionId.CREDITS}
						title={song?.credits}
						buttonLabel="Credits"
						buttonVariant="secondary"
					>
						<FormField
							name="credits"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											autoResize={true}
											{...field}
											disabled={form.formState.isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</SectionAccordion>

					{isSignedIn ? (
						<div className="flex flex-wrap gap-[0.5rem]">
							<Button type="submit" disabled={form.formState.isSubmitting}>
								Save Song
							</Button>
							{songId ? <Button>Save Song As...</Button> : null}
							{playlistSongAddButtonShouldShow() ? (
								<Button
									disabled={playlistSongAdding}
									onClick={playlistSongAddClick}
								>
									Add Song to Playlist
								</Button>
							) : null}
							<Button onClick={songNewClick}>New Song</Button>
							{songId && !songRequestAdded(songId) ? (
								<Button
									disabled={songRequestPending}
									onClick={songRequestAddClick(songId)}
								>
									Request Song
								</Button>
							) : null}
							{songId && songRequestAdded(songId) ? (
								<Button
									disabled={songRequestPending}
									onClick={songRequestRemoveClick(songId)}
								>
									Cancel Request Song
								</Button>
							) : null}

							{songId ? (
								<Button variant="destructive" onClick={songDeleteClick}>
									Delete Song
								</Button>
							) : null}
						</div>
					) : null}
				</form>
			</Form>

			{/* <div className="flex flex-col gap-[0.2rem] px-[0.2rem]">
				<DashboardAccordion
					key={Section.KEY}
					id={Section.KEY}
					title={<KeyTitle />}
				>
					<KeySection />
				</DashboardAccordion>

				<DashboardAccordion
					key={Section.SCALE}
					id={Section.SCALE}
					title={<ScaleTitle />}
				>
					<ScaleSection />
				</DashboardAccordion>
			</div> */}
		</div>
	);
};
