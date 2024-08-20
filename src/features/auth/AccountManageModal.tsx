"use client";

import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import {
	Modal,
	ModalContent,
	ModalFooter,
} from "@/features/design-system/Modal";
import { appModal } from "@/features/modal/consts";

export const AccountManageModal = () => {
	const {
		openAppModal,
		setOpenAppModal,
		signOutClick,
		signOutAndClearLocalClick,
		deleteAccountClick,
	} = useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setOpenAppModal(open ? appModal.ACCOUNT_MANAGE : null);
		},
		[setOpenAppModal],
	);

	return (
		<Modal
			heading="Manage your account"
			open={openAppModal === appModal.ACCOUNT_MANAGE}
			setOpen={setOpen}
		>
			<ModalContent>
				<Button onClick={signOutClick}>Sign Out</Button>
				<Button onClick={signOutAndClearLocalClick}>
					Sign Out and Clear Local
				</Button>

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
