import { Component, OnInit } from '@angular/core';
import { Category } from "../model/category";
import { CategoryService } from "../services/category.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }

  categories: Array<Category> = new Array<Category>();

  ngOnInit() {
    // initial loading
    this.getAllCategories();

    // listen for when categories are added or removed
    this.categoryService.getObservable().subscribe(() => this.getAllCategories());
  }

  private getAllCategories() : void {
    this.categoryService.getAllCategories().subscribe((categories: Array<Category>) => {
      this.categories = categories;
    });
  }

}
