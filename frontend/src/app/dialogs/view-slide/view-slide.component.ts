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
    this.clipboard.copy(this.data.slide.text);
    this.snackBar.open("Copied To Clipboard", "DISMISS",{
      duration: 3000,
      verticalPosition: 'top'
    });
  }
}
