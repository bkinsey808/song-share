import { getNoteNumber } from "./getNoteNumber";
import { Tuning } from "./types";

export const getTuningNumbers = (tuning: Tuning): (number | undefined)[] =>
	tuning.map((course) => getNoteNumber(course));
