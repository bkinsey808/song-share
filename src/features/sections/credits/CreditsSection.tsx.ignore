"use client";

import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import useDebouncedEffect from "use-debounced-effect";

import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";

export function CreditsSection() {
	const { getValue, setValue } = useDashboardState();
	const [credits, setCredits] = useState(getValue(DashboardStateKey.SONG_NAME));

	useDebouncedEffect(
		() => {
			setValue(DashboardStateKey.CREDITS, credits);
		},
		2000,
		[credits],
	);

	return (
		<section data-title="Credits Section">
			<TextareaAutosize
				className="w-full rounded-[0.2rem] bg-[var(--background)] p-[0.3rem] px-[0.6rem] text-current focus:outline-none"
				name="Credits"
				placeholder="Credits"
				value={credits}
				onChange={(e) => {
					setCredits(e.target.value);
				}}
				onBlur={(e) => {
					setCredits(e.target.value.trim());
				}}
			/>
		</section>
	);
}
