import { Injectable } from '@angular/core';
import introJs from 'intro.js';
import { ReceipptDataService } from './receippt-data.service';
import { ReceipptState } from '../interfaces/receippt-state';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntrojsService {

  tourGuide;
  state!: ReceipptState;
  /* state before tour changed template and massparts */
  savedState!: ReceipptState;

  /* propagate tour requested via BehaviorSubject and set it to "false" from the beginning. */
  tourRequestedSubject = new BehaviorSubject(false);

  constructor(private dataService: ReceipptDataService) {
    this.tourGuide = introJs();

    this.dataService.stateSubject.subscribe((value) => {
      this.state = value;
    });

  }

  /* create an intro.js tour explaining elements of site */
  startTour() {
    this.tourGuide.setOptions({
      tooltipClass: "tourGuide",
      disableInteraction: true,
      exitOnOverlayClick: false,
      overlayOpacity: 0.7,
      showBullets: false,
      showProgress: true,
      scrollTo: 'tooltip',
      hidePrev: true,
      helperElementPadding: 5,
      steps: [
        {
          element: '#tour-welcome',
          intro:
            "Welcome to Receippt! Let's take a quick tour to find out how to make mass ppts quickly.",
        },
        {
          element: '#tour-introduce-template',
          intro:
            "To start making a new ppt, first choose a mass template.",
        },
        {
          element: '#tour-choose-template',
          intro:
            "Each template comes preloaded with default masspart sections and slides. Select the template that best matches your need.",
        },
        {
          element: '#tour-introduce-masspart',
          intro:
            "Next, add slides to each masspart section in the list. Sections can be reordered and new sections can be added.",
        },
        {
          element: '#tour-choose-masspart',
          intro:
            "Choose a masspart section to begin adding slides to it.",
        },
        {
          element: '#tour-introduce-catalogued-slides',
          intro:
            "Select from a wide range of slides that cover hymns, mass responses, and prayers.",
        },
        {
          element: '#tour-introduce-search-and-filter',
          intro:
            "Search for slides by their titles or filter slides by their assigned tags.",
        },
        {
          element: '#tour-introduce-slide',
          intro:
            "View the title and tags for every slide in the search result.",
        },
        {
          element: '#tour-introduce-slide-text',
          intro:
            "View the text of a given slide that is expected in the final ppt.",
        },
        {
          element: '#tour-choose-slide',
          intro:
            "Ensure it is atleast 1 to add the slide to a masspart section. Multiple copies of a slide can be added if required.",
        },
        {
          element: '#tour-introduce-chosen-slides',
          intro:
            "View all the currently chosen slides of the current masspart section, which can be reordered or deleted.",
        },
        {
          element: '#tour-introduce-masspartactions',
          intro:
            "Apart from adding slides to the current masspart section, the section itself can be renamed or deleted.",
        },
        {
          element: '#tour-introduce-label-slides',
          intro:
            "Tick this to add the [masspart] label on all of the current masspart section's slides' titles.",
        },
        {
          element: '#tour-introduce-download',
          intro:
            "Download the ppt after slides have been chosen for all masspart sections."
        },

      ]
    });
    this.tourGuide.onbeforechange(async (targetElement, step) => {
      if (this.tourGuide._currentStep == this.tourGuide._options.steps.length) {
        /* Last step reached, prevent advancing further */
        return false;
      }

      /* before tour-welcome step */
      if (targetElement.id == "tour-welcome") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(false);
        this.dataService.updateSlidesViewMode('catalogued');
        return new Promise((resolve) => {
          setInterval(resolve, 500);
        });
      }

      /* before tour-introduce-template step */
      if (targetElement.id == "tour-introduce-template") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(false);
        this.dataService.updateSlidesViewMode('catalogued');
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      /* before tour-choose-template step */
      if (targetElement.id == "tour-choose-template") {
        this.dataService.updateTemplateSelectionExpanded(true);
        this.dataService.updateMasspartSelectionExpanded(false);
        this.dataService.updateSlidesViewMode('catalogued');
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      /* before tour-introduce-masspart step */
      if (targetElement.id == "tour-introduce-masspart") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(true);
        this.dataService.updateSlidesViewMode('catalogued');
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      /* before tour-choose-masspart step */
      if (targetElement.id == "tour-choose-masspart") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(true);
        this.dataService.updateSlidesViewMode('catalogued');
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      /* before tour-introduce-catalogued-slides step */
      if (targetElement.id == "tour-introduce-catalogued-slides") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(false);
        this.dataService.updateSlidesViewMode('catalogued')
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      /* before tour-introduce-search-and-filter step */
      if (targetElement.id == "tour-introduce-search-and-filter") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(false);
        this.dataService.updateSlidesViewMode('catalogued')
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      /* before tour-introduce-slide step */
      if (targetElement.id == "tour-introduce-slide") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(false);
        this.dataService.updateSlidesViewMode('catalogued');
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      /* before tour-introduce-slide step */
      if (targetElement.id == "tour-introduce-slide-text") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(false);
        this.dataService.updateSlidesViewMode('catalogued');
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      /* before tour-choose-slide step */
      if (targetElement.id == "tour-choose-slide") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(false);
        this.dataService.updateSlidesViewMode('catalogued');
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      /* before tour-introduce-choosen-slides step */
      if (targetElement.id == "tour-introduce-chosen-slides") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(false);
        this.dataService.updateSlidesViewMode('chosen');
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      /* before tour-introduce-masspartactions step */
      if (targetElement.id == "tour-introduce-masspartactions") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(false);
        this.dataService.updateSlidesViewMode('catalogued');
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      /* before tour-introduce-label-slides step */
      if (targetElement.id == "tour-introduce-label-slides") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(false);
        this.dataService.updateSlidesViewMode('catalogued');
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      /* before tour-introduce-download step */
      if (targetElement.id == "tour-introduce-download") {
        this.dataService.updateTemplateSelectionExpanded(false);
        this.dataService.updateMasspartSelectionExpanded(false);
        this.dataService.updateSlidesViewMode('catalogued');
        return new Promise((resolve) => {
          setInterval(resolve, 100);
        });
      }

      return true;
    });

    this.tourGuide.onbeforeexit(async () => {
      console.log("TOUR POST INIT");
      this.postTourInit();
      return new Promise((resolve) => {
        setInterval(resolve, 100);
      })
    });

    this.tourGuide.start();
  }

  /* disable tour if -
  there is no template with atleast 1 masspart 
  there are no slides */
  hideTour() {
    let tourWorthyTemplates = this.dataService.state.templates.filter(template => template.massparts.length > 0);
    return this.dataService.state.slides.length > 0 && tourWorthyTemplates.length > 0;
  }

  /* tour pre initialization */
  preTourInit() {
    /* save current state */
    this.savedState = JSON.parse(JSON.stringify(this.state));
    /* find suitable template with massparts to make as current template for tour */
    let tourWorthyTemplate = this.savedState.templates.filter(template => { return template.massparts.length > 0 })[0];
    let tourWorthyTemplateIdx = this.savedState.templates.findIndex(template => template.id == tourWorthyTemplate.id);

    /* find suitable masspart in the tour worthy template */
    let tourWorthyMassparts = tourWorthyTemplate.massparts.filter(masspart => { return masspart.slides.length > 1 });
    let tourWorthyMasspartIdx;
    if (tourWorthyMassparts.length > 0) {
      tourWorthyMasspartIdx = tourWorthyTemplate.massparts.findIndex(masspart => { return masspart.label == tourWorthyMassparts[0].label });
    } else {
      tourWorthyMasspartIdx = 0;
    }

    /* update state and propagate change globally */
    let updatedState = JSON.parse(JSON.stringify(this.state));
    updatedState.currentTemplateIndex = tourWorthyTemplateIdx;
    updatedState.currentMasspartIndex = tourWorthyMasspartIdx;

    this.dataService.updateCompleteState(updatedState);
  }

  /* tour post initialization */
  postTourInit() {
    /* return to saved state before tour */
    this.dataService.updateCompleteState(this.savedState);
  }

  createRequest(){
    this.tourRequestedSubject.next(true);
  }

  completeRequest(){
    this.tourRequestedSubject.next(false);
  }

}
