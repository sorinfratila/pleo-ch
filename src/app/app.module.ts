import { NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './root/app.component';

import { components } from './app.components';
import { imports } from './app.imports';
import { pipes } from './app.pipes';
import { MyErrorHandler } from 'src/utils/global-error-handler';

@NgModule({
  declarations: [components, pipes],
  imports: [imports],
  providers: [
    {
      provide: ErrorHandler,
      useClass: MyErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
