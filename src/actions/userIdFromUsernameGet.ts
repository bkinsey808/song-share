"use server";

import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { UserNamesSchema } from "@/features/firebase/schemas";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export const userIdFromUsernameGet = async (
	username: string,
): Promise<
	| { actionResultType: "SUCCESS"; userId: string }
	| {
			actionResultType: "ERROR";
			message: string;
	  }
> => {
	try {
		// get the username from the userNames collection
		const usernamesDoc = await db
			.collection(collectionNameGet(collection.USER_NAMES))
			.doc(username)
			.get();
		if (!usernamesDoc.exists) {
			return actionErrorMessageGet("Username not found");
		}
		const userNamesData = usernamesDoc.data();
		if (!userNamesData) {
			return actionErrorMessageGet("Username data invalid");
		}

		const userNamesResult = serverParse(UserNamesSchema, userNamesData);
		if (!userNamesResult.success) {
			return actionErrorMessageGet("Username data invalid");
		}

		const userId = userNamesResult.output.uid;
		if (!userId) {
			return actionErrorMessageGet("User ID not found");
		}

		return {
			actionResultType: ActionResultType.SUCCESS,
			userId,
		};
	} catch (error) {
		return actionErrorMessageGet(String(error));
	}
};
