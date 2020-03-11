import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
MatDialogModule;
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  imports: [MatDialogModule, MatProgressSpinnerModule, MatTooltipModule],
  exports: [MatDialogModule, MatProgressSpinnerModule, MatTooltipModule]
})
export class MaterialModule {}
