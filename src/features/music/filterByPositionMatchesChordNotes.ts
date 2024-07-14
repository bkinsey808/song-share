export const filterByPositionMatchesChordNotes =
	(chordNotes: string[]) => (position: (string | number)[]) => {
		return chordNotes.every((note) => position.includes(note));
	};
