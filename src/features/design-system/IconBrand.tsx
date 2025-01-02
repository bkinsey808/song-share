import Image from "next/image";
import { JSX } from "react";

const brand = process.env.NEXT_PUBLIC_BRAND ?? "Song Share";

export const IconBrand = (): JSX.Element => {
	return (
		<span className="whitespace-nowrap">
			<Image
				className="mr-[0.1rem] mt-[-0.2rem] inline"
				src="/favicon.svg"
				alt="Brand"
				width={20}
				height={20}
			/>
			{brand}
		</span>
	);
};
