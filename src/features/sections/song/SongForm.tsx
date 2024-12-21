"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// import { KeySection } from "../key/KeySection.tsx.ignore";
// import { KeyTitle } from "../key/KeyTitle.tsx.ignore";
// import { ScaleSection } from "../scale/ScaleSection.tsx.ignore";
// import { ScaleTitle } from "../scale/ScaleTitle.tsx.ignore";
import { SongDeleteConfirmModal } from "./SongDeleteConfirmModal";
import { keyOptionsWithNone, keys } from "./consts";
import { SongFormSchema } from "./schemas";
import { useSong } from "./slice";
import { SongForm as SongFormType } from "./types";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
		songKeyGet,
		songActiveId,
		songActiveClick,
	} = useAppStore();

	const song = useSong();

	const form = useForm<SongFormType>({
		resolver: valibotResolver(SongFormSchema),
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

	const [songKeySearch, songKeySearchSet] = useState("");

	return (
		<div>
			<SongDeleteConfirmModal />
			<div>SongId: {songId}</div>
			<div>Form song key: {form.getValues().songKey}</div>
			<Form {...form}>
				<form onSubmit={songSubmit}>
					<div className="mr-[0.1rem] flex flex-wrap gap-[0.5rem]">
						{songId && isSignedIn ? (
							<RadioGroup
								name="songActiveId"
								id="songActiveId"
								value={songActiveId ?? ""}
							>
								<RadioGroupItem
									className="self-center"
									id={songId}
									value={songId}
									onClick={songActiveClick({
										songId,
									})}
								/>
							</RadioGroup>
						) : null}

						<FormField
							name="songName"
							control={form.control}
							render={({ field }) => (
								<FormItem className="flex-1">
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
					</div>

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

					<SectionAccordion
						sectionId={sectionId.SONG_KEY_SCALE}
						title={`${songKeyGet(songId)}`}
						buttonLabel="Key and Scale"
						buttonVariant="secondary"
					>
						<FormField
							name="songKeyString"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									{/* Field value: {form.getValues().songKey},{" "}
									{keyMap.get(form.getValues().songKey)} */}
									<FormLabel>Song Key</FormLabel>
									<FormControl>
										<Combobox
											{...field}
											options={keyOptionsWithNone.filter((option) =>
												option.search.includes(
													songKeySearch.toLocaleLowerCase(),
												),
											)}
											onChange={(value) => {
												field.onChange(value);
												console.log({
													value,
													fv: field.value,
													k: keys[value as keyof typeof keys],
												});
												form.setValue(
													"songKey",
													value ? keys[value as keyof typeof keys] : undefined,
												);
											}}
											search={songKeySearch}
											setSearch={songKeySearchSet}
											label="song key"
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
									onClick={playlistSongAddClick()}
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
									onClick={songRequestRemoveClick({ songId })}
								>
									Cancel Request Song
								</Button>
							) : null}

							{songId ? (
								<Button variant="destructive" onClick={songDeleteClick(songId)}>
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
