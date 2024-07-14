import { accidentalToNumber } from "./accidentalToNumber";

const numericDegreePartToNumber = {
	1: 0,
	2: 2,
	3: 4,
	4: 5,
	5: 7,
	6: 9,
	7: 11,
} as const;

export const degreeToNumber = (degree: string) => {
	// degree takes the form of bb3, etc
	// parse using regex
	const degreeRegex = /([b#]{0,2})(\d)/;
	const degreeParts = degree.match(degreeRegex);

	if (!degreeParts) {
		return undefined;
	}

	const numericDegreePart = parseInt(degreeParts[2]);
	const accidental = degreeParts[1] as keyof typeof accidentalToNumber;
	const numericPartNumber =
		numericDegreePartToNumber[
			(numericDegreePart % 8) as keyof typeof numericDegreePartToNumber
		];
	const accidentalNumber = accidentalToNumber[accidental];
	return (numericPartNumber + accidentalNumber + 12) % 12;
};
