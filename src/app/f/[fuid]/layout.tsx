import { ReactNode } from "react";

import { FollowingProvider } from "@/features/following/FollowingProvider";

export default function FollowingLayout({ children }: { children: ReactNode }) {
	return <FollowingProvider>{children}</FollowingProvider>;
}
