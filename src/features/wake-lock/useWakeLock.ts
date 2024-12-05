import { useCallback, useEffect, useRef, useState } from "react";

export const useWakeLock = () => {
	const wakeLockRef = useRef<WakeLockSentinel | null>(null);
	const [isWakeLockRequested, setIsWakeLockRequested] = useState(false);

	const requestWakeLock = useCallback(async () => {
		try {
			wakeLockRef.current = await navigator.wakeLock.request("screen");
			wakeLockRef.current.addEventListener("release", () => {
				console.log("Wake lock was released");
			});
			setIsWakeLockRequested(true);
		} catch (err: any) {
			console.error(`Wake lock request failed: ${err?.name}, ${err?.message}`);
		}
	}, []);

	const releaseWakeLock = useCallback(() => {
		if (wakeLockRef.current) {
			wakeLockRef.current.release();
			wakeLockRef.current = null;
			setIsWakeLockRequested(false);
		}
	}, []);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (isWakeLockRequested && document.visibilityState === "visible") {
				requestWakeLock();
			}
		};

		if ("wakeLock" in navigator) {
			document.addEventListener("visibilitychange", handleVisibilityChange);
		} else {
			console.error("Wake lock API not supported.");
		}

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			releaseWakeLock();
		};
	}, [isWakeLockRequested, requestWakeLock, releaseWakeLock]);

	return { requestWakeLock, releaseWakeLock };
};
