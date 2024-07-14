import * as S from "@effect/schema/Schema";
import * as Either from "effect/Either";

import * as sciListJson from "./sci-list.json";

export const Sci = S.Struct({
	id: S.Number,
	txtName: S.String,
	txtCode: S.String,
	txtSpelling: S.String,
	booPrefer: S.Number,
	numNote: S.Number,
	numOrdering: S.Number,
	numSymForms: S.Number,
	numHalfStepsInRow: S.Number,
	txtNumIntervalForm: S.String,
	txtAltNames: S.String,
});

export type SciType = S.Schema.Type<typeof Sci>;

export const SciList = S.Array(Sci);

// I don't understand why this manual processing seems to be needed
const sciListArray = Array.isArray(sciListJson)
	? sciListJson
	: Object.keys(sciListJson)
			.map((key) => sciListJson[key as unknown as number])
			.filter((sci) => !Array.isArray(sci) && typeof sci === "object");

const parseEitherResult = S.decodeUnknownEither(SciList)(sciListArray);

export const sciList = Either.isRight(parseEitherResult)
	? parseEitherResult.right
	: undefined;

export const sciListError = Either.isLeft(parseEitherResult);

export const getSciBySpelling = (spelling: readonly string[]) =>
	sciList?.find((sci) => sci.txtSpelling === spelling.join(","));
