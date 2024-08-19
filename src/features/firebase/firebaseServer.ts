// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
	appId: process.env.SERVER_FIREBASE_APP_ID ?? "",
	measurementId: process.env.SERVER_FIREBASE_MEASUREMENT_ID ?? "",
};

// Initialize Firebase
const firebaseApp =
	typeof window !== "undefined" ? undefined : initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const dbServer = (firebaseApp ? getFirestore(firebaseApp) : undefined)!;
