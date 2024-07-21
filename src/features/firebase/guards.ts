import { Schema as S } from "@effect/schema";
import { Either } from "effect";

import { UserDocSchema } from "./schemas";

export const guardAsUserDoc = (userDocumentData: unknown) => {
	const userDocResult = S.decodeUnknownEither(UserDocSchema)(userDocumentData);

	if (Either.isLeft(userDocResult)) {
		return null;
	}

	return userDocResult.right;
};
