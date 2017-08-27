import {Component, ViewChild} from '@angular/core';
import {MdDialog, MdSnackBar} from "@angular/material";
import {NewCategoryDialogComponent} from "./new-category-dialog/new-category-dialog.component";
import {CategoryService} from "./services/category.service";
import {Category} from "./model/category";
import {GeneralEventService} from "./services/general-event.service";
import {GeneralEvent} from "./model/general-event";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild("sideNavMenu") sideNavMenu;

  isSelectMode: boolean = false;

  constructor(private dialog: MdDialog,
              private snackbar: MdSnackBar,
              private categoryService: CategoryService,
              private generalEventService: GeneralEventService) {}

  ngOnInit() {

    // listen for when select-mode is set or un-set
    this.generalEventService.getObservable()
      .filter((event: GeneralEvent) => event.type === "set-select-mode")
      .subscribe((event: GeneralEvent) => this.isSelectMode = event.body);
  }

  handleNewCategory() : void {

    // a context to allow the dialog to share data with this component
    let data: any = {
      categoryName: null
    };

    let dialogRef = this.dialog.open(NewCategoryDialogComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sideNavMenu.close();
        this.categoryService.createNewCategory(new Category(data.categoryName)).subscribe((newCategory: Category) => {

          // hint to interested parties that the group of categories has changed
          this.categoryService.broadcast();

          this.snackbar.open(`Created category '${newCategory.name}'`, "OK", {
            duration: 3000
          });
        });
      }
    });
  }

  handleCancelSelect() : void {
    this.generalEventService.broadcastEvent("set-select-mode", false);
  }
}
