import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddImageComponent } from '../add-image/add-image.component';
import { ExpensesService } from 'src/app/services/expenses.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-comment-dialog',
  templateUrl: './add-comment-dialog.component.html',
  styleUrls: ['./add-comment-dialog.component.scss'],
})
export class AddCommentDialogComponent {
  comment: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddImageComponent>,
    private expenseService: ExpensesService,
    private toast: ToastrService,
  ) {
    this.comment = '';
  }

  close() {
    this.dialogRef.close('some value');
  }
}
