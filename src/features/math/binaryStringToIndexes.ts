export const binaryStringToIndexes = (binaryString: string) => {
	const indexes = [];
	for (let i = 0; i < binaryString.length; i++) {
		if (binaryString[i] === "1") {
			indexes.push(i);
		}
	}
	return indexes;
};
