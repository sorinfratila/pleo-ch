import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Expense } from 'src/app/models/Expense';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseComponent {
  @Input() expense: Expense;

  // to trigger the method calls from overview components
  @Output() addReceipt = new EventEmitter<any>();
  @Output() addComment = new EventEmitter<any>();

  constructor() {}

  /**
   * toggle the expense to see/hide details
   */
  onHeaderPress = (isOpen: boolean): void => {
    this.expense = {
      ...this.expense,
      isOpen: !isOpen,
    };
  };

  /**
   * add image for receipt emitter
   */
  onAddReceipt = (ev: MouseEvent): void => {
    this.addReceipt.emit({ ev, isOpen: this.expense.isOpen });
  };

  /**
   * add comment emitter
   */
  onAddComment = (ev: MouseEvent): void => {
    this.addComment.emit({ ev, isOpen: this.expense.isOpen });
  };
}
