"use client";

import React, { useEffect } from "react";

import { tw } from "../global/tw";
import { useGridContext } from "./GridContext";
import { cn } from "@/lib/utils";

type GridHeaderProps = {
	className?: string;
	children: React.ReactNode;
	section?: "fixed" | "scrolling";
};

export const GridHeader = ({
	className,
	section,
	children,
}: GridHeaderProps) => {
	const { fixedColumnCount, scrollingColumnCount } = useGridContext();

	const childrenArray = React.Children.toArray(children);
	const totalAllowedColumns = fixedColumnCount + scrollingColumnCount;

	useEffect(() => {
		if (childrenArray.length > totalAllowedColumns) {
			console.warn(
				`GridHeader has too many elements: ${childrenArray.length} (allowed: ${totalAllowedColumns})`,
			);
		}
	}, [childrenArray, totalAllowedColumns]);

	const fixedChildren = childrenArray.slice(0, fixedColumnCount);
	const scrollingChildren = childrenArray.slice(fixedColumnCount);

	const cellClassName = cn(
		tw`mt-[-0.1rem] mb-[0.5rem] border-b border-[currentColor] font-bold [&>*]:overflow-hidden [&>*]:text-ellipsis [&>*]:whitespace-nowrap`,
		className,
	);

	return (
		<>
			{section === "fixed" &&
				fixedChildren.map((child, index) => (
					<div
						key={index}
						role="columnheader"
						className={cn("flex-shrink-0", cellClassName)}
					>
						{child}
					</div>
				))}
			{section === "scrolling" &&
				scrollingColumnCount > 0 &&
				scrollingChildren.map((child, index) => (
					<div
						key={index}
						role="columnheader"
						className={cn("flex-shrink-0", cellClassName)}
					>
						{child}
					</div>
				))}
		</>
	);
};
