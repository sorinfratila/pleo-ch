import { Component, ChangeDetectionStrategy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Expense } from 'src/app/models/Expense';
import { Observable } from 'rxjs';
import { AddCommentDialogComponent } from 'src/app/dialogs/add-comment-dialog/add-comment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddImageComponent } from 'src/app/dialogs/add-image/add-image.component';
import { Store, Select } from '@ngxs/store';
import { SetLanguageCode, UpdateExpense } from 'src/app/store/expense.actions';
import { ExpenseState } from 'src/app/store/expense.state';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  /** used to keep track of window.innerWidth for responsiveness */
  innerWidth: number;

  /** to load the page again after language update */
  isLoading: boolean;

  /** columns array for the custom table */
  tableColumns: any[];

  /** languages array */
  langs: any[];

  /** observing the expenses from Store */
  @Select(ExpenseState.getExpenses)
  public expenses$: Observable<Expense[]>;

  /** observing the total expenses number */
  @Select(ExpenseState.getTotalExpenses)
  public totalExpenses$: Observable<number>;

  @Select(ExpenseState.getLanguageCode)
  public languageCode$: Observable<string>;

  constructor(private dialog: MatDialog, private store: Store, private CDR: ChangeDetectorRef) {
    this.innerWidth = window.innerWidth;
    this.langs = [
      { value: 'en', name: 'EN' },
      { value: 'ro', name: 'RO' },
    ];
    this.tableColumns = [
      { value: 'appFirst', name: 'First Name', width: 90 },
      { value: 'appLast', name: 'Last Name', width: 100 },
      { value: 'appValue', name: 'Value', width: 80 },
      { value: 'appCurrency', name: 'Currency', width: 70 },
      { value: 'appDate', name: 'Date', width: 85 },
      { value: 'appMerchant', name: 'Merchant', width: 100 },
      { value: 'appReceipts', name: 'Receipts', width: 120 },
      { value: 'appComment', name: 'Comment', width: 120 },
      { value: 'appCategory', name: 'Category', width: 60 },
      { value: 'addReceipt', name: null, width: 50 },
      { value: 'addComment', name: null, width: 50 },
    ];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  /**
   * @param expense - the expense to add the comment to
   * @param ev - the possible event if the methd call is comming from the Expense component
   */
  onAddComment = (expense: Expense, ev?: any) => {
    let isopen = false;
    if (ev) {
      const { ev: event, isOpen } = ev;
      event.stopPropagation();
      isopen = isOpen;
    }

    const dialogRef = this.dialog.open(AddCommentDialogComponent, {
      panelClass: 'dialog-container',
      backdropClass: 'backdrop-container',
      data: expense,
    });

    dialogRef.afterClosed().subscribe((res?: Expense) => {
      if (res) {
        res.isOpen = isopen;
        this.store.dispatch(new UpdateExpense(res));
      }
    });
  };

  /**
   * @param expense - the expense to add the receipt to
   * @param ev - the possible event if the methd call is comming from the Expense component
   */
  onAddReceipt = (expense: Expense, ev?: any) => {
    let isopen = false;
    if (ev) {
      const { ev: event, isOpen } = ev;
      event.stopPropagation();
      isopen = isOpen;
    }

    // const expense = this.expenses[index];
    const dialogRef = this.dialog.open(AddImageComponent, {
      panelClass: 'dialog-container',
      backdropClass: 'backdrop-container',
      data: expense,
    });

    dialogRef.afterClosed().subscribe((res?: Expense) => {
      if (res) {
        res.isOpen = isopen;
        this.store.dispatch(new UpdateExpense(res));
      }
    });
  };

  public onLanguageChange = (event: any) => {
    const {
      target: { value: langCode },
    } = event;

    this.store.dispatch(new SetLanguageCode(langCode));
    this.isLoading = true;

    /** setting timeout to ensure the page reloads with the new translations */
    setTimeout(() => {
      this.isLoading = false;
      this.CDR.detectChanges();
    }, 20);
  };
}
