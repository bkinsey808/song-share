"use client";

import { Button } from "@/components/ui/button";
import { useAppSliceStore } from "@/features/app-store/useAppStore";

export const Header = () => {
	const { sessionCookieData, isSignedIn, signInClick, accountManageClick } =
		useAppSliceStore();

	return (
		<header className="flex justify-between bg-[gray] p-[0.5rem] text-[hsl(var(--background))]">
			<h1 className="text-4xl font-bold">Song Share</h1>
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
