export const searchTextGet = (searchText: string) => {
	const lowerCaseSearchText = searchText.toLowerCase();
	const normalized = lowerCaseSearchText
		.replaceAll("ś", "sh")
		.replaceAll("ṣ", "sh")
		.replaceAll("ṛ́", "ri")
		.replaceAll("ṛ", "ri")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");

	return `${lowerCaseSearchText} ${normalized}`;
};
