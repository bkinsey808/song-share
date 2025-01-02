import { JSX } from "react";

import { SongRequestsGrid } from "./SongRequestsGrid";

export const SongRequestsSection = (): JSX.Element => {
	return (
		<section data-title="Song Requests Section">
			<SongRequestsGrid />
		</section>
	);
};
