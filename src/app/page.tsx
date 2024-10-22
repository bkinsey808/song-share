"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";

export default function Home() {
	const { signInClick } = useAppStore();

	return (
		<main className="flex justify-center">
			This site is currently in closed private alpha. Please check back later.
			<Button variant="ghost" onClick={signInClick}>
				Sign in
			</Button>
		</main>
	);
}
