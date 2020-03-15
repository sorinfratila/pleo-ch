import {
  Component,
  Input,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnChanges {
  @Input() nrOfPages: any;
  @Output() pageChange = new EventEmitter<any>();
  pages: any[];
  constructor(private CDR: ChangeDetectorRef) {
    this.pages = [{ num: 1, selected: true }];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const {
        nrOfPages: { currentValue, previousValue },
      } = changes;
      if (previousValue && currentValue && currentValue.amount !== previousValue.amount) {
        // updating the pages array to have the correct amount of pages
        const selectedPage = this.pages.find(p => p.selected);
        this.pages = this.getPages(currentValue.amount);
        if (selectedPage) this.updateSelection(selectedPage);
        this.CDR.detectChanges();
      }
    }
  }

  /**
   * @param nrOfEntries the number of expenses currently got from BE
   */
  public getPages = (nrOfEntries: number): any[] => {
    const pages = [];
    const nrOfPages = Math.ceil(nrOfEntries / 25);
    for (let i = 1; i <= nrOfPages; i++) {
      pages.push({ num: i, selected: !!(i === 1) });
    }
    return pages;
  };

  // public nextPage = (): void => {
  //   console.log('next page');
  // };

  // public prevPage = (): void => {
  //   console.log('prev page');
  // };

  /**
   * change selected page and emit the page number for updates in overview
   * @param page the page object
   */
  public goToPage = (page: any) => {
    this.pageChange.emit(page.num);
    this.updateSelection(page);
  };

  /**
   * update selection in pages array
   * @param page the page object contains num and selected props
   */
  private updateSelection = (page: any) => {
    const { num } = page;
    this.pages = this.pages.map(p => {
      if (p.num === num) {
        return {
          ...p,
          selected: true,
        };
      }
      return {
        ...p,
        selected: false,
      };
    });
  };
}
