"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { JSX, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useSong } from "../useSong";
import { ActiveRadioFormField } from "./ActiveRadioField";
// import { KeyTitle } from "../key/KeyTitle.tsx.ignore";
// import { ScaleSection } from "../scale/ScaleSection.tsx.ignore";
// import { ScaleTitle } from "../scale/ScaleTitle.tsx.ignore";
import { SongDeleteConfirmModal } from "./SongDeleteConfirmModal";
import { SongFormButtons } from "./SongFormButtons";
import { SongKeyFormField } from "./SongKeyFormField";
import { SongNameFormField } from "./SongNameFormField";
import { TextAreaFormField } from "./TextAreaFormField";
import { SongFormSchema } from "./schemas";
import { SongForm as SongFormType } from "./types";
import { Form } from "@/components/ui/form";
import { useAppStore } from "@/features/app-store/useAppStore";
import { SectionAccordion } from "@/features/section/SectionAccordion";
import { sectionId } from "@/features/sections/consts";

export const SongForm = (): JSX.Element => {
	const { isSignedIn } = useAppStore();
	const {
		songId,
		songSubmit,
		songIsUnsavedSet,
		songFormSet,
		songDefaultGet,
		songKeyGet,
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

	return (
		<div>
			<SongDeleteConfirmModal />
			<div>SongId: {songId}</div>
			<div>Form song key: {form.getValues().songKey}</div>
			<Form form={form}>
				<form onSubmit={songSubmit}>
					<div className="mr-[0.1rem] flex flex-wrap gap-[0.5rem]">
						{songId && isSignedIn ? <ActiveRadioFormField /> : null}

						<SongNameFormField />
					</div>

					<SectionAccordion
						sectionId={sectionId.LYICS}
						title={song?.lyrics}
						buttonLabel="Lyrics"
						buttonVariant="secondary"
					>
						<TextAreaFormField name="lyrics" />
					</SectionAccordion>

					<SectionAccordion
						sectionId={sectionId.TRANSLATION}
						title={song?.translation}
						buttonLabel="Translation"
						buttonVariant="secondary"
					>
						<TextAreaFormField name="translation" />
					</SectionAccordion>

					<SectionAccordion
						sectionId={sectionId.CREDITS}
						title={song?.credits}
						buttonLabel="Credits"
						buttonVariant="secondary"
					>
						<TextAreaFormField name="credits" />
					</SectionAccordion>

					<SectionAccordion
						sectionId={sectionId.SONG_KEY_SCALE}
						title={`${songKeyGet(songId)}`}
						buttonLabel="Key and Scale"
						buttonVariant="secondary"
					>
						<SongKeyFormField />
					</SectionAccordion>

					{isSignedIn ? <SongFormButtons /> : null}
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
