import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { Slide } from 'src/app/interfaces/slide';
import { Clipboard } from "@angular/cdk/clipboard"
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-slide',
  templateUrl: './view-slide.component.html',
  styleUrls: ['./view-slide.component.css']
})
export class ViewSlideComponent {

  constructor(@Inject(DIALOG_DATA) public data: { slide: Slide}, public dialogRef: DialogRef<string>, private clipboard: Clipboard, private snackBar: MatSnackBar){
  }

  copyToClipBoard(){
    let combinedVersesText = this.data.slide.verses.map(v => v.text).join("\n");
    this.clipboard.copy(combinedVersesText);
    this.snackBar.open("Copied To Clipboard", "DISMISS",{
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  getSortedVerses(){
      return this.data.slide.desiredVerses.map( verseName => { 
        return this.data.slide.verses.filter( v => v.name == verseName)[0];
      });
  }

}
