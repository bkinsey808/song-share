"use client";

import { JSX, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import {
	Modal,
	ModalContent,
	ModalFooter,
} from "@/features/design-system/Modal";
import { appModal } from "@/features/modal/consts";

export const ConfirmModal = (): JSX.Element => {
	const {
		openAppModal,
		setOpenAppModal,
		confirmModalHeading,
		ConfirmModalContent,
		confirmModalButtonLabel,
		confirmModalSuccessWaiting,
		confirmModalConfirmClick,
	} = useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setOpenAppModal(open ? appModal.CONFIRM : null);
		},
		[setOpenAppModal],
	);

	return (
		<Modal
			heading={confirmModalHeading ?? "Confirm"}
			open={openAppModal === appModal.CONFIRM}
			setOpen={setOpen}
		>
			<ModalContent>
				{ConfirmModalContent ? (
					<>
						{typeof ConfirmModalContent === "string" ? (
							ConfirmModalContent
						) : (
							<ConfirmModalContent />
						)}
					</>
				) : null}
			</ModalContent>

			<ModalFooter>
				<Button
					variant="destructive"
					disabled={confirmModalSuccessWaiting}
					onClick={confirmModalConfirmClick}
				>
					{confirmModalButtonLabel ?? "Confirm"}
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
