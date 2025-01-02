"use client";

/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, {
	ReactNode,
	RefObject,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

type FullScreenContextType = {
	isFullScreen: boolean;
	requestFullScreen: (element: RefObject<HTMLElement>) => Promise<void>;
	exitFullScreen: () => Promise<void>;
};

const FullScreenContext = createContext<FullScreenContextType | undefined>(
	undefined,
);

type FullScreenProviderProps = {
	readonly children: ReactNode;
};

export const FullScreenProvider: React.FC<FullScreenProviderProps> = ({
	children,
}) => {
	const [isFullScreen, setIsFullScreen] = useState(false);

	const requestFullScreen = async (
		element: RefObject<HTMLElement>,
	): Promise<void> => {
		try {
			if (element.current) {
				if (element.current.requestFullscreen) {
					await element.current.requestFullscreen();
					// @ts-expect-error: Property 'mozRequestFullScreen' does not exist on type 'HTMLElement'.
				} else if (element.current.mozRequestFullScreen) {
					// Firefox
					// @ts-expect-error: Property 'mozRequestFullScreen' does not exist on type 'HTMLElement'.
					element.current.mozRequestFullScreen();
					// @ts-expect-error: Property 'webkitRequestFullScreen' does not exist on type 'HTMLElement'.
				} else if (element.current.webkitRequestFullscreen) {
					// Chrome, Safari, Opera
					// @ts-expect-error: Property 'webkitRequestFullScreen' does not exist on type 'HTMLElement'.
					element.current.webkitRequestFullscreen();
					// @ts-expect-error: Property 'msRequestFullScreen' does not exist on type 'HTMLElement'.
				} else if (element.current.msRequestFullscreen) {
					// IE/Edge
					// @ts-expect-error: Property 'msRequestFullScreen' does not exist on type 'HTMLElement'.
					element.current.msRequestFullscreen();
				}
				setIsFullScreen(true);
			}
		} catch (error) {
			console.error("Failed to request full screen:", error);
		}
	};

	const exitFullScreen = async (): Promise<void> => {
		try {
			if (document.exitFullscreen) {
				await document.exitFullscreen();
				// @ts-expect-error: Property 'mozRequestFullScreen' does not exist on type 'HTMLElement'.
			} else if (document.mozCancelFullScreen) {
				// Firefox
				// @ts-expect-error: Property 'mozRequestFullScreen' does not exist on type 'HTMLElement'.
				document.mozCancelFullScreen();
				// @ts-expect-error: Property 'webkitRequestFullScreen' does not exist on type 'HTMLElement'.
			} else if (document.webkitExitFullscreen) {
				// Chrome, Safari, Opera
				// @ts-expect-error: Property 'webkitRequestFullScreen' does not exist on type 'HTMLElement'.
				document.webkitExitFullscreen();
				// @ts-expect-error: Property 'msRequestFullScreen' does not exist on type 'HTMLElement'.
			} else if (document.msExitFullscreen) {
				// IE/Edge
				// @ts-expect-error: Property 'msRequestFullScreen' does not exist on type 'HTMLElement'.
				document.msExitFullscreen();
			}
			setIsFullScreen(false);
		} catch (error) {
			console.error("Failed to exit full screen:", error);
		}
	};

	const handleFullScreenChange = (): void => {
		setIsFullScreen(document.fullscreenElement != null);
	};

	useEffect(() => {
		document.addEventListener("fullscreenchange", handleFullScreenChange);
		return (): void => {
			document.removeEventListener("fullscreenchange", handleFullScreenChange);
		};
	}, []);

	return (
		<FullScreenContext.Provider
			value={{ isFullScreen, requestFullScreen, exitFullScreen }}
		>
			{children}
		</FullScreenContext.Provider>
	);
};

export const useFullScreen = (): FullScreenContextType => {
	const context = useContext(FullScreenContext);
	if (!context) {
		throw new Error("useFullScreen must be used within a FullScreenProvider");
	}
	return context;
};
