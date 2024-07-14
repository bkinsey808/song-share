import { getPositionArray } from "./getPositionArray";
import { Position } from "./types";

export const isCellInPosition = ({
	position,
	fret,
	course,
}: {
	position: Position;
	fret: number;
	course: number;
}) => {
	const positionArray = getPositionArray(position);
	return positionArray[course] === fret;
};
