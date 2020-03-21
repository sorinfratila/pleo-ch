import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxsModule } from '@ngxs/store';
import { ExpenseState } from './store/expense.state';
import { environment } from 'src/environments/environment';

export const imports = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  HttpClientModule,
  MatDialogModule,
  ToastrModule.forRoot(),
  FormsModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  NgxsModule.forRoot([ExpenseState], {
    developmentMode: !environment.production,
    selectorOptions: {
      suppressErrors: false,
    },
  }),
];
