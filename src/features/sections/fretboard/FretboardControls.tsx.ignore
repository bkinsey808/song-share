import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { Input } from "@/features/design-system/form/Input";

export const FretboardControls = () => {
	const { getValues, setValue } = useDashboardState();
	const [maxFrets, selectCellToSet] = getValues([
		DashboardStateKey.MAX_FRETS,
		DashboardStateKey.SELECT_CELL_TO_SET,
	]);

	return (
		<div className="flex justify-end gap-[2rem] pb-[1rem]">
			<label>
				<div>Max Frets</div>
				<Input
					className="w-[5rem]"
					type="number"
					value={maxFrets}
					onChange={(e) => {
						const newMaxFrets = parseInt(e.target.value);

						if (Number.isNaN(newMaxFrets)) {
							return;
						}

						setValue(DashboardStateKey.MAX_FRETS, newMaxFrets);
					}}
				/>
			</label>
			<label>
				<div>Select cell to set</div>
				<select
					className="rounded-[0.2rem] border border-current bg-[var(--background)] p-[0.3rem] px-[0.6rem] text-current"
					value={selectCellToSet}
					onChange={(e) => {
						setValue(
							DashboardStateKey.SELECT_CELL_TO_SET,
							e.target.value as typeof selectCellToSet,
						);
					}}
				>
					<option className="bg-[hsl(var(--background))]" value="scale">
						Scale
					</option>
					<option className="bg-[hsl(var(--background))]" value="position">
						Chord Position
					</option>
					<option className="bg-[hsl(var(--background))]" value="tone">
						Tone
					</option>
				</select>
			</label>
		</div>
	);
};
