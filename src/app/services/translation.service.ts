import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  /** keeps the translations object */
  translations: any;

  constructor(private http: HttpClient) {
    this.translations = Object.create(null); // making an empty object
  }

  /**
   * gets the local JSON file associated with a language code
   * @param langCode the language code to change to; eg: 'en'
   */
  public getLanguageJSON(langCode: string = 'en'): Promise<any> {
    return this.http.get<any>(`/assets/i18n/${langCode}.json`).toPromise();
  }

  /**
   * setting the new translations object every time the language is updated
   * @param payload the new translations object
   */
  public setLanguageJSON(payload: any): void {
    this.translations = payload;
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
