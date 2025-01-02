"use client";

import { JSX } from "react";

import { LogForm } from "./LogForm";
import { LogGrid } from "./LogGrid";

export const LogSection = (): JSX.Element => {
	return (
		<section data-title="Log Section">
			<LogForm />
			<LogGrid />
		</section>
	);
};
