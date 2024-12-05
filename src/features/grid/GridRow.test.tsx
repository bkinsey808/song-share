import { render, screen } from "@testing-library/react";
import React from "react";

import { GridProvider } from "./GridContext";
import { GridRow } from "./GridRow";

describe("GridRow", () => {
	it("renders fixed and scrollable sections correctly when section is provided", () => {
		render(
			<GridProvider
				fixedClassName="grid-cols-[12rem,1fr]"
				scrollingClassName="grid-cols-[2fr,2fr]"
			>
				<GridRow section="fixed">
					<div data-testid="fixed-row-1">Fixed Row 1</div>
					<div data-testid="fixed-row-2">Fixed Row 2</div>
					<div data-testid="scrolling-row-1">Scrolling Row 1</div>
					<div data-testid="scrolling-row-2">Scrolling Row 2</div>
				</GridRow>
				<GridRow section="scrolling">
					<div data-testid="fixed-row-1">Fixed Row 1</div>
					<div data-testid="fixed-row-2">Fixed Row 2</div>
					<div data-testid="scrolling-row-1">Scrolling Row 1</div>
					<div data-testid="scrolling-row-2">Scrolling Row 2</div>
				</GridRow>
			</GridProvider>,
		);

		// Check if the fixed rows are in the correct container
		const fixedRow1 = screen.getByTestId("fixed-row-1");
		const fixedRow2 = screen.getByTestId("fixed-row-2");

		// Check if the scrollable rows are in the correct container
		const scrollingRow1 = screen.getByTestId("scrolling-row-1");
		const scrollingRow2 = screen.getByTestId("scrolling-row-2");

		expect(fixedRow1).toBeInTheDocument();
		expect(fixedRow2).toBeInTheDocument();
		expect(scrollingRow1).toBeInTheDocument();
		expect(scrollingRow2).toBeInTheDocument();

		// Check if the fixed rows are in the correct container
		expect(fixedRow1?.parentElement).toHaveRole("cell");
		expect(fixedRow2?.parentElement).toHaveRole("cell");
		expect(scrollingRow1?.parentElement).toHaveRole("cell");
		expect(scrollingRow2?.parentElement).toHaveRole("cell");
	});
});
