import { Masspart } from 'src/app/interfaces/masspart';
import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-delete-masspart',
  templateUrl: './delete-masspart.component.html',
  styleUrls: ['./delete-masspart.component.css']
})
export class DeleteMasspartComponent {

  constructor(@Inject(DIALOG_DATA) public data: { masspart: Masspart }, public dialogRef: DialogRef<string>) { }

  closeDialog(option: 'delete' | 'cancel') {
    switch (option) {
      case 'delete':
        this.dialogRef.close('delete');
        break;
      case 'cancel':
      default:
        this.dialogRef.close('cancel');
        break;
    }
  }
}
