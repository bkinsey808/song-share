"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";

import { useWakeLock } from "./useWakeLock";

type WakeLockContextProps = {
	requestWakeLock: () => Promise<void>;
	releaseWakeLock: () => Promise<void>;
};

const WakeLockContext = createContext<WakeLockContextProps | undefined>(
	undefined,
);

export const WakeLockProvider = ({
	children,
}: {
	readonly children: ReactNode;
}) => {
	const { requestWakeLock, releaseWakeLock } = useWakeLock();

	useEffect(() => {
		void requestWakeLock();
		return () => {
			void releaseWakeLock();
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
