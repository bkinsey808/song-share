"use client";

import { JSX, ReactNode, createContext, useContext, useEffect } from "react";

import { useWakeLock } from "./useWakeLock";

type WakeLockContextProps = {
	requestWakeLock: () => Promise<void>;
	releaseWakeLock: () => Promise<void>;
	isWakeLockActive: boolean;
};

const WakeLockContext = createContext<WakeLockContextProps | undefined>(
	undefined,
);

export const WakeLockProvider = ({
	children,
}: {
	readonly children: ReactNode;
}): JSX.Element => {
	const { requestWakeLock, releaseWakeLock, isWakeLockActive } = useWakeLock();

	useEffect(() => {
		void requestWakeLock();
		return (): void => {
			void releaseWakeLock();
		};
	}, [requestWakeLock, releaseWakeLock]);

	return (
		<WakeLockContext.Provider
			value={{ requestWakeLock, releaseWakeLock, isWakeLockActive }}
		>
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
