import { NgModule } from '@angular/core';
import { AppComponent } from './root/app.component';

import { components } from './app.components';
import { imports } from './app.imports';
import { AccordionComponent } from './components/accordion/accordion.component';

@NgModule({
  declarations: [components, AccordionComponent],
  imports: [imports],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
