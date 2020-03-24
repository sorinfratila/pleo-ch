import { TranslatePipe } from './translate.pipe';
import { TranslationService } from '../services/translation.service';
import { TestBed } from '@angular/core/testing';
describe('TranslatePipe', () => {
  let i18n: TranslationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslationService],
    });

    i18n = TestBed.inject(TranslationService);
  });

  it('create an instance', () => {
    const pipe = new TranslatePipe(i18n);
    expect(pipe).toBeTruthy();
  });
});
