import { Component, OnInit } from "@angular/core";
import { Expense } from "src/app/models/Expense";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ExpensesService } from "src/app/services/expenses.service";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"]
})
export class OverviewComponent implements OnInit {
  btnText: string;
  isShowing: boolean;
  expensesList: Expense[] = [];
  expenseList$: Observable<any>;

  constructor(private expensesService: ExpensesService) {
    this.btnText = "Show";
    this.isShowing = false;
  }

  ngOnInit(): void {
    this.expenseList$ = this.expensesService.getExpenses().pipe(
      map((expensesList: Expense[]) => {
        console.log("expensesList", expensesList);
      })
    );
  }

  public toggleList() {
    this.isShowing = !this.isShowing;
    if (this.isShowing) this.btnText = "Hide";
    else this.btnText = "Show";
  }
}
