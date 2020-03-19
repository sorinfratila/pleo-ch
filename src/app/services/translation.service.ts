import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  translations: any;
  langCode: string;
  constructor(private http: HttpClient) {
    this.translations = Object.create(null);
    this.langCode = 'en'; // default
  }

  getLanguageJSON(lang: string): Promise<any> {
    return this.http.get<any>(`/assets/i18n/${lang}.json`).toPromise();
  }

  public setLangObj(lang: any, code: string): void {
    this.translations = lang;
    this.langCode = code;
  }

  public getLangObj(): any {
    return this.translations;
  }

  public tr(key: string, fallback: string): string {
    let translation = fallback;

    if (this.translations[key]) {
      translation = this.translations[key];
    }

    return translation;
  }
}
