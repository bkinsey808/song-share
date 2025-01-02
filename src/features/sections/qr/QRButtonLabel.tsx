import { BoxModelIcon } from "@radix-ui/react-icons";
import { JSX } from "react";

export const QRButtonLabel = (): JSX.Element => (
	<span className="flex flex-nowrap">
		<BoxModelIcon className="mr-[0.2rem] mt-[0.2rem] inline" />
		QR
	</span>
);
