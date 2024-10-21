"use client";

import { useParams } from "next/navigation";

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
						<span>Following: {usernameGet(fuid)}</span>
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
