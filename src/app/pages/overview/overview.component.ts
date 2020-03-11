import { Component, OnInit } from "@angular/core";
import { Expense } from "src/app/models/Expense";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"]
})
export class OverviewComponent implements OnInit {
  btnText: string;
  isShowing: boolean;
  expensesList: Expense[] = [];

  constructor() {
    this.btnText = "Show";
    this.isShowing = false;
  }

  ngOnInit(): void {}

  public toggleList() {
    this.isShowing = !this.isShowing;
    if (this.isShowing) this.btnText = "Hide";
    else this.btnText = "Show";
  }
}
