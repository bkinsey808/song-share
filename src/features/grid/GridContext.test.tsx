import { render } from "@testing-library/react";
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
		const { getByTestId } = render(
			<GridProvider
				fixedClassName="grid-cols-[12rem,1fr]"
				scrollingClassName="grid-cols-[2fr,2fr]"
			>
				<TestComponent />
			</GridProvider>,
		);

		expect(getByTestId("fixedClassName").textContent).toBe(
			"grid-cols-[12rem,1fr]",
		);
		expect(getByTestId("scrollingClassName").textContent).toBe(
			"grid-cols-[2fr,2fr]",
		);
		expect(getByTestId("fixedColumnCount").textContent).toBe("2");
		expect(getByTestId("scrollingColumnCount").textContent).toBe("2");
	});
});
