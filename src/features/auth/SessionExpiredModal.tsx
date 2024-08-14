import { useCallback } from "react";

import { useAppStore } from "../app-store/useAppStore";
import { Modal, ModalContent, ModalFooter } from "../design-system/Modal";
import { Button } from "@/components/ui/button";
import { appModal } from "@/features/modal/consts";

export const SessionExpiredModal = () => {
	const { openAppModal, setOpenAppModal, signInClick, isSigningIn } =
		useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setOpenAppModal(open ? appModal.SESSION_EXPIRED : null);
		},
		[setOpenAppModal],
	);

	return (
		<Modal
			heading="Session Expired"
			open={openAppModal === appModal.SESSION_EXPIRED}
			setOpen={setOpen}
		>
			<ModalContent>
				<p>Your session has expired</p>
			</ModalContent>
			<ModalFooter>
				<Button disabled={isSigningIn} onClick={signInClick}>
					Sign In
				</Button>
				<Button
					onClick={() => {
						setOpen(false);
					}}
				>
					Cancel
				</Button>
			</ModalFooter>
		</Modal>
	);
};
