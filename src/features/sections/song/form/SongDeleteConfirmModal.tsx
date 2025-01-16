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

export const SongDeleteConfirmModal = (): JSX.Element => {
	const {
		openAppModal,
		setOpenAppModal,
		songDeleting,
		songDeleteConfirmClick,
	} = useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setOpenAppModal(open ? appModal.SONG_DELETE_CONFIRM : null);
		},
		[setOpenAppModal],
	);

	return (
		<Modal
			heading="Confirm Delete Song"
			open={openAppModal === appModal.SONG_DELETE_CONFIRM}
			setOpen={setOpen}
		>
			<ModalContent>
				<p>Are you sure you want to delete this song? This cannot be undone.</p>
			</ModalContent>

			<ModalFooter>
				<Button
					variant="destructive"
					disabled={songDeleting}
					onClick={songDeleteConfirmClick}
				>
					Delete Song
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
