import { AvatarIcon, LayersIcon } from "@radix-ui/react-icons";
import { JSX } from "react";

export const UserLibraryButtonLabel = (): JSX.Element => (
	<span className="flex flex-nowrap">
		<span className="mr-[0.2rem] mt-[-0.1rem] text-[1.2rem]">
			<AvatarIcon className="inline" />
			<LayersIcon className="mr-[0.2rem] inline" />
		</span>
		User Library
	</span>
);
