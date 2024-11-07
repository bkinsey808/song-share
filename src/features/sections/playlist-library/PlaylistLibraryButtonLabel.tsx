import { LayersIcon } from "@radix-ui/react-icons";

import { PlaylistIcon } from "@/features/design-system/PlaylistIcon";

export const PlaylistLibraryButtonLabel = () => (
	<span className="flex flex-nowrap">
		<span className="mt-[0.2rem] text-nowrap">
			<PlaylistIcon />
		</span>
		<LayersIcon className="mr-[0.2rem] mt-[0.2rem] inline" />
		Playlist Library
	</span>
);
