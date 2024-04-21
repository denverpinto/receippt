import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { Slide } from 'src/app/interfaces/slide';

@Component({
  selector: 'app-view-slide',
  templateUrl: './view-slide.component.html',
  styleUrls: ['./view-slide.component.css']
})
export class ViewSlideComponent {

  constructor(@Inject(DIALOG_DATA) public data: { slide: Slide}, public dialogRef: DialogRef<string>){
  }

}
