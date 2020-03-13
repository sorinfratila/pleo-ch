import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpensesService } from 'src/app/services/expenses.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss'],
})
export class AddImageComponent implements OnInit {
  imageURL: string;
  progress: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddImageComponent>,
    private expenseService: ExpensesService,
    private toast: ToastrService,
  ) {
    this.imageURL = '';
    this.progress = 0;
  }

  ngOnInit(): void {}

  close() {
    this.dialogRef.close('some value');
  }

  processReceipt(receipt: any) {
    const file: File = receipt.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  uploadReceipt(receipt: any) {
    const file = receipt.files[0];
    this.expenseService.uploadReceipt(file, this.data.id).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.UploadProgress: {
          this.progress = Math.round((event.loaded / event.total) * 100);
          break;
        }
        case HttpEventType.Response: {
          this.toast.success('Receipt uploaded!');
          this.close();
          break;
        }
      }
    });
  }
}
