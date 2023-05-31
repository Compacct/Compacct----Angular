import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { HttpClient } from "@angular/common/http";
declare var $: any;
import * as Chart from "chart.js";
import "chartjs-plugin-datalabels";
import * as XLSX from 'xlsx';
// import Chart from "../../../../../assets/Chart";
// import ChartJsPluginDataLabels from "";

@Component({
  selector: "app-compacct-chart",
  templateUrl: "./compacct-chart.component.html",
  styleUrls: ["./compacct-chart.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class CompacctChartComponent implements OnInit {
  data: any;
  cols = [];
  seachSpinner = false;
  ChartTypeDynamic = "line";
  _DynamicChartData = {};
  _ChartTypeDynamic: string;
  _searchDetails = {};
  Flag_ChartTypeDynamic = false;

  displayChartDetailsModal = false;
  ChartDetailsTitle = "Chart";
  ChartDeatilsList = [];
  ChartColList = [];
  ChartSearchColList = [];
  BARoptions: any;
  Horioptions: any;
  PIEoption: any;
  DoughPolaroption: any;
  stackoption: any;
  checkwo: any;
  stackFlag = false;

  @Input() set DynamicChartData(value: {}) {
    this._DynamicChartData = value;
    this.checkwo = value;
    if (this._DynamicChartData) {
      this.ApplyChartDynamic(this._DynamicChartData);
    }
  }
  @Input() set DynamicChartType(value: string) {
    this.ApplyChartType(value);
  }
  @Input() set searchDetails(value: {}) {
    this._searchDetails = value;
  }
  constructor(private $http: HttpClient) {}

  ngOnInit() {
    this.BARoptions = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 25,
          bottom: 0
        }
      },
      legend: {
        display: false,
        labels: {
          fontColor: "rgb(255, 99, 132)"
        }
      },
      plugins: {
        datalabels: {
          backgroundColor: function(context) {
            return context.dataset.backgroundColor;
          },
          anchor: "end",
          align: "end",
          color: "white",
          font: {
            weight: "bold"
          },
          borderRadius: "5"
        }
      }
    };
    this.Horioptions = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 0,
          right: 40,
          top: 0,
          bottom: 0
        }
      },
      legend: {
        display: false,
        labels: {
          fontColor: "rgb(255, 99, 132)"
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontSize: 10
            }
          }
        ]
      },
      plugins: {
        datalabels: {
          backgroundColor: function(context) {
            return context.dataset.backgroundColor;
          },
          anchor: "end",
          align: "end",
          display: "auto",
          color: "white",
          font: {
            weight: "bold"
          },
          borderRadius: "5"
        }
      }
    };
    this.PIEoption = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            let sum = 0;
            const dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(data => {
              sum += data;
            });
            const percentage = Math.round((value * 100) / sum) + "%";
            return percentage;
          },
          color: "#fff"
        }
      },
      tooltips: {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            // get the concerned dataset
            const dataset = data.datasets[tooltipItem.datasetIndex];
            // calculate the total of this data set
            const total = dataset.data.reduce(function(
              previousValue,
              currentValue,
              currentIndex,
              array
            ) {
              return previousValue + currentValue;
            });
            // get the current items value
            const currentValue1 = dataset.data[tooltipItem.index];
            // calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
            const percentage = ((currentValue1 / total) * 100).toFixed(2);
            return (
              data.labels[tooltipItem.index] +
              " : " +
              currentValue1 +
              "( " +
              percentage +
              "% )"
            );
          }
        }
      }
    };
    this.DoughPolaroption = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            let sum = 0;
            const dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(data => {
              sum += data;
            });
            const percentage = ((value * 100) / sum).toFixed(2) + "%";
            return percentage;
          },
          color: "#fff"
        }
      },
      tooltips: {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            // get the concerned dataset
            const dataset = data.datasets[tooltipItem.datasetIndex];
            // calculate the total of this data set
            const total = dataset.data.reduce(function(
              previousValue,
              currentValue,
              currentIndex,
              array
            ) {
              return previousValue + currentValue;
            });
            // get the current items value
            const currentValue1 = dataset.data[tooltipItem.index];
            // calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
            const percentage = ((currentValue1 / total) * 100).toFixed(2);
            return (
              data.labels[tooltipItem.index] +
              " : " +
              currentValue1 +
              "( " +
              percentage +
              "% )"
            );
          }
        }
      }
    };
    this.stackoption = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 25,
          bottom: 0
        }
      },
      legend: {
        text: "anil",
        display: true,
        labels: {
          fontColor: "rgb(255, 99, 132)"
        }
      },
      scales: {
        xAxes: [
          {
            stacked: true
          }
        ],
        yAxes: [
          {
            stacked: true
          }
        ]
      },
      tooltips: {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            return (
              data.datasets[tooltipItem.datasetIndex].label +
              ": " +
              tooltipItem.yLabel
            );
          },
          footer: function(tooltipItem, data) {
            const sum = tooltipItem[0].yLabel + tooltipItem[1].yLabel;
            return "Total : " + sum;
          }
        }
      },
      plugins: {
        datalabels: {
          display: true,
          align: "center",
          anchor: "center",
          color: "white"
        }
      }
    };
    this.cols = [
      { field: "Dated", header: "Date" },
      { field: "Clinic", header: "Clinic" },
      { field: "Enq_Source", header: "Enquiry Source" },
      { field: "Patient_Name", header: "Patient Name" },
      { field: "Mobile", header: "Mobile" },
      { field: "Gender", header: "Gender" },
      { field: "Age", header: "Age" },
      { field: "District", header: "District" }
    ];
  }

  selectData(data) {
    this.seachSpinner = true;
    this.ChartDeatilsList = [];
    this.displayChartDetailsModal = true;
    this.FetchChartDetails();
  }
  FetchChartDetails() {
    if (!!this._searchDetails) {
      this.ChartDetailsTitle = this._searchDetails["reportname"];
      const obj = {
        ReportName: this._searchDetails["reportname"],
        StartDate: this._searchDetails["StartDate"],
        EndDate: this._searchDetails["EndDate"]
      };
      this.ChartSearchColList = [];
      this.$http
        .get("/Business_Dashboard/Get_Hearing_Chart", {
          params: obj
        })
        .subscribe((data: any) => {
          this.ChartDeatilsList = data ? JSON.parse(data) : [];
          const keyslist = this.ChartDeatilsList.length ? Object.keys(this.ChartDeatilsList[0]) : [];
          if(keyslist.length){
            this.ChartColList = [];
            this.ChartSearchColList = [...keyslist];
            keyslist.forEach(item =>{
              const hobj = { field: item, header: item.replace(/_/g,' ') };
              this.ChartColList.push(hobj);
            })
            
          }
          this.seachSpinner = false;
        });
    }
  }

  // EXPORT TO EXCEL
  exportexcel(Arr): void {
    const fileName = this._searchDetails["reportname"]+'##'+this._searchDetails["StartDate"]+'#To#'+this._searchDetails["EndDate"]
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
  ApplyChartType(type) {
    this._ChartTypeDynamic = type;
  }
  ApplyChartDynamic(data) {
    this.ValidateData(data);
  }
  ValidateData(data) {
    this.data = {};
    this.stackFlag = false;
    if (data[0].Y1) {
      this.stackFlag = true;
      const xData:any = [];
      const x2Data:any = [];
      const label:any = [];
      data.forEach((el:any) => {
        label.push(el.X);
        xData.push(el.Y);
        x2Data.push((Number(el.Y1) - Number(el.Y)).toFixed(2));
      });
      console.log(data);
      this.data = {
        labels: label,
        datasets: [
          {
            label: data[0].Y_Caption,
            backgroundColor: "rgba(55, 160, 225, 0.7)",
            hoverBackgroundColor: "rgba(55, 160, 225, 0.7)",
            hoverBorderWidth: 2,
            hoverBorderColor: "lightgrey",
            borderColor: "#fff",
            data: xData
          },
          {
            label: data[0].Y1_Caption,
            backgroundColor: "rgba(225, 58, 55, 0.7)",
            hoverBackgroundColor: "rgba(225, 58, 55, 0.7)",
            hoverBorderWidth: 2,
            hoverBorderColor: "lightgrey",
            borderColor: "#fff",
            data: x2Data
          }
        ]
      };
      console.log("data xData",this.data);
    } else {
      const xData = [];
      const label = [];
      data.forEach(el => {
        label.push(el.X);
        xData.push(el.Y);
      });
      const ColorArray = this.RandomColorPicker(label);
      this.data = {
        labels: label,
        datasets: [
          {
            backgroundColor: ColorArray,
            borderColor: "#fff",
            data: xData
          }
        ]
      };
    }
    
  }
  RandomColorPicker(label) {
    const ColorArray = [];
    if (label.length) {
      for (let i = 0; i < label.length; i++) {
        const letters = "0123456789ABCDEF".split("");
        let color = "#";
        for (let k = 0; k < 6; k++) {
          color += letters[Math.round(Math.random() * 10)];
        }
        ColorArray.push(color);
      }
    }
    return ColorArray;
  }
}
