import React from "react";

import { GridProvider } from "./GridContext";
import { GridHeader } from "./GridHeader";
import { GridRow } from "./GridRow";

type GridProps = {
	readonly fixedClassName: string;
	readonly scrollingClassName?: string | undefined;
	readonly children: React.ReactNode;
};

export const Grid = ({
	fixedClassName,
	scrollingClassName,
	children,
}: GridProps) => {
	return (
		<GridProvider
			fixedClassName={fixedClassName}
			scrollingClassName={scrollingClassName}
		>
			<div className="flex max-w-full gap-x-[0.5rem] overflow-hidden">
				<div
					className={`grid max-w-full flex-shrink-0 auto-rows-[2rem] gap-x-[0.5rem] overflow-hidden ${fixedClassName}`}
					role="rowgroup"
				>
					{React.Children.map(children, (child) =>
						React.isValidElement(child) &&
						(child.type === GridHeader || child.type === GridRow)
							? React.cloneElement(child, { section: "fixed" } as {
									section: "fixed" | "scrolling";
								})
							: child,
					)}
				</div>
				<div className="overflow-x-auto">
					<div
						className={`grid auto-rows-[2rem] gap-x-[0.5rem] ${scrollingClassName}`}
						role="rowgroup"
					>
						{React.Children.map(children, (child) =>
							React.isValidElement(child) &&
							(child.type === GridHeader || child.type === GridRow)
								? React.cloneElement(child, { section: "scrolling" } as {
										section: "fixed" | "scrolling";
									})
								: child,
						)}
					</div>
				</div>
			</div>
		</GridProvider>
	);
};
