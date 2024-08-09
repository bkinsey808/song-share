"use client";

import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import {
	Modal,
	ModalContent,
	ModalFooter,
} from "@/features/design-system/Modal";
import { AppModal } from "@/features/modal/enums";

export const SongDeleteConfirmModal = () => {
	const { appModal, setAppModal, deletingSong, songDeleteConfirmClick } =
		useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setAppModal(open ? AppModal.SONG_DELETE_CONFIRM : null);
		},
		[setAppModal],
	);

	return (
		<Modal
			heading="Confirm Delete Song"
			open={appModal === AppModal.SONG_DELETE_CONFIRM}
			setOpen={setOpen}
		>
			<ModalContent>
				<p>Are you sure you want to delete this song? This cannot be undone.</p>
			</ModalContent>

			<ModalFooter>
				<Button
					variant="destructive"
					disabled={deletingSong}
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
