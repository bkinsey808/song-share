import { FirebaseOptions, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const useFirestoreClient = (): {
	getDb: () => Firestore | null;
	initialized: boolean;
	clearDb: () => void;
} => {
	const [db, setDb] = useState<Firestore | null>(null);
	const [initialized, setInitialized] = useState(false); // Track initialization status

	const getDb = useCallback(() => {
		if (db) {
			return db;
		}

		try {
			const firestoreDb = getFirestore(firebaseApp);
			// TODO - find a way to test firestore connection here
			setDb(firestoreDb);
			setInitialized(true); // Set initialized to true when Firestore is successfully initialized
			return firestoreDb;
		} catch (error) {
			console.error(
				"Failed to initialize Firestore. Will retry on next attempt.",
				error,
			);
			setInitialized(false); // Set initialized to false when initialization fails
			return null;
		}
	}, [db]);

	useEffect(() => {
		if (!initialized) {
			getDb(); // Retry initialization if not already initialized
		}
	}, [initialized, getDb]);

	const clearDb = useCallback(() => {
		setDb(null);
		setInitialized(false);
	}, []);

	return { getDb, initialized, clearDb };
};
