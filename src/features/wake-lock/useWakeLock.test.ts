import { act, renderHook, waitFor } from "@testing-library/react";

import { useWakeLock } from "./useWakeLock";

describe("useWakeLock", () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let wakeLockMock: { request: any };

	beforeAll(() => {
		// Mock the navigator.wakeLock API
		wakeLockMock = {
			request: jest.fn(),
		};
		Object.defineProperty(global.navigator, "wakeLock", {
			writable: true,
			value: wakeLockMock,
		});

		// Mock document.visibilityState
		jest.spyOn(document, "visibilityState", "get").mockReturnValue("visible");

		// Mock addEventListener and removeEventListener
		jest.spyOn(document, "addEventListener");
		jest.spyOn(document, "removeEventListener");
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("requests a wake lock when called", async () => {
		const mockSentinel = {
			release: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		};
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		wakeLockMock.request.mockResolvedValue(mockSentinel);

		const { result } = renderHook(() => useWakeLock());

		await act(async () => {
			await result.current.requestWakeLock();
		});

		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(navigator.wakeLock.request).toHaveBeenCalledWith("screen");
		expect(mockSentinel.addEventListener).toHaveBeenCalledWith(
			"release",
			expect.any(Function),
		);
	});

	it("releases the wake lock when called", async () => {
		const mockSentinel = {
			release: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		};
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		wakeLockMock.request.mockResolvedValue(mockSentinel);

		const { result } = renderHook(() => useWakeLock());

		await act(async () => {
			await result.current.requestWakeLock();
		});

		await act(async () => {
			await result.current.releaseWakeLock();
		});

		expect(mockSentinel.removeEventListener).toHaveBeenCalledWith(
			"release",
			expect.any(Function),
		);
		expect(mockSentinel.release).toHaveBeenCalled();
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(navigator.wakeLock.request).toHaveBeenCalledTimes(1);
	});

	it("cleans up on unmount", async () => {
		const mockSentinel = {
			release: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		};
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		wakeLockMock.request.mockResolvedValue(mockSentinel);

		const { result, unmount } = renderHook(() => useWakeLock());

		await act(async () => {
			await result.current.requestWakeLock();
		});

		unmount();

		expect(mockSentinel.release).toHaveBeenCalled();
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(document.removeEventListener).toHaveBeenCalledWith(
			"visibilitychange",
			expect.any(Function),
		);
	});

	it("retries requesting wake lock if it fails", async () => {
		jest.useFakeTimers(); // Use fake timers to control setTimeout

		const retrySpy = jest.spyOn(global, "setTimeout");
		const error = new Error("Mock error");
		const mockSentinel = {
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			release: jest.fn(),
		};

		// First call rejects, second resolves
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		wakeLockMock.request
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			.mockRejectedValueOnce(error)
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			.mockResolvedValueOnce(mockSentinel);

		const { result } = renderHook(() => useWakeLock());

		// Attempt to request wake lock (first call fails)
		await act(async () => {
			await result.current.requestWakeLock();
		});

		expect(retrySpy).toHaveBeenCalledWith(expect.any(Function), 5000);

		// Advance the timer to simulate retry
		act(() => {
			jest.runOnlyPendingTimers(); // Simulate the passage of 5 seconds
		});

		// Verify that wake lock request was retried
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(navigator.wakeLock.request).toHaveBeenCalledTimes(2);

		retrySpy.mockRestore();
		jest.useRealTimers(); // Restore real timers
	});

	it("handles visibility changes correctly", async () => {
		const mockSentinel = {
			release: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		};
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		wakeLockMock.request.mockResolvedValue(mockSentinel);
		const { result } = renderHook(() => useWakeLock());

		await act(async () => {
			await result.current.requestWakeLock();
		});

		// Simulate page becoming hidden
		Object.defineProperty(document, "visibilityState", {
			get: jest.fn(() => "hidden"),
		});
		document.dispatchEvent(new Event("visibilitychange"));
		await waitFor(() => expect(mockSentinel.release).toHaveBeenCalled());

		// Simulate page becoming visible again
		Object.defineProperty(document, "visibilityState", {
			get: jest.fn(() => "visible"),
		});
		document.dispatchEvent(new Event("visibilitychange"));
		await waitFor(() =>
			// eslint-disable-next-line @typescript-eslint/unbound-method
			expect(navigator.wakeLock.request).toHaveBeenCalledWith("screen"),
		);

		expect(mockSentinel.addEventListener).toHaveBeenCalledWith(
			"release",
			expect.any(Function),
		);
	});
});
