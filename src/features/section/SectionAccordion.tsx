"use client";

import { ReactNode, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { useOpenSection } from "@/features/section/slice";
import { SectionId } from "@/features/sections/types";

export const SectionAccordion = ({
	title,
	buttonLabel,
	buttonVariant,
	sectionId,
	children,
}: {
	title: ReactNode;
	buttonLabel?: ReactNode;
	buttonVariant?: Parameters<typeof Button>[0]["variant"];
	sectionId: SectionId;
	children: ReactNode;
}) => {
	const { sectionToggle } = useAppStore();
	const isOpen = useOpenSection(sectionId);
	const detailsRef = useRef<HTMLDetailsElement>(null);

	// open/close the accordion when the state changes
	useEffect(() => {
		if (!detailsRef.current) {
			return;
		}

		if (isOpen) {
			// open the accordion before the animation
			detailsRef.current.open = true;
		} else {
			// close the accordion after the animation
			setTimeout(() => {
				if (detailsRef.current) {
					detailsRef.current.open = false;
				}
			}, 200);
		}
	}, [isOpen]);

	return (
		<details
			id={sectionId}
			ref={detailsRef}
			data-open={isOpen}
			className="my-[0.2rem] rounded border p-[0.2rem] [&:has(:focus-visible)]:border-current"
		>
			<summary
				className="w-cursor-pointer mb-[0.25rem] flex flex-row flex-nowrap gap-[0.5rem] overflow-hidden text-nowrap"
				onClick={(e) => {
					e.preventDefault();
					sectionToggle(sectionId);
				}}
			>
				<Button className="flex" variant={buttonVariant}>
					<div className="transition-all duration-200 [[data-open='true']>summary>button>&]:rotate-90">
						▶
					</div>
					<div className="flex flex-nowrap gap-[0.5rem]">
						{isOpen ? "Close" : "Open"} {buttonLabel}
					</div>
				</Button>
				<div className="flex-grow overflow-hidden overflow-ellipsis">
					{title}
				</div>
			</summary>
			<div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 [[data-open='true']>&]:grid-rows-[1fr]">
				<div className="overflow-hidden">{children}</div>
			</div>
		</details>
	);
};
