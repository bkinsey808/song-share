import { minLength, nonEmpty, object, pipe, string } from "valibot";

export const GetStartedFormSchema = object({
	songLeaderUserName: pipe(
		string(),
		nonEmpty("Song Leader Username is required"),
		minLength(3, "Song Leader Username must be at least 3 characters"),
	),
});
