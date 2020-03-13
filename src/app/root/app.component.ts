import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'pleo';
  // expenses$: Subscription;

  // constructor(private expensesService: ExpensesService) {}

  // ngOnInit(): void {
  //   this.expenses$ = this.expensesService.getExpenses().subscribe({
  //     next: result => {
  //       const { total, expenses } = result;
  //       this.expensesService.setExpenseList(expenses);
  //       // this.expensesService.setExpensesUpdates(expenses);
  //     },
  //     error: err => console.log(err),
  //   });
  // }

  // ngOnDestroy(): void {}
}
