import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../services/category.service";
import {Chart} from "chart.js";
import {Observable} from "rxjs";
import {Category} from "../model/category";
import {GeneralEventService} from "../services/general-event.service";
import {UtilService} from "../services/util.service";
import {slideInOutAnimation} from "../_animations/slide-out";

const ONE_HOUR_IN_MS = 60*60*1000;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  animations: [slideInOutAnimation],
  host: { '[@slideInOutAnimation]': '' }
})
export class GraphComponent implements OnInit {

  @ViewChild("canvas") canvas;

  categoryIds: string;
  duration: number = 24;
  chart: Chart;

  timePeriods: Array<{ viewValue: string, value: string }> = [{
    viewValue: "Hour",
    value: "hour"
  }, {
    viewValue: "Day",
    value: "day"
  }];

  selectedTimePeriod: string = this.timePeriods[0].value;
  selectedGroupBy: string = this.timePeriods[0].value;

  constructor(private route: ActivatedRoute,
              private categoryService: CategoryService,
              private router: Router,
              private utilService: UtilService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoryIds = params["categoryIds"];
      this.updateChart();
    });
  }

  updateChart() {

    // clear the canvas of any previous chart renderings,
    // otherwise strange flickers occur
    if (this.chart) {
      this.chart.destroy();
    }

    let now = Date.now();
    let multiplier = this.selectedTimePeriod === "hour" ? 1 : 24;
    let start = now - (this.duration * multiplier * ONE_HOUR_IN_MS);

    // TODO make history period configurable in UI
    let historyPeriodLength = 20;

    // adjust for history period for sma calculation
    // (-1 because the first data point is included, along with the previous e.g. 19 data points)
    start -= (multiplier * (historyPeriodLength-1) * ONE_HOUR_IN_MS);

    // need both data and category name (which are currently coming from
    // different request/endpoints), thus need to ensure that both
    // are available before instantiating chart instance
    Observable.zip(
      this.categoryService.getTimeSeries(start, now, this.categoryIds, this.selectedGroupBy),
      this.categoryService.getCategory(this.categoryIds),
      (data: Array<{ unix_timestamp: number, count: number }>, category: Category) => {
        return {
          data: data,
          category: category
        }
      }
    ).subscribe((result: { data: Array<{ unix_timestamp: number, count: number }>, category: Category }) => {

      result.data.sort((a, b) => {
        return a.unix_timestamp-b.unix_timestamp;
      });

      var data = result.data.map(d => {
        return {
          x: new Date(d.unix_timestamp),
          y: d.count
        }
      });

      var sma = this.utilService.calculateSMA(historyPeriodLength, data, "x", "y");

      data = data.slice(historyPeriodLength-1, data.length);

      var ctx = this.canvas.nativeElement.getContext("2d");
      this.chart = new Chart(ctx, this.getConfig(data, result.category.name, sma));

    });
  }

  handleChangeValue() : void {
    this.updateChart();
  }

  handleClickBack() : void {
    this.router.navigate(["app/home"]);
  }

  /**
   * only a stop-gap to generate a boilerplate config for the chart.
   */
  private getConfig(data: any, categoryName: string, sma: any) {
    let config = JSON.parse(JSON.stringify(this.defaultConfig));
    config.data.datasets[0].data = data;
    config.data.datasets[0].label = categoryName;
    config.data.datasets[1].data = sma;
    config.data.datasets[1].label = "SMA (20)";
    return config;
  }

  defaultConfig: any = {
    type: 'line',
    data: {
      labels: [ // Date Objects

      ],
      datasets: [{
        label: null,
        backgroundColor: "rgba(63, 81, 181, .5)",
        borderColor: "rgba(63, 81, 181, .5)",
        fill: false,
        data: null
      }, {
        label: null,
        // backgroundColor: "red",
        // borderColor: "red",
        fill: false,
        data: null
      }]
    },
    options: {
      title:{
        text: "Chart.js Time Scale"
      },
      scales: {
        xAxes: [{
          type: "time",
          time: {
            format: 'MM/DD/YYYY HH:mm',
            // round: 'day'
            tooltipFormat: 'll HH:mm'
          },
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }, ],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'count'
          }
        }]
      },
    }
  };

}
