"use client";

import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/features/app-store/useAppStore";

export function TranslationSection() {
	const { translation } = useAppStore();
	return <Textarea autoResize={true}>{translation}</Textarea>;
}
