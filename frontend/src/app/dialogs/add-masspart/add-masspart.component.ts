import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { checkUnused } from 'src/app/receippt.validators';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ReceipptDataService } from 'src/app/services/receippt-data.service';

@Component({
  selector: 'app-add-masspart',
  templateUrl: './add-masspart.component.html',
  styleUrls: ['./add-masspart.component.css']
})
export class AddMasspartComponent {

  name = new FormControl('', { validators: [Validators.required, Validators.maxLength(25), Validators.pattern('^(?!\\s*$).+'), checkUnused(this.data.existingLabels)], updateOn: 'change' });

  labelToggle = true;

  constructor(@Inject(DIALOG_DATA) public data: { existingLabels: Array<String> }, public dialogRef: DialogRef<string>, private dataService: ReceipptDataService) { }

  @ViewChild("textInput") textInput!: ElementRef;

  selectAllOnFocusInput() {
    this.textInput.nativeElement.select();
  }

  closeDialog(option: 'add' | 'cancel') {
    switch (option) {
      case 'add':
        this.dataService.addMasspartToCurrentTemplate({
          "label": this.name.value || "",
          "addLabelToTitle": this.labelToggle,
          "slides": []
        });
        this.dialogRef.close();
        break;
      case 'cancel':
      default:
        this.dialogRef.close();
        break;
    }
  }
}
