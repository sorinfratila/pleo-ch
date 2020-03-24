import { TestBed } from '@angular/core/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { ExpenseState } from './expense.state';
import {
  FetchExpenses,
  SetPages,
  SetExpenses,
  SetTotalExpenses,
  SetFilterType,
  SetFilterValue,
  SetLanguageCode,
  SetCurrentPage,
} from './expense.actions';
import { HttpClientModule } from '@angular/common/http';

export const DEFAULT_STATE = {
  expenses: [],
  totalExpenses: 0,
  filter: {
    type: [
      { value: 'default', name: 'All entries', selected: true },
      { value: 'date', name: 'Date', selected: false },
      { value: 'currency', name: 'Currency', selected: false },
    ],
    value: [{ value: 'default', name: 'All entries', selected: true }],
  },
  langCode: 'en',
  currentPage: 1,
  pages: [1],
};

describe('Expenses State Testing', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ExpenseState]), HttpClientModule],
    });

    store = TestBed.inject(Store);
    store.reset(DEFAULT_STATE);
  });

  it('it gets expenses and sets the totalExpenses', async () => {
    await store.dispatch(new FetchExpenses()).toPromise();

    const { totalExpenses, expenses } = store.selectSnapshot(state => state.expenses);
    expect(totalExpenses).toEqual(168);
    expect(expenses.length).toEqual(25);
  });

  it('it sets the pages array', async () => {
    await store.dispatch(new SetPages([1, 2, 3])).toPromise();

    const pages = store.selectSnapshot(state => state.expenses.pages);
    expect(pages).toEqual([1, 2, 3]);
  });

  it('it sets the expenses array to a predefined array of expenses', async () => {
    const expensesArray = makeExpenses(20);
    await store.dispatch(new SetExpenses(expensesArray)).toPromise();

    const expenses = store.selectSnapshot(state => state.expenses.expenses);
    expensesArray.forEach(ex => {
      expect(expenses).toContain(ex);
    });
  });

  it('it sets an arbitrary totalExpenses number', async () => {
    await store.dispatch(new SetTotalExpenses(1345)).toPromise();

    const totalExpenses = store.selectSnapshot(state => state.expenses.totalExpenses);
    expect(totalExpenses).toEqual(1345);
  });

  it('it sets the filterType to a new array of objects', async () => {
    await store
      .dispatch(
        new SetFilterType([
          { value: 'default', name: 'All entries', selected: true },
          { value: 'date', name: 'Date', selected: false },
          { value: 'currency', name: 'Currency', selected: false },
        ]),
      )
      .toPromise();

    const filterType = store.selectSnapshot(state => state.expenses.filter.type);
    expect(filterType).toContain({ value: 'default', name: 'All entries', selected: true });
    expect(filterType).toContain({ value: 'date', name: 'Date', selected: false });
    expect(filterType).toContain({ value: 'currency', name: 'Currency', selected: false });
  });

  it('it sets the filterValue to a new array of objects', async () => {
    await store.dispatch(new SetFilterValue([{ value: 'default', name: 'All entries', selected: true }])).toPromise();

    const filterValue = store.selectSnapshot(state => state.expenses.filter.value);
    expect(filterValue).toContain({ value: 'default', name: 'All entries', selected: true });
  });

  it('it sets the filterValue to a new array of objects', async () => {
    const filterValuesArray = makeFilterValues(100);
    await store.dispatch(new SetFilterValue(filterValuesArray)).toPromise();

    const filterValue = store.selectSnapshot(state => state.expenses.filter.value);
    filterValue.forEach(val => {
      expect(filterValue).toContain(val);
    });
  });

  it('it sets the language code to "en"', async () => {
    await store.dispatch(new SetLanguageCode('en')).toPromise();

    const langCode = store.selectSnapshot(state => state.expenses.langCode);
    expect(langCode).toBe('en');
  });

  it('it sets the language code to "ro"', async () => {
    await store.dispatch(new SetLanguageCode('ro')).toPromise();

    const langCode = store.selectSnapshot(state => state.expenses.langCode);
    expect(langCode).toBe('ro');
  });

  it('it sets the current page to the currently selected page in order highlight selection', async () => {
    await store.dispatch(new SetCurrentPage(3)).toPromise();

    const currentPage = store.selectSnapshot(state => state.expenses.currentPage);
    expect(currentPage).toBe(3);
  });
});

const makeFilterValues = (amount: number) => {
  const filterValues = [];
  for (let i = 0; i < amount; i++) {
    filterValues.push({
      value: `VALUE-${i}`,
      name: `NAME-${i}`,
      selected: !!i,
    });
  }

  return filterValues;
};

const makeExpenses = (amount: number) => {
  const expenses = [];
  for (let i = 0; i < amount; i++) {
    expenses.push({
      id: String(i),
      amount: {
        value: '1854.99',
        currency: 'EUR',
      },
      date: new Date('2018-09-10T02:11:29.184Z'),
      merchant: 'KAGE',
      receipts: [],
      comment: '',
      category: '',
      user: {
        first: 'Vickie',
        last: 'Lee',
        email: 'vickie.lee@pleo.io',
      },
      index: i,
    });
  }

  return expenses;
};
