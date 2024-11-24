"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

import { useAppStore } from "@/features/app-store/useAppStore";

export const QRSection = () => {
	const { getQRUrl, sessionCookieData } = useAppStore();
	const { uid } = sessionCookieData ?? {};

	const [qrUrl, setQrUrl] = useState<string>();
	useEffect(() => {
		setQrUrl(getQRUrl());
	}, [getQRUrl, uid]);

	return (
		<>
			<Link href={qrUrl ?? "#"}>{qrUrl}</Link>

			<div
				className="max-h-[50vh] max-w-[50vh] bg-white p-[2rem]"
				suppressHydrationWarning={true}
			>
				{qrUrl ? (
					<QRCode
						size={256}
						style={{ height: "auto", maxWidth: "100%", width: "100%" }}
						value={qrUrl}
					/>
				) : null}
			</div>
		</>
	);
};
