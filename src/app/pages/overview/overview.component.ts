import { Component, OnInit } from '@angular/core';
import { Expense } from 'src/app/models/Expense';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExpensesService } from 'src/app/services/expenses.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  expenseList$: Observable<any>;

  constructor(private expensesService: ExpensesService) {}

  ngOnInit(): void {
    this.expenseList$ = this.expensesService.getExpenses().pipe(
      map((result: any) => {
        const { total, expenses } = result;
        const newExpenseList = this.appendProp(expenses);
        return newExpenseList;
      }),
    );
  }

  private appendProp = (list: Expense[]) => {
    return list.map((exp: Expense) => {
      return { ...exp, isOpen: false };
    });
  };
}
