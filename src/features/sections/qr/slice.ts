import { StateCreator } from "zustand";

import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

``;

// eslint-disable-next-line @typescript-eslint/ban-types
type QRSliceState = {};

type AppQRSlice = StateCreator<AppSlice, [], [], QRSlice>;

const QRSliceInitialState: QRSliceState = {};

export type QRSlice = QRSliceState & {
	getQRUrl: () => string;
};

export const createQRSlice: AppQRSlice = (set, get) => {
	sliceResetFns.add(() => set(QRSliceInitialState));
	return {
		getQRUrl: () => {
			const { fuid, sessionCookieData } = get();

			return `https://bk-music.vercel.app/f/${fuid ?? sessionCookieData?.uid}`;
		},
	};
};
