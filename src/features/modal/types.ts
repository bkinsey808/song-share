import { appModal } from "./consts";

export type AppModal = (typeof appModal)[keyof typeof appModal];
