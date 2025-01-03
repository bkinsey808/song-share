export const filterByPositionMatchesChordNotes =
	(chordNotes: string[]) =>
	(position: (string | number)[]): boolean => {
		return chordNotes.every((note) => position.includes(note));
	};
