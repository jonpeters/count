import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../services/category.service";
import {Chart} from "chart.js";

const ONE_HOUR_IN_MS = 60*60*1000;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
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

  constructor(private route: ActivatedRoute,
              private categoryService: CategoryService) {

  }

  updateChart() {

    // clear the canvas of any previous chart renderings
    if (this.chart) {
      this.chart.destroy();
    }

    let now = Date.now();
    let multiplier = this.selectedTimePeriod === "hour" ? 1 : 24;
    let start = now - (this.duration * multiplier * ONE_HOUR_IN_MS);

    this.categoryService.getTimeSeries(start, now, this.categoryIds).subscribe(result => {

      result.sort((a, b) => {
        return a.unix_timestamp-b.unix_timestamp;
      });

      var data = result.map(d => {
        return {
          x: new Date(d.unix_timestamp),
          y: d.value
        }
      });

      var ctx = this.canvas.nativeElement.getContext("2d");
      this.chart = new Chart(ctx, this.getConfig(data));

    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoryIds = params["categoryIds"];
      this.updateChart();
    });
  }

  handleChangeValue() : void {
    this.updateChart();
  }

  /**
   * only a stop-gap
   */
  private getConfig(data: any) {
    let config = JSON.parse(JSON.stringify(this.defaultConfig));
    config.data.datasets[0].data = data;
    return config;
  }

  defaultConfig: any = {
    type: 'line',
    data: {
      labels: [ // Date Objects

      ],
      datasets: [{
        label: "My First dataset",
        //backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
        //borderColor: window.chartColors.red,
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
            labelString: 'value'
          }
        }]
      },
    }
  };

}
