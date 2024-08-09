import { useCallback } from "react";

import { useAppStore } from "../app-store/useAppStore";
import { Modal, ModalContent, ModalFooter } from "../design-system/Modal";
import { Button } from "@/components/ui/button";
import { AppModal } from "@/features/modal/enums";

export const SessionExpireWarningModal = () => {
	const { appModal, setAppModal, sessionExtendClick, signOut, isSigningIn } =
		useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setAppModal(open ? AppModal.SESSION_EXPIRE_WARNING : null);
		},
		[setAppModal],
	);

	return (
		<Modal
			heading="Session Expire Warning"
			open={appModal === AppModal.SESSION_EXPIRE_WARNING}
			setOpen={setOpen}
		>
			<ModalContent>
				<p>Your session will expire soon</p>
			</ModalContent>
			<ModalFooter>
				<Button disabled={isSigningIn} onClick={sessionExtendClick}>
					Extend Session
				</Button>
				<Button onClick={signOut}>Sign out</Button>
			</ModalFooter>
		</Modal>
	);
};
