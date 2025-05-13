import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { ReceipptState } from 'src/app/interfaces/receippt-state';
import { Slide } from 'src/app/interfaces/slide';
import { Template } from 'src/app/interfaces/template';
import { ReceipptDataService } from 'src/app/services/receippt-data.service';

@Component({
  selector: 'app-template-selector',
  templateUrl: './template-selector.component.html',
  styleUrls: ['./template-selector.component.css']
})
export class TemplateSelectorComponent {

  selectionSkeleton!: { massparts: { label: string; addLabelToTitle: boolean; selected: boolean; slides: { name: string; desiredVerses: string; selected: boolean }[] }[]};

  state!: ReceipptState;
  
  constructor(@Inject(DIALOG_DATA) public data: { currentTemplate: Template, selectedTemplate: Template }, public dialogRef: DialogRef<string>, private dataService: ReceipptDataService) {
    this.selectionSkeleton = this.createSelectionSkeleton(this.data.selectedTemplate, this.data.currentTemplate);

    this.dataService.stateSubject.subscribe((value) => {
      this.state = value;
    });
  }

  createSelectionSkeleton(selectedTemplate: any, currentTemplate: any) {

    let templateSkeleton:{ massparts: { label: string; addLabelToTitle: boolean; selected: boolean; slides: { name: string; desiredVerses: string; selected: boolean }[] }[]} = { massparts: [] };

    selectedTemplate.massparts.forEach((masspart: any) => {
      let masspartSkeleton: { label: string; addLabelToTitle: boolean; selected: boolean; slides: { name: string; desiredVerses: string; selected: boolean }[] } =
      {
        label: masspart.label,
        addLabelToTitle: masspart.addLabelToTitle,
        selected: true,
        slides: []
      }
      let selectedMasspartSlideMap = new Map<string, number>();
      masspart.slides.forEach((slide: Slide) => {
        masspartSkeleton.slides.push({ name: slide.name, desiredVerses: slide.desiredVerses.join(","), selected: true });
        let mapIndex = `${slide.name.trim()}-${slide.desiredVerses.join(",")}`;
        selectedMasspartSlideMap.set(mapIndex, (selectedMasspartSlideMap.get(mapIndex) || 0) + 1);
      });

      // if masspart exists in currentTemplate, include its slides too that already haven't been included (name + desiredVerses)
      if (currentTemplate.massparts.filter((currentMassPart: any) => { return masspart.label == currentMassPart.label }).length > 0) {
        let currentMassPartInfo = currentTemplate.massparts.filter((currentMassPart: any) => { return masspart.label == currentMassPart.label })[0];

        currentMassPartInfo.slides.forEach((slide: Slide) => {
          let currentMapIndex = `${slide.name.trim()}-${slide.desiredVerses.join(",")}`;
          let currentMapIndexCount = selectedMasspartSlideMap.get(currentMapIndex) || 0;
          if(currentMapIndexCount > 0){
            selectedMasspartSlideMap.set(currentMapIndex, currentMapIndexCount - 1);
          } else {
            masspartSkeleton.slides.push({ name: slide.name, desiredVerses: slide.desiredVerses.join(","), selected: false });
          }
        });
      }

      templateSkeleton.massparts.push(masspartSkeleton);
    });

    // if there is a masspart that isn't included in the selected template
    currentTemplate.massparts.forEach((masspart: any) => {
      if (!selectedTemplate.massparts.map((defaultMassPart: any) => defaultMassPart.label).includes(masspart.label)) {
        let masspartSkeleton: { label: string; addLabelToTitle: boolean; selected: boolean; slides: { name: string; desiredVerses: string; selected: boolean }[] } =
        {
          label: masspart.label,
          addLabelToTitle: masspart.addLabelToTitle,
          selected: false,
          slides: []
        }
        masspart.slides.forEach((slide: Slide) => {
          masspartSkeleton.slides.push({ name: slide.name, desiredVerses: slide.desiredVerses.join(","), selected: false });
        });

        templateSkeleton.massparts.push(masspartSkeleton);
      }

    });

    return templateSkeleton;
  }

  resetSelectionSkeleton(){
    this.selectionSkeleton = this.createSelectionSkeleton(this.data.selectedTemplate, this.data.currentTemplate);
  }

  updateSelectionForMasspart(masspartLabel:string){
    this.selectionSkeleton.massparts.forEach( masspart => {
      if(masspart.label == masspartLabel){
        masspart.selected = masspart.selected || masspart.slides.some( slide => slide.selected);
      }
    })
  }

  updateSelectionForSlidesOf(masspartLabel:string){
    this.selectionSkeleton.massparts.forEach( masspart => {
      if(masspart.label == masspartLabel && !masspart.selected){
        masspart.slides.forEach(slideInfo =>{
          slideInfo.selected = false;
        })
      }
    })
  }

  createTemplateFromSelectionSkeleton(){
    let selectedTemplate = JSON.parse(JSON.stringify(this.data.selectedTemplate));
    selectedTemplate.massparts = [];
    this.selectionSkeleton.massparts.forEach( masspartInfo =>{
      if(masspartInfo.selected){
        let masspartToAdd: { label: string, addLabelToTitle: boolean, slides: Slide[] } = 
        { label: masspartInfo.label, addLabelToTitle: masspartInfo.addLabelToTitle, slides: [] };

        masspartInfo.slides.forEach( slideInfo => {
          if(slideInfo.selected){
            let selectedSlide = JSON.parse(JSON.stringify(this.state.slides.filter(indexSlide => indexSlide.name == slideInfo.name)[0]));
            selectedSlide.desiredVerses = slideInfo.desiredVerses.split(",");
            masspartToAdd.slides.push(selectedSlide);
          }
        });
        selectedTemplate.massparts.push(masspartToAdd);
      }
    });
    return selectedTemplate;
  }

  closeDialog(action: 'create' | 'cancel') {
    switch (action) {
      case 'create':
        this.dataService.updateCurrentTemplate(this.createTemplateFromSelectionSkeleton());
        this.dialogRef.close('create');
        break;
      case 'cancel':
      default:
        this.dialogRef.close('cancel');
        break;
    }
  }

  
}
