import { useCallback, useEffect, useRef, useState } from "react";

export const useWakeLock = () => {
	const wakeLockRef = useRef<WakeLockSentinel | null>(null);
	const [isWakeLockRequested, setIsWakeLockRequested] = useState(false);

	const requestWakeLock = useCallback(async () => {
		try {
			if (!wakeLockRef.current) {
				wakeLockRef.current = await navigator.wakeLock.request("screen");
				console.log("Wake lock was requested");

				wakeLockRef.current.addEventListener("release", () => {
					console.log("Wake lock was released");
					setIsWakeLockRequested(false);
				});

				setIsWakeLockRequested(true);
			}
		} catch (err: any) {
			console.error(`Wake lock request failed: ${err.name}, ${err.message}`);
			// Optional: Retry logic or alert user
		}
	}, []);

	const releaseWakeLock = useCallback(() => {
		if (wakeLockRef.current) {
			wakeLockRef.current.release();
			wakeLockRef.current = null;
			setIsWakeLockRequested(false);
			console.log("Wake lock was manually released");
		}
	}, []);

	useEffect(() => {
		const handleVisibilityChange = () => {
			// Check for visibility change and handle wake lock accordingly
			if (document.visibilityState === "visible") {
				console.log("Page became visible again, requesting wake lock");
				if (wakeLockRef.current === null) {
					requestWakeLock();
				}
			} else if (document.visibilityState === "hidden") {
				console.log("Page became hidden, wake lock may be released");
				if (wakeLockRef.current !== null) {
					console.log("Wake lock should remain active, not releasing yet.");
				}
			}
		};

		// Check if the visibility API and wakeLock API are supported
		if ("wakeLock" in navigator) {
			document.addEventListener("visibilitychange", handleVisibilityChange);
		} else {
			console.error("Wake lock API not supported.");
		}

		// Cleanup on unmount
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			releaseWakeLock();
		};
	}, [requestWakeLock, releaseWakeLock]);

	// Sync state with wakeLockRef
	useEffect(() => {
		if (wakeLockRef.current && !isWakeLockRequested) {
			setIsWakeLockRequested(true);
		} else if (!wakeLockRef.current && isWakeLockRequested) {
			setIsWakeLockRequested(false);
		}
	}, [isWakeLockRequested]);

	return { requestWakeLock, releaseWakeLock };
};
