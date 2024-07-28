"use client";

import { SectionId } from "../app-store/enums";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export const SectionAccordionItem = ({
	sectionId,
	title,
	children,
}: {
	sectionId: SectionId;
	title: React.ReactNode;
	children: React.ReactNode;
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
