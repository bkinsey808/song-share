import { getRomanNumerals } from "./getRomanNumerals";
import { Scale } from "./types";

export const getCasedRomanNumeral = ({
	romanNumeral,
	scale,
}: {
	romanNumeral?: string | undefined;
	scale: Scale;
}): string | undefined => {
	const romanNumerals = getRomanNumerals(scale);
	const foundRomanNumeral = romanNumerals.find(
		(rn) => rn.toLowerCase() === romanNumeral?.toLowerCase(),
	);

	if (foundRomanNumeral) {
		return foundRomanNumeral;
	}

	return romanNumeral?.toUpperCase().replace("B", "b");
};
