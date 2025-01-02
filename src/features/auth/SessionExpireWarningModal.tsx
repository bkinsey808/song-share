import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import {
	Modal,
	ModalContent,
	ModalFooter,
} from "@/features/design-system/Modal";
import { appModal } from "@/features/modal/consts";

export const SessionExpireWarningModal = (): JSX.Element => {
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
