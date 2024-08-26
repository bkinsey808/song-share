"use client";

import QRCode from "react-qr-code";

import { useDashboardState } from "@/app/d/useDashboardState";

export const QRCodeSection = () => {
	const { getAppUrl } = useDashboardState();

	return (
		<div className="max-h-[50vh] max-w-[50vh] bg-white p-[2rem]">
			<QRCode
				size={256}
				style={{ height: "auto", maxWidth: "100%", width: "100%" }}
				value={`https://bk-music.vercel.app/${getAppUrl()})`}
			/>
		</div>
	);
};
