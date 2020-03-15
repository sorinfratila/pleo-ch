import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { Expense } from 'src/app/models/Expense';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExpensesService } from 'src/app/services/expenses.service';
import { ToastrService } from 'ngx-toastr';
import { AddCommentDialogComponent } from 'src/app/dialogs/add-comment-dialog/add-comment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddImageComponent } from 'src/app/dialogs/add-image/add-image.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit, OnDestroy {
  expenses$: Subscription;
  unsubscribeExpense = new Subject<any>();
  unsubscribeFiltered = new Subject<any>();
  filteredExpenses$: Subscription;
  expenses: Expense[] = [];
  totalEntries: number;
  nrOfPages: any;
  filter: string;
  innerWidth: number;
  tableColumns: any[];

  constructor(
    private dialog: MatDialog,
    private expensesService: ExpensesService,
    private toast: ToastrService,
    private CDR: ChangeDetectorRef,
  ) {
    this.innerWidth = window.innerWidth;
    this.totalEntries = 0;
    this.nrOfPages = { amount: 0 };
    this.filter = 'default';
    this.tableColumns = [
      { value: 'first', name: 'First Name', width: 90 },
      { value: 'last', name: 'Last Name', width: 100 },
      { value: 'date', name: 'Date', width: 85 },
      { value: 'value', name: 'Value', width: 80 },
      { value: 'currency', name: 'Currency', width: 70 },
      { value: 'merchant', name: 'Merchant', width: 100 },
      { value: 'receipts', name: 'Receipts', width: 100 },
      { value: 'comment', name: 'Comment', width: 100 },
      { value: 'category', name: 'Category', width: 60 },
      { value: 'addReceipt', name: null, width: 50 },
      { value: 'addComment', name: null, width: 50 },
    ];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
    console.log(this.innerWidth);
  }

  ngOnInit(): void {
    this.subscribeToExpenses();
  }

  ngOnDestroy(): void {
    if (this.expenses$) this.expenses$.unsubscribe();
    if (this.filteredExpenses$) this.filteredExpenses$.unsubscribe();
  }

  /**
   *
   * @param obj contains the limit and offset values for pagination
   */
  private subscribeToExpenses(obj?: any) {
    this.expenses$ = this.expensesService
      .getExpenses(obj)
      .pipe(takeUntil(this.unsubscribeExpense))
      .subscribe({
        next: (result: any) => {
          const { total, expenses } = result;
          this.totalEntries = total;
          this.nrOfPages = { amount: total };
          this.expenses = this.appendProp(expenses);

          this.CDR.detectChanges();
        },
        error: err => this.toast.error(err),
      });
  }

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
      this.unsubscribeExpense.next();
      this.unsubscribeExpense.complete();
      this.filteredExpenses$ = this.expensesService
        .getAllExpenses({ limit: this.totalEntries })
        .pipe(takeUntil(this.unsubscribeFiltered))
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
      this.unsubscribeFiltered.next();
      this.unsubscribeFiltered.complete();
      this.subscribeToExpenses();
    }
  };

  public onPageChange = (pageNumber: number) => {
    if (this.filter === 'default') {
      // only update when no filter is applied
      // currently only one page for the filtered entries
      // if (this.filteredExpenses$) this.filteredExpenses$.unsubscribe();
      this.unsubscribeFiltered.next();
      this.unsubscribeFiltered.complete();
      const obj = { limit: 25, offset: (pageNumber - 1) * 25 };
      this.subscribeToExpenses(obj);
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
}
