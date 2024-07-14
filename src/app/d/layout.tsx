import { Header } from "@/features/layout/Header";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="@container flex h-screen flex-col lg:max-h-screen">
			<Header />
			{children}
		</div>
	);
}
