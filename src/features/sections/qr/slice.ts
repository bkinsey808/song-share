import { StateCreator } from "zustand";

import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

``;

// eslint-disable-next-line @typescript-eslint/ban-types
type QRSliceState = {};

type AppQRSlice = StateCreator<AppSlice, [], [], QRSlice>;

const QRSliceInitialState: QRSliceState = {};

export type QRSlice = QRSliceState & {
	getQRUrl: () => string | undefined;
};

export const createQRSlice: AppQRSlice = (set, get) => {
	sliceResetFns.add(() => set(QRSliceInitialState));
	return {
		getQRUrl: () => {
			const { fuid, sessionCookieData } = get();
			const f = fuid ?? sessionCookieData?.uid;
			if (!f) {
				return undefined;
			}

			return `https://${process.env.NEXT_PUBLIC_DOMAIN}/f/${fuid ?? sessionCookieData?.uid}`;
		},
	};
};
