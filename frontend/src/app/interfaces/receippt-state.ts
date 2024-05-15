import { Slide } from "./slide";
import { Template } from "./template";

export interface ReceipptState {
    slides: Array<Slide>,
    tags: Array<string>,
    templates: Array<Template>,
    currentTemplateIndex: number,
    currentMasspartIndex: number,
    templateSelectionExpanded: boolean,
    masspartSelectionExpanded: boolean,
    slidesViewMode: 'catalogued'|'chosen'
}
