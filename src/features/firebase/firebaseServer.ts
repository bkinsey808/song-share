/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { credential, firestore } from "firebase-admin";
import { ServiceAccount, initializeApp } from "firebase-admin/app";

import * as serviceAccount from "./serviceAccountKey.json";

try {
	initializeApp({
		credential: credential.cert(serviceAccount as ServiceAccount),
	});
} catch (error) {
	console.warn("Firebase admin initialization error");
}

export const db = firestore();
