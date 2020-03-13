import { Component, OnInit, Input } from '@angular/core';
import { Expense } from 'src/app/models/Expense';
import { MatDialog } from '@angular/material/dialog';
import { AddImageComponent } from 'src/app/dialogs/add-image/add-image.component';
import { AddCommentDialogComponent } from 'src/app/dialogs/add-comment-dialog/add-comment-dialog.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  @Input() expense: Expense;
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  /**
   * toggle the expense to see/hide details
   */
  onHeaderPress = (isOpen: boolean) => {
    this.expense = {
      ...this.expense,
      isOpen: !isOpen,
    };
  };

  /**
   * add image for receipt trigger
   */
  onAddReceipt = (ev: any) => {
    ev.stopPropagation();
    const dialogRef = this.dialog.open(AddImageComponent, {
      panelClass: 'dialog-container',
      backdropClass: 'backdrop-container',
      data: this.expense,
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log('add image dialog closed:', res);
    });
  };

  /**
   * add comment
   */
  onAddComment = (ev: any) => {
    ev.stopPropagation();
    const dialogRef = this.dialog.open(AddCommentDialogComponent, {
      panelClass: 'dialog-container',
      backdropClass: 'backdrop-container',
      data: this.expense,
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log('add comment dialog closed:', res);
    });
  };
}
