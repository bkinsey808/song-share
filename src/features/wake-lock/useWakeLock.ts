import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Custom hook to manage the Wake Lock API, which prevents the device's screen from turning off.
 *
 * This hook provides functions to request and release a wake lock, ensuring that the device's screen stays on.
 * It also handles visibility changes to automatically release the wake lock when the page is hidden and re-acquire it when the page becomes visible again.
 *
 * @returns {Object} An object containing the following properties:
 * - `requestWakeLock`: A function to request a wake lock.
 * - `releaseWakeLock`: A function to release the wake lock.
 * - `isWakeLockRequested`: A boolean indicating whether a wake lock is currently requested.
 *
 * @example
 * const { requestWakeLock, releaseWakeLock, isWakeLockRequested } = useWakeLock();
 *
 * useEffect(() => {
 *   requestWakeLock();
 *   return () => {
 *     releaseWakeLock();
 *   };
 * }, [requestWakeLock, releaseWakeLock]);
 */
export const useWakeLock = () => {
	const wakeLockRef = useRef<WakeLockSentinel | null>(null);
	const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
	const releaseEventListenerRef = useRef<(() => void) | null>(null);
	const [isWakeLockRequested, setIsWakeLockRequested] = useState(false);

	/**
	 * Requests a wake lock to keep the screen on.
	 *
	 * This function uses the Wake Lock API to request a screen wake lock, ensuring that the device's screen stays on.
	 * If the wake lock is successfully acquired, it sets up an event listener to handle the release of the wake lock.
	 * If the wake lock is released, it attempts to re-acquire it.
	 *
	 * @async
	 * @function
	 * @throws {Error} If the wake lock request fails, it logs a warning and retries after a delay.
	 *
	 * @example
	 * requestWakeLock();
	 */
	const requestWakeLock = useCallback(async () => {
		try {
			if (!("wakeLock" in navigator)) {
				console.error("Wake lock API not supported.");
				return;
			}
			if (!wakeLockRef.current) {
				wakeLockRef.current = await navigator.wakeLock.request("screen");
				console.log("Wake lock was requested");

				const handleRelease = () => {
					console.log("Wake lock was released");
					wakeLockRef.current = null;
					setIsWakeLockRequested(false);
					// Attempt to re-acquire the wake lock
					void requestWakeLock();
				};

				wakeLockRef.current.addEventListener("release", handleRelease);
				releaseEventListenerRef.current = handleRelease;

				setIsWakeLockRequested(true);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.warn(`Wake lock request failed: ${err.name}, ${err.message}`);
			}
			timeoutIdRef.current = setTimeout(() => {
				void requestWakeLock();
			}, 5000);
		}
	}, []);

	const releaseWakeLock = useCallback(async () => {
		try {
			if (wakeLockRef.current) {
				if (releaseEventListenerRef.current) {
					wakeLockRef.current.removeEventListener(
						"release",
						releaseEventListenerRef.current,
					);
					releaseEventListenerRef.current = null;
				}
				await wakeLockRef.current.release();
				wakeLockRef.current = null;
				setIsWakeLockRequested(false);
				console.log("Wake lock was manually released");
			}
			if (timeoutIdRef.current) {
				clearTimeout(timeoutIdRef.current);
				timeoutIdRef.current = null;
			}
		} catch (error) {
			console.error("Error releasing wake lock:", error);
		}
	}, []);

	// when requestWakeLock changes, this useEffect does the following:
	// - if requestWakeLock is true, it calls requestWakeLock
	// - if requestWakeLock is false, it calls releaseWakeLock
	useEffect(() => {
		const handleVisibilityChange = async () => {
			if (document.visibilityState === "visible") {
				console.log("Page became visible again, requesting wake lock");
				await requestWakeLock();
			} else {
				console.log("Page became hidden, releasing wake lock");
				await releaseWakeLock();
			}
		};

		const visibilityChangeHandler = () => void handleVisibilityChange();

		if ("wakeLock" in navigator) {
			document.addEventListener("visibilitychange", visibilityChangeHandler);
		} else {
			console.error("Wake lock API not supported.");
		}

		return () => {
			document.removeEventListener("visibilitychange", visibilityChangeHandler);
			void releaseWakeLock();
		};
	}, [requestWakeLock, releaseWakeLock]);

	return {
		requestWakeLock,
		releaseWakeLock,
		isWakeLockRequested,
		isWakeLockActive:
			wakeLockRef.current !== null && wakeLockRef.current.released === false,
	};
};
