import { fireEvent, render, screen } from "@testing-library/react";
import { RefObject, createRef } from "react";

import { FullScreenProvider, useFullScreen } from "./FullScreenContext";

const TestComponent: React.FC = () => {
	const { isFullScreen, requestFullScreen, exitFullScreen } = useFullScreen();
	const elementRef: RefObject<HTMLDivElement | null> = createRef();

	return (
		<div>
			<div ref={elementRef} data-testid="fullscreen-element">
				FullScreen Element
			</div>
			<button
				onClick={() => requestFullScreen(elementRef as RefObject<HTMLElement>)}
				data-testid="request-button"
			>
				Request FullScreen
			</button>
			<button onClick={exitFullScreen} data-testid="exit-button">
				Exit FullScreen
			</button>
			<div data-testid="fullscreen-status">
				{isFullScreen ? "FullScreen" : "Not FullScreen"}
			</div>
		</div>
	);
};

describe("FullScreenContext", () => {
	beforeEach(() => {
		document.exitFullscreen = jest.fn();
		document.addEventListener = jest.fn();
		document.removeEventListener = jest.fn();
	});

	it("should render children correctly", () => {
		render(
			<FullScreenProvider>
				<TestComponent />
			</FullScreenProvider>,
		);
		expect(screen.getByTestId("fullscreen-element")).toBeInTheDocument();
	});

	it("should request full screen", () => {
		const requestFullscreenMock = jest.fn();
		HTMLDivElement.prototype.requestFullscreen = requestFullscreenMock;

		render(
			<FullScreenProvider>
				<TestComponent />
			</FullScreenProvider>,
		);

		fireEvent.click(screen.getByTestId("request-button"));
		expect(requestFullscreenMock).toHaveBeenCalled();
	});

	it("should exit full screen", () => {
		render(
			<FullScreenProvider>
				<TestComponent />
			</FullScreenProvider>,
		);

		fireEvent.click(screen.getByTestId("exit-button"));
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(document.exitFullscreen).toHaveBeenCalled();
	});

	it("should update full screen status", () => {
		render(
			<FullScreenProvider>
				<TestComponent />
			</FullScreenProvider>,
		);

		fireEvent.click(screen.getByTestId("request-button"));
		expect(screen.getByTestId("fullscreen-status")).toHaveTextContent(
			"FullScreen",
		);

		fireEvent.click(screen.getByTestId("exit-button"));
		expect(screen.getByTestId("fullscreen-status")).toHaveTextContent(
			"Not FullScreen",
		);
	});
});
