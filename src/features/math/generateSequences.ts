/**
 * A math sequence is a list of elements that follow a specific pattern, with the order of the numbers being important and repetitions allowed
 * @param values: The set of possible values to choose from
 * @param n The number of elements in each sequence
 * @returns An array of all possible multisets of length n
 */
export const generateSequences = <T extends number | string>(
	values: T[],
	n: number,
) => {
	if (n <= 1) {
		return values.map((value) => [value]);
	} else {
		const sequences: T[][] = [];
		const shorterSequences = generateSequences(values, n - 1);
		for (const value of values) {
			for (const sequence of shorterSequences) {
				sequences.push([value, ...sequence]);
			}
		}
		return sequences;
	}
};
