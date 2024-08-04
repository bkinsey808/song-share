import { useCallback } from "react";

import { AppModal } from "../app-store/enums";
import { useAppStore } from "../app-store/useAppStore";
import { Modal, ModalContent, ModalFooter } from "../design-system/Modal";
import { useAuthStore } from "./useAuthStore";
import { Button } from "@/components/ui/button";

export const SessionExpireWarningModal = () => {
	const {
		sessionExtendClick: extendSessionClick,
		signOut,
		isSigningIn,
	} = useAuthStore();
	const { appModal, setAppModal } = useAppStore();

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
				<Button disabled={isSigningIn} onClick={extendSessionClick}>
					Extend Session
				</Button>
				<Button onClick={signOut}>Sign out</Button>
			</ModalFooter>
		</Modal>
	);
};
