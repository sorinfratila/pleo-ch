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

  public setLanguageJSON(payload: any): void {
    console.log('in i18n service - translations OBJ', payload);
    this.translations = payload;
  }

  public getLangObj(): any {
    return this.translations;
  }

  /**
   * translate based on key param and fallback
   * @param key translations object key that is used to get the value in each language
   * @param fallback the default value in case key is missing from the translations object
   */
  public tr(key: string, fallback: string): string {
    let translation = fallback;

    if (this.translations && this.translations[key]) {
      translation = this.translations[key];
    }

    return translation;
  }
}
