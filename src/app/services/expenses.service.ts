import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { Expense } from '../models/Expense';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  baseURL: string;
  private expenseList: Expense[] = [];
  // private expensesUpdates = new BehaviorSubject<Expense[]>([]);

  constructor(private http: HttpClient, private toast: ToastrService) {
    this.baseURL = environment.rootURL;
  }

  // public getExpensesUpdates(): Observable<Expense[]> {
  //   return this.expensesUpdates.asObservable();
  // }

  public getExpenseList(): Expense[] {
    return this.expenseList;
  }

  public setExpenseList(newExpenseList: Expense[]): void {
    this.expenseList = newExpenseList;
    // this.expensesUpdates.next(newExpenseList);
  }

  public getExpenses(obj?: any): Observable<any> {
    const link = obj ? `?limit=${obj.limit}&offset=${obj.offset}` : '';

    console.log('link', link);
    return this.http.get(`${this.baseURL}/expenses${link}`).pipe(catchError(this.errorHandler));
  }

  public getAllExpenses({ limit }): Observable<any> {
    return this.http.get(`${this.baseURL}/expenses?limit=${limit}&offset=${0}`).pipe(catchError(this.errorHandler));
  }

  public uploadReceipt(receipt: File, expenseId: string): Observable<any> {
    const formData = new FormData();

    formData.append('receipt', receipt);

    return this.http
      .post(`${this.baseURL}/expenses/${expenseId}/receipts`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.errorHandler));
  }

  public uploadComment(comment: string, expenseId: string): Observable<any> {
    const data = { comment };
    return this.http.post(`${this.baseURL}/expenses/${expenseId}`, data).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse) {
    let errMsg = '';
    // client
    if (error.error instanceof ErrorEvent) errMsg = error.error.message;
    // server
    else errMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    return throwError(errMsg);
  }
}