import { Expense } from '../models/Expense';

export enum ActionsType {
  GET_EXPENSES = '[Expense] GetExpenses',
  SET_EXPENSES = '[Expense] SetExpenses',
  GET_LANGUAGE_JSON = '[Expense] GetLanguageJSON',
  SET_EXPENSE_FILTER_TYPE = '[Expense] SetFilterType',
  SET_EXPENSE_FILTER_VALUE = '[Expense] SetFilterValue',
  SET_LANGUAGE_CODE = '[Expense] SetLanguageCode',
  SET_CURRENT_PAGE = '[Expense] SetCurrentPage',
  SET_TOTAL_EXPENSES = '[Expense] SetTotalExpenses',
}

export class GetExpenses {
  public static readonly type = ActionsType.GET_EXPENSES;
  constructor(public payload: { limit: number; offset: number } = { limit: 25, offset: 0 }) {}
}

export class SetExpenses {
  public static readonly type = ActionsType.SET_EXPENSES;
  constructor(public expenses: Expense[]) {}
}

export class SetFilterType {
  public static readonly type = ActionsType.SET_EXPENSE_FILTER_TYPE;
  constructor(public filterType: any[]) {}
}

export class SetFilterValue {
  public static readonly type = ActionsType.SET_EXPENSE_FILTER_VALUE;
  constructor(public filterValue: any[]) {}
}

export class SetLanguageCode {
  public static readonly type = ActionsType.SET_LANGUAGE_CODE;
  constructor(public langCode: string) {}
}

export class GetLanguageJSON {
  public static readonly type = ActionsType.GET_LANGUAGE_JSON;
  constructor() {}
}

export class SetCurrentPage {
  public static readonly type = ActionsType.SET_CURRENT_PAGE;
  constructor(public currentPage: number) {}
}

export class SetTotalExpenses {
  public static readonly type = ActionsType.SET_TOTAL_EXPENSES;
  constructor(public total: number) {}
}
