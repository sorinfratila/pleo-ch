import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Expense } from 'src/app/models/Expense';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExpensesService } from 'src/app/services/expenses.service';
import { DIRECTION } from 'src/app/components/filter/filter.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit, OnDestroy {
  expenses$: Subscription;
  filteredExpenses$: Subscription;
  expenses: Expense[] = [];
  totalEntries: number;
  nrOfPages: any;
  direction: DIRECTION;
  filter: string;

  constructor(private expensesService: ExpensesService, private toast: ToastrService, private CDR: ChangeDetectorRef) {
    this.totalEntries = 0;
    this.nrOfPages = { amount: 0 };
    this.direction = 'ASC';
    this.filter = 'default';
  }

  ngOnInit(): void {
    this.subscribeToExpenses();
  }

  ngOnDestroy(): void {
    if (this.expenses$) this.expenses$.unsubscribe();
  }

  private subscribeToExpenses(obj?: any) {
    this.expenses$ = this.expensesService.getExpenses(obj).subscribe({
      next: (result: any) => {
        console.log(result);

        const { total, expenses } = result;
        this.totalEntries = total;
        this.nrOfPages = { amount: total };
        this.expenses = this.appendProp(expenses);
        this.CDR.detectChanges();
      },
      error: err => this.toast.error(err),
    });
  }

  private appendProp = (list: Expense[]) => {
    return list.map((exp: Expense) => {
      return { ...exp, isOpen: false };
    });
  };

  public onFilterChange = (filter: string) => {
    this.filter = filter;
    if (filter !== 'default') {
      this.expenses$.unsubscribe();
      this.filteredExpenses$ = this.expensesService.getAllExpenses({ limit: this.totalEntries }).subscribe({
        next: res => {
          const { total, expenses } = res;
          this.totalEntries = total;
          this.expenses = expenses.filter((ex: Expense) => ex.amount.currency === filter);
          this.nrOfPages = { amount: this.expenses.length };

          this.CDR.detectChanges();
        },
        error: err => this.toast.error(err),
      });
    } else {
      this.filteredExpenses$.unsubscribe();
      this.subscribeToExpenses();
    }
  };

  public onDirectionChange = (direction: DIRECTION) => {
    console.log('direction', direction);
    this.direction = direction;
  };

  public onPageChange = (pageNumber: number) => {
    if (this.filteredExpenses$) this.filteredExpenses$.unsubscribe();
    const obj = { limit: 25, offset: (pageNumber - 1) * 25 };
    this.subscribeToExpenses(obj);
  };
}
