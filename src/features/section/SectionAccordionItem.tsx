"use client";

import { ReactNode } from "react";

import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionId } from "@/features/sections/types";

export const SectionAccordionItem = ({
	sectionId,
	title,
	children,
}: {
	sectionId: SectionId;
	title: ReactNode;
	children: ReactNode;
}) => {
	return (
		<AccordionItem
			value={sectionId}
			className="m-[0.2rem] rounded border p-[0.2rem] [&[data-state='open']]:border-current"
		>
			<AccordionTrigger>{title}</AccordionTrigger>
			<AccordionContent>
				<section className="p-[0.5rem]">{children}</section>
			</AccordionContent>
		</AccordionItem>
	);
};
