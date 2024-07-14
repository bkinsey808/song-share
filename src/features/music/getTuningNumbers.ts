import { getNoteNumber } from "./getNoteNumber";
import { Tuning } from "./types";

export const getTuningNumbers = (tuning: Tuning) =>
	tuning.map((course) => getNoteNumber(course));
