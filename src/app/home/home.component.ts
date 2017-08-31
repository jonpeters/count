import { Component, OnInit } from '@angular/core';
import { Category } from "../model/category";
import { CategoryService } from "../services/category.service";
import {GeneralEventService} from "../services/general-event.service";
import {GeneralEvent} from "../model/general-event";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private categoryService: CategoryService,
              private generalEventService: GeneralEventService) { }

  categories: Array<Category> = new Array<Category>();
  isSelectMode: boolean = false;

  ngOnInit() {
    // initial loading
    this.getAllCategories();

    // listen for when categories are added or removed
    this.categoryService.getObservable().subscribe(() => this.getAllCategories());

    // listen for when select-mode is canceled
    this.generalEventService.getObservable()
      .filter((event: GeneralEvent) => event.type === "set-select-mode")
      .subscribe((event: GeneralEvent) => {
        this.isSelectMode = event.body;
        this.categories.forEach(c => c.selected = false);
      });
  }

  private getAllCategories() : void {
    this.categoryService.getAllCategories().subscribe((categories: Array<Category>) => {
      this.categories = categories;
    });
  }

  handlePressCategory(category: Category) : void {
    this.generalEventService.broadcastEvent("set-select-mode", true);
  }

  handleCheckboxChange() : void {
    // broadcast all currently selected categories
    this.generalEventService.broadcastEvent("select", this.categories);
  }

  handleTapCategory(category: Category) : void {

    // workaround; when in select mode, checking the box causes a tap event to be fired
    // and event.stopPropagation has no effect :-/
    if (this.isSelectMode) return;

    this.categoryService.incrementCategoryCount(category._id).subscribe((resultCategory: Category) => {
      category.count = resultCategory.count;
    });
  }

}
