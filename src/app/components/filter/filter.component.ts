import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/Expense';
import { Select, Store } from '@ngxs/store';
import { ExpenseState } from 'src/app/store/expense.state';
import { GetExpenses, SetTotalExpenses, SetFilterValue, SetFilterType } from 'src/app/store/expense.actions';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input() totalEntries: number;
  @Output() filterChange = new EventEmitter<any>();

  destroy$: Subject<any>;

  expenses$: Subscription;
  filterValues: any;
  filterTypes: any[];
  date: Set<any>; // holds all the years found
  currency: Set<any>; // holds all the currencies found
  selectedProp: string; // used for notifying overview component which property is selected

  constructor(private expensesService: ExpensesService, private store: Store) {
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
    this.getAllExpenses({ limit: this.totalEntries, offset: 0 });
    // this.expenses$ = this.expensesService.getAllExpenses({ limit: this.totalEntries }).subscribe({
    //   next: result => {
    //     const { expenses } = result;
    //     // getting all the Years and all the currencies from all entries
    //     expenses.forEach((ex: Expense) => {
    //       this.date.add(new Date(ex.date).getFullYear());
    //       this.currency.add(ex.amount.currency);
    //     });
    //   },
    // });
  }

  private getAllExpenses({ limit, offset }) {
    this.store
      .dispatch(new GetExpenses({ limit, offset }))
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        const {
          expenses: { expenses },
        } = state;
        expenses.forEach((ex: Expense) => {
          this.date.add(new Date(ex.date).getFullYear());
          this.currency.add(ex.amount.currency);
        });
      });
  }

  ngOnDestroy(): void {
    if (this.expenses$) this.expenses$.unsubscribe();
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

  public onFilterValueChange = (ev: any) => {
    const {
      target: { value: filterValue },
    } = ev;

    this.store.dispatch(new SetFilterValue(filterValue));
    // this.filterChange.emit({ selectedProp: this.selectedProp, filter: value });
  };

  public onFilterTypeChange = (ev: any) => {
    const {
      target: { value: filterType },
    } = ev;

    this.store.dispatch(new SetFilterType(filterType));

    this.selectedProp = filterType;

    if (filterType !== 'default') {
      this.filterValues = Array.from(this[filterType].values()).map(val => {
        return { value: val, name: val };
      });
      this.filterValues.unshift({ value: 'default', name: 'All entries' });
    } else {
      this.filterValues = [];
      this.filterChange.emit({ selectedProp: this.selectedProp, filter: filterType });
    }
  };
}
