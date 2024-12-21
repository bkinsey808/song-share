import { ReactNode } from "react";

import { Header } from "@/features/layout/Header";

export const PageContent = ({
	children,
}: {
	readonly children?: ReactNode;
}) => {
	return (
		<>
			<Header />
			<div className="lg:h-[100dvh] lg:overflow-hidden">
				<main className="grid grid-cols-1 py-[2.5rem] lg:h-full lg:grid-cols-2 lg:pt-0">
					{children}
				</main>
			</div>
		</>
	);
};

export default PageContent;
