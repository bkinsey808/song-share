"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";

import { useWakeLock } from "./useWakeLock";

interface WakeLockContextProps {
	requestWakeLock: () => void;
	releaseWakeLock: () => void;
}

const WakeLockContext = createContext<WakeLockContextProps | undefined>(
	undefined,
);

export const WakeLockProvider = ({ children }: { children: ReactNode }) => {
	const { requestWakeLock, releaseWakeLock } = useWakeLock();

	useEffect(() => {
		requestWakeLock();
		return () => {
			releaseWakeLock();
		};
	}, [requestWakeLock, releaseWakeLock]);

	return (
		<WakeLockContext.Provider value={{ requestWakeLock, releaseWakeLock }}>
			{children}
		</WakeLockContext.Provider>
	);
};

export const useWakeLockContext = (): WakeLockContextProps => {
	const context = useContext(WakeLockContext);
	if (context === undefined) {
		throw new Error(
			"useWakeLockContext must be used within a WakeLockProvider",
		);
	}
	return context;
};
