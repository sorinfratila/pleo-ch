import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/Expense';
import { Store, Select } from '@ngxs/store';
import {
  FetchExpenses,
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

  pages: number[]; // the pages array for pagination
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
    this.selectedFilterType = this.getSelectedFilterType();

    // setting the pages on first init
    if (this.selectedFilterType === 'default') {
      const pages = this.getPagesArray(this.totalEntries);
      this.store.dispatch(new SetPages(pages));
    }
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
  private getSelectedFilterType = () => {
    return this.store.selectSnapshot(state => {
      const {
        expenses: {
          filter: { type },
        },
      } = state;

      const selected = type.find((ty: any) => ty.selected);
      if (selected) return selected.value;
      return 'default';
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
        // if the default filterValue is selected
        // getting the totalExpenses to reset the number of pages
        // dispatching getExpenses at the same time
        const pages = this.getPagesFromSnapshot();
        this.store.dispatch([new FetchExpenses(), new SetPages(pages)]);
      } else {
        // if there is an active filter
        // setting totaExpenses to 1 to force only one page in the pagination footer
        // also selecting the first page in case there was another one selected
        this.store.dispatch([new SetPages([1]), new SetCurrentPage(1), new SetExpenses(filteredExpenses)]);
      }
    });
  };

  /**
   * generate pages array based on totalExpenses state snapshot
   */
  private getPagesFromSnapshot = () => {
    return this.store.selectSnapshot(state => {
      const {
        expenses: { totalExpenses },
      } = state;
      const pages = this.getPagesArray(totalExpenses);

      return pages;
    });
  };

  /**
   * calculates pages array based on the totalExpenses param from state
   * @param totalExpenses total entries in the BE
   */
  private getPagesArray(totalExpenses: number): number[] {
    const pages = [];
    const pagesCount = Math.ceil(totalExpenses / 25);
    for (let i = 1; i <= pagesCount; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * generate filteredExpenses array used to show the filtered results instead of normal results
   */
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
      }

      newFilterValues.unshift({ value: 'default', name: 'All entries', selected: true }); // prepend the default values for the filter

      // calculating pages from totalExpenses in state
      const pages = this.getPagesFromSnapshot();

      this.store.dispatch([
        new FetchExpenses(),
        new SetPages(pages),
        new SetFilterType(newFilterTypes),
        new SetFilterValue(newFilterValues),
        new SetCurrentPage(1),
      ]);
    });
  };
}
