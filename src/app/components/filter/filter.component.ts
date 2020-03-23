import { Component, OnInit, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/Expense';
import { Store, Select } from '@ngxs/store';
import {
  GetExpenses,
  SetFilterValue,
  SetFilterType,
  SetExpenses,
  SetCurrentPage,
  SetPages,
} from 'src/app/store/expense.actions';
import { takeUntil, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ExpenseState } from 'src/app/store/expense.state';

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

  pages: number[];
  date: Set<any>; // holds all the years found in DB expenses
  currency: Set<any>; // holds all the currencies found in DB expenses
  selectedFilterType: string; // keeps track in component which filter is selected

  /** observing the filterType to preselect in case of page change/page refresh */
  @Select(ExpenseState.getFilterType)
  public filterType$: Observable<any[]>;

  /** observing the filterType to preselect in case of page change/page refresh */
  @Select(ExpenseState.getFilterValue)
  public filterValue$: Observable<any[]>;

  constructor(private store: Store, private expensesService: ExpensesService, private toast: ToastrService) {
    this.destroy$ = new Subject<any>();
    this.date = new Set();
    this.currency = new Set();
    this.pages = [];
  }

  ngOnInit(): void {
    this.getAllExpenses({ limit: this.totalEntries, offset: 0 });
    this.setSelectedFilterType();
  }

  ngOnDestroy(): void {
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

  /**
   * getting the current selection for the filterType to initialize the selectedFilterType prop
   */
  private setSelectedFilterType = () => {
    this.store.selectSnapshot(state => {
      const {
        expenses: {
          filter: { type },
        },
      } = state;

      const selected = type.find((ty: any) => ty.selected);
      if (selected) this.selectedFilterType = selected.value;
    });
  };

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

  /**
   * on every change in the filter value, update the filteredExpenses array
   * also dispatching actions to handle all the state updates
   * filter values are dynamically generated
   */
  public onFilterValueChange = (ev?: any) => {
    const {
      target: { value: filterValue },
    } = ev;
    const filteredExpenses = this.getFilteredExpenses(this.selectedFilterType, filterValue);
    const comparisonValue = this.selectedFilterType === 'currency' ? filterValue : Number(filterValue);

    this.filterValue$.pipe(take(1)).subscribe(filterValues => {
      const newFilterValues = filterValues.map(filter => {
        if (filter.value === comparisonValue) {
          return { ...filter, selected: true };
        }

        return { ...filter, selected: false };
      });

      this.store.dispatch(new SetFilterValue(newFilterValues));

      if (filterValue === 'default') {
        this.store.dispatch(new GetExpenses());
      } else {
        // if there is an active filter
        // setting totaExpenses to 1 to force only one page in the pagination footer
        // also selecting the first page in case there was another one selected
        this.store.dispatch([new SetPages([1]), new SetCurrentPage(1), new SetExpenses(filteredExpenses)]);
      }
    });
  };

  private getFilteredExpenses = (selectedFilterType: string, selectedFilterValue: string) => {
    switch (selectedFilterType) {
      case 'currency': {
        return this.expenses.filter((ex: Expense) => ex.amount.currency === selectedFilterValue);
      }

      case 'date': {
        return this.expenses.filter((ex: Expense) => {
          const year = new Date(ex.date).getFullYear();
          return year === Number(selectedFilterValue);
        });
      }

      default: {
        return [];
      }
    }
  };

  /**
   * handle logic for when changing the filter type - eg: 'default', 'date' or 'currency'
   * these filters are static
   */
  public onFilterTypeChange = (ev: any) => {
    const {
      target: { value: filterType },
    } = ev;
    let newFilterValues = [];

    this.selectedFilterType = filterType;

    this.filterType$.pipe(take(1)).subscribe(filterTypes => {
      const newFilterTypes = filterTypes.map(filter => {
        if (filter.value === filterType) {
          return { ...filter, selected: true };
        }

        return { ...filter, selected: false };
      });

      if (filterType !== 'default') {
        newFilterValues = Array.from(this[filterType].values()).map(val => ({
          value: val,
          name: val,
          selected: false,
        }));
      } else {
        //
        this.store.selectSnapshot(state => {
          const {
            expenses: { totalExpenses },
          } = state;
          const pages = this.getPagesArray(totalExpenses);

          this.store.dispatch(new SetPages(pages));
        });
      }

      newFilterValues.unshift({ value: 'default', name: 'All entries', selected: true });
      this.store.dispatch([
        new SetFilterType(newFilterTypes),
        new SetFilterValue(newFilterValues),
        new GetExpenses(),
        new SetCurrentPage(1),
      ]);
    });
  };

  /**
   * calculates pages array based on the current totalExpenses saved in state
   * @param totalExpenses total from BE
   */
  private getPagesArray(totalExpenses: number): number[] {
    const pages = [];
    const pagesCount = Math.ceil(totalExpenses / 25);
    for (let i = 1; i <= pagesCount; i++) {
      pages.push(i);
    }

    return pages;
  }
}
