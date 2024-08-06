import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";

type BearSlice = {
	bears: number;
	addBear: () => void;
	eatFish: () => void;
};

type FishSlice = {
	fishes: number;
	addFish: () => void;
};

type SharedSlice = {
	addBoth: () => void;
	getBoth: () => void;
};

type AppSlice = BearSlice & FishSlice;

type AppBearSlice = StateCreator<AppSlice, [], [], BearSlice>;

const createBearSlice: AppBearSlice = (set, get) => ({
	bears: 0,
	addBear: () => set((state) => ({ bears: state.bears + 1 })),
	eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
	getFishes: () => get().fishes,
});

const createFishSlice: StateCreator<AppSlice, [], [], FishSlice> = (set) => ({
	fishes: 0,
	addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
});

const createSharedSlice: StateCreator<AppSlice, [], [], SharedSlice> = (
	set,
	get,
) => ({
	addBoth: () => {
		// you can reuse previous methods
		get().addBear();
		get().addFish();
		// or do them from scratch
		// set((state) => ({ bears: state.bears + 1, fishes: state.fishes + 1 })
	},
	getBoth: () => get().bears + get().fishes,
});

const useBoundStore = create<AppSlice & SharedSlice>()(
	persist(
		(...a) => ({
			...createBearSlice(...a),
			...createFishSlice(...a),
			...createSharedSlice(...a),
		}),
		{
			name: "app-slice-store",
		},
	),
);
