"use client";

import { useCallback } from "react";

import { AppModal } from "../app-store/enums";
import { useAppStore } from "../app-store/useAppStore";
import { Modal, ModalContent, ModalFooter } from "../design-system/Modal";
import { useAuthStore } from "./useAuthStore";
import { Button } from "@/components/ui/button";

export const AccountDeleteConfirmModal = () => {
	const { appModal, setAppModal } = useAppStore();
	const { accountDeleteConfirmClick, deletingAccount } = useAuthStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setAppModal(open ? AppModal.ACCOUNT_DELETE_CONFIRM : null);
		},
		[setAppModal],
	);

	return (
		<Modal
			heading="Confirm Delete Account"
			open={appModal === AppModal.ACCOUNT_DELETE_CONFIRM}
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
