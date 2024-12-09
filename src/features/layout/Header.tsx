"use client";

import {
	EnterFullScreenIcon,
	LayersIcon,
	PaperPlaneIcon,
	QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
		fullScreenToggle,
	} = useAppStore();

	console.log({ isSignedIn, sessionCookieData });

	const { fuid } = useParams();

	const [following, setFollowing] = useState<string>();
	useEffect(() => {
		if (typeof fuid === "string") {
			setFollowing(usernameGet(fuid));
		}
	}, [fuid, userLibrary]);

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
				<span className="flex">
					{isSignedIn ? (
						<Button variant="ghost" onClick={accountManageClick}>
							{sessionCookieData?.username}
						</Button>
					) : (
						<Button variant="ghost" onClick={signInClick()}>
							Sign in
						</Button>
					)}
					<Button
						className="ml-[-0.3rem]"
						variant="ghost"
						title="Full screen toggle"
						onClick={() => fullScreenToggle()}
					>
						<span className="mt-[0.1rem]">
							<EnterFullScreenIcon />
						</span>
					</Button>
				</span>
				{fuid ? (
					<span className="ml-[0.3rem] flex gap-[0.2rem] text-[0.7rem]">
						<span className="mt-[0.1rem]">
							<PaperPlaneIcon />
						</span>
						{following}
						{/* <Button>Stop Following</Button> */}
					</span>
				) : null}
			</div>
		</header>
	);
};
