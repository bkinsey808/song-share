import { Timestamp } from "firebase/firestore";
import { custom } from "valibot";

export const FirestoreTimestampSchema = custom<Timestamp>(
	(input) => input instanceof Timestamp,
	"Invalid Firestore Timestamp",
);
