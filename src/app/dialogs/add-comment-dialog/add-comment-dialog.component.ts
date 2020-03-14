import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddImageComponent } from '../add-image/add-image.component';
import { ExpensesService } from 'src/app/services/expenses.service';
import { ToastrService } from 'ngx-toastr';
import { Expense } from 'src/app/models/Expense';

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

  public close(res: Expense) {
    this.dialogRef.close(res);
  }

  public onSubmit() {
    this.expenseService.uploadComment(this.comment, this.data.id).subscribe({
      next: (response: Expense) => {
        this.toast.success('Comment saved');
        this.close(response);
      },
      error: errMsg => this.toast.error(errMsg),
    });
  }
}
