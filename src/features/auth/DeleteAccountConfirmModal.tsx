"use client";

import { useCallback } from "react";

import { AppModal } from "../app-store/enums";
import { useAppStore } from "../app-store/useAppStore";
import { Modal, ModalContent, ModalFooter } from "../design-system/Modal";
import { useAuthStore } from "./useAuthStore";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const DeleteAccountConfirmModal = () => {
	const { appModal, setAppModal } = useAppStore();
	const { deleteAccountError, confirmDeleteAccountClick, deletingAccount } =
		useAuthStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setAppModal(open ? AppModal.DELETE_ACCOUNT_CONFIRM : null);
		},
		[setAppModal],
	);

	return (
		<Modal
			heading="Confirm Delete Account"
			open={appModal === AppModal.DELETE_ACCOUNT_CONFIRM}
			setOpen={setOpen}
		>
			<ModalContent>
				{deleteAccountError ? (
					<Alert variant="destructive">{deleteAccountError}</Alert>
				) : null}
				<p>
					Are you sure you want to delete your account? This cannot be undone.
				</p>
			</ModalContent>

			<ModalFooter>
				<Button
					variant="destructive"
					disabled={deletingAccount}
					onClick={confirmDeleteAccountClick}
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
