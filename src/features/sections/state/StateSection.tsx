"use client";

import { useDashboardState } from "@/app/d/useDashboardState";

export const StateSection = () => {
	const { getState, resetState } = useDashboardState();
	const state = getState();

	return (
		<section data-title="State Section">
			<pre>{JSON.stringify(state, null, 2)}</pre>
			<button onClick={resetState}>Reset state</button>
		</section>
	);
};
