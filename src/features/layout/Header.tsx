"use client";

import { useAuthStore } from "../auth/useAuthStore";
import { Button } from "@/components/ui/button";

export const Header = () => {
	const {
		sessionCookieData,
		isSignedIn,
		signInClick,
		acocuntManageClick: manageAccountClick,
	} = useAuthStore();

	return (
		<header className="flex justify-between bg-[gray] p-[0.5rem] text-[hsl(var(--background))]">
			<h1 className="text-4xl font-bold">Song Share</h1>
			{isSignedIn ? (
				<Button variant="ghost" onClick={manageAccountClick}>
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
