import { SectionId } from "@/features/app-store/enums";
import { SectionAccordion } from "@/features/design-system/SectionAccordion";
import { SongSection } from "@/features/sections/song/SongSection";
import { SongTitle } from "@/features/sections/song/SongTitle";

export default function Dashboard() {
	return (
		<main className="flex-grow overflow-auto lg:overflow-hidden">
			<SectionAccordion title={<SongTitle />} sectionId={SectionId.SONG}>
				<SongSection />
			</SectionAccordion>
		</main>
	);
}
