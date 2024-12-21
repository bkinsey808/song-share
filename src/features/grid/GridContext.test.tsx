import { render, screen } from "@testing-library/react";
import React from "react";

import { GridProvider, useGridContext } from "./GridContext";

const TestComponent = () => {
	const {
		fixedClassName,
		scrollingClassName,
		fixedColumnCount,
		scrollingColumnCount,
	} = useGridContext();
	return (
		<div>
			<div data-testid="fixedClassName">{fixedClassName}</div>
			<div data-testid="scrollingClassName">{scrollingClassName}</div>
			<div data-testid="fixedColumnCount">{fixedColumnCount}</div>
			<div data-testid="scrollingColumnCount">{scrollingColumnCount}</div>
		</div>
	);
};

describe("GridContext", () => {
	it("provides the correct context values", () => {
		render(
			<GridProvider
				fixedClassName="grid-cols-[12rem,1fr]"
				scrollingClassName="grid-cols-[2fr,2fr]"
			>
				<TestComponent />
			</GridProvider>,
		);

		expect(screen.getByTestId("fixedClassName")).toHaveTextContent(
			"grid-cols-[12rem,1fr]",
		);
		expect(screen.getByTestId("scrollingClassName")).toHaveTextContent(
			"grid-cols-[2fr,2fr]",
		);
		expect(screen.getByTestId("fixedColumnCount")).toHaveTextContent("2");
		expect(screen.getByTestId("scrollingColumnCount")).toHaveTextContent("2");
	});
});
