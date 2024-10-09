import { Get } from "@/features/app-store/types";
import { appModal } from "@/features/modal/consts";

export const logDeleteClick = (get: Get) => () => {
	console.log("logDeleteClick");
	const { setOpenAppModal } = get();
	setOpenAppModal(appModal.LOG_DELETE_CONFIRM);
};
