import { getPositionNumbers } from "./getPositionNumbers";

describe("getPositionNumbers", () => {
	it("returns position numbers for position", () => {
		expect(getPositionNumbers([0, 0, 0, 0], ["G4", "C4", "E4", "A4"])).toEqual([
			48, 52, 55, 57,
		]);
	});
});
