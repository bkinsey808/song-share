"use client";

import { LayersIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { sectionId } from "../sections/consts";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { PlaylistIcon } from "@/features/design-system/PlaylistIcon";

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
	}, [fuid, userLibrary]);

	if (fuid && typeof fuid !== "string") {
		return null;
	}

	return (
		<header
			data-following={fuid ? "true" : "false"}
			className="fixed z-[1] flex w-full justify-between bg-[gray] p-[0.5rem] text-[hsl(var(--background))] lg:static [&[data-following='true']]:bg-[green]"
		>
			<span className="flex gap-[0.2rem]">
				<h1 className="font-bold">
					<Image
						className="mr-[0.1rem] mt-[-0.2rem] inline"
						src="/favicon-light-mode.svg"
						alt="Brand"
						width={20}
						height={20}
					/>

					{process.env.NEXT_PUBLIC_BRAND ?? "Song Share"}
				</h1>
				<Button
					variant="ghost"
					className="mt-[-0.1rem] px-[0.3rem] text-[1rem]"
					onClick={() => sectionToggle(sectionId.SONG, true, true)}
					title="Song"
				>
					♪
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
					onClick={() => sectionToggle(sectionId.PLAYLIST_LIBRARY, true, true)}
					title="Playlist Library"
				>
					<LayersIcon className="inline" />
				</Button>

				{fuid ? (
					<span className="ml-[0.3rem] mt-[0.2rem] flex gap-[0.2rem] text-[0.7rem]">
						<span className="mt-[0.1rem]">
							<PaperPlaneIcon />
						</span>
						{following}
						{/* <Button>Stop Following</Button> */}
					</span>
				) : null}
			</span>
			{isSignedIn ? (
				<Button variant="ghost" onClick={accountManageClick}>
					{sessionCookieData?.username}
				</Button>
			) : (
				<Button variant="ghost" onClick={signInClick}>
					Sign in
				</Button>
			)}
		</header>
	);
};
1;
