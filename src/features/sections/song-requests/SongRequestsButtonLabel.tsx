import { JSX } from "react";

import { SongRequestIcon } from "@/features/design-system/SongRequestIcon";

export const SongRequestsButtonLabel = (): JSX.Element => (
	<span className="flex flex-nowrap">
		<SongRequestIcon />
		Song Requests
	</span>
);
