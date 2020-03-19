import { Expense } from '../models/Expense';
import { State, Action, StateContext } from '@ngxs/store';
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
  SetLanguage,
} from './expense.actions';
import { tap, mergeMap } from 'rxjs/operators';

export class ExpensesStateModel {
  expenses: Expense[];
  filter: {
    type: string;
    value: string;
  };
  language: string;
  totalExpenses: number;
}

@State<ExpensesStateModel>({
  name: 'expenses',
  defaults: {
    expenses: [],
    totalExpenses: 0,
    filter: {
      // TODO: need to change this to arrays
      type: 'default',
      value: 'default',
    },
    language: 'en',
  },
})
export class ExpenseState {
  constructor(private expensesService: ExpensesService, private i18nService: TranslationService) {}

  @Action(GetExpenses)
  getExpenses(ctx: StateContext<ExpensesStateModel>, action: GetExpenses) {
    return this.expensesService.getExpenses(action.payload).pipe(
      tap((getExpensesResponse: any) => {
        // const state = ctx.getState();
        const { expenses, total } = getExpensesResponse;
        expenses.map((expense: Expense) => {
          // patching each expense with isOpen to handle expense toggling
          return {
            ...expense,
            isOpen: false,
          };
        });

        ctx.patchState({
          expenses,
          totalExpenses: total,
        });
      }),
    );
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
  setFilterType(ctx: StateContext<ExpensesStateModel>, action: SetFilterType) {
    const state = ctx.getState();
    ctx.patchState({
      filter: {
        ...state.filter,
        type: action.filterType,
      },
    });
  }

  @Action(SetFilterValue)
  setFilterValue(ctx: StateContext<ExpensesStateModel>, action: SetFilterValue) {
    const state = ctx.getState();
    ctx.patchState({
      filter: {
        ...state.filter,
        value: action.filterValue,
      },
    });
  }

  @Action(SetLanguage)
  setLanguage(ctx: StateContext<ExpensesStateModel>, action: SetLanguage) {
    const state = ctx.getState();
    ctx.patchState({
      language: action.lang,
    });
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
