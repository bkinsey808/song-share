import { ChordScaleDegree } from "./ChordScaleDegree";
import { range } from "@/features/math/range";

export const ChordScaleDegreeSection = () => {
	return (
		<section
			data-title="Chord Scale Degree Section"
			className="grid grid-cols-[repeat(6,1fr)]"
		>
			{range(0, 12).map((scaleIndex) => (
				<ChordScaleDegree key={scaleIndex} scaleIndex={scaleIndex} />
			))}
		</section>
	);
};
