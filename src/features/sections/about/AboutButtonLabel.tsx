import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { JSX } from "react";

export const AboutButtonLabel = (): JSX.Element => (
	<span className="flex flex-nowrap">
		<QuestionMarkCircledIcon className="mr-[0.2rem] mt-[0.2rem] inline" />
		About
	</span>
);
