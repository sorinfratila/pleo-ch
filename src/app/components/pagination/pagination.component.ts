import { Component, ChangeDetectionStrategy } from '@angular/core';
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
export class PaginationComponent {
  /** get currentPage for page selection in template */
  @Select(ExpenseState.getCurrentPage)
  public currentPage$: Observable<number>;

  /** get the pages array to iterate and set up the pages */
  @Select(ExpenseState.getPages)
  public pages$: Observable<number[]>;

  constructor(private store: Store) {}

  /**
   * change selected page and dispatch @GetExpenses and @SetCurrentPage actions
   * @param page the page number to go to
   */
  public goToPage = (page: any): void => {
    const payload = { limit: 25, offset: (page - 1) * 25 };
    this.store.dispatch([new GetExpenses(payload), new SetCurrentPage(page)]);
  };
}
