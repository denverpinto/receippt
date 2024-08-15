import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { checkUnused } from 'src/app/receippt.validators';
import { ReceipptDataService } from 'src/app/services/receippt-data.service';

@Component({
  selector: 'app-rename-masspart',
  templateUrl: './rename-masspart.component.html',
  styleUrls: ['./rename-masspart.component.css']
})
export class RenameMasspartComponent {

  name = new FormControl('', { validators: [Validators.required,Validators.maxLength(25), Validators.pattern('^(?!\\s*$).+'), checkUnused(this.data.existingLabels)], updateOn: 'change' });

  constructor(@Inject(DIALOG_DATA) public data: { currentLabel: string,  existingLabels: Array<String>, currentAddLabelToTitleChoice: boolean }, public dialogRef: DialogRef<string>, private dataService: ReceipptDataService) { }

  @ViewChild("textInput")textInput!: ElementRef;

  selectAllOnFocusInput(){
    this.textInput.nativeElement.select();
  }

  resetInput(){
    this.name.setValue('');
  }
  
  closeDialog(option: 'rename' | 'cancel') {
    switch (option) {
      case 'rename':
        this.dataService.updateAddLabelToTitleToggle(this.data.currentAddLabelToTitleChoice);
        this.dataService.renameMasspartOfCurrentTemplate(this.name.value||"");
        this.dialogRef.close();
        break;
      case 'cancel':
      default:
        this.dialogRef.close();
        break;
    }
  }
}
