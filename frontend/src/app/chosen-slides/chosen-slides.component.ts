import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { ReceipptState } from '../interfaces/receippt-state';
import { ReceipptDataService } from '../services/receippt-data.service';
import { Dialog } from '@angular/cdk/dialog';
import { Slide } from '../interfaces/slide';
import { FilterSlideComponent } from '../dialogs/filter-slide/filter-slide.component';

@Component({
  selector: 'app-chosen-slides',
  templateUrl: './chosen-slides.component.html',
  styleUrls: ['./chosen-slides.component.css']
})
export class ChosenSlidesComponent {

  state!: ReceipptState;

  constructor(private dataService: ReceipptDataService, public dialog: Dialog) {
    this.dataService.stateSubject.subscribe((value) => {
      this.state = value;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.state.templates[this.state.currentTemplateIndex].massparts[this.state.currentMasspartIndex].slides, event.previousIndex, event.currentIndex);
  }

  /* function to delete slide from a masspart */
  deleteSlide(sIdx: number) {
    this.dataService.removeSlideIdxFromMasspart(sIdx);
  }

  getTagsForSlide(slide:Slide){
    if(slide.name == "BLANK SLIDE"){
      return [];
    }
    return slide.tags;
  }

  getSlideVerseInclusionInfo(slide: Slide){
    return this.dataService.getSlideVerseInclusionInfo(slide);
  }

  openFilterSlideDialog(slide: Slide): void {
    const dialogRef = this.dialog.open<string>(FilterSlideComponent, {
      panelClass: 'dialog-panel',
      backdropClass: 'dialog-overlay',
      autoFocus: false,
      data: {
        slide: slide
      }
    });

  }
}
