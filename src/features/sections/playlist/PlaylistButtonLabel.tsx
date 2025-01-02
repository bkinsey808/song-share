import { JSX } from "react";

import { PlaylistIcon } from "@/features/design-system/PlaylistIcon";

export const PlaylistButtonLabel = (): JSX.Element => (
	<span className="flex flex-nowrap">
		<span className="mr-[0.2rem] mt-[0.2rem]">
			<PlaylistIcon />
		</span>
		Playlist
	</span>
);
