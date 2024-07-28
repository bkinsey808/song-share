import dynamic from "next/dynamic";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
const DynamicPageContent = dynamic(() => import("./PageContent") as any, {
	ssr: false,
});

export default function Dashboard() {
	return <DynamicPageContent />;
}
