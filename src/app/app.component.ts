import {Component, ViewChild, ChangeDetectorRef} from '@angular/core';
import {MdDialog, MdSnackBar} from "@angular/material";
import {NewCategoryDialogComponent} from "./new-category-dialog/new-category-dialog.component";
import {CategoryService} from "./services/category.service";
import {Category} from "./model/category";
import {GeneralEventService} from "./services/general-event.service";
import {GeneralEvent} from "./model/general-event";
import {GenericDialogComponent} from "./generic-dialog/generic-dialog.component";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {ApiService} from "./services/api.service";

const emptyArray: Array<Category> = new Array<Category>();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild("sideNavMenu") sideNavMenu;

  isSelectMode: boolean = false;
  isBackMode: boolean = false;

  categories: Array<Category> = emptyArray;

  constructor(private dialog: MdDialog,
              private snackbar: MdSnackBar,
              private categoryService: CategoryService,
              private generalEventService: GeneralEventService,
              private router: Router,
              private apiService: ApiService) {}

  ngOnInit() {

    // listen for when select-mode is set or un-set
    this.generalEventService.getObservable()
      .filter((event: GeneralEvent) => event.type === "set-select-mode")
      .subscribe((event: GeneralEvent) => this.isSelectMode = event.body);

    // listen for when back-mode is set or un-set
    this.generalEventService.getObservable()
      .filter((event: GeneralEvent) => event.type === "set-back-mode")
      .subscribe((event: GeneralEvent) => setTimeout(() => this.isBackMode = event.body, 0));

    // listen for when categories are selected or de-selected
    this.generalEventService.getObservable()
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
      }).afterClosed().subscribe(result => {

        if (result) {

          this.sideNavMenu.close();

          // grab ids
          let ids: Array<string> = selectedCategories.map(c => c._id);

          this.categoryService.deleteCategories(ids).subscribe(() => {

            // exit select-mode
            this.generalEventService.broadcastEvent("set-select-mode", false);

            // hint to interested parties that the group of categories has changed
            this.categoryService.broadcast();

            this.snackbar.open(`Deleted ${selectedCategories.length} categor${plurality}`, "OK", {
              duration: 3000
            });

            // the categories list will have been refreshed above, thus clear this local reference
            this.categories = emptyArray;

          });
        }
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
        this.generalEventService.broadcastEvent("set-select-mode", false);
        this.sideNavMenu.close();
        this.router.navigate(['graph'], { queryParams: { categoryIds: selectedCategories.map(c => c._id) }});
      });
  }

  handleClickBack() : void {
    this.generalEventService.broadcastEvent("set-back-mode", false);
    this.router.navigate(["home"]);
  }

  handleSignOut() : void {
    this.apiService.signOut();
    this.router.navigate(["login"]);
    this.sideNavMenu.close();
  }

  isAuthenticated() : boolean {
    return this.apiService.isAuthenticated();
  }
}
