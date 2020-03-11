import { NgModule } from "@angular/core";
import { AppComponent } from "./root/app.component";

import { components } from "./app.components";
import { imports } from "./app.imports";

@NgModule({
  declarations: [components],
  imports: [imports],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
