"use client";

import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { getSciBySpelling } from "@/features/music/sci";

export const ScaleTitle = () => {
	const { getValues } = useDashboardState();
	const [scale, keyNote] = getValues([
		DashboardStateKey.SCALE,
		DashboardStateKey.KEY_NOTE,
	]);
	const sci = getSciBySpelling(scale);

	return (
		<>
			<div>Scale{scale.length ? `: ` : null}</div>
			<div className="flex flex-grow gap-[0.4rem] overflow-hidden text-ellipsis text-nowrap">
				{keyNote?.replace("b", "♭")} {sci?.txtCode}
				<div className="inline-flex flex-grow flex-row gap-[0.3rem]">
					(
					{scale.map((scaleDegree) => (
						<div key={scaleDegree}>{scaleDegree.replace("b", "♭")}</div>
					))}
					)<div>{sci?.txtName}</div>
				</div>
			</div>
		</>
	);
};
