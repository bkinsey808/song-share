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

export const PlaylistDeleteConfirmModal = () => {
	const {
		openAppModal,
		setOpenAppModal,
		playlistDeletingIs,
		playlistDeleteConfirmClick,
	} = useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setOpenAppModal(open ? appModal.SONG_SET_DELETE_CONFIRM : null);
		},
		[setOpenAppModal],
	);

	return (
		<Modal
			heading="Confirm Delete Playlist"
			open={openAppModal === appModal.SONG_SET_DELETE_CONFIRM}
			setOpen={setOpen}
		>
			<ModalContent>
				<p>
					Are you sure you want to delete this playlist? This cannot be undone.
				</p>
			</ModalContent>

			<ModalFooter>
				<Button
					variant="destructive"
					disabled={playlistDeletingIs}
					onClick={playlistDeleteConfirmClick}
				>
					Delete Playlist
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
