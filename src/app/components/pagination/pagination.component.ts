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
      console.log('previousValue', previousValue);
      // this.pages = [];
      const nrOfPages = Math.ceil(currentValue.amount / 25);
      for (let i = 1; i <= nrOfPages; i++) {
        if (!this.pages.find(p => p.num === i)) {
          this.pages.push({ num: i, selected: !!(i === 1) });
        }
      }

      console.log('pages', this.pages);
      this.CDR.detectChanges();
    }
  }

  public nextPage = () => {
    console.log('next page');
  };

  public prevPage = () => {
    console.log('prev page');
  };

  public goToPage = (page: any) => {
    this.pageChange.emit(page.num);
    this.updateSelection(page);
  };

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
