export const chordNumbersMatchPositionNumbers = (
	chordNumbers: number[],
	positionNumbers: number[],
) => {
	const normalizedPositionNumbers = Array.from(
		new Set(positionNumbers.map((positionNumber) => positionNumber % 12)),
	);

	if (chordNumbers.length !== normalizedPositionNumbers.length) {
		return false;
	}

	return chordNumbers.every(
		(chordNumber) =>
			normalizedPositionNumbers.find(
				(positionNumber) => positionNumber === chordNumber % 12,
			) !== undefined,
	);
};
