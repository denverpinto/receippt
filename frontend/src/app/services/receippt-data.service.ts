import { Injectable } from '@angular/core';
import { ReceipptState } from '../interfaces/receippt-state';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Index } from '../interfaces';
import { Template } from '../interfaces/template';
import { Masspart } from '../interfaces/masspart';
import { Slide } from '../interfaces/slide';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceipptDataService {

  private indexUrl = `${environment.RECEIPPT_API_URL}${environment.RECEIPPT_API_INDEX_ENDPOINT}`;
  private downloadAttachmentUrl = `${environment.RECEIPPT_API_URL}${environment.RECEIPPT_API_DOWNLOAD_ENDPOINT}`;

  private CURRENT_VERSION = '2.0.0-VERSES';
  private VERSION_KEY = 'appVersion';

  state: ReceipptState = {
    slides: [],
    tags: [],
    templates: [],
    currentTemplateIndex: -1,
    currentMasspartIndex: -1,
    templateSelectionExpanded: false,
    masspartSelectionExpanded: false,
    slidesViewMode: 'catalogued'
  }

  stateSubject = new BehaviorSubject(this.state);

  /* initiate the new Loading variable via BehaviorSubject and set it to "true" from the beginning. */
  loadingSubject = new BehaviorSubject(true);

  /* initiate the new error variable via BehaviorSubject and set it to "false" from the beginning. */
  errorSubject = new BehaviorSubject(false);


  /* construct the state using index and template requests */
  constructor(private http: HttpClient) {

    /* subscribe to the BehaviourSubject for any changes */
    this.stateSubject.subscribe((value) => {
      this.state = value;
    });

    this.loadingSubject.next(true);

    /* retrieve index and modify state */
    this.getIndex().subscribe(
      (response) => {
        let newState = this.state;
        newState.slides = (response as Index)["slides"];

        if (newState.slides.length == 0) {
          this.errorSubject.next(true);
          return;
        }

        newState.slides.unshift({
          "name": "BLANK SLIDE",
          "path": "NOPATH",
          "tags": [],
          "desiredVerses": ["1"],
          "verses": [{
            "name": "1",
            "path": "NOPATH",
            "tags": [],
            "html": "<hr>",
            "text": "-----\n"
          }]
        });

        newState.templates = (response as Index)["templates"];
        newState.tags = this.createTagList(newState.slides);

        /* adding current template using default json or making out of blank template */
        let blankTemplateId = "BLANK TEMPLATE";
        let blankTemplateIdx = -1;
        for (let idx = 0; idx < newState.templates.length; idx++) {
          if (newState.templates[idx].id == blankTemplateId) {
            blankTemplateIdx = idx;
            break;
          }
        }

        /* add blank template if it doesn't exist */
        if (blankTemplateIdx == -1) {
          newState.templates.unshift(
            {
              "id": "BLANK TEMPLATE",
              "tag": "CURRENT",
              "saveAsFileName": "",
              "textColor": "#ffffff",
              "highlightedTextColor": "#ffff00",
              "backgroundColor": "#000000",
              "massparts": [
                {
                  "label": "BLANK MASSPART",
                  "addLabelToTitle": true,
                  "slides": []
                }
              ]
            }
          );
        } else {
          newState.templates.unshift(JSON.parse(JSON.stringify(newState.templates[blankTemplateIdx])));
          newState.templates[0].tag = "CURRENT";
        }

        newState.currentTemplateIndex = 0;
        newState.currentMasspartIndex = newState.templates[newState.currentTemplateIndex].massparts.length > 0 ? 0 : -1;


        /* if previously created current state exists in localStorage, update state with those details*/

        /* avoid using old localStorage on app updates */
        if (localStorage.getItem(this.VERSION_KEY) == null || localStorage.getItem(this.VERSION_KEY) != this.CURRENT_VERSION) {
          localStorage.removeItem("currentTemplate");
          localStorage.removeItem("currentMasspartIndex");
          localStorage.removeItem("lastDownloadedTemplate");

          localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
        }

        if (localStorage.getItem("currentTemplate") !== null) {
          newState.templates[newState.currentTemplateIndex] = JSON.parse(localStorage.getItem("currentTemplate") ||
            JSON.stringify(newState.templates[newState.currentTemplateIndex]));

          if (localStorage.getItem("currentMasspartIndex") !== null) {
            newState.currentMasspartIndex = Number(localStorage.getItem("currentMasspartIndex")) || (
              newState.templates[newState.currentTemplateIndex].massparts.length > 0 ? 0 : -1
            );
          }
        }

        if (localStorage.getItem("lastDownloadedTemplate") !== null) {
          newState.templates.push(JSON.parse(localStorage.getItem("lastDownloadedTemplate") || ""));
        }

        /* remove deleted slide names */
        this.scrubTemplates();

        this.updateAndPropagateStateChange();
        this.loadingSubject.next(false);
      },
      (error) => {
        console.log(error);
        this.errorSubject.next(true);
      });
  }

  /* retrieve index from server */
  getIndex() {
    return this.http.get(this.indexUrl);
  }

  /* scrub templates to only have existing slides */
  scrubTemplates() {
    let knownSlides = this.state.slides.map((slide: Slide) => { return slide.name.trim() });

    for (let tIdx = 0; tIdx < this.state.templates.length; tIdx++) {
      let currentTemplate = JSON.parse(JSON.stringify(this.state.templates[tIdx]));

      for (let mIdx = 0; mIdx < currentTemplate.massparts.length; mIdx++) {
        currentTemplate.massparts[mIdx].slides =
          currentTemplate.massparts[mIdx].slides.filter((slide: Slide) => { return knownSlides.includes(slide.name.trim()) });
      }
      this.state.templates[tIdx] = currentTemplate;
    }
  }

  /* download ppt from server */
  downloadReceippt(receippt: Template) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(this.downloadAttachmentUrl, receippt, { headers: headers, responseType: 'blob', reportProgress: true, observe: "events" });
  }

  /* get the exhaustive list of tags from the tagged slides */
  createTagList(slides: Array<Slide>) {
    let slidesTags = slides.map(slide => { return slide.tags });
    return [...new Set(slidesTags.reduce((accumulator, currentValue) => [...accumulator, ...currentValue],
      []))];
  }

  /* update state and localStorage */
  updateAndPropagateStateChange() {
    this.stateSubject.next(this.state);

    localStorage.setItem("currentMasspartIndex", this.state.currentMasspartIndex.toString());
    localStorage.setItem("currentTemplate", JSON.stringify(this.state.templates[this.state.currentTemplateIndex]));

    let LDindex = this.state.templates.findIndex(t => t.tag == "LAST DOWNLOADED");
    if (LDindex != -1) {
      localStorage.setItem("lastDownloadedTemplate", JSON.stringify(this.state.templates[LDindex]));
    }

  }

  /* change masspart index to -1 or a valid index*/
  updateCurrentMasspartIndex(newMasspartIndex: number) {

    /* no need to update if unchanged */
    if (newMasspartIndex == this.state.currentMasspartIndex) {
      return;
    }

    let massPartLen = this.state.templates[this.state.currentTemplateIndex].massparts.length;
    /* if massparts is empty, index cannot be positive */
    if (massPartLen == 0 && newMasspartIndex >= 0) {
      return;
    }

    /* if massparts is not empty, index cannot be -1 */
    if (massPartLen > 0 && newMasspartIndex < 0) {
      return;
    }

    /* if massparts is not empty, index should be within bounds */
    if (massPartLen > 0 && (newMasspartIndex < 0 || newMasspartIndex >= massPartLen)) {
      return;
    }

    this.state.currentMasspartIndex = newMasspartIndex;
    this.updateAndPropagateStateChange();
  }

  /* toggle the addLabelToTile option for the currentMasspart of the currentTemplate */
  updateAddLabelToTitleToggle(newValue: boolean) {
    this.state.templates[this.state.currentTemplateIndex].massparts[this.state.currentMasspartIndex].addLabelToTitle = newValue;

    this.updateAndPropagateStateChange();
  }

  /* toggle the addLabelToTile option for given masspartIndex of the currentTemplate */
  toggleAddLabelToTitleForGivenMasspart(mIdx: number) {
    this.state.templates[this.state.currentTemplateIndex].massparts[mIdx].addLabelToTitle = !this.state.templates[this.state.currentTemplateIndex].massparts[mIdx].addLabelToTitle;

    this.updateAndPropagateStateChange();
  }

  /* append new masspart to the end of the template massparts array and bring it to focus */
  addMasspartToCurrentTemplate(masspart: Masspart) {
    this.state.templates[this.state.currentTemplateIndex].massparts.push(masspart);
    this.state.currentMasspartIndex = this.state.templates[this.state.currentTemplateIndex].massparts.length - 1;

    this.updateAndPropagateStateChange();
  }

  /* rename currentMasspart of currentTemplate */
  renameMasspartOfCurrentTemplate(newLabel: string) {
    this.state.templates[this.state.currentTemplateIndex].massparts[this.state.currentMasspartIndex].label = newLabel;

    this.updateAndPropagateStateChange();
  }

  /* delete currentMasspart from currentTemplate and update index appropriately */
  deleteMasspartOfCurrentTemplate() {
    let ogmasspartsLength = this.state.templates[this.state.currentTemplateIndex].massparts.length;

    this.state.templates[this.state.currentTemplateIndex].massparts.splice(this.state.currentMasspartIndex, 1);

    if (this.state.templates[this.state.currentTemplateIndex].massparts.length < 1) {
      this.state.currentMasspartIndex = -1;
    }
    else if (this.state.currentMasspartIndex > ogmasspartsLength - 2) {
      this.state.currentMasspartIndex -= 1;
    }
    this.updateAndPropagateStateChange();
  }

  /* save template as currentTemplate */
  updateCurrentTemplate(newTemplate: Template) {
    /* creating a deep copy version to prevent unintentional modifications */
    this.state.templates[this.state.currentTemplateIndex] = JSON.parse(JSON.stringify(newTemplate));
    this.state.templates[this.state.currentTemplateIndex].tag = "CURRENT";

    /* updating currentMasspartIndex to avoid outofbounds errors */
    this.state.currentMasspartIndex = this.state.templates[this.state.currentTemplateIndex].massparts.length > 0 ? 0 : -1;

    this.updateAndPropagateStateChange();
  }

  /* remove slide with index from currentMasspart */
  removeSlideIdxFromMasspart(sIdx: number) {
    this.state.templates[this.state.currentTemplateIndex].massparts[this.state.currentMasspartIndex].slides.splice(sIdx, 1);
    this.updateAndPropagateStateChange();
  }

  /* push slide to currentMasspart */
  addSlideToMasspart(slideName: string) {
    let desiredSlideIdx = this.state.slides.findIndex(s => s.name == slideName.trim());
    if (desiredSlideIdx == -1) {
      return;
    }
    let desiredSlide: Slide = JSON.parse(JSON.stringify(this.state.slides[desiredSlideIdx]));

    this.state.templates[this.state.currentTemplateIndex].massparts[this.state.currentMasspartIndex].slides.push(desiredSlide);
    this.updateAndPropagateStateChange();
  }

  /* remove slide form currentMasspart */
  removeSlideFromMasspart(slideName: string) {
    let array = this.state.templates[this.state.currentTemplateIndex].massparts[this.state.currentMasspartIndex].slides;
    let undesiredSlideIdx = [...array].reverse().findIndex(s => s.name == slideName.trim());
    if (undesiredSlideIdx == -1) {
      return;
    }

    this.state.templates[this.state.currentTemplateIndex].massparts[this.state.currentMasspartIndex].slides.splice(array.length - 1 - undesiredSlideIdx, 1);
    this.updateAndPropagateStateChange();
  }

  /* return duplicate slide count in the currentMasspart */
  countOfDuplicateSlides(slideName: string) {
    return this.state.templates[this.state.currentTemplateIndex].massparts[this.state.currentMasspartIndex].slides.filter((s: Slide) => { return s.name == slideName }).length;
  }

  /* save last downloaded template to state and localstorage */
  saveLastDownloaded(template: Template) {
    template = JSON.parse(JSON.stringify(template));
    template.tag = "LAST DOWNLOADED";
    let index = this.state.templates.findIndex(t => t.tag == template.tag);

    /* remove blank slides from massparts if there are no other slides */
    for (let mIdx = 0; mIdx < template.massparts.length; mIdx++) {
      if (template.massparts[mIdx].slides.length > 0 && template.massparts[mIdx].slides.filter(s => (s.name == "BLANK SLIDE" || s.name == "BLANK")).length == template.massparts[mIdx].slides.length) {
        console.log(template.massparts[mIdx].label);
        template.massparts[mIdx].slides = [];
      }
    }

    if (index == -1) {
      this.state.templates.push(template);
    }
    else {
      this.state.templates[index] = template;
    }

    this.updateAndPropagateStateChange();
  }

  /* update state.templateSelectionExpanded */
  updateTemplateSelectionExpanded(expanded: boolean) {
    this.state.templateSelectionExpanded = expanded;
    this.updateAndPropagateStateChange();
  }

  /* update state.masspartSelectionExpanded */
  updateMasspartSelectionExpanded(expanded: boolean) {
    this.state.masspartSelectionExpanded = expanded;
    this.updateAndPropagateStateChange();
  }

  /* toggle between catalogued and chosen slide viewer modes */
  updateSlidesViewMode(mode: 'catalogued' | 'chosen') {
    this.state.slidesViewMode = mode;
    this.updateAndPropagateStateChange();
  }

  /* update complete state */
  updateCompleteState(newState: ReceipptState) {
    this.state = JSON.parse(JSON.stringify(newState));
    this.updateAndPropagateStateChange();
  }

  /* get infoString on which verses are included and excluded */
  getSlideVerseInclusionInfo(slide: Slide) {
    let userDesiredVerses = JSON.parse(JSON.stringify(slide.desiredVerses));
    let sysDesiredVerses = JSON.parse(JSON.stringify(this.state.slides.filter(s => s.name == slide.name)[0].desiredVerses.filter(v => !userDesiredVerses.includes(v))));

    let inclusionInfo = `VERSES -> INCLUDED: ${userDesiredVerses.join(",")}`;
    if (sysDesiredVerses.length > 0) {
      inclusionInfo += ` | EXCLUDED: ${sysDesiredVerses.join(",")}`;
    }
    return inclusionInfo;
  }

}
