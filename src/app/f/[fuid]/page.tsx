import dynamic from "next/dynamic";
import { JSX } from "react";

const DynamicPageContent = dynamic(
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
	() => import("../../../features/following/FollowingPageContent") as any,
);

export default function Dashboard(): JSX.Element {
	return <DynamicPageContent />;
}
