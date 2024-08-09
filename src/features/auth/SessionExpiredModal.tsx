import { useCallback } from "react";

import { useAppStore } from "../app-store/useAppStore";
import { Modal, ModalContent, ModalFooter } from "../design-system/Modal";
import { Button } from "@/components/ui/button";
import { AppModal } from "@/features/modal/enums";

export const SessionExpiredModal = () => {
	const { appModal, setAppModal, signInClick, isSigningIn } = useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setAppModal(open ? AppModal.SESSION_EXPIRED : null);
		},
		[setAppModal],
	);

	return (
		<Modal
			heading="Session Expired"
			open={appModal === AppModal.SESSION_EXPIRED}
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
