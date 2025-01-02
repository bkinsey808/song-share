import { GearIcon } from "@radix-ui/react-icons";
import { JSX } from "react";

export const SettingsButtonLabel = (): JSX.Element => (
	<span className="flex flex-nowrap">
		<GearIcon className="mr-[0.2rem] mt-[0.2rem] inline" />
		Settings
	</span>
);
