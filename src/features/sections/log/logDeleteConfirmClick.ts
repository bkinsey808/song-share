import { logDefaultGet } from "./logDefaultGet";
import { logDelete } from "@/actions/logDelete";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";

export const logDeleteConfirmClick = (get: Get, set: Set) => async () => {
	const { logForm, logId, setOpenAppModal } = get();

	if (!logForm) {
		console.error("no form");
		return;
	}

	if (!logId) {
		toast({
			variant: "destructive",
			title: "No log selected",
		});
		setOpenAppModal(null);
		return;
	}

	set({
		logDeletingIs: true,
	});

	const result = await logDelete(logId);
	if (result.actionResultType === actionResultType.ERROR) {
		toast({
			variant: "destructive",
			title: "There was an error deleting the log",
		});
		setOpenAppModal(null);
		return;
	}
	logForm.reset({
		...logDefaultGet(),
	});
	set({
		logDeletingIs: false,
	});

	setOpenAppModal(null);
};
