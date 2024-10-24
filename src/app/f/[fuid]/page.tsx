import dynamic from "next/dynamic";

const DynamicPageContent = dynamic(
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
	() => import("../../../features/following/FollowingPageContent") as any,
	{
		ssr: false,
	},
);

export default function Dashboard() {
	return <DynamicPageContent />;
}
