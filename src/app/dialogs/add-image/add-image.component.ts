import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpensesService } from 'src/app/services/expenses.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Expense } from 'src/app/models/Expense';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddImageComponent {
  imageURL: string;
  progress: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddImageComponent>,
    private expenseService: ExpensesService,
    private toast: ToastrService,
    private CDR: ChangeDetectorRef,
  ) {
    this.imageURL = '';
    this.progress = 0;
  }

  close(res?: Expense) {
    if (res) this.dialogRef.close(res);
    else this.dialogRef.close();
  }

  processReceipt(receipt: any) {
    const file: File = receipt.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.imageURL = reader.result as string;
      this.CDR.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  uploadReceipt(receipt: any) {
    const file = receipt.files[0];
    this.expenseService.uploadReceipt({ receipt: file, expenseId: this.data.id }).subscribe({
      next: (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response: {
            this.toast.success('Receipt uploaded!');
            setTimeout(() => {
              this.close(event.body);
            }, 150);
            break;
          }
          case HttpEventType.UploadProgress: {
            this.progress = Math.round((event.loaded / event.total) * 100);
            break;
          }
        }
      },
      error: errorMsg => this.toast.error(errorMsg),
    });
  }
}
