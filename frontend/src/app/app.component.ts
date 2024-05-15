import { ChangeDetectorRef, Component } from '@angular/core';
import { ReceipptDataService } from './services/receippt-data.service';
import { ReceipptState } from './interfaces/receippt-state';
import { IntrojsService } from './services/introjs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  state!: ReceipptState;

  loading = true;

  down = false;

  constructor(private dataService: ReceipptDataService, private introService: IntrojsService, private cdr: ChangeDetectorRef) {
    this.dataService.stateSubject.subscribe((value) => {
      this.state = value;
    });

    /* start introjs tour if set off by header button */
    this.introService.tourRequestedSubject.subscribe((value) => {
      if (value) {
        this.introService.preTourInit();
        this.cdr.detectChanges();
        this.introService.startTour();
        this.introService.completeRequest();
      }
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
