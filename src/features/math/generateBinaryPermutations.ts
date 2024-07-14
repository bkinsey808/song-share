import { range } from "./range";

export const generateBinaryPermutations = (n: number) => {
	const binaryNumbers = range(0, 2 ** n);
	const sortedResult = binaryNumbers.sort((a, b) => {
		const countOnes = (num: number) => {
			let count = 0;
			while (num > 0) {
				count += num & 1;
				num >>= 1;
			}
			return count;
		};
		return countOnes(a) - countOnes(b);
	});
	return sortedResult.map((num) =>
		num.toString(2).padStart(n, "0").split("").reverse().join(""),
	);
};

/**
 *
 *  1 0 0 0
 *  1 0 0 x
 *  1 0 0 1
 *  1 0 x x
 *
 *
 *
 *  get each binary permutation of n bits, where n is number of courses
 *  for each course that's zero
 *
 */
