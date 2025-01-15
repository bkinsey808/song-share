"use client";

import React, { JSX, ReactNode } from "react";

import { tw } from "../global/tw";
import { useGridContext } from "./GridContext";
import { SortableItem } from "@/components/ui/sortable";
import { cn } from "@/lib/utils";

type GridRowProps = {
	readonly className?: string;
	readonly section?: "fixed" | "scrolling";
	readonly sortableItemValue?: string;
	readonly children: ReactNode;
};

export const GridRow = ({
	className,
	section,
	sortableItemValue,
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
					<SortableItem key={index} value={sortableItemValue ?? index} asChild>
						<div key={index} role="cell" className={cn("grid", cellClassName)}>
							{child}
						</div>
					</SortableItem>
				))}
		</>
	);
};
