import { Expense } from '../models/Expense';

export enum ActionsType {
  ADD_EXPENSE_COMMENT = '[Expense Comment] add',
  ADD_EXPENSE_RECEIPT = '[Expense Receipt] add',
  SET_EXPENSE_FILTER = '[Expense Filter] set filter',
  TOGGLE_EXPENSE = '[Expense] toggle',
}

export class AddComment {
  public static readonly type = ActionsType.ADD_EXPENSE_COMMENT;
  constructor(public comment: string) {}
}

export class AddReceipt {
  public static readonly type = ActionsType.ADD_EXPENSE_RECEIPT;
  constructor(public url: string) {}
}

export class SetFilter {
  public static readonly type = ActionsType.SET_EXPENSE_FILTER;
  constructor(public filter: string) {}
}

export class ToggleExpense {
  public static readonly type = ActionsType.TOGGLE_EXPENSE;
  constructor() {}
}
