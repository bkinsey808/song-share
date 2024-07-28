import { SectionId } from "@/features/app-store/enums";
import { SectionAccordion } from "@/features/design-system/SectionAccordion";
import { SongLibrarySection } from "@/features/sections/song-library/SongLibrarySection";
import { SongLibraryTitle } from "@/features/sections/song-library/SongLibraryTitle";
import { SongSection } from "@/features/sections/song/SongSection";
import { SongTitle } from "@/features/sections/song/SongTitle";

export const PageContent = () => {
	return (
		<main className="flex-grow overflow-auto lg:overflow-hidden">
			<SectionAccordion
				title={<SongLibraryTitle />}
				sectionId={SectionId.SONG_LIBRARY}
			>
				<SongLibrarySection />
			</SectionAccordion>

			<SectionAccordion title={<SongTitle />} sectionId={SectionId.SONG}>
				<SongSection />
			</SectionAccordion>
		</main>
	);
};

export default PageContent;
