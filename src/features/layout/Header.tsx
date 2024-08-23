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
			className="flex justify-between bg-[gray] p-[0.5rem] text-[hsl(var(--background))] [&[data-following='true']]:bg-[green]"
		>
			<span className="flex gap-[1rem]">
				<h1 className="text-4xl font-bold">Song Share</h1>
				{fuid ? (
					<span className="mt-[0.4rem] flex gap-[1rem] text-2xl">
						<span>Following: {usernameGet(fuid)}</span>
						<Button>Stop Following</Button>
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
