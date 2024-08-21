import { MouseEventHandler } from "react";

import { toast } from "@/components/ui/use-toast";

export const userLoadClick =
	(_uid: string) =>
	(e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		toast({
			title: "User loaded",
		});
	};
