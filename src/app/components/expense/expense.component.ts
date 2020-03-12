import { Component, OnInit, Input } from '@angular/core';
import { Expense } from 'src/app/models/Expense';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  @Input() expense: Expense;
  constructor() {}

  ngOnInit(): void {}

  /**
   * toggle the expense to see/hide details
   */
  onHeaderPress = () => {
    console.log('opened');
  };

  /**
   * add image for receipt trigger
   */
  onAddReceipt = (ev: any) => {
    ev.stopPropagation();
    console.log('adding receipt');
  };

  /**
   * add comment
   */
  onAddComment = (ev: any) => {
    ev.stopPropagation();
    console.log('adding comment');
  };
}
