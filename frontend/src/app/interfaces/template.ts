import { Masspart } from "./masspart"

export interface Template {
    id: string,
    tag: string,
    saveAsFileName: string,
    textColor: string,
    highlightedTextColor: string,
    backgroundColor: string,
    massparts: Array<Masspart>
}
