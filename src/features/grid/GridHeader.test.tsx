import { render, screen } from "@testing-library/react";
import React from "react";

import { GridProvider } from "./GridContext";
import { GridHeader } from "./GridHeader";

describe("GridHeader", () => {
	it("renders fixed and scrollable sections correctly", () => {
		render(
			<GridProvider
				fixedClassName="grid-cols-[12rem,1fr]"
				scrollingClassName="grid-cols-[2fr,2fr]"
			>
				<GridHeader section="fixed">
					<div data-testid="fixed-header-1">Fixed Header 1</div>
					<div data-testid="fixed-header-2">Fixed Header 2</div>
					<div data-testid="scrolling-header-1">Scrolling Header 1</div>
					<div data-testid="scrolling-header-2">Scrolling Header 2</div>{" "}
				</GridHeader>
				<GridHeader section="scrolling">
					<div data-testid="fixed-header-1">Fixed Header 1</div>
					<div data-testid="fixed-header-2">Fixed Header 2</div>
					<div data-testid="scrolling-header-1">Scrolling Header 1</div>
					<div data-testid="scrolling-header-2">Scrolling Header 2</div>
				</GridHeader>
			</GridProvider>,
		);

		// Check if the fixed headers are correctly rendered
		expect(screen.getByTestId("fixed-header-1")).toBeInTheDocument();
		expect(screen.getByTestId("fixed-header-2")).toBeInTheDocument();

		// Check if the scrollable headers are correctly rendered
		expect(screen.getByTestId("scrolling-header-1")).toBeInTheDocument();
		expect(screen.getByTestId("scrolling-header-2")).toBeInTheDocument();
	});

	it("shows a warning if there are too many children", () => {
		const consoleWarnMock = jest.spyOn(console, "warn").mockImplementation();

		render(
			<GridProvider
				fixedClassName="grid-cols-[12rem,1fr]"
				scrollingClassName="grid-cols-[2fr,2fr]"
			>
				<GridHeader section="fixed">
					<div>Fixed Header 1</div>
					<div>Fixed Header 2</div>
					<div>Excess Header</div>
					<div>Scrolling Header 1</div>
					<div>Scrolling Header 2</div>
					<div>Excess Header</div>
				</GridHeader>
				<GridHeader section="scrolling">
					<div>Fixed Header 1</div>
					<div>Fixed Header 2</div>
					<div>Excess Header</div>
					<div>Scrolling Header 1</div>
					<div>Scrolling Header 2</div>
					<div>Excess Header</div>
				</GridHeader>
			</GridProvider>,
		);

		expect(consoleWarnMock).toHaveBeenCalledWith(
			"GridHeader has too many elements: 6 (allowed: 4)",
		);

		consoleWarnMock.mockRestore();
	});
});
