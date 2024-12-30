import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WakeLockProvider, useWakeLockContext } from "./WakeLockContext";

const mockUseWakeLock = {
	requestWakeLock: jest.fn().mockResolvedValue(undefined),
	releaseWakeLock: jest.fn().mockResolvedValue(undefined),
	isWakeLockActive: false,
};

jest.mock("./useWakeLock", () => ({
	useWakeLock: () => mockUseWakeLock,
}));

const TestComponent = () => {
	const { requestWakeLock, releaseWakeLock, isWakeLockActive } =
		useWakeLockContext();
	return (
		<div>
			<button disabled={isWakeLockActive} onClick={requestWakeLock}>
				Request Wake Lock
			</button>
			<button onClick={releaseWakeLock}>Release Wake Lock</button>
		</div>
	);
};

describe("WakeLockContext", () => {
	beforeEach(() => {
		// Reset mock functions before each test
		jest.clearAllMocks();
	});

	it("should provide requestWakeLock and releaseWakeLock functions", () => {
		render(
			<WakeLockProvider>
				<TestComponent />
			</WakeLockProvider>,
		);

		expect(screen.getByText("Request Wake Lock")).toBeInTheDocument();
		expect(screen.getByText("Release Wake Lock")).toBeInTheDocument();
	});

	it("should throw an error if useWakeLockContext is used outside of WakeLockProvider", () => {
		const consoleError = jest
			.spyOn(console, "error")
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			.mockImplementation(() => {});

		expect(() => render(<TestComponent />)).toThrow(
			"useWakeLockContext must be used within a WakeLockProvider",
		);

		consoleError.mockRestore();
	});

	it("should request a wake lock when the requestWakeLock function is called", async () => {
		render(
			<WakeLockProvider>
				<TestComponent />
			</WakeLockProvider>,
		);

		const requestButton = screen.getByText("Request Wake Lock");
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		await userEvent.click(requestButton);

		expect(mockUseWakeLock.requestWakeLock).toHaveBeenCalled();
	});

	it("should release a wake lock when the releaseWakeLock function is called", async () => {
		render(
			<WakeLockProvider>
				<TestComponent />
			</WakeLockProvider>,
		);

		const releaseButton = screen.getByText("Release Wake Lock");
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		await userEvent.click(releaseButton);

		expect(mockUseWakeLock.releaseWakeLock).toHaveBeenCalled();
	});
});
