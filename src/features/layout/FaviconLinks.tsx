"use client";

import { JSX } from "react";

import { useMediaQuery } from "../global/useMediaQuery";

export const FaviconLinks = (): JSX.Element => {
	const prefersLightMode = useMediaQuery("(prefers-color-scheme: light)");

	return (
		<>
			<link
				rel="icon"
				type="image/png"
				href={
					prefersLightMode
						? "/favicon-48x48-light-mode.png"
						: "/favicon-48x48.png"
				}
				sizes="48x48"
			/>
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/apple-touch-icon.png"
			/>
			<link
				rel="shortcut icon"
				href={prefersLightMode ? "/favicon-light-mode.ico" : "/favicon.ico"}
			/>
			<link
				rel="icon"
				type="image/svg+xml"
				href={prefersLightMode ? "/favicon-light-mode.svg" : "/favicon.svg"}
			/>
		</>
	);
};
