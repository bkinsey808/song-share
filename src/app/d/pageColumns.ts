import { ChordScaleDegreeSection } from "@/features/sections/chord-scale-degree/ChordScaleDegreeSection";
import { ChordScaleDegreeTitle } from "@/features/sections/chord-scale-degree/ChordScaleDegreeTitle";
import { ChordSection } from "@/features/sections/chord/ChordSection";
import { ChordTitle } from "@/features/sections/chord/ChordTitle";
import { CreditsSection } from "@/features/sections/credits/CreditsSection";
import { FretboardSection } from "@/features/sections/fretboard/FretboardSection";
import { InstrumentSection } from "@/features/sections/instrument/InstrumentSection";
import { InstrumentTitle } from "@/features/sections/instrument/InstrumentTitle";
import { KeySection } from "@/features/sections/key/KeySection";
import { KeyTitle } from "@/features/sections/key/KeyTitle";
import { LyricsSection } from "@/features/sections/lyrics/LyricsSection";
import { PositionsSection } from "@/features/sections/positions/PositionsSection";
import { QRCodeSection } from "@/features/sections/qrcode/QRCodeSection";
import { ScaleDegreesSection } from "@/features/sections/scale-degrees/ScaleDegreesSection";
import { ScaleDegreesTitle } from "@/features/sections/scale-degrees/ScaleDegreesTitle";
import { ScaleSection } from "@/features/sections/scale/ScaleSection";
import { ScaleTitle } from "@/features/sections/scale/ScaleTitle";
import { Section } from "@/features/sections/sections";
import { SongLibrarySection } from "@/features/sections/song-library/SongLibrarySection";
import { SongLibraryTitle } from "@/features/sections/song-library/SongLibraryTitle";
import { SongSection } from "@/features/sections/song/SongSection";
import { SongTitle } from "@/features/sections/song/SongTitle";
import { StateSection } from "@/features/sections/state/StateSection";
import { TranslationSection } from "@/features/sections/translation/TranslationSection";
import { TuningSection } from "@/features/sections/tuning/TuningSection";
import { TuningTitle } from "@/features/sections/tuning/TuningTitle";

type DashboardComponent = () => JSX.Element;
type Sections = Record<
	Section,
	{ title: DashboardComponent | string; section: DashboardComponent }
>;

export const SECTIONS: Sections = {
	[Section.SONG]: {
		title: SongTitle,
		section: SongSection,
	},
	[Section.SONG_LIBRARY]: {
		title: SongLibraryTitle,
		section: SongLibrarySection,
	},
	[Section.LYRICS]: {
		title: "Lyrics",
		section: LyricsSection,
	},
	[Section.CREDITS]: {
		title: "Credits",
		section: CreditsSection,
	},
	[Section.TRANSLATION]: {
		title: "Translation",
		section: TranslationSection,
	},

	[Section.KEY]: {
		title: KeyTitle,
		section: KeySection,
	},

	[Section.SCALE]: {
		title: ScaleTitle,
		section: ScaleSection,
	},
	[Section.SCALE_DEGREES]: {
		title: ScaleDegreesTitle,
		section: ScaleDegreesSection,
	},
	[Section.CHORD]: {
		title: ChordTitle,
		section: ChordSection,
	},
	[Section.CHORD_SCALE_DEGREE]: {
		title: ChordScaleDegreeTitle,
		section: ChordScaleDegreeSection,
	},
	[Section.POSITIONS]: {
		title: "Positions",
		section: PositionsSection,
	},
	[Section.INSTRUMENT]: {
		title: InstrumentTitle,
		section: InstrumentSection,
	},
	[Section.TUNING]: {
		title: TuningTitle,
		section: TuningSection,
	},
	[Section.FRETBOARD]: {
		title: "Fretboard",
		section: FretboardSection,
	},
	[Section.STATE]: {
		title: "State",
		section: StateSection,
	},
	[Section.QRCODE]: {
		title: "QR Code",
		section: QRCodeSection,
	},
};

const leftSections: Section[] = [Section.SONG_LIBRARY, Section.SONG];
const centerSections: Section[] = [Section.INSTRUMENT, Section.FRETBOARD];
const rightSections: Section[] = [
	Section.SCALE_DEGREES,
	Section.CHORD,
	Section.CHORD_SCALE_DEGREE,
	Section.POSITIONS,
	Section.STATE,
	Section.QRCODE,
];

export const pageColumns = [leftSections, centerSections, rightSections];
