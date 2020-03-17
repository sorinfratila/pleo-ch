import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'tr',
})
export class TranslatePipe implements PipeTransform {
  constructor(public i18n: TranslationService) {}

  transform(fallback: any, key: string): string {
    return this.i18n.tr(key, fallback);
  }
}
