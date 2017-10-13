import {Component, ViewChild} from '@angular/core';
import {MdDialog, MdSnackBar} from "@angular/material";
import {NewCategoryDialogComponent} from "./new-category-dialog/new-category-dialog.component";
import {CategoryService} from "./services/category.service";
import {Category} from "./model/category";
import {GeneralEventService} from "./services/general-event.service";
import {GenericDialogComponent} from "./generic-dialog/generic-dialog.component";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {ApiService} from "./services/api.service";
import {GeneralEvent} from "./model/general-event";

const emptyArray: Array<Category> = new Array<Category>();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild("sideNavMenu") sideNavMenu;

  categories: Array<Category> = emptyArray;

  constructor(private dialog: MdDialog,
              private snackbar: MdSnackBar,
              private categoryService: CategoryService,
              private generalEventService: GeneralEventService,
              private router: Router,
              private apiService: ApiService) {}

  ngOnInit() {

    // listen for when the menu button is clicked and toggle the side-menu
    this.generalEventService
      .getObservable()
      .filter((event: GeneralEvent) => event.type == "toggle-side-menu")
      .subscribe(() => this.sideNavMenu.toggle());

    // listen for when categories are selected or de-selected
    this.generalEventService
      .getObservable()
      .filter((event: GeneralEvent) => event.type === "select")
      .subscribe((event: GeneralEvent) => this.categories = event.body);

  }

  handleNewCategory() : void {

    // a context to allow the dialog to share data with this component
    let data: any = {
      categoryName: null
    };

    let dialogRef = this.dialog.open(NewCategoryDialogComponent, {
      data: data
    });

    dialogRef.afterClosed()
      .first()
      .do(() => this.sideNavMenu.close())
      .filter(result => result)
      // validate category name doesn't exist
      .flatMap(() => this.categoryService.getCategoryByName(data.categoryName))
      .flatMap((category: Category) => {
        if (category) {
          return Observable.throw(`Category name "${data.categoryName}" already exists`);
        }

        return this.categoryService.createNewCategory(new Category(data.categoryName));
      })
      .catch(err => {

        this.dialog.open(GenericDialogComponent, {
          data: {
            title: `Error`,
            message: err,
            buttons: [{
              returnValue: true,
              label: "OK"
            }],
            icon: {
              color: "#FFA07A",
              name: "error"
            }
          }
        });

        return Observable.of();
      })
      .subscribe((newCategory: Category) => {
        // hint to interested parties that the group of categories has changed
        this.categoryService.broadcast();

        this.snackbar.open(`Created category "${newCategory.name}"`, "OK", {
          duration: 3000
        });
    });
  }

  handleDeleteCategory() : void {
    this.doSelectedCategoriesCheck()
      .first()
      .filter((selectedCategories: Array<Category>) => selectedCategories.length > 0)
      .subscribe((selectedCategories: Array<Category>) => {

      let plurality: string = selectedCategories.length === 1 ? "y" : "ies";

      this.dialog.open(GenericDialogComponent, {
        data: {
          title: `Delete Categor${plurality}`,
          message: `Are you sure you want to permanently delete ${selectedCategories.length} categor${plurality}?`,
          buttons: [{
            returnValue: true,
            label: "Yes"
          }, {
            returnValue: false,
            label: "No"
          }]
        }
      }).afterClosed()
        .first()
        .do(() => this.sideNavMenu.close())
        .filter(result => result)
        .map(() => selectedCategories.map(c => c._id))
        .flatMap(ids => this.categoryService.deleteCategories(ids))
        .subscribe(() => {
          // exit select-mode
          this.generalEventService.broadcastEvent("cancel-select-mode");

          // hint to interested parties that the group of categories has changed
          this.categoryService.broadcast();

          this.snackbar.open(`Deleted ${selectedCategories.length} categor${plurality}`, "OK", {
            duration: 3000
          });

          // the categories list will have been refreshed above, thus clear this local reference
          this.categories = emptyArray;
      });
    });
  }

  doSelectedCategoriesCheck() : Observable<Array<Category>> {
    let selectedCategories: Array<Category> = this.categories.filter(c => c.selected);

    if (selectedCategories.length === 0) {
      return this.dialog.open(GenericDialogComponent, {
        data: {
          title: "No Categories Selected",
          message: "No categories have been selected",
          buttons: [{
            returnValue: true,
            label: "OK"
          }]
        }
      }).afterClosed().map(() => selectedCategories);
    }

    return Observable.of(selectedCategories);
  }

  handleShowGraph() : void {
    this.doSelectedCategoriesCheck()
      .first()
      .filter((selectedCategories: Array<Category>) => selectedCategories.length > 0)
      .subscribe((selectedCategories: Array<Category>) => {
        this.generalEventService.broadcastEvent("cancel-select-mode");
        this.sideNavMenu.close();
        this.router.navigate(['graph'], { queryParams: { categoryIds: selectedCategories.map(c => c._id) }});
      });
  }

  handleSignOut() : void {
    this.apiService.signOut();
    this.sideNavMenu.close();
    this.router.navigate(["login"]);
  }

  handleEditCategory() : void {

    // TODO allow only 1 selected category

    this.doSelectedCategoriesCheck()
      .first()
      .filter((selectedCategories: Array<Category>) => selectedCategories.length > 0)
      .subscribe((selectedCategories: Array<Category>) => {
        this.sideNavMenu.close();
        this.router.navigate(["edit"], { queryParams: { categoryIds: selectedCategories.map(c => c._id) }});
        this.generalEventService.broadcastEvent("cancel-select-mode");
      });
  }

  handleAlerts() : void {

    this.doSelectedCategoriesCheck()
      .first()
      .do(() => this.sideNavMenu.close())
      .filter((selectedCategories: Array<Category>) => selectedCategories.length > 0)
      .subscribe((selectedCategories: Array<Category>) => {
        this.router.navigate(["alerts"], { queryParams: { categoryIds: selectedCategories.map(c => c._id) }});
        this.generalEventService.broadcastEvent("cancel-select-mode");
      });

  }
}
