import { Expense } from '../models/Expense';

export enum ActionsType {
  FETCH_EXPENSES = '[Expense] FetchExpenses',
  FETCH_LANGUAGE_JSON = '[Expense] FetchLanguageJSON',
  SET_EXPENSES = '[Expense] SetExpenses',
  SET_PAGES = '[Expense], SetPages',
  SET_EXPENSE_FILTER_TYPE = '[Expense] SetFilterType',
  SET_EXPENSE_FILTER_VALUE = '[Expense] SetFilterValue',
  SET_LANGUAGE_CODE = '[Expense] SetLanguageCode',
  SET_CURRENT_PAGE = '[Expense] SetCurrentPage',
  SET_TOTAL_EXPENSES = '[Expense] SetTotalExpenses',
}

export class FetchExpenses {
  public static readonly type = ActionsType.FETCH_EXPENSES;
  constructor(public payload: { limit: number; offset: number } = { limit: 25, offset: 0 }) {}
}

export class SetExpenses {
  public static readonly type = ActionsType.SET_EXPENSES;
  constructor(public expenses: Expense[]) {}
}

export class SetPages {
  public static readonly type = ActionsType.SET_PAGES;
  constructor(public pages: number[]) {}
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

export class FetchLanguageJSON {
  public static readonly type = ActionsType.FETCH_LANGUAGE_JSON;
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
