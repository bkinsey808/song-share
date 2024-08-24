"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { KeySection } from "../key/KeySection";
import { KeyTitle } from "../key/KeyTitle";
import { ScaleSection } from "../scale/ScaleSection";
import { ScaleTitle } from "../scale/ScaleTitle";
import { SongDeleteConfirmModal } from "./SongDeleteConfirmModal";
import { SongSchema } from "./schemas";
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
		song,
		songSubmit,
		setIsSongUnsaved,
		songNewClick,
		setSongForm,
		songDeleteClick,
		showAddSongToSongSetButton,
		addingSongToSongSet,
		addSongToSongSetClick,
		songFormIsDisabled,
	} = useAppStore();

	const defaultValues: Song = useMemo(
		() => ({
			songName: song?.songName ?? "",
			lyrics: song?.songName ?? "",
			translation: song?.translation ?? "",
			credits: song?.credits ?? "",
			sharer: song?.sharer ?? "",
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const form = useForm<Song>({
		resolver: valibotResolver(SongSchema),
		defaultValues,
	});

	// keep unsavedSong in sync with form state
	useEffect(() => {
		setIsSongUnsaved(form.formState.isDirty);
	}, [form.formState.isDirty, setIsSongUnsaved]);

	// handle load song from song library
	useEffect(() => {
		form.reset(defaultValues);
	}, [form, defaultValues]);

	// set song form
	useEffect(() => {
		setSongForm(form);
	}, [form, setSongForm]);

	return (
		<div suppressHydrationWarning={true}>
			<SongDeleteConfirmModal />
			<Form {...form}>
				<form onSubmit={songSubmit}>
					<FormField
						name="songName"
						control={form.control}
						disabled={songFormIsDisabled()}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Song Name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<SectionAccordion sectionId={sectionId.CREDITS} title="Credits">
						<FormField
							name="credits"
							control={form.control}
							disabled={songFormIsDisabled()}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea autoResize={true} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</SectionAccordion>

					<SectionAccordion sectionId={sectionId.LYICS} title="Lyrics">
						<FormField
							name="lyrics"
							control={form.control}
							disabled={songFormIsDisabled()}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea autoResize={true} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</SectionAccordion>

					<SectionAccordion
						sectionId={sectionId.TRANSLATION}
						title="Translation"
					>
						<FormField
							name="translation"
							control={form.control}
							disabled={songFormIsDisabled()}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea autoResize={true} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</SectionAccordion>

					{isSignedIn ? (
						<div className="flex gap-[0.5rem]">
							<Button type="submit" disabled={songFormIsDisabled()}>
								Save
							</Button>
							{songId ? <Button>Save As...</Button> : null}
							{showAddSongToSongSetButton() ? (
								<Button
									disabled={addingSongToSongSet}
									onClick={addSongToSongSetClick}
								>
									Add to Song Set
								</Button>
							) : null}
							<Button onClick={songNewClick}>New</Button>
							{songId ? (
								<Button variant="destructive" onClick={songDeleteClick}>
									Delete
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
