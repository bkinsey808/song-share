import { sectionId } from "./consts";

export type SectionId = (typeof sectionId)[keyof typeof sectionId];
