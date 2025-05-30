import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReceipptState } from 'src/app/interfaces/receippt-state';
import { Slide } from 'src/app/interfaces/slide';
import { Template } from 'src/app/interfaces/template';
import { ReceipptDataService } from 'src/app/services/receippt-data.service';

@Component({
  selector: 'app-download-receippt',
  templateUrl: './download-receippt.component.html',
  styleUrls: ['./download-receippt.component.css']
})
export class DownloadReceipptComponent {
  template!: Template

  @ViewChild("textInput")textInput!: ElementRef;

  selectAllOnFocusInput(){
    this.textInput.nativeElement.select();
  }

  state!: ReceipptState;

  saveAsFileName = new FormControl('', { validators: [Validators.required], updateOn: 'change' });
  backgroundColor = new FormControl('#000000');
  textColor = new FormControl('#000000');
  highlightedTextColor = new FormControl('#000000');


  fileStatus = { fileName: '', status: 'start', percent: `100%` };

  constructor(private dataService: ReceipptDataService, public dialogRef: DialogRef<string>, private _snackBar: MatSnackBar) {
    this.dataService.stateSubject.subscribe((value) => {
      this.state = value;
    });

    this.template = JSON.parse(JSON.stringify(this.state.templates[this.state.currentTemplateIndex]));
    this.template.massparts.forEach((masspart: any) => {
      if (masspart.slides.length == 0) {
        masspart.slides.push({
          "name": "BLANK SLIDE", 
          "tags": [], 
          "path": "NOPATH",
          "desiredVerses" : ["1"],
          "verses" : [{
            "name" : "1",
            "path" : "NOPATH",
            "tags" : [],
            "html": "<hr>",
            "text": "-----\n"
          }]});
      }
    });
    this.saveAsFileName.setValue(this.template.saveAsFileName.trim().toUpperCase());
    this.backgroundColor.setValue(this.template.backgroundColor);
    this.textColor.setValue(this.template.textColor);
    this.highlightedTextColor.setValue(this.template.highlightedTextColor);
  }

    getSlideVerseInclusionInfo(slide: Slide){
     return this.dataService.getSlideVerseInclusionInfo(slide);
    }
    
  downloadReceippt() {

    this.template.saveAsFileName = this.saveAsFileName.value?.trim().toUpperCase() ?? "RECEIPPT";
    this.template.backgroundColor = this.backgroundColor.value ?? this.template.backgroundColor;
    this.template.textColor = this.textColor.value ?? this.template.textColor;
    this.template.highlightedTextColor = this.highlightedTextColor.value ?? this.template.highlightedTextColor;

    console.log(this.template);

    this.dataService.downloadReceippt(this.template).subscribe(
      event => {
        this.reportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.fileStatus.percent = `0%`;
        this.fileStatus.status = 'error';
        this._snackBar.open(`FAILED TO CREATE ${this.template.saveAsFileName}.pptx`, "DISMISS",{
          verticalPosition: 'top'
        });
      });
  }

  reportProgress(httpEvent: HttpEvent<Blob>) {
    switch (httpEvent.type) {
      case HttpEventType.Sent: // starting request for file transfer
        this.updateStatus(0, 100);
        this._snackBar.open(`PREPARING ${this.template.saveAsFileName}.pptx`, "DISMISS",{
          verticalPosition: 'top'
        });
        break;
      case HttpEventType.DownloadProgress: // shows percentage done of total
        this.updateStatus(httpEvent.loaded, httpEvent.total!);
        break;
      case HttpEventType.ResponseHeader: // returns headers of response
        if (httpEvent['headers'].keys().includes('content-disposition')) {
          this.fileStatus.fileName = httpEvent['headers'].get('content-disposition')?.split("filename=")[1].replaceAll(/"/g, "") ?? this.fileStatus.fileName;
        }
        break;
      case HttpEventType.Response: //returns blob file object
        const file = new Blob([httpEvent.body!]);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = this.fileStatus.fileName + ".pptx";
        link.click();
        link.remove();

        this.fileStatus.status = 'done';
        this._snackBar.open(`DOWNLOADING ${this.fileStatus.fileName}.pptx`, "DISMISS", {
          duration: 5000,
          verticalPosition: 'top'
        });
        this.dataService.saveLastDownloaded(this.template);

        break;
      default:
        break;

    }
  }

  updateStatus(loaded: number, total: number) {
    this.fileStatus.status = 'progress';
    this.fileStatus.percent = `${Math.round(100 * loaded / total)}%`;
  }

  redirectToMasspart(mIdx: number){
    this.dataService.updateCurrentMasspartIndex(mIdx);
    this.dataService.updateSlidesViewMode("chosen");
    this.dataService.updateMasspartSelectionExpanded(false);
    this.dialogRef.close('cancel');
  }

  toggleMasspartAddLabelToTitle(mIdx: number,){
    this.dataService.toggleAddLabelToTitleForGivenMasspart(mIdx);
  }
}


