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

export const SongSetDeleteConfirmModal = () => {
	const {
		openAppModal,
		setOpenAppModal,
		deletingSongSet,
		songSetDeleteConfirmClick,
	} = useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setOpenAppModal(open ? appModal.SONG_SET_DELETE_CONFIRM : null);
		},
		[setOpenAppModal],
	);

	return (
		<Modal
			heading="Confirm Delete Song Set"
			open={openAppModal === appModal.SONG_SET_DELETE_CONFIRM}
			setOpen={setOpen}
		>
			<ModalContent>
				<p>
					Are you sure you want to delete this song set? This cannot be undone.
				</p>
			</ModalContent>

			<ModalFooter>
				<Button
					variant="destructive"
					disabled={deletingSongSet}
					onClick={songSetDeleteConfirmClick}
				>
					Delete Song Set
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
