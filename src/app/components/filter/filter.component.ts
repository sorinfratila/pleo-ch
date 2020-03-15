import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/Expense';

export type DIRECTION = 'ASC' | 'DESC';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input() totalEntries: number;
  @Output() filterChange = new EventEmitter<any>();
  expenses$: Subscription;
  filterArray: any;
  properties: any[];
  date: Set<any>; // holds all the years found
  currency: Set<any>; // holds all the currencies found
  selectedProp: string; // used for notifying overview component which property is selected

  constructor(private expensesService: ExpensesService) {
    this.date = new Set();
    this.currency = new Set();
    this.filterArray = [];
    this.properties = [
      { value: 'default', name: 'All entries' },
      { value: 'date', name: 'Date' },
      { value: 'currency', name: 'Currency' },
    ];
  }

  ngOnInit(): void {
    this.expenses$ = this.expensesService.getAllExpenses({ limit: this.totalEntries }).subscribe({
      next: result => {
        const { expenses } = result;
        // getting all the Years and all the currencies from all entries
        expenses.forEach((ex: Expense) => {
          this.date.add(new Date(ex.date).getFullYear());
          this.currency.add(ex.amount.currency);
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.expenses$) this.expenses$.unsubscribe();
  }

  public onFilterChange = (ev: any) => {
    const {
      target: { value },
    } = ev;
    this.filterChange.emit({ selectedProp: this.selectedProp, filter: value });
  };

  public onPropertyChange = (ev: any) => {
    const {
      target: { value },
    } = ev;
    this.selectedProp = value;
    const newArray = [];

    if (value !== 'default') {
      Array.from(this[value].values()).forEach(val => {
        newArray.push({ value: val, name: val });
      });
      this.filterArray = newArray;
      this.filterArray.unshift({ value: 'default', name: 'All entries' });
    } else {
      this.filterArray = [];
      this.filterChange.emit({ selectedProp: this.selectedProp, filter: value });
    }
  };
}
