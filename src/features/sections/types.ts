import { JSX } from "react";

import { sectionId } from "./consts";

export type SectionId = (typeof sectionId)[keyof typeof sectionId];

type Component = () => JSX.Element;
export type Sections = Partial<
	Record<
		SectionId,
		{
			title: Component | string;
			section: Component;
			buttonLabel: string | Component;
		}
	>
>;
