import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { ReceipptState } from '../interfaces/receippt-state';
import { ReceipptDataService } from '../services/receippt-data.service';
import { Dialog } from '@angular/cdk/dialog';
import { ViewSlideComponent } from '../dialogs/view-slide/view-slide.component';
import { Slide } from '../interfaces/slide';

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

  getTagsForSlide(sName:string){
    if(sName == "BLANK SLIDE"){
      return [];
    }
    let slideIdx = this.state.slides.findIndex(s => s.name == sName);
    return this.state.slides[slideIdx].tags;
  }

  openViewSlideDialog(sName: string): void {
    let sInfo : Slide;
    sInfo = this.state.slides[this.state.slides.findIndex(s => s.name == sName)];
    const dialogRef = this.dialog.open<string>(ViewSlideComponent, {
      panelClass: 'dialog-panel',
      backdropClass: 'dialog-overlay',
      autoFocus: false,
      data: {
        slide: sInfo
      }
    });

  }
}
