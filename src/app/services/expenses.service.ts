import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = environment.rootURL;
  }

  getExpenses(): Observable<any> {
    return this.http.get(`${this.baseURL}/expenses`);
  }
}
