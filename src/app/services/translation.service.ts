import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private http: HttpClient) {}

  getLanguageJSON(lang: string): Promise<any> {
    return this.http.get<any>(`/assets/i18n/${lang}.json`).toPromise();
  }
}
