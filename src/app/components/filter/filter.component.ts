import { Component, OnInit, Output, EventEmitter } from '@angular/core';

export type DIRECTION = 'ASC' | 'DESC';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<string>();
  @Output() directionChange = new EventEmitter<DIRECTION>();
  filters: any[];
  direction: DIRECTION;

  constructor() {
    this.filters = [
      { value: 'default', name: 'Please select' },
      { value: 'EUR', name: 'EUR' },
      { value: 'GBP', name: 'GBP' },
      { value: 'DKK', name: 'DKK' },
    ];

    this.direction = 'ASC';
  }

  ngOnInit(): void {}

  public toggleDirection = () => {
    if (this.direction === 'ASC') this.direction = 'DESC';
    else this.direction = 'ASC';

    this.directionChange.emit(this.direction);
  };

  public onSelectionChange = (ev: any) => {
    const {
      target: { value },
    } = ev;
    this.filterChange.emit(value);
  };
}
