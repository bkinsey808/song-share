import { Collection } from "./types";

export const collectionNameGet = (collection: Collection) => {
	const env = process.env.NODE_ENV || "development";

	return `${env}_${collection}`;
};
