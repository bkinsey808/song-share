"use client";

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
			{qrUrl}

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
