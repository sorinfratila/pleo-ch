import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Expense } from 'src/app/models/Expense';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseComponent {
  @Input() expense: Expense;
  @Output() addReceipt = new EventEmitter<any>();
  @Output() addComment = new EventEmitter<any>();
  constructor() {}

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
    this.addReceipt.emit({ ev, isOpen: this.expense.isOpen });
  };

  /**
   * add comment
   */
  onAddComment = (ev: MouseEvent) => {
    this.addComment.emit({ ev, isOpen: this.expense.isOpen });
  };
}
