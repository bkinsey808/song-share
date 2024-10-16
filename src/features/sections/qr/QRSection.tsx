"use client";

import QRCode from "react-qr-code";

import { useAppStore } from "@/features/app-store/useAppStore";

export const QRSection = () => {
	const { getQRUrl } = useAppStore();

	return (
		<div className="max-h-[50vh] max-w-[50vh] bg-white p-[2rem]">
			<QRCode
				size={256}
				style={{ height: "auto", maxWidth: "100%", width: "100%" }}
				value={getQRUrl()}
			/>
		</div>
	);
};
