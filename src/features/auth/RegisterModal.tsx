"use client";

import { useCallback } from "react";

import { RegisterForm } from "./RegisterForm";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Modal } from "@/features/design-system/Modal";
import { appModal } from "@/features/modal/consts";

export const RegisterModal = () => {
	const { openAppModal, setOpenAppModal } = useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setOpenAppModal(open ? appModal.REGISTER : null);
		},
		[setOpenAppModal],
	);

	return (
		<Modal
			heading="Create a user name to get started"
			open={openAppModal === appModal.REGISTER}
			setOpen={setOpen}
		>
			<RegisterForm key={openAppModal} setOpen={setOpen} />
		</Modal>
	);
};
