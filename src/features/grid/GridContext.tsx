"use client";

import React, { ReactNode, createContext, useContext, useMemo } from "react";

type GridContextValue = {
	fixedClassName: string;
	scrollingClassName?: string | undefined;
	fixedColumnCount: number;
	scrollingColumnCount: number;
};

const GridContext = createContext<GridContextValue>({} as GridContextValue);

export const GridProvider: React.FC<{
	fixedClassName: string;
	scrollingClassName?: string | undefined;
	children: ReactNode;
}> = ({ fixedClassName, scrollingClassName, children }) => {
	const fixedColumnCount = useMemo(() => {
		const match = fixedClassName.match(/\[([^\]]+)\]/);
		return match ? match[1].split(",").length : 0;
	}, [fixedClassName]);

	const scrollingColumnCount = useMemo(() => {
		if (!scrollingClassName) {
			return 0;
		}
		const match = scrollingClassName.match(/\[([^\]]+)\]/);
		return match ? match[1].split(",").length : 0;
	}, [scrollingClassName]);

	return (
		<GridContext.Provider
			value={{
				fixedClassName,
				scrollingClassName,
				fixedColumnCount,
				scrollingColumnCount,
			}}
		>
			{children}
		</GridContext.Provider>
	);
};

export const useGridContext = () => useContext(GridContext);
