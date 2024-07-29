"use client";

import { useCallback } from "react";

import { loadSongClientSide } from "./songLoadClick";
import { DashboardModal } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Modal,
	ModalContent,
	ModalFooter,
} from "@/features/design-system/Modal";

export const LoadSongConfirmModal = () => {
	const {
		openDashboardModal,
		setOpenDashboardModal,
		loadingSong,
		loadSongError,
		setValues,
		getValues,
	} = useDashboardState();

	const setOpen = useCallback(
		(open: boolean) => {
			setOpenDashboardModal(
				open ? DashboardModal.CONFIRM_LOAD_SONG : undefined,
			);
		},
		[setOpenDashboardModal],
	);

	return (
		<Modal
			heading="Confirm Load Song"
			open={openDashboardModal === DashboardModal.CONFIRM_LOAD_SONG}
			setOpen={setOpen}
		>
			<ModalContent>
				{loadSongError ? (
					<Alert variant="destructive">{loadSongError}</Alert>
				) : null}
				<p>
					Are you sure you want to load song? You have unsaved changes to your
					current song.
				</p>
			</ModalContent>

			<ModalFooter>
				<Button
					variant="destructive"
					disabled={loadingSong}
					onClick={loadSongClientSide({
						setValues,
						getValues,
					})}
				>
					Load Song
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
