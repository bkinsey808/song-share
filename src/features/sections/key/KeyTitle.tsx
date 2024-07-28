"use client";

import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";

export const KeyTitle = () => {
	const { getValue } = useDashboardState();
	const keyNote = getValue(DashboardStateKey.KEY_NOTE);

	return (
		<>
			<div>Key{keyNote ? `: ` : null}</div>
			<div className="overflow-hidden text-ellipsis text-nowrap">
				{keyNote?.replace("b", "♭")}
			</div>
		</>
	);
};
