import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { Slide } from 'src/app/interfaces/slide';
import { Clipboard } from "@angular/cdk/clipboard"
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReceipptDataService } from 'src/app/services/receippt-data.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-filter-slide',
  templateUrl: './filter-slide.component.html',
  styleUrls: ['./filter-slide.component.css']
})
export class FilterSlideComponent {

  excludedVerseNames: String[] = [];

  constructor(@Inject(DIALOG_DATA) public data: { slide: Slide }, public dialogRef: DialogRef<string>, private clipboard: Clipboard, private snackBar: MatSnackBar, private dataService: ReceipptDataService) {
    this.excludedVerseNames = this.getAllVerseNames().filter(v => !this.isVerseDesired(v));
  }

  getAllVerseNames() {
    return this.data.slide.verses.map(v => v.name);
  }

  isVerseDesired(verseName: string) {
    return this.data.slide.desiredVerses.includes(verseName);
  }

  getIncludedVerses() {
    return this.data.slide.desiredVerses.map(vName => { return this.data.slide.verses.filter(vInfo => vInfo.name == vName)[0] })
  }

  getExcludedVerses() {
    return this.data.slide.verses.sort().filter(vInfo => !this.isVerseDesired(vInfo.name));
  }

  drop(event: CdkDragDrop<String[]>) {
    if (
      event.previousContainer === event.container || // reordering in same list
      (!(event.previousContainer.id == "included-verses")|| event.previousContainer.data.length > 1)// allow move only if more than 1 item
    ) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    }
  }

  copyToClipBoard() {
    let combinedDesiredVersesText = this.getIncludedVerses().map(v => v.text).join("\n");
    this.clipboard.copy(combinedDesiredVersesText);
    this.snackBar.open("Copied To Clipboard", "DISMISS", {
      duration: 3000,
      verticalPosition: 'top'
    });

  }
}

