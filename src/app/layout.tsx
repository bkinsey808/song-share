import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/features/auth/AuthProvider";
import "@/features/firebase/firebaseClient";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
});

export const metadata: Metadata = {
	title: process.env.NEXT_PUBLIC_BRAND ?? "Song Share",
	description:
		process.env.NEXT_PUBLIC_BRAND_DESC ?? "Share songs with your community.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={"lg:overflow-hidden"}>
			<link rel="icon" href="/favicon.ico" sizes="any" />
			<body className={`dark ${geistSans.variable} ${geistMono.variable}`}>
				<AuthProvider>{children}</AuthProvider>
				<Toaster />
			</body>
		</html>
	);
}
