"use client";

import { LogForm } from "./LogForm";
import { LogGrid } from "./LogGrid";

export const LogSection = () => {
	return (
		<section data-title="Log Section">
			<LogForm />
			<LogGrid />
		</section>
	);
};
