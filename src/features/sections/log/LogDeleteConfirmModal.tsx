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

export const LogDeleteConfirmModal = () => {
	const {
		openAppModal,
		setOpenAppModal,
		logDeletingIs,
		logDeleteConfirmClick,
	} = useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setOpenAppModal(open ? appModal.LOG_DELETE_CONFIRM : null);
		},
		[setOpenAppModal],
	);

	return (
		<Modal
			heading="Confirm Delete Log"
			open={openAppModal === appModal.LOG_DELETE_CONFIRM}
			setOpen={setOpen}
		>
			<ModalContent>
				<p>Are you sure you want to delete this log? This cannot be undone.</p>
			</ModalContent>

			<ModalFooter>
				<Button
					variant="destructive"
					disabled={logDeletingIs}
					onClick={logDeleteConfirmClick}
				>
					Delete Log
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
