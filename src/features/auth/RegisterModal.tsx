"use client";

import { useCallback } from "react";

import { Modal } from "../design-system/Modal";
import { RegisterForm } from "./RegisterForm";
import { useAppStore } from "@/features/app-store/useAppStore";
import { AppModal } from "@/features/modal/enums";

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
