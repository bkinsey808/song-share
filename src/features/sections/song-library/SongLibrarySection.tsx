import { JSX } from "react";

import { SongLibraryGrid } from "./SongLibraryGrid";

export const SongLibrarySection = (): JSX.Element => {
	return (
		<section data-title="Song Library Section">
			<SongLibraryGrid />
		</section>
	);
};
