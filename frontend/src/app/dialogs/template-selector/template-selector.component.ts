import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { Template } from 'src/app/interfaces/template';
import { ReceipptDataService } from 'src/app/services/receippt-data.service';

@Component({
  selector: 'app-template-selector',
  templateUrl: './template-selector.component.html',
  styleUrls: ['./template-selector.component.css']
})
export class TemplateSelectorComponent {

  selectionSkeleton!: { massparts: { label: string; addLabelToTitle: boolean; selected: boolean; slides: { label: string; selected: boolean }[] }[]};

  constructor(@Inject(DIALOG_DATA) public data: { currentTemplate: Template, selectedTemplate: Template }, public dialogRef: DialogRef<string>, private dataService: ReceipptDataService) {
    this.selectionSkeleton = this.createSelectionSkeleton(this.data.selectedTemplate, this.data.currentTemplate);
  }

  createSelectionSkeleton(selectedTemplate: any, currentTemplate: any) {

    let templateSkeleton:{ massparts: { label: string; addLabelToTitle: boolean; selected: boolean; slides: { label: string; selected: boolean }[] }[]} = { massparts: [] };

    selectedTemplate.massparts.forEach((masspart: any) => {
      let masspartSkeleton: { label: string; addLabelToTitle: boolean; selected: boolean; slides: { label: string; selected: boolean }[] } =
      {
        label: masspart.label,
        addLabelToTitle: masspart.addLabelToTitle,
        selected: true,
        slides: []
      }
      masspart.slides.forEach((slide: string) => {
        masspartSkeleton.slides.push({ label: slide, selected: true });
      });

      // if masspart exists in currentTemplate, include it's slides too
      if (currentTemplate.massparts.filter((currentMassPart: any) => { return masspart.label == currentMassPart.label }).length > 0) {
        let currentMassPartInfo = currentTemplate.massparts.filter((currentMassPart: any) => { return masspart.label == currentMassPart.label })[0];

        currentMassPartInfo.slides.forEach((slide: string) => {
          if (!masspartSkeleton.slides.map(slideskeleton => slideskeleton.label).includes(slide)) {
            masspartSkeleton.slides.push({ label: slide, selected: false });
          }
        });
      }

      templateSkeleton.massparts.push(masspartSkeleton);
    });

    // if there is a masspart that isnt included in the default template
    currentTemplate.massparts.forEach((masspart: any) => {
      if (!selectedTemplate.massparts.map((defaultMassPart: any) => defaultMassPart.label).includes(masspart.label)) {
        let masspartSkeleton: { label: string; addLabelToTitle: boolean; selected: boolean; slides: { label: string; selected: boolean }[] } =
        {
          label: masspart.label,
          addLabelToTitle: masspart.addLabelToTitle,
          selected: false,
          slides: []
        }
        masspart.slides.forEach((slide: string) => {
          masspartSkeleton.slides.push({ label: slide, selected: false });
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
        let masspartToAdd: { label: string, addLabelToTitle: boolean, slides: string[] } = 
        { label: masspartInfo.label, addLabelToTitle: masspartInfo.addLabelToTitle, slides: [] };

        masspartInfo.slides.forEach( slideInfo => {
          if(slideInfo.selected){
            masspartToAdd.slides.push(slideInfo.label);
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
