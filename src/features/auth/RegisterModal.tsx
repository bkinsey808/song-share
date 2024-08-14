"use client";

import { useCallback } from "react";

import { Modal } from "../design-system/Modal";
import { RegisterForm } from "./RegisterForm";
import { useAppStore } from "@/features/app-store/useAppStore";
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
