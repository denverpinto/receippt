import { Component } from '@angular/core';
import { ReceipptState } from '../interfaces/receippt-state';
import { ReceipptDataService } from '../services/receippt-data.service';

@Component({
  selector: 'app-masspart-content',
  templateUrl: './masspart-content.component.html',
  styleUrls: ['./masspart-content.component.css']
})
export class MasspartContentComponent {

  mode = 'catalogued';

  state!: ReceipptState;

  loading$;

  loadingState = true;

  constructor(private dataService: ReceipptDataService) {
    this.dataService.stateSubject.subscribe((value) => {
      this.state = value;
    });

    this.loading$ = this.dataService.loadingSubject.asObservable();

    this.dataService.loadingSubject.subscribe((value) => {
      console.log(value);
      this.loadingState = value;
    });
  }

}
