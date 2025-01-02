"use client";

import React, { JSX } from "react";

import { tw } from "../global/tw";
import { useGridContext } from "./GridContext";
import { cn } from "@/lib/utils";

type GridRowProps = {
	readonly className?: string;
	readonly children: React.ReactNode;
	readonly section?: "fixed" | "scrolling";
};

export const GridRow = ({
	className,
	section,
	children,
}: GridRowProps): JSX.Element => {
	const { fixedColumnCount, scrollingColumnCount } = useGridContext();

	const childrenArray = React.Children.toArray(children);

	const fixedChildren = childrenArray.slice(0, fixedColumnCount);
	const scrollingChildren = childrenArray.slice(fixedColumnCount);

	const cellClassName = cn(
		tw`[&>*]:overflow-hidden [&>*]:text-ellipsis [&>*]:whitespace-nowrap flex-shrink-0`,
		className,
	);

	return (
		<>
			{section === "fixed" &&
				fixedChildren.map((child, index) => (
					<div key={index} role="cell" className={cn("grid", cellClassName)}>
						{child}
					</div>
				))}

			{section === "scrolling" &&
				scrollingColumnCount > 0 &&
				scrollingChildren.map((child, index) => (
					<div key={index} role="cell" className={cn("grid", cellClassName)}>
						{child}
					</div>
				))}
		</>
	);
};
