import { StateCreator } from "zustand";

import { appModal } from "./consts";
import { AppModal } from "./types";
import { AppSlice } from "@/features/app-store/useAppStore";

type ModalSliceState = {
	openAppModal: AppModal | null;
	confirmModalHeading: string | undefined;
	confirmModalButtonLabel: string | undefined;
	ConfirmModalContent: (() => JSX.Element) | string | undefined;
	confirmModalSuccessWaiting: boolean;
	confirmModalFn:
		| (() => Promise<
				| {
						actionResultType: "ERROR";
						message: string;
				  }
				| {
						actionResultType: "SUCCESS";
				  }
		  >)
		| undefined;
	confirmModalError: string | undefined;
};

export const modalSliceInitialState: ModalSliceState = {
	openAppModal: null,
	confirmModalHeading: undefined,
	confirmModalButtonLabel: undefined,
	ConfirmModalContent: undefined,
	confirmModalSuccessWaiting: false,
	confirmModalFn: undefined,
	confirmModalError: undefined,
};

export type ModalSlice = ModalSliceState & {
	setOpenAppModal: (modal: AppModal | null) => void;
	confirmModalOpen: ({
		heading,
		buttonLabel,
		content,
		confirmFn,
	}: {
		heading: string;
		buttonLabel: string;
		content: (() => JSX.Element) | string;
		confirmFn: () => Promise<
			| { actionResultType: "ERROR"; message: string }
			| { actionResultType: "SUCCESS" }
		>;
	}) => void;
	confirmModalConfirmClick: () => void;
};

type AppModalSlice = StateCreator<AppSlice, [], [], ModalSlice>;

export const createModalSlice: AppModalSlice = (set, get) => ({
	...modalSliceInitialState,
	setOpenAppModal: (modal) => set({ openAppModal: modal }),
	confirmModalOpen: ({ heading, buttonLabel, content, confirmFn }) => {
		set({
			openAppModal: appModal.CONFIRM,
			confirmModalHeading: heading,
			confirmModalButtonLabel: buttonLabel,
			ConfirmModalContent: content,
			confirmModalFn: confirmFn,
			confirmModalSuccessWaiting: false,
			confirmModalError: undefined,
		});
	},
	confirmModalConfirmClick: () => {
		set({ confirmModalSuccessWaiting: true, confirmModalError: undefined });
		const { confirmModalFn } = get();
		void (async () => {
			const result = await confirmModalFn?.();
			if (result?.actionResultType === "ERROR") {
				set({ confirmModalError: result.message });
				return;
			} else {
				set({ openAppModal: null });
			}
			set({ confirmModalSuccessWaiting: false });
		})();
	},
});
