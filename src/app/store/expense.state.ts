import { Expense } from '../models/Expense';
import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { ExpensesService } from '../services/expenses.service';
import { TranslationService } from '../services/translation.service';
import {
  GetExpenses,
  AddComment,
  AddReceipt,
  SetFilterType,
  SetFilterValue,
  ToggleExpense,
  UpdateExpense,
  SetLanguageCode,
  SetCurrentPage,
  GetLanguageJSON,
  SetTotalExpenses,
} from './expense.actions';
import { tap, mergeMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export class ExpensesStateModel {
  expenses: Expense[];
  filter: {
    type: string;
    value: string;
  };
  langCode: string;
  totalExpenses: number;
  currentPage: number;
}

@State<ExpensesStateModel>({
  name: 'expenses',
  defaults: {
    expenses: [],
    totalExpenses: 0,
    filter: {
      type: 'default',
      value: 'default',
    },
    langCode: 'en',
    currentPage: 1,
  },
})
@Injectable()
export class ExpenseState implements NgxsOnInit {
  constructor(
    private expensesService: ExpensesService,
    private i18nService: TranslationService,
    private toast: ToastrService,
  ) {}
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
  static getFilterType(state: ExpensesStateModel): string {
    return state.filter.type;
  }

  @Selector()
  static getFilterValue(state: ExpensesStateModel): any[] | string {
    if (state.filter.value.length === 0) return 'No filter type selected';
    return state.filter.value;
  }

  @Selector()
  static getLanguage(state: ExpensesStateModel) {
    return state.langCode;
  }

  public ngxsOnInit({ dispatch }: StateContext<ExpensesStateModel>): void {
    dispatch([GetExpenses, GetLanguageJSON]);
  }

  @Action(GetExpenses)
  getExpenses(ctx: StateContext<ExpensesStateModel>, action: GetExpenses) {
    return this.expensesService.getExpenses(action.payload).pipe(
      map((getExpensesResponse: any) => {
        const { expenses, total } = getExpensesResponse;
        const newExpenses = expenses.map((expense: Expense) => {
          // patching each expense with isOpen to handle expense toggling
          return {
            ...expense,
            isOpen: false,
          };
        });

        ctx.patchState({ expenses: newExpenses });
        ctx.dispatch(new SetTotalExpenses(total));
      }),
    );
  }

  @Action(SetTotalExpenses)
  setTotalExpenses({ patchState }: StateContext<ExpensesStateModel>, { total }: SetTotalExpenses) {
    patchState({ totalExpenses: total });
  }

  @Action(AddComment)
  addComment(action: AddComment) {
    return this.expensesService.uploadComment(action.payload);
  }

  @Action(AddReceipt)
  addReceipt(action: AddReceipt) {
    return this.expensesService.uploadReceipt(action.payload);
  }

  @Action(UpdateExpense)
  updateExpense(ctx: StateContext<ExpensesStateModel>, action: UpdateExpense) {
    const { expenses } = ctx.getState();
    const {
      expense: { id },
      expense,
    } = action;
    const expenseToUpdateIndex = expenses.findIndex((ex: Expense) => ex.id === id);
    if (expenseToUpdateIndex !== -1) {
      const expensesCopy = expenses;
      expensesCopy.splice(expenseToUpdateIndex, 1, expense);
      ctx.patchState({
        expenses: expensesCopy,
      });
    }
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
  SetLanguageCode({ patchState, dispatch }: StateContext<ExpensesStateModel>, { lang }: SetLanguageCode) {
    patchState({ langCode: lang });

    return dispatch(new GetLanguageJSON());
  }

  @Action(GetLanguageJSON)
  async getLanguageJSON({ getState }: StateContext<ExpensesStateModel>) {
    const { langCode } = getState();
    try {
      const langObj = await this.i18nService.getLanguageJSON(langCode);
      this.i18nService.setLanguageJSON(langObj);
    } catch (e) {
      this.toast.error(e.message);
    }
  }

  @Action(SetCurrentPage)
  setCurrentPage({ patchState }: StateContext<ExpensesStateModel>, { currentPage }: SetCurrentPage) {
    patchState({ currentPage });
  }

  // @Action(ToggleExpense)
  // toggleExpense(ctx: StateContext<ExpensesStateModel>, action: ToggleExpense) {
  //   const { expenses } = ctx.getState();
  //   const {
  //     expense: { id },
  //   } = action;

  //   const expenseToUpdateIndex = expenses.findIndex((ex: Expense) => ex.id === id);
  //   if (expenseToUpdateIndex !== -1) {
  //     const expensesCopy = expenses;
  //     expensesCopy.splice(expenseToUpdateIndex, 1, expense);
  //     ctx.patchState({
  //       expenses: expensesCopy,
  //     });
  //   }
  // }
}
