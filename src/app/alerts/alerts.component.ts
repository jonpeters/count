import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../services/category.service";
import {Alert} from "../model/alert";

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  categoryIds: string;
  alerts: Array<Alert> = new Array<Alert>();

  constructor(private route: ActivatedRoute,
              private categoryService: CategoryService,
              private router: Router) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.categoryIds = params["categoryIds"];

      this.categoryService.getAlerts(this.categoryIds)
        .subscribe((alerts: Array<Alert>) => this.alerts = alerts);
    });

  }

  handleClickBack() : void {
    this.router.navigate(["home"]);
  }

}
