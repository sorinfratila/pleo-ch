import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Expense } from 'src/app/models/Expense';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent implements OnInit {
  @Input() expense: Expense;
  @Input() showReceipts: boolean;

  baseURL: string;

  constructor() {
    this.baseURL = environment.rootURL;
  }

  ngOnInit(): void {}
}