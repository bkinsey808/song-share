export const keys = {
	C: 0,
	"C#": 1,
	Db: -1,
	D: 2,
	"D#": 3,
	Eb: -3,
	E: 4,
	F: 5,
	"F#": 6,
	Gb: -6,
	G: 7,
	"G#": 8,
	Ab: -8,
	A: 9,
	"A#": 10,
	Bb: -10,
	B: 11,
} as const;

export const keyMap = new Map<(typeof keys)[keyof typeof keys], string>();
keyMap.set(0, "C");
keyMap.set(1, "C#");
keyMap.set(-1, "Db");
keyMap.set(2, "D");
keyMap.set(3, "D#");
keyMap.set(-3, "Eb");
keyMap.set(4, "E");
keyMap.set(5, "F");
keyMap.set(6, "F#");
keyMap.set(-6, "Gb");
keyMap.set(7, "G");
keyMap.set(8, "G#");
keyMap.set(-8, "Ab");
keyMap.set(9, "A");
keyMap.set(10, "A#");
keyMap.set(-10, "Bb");
keyMap.set(11, "B");

export const scaleDegrees = {
	"1": 0,
	"#1": 1,
	b2: -1,
	"2": 2,
	"#2": 3,
	b3: -3,
	"3": 4,
	"4": 5,
	"#4": 6,
	b5: -6,
	"5": 7,
	"#5": 8,
	b6: -8,
	"6": 9,
	"#6": 10,
	b7: 10,
	"7": 11,
} as const;
