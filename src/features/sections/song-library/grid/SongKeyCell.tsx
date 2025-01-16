import { JSX } from "react";

import { CellProps } from "./types";
import { useAppStore } from "@/features/app-store/useAppStore";

export const SongKeyCell = ({ songId }: CellProps): JSX.Element => {
	const { songKeyGet } = useAppStore();
	return <div>{songKeyGet(songId)}</div>;
};
