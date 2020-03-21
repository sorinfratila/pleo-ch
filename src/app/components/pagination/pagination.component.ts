import { Component, Input, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ExpenseState } from 'src/app/store/expense.state';
import { Observable } from 'rxjs';
import { GetExpenses, SetCurrentPage } from 'src/app/store/expense.actions';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnChanges {
  /** the total amount of expenses comming from the overview page */
  @Input() totalExpenses: any;

  /**  */
  pages: number[];

  /** get currentPage as Observable */
  @Select(ExpenseState.getCurrentPage)
  public currentPage$: Observable<number>;

  constructor(private store: Store) {
    this.pages = [1];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {
      totalExpenses: { currentValue },
    } = changes;
    if (currentValue) {
      this.pages = this.getPagesArray(currentValue);
    }
  }

  /**
   * makes the array containing all the pages
   * @param totalExpenses the number of expenses
   */
  public getPagesArray = (totalExpenses: number): number[] => {
    const pages = [];
    const pagesCount = Math.ceil(totalExpenses / 25);
    for (let i = 1; i <= pagesCount; i++) {
      pages.push(i);
    }
    return pages;
  };

  /**
   * change selected page and dispatch @GetExpenses and @SetCurrentPage actions
   * @param page the page number to go to
   */
  public goToPage = (page: any): void => {
    const payload = { limit: 25, offset: (page - 1) * 25 };
    this.store.dispatch([new GetExpenses(payload), new SetCurrentPage(page)]);
  };
}
