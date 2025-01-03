import { Position } from "./types";

export const getPositionArray = (position: Position): Position => {
	if (!Array.isArray(position)) {
		return [];
	}
	const positionArray: Position = position.map((positionElement) => {
		if (positionElement === "x") {
			return "x";
		}

		try {
			return parseInt(String(positionElement));
		} catch {
			console.error(positionElement);
		}
		return "x";
	});

	return positionArray;
};
