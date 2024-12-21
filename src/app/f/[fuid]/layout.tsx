import { ReactNode } from "react";

import { FollowingProvider } from "@/features/following/FollowingProvider";

export default function FollowingLayout({
	children,
}: {
	readonly children: ReactNode;
}) {
	return <FollowingProvider>{children}</FollowingProvider>;
}
