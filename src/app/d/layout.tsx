import { JSX, ReactNode } from "react";

import { DashboardProvider } from "@/features/dashboard/DashboardProvider";

export default function DashboardLayout({
	children,
}: {
	readonly children: ReactNode;
}): JSX.Element {
	return <DashboardProvider>{children}</DashboardProvider>;
}
