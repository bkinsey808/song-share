import { useEffect, useState } from "react";

export const useNetworkStatus = (): boolean => {
	const [isOnline, setIsOnline] = useState(navigator.onLine);

	useEffect(() => {
		const updateOnlineStatus = (): void => {
			setIsOnline(navigator.onLine);
		};

		window.addEventListener("online", updateOnlineStatus);
		window.addEventListener("offline", updateOnlineStatus);

		return (): void => {
			window.removeEventListener("online", updateOnlineStatus);
			window.removeEventListener("offline", updateOnlineStatus);
		};
	}, []);

	return isOnline;
};
