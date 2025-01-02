import { Pencil1Icon } from "@radix-ui/react-icons";
import { JSX } from "react";

export const LogButtonLabel = (): JSX.Element => (
	<span className="flex flex-nowrap">
		<Pencil1Icon className="mr-[0.2rem] mt-[0.2rem] inline" />
		Logs
	</span>
);
