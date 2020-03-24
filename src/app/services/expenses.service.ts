import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = environment.rootURL;
  }

  /**
   * route for getting the expenses from BE
   * @param payload limit and offset values for pagination
   */
  public getExpenses(payload?: any): Observable<any> {
    const link = payload ? `?limit=${payload.limit}&offset=${payload.offset}` : '';
    return this.http.get(`${this.baseURL}/expenses${link}`).pipe(catchError(this.errorHandler));
  }

  /**
   * uploads receipt for the specific expense
   * @param payload receipt image data and the expense Id to upload to
   */
  public uploadReceipt(payload: any): Observable<any> {
    const { expenseId, receipt } = payload;
    const formData = new FormData();

    formData.append('receipt', receipt);

    return this.http
      .post(`${this.baseURL}/expenses/${expenseId}/receipts`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.errorHandler));
  }

  /**
   * uploads comment for the specific expense
   * @param payload comment and the expense Id to upload to
   */
  public uploadComment(payload: any): Observable<any> {
    const { comment, expenseId } = payload;
    const data = { comment };
    return this.http.post(`${this.baseURL}/expenses/${expenseId}`, data).pipe(catchError(this.errorHandler));
  }

  /**
   * re throw errors caught while performing http calls in this service
   * @param error http response error
   */
  private errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
