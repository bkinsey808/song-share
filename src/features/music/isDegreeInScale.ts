import { Scale } from "./types";

export const isDegreeInScale = ({
	degree,
	scale,
}: {
	degree: string;
	scale: Scale;
}): boolean => scale.includes(degree);
