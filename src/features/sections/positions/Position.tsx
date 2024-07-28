"use client";

import Link from "next/link";

import { DashboardStateKey } from "@/app/d/enums";
import { Position as PositionType } from "@/app/d/types";
import { useDashboardState } from "@/app/d/useDashboardState";
import { getPositionArray } from "@/features/music/getPositionArray";

export const Position = ({ position }: { position: PositionType }) => {
	const { getValue, setValue, getUrl } = useDashboardState();
	const selectedPosition = getValue(DashboardStateKey.POSITION);

	const selected =
		JSON.stringify(position) === JSON.stringify(selectedPosition);
	const positionArray = getPositionArray(position);

	const url = getUrl({ [DashboardStateKey.POSITION]: position });

	return (
		<Link
			data-title="Position"
			data-selected={selected}
			className="rounded-full border border-transparent px-[0.5rem] pb-[0.2rem] [&[data-selected='true']]:border-current"
			href={url}
			onClick={(e) => {
				e.preventDefault();
				setValue(DashboardStateKey.POSITION, position);
				return false;
			}}
		>
			<div className="flex gap-[0.5rem]">
				{positionArray.map((positionArrayElement, index) => (
					<div key={index} className="w-[1rem] text-center">
						{positionArrayElement}
					</div>
				))}
			</div>
		</Link>
	);
};
