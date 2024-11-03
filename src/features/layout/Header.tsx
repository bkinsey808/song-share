"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";

export const Header = () => {
	const {
		sessionCookieData,
		isSignedIn,
		signInClick,
		accountManageClick,
		usernameGet,
	} = useAppStore();

	const { fuid } = useParams();

	const [following, setFollowing] = useState<string>();
	useEffect(() => {
		if (typeof fuid === "string") {
			setFollowing(usernameGet(fuid));
		}
	}, [fuid]);

	if (fuid && typeof fuid !== "string") {
		return null;
	}

	return (
		<header
			data-following={fuid ? "true" : "false"}
			className="fixed z-[1] flex w-full justify-between bg-[gray] p-[0.5rem] text-[hsl(var(--background))] lg:static [&[data-following='true']]:bg-[green]"
		>
			<span className="flex gap-[1rem]">
				<h1 className="font-bold">
					{process.env.NEXT_PUBLIC_BRAND ?? "Song Share"}
				</h1>
				{fuid ? (
					<span className="flex gap-[1rem]">
						<span>
							Following:{" "}
							<span suppressHydrationWarning={true}>{following}</span>
						</span>
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
