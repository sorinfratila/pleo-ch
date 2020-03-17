import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pleo';

  constructor(private i18n: TranslationService, private toast: ToastrService) {}

  ngOnInit(): void {
    this.getDefaultLang();
  }

  public async getDefaultLang(lang: string = 'en') {
    try {
      const data = await this.i18n.getLanguageJSON(lang);
      this.i18n.setLangObj(data, lang);
      console.log('data', data);
    } catch (e) {
      this.toast.error(e);
    }
  }

  // ngOnDestroy(): void {}
}
