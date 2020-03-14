import { NgModule } from '@angular/core';
import { AppComponent } from './root/app.component';

import { components } from './app.components';
import { imports } from './app.imports';
import { AccordionComponent } from './components/accordion/accordion.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { FilterComponent } from './components/filter/filter.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [components, AccordionComponent, ThumbnailComponent, FilterComponent, PaginationComponent],
  imports: [imports],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
