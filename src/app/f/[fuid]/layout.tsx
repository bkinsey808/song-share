import { JSX, ReactNode } from "react";

import { FollowingProvider } from "@/features/following/FollowingProvider";

export default function FollowingLayout({
	children,
}: {
	readonly children: ReactNode;
}): JSX.Element {
	return <FollowingProvider>{children}</FollowingProvider>;
}
