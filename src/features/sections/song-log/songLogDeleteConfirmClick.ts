import { logDelete } from "@/actions/logDelete";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";
import { logDefaultGet } from "@/features/sections/log/logDefaultGet";

export const songLogDeleteConfirmClick = (get: Get, set: Set) => async () => {
	const { songLogForm, logId, setOpenAppModal } = get();

	if (!songLogForm) {
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
		logDeleting: true,
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
	songLogForm.reset({
		...logDefaultGet(),
	});
	set({
		songLogDeleting: false,
	});

	setOpenAppModal(null);
};
