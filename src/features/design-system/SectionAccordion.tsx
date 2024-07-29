"use client";

import { ReactNode, useEffect, useRef } from "react";

import { SectionId } from "../app-store/enums";
import { useAppStore, useOpenSection } from "../app-store/useAppStore";

export const SectionAccordion = ({
	title,
	sectionId,
	children,
}: {
	title: ReactNode;
	sectionId: SectionId;
	children: ReactNode;
}) => {
	const { sectionToggle } = useAppStore();
	const isOpen = useOpenSection(sectionId);

	const detailsRef = useRef<HTMLDetailsElement>(null);

	// open the accordion when the state changes
	useEffect(() => {
		if (detailsRef.current) {
			detailsRef.current.open = isOpen;
		}
	}, [isOpen]);

	return (
		<details
			id={sectionId}
			ref={detailsRef}
			data-open={isOpen}
			className="my-[0.2rem] rounded border border-current p-[0.2rem]"
		>
			<summary
				className="mb-[0.25rem] flex cursor-pointer flex-row flex-nowrap gap-[0.5rem]"
				onClick={(e) => {
					e.preventDefault();
					sectionToggle(sectionId);

					if (detailsRef.current) {
						detailsRef.current.open = !detailsRef.current.open;
					}
				}}
			>
				<div>
					<div className="transition-all [[data-open='true']>summary>div>&]:rotate-90">
						▶
					</div>
				</div>
				{title}
			</summary>
			{children}
		</details>
	);
};
