import { Component, Renderer2 } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ReceipptDataService } from './services/receippt-data.service';
import { ReceipptState } from './interfaces/receippt-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  state!: ReceipptState;

  loading = true;

  down = false;

  constructor(private dataService: ReceipptDataService, private renderer: Renderer2) {
    this.dataService.stateSubject.subscribe((value) => {
      this.state = value;
    });

    this.dataService.loadingSubject.subscribe((value) => {
      this.loading = value;
      if(value){
       document.documentElement.style.setProperty(`--text-color`, "#777777");
       document.documentElement.style.setProperty(`--highlighted-text-color`, "#888888");

      }else{
        document.documentElement.style.removeProperty(`--text-color`);
        document.documentElement.style.removeProperty(`--highlighted-text-color`);
      }
    });

    this.dataService.errorSubject.subscribe((value) => {
      this.down = value;
      if(value){
        document.documentElement.style.removeProperty(`--text-color`);
        document.documentElement.style.removeProperty(`--highlighted-text-color`);
      }
    });

  }
}
