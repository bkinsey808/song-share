"use client";

import { useCallback } from "react";

import { useAppStore } from "../app-store/useAppStore";
import { Modal, ModalContent, ModalFooter } from "../design-system/Modal";
import { Button } from "@/components/ui/button";
import { appModal } from "@/features/modal/consts";

export const AccountDeleteConfirmModal = () => {
	const {
		openAppModal,
		setOpenAppModal,
		accountDeleteConfirmClick,
		deletingAccount,
	} = useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setOpenAppModal(open ? appModal.ACCOUNT_DELETE_CONFIRM : null);
		},
		[setOpenAppModal],
	);

	return (
		<Modal
			heading="Confirm Delete Account"
			open={openAppModal === appModal.ACCOUNT_DELETE_CONFIRM}
			setOpen={setOpen}
		>
			<ModalContent>
				<p>
					Are you sure you want to delete your account? This cannot be undone.
				</p>
			</ModalContent>

			<ModalFooter>
				<Button
					variant="destructive"
					disabled={deletingAccount}
					onClick={accountDeleteConfirmClick}
				>
					Delete Account
				</Button>

				<Button
					onClick={() => {
						setOpen(false);
					}}
				>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
};
