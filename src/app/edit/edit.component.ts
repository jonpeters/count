import { Component, OnInit } from '@angular/core';
import {GeneralEventService} from "../services/general-event.service";
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../services/category.service";
import {Category} from "../model/category";
import {Instant} from "../model/instant";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  categoryIds: string;
  category: Category = new Category(null);
  instants: Array<Instant> = new Array<Instant>();

  constructor(private route: ActivatedRoute,
              private generalEventService: GeneralEventService,
              private categoryService: CategoryService) { }

  ngOnInit() {
    this.generalEventService.broadcastEvent("set-back-mode", true);

    this.route.queryParams.subscribe(params => {
      this.categoryIds = params["categoryIds"];
      this.categoryService.getCategory(this.categoryIds).subscribe((category: Category) => this.category = category);
      this.categoryService.getInstants(this.categoryIds).subscribe((instants: Array<Instant>) => this.instants = instants);
    });
  }

}
