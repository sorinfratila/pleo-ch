import { Component, Inject, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddImageComponent } from '../add-image/add-image.component';
import { ExpensesService } from 'src/app/services/expenses.service';
import { ToastrService } from 'ngx-toastr';
import { Expense } from 'src/app/models/Expense';

@Component({
  selector: 'app-add-comment-dialog',
  templateUrl: './add-comment-dialog.component.html',
  styleUrls: ['./add-comment-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCommentDialogComponent implements AfterViewInit {
  comment: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddImageComponent>,
    private expenseService: ExpensesService,
    private toast: ToastrService,
    private CDR: ChangeDetectorRef,
  ) {
    this.comment = data.comment;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.CDR.detectChanges();
    }, 50);
  }

  public close(res?: Expense) {
    if (res) this.dialogRef.close(res);
    else this.dialogRef.close();
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
