export const filterByMaxMuted =
	(maxMuted: number) =>
	(sequence: (string | number)[]): boolean => {
		const mutedCount = sequence.filter((value) => value === "x").length;
		return mutedCount <= maxMuted;
	};
