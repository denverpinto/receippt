import { Verse } from "./verse";

export interface Slide {
    name: string,
    tags: Array<string>,
    path: string,
    desiredVerses: Array<String>,
    verses: Array<Verse>
}
