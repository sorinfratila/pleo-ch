import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Expense } from 'src/app/models/Expense';
import { MatDialog } from '@angular/material/dialog';
import { AddImageComponent } from 'src/app/dialogs/add-image/add-image.component';
import { AddCommentDialogComponent } from 'src/app/dialogs/add-comment-dialog/add-comment-dialog.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseComponent implements OnInit {
  @Input() expense: Expense;
  constructor(private dialog: MatDialog, private CDR: ChangeDetectorRef) {}

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
  onAddReceipt = (ev: MouseEvent) => {
    ev.stopPropagation();
    const dialogRef = this.dialog.open(AddImageComponent, {
      panelClass: 'dialog-container',
      backdropClass: 'backdrop-container',
      data: this.expense,
    });

    dialogRef.afterClosed().subscribe((res?: Expense) => {
      if (res) {
        this.expense = { ...res, isOpen: this.expense.isOpen };
        this.CDR.detectChanges();
      }
    });
  };

  /**
   * add comment
   */
  onAddComment = (ev: MouseEvent) => {
    ev.stopPropagation();
    const newExpense = {
      ...this.expense,
      isOpen: true,
    };

    const dialogRef = this.dialog.open(AddCommentDialogComponent, {
      panelClass: 'dialog-container',
      backdropClass: 'backdrop-container',
      data: newExpense,
    });

    dialogRef.afterClosed().subscribe((res?: Expense) => {
      if (res) {
        this.expense = { ...res, isOpen: this.expense.isOpen };
        this.CDR.detectChanges();
      }
    });
  };
}
