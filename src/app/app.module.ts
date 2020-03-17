import { NgModule } from '@angular/core';
import { AppComponent } from './root/app.component';

import { components } from './app.components';
import { imports } from './app.imports';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [components, TranslatePipe],
  imports: [imports],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
