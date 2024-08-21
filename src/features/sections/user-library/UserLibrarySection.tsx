"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";
import { getKeys } from "@/features/global/getKeys";

export const UserLibrarySection = () => {
	const { userLibrary, usernameGet, userLoadClick } = useAppStore();
	const userIds = getKeys(userLibrary);

	return (
		<section data-title="User Library Section" className="p-[1rem]">
			<Grid gridClassName="grid-cols-[5fr,1fr]">
				<GridHeader>
					<div>User Name</div>
					<div>Options</div>
				</GridHeader>
				{userIds.map((uid) => (
					<GridRow key={uid}>
						<div>{usernameGet(uid)}</div>
						<div>
							<Button onClick={userLoadClick(uid)}>Load</Button>
						</div>
					</GridRow>
				))}
			</Grid>
		</section>
	);
};
