import { ReactNode } from "react";

import { DashboardProvider } from "@/features/dashboard/DashboardProvider";

export default function DashboardLayout({
	children,
}: {
	readonly children: ReactNode;
}) {
	return <DashboardProvider>{children}</DashboardProvider>;
}
