import { ReactNode } from "react";

export const PageColumn = ({ children }: { readonly children: ReactNode }) => {
	// vertically scrollable, styled with tailwind
	return (
		<div className="flex h-full flex-col gap-[var(--section-gap)] px-[0.5rem] lg:overflow-y-auto">
			{children}
		</div>
	);
};
