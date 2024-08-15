import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DeleteMasspartComponent } from '../dialogs/delete-masspart/delete-masspart.component';
import { Dialog } from '@angular/cdk/dialog';
import { AddMasspartComponent } from '../dialogs/add-masspart/add-masspart.component';
import { RenameMasspartComponent } from '../dialogs/rename-masspart/rename-masspart.component';
import { TemplateSelectorComponent } from '../dialogs/template-selector/template-selector.component';
import { DowloadReceipptComponent } from '../dialogs/dowload-receippt/dowload-receippt.component';
import { ReceipptState } from '../interfaces/receippt-state';
import { ReceipptDataService } from '../services/receippt-data.service';
import { IntrojsService } from '../services/introjs.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  state!: ReceipptState;

  loadingState:boolean = true;

  constructor(private dataService: ReceipptDataService,private introService: IntrojsService,private cdr: ChangeDetectorRef, public dialog: Dialog) {
    this.dataService.stateSubject.subscribe((value) => {
      this.state = value;
    });


    this.dataService.loadingSubject.subscribe((value) => {
      this.loadingState = value;
    });
  }

  /* create intro.js tour request*/
  startTour(){
    this.introService.createRequest();
  }

  /* condition to show introjs tour of site */
  hideTour(){
    return this.introService.hideTour();
  }

  /* update templateSelectionExpanded toggle */
  updateTemplateSelectionToggle(expanded:boolean){
    this.dataService.updateTemplateSelectionExpanded(expanded);
  }

  /* update masspartSelectionExpanded toggle */
  updateMasspartSelectionToggle(expanded:boolean){
    this.dataService.updateMasspartSelectionExpanded(expanded);
  }

  /* return masspart counts for given template */
  getMasspartCount(templateIndex: number) {
    return this.state.templates[templateIndex].massparts.length;
  }

  /* return overall slide count for template if masspartIndex = -1 else get slide count for given template masspart */
  getSlideCount(templateIndex: number, masspartIndex?: number) {
    if (masspartIndex !== undefined) {
      return this.state.templates[templateIndex].massparts[masspartIndex].slides.length;
    }
    let totalSlides = 0;
    for (let masspart of this.state.templates[templateIndex].massparts) {
      totalSlides += masspart.slides.length;
    }
    return totalSlides;
  }

  /* display string representation of masspart and slide counts */
  getSummaryCounts(templateIndex: number, masspartIndex?: number): string {
    if (masspartIndex !== undefined) {
      return `${this.getSlideCount(templateIndex, masspartIndex)} SLIDES`;
    }
    return `${this.getMasspartCount(templateIndex)} MASSPARTS ${this.getSlideCount(templateIndex)} SLIDES`;
  }

  /* update state of currentMasspartIndex */
  updateCurrentMasspartIndex(newMidx: number) {
    this.dataService.updateCurrentMasspartIndex(newMidx);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.state.templates[this.state.currentTemplateIndex].massparts, event.previousIndex, event.currentIndex);

    // update currentMasspartIndex based on shuffling
    if (event.previousIndex == this.state.currentMasspartIndex)
      this.updateCurrentMasspartIndex(event.currentIndex);
    else if(event.previousIndex > this.state.currentMasspartIndex && event.currentIndex <= this.state.currentMasspartIndex){
      this.updateCurrentMasspartIndex(this.state.currentMasspartIndex+1);
    }
    else if (event.previousIndex < this.state.currentMasspartIndex && event.currentIndex >= this.state.currentMasspartIndex){
      this.updateCurrentMasspartIndex(this.state.currentMasspartIndex-1);
    }
  }

  /* toggle the addLabelToTile option for the currentMassPart of the currentTemplate with new boolean value */
  updateAddLabelToTitleToggle(){
    this.dataService.updateAddLabelToTitleToggle(!this.state.templates[this.state.currentTemplateIndex].massparts[this.state.currentMasspartIndex].addLabelToTitle)
  }

  openDeleteMasspartDialog(): void {
    const dialogRef = this.dialog.open<string>(DeleteMasspartComponent, {
      panelClass: 'dialog-panel',
      backdropClass: 'dialog-overlay',
      autoFocus: false,
      data: {
        masspart: this.state.templates[this.state.currentTemplateIndex].massparts[this.state.currentMasspartIndex]
      }
    });

    dialogRef.closed.subscribe(result => {
      if (result != null && result == 'delete') {
        this.dataService.deleteMasspartOfCurrentTemplate();
      }
    });
  }

  openAddMasspartDialog(): void {
    const dialogRef = this.dialog.open<string>(AddMasspartComponent, {
      panelClass: 'dialog-panel',
      backdropClass: 'dialog-overlay',
      autoFocus: false,
      data: {
        existingLabels: this.state.templates[this.state.currentTemplateIndex].massparts.map((masspart: any) => { return masspart.label })
      }
    });

  }

  openRenameMasspartDialog(): void {
  const dialogRef = this.dialog.open<string>(RenameMasspartComponent, {
    panelClass: 'dialog-panel',
    backdropClass: 'dialog-overlay',
    autoFocus: false,
    data: {
      currentLabel: this.state.templates[this.state.currentTemplateIndex].massparts[this.state.currentMasspartIndex].label,
      existingLabels: this.state.templates[this.state.currentTemplateIndex].massparts.map((masspart: any) => { return masspart.label }),
      currentAddLabelToTitleChoice: this.state.templates[this.state.currentTemplateIndex].massparts[this.state.currentMasspartIndex].addLabelToTitle
    }
  });

  }

  /* create a deep copy clone*/
  deepCopy(object: any) {
    return JSON.parse(JSON.stringify(object));
  }

  openTemplateSelectorDialog(selectedTemplateIdx:number): void {
    const dialogRef = this.dialog.open<string>(TemplateSelectorComponent, {
      panelClass: 'dialog-panel',
      backdropClass: 'dialog-overlay',
      autoFocus: false,
      data: {
        currentTemplate: this.deepCopy(this.state.templates[this.state.currentTemplateIndex]),
        selectedTemplate: this.deepCopy(this.state.templates[selectedTemplateIdx])
      }
    });

    dialogRef.closed.subscribe(result => {
      if (result != null) {
        this.updateTemplateSelectionToggle(false);
      }
    });

  }

  openDownloadReceipptDialog(): void {
    const dialogRef = this.dialog.open<string>(DowloadReceipptComponent, {
      panelClass: 'dialog-panel',
      backdropClass: 'dialog-overlay',
      autoFocus: false
    });

  }

}
