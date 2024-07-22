import { useCallback } from "react";

import { AppModal } from "../app-store/enums";
import { useAppStore } from "../app-store/useAppStore";
import { Modal, ModalContent, ModalFooter } from "../design-system/Modal";
import { useAuthStore } from "./useAuthStore";
import { Button } from "@/components/ui/button";

export const SessionExpiredModal = () => {
	const { signInClick, isSigningIn } = useAuthStore();
	const { appModal, setAppModal } = useAppStore();

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
