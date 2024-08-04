"use client";

import { useCallback } from "react";

import { AppModal } from "../app-store/enums";
import { useAppStore } from "../app-store/useAppStore";
import { useAuthStore } from "./useAuthStore";
import { Button } from "@/components/ui/button";
import {
	Modal,
	ModalContent,
	ModalFooter,
} from "@/features/design-system/Modal";

export const AccountManageModal = () => {
	const { appModal, setAppModal } = useAppStore();
	const { signOutClick, deleteAccountClick } = useAuthStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setAppModal(open ? AppModal.ACCOUNT_MANAGE : null);
		},
		[setAppModal],
	);

	return (
		<Modal
			heading="Manage your account"
			open={appModal === AppModal.ACCOUNT_MANAGE}
			setOpen={setOpen}
		>
			<ModalContent>
				<Button onClick={signOutClick}>Sign Out</Button>

				<Button variant="destructive" onClick={deleteAccountClick}>
					Delete Account
				</Button>
			</ModalContent>

			<ModalFooter>
				<Button
					className="w-full"
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
