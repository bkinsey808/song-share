import { ReactNode } from "react";

import { Header } from "@/features/layout/Header";

export const PageContent = ({ children }: { children?: ReactNode }) => {
	return (
		<div className="@container flex h-screen flex-col lg:max-h-screen">
			<Header />
			<main className="flex-grow overflow-auto lg:overflow-hidden">
				<div className="grid grid-cols-1 lg:h-full lg:grid-cols-2 lg:overflow-auto">
					{children}
				</div>
			</main>
		</div>
	);
};

export default PageContent;
