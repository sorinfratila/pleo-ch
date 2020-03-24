import { Expense } from '../models/Expense';
import { State, Action, StateContext, Selector, NgxsOnInit, NgxsSimpleChange } from '@ngxs/store';
import { ExpensesService } from '../services/expenses.service';
import { TranslationService } from '../services/translation.service';
import {
  FetchExpenses,
  SetFilterType,
  SetFilterValue,
  SetLanguageCode,
  SetCurrentPage,
  FetchLanguageJSON,
  SetTotalExpenses,
  SetExpenses,
  SetPages,
} from './expense.actions';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export class ExpensesStateModel {
  expenses: Expense[];
  totalExpenses: number;
  filter: {
    type: any[];
    value: any[];
  };
  langCode: string;
  currentPage: number;
  pages: number[];
}

@State<ExpensesStateModel>({
  name: 'expenses',
  defaults: {
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
  },
})
@Injectable()
export class ExpenseState implements NgxsOnInit {
  constructor(private expensesService: ExpensesService, private i18nService: TranslationService) {}
  @Selector()
  static getExpenses(state: ExpensesStateModel): Expense[] {
    return state.expenses;
  }

  @Selector()
  static getTotalExpenses(state: ExpensesStateModel): number {
    return state.totalExpenses;
  }

  @Selector()
  static getCurrentPage(state: ExpensesStateModel): number {
    return state.currentPage;
  }

  @Selector()
  static getFilterType(state: ExpensesStateModel): any[] {
    return state.filter.type;
  }

  @Selector()
  static getFilterValue(state: ExpensesStateModel): any[] {
    return state.filter.value;
  }

  @Selector()
  static getPages(state: ExpensesStateModel): number[] {
    return state.pages;
  }

  @Selector()
  static getLanguageCode(state: ExpensesStateModel) {
    return state.langCode;
  }

  public ngxsOnInit({ dispatch, setState, getState }: StateContext<ExpensesStateModel>): void {
    const localState = localStorage.getItem('state');
    const state = getState();

    if (localState) {
      // if we already saved a local state, get that state
      const savedState = JSON.parse(localState);
      setState({
        ...state,
        ...savedState,
      });
    } else {
      // initialize state and fetch languageJson

      dispatch([FetchExpenses, FetchLanguageJSON]);
    }
  }

  public ngxsOnChanges(change: NgxsSimpleChange) {
    if (change) {
      const { currentValue, firstChange } = change;
      if (!firstChange) {
        // saving state on every change except the first to localStorage for recovery
        localStorage.setItem('state', JSON.stringify(currentValue));
      }
    }
  }

  @Action(FetchExpenses)
  getExpenses({ patchState, dispatch }: StateContext<ExpensesStateModel>, action: FetchExpenses) {
    return this.expensesService.getExpenses(action.payload).pipe(
      map((getExpensesResponse: any) => {
        const { expenses, total } = getExpensesResponse;

        patchState({ expenses });
        dispatch(new SetTotalExpenses(total));
      }),
    );
  }

  @Action(SetPages)
  setPages({ patchState }: StateContext<ExpensesStateModel>, { pages }: SetPages) {
    patchState({
      pages,
    });
  }

  @Action(SetExpenses)
  setExpenses({ patchState }: StateContext<ExpensesStateModel>, { expenses }: SetExpenses) {
    patchState({ expenses });
  }

  @Action(SetTotalExpenses)
  setTotalExpenses({ patchState }: StateContext<ExpensesStateModel>, { total }: SetTotalExpenses) {
    patchState({ totalExpenses: total });
  }

  @Action(SetFilterType)
  setFilterType(ctx: StateContext<ExpensesStateModel>, { filterType }: SetFilterType) {
    const state = ctx.getState();
    ctx.patchState({
      filter: {
        ...state.filter,
        type: filterType,
      },
    });
  }

  @Action(SetFilterValue)
  setFilterValue({ getState, patchState }: StateContext<ExpensesStateModel>, { filterValue }: SetFilterValue) {
    const state = getState();
    patchState({
      filter: {
        ...state.filter,
        value: filterValue,
      },
    });
  }

  @Action(SetLanguageCode)
  setLanguageCode({ patchState, dispatch }: StateContext<ExpensesStateModel>, { langCode }: SetLanguageCode) {
    patchState({ langCode });

    return dispatch(new FetchLanguageJSON());
  }

  @Action(FetchLanguageJSON)
  async getLanguageJSON({ getState }: StateContext<ExpensesStateModel>) {
    const { langCode } = getState();
    const langObj = await this.i18nService.getLanguageJSON(langCode);
    this.i18nService.setLanguageJSON(langObj);
  }

  @Action(SetCurrentPage)
  setCurrentPage({ patchState }: StateContext<ExpensesStateModel>, { currentPage }: SetCurrentPage) {
    patchState({ currentPage });
  }
}
