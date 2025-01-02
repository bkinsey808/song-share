import { Collection } from "./types";

type CollectionNameGet = (collection: Collection) => string;

export const collectionNameGet: CollectionNameGet = (collection) => {
	const env = process.env.NODE_ENV || "development";

	return `${env}_${collection}`;
};
