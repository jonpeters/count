import { Component, OnInit } from '@angular/core';
import { Category } from "../model/category";
import { CategoryService } from "../services/category.service";
import {GeneralEventService} from "../services/general-event.service";
import {GeneralEvent} from "../model/general-event";
import {Subscription} from "rxjs";
import {Alert} from "../model/alert";
import {MdDialog} from "@angular/material";
import {GenericDialogComponent} from "../generic-dialog/generic-dialog.component";
import {MomentPipe} from "../pipes/moment.pipe";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private categoryService: CategoryService,
              private generalEventService: GeneralEventService,
              private dialog: MdDialog) { }

  categories: Array<Category> = new Array<Category>();
  isSelectMode: boolean = false;

  /**
   * observable subscriptions to be cleaned up on destroy
   */
  private subscriptions: Array<Subscription> = new Array<Subscription>();

  ngOnInit() {
    // initial loading
    this.getAllCategories();

    // listen for when categories are added or removed
    this.subscriptions.push(
      this.categoryService.getObservable().subscribe(() => {
        this.getAllCategories();
      })
    );

    // listen for when select-mode is canceled (needed by actions e.g. delete category)
    this.subscriptions.push(
      this.generalEventService.getObservable()
        .filter((event: GeneralEvent) => event.type === "cancel-select-mode")
        .subscribe((event: GeneralEvent) => this.cancelSelectMode())
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  private getAllCategories() : void {
    this.categoryService.getAllCategories().subscribe((categories: Array<Category>) => {
      this.categories = categories;
    });
  }

  handlePressCategory(category: Category) : void {
    category.selected = !category.selected;
    this.isSelectMode = this.categories.filter(c => c.selected).length > 0;
    this.generalEventService.broadcastEvent("select", this.categories);
  }

  private cancelSelectMode() : void {
    // hide checkboxes
    this.isSelectMode = false;
    // un-check any checked checkboxes
    this.categories.forEach(c => c.selected = false);
  }

  handleTapCategory(category: Category) : void {
    this.categoryService.incrementCategoryCount(category._id).subscribe((result: { category: Category, alerts: Array<Alert> }) => {
      category.count = result.category.count;

      result.alerts.forEach((alert: Alert) => {
        let message = `A statistically high value of ${alert.value}\ 
          has been detected in the "${category.name}" category for the ${alert.group_by_level === "hour" ? "hourly" : "daily"} period of\ 
          ${(new MomentPipe()).transform(alert.unix_timestamp, "MM/DD/YYYY hh:mm:ss a")}`;

        this.dialog.open(GenericDialogComponent, {
          data: {
            title: `Alert Detected`,
            message: message,
            buttons: [{
              returnValue: true,
              label: "OK"
            }],
            icon: {
              color: "#FFA07A",
              name: "warning"
            }
          }
        })
      });
    });
  }

  handleClickUnselectAll() : void {
    this.cancelSelectMode();
  }

  handleClickMenu() : void {
    this.generalEventService.broadcastEvent("toggle-side-menu");
  }

}
