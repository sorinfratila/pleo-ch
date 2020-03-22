import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/Expense';
import { Select, Store } from '@ngxs/store';
import { ExpenseState } from 'src/app/store/expense.state';
import {
  GetExpenses,
  SetTotalExpenses,
  SetFilterValue,
  SetFilterType,
  SetExpenses,
  SetCurrentPage,
} from 'src/app/store/expense.actions';
import { takeUntil, filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, OnDestroy {
  /** total expenses from BE */
  @Input() totalEntries: number;

  destroy$: Subject<any>;

  /** keeps the total of expenses when filtering */
  expenses: Expense[];

  /** the array of filter values generated from BE data */
  filterValues: any[];

  /** the static array of filters types based on the BE data */
  filterTypes: any[];

  date: Set<any>; // holds all the years found in DB expenses
  currency: Set<any>; // holds all the currencies found in DB expenses
  selectedProp: string; // used for notifying overview component which property is selected

  constructor(private store: Store, private expensesService: ExpensesService, private toast: ToastrService) {
    this.destroy$ = new Subject<any>();
    this.date = new Set();
    this.currency = new Set();
    this.filterValues = [];
    this.filterTypes = [
      { value: 'default', name: 'All entries' },
      { value: 'date', name: 'Date' },
      { value: 'currency', name: 'Currency' },
    ];
  }

  ngOnInit(): void {
    console.log('totalEntries', this.totalEntries);
    this.getAllExpenses({ limit: this.totalEntries, offset: 0 });
  }

  /**
   * get all expenses for filterting
   * set up date Set and currency Set
   */
  private getAllExpenses({ limit, offset }) {
    this.expensesService
      .getExpenses({ limit, offset })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: result => {
          const { expenses } = result;

          this.expenses = expenses;
          expenses.forEach((ex: Expense) => {
            this.date.add(new Date(ex.date).getFullYear());
            this.currency.add(ex.amount.currency);
          });
        },
        error: err => this.toast.error(err.message),
      });
  }

  ngOnDestroy(): void {
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

  public onFilterValueChange = (ev: any) => {
    const {
      target: { value: filterValue },
    } = ev;

    let filteredExpenses = [];

    switch (this.selectedProp) {
      case 'currency': {
        filteredExpenses = this.expenses.filter((ex: Expense) => ex.amount.currency === filterValue);
        break;
      }

      case 'date': {
        filteredExpenses = this.expenses.filter((ex: Expense) => {
          const year = new Date(ex.date).getFullYear();
          return year === Number(filterValue);
        });
        break;
      }

      default: {
        break;
      }
    }

    this.store.dispatch([
      new SetFilterValue(filterValue),
      filteredExpenses.length ? new SetExpenses(filteredExpenses) : new GetExpenses(),
    ]);

    if (filteredExpenses.length) {
      // if there is an active filter
      // setting totaExpenses to 1 to force only one page in the pagination footer
      // also selecting the first page in case there was another one selected
      this.store.dispatch([new SetTotalExpenses(1), new SetCurrentPage(1)]);
    }
  };

  public onFilterTypeChange = (ev: any) => {
    const {
      target: { value: filterType },
    } = ev;

    this.store.dispatch(new SetFilterType(filterType));
    this.selectedProp = filterType;

    if (filterType !== 'default') {
      this.filterValues = Array.from(this[filterType].values()).map(val => ({ value: val, name: val }));
      this.filterValues.unshift({ value: 'default', name: 'All entries' });
    } else {
      this.filterValues = [];
    }
    this.store.dispatch(new GetExpenses());
  };
}
