"use client";

import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import useDebouncedEffect from "use-debounced-effect";

import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";

export function LyricsSection() {
	const { getValue, setValue } = useDashboardState();
	const [lyrics, setLyrics] = useState(getValue(DashboardStateKey.LYRICS));

	useDebouncedEffect(
		() => {
			setValue(DashboardStateKey.LYRICS, lyrics);
		},
		2000,
		[lyrics],
	);

	return (
		<section data-title="Lyrics Section">
			<TextareaAutosize
				className="w-full rounded-[0.2rem] bg-[var(--background)] p-[0.3rem] px-[0.6rem] text-current focus:outline-none"
				name="lyrics"
				placeholder="Lyrics"
				value={lyrics}
				onChange={(e) => {
					setLyrics(e.target.value);
				}}
				onBlur={(e) => {
					setLyrics(e.target.value.trim());
				}}
			/>
		</section>
	);
}
