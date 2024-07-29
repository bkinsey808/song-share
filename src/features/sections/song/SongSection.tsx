"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { CreditsSection } from "../credits/CreditsSection";
import { KeySection } from "../key/KeySection";
import { KeyTitle } from "../key/KeyTitle";
import { LyricsSection } from "../lyrics/LyricsSection";
import { ScaleSection } from "../scale/ScaleSection";
import { ScaleTitle } from "../scale/ScaleTitle";
import { Section } from "../sections";
import { SongSchema } from "./schemas";
import { SongDetails } from "./types";
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
import { Textarea } from "@/components/ui/textarea";
import { SectionId } from "@/features/app-store/enums";
import { useAppStore } from "@/features/app-store/useAppStore";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { SectionAccordion } from "@/features/design-system/SectionAccordion";

export const SongSection = () => {
	const { isSignedIn } = useAuthStore();
	const {
		songId,
		songName,
		translation,
		songDetailsSubmit,
		setIsSongUnsaved,
		isSongUnsaved,
		songDetailsNewClick,
	} = useAppStore();

	const defaultValues: SongDetails = useMemo(
		() => ({
			songName: songName ?? "",
			translation: translation ?? "",
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const form = useForm<SongDetails>({
		resolver: valibotResolver(SongSchema),
		defaultValues,
	});

	// keep unsavedSong in sync with form state
	useEffect(() => {
		setIsSongUnsaved(form.formState.isDirty);
	}, [form.formState.isDirty, setIsSongUnsaved]);

	// handle load song form song library
	useEffect(() => {
		form.reset({
			songName: songName ?? "",
			translation: translation ?? "",
		});
	}, [songName, translation, form]);

	return (
		<div suppressHydrationWarning={true}>
			<Form {...form}>
				<div suppressHydrationWarning={true}>
					isDirty: {isSongUnsaved.toString()}
				</div>
				<form onSubmit={songDetailsSubmit(form)}>
					<FormField
						control={form.control}
						name="songName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Song name</FormLabel>
								<FormControl>
									<Input placeholder="Song Name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<SectionAccordion
						sectionId={SectionId.TRANSLATION}
						title="Translation"
					>
						<FormField
							control={form.control}
							name="translation"
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
							<Button type="submit" disabled={form.formState.isSubmitting}>
								Save
							</Button>
							{songId ? <Button>Save As...</Button> : null}
							<Button onClick={songDetailsNewClick(form)}>New</Button>
						</div>
					) : null}
				</form>
			</Form>

			{/* <div className="flex flex-col gap-[0.2rem] px-[0.2rem]">
				<DashboardAccordion
					key={Section.CREDITS}
					id={Section.CREDITS}
					title="Credits"
				>
					<CreditsSection />
				</DashboardAccordion>

				<DashboardAccordion
					key={Section.LYRICS}
					id={Section.LYRICS}
					title="Lyrics"
				>
					<LyricsSection />
				</DashboardAccordion>

				<DashboardAccordion
					key={Section.TRANSLATION}
					id={Section.TRANSLATION}
					title="Translation"
				>
					<TranslationSection />
				</DashboardAccordion>

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
