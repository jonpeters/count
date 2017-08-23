import { Component, OnInit } from '@angular/core';
import {Category} from "../model/category";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  categories: Array<Category> = new Array<Category>();

  ngOnInit() {
    for (var i=0; i<10; i++) {
      this.categories.push({
        _id: null,
        name: "Category " + String.fromCharCode(i+65)
      });
    }
  }

}
