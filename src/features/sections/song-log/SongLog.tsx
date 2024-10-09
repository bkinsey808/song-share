import { sectionId } from "../consts";
import { SongLogForm } from "./SongLogForm";
import { SongLogGrid } from "./SongLogGrid";
import { SongLogTitle } from "./SongLogTitle";
import { SectionAccordion } from "@/features/section/SectionAccordion";

export const SongLog = () => {
	return (
		<SectionAccordion
			sectionId={sectionId.SONG_LOG}
			title={<SongLogTitle />}
			buttonLabel="Song Log"
			buttonVariant="secondary"
		>
			<SongLogForm />
			<SongLogGrid />
		</SectionAccordion>
	);
};
