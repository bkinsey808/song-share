import { create } from "zustand";

interface User {
	username: string;
}

interface AuthStore {
	user: null | User;
	signIn: (user: User) => void;
	signOut: () => void;
	isSignedIn: () => boolean;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
	user: null,
	signIn: (user) => set({ user }),
	signOut: () => set({ user: null }),
	isSignedIn: () => get().user !== null,
}));
