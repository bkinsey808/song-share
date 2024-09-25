import {
	ButtonHTMLAttributes,
	HTMLAttributes,
	createContext,
	forwardRef,
	useContext,
} from "react";

import { cn } from "@/lib/utils";

type GridContextValue = {
	gridClassName: string;
};

const GridContext = createContext<GridContextValue>({} as GridContextValue);

export const Grid = (
	props: ButtonHTMLAttributes<HTMLDivElement> & {
		/** gets applied to both the grid header and grid rows */
		gridClassName: string;
	},
) => {
	return (
		<GridContext.Provider value={{ gridClassName: props.gridClassName }}>
			{props.children}
		</GridContext.Provider>
	);
};

export const GridHeader = ({
	className,
	...props
}: ButtonHTMLAttributes<HTMLDivElement>) => {
	const { gridClassName } = useContext(GridContext);

	return (
		<div
			className={cn(
				"mb-[0.5rem] grid grid-flow-col gap-[0.5rem] border-b border-[currentColor] font-bold",
				gridClassName,
				className,
			)}
			{...props}
		/>
	);
};

export const GridRow = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const { gridClassName } = useContext(GridContext);

	return (
		<div
			ref={ref}
			className={cn(
				"grid grid-flow-col items-baseline gap-[0.5rem]",
				gridClassName,
				className,
			)}
			{...props}
		/>
	);
});
GridRow.displayName = "GridRow";
