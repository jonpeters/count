import {Component, ViewChild} from '@angular/core';
import {MdDialog, MdSnackBar} from "@angular/material";
import {NewCategoryDialogComponent} from "./new-category-dialog/new-category-dialog.component";
import {CategoryService} from "./services/category.service";
import {Category} from "./model/category";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild("sideNavMenu") sideNavMenu;

  constructor(private dialog: MdDialog,
              private snackbar: MdSnackBar,
              private categoryService: CategoryService) {}

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
}
