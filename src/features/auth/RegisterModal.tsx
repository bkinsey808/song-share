"use client";

import { useCallback } from "react";

import { AppModal } from "../app-store/enums";
import { useAppStore } from "../app-store/useAppStore";
import { Modal } from "../design-system/Modal";
import { RegisterForm } from "./RegisterForm";

export const RegisterModal = () => {
	const { appModal, setAppModal } = useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setAppModal(open ? AppModal.REGISTER : null);
		},
		[setAppModal],
	);

	return (
		<Modal
			heading="Create a user name to get started"
			open={appModal === AppModal.REGISTER}
			setOpen={setOpen}
		>
			<RegisterForm key={appModal} setOpen={setOpen} />
		</Modal>
	);
};
