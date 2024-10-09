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

export const SongLogDeleteConfirmModal = () => {
	const {
		openAppModal,
		setOpenAppModal,
		songLogDeleting,
		songLogDeleteConfirmClick,
	} = useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setOpenAppModal(open ? appModal.SONG_LOG_DELETE_CONFIRM : null);
		},
		[setOpenAppModal],
	);

	return (
		<Modal
			heading="Confirm Song Delete Log"
			open={openAppModal === appModal.SONG_LOG_DELETE_CONFIRM}
			setOpen={setOpen}
		>
			<ModalContent>
				<p>This cannot be undone.</p>
			</ModalContent>

			<ModalFooter>
				<Button
					variant="destructive"
					disabled={songLogDeleting}
					onClick={songLogDeleteConfirmClick}
				>
					Delete Song Log
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
