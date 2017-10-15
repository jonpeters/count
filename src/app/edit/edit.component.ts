import {
  Component, OnInit, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef,
  AfterViewInit, ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../services/category.service";
import {Category} from "../model/category";
import {Instant} from "../model/instant";
import {MdSnackBar, MdDialog} from "@angular/material";
import {GenericDialogComponent} from "../generic-dialog/generic-dialog.component";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  categoryIds: string;
  category: Category = new Category(null);
  instants: Array<Instant> = new Array<Instant>();
  deletedItemsHash = {};

  // pagination
  pageIndex: number = 0;
  pageSize: number = 25;
  totalInstants: number = 0;

  constructor(private route: ActivatedRoute,
              private categoryService: CategoryService,
              private router: Router,
              private snackbar: MdSnackBar,
              private dialog: MdDialog) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoryIds = params["categoryIds"];
      this.categoryService.getCategory(this.categoryIds).subscribe((category: Category) => this.category = category);

      this.categoryService.getInstants(this.categoryIds, this.pageIndex, this.pageSize)
        .subscribe((results: { instants: Array<Instant>, count: number }) => this.sortAndAssign(results));
    });
  }

  handleClickBack() : void {
    this.router.navigate(["app/home"]);
  }

  toggleDeleteInstant(instant: Instant) : void {
    if (this.deletedItemsHash[instant._id]) {
      delete this.deletedItemsHash[instant._id];
    } else {
      this.deletedItemsHash[instant._id] = instant;
    }
  }

  handleClickSave() : void {

    let arrayOfInstants = Object.keys(this.deletedItemsHash).map(key => this.deletedItemsHash[key]);

    // probably only need to confirm when deleting instants
    if (arrayOfInstants.length > 0) {
      let plurality: string = arrayOfInstants.length == 1 ? '' : 's';

      this.dialog.open(GenericDialogComponent, {
        data: {
          title: `Save Category`,
          message: `Saving this category will result in permanent removal of ${arrayOfInstants.length} instant${plurality}. Are you sure?`,
          buttons: [{
            returnValue: true,
            label: "Yes"
          }, {
            returnValue: false,
            label: "No"
          }]
        }
      }).afterClosed().filter(result => result).subscribe(() => {
        this.saveCategory(arrayOfInstants);
      });
    } else {
      this.saveCategory(arrayOfInstants);
    }
  }

  private saveCategory(arrayOfInstants) : void {
    this.categoryService.updateCategory(this.category, arrayOfInstants).subscribe(() => {

      this.snackbar.open(`Saved category '${this.category.name}'`, "OK", {
        duration: 3000
      });

      this.categoryService.getInstants(this.categoryIds, this.pageIndex, this.pageSize)
        .subscribe((results : { instants: Array<Instant>, count: number }) => this.sortAndAssign(results));
    });
  }

  private sortAndAssign(results: { instants: Array<Instant>, count: number }) {
    this.instants = results.instants;
    this.totalInstants = results.count;

    // sort desc, assuming it is more likely the user will need to delete/correct a very recent instant
    this.instants.sort((a, b) => b.unix_timestamp - a.unix_timestamp);
  }

  public handlePageEvent(event) : void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.categoryService.getInstants(this.categoryIds, event.pageIndex, this.pageSize)
      .subscribe((results: { instants: Array<Instant>, count: number }) => this.sortAndAssign(results));
  }
}
