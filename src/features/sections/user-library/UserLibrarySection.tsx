import { JSX } from "react";

import { UserLibraryGrid } from "./UserLibraryGrid";

export const UserLibrarySection = (): JSX.Element => {
	return (
		<section data-title="User Library Section" className="p-[1rem]">
			<UserLibraryGrid />
		</section>
	);
};
