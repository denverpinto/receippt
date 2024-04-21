import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { checkUnused } from 'src/app/receippt.validators';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-add-masspart',
  templateUrl: './add-masspart.component.html',
  styleUrls: ['./add-masspart.component.css']
})
export class AddMasspartComponent {
  
  name = new FormControl('', { validators: [Validators.required,Validators.maxLength(25), Validators.pattern('^(?!\\s*$).+'), checkUnused(this.data.existingLabels)], updateOn: 'change' });

  constructor(@Inject(DIALOG_DATA) public data: {  existingLabels: Array<String> }, public dialogRef: DialogRef<string>) { }

  @ViewChild("textInput")textInput!: ElementRef;

  selectAllOnFocusInput(){
    this.textInput.nativeElement.select();
  }

  closeDialog(option: 'add' | 'cancel') {
    switch (option) {
      case 'add':
        this.dialogRef.close(this.name.value||"");
        break;
      case 'cancel':
      default:
        this.dialogRef.close();
        break;
    }
  }
}
