import { NgModule } from "@angular/core";
import { AppComponent } from "./root/app.component";

import { components } from "./app.components";
import { imports } from "./app.imports";
import { ExpenseComponent } from './components/expense/expense.component';

@NgModule({
  declarations: [components, ExpenseComponent],
  imports: [imports],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
