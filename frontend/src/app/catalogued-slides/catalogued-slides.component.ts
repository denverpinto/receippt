import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ViewSlideComponent } from '../dialogs/view-slide/view-slide.component';
import { ReceipptState } from '../interfaces/receippt-state';
import { ReceipptDataService } from '../services/receippt-data.service';
import { FormControl, Validators } from '@angular/forms';
import { Slide } from '../interfaces/slide';

@Component({
  selector: 'app-catalogued-slides',
  templateUrl: './catalogued-slides.component.html',
  styleUrls: ['./catalogued-slides.component.css']
})
export class CataloguedSlidesComponent {

  @Input() masspartExists: boolean = true;

  state!: ReceipptState;

  loadingState = true;

  pagination = { page: 0, pageStartIdx: 0, pageEndIdx: 0, pageSize: 10 };
  filteredSlides: Array<Slide> = [];
  searchTextFilter = new FormControl('');
  tagsFilter: Array<string> = [];

  constructor(private dataService: ReceipptDataService, public dialog: Dialog) {
    this.dataService.stateSubject.subscribe((value) => {
      this.state = value;
      this.updatePage('current');
    });

    this.dataService.loadingSubject.subscribe((value) => {
      this.loadingState = value;
    });
  }

  @ViewChild("textInput") textInput!: ElementRef;

  selectAllOnFocusInput() {
    this.textInput.nativeElement.select();
  }

  /* function that assigns or removes tags from filter based on it's current state */
  toggleAddTagsToFilter(tag: string) {
    if (this.tagsFilter.includes(tag)) {
      this.tagsFilter.splice(this.tagsFilter.indexOf(tag), 1);
    }
    else {
      this.tagsFilter.push(tag);
      this.tagsFilter.sort();
    }

    this.updatePage('current');
  }

  /* boolean on tag's inclusion in tagsFilter */
  isTagFiltered(tag: string) {
    return this.tagsFilter.includes(tag);
  }

  getTags() {
    return this.state.tags.sort();
  }

  /* filter and sort slides ignoring everything but alphanumeric spaces */
  filterSlides() {
    /* capitalize and collapse multiple spaces */
    let searchText = this.searchTextFilter.value?.toUpperCase().replace(/\s\s+/g, ' ') || "";

    /* find slides that are tagged with all filtered tags */
    let tagFilteredSlides = this.state.slides.filter(slide => { return this.tagsFilter.every((tag: string) => slide.tags.includes(tag)) });

    /* find exact Title matches */
    let exactTitleMatchedSlides = tagFilteredSlides.filter(slide => { return slide.name.trim().toUpperCase().replace(/\s\s+/g, ' ').includes(searchText) })
    .filter(slide => !slide.name.trim().toUpperCase().replace(/\s\s+/g, ' ').includes('BLANK SLIDE'));

    /* sort exact Title matches */
    exactTitleMatchedSlides.sort(function (slideA, slideB) {
      if (slideA.name < slideB.name) {
        return -1;
      }
      if (slideA.name > slideB.name) {
        return 1;
      }
      return 0;
    })

    /* remove special characters from searchtext for partial matches */
    let searchTextFiltered = searchText.trim().replace(/[^A-Za-z0-9 ]/g, "");

    /* find partial Title matches */
    let partialTitleMatchedSlides = tagFilteredSlides
    .filter(slide => { return !slide.name.trim().toUpperCase().replace(/\s\s+/g, ' ').includes(searchText) })
    .filter(slide => { return slide.name.trim().toUpperCase().replace(/[^A-Za-z0-9 ]/g, "").replace(/\s\s+/g, ' ').includes(searchTextFiltered) })
    .filter(slide => !slide.name.trim().toUpperCase().replace(/\s\s+/g, ' ').includes('BLANK SLIDE'));

    /* sort partial Title matches */
    partialTitleMatchedSlides.sort(function (slideA, slideB) {
      if (slideA.name < slideB.name) {
        return -1;
      }
      if (slideA.name > slideB.name) {
        return 1;
      }
      return 0;
    });

    /* find BLANK SLIDE */
    let blankSlide = this.state.slides.filter(slide => { return slide.name.trim().toUpperCase().replace(/\s\s+/g, ' ').includes("BLANK SLIDE") });

    /* merge results */
    let allTitleMatchedSlides = [...blankSlide, ...exactTitleMatchedSlides, ...partialTitleMatchedSlides];


    this.filteredSlides = allTitleMatchedSlides;
    return allTitleMatchedSlides;
  }

  updatePage(nav: 'current' | 'prev' | 'next' | 'first' | 'last') {
    this.filterSlides();
    let filteredSlidesLength = 0;
    if(this.filteredSlides.length > 0){
      filteredSlidesLength = this.filteredSlides.length - 1;
    }
    switch (nav) {
      case 'current':
        /* check if current page is possible with the filterSlides count */
        this.pagination.page = Math.min(this.pagination.page, Math.floor((filteredSlidesLength) / this.pagination.pageSize));
        break;
      case 'prev': this.pagination.page = Math.max(0, this.pagination.page - 1); break;
      case 'next': this.pagination.page = Math.min(Math.floor((filteredSlidesLength) / this.pagination.pageSize), this.pagination.page + 1); break;
      case 'first': this.pagination.page = 0; break;
      case 'last': this.pagination.page = Math.floor((filteredSlidesLength) / this.pagination.pageSize); break;
    }

    this.pagination.pageStartIdx = this.pagination.page * this.pagination.pageSize;
    this.pagination.pageEndIdx = Math.min(this.pagination.pageStartIdx + this.pagination.pageSize - 1, filteredSlidesLength);
  }

  getPageStartIdx() {
    this.updatePage('current');
    return this.pagination.pageStartIdx;
  }

  getPageEndIdx() {
    this.updatePage('current');
    return this.pagination.pageEndIdx;
  }

  /*function to push slide to current masspart */
  addSlideToMasspart(slideName: string) {
    this.dataService.addSlideToMasspart(slideName);
  }

  /* function to remove slide form current masspart */
  removeSlideFromMasspart(slideName: string) {
    this.dataService.removeSlideFromMasspart(slideName);
  }

  /* function to return duplicate slide count in the current masspart */
  duplicateSlideCount(slideName: string) {
    return this.dataService.countOfDuplicateSlides(slideName);
  }

  openViewSlideDialog(slide: Slide): void {
    const dialogRef = this.dialog.open<string>(ViewSlideComponent, {
      panelClass: 'dialog-panel',
      backdropClass: 'dialog-overlay',
      autoFocus: false,
      data: {
        slide: slide
      }
    });

  }
}
