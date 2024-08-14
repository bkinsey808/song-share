import { useCallback } from "react";

import { useAppStore } from "../app-store/useAppStore";
import { Modal, ModalContent, ModalFooter } from "../design-system/Modal";
import { Button } from "@/components/ui/button";
import { appModal } from "@/features/modal/consts";

export const SessionExpireWarningModal = () => {
	const {
		openAppModal,
		setOpenAppModal,
		sessionExtendClick,
		signOut,
		isSigningIn,
	} = useAppStore();

	const setOpen = useCallback(
		(open: boolean) => {
			setOpenAppModal(open ? appModal.SESSION_EXPIRE_WARNING : null);
		},
		[setOpenAppModal],
	);

	return (
		<Modal
			heading="Session Expire Warning"
			open={openAppModal === appModal.SESSION_EXPIRE_WARNING}
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
