/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";
import React from "react";

import { tw } from "../global/tw";
import { Grid } from "./Grid";
import { GridHeader } from "./GridHeader";
import { GridRow } from "./GridRow";

describe("Grid", () => {
	it("renders and places cells correctly in fixed and scrollable sections", () => {
		render(
			<Grid
				fixedClassName={tw`grid-cols-[12rem,1fr]`}
				scrollingClassName={tw`grid-cols-[2fr,2fr]`}
			>
				<GridHeader>
					<div data-testid="fixed-header-1">Fixed Header 1</div>
					<div data-testid="fixed-header-2">Fixed Header 2</div>
					<div data-testid="scrolling-header-1">Scrolling Header 1</div>
					<div data-testid="scrolling-header-2">Scrolling Header 2</div>
				</GridHeader>
				<GridRow>
					<div data-testid="fixed-row-1">Fixed Row 1</div>
					<div data-testid="fixed-row-2">Fixed Row 2</div>
					<div data-testid="scrolling-row-1">Scrolling Row 1</div>
					<div data-testid="scrolling-row-2">Scrolling Row 2</div>
				</GridRow>
				<GridRow>
					<div data-testid="fixed-row-3">Fixed Row 3</div>
					<div data-testid="fixed-row-4">Fixed Row 4</div>
					<div data-testid="scrolling-row-3">Scrolling Row 3</div>
					<div data-testid="scrolling-row-4">Scrolling Row 4</div>
				</GridRow>
			</Grid>,
		);

		// Check if the fixed headers are in the correct container
		const fixedHeader1 = screen.getByTestId("fixed-header-1").closest("div");
		const fixedHeader2 = screen.getByTestId("fixed-header-2").closest("div");

		// Check if the scrollable headers are in the correct container
		const scrollingHeader1 = screen
			.getByTestId("scrolling-header-1")
			.closest("div");
		const scrollingHeader2 = screen
			.getByTestId("scrolling-header-2")
			.closest("div");

		// Check if the fixed rows are in the correct container
		const fixedRow1 = screen.getByTestId("fixed-row-1").closest("div");
		const fixedRow2 = screen.getByTestId("fixed-row-2").closest("div");
		const fixedRow3 = screen.getByTestId("fixed-row-3").closest("div");
		const fixedRow4 = screen.getByTestId("fixed-row-4").closest("div");

		// Check if the scrollable rows are in the correct container
		const scrollingRow1 = screen.getByTestId("scrolling-row-1").closest("div");
		const scrollingRow2 = screen.getByTestId("scrolling-row-2").closest("div");
		const scrollingRow3 = screen.getByTestId("scrolling-row-3").closest("div");
		const scrollingRow4 = screen.getByTestId("scrolling-row-4").closest("div");

		expect(fixedHeader1?.parentElement).toHaveRole("columnheader");
		expect(fixedHeader2?.parentElement).toHaveRole("columnheader");
		expect(scrollingHeader1?.parentElement).toHaveRole("columnheader");
		expect(scrollingHeader2?.parentElement).toHaveRole("columnheader");
		expect(fixedRow1?.parentElement?.parentElement).toHaveClass(
			"grid-cols-[12rem,1fr]",
		);
		expect(fixedRow2?.parentElement?.parentElement).toHaveClass(
			"grid-cols-[12rem,1fr]",
		);
		expect(fixedRow3?.parentElement?.parentElement).toHaveClass(
			"grid-cols-[12rem,1fr]",
		);
		expect(fixedRow4?.parentElement?.parentElement).toHaveClass(
			"grid-cols-[12rem,1fr]",
		);
		expect(scrollingRow1?.parentElement?.parentElement).toHaveClass(
			"grid-cols-[2fr,2fr]",
		);
		expect(scrollingRow2?.parentElement?.parentElement).toHaveClass(
			"grid-cols-[2fr,2fr]",
		);
		expect(scrollingRow3?.parentElement?.parentElement).toHaveClass(
			"grid-cols-[2fr,2fr]",
		);
		expect(scrollingRow4?.parentElement?.parentElement).toHaveClass(
			"grid-cols-[2fr,2fr]",
		);
	});
});
