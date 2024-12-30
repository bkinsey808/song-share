"use client";

import {
	EnterFullScreenIcon,
	ExitFullScreenIcon,
	EyeClosedIcon,
	EyeOpenIcon,
	LayersIcon,
	PaperPlaneIcon,
	QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { useParams } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";

import { useFullScreen } from "../full-screen/FullScreenContext";
import { useWakeLockContext } from "../wake-lock/WakeLockContext";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { PlaylistIcon } from "@/features/design-system/PlaylistIcon";
import { sectionId } from "@/features/sections/consts";

const brand = process.env.NEXT_PUBLIC_BRAND ?? "Song Share";

export const Header = () => {
	const {
		sessionCookieData,
		isSignedIn,
		signInClick,
		accountManageClick,
		usernameGet,
		userLibrary,
		sectionToggle,
	} = useAppStore();

	const { fuid } = useParams();

	const [following, setFollowing] = useState<string>();
	useEffect(() => {
		if (typeof fuid === "string") {
			setFollowing(usernameGet(fuid));
		}
	}, [fuid, userLibrary, usernameGet]);

	const { isWakeLockActive, requestWakeLock } = useWakeLockContext();
	const { isFullScreen, requestFullScreen, exitFullScreen } = useFullScreen();

	const refElement = useRef<HTMLElement | null>(null);
	// set ref element here
	useEffect(() => {
		if (!refElement.current) {
			refElement.current = document.documentElement;
		}
	}, [refElement]);

	if (fuid && typeof fuid !== "string") {
		return null;
	}

	return (
		<header
			data-following={fuid ? "true" : "false"}
			className="fixed z-[1] flex h-[2.8rem] w-full justify-between overflow-hidden bg-[gray] text-[hsl(var(--background))] lg:static [&[data-following='true']]:bg-[green]"
		>
			<span className="flex gap-[0.2rem] pl-[0.5rem]">
				<Image
					className="mr-[0.1rem] inline"
					src="/favicon-light-mode.svg"
					alt="Brand"
					width={20}
					height={20}
				/>
				<div className="mb-[-0.2rem]">
					<h1 className="text-[1rem] font-bold">
						{process.env.NEXT_PUBLIC_BRAND ?? "Song Share"}
					</h1>
					<div className="mt-[-0.3rem] flex [&>button]:px-[0.2rem]">
						<Button
							variant="ghost"
							className="px-[0.3rem] text-[1rem]"
							onClick={() => sectionToggle(sectionId.ABOUT, true, true)}
							title={`About ${brand}`}
						>
							<QuestionMarkCircledIcon />
						</Button>

						<Button
							variant="ghost"
							className="px-[0.3rem] text-[1rem]"
							onClick={() => sectionToggle(sectionId.SONG, true, true)}
							title="Song"
						>
							<span className="">♪</span>
						</Button>
						<Button
							variant="ghost"
							className="px-[0.3rem] text-[1rem]"
							onClick={() => sectionToggle(sectionId.SONG_LIBRARY, true, true)}
							title="Song Library"
						>
							<LayersIcon className="inline" />
						</Button>
						<Button
							variant="ghost"
							className="mt-[-0.1rem] px-[0.3rem] text-[1rem]"
							onClick={() => sectionToggle(sectionId.PLAYLIST, true, true)}
							title="Playlist"
						>
							<span className="mt-[0.2rem]">
								<PlaylistIcon />
							</span>
						</Button>
						<Button
							variant="ghost"
							className="px-[0.3rem] text-[1rem]"
							onClick={() =>
								sectionToggle(sectionId.PLAYLIST_LIBRARY, true, true)
							}
							title="Playlist Library"
						>
							<LayersIcon className="inline" />
						</Button>
					</div>
				</div>
			</span>
			<div className="ml-[2rem]">
				<span className="flex justify-end">
					{isSignedIn ? (
						<Button variant="ghost" onClick={accountManageClick}>
							{sessionCookieData?.username}
						</Button>
					) : (
						<Button variant="ghost" onClick={signInClick()}>
							Sign in
						</Button>
					)}
					{isFullScreen ? (
						<Button
							className="ml-[-0.3rem]"
							variant="ghost"
							title="Exit full screen"
							onClick={() => exitFullScreen()}
						>
							<span className="mt-[0.1rem]">
								<ExitFullScreenIcon />
							</span>
						</Button>
					) : (
						<Button
							className="ml-[-0.3rem]"
							variant="ghost"
							title="Full screen toggle"
							onClick={async () => {
								if (refElement === null) {
									return;
								}
								await requestFullScreen(refElement as RefObject<HTMLElement>);
							}}
						>
							<span className="mt-[0.1rem]">
								<EnterFullScreenIcon />
							</span>
						</Button>
					)}
				</span>
				<span className="flex justify-end gap-[0.2rem] pr-[0.5rem]">
					{fuid ? (
						<span className="ml-[0.3rem] flex gap-[0.2rem] text-[0.7rem]">
							<span className="mt-[0.1rem]">
								<PaperPlaneIcon />
							</span>
							{following}
							{/* <Button>Stop Following</Button> */}
						</span>
					) : null}
					{isWakeLockActive ? (
						<div title="Wake Lock is Active">
							<EyeOpenIcon />
						</div>
					) : (
						<div title="Wake Lock is not Active">
							<EyeClosedIcon onClick={requestWakeLock} />
						</div>
					)}
				</span>
			</div>
		</header>
	);
};
