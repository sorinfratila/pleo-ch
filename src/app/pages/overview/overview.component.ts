import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { Expense } from 'src/app/models/Expense';
import { Subscription, Subject, Observable } from 'rxjs';
import { takeUntil, take, first, map, tap, withLatestFrom } from 'rxjs/operators';
import { ExpensesService } from 'src/app/services/expenses.service';
import { ToastrService } from 'ngx-toastr';
import { AddCommentDialogComponent } from 'src/app/dialogs/add-comment-dialog/add-comment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddImageComponent } from 'src/app/dialogs/add-image/add-image.component';
import { TranslationService } from 'src/app/services/translation.service';
import { Store, Select } from '@ngxs/store';
import { GetExpenses, SetCurrentPage, GetLanguageJSON, SetLanguageCode } from 'src/app/store/expense.actions';
import { ExpensesStateModel, ExpenseState } from 'src/app/store/expense.state';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<any>();
  filteredExpenses$: Subscription;
  expenses: Expense[] = [];
  totalEntries: number;
  nrOfPages: any;
  filter: string;
  innerWidth: number;
  isLoading: boolean;
  tableColumns: any[];
  langs: any[];

  @Select(ExpenseState.getExpenses)
  public expenses$: Observable<Expense[]>;

  @Select(ExpenseState.getTotalExpenses)
  public totalExpenses$: Observable<number>;

  @Select(ExpenseState.getCurrentPage)
  public pagesCount$: Observable<number>;

  public expens$: Observable<Expense[]>;

  constructor(
    private dialog: MatDialog,
    private expensesService: ExpensesService,
    private toast: ToastrService,
    private CDR: ChangeDetectorRef,
    private i18n: TranslationService,
    private store: Store,
  ) {
    this.innerWidth = window.innerWidth;
    this.totalEntries = 0;
    this.nrOfPages = { amount: 0 };
    this.filter = 'default';
    // this.isLoading = true;
    this.langs = [
      { value: 'en', name: 'EN' },
      { value: 'ro', name: 'RO' },
    ];
    this.tableColumns = [
      { value: 'appFirst', name: 'First Name', width: 90 },
      { value: 'appLast', name: 'Last Name', width: 100 },
      { value: 'appDate', name: 'Date', width: 85 },
      { value: 'appValue', name: 'Value', width: 80 },
      { value: 'appCurrency', name: 'Currency', width: 70 },
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

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

  // private getContent({ limit, offset }) {
  //   this.store
  //     .dispatch(new GetExpenses({ limit, offset }))
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(state => {
  //       // this.expenses =
  //     });
  // }

  /**
   *
   * @param obj contains the limit and offset props for pagination
   */
  // private subscribeToExpenses(obj?: any) {
  //   this.expenses$ = this.expensesService
  //     .getExpenses(obj)
  //     .pipe(first())
  //     .subscribe({
  //       next: (result: any) => {
  //         const { total, expenses } = result;
  //         this.totalEntries = total;
  //         this.nrOfPages = { amount: total };
  //         this.expenses = this.appendProp(expenses);

  //         this.CDR.detectChanges();
  //       },
  //       error: err => this.toast.error(err),
  //     });
  // }

  // add isOpen prop to the expenses for accordion control
  private appendProp = (list: Expense[]) => {
    return list.map((exp: Expense) => {
      return { ...exp, isOpen: false };
    });
  };

  public onFilterChange = (obj: any) => {
    const { filter, selectedProp } = obj;
    this.filter = filter;
    if (filter !== 'default') {
      // this.unsubscribeExpense.next();
      // this.unsubscribeExpense.complete();
      this.filteredExpenses$ = this.expensesService
        .getAllExpenses({ limit: this.totalEntries })
        .pipe(first())
        .subscribe({
          next: res => {
            const { total, expenses } = res;
            this.totalEntries = total;

            // filtering by CURRENCY
            if (selectedProp === 'currency') {
              this.expenses = expenses.filter((ex: Expense) => ex.amount.currency === filter);
            }

            // filtering by DATE
            if (selectedProp === 'date') {
              this.expenses = expenses.filter((ex: Expense) => {
                const year = new Date(ex.date).getFullYear();
                return year === Number(filter);
              });
            }

            this.nrOfPages = { amount: 1 }; // if filtering, set page to 1 => showing all result on one page
            this.CDR.detectChanges();
          },
          error: err => this.toast.error(err),
        });
    } else {
      // if default filter, show normal results with pagination
      // this.unsubscribeFiltered.next();
      // this.subscribeToExpenses();
    }
  };

  public onPageChange = (page: number) => {
    if (this.filter === 'default') {
      // only update when no filter is applied
      // currently only one page for the filtered entries
      // this.unsubscribeFiltered.next();
      const payload = { limit: 25, offset: (page - 1) * 25 };
      this.store.dispatch([new GetExpenses(payload), new SetCurrentPage(page)]);
      // this.subscribeToExpenses(obj);
    }
  };

  onAddComment = (index: number, ev?: any) => {
    let isopen = false;
    if (ev) {
      const { ev: event, isOpen } = ev;
      event.stopPropagation();
      isopen = isOpen;
    }

    const expense = this.expenses[index];

    const dialogRef = this.dialog.open(AddCommentDialogComponent, {
      panelClass: 'dialog-container',
      backdropClass: 'backdrop-container',
      data: expense,
    });

    dialogRef.afterClosed().subscribe((res?: Expense) => {
      if (res) {
        res.isOpen = isopen;
        const expensesCopy = [...this.expenses];
        expensesCopy.splice(index, 1, res);
        this.expenses = expensesCopy;
        this.CDR.detectChanges();
      }
    });
  };

  onAddReceipt = (index: number, ev?: any) => {
    let isopen = false;
    if (ev) {
      const { ev: event, isOpen } = ev;
      event.stopPropagation();
      isopen = isOpen;
    }

    const expense = this.expenses[index];
    const dialogRef = this.dialog.open(AddImageComponent, {
      panelClass: 'dialog-container',
      backdropClass: 'backdrop-container',
      data: expense,
    });

    dialogRef.afterClosed().subscribe((res?: Expense) => {
      if (res) {
        res.isOpen = isopen;
        const expensesCopy = [...this.expenses];
        expensesCopy.splice(index, 1, res);
        this.expenses = expensesCopy;
        this.CDR.detectChanges();
      }
    });
  };

  public onLanguageChange = async (event: any) => {
    this.isLoading = true;
    const {
      target: { value: langCode },
    } = event;

    this.store.dispatch(new SetLanguageCode(langCode));
    setTimeout(() => {
      this.isLoading = false;
      this.CDR.detectChanges();
    }, 30);
  };
}
