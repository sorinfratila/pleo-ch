import { Component, OnInit, Input } from '@angular/core';
import { Expense } from 'src/app/models/Expense';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {
  @Input() expense: Expense;
  @Input() isOpen: boolean;

  constructor() {}

  ngOnInit(): void {}
}
