import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Expense } from 'src/app/models/Expense';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  @Input() expense: Expense;
  @Input() showReceipts: boolean;

  constructor() {}
}
