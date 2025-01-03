/* eslint-disable no-param-reassign */
type Range = (start: number, stop?: number, step?: number) => number[];

/** like python range() */
export const range: Range = (start, stop, step) => {
	if (typeof stop == "undefined") {
		// one param defined
		stop = start;
		start = 0;
	}

	if (typeof step == "undefined") {
		step = 1;
	}

	if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
		return [];
	}

	const result = [];

	for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
		result.push(i);
	}

	return result;
};
