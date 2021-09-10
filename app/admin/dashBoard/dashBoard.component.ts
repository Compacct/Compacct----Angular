import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2
} from "@angular/core";
import { CompacctCommonApi } from "../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../shared/compacct.services/common.header.service";
import { HttpParams, HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs";
import { DateTimeConvertService } from "../shared/compacct.global/dateTime.service";
declare var $: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashBoard.component.html",
  styleUrls: ["./compacct.dashboard.css"]
})
export class DashBoardComponent implements OnInit {
  public startyear: Date = new Date(
    new Date(new Date().setDate(new Date().getDate() - 365)).toDateString()
  );
  public endyear: Date = new Date(new Date().toDateString());
  seachSpinner1 = false;
  fullscreenFlag = false;

  ChartData: any;
  DynamicValue: any;

  ChartHeading = [];
  ChartTitle = [];

  CatchTitleIndex = 0;
  GloabalDateRange = {
    from_date: this.DateService.dateConvert(new Date(this.startyear)),
    to_date: this.DateService.dateConvert(new Date(this.endyear))
  };
  checked = "list";
  ViewTypes = [];
  @ViewChild("fullScreen", { static: false }) FullscreenRef;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    console.log(this.$CompacctAPI.CompacctCookies);
    this.Header.pushHeader({
      Header: "Business Dashboard",
      Link: "Business Dashboard"
    });
    this.ViewTypes = [
      { title: "List", value: "list", icon: "glyphicon glyphicon-th-large" },
      {
        title: "Grid",
        value: "grid",
        icon: "glyphicon glyphicon-align-justify"
      }
    ];
    this.GetTabsName();
    // this.FetchPatientCompacctChartData();
    this.renderer.listen(
      "document",
      "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange",
      e => {
        console.log(e);
      }
    );
    $("body").addClass("sidebar-collapse");
  }
  // ngAfterViewInit() {
  //   this.elementRef.nativeElement.querySelector('body')
  //     .addEventListener('', this.onClick.bind(this));
  // }
  GetTabsName() {
    this.$http
      .get("/Business_Dashboard/Get_Tab_List")
      .subscribe((data: any) => {
        this.ChartHeading = data ? JSON.parse(data) : [];
        this.GetChartTitle(this.ChartHeading[this.CatchTitleIndex].Report_Tab);
      });
  }
  GetChartTitle(report) {
    if (report) {
      this.$http
        .get("/Business_Dashboard/Get_Reports?Report_Tab=" + report)
        .subscribe((data: any) => {
          this.ChartTitle = data ? JSON.parse(data) : [];
          this.FetchCompacctChartData();
        });
    }
  }
  selectData(data) {
    console.log(data);
  }
  FetchCompacctChartData() {
    // this.$CompacctAPI.compacctSpinnerShow();
    const GlobalParamObj = {};
    const GlobalSubscribtionObj = {};
    const GlobalSubscribtionArr = [];
    for (let x = 0; x < this.ChartTitle.length; x++) {
      GlobalParamObj[x] = {
        ReportName: this.ChartTitle[x].report_name,
        StartDate: this.GloabalDateRange.from_date,
        EndDate: this.GloabalDateRange.to_date
      };
      GlobalSubscribtionObj[x] = this.$http.get(
        "/Business_Dashboard/Get_Hearing_Chart",
        {
          params: GlobalParamObj[x]
        }
      );
    }
    for (const prop in GlobalSubscribtionObj) {
      if (Object.prototype.hasOwnProperty.call(GlobalSubscribtionObj, prop)) {
        GlobalSubscribtionArr.push(GlobalSubscribtionObj[prop]);
      }
    }
    forkJoin(GlobalSubscribtionArr).subscribe((result: any) => {
      const dataArr = [];
      const DynamicData = [];
      for (let x = 0; x < GlobalSubscribtionArr.length; x++) {
        let obj = {};
        if (result[x]) {
          dataArr.push(JSON.parse(result[x]));
        } else {
          dataArr[x] = [];
        }
        obj = {
          title: this.ChartTitle[x].report_name,
          DynData: dataArr[x],
          ChartToBind: dataArr[x][0].DefaultChart,
          searchDetails: {
            reportname: this.ChartTitle[x].report_name + " - Details",
            StartDate: this.GloabalDateRange.from_date,
            EndDate: this.GloabalDateRange.to_date
          }
        };
        DynamicData.push(obj);
      }
      this.DynamicValue = DynamicData;
      this.seachSpinner1 = false;
      // this.$CompacctAPI.compacctSpinnerHide();
    });
  }
  SearchCompacctChartData() {
    this.seachSpinner1 = true;
    this.GetChartTitle(this.ChartHeading[this.CatchTitleIndex].Report_Tab);
  }

  //  DYNAMIC TAB TAB
  DynamicChangeTab(head) {
    console.log(head);
    this.seachSpinner1 = false;
    this.CatchTitleIndex = head.index;
    this.GetChartTitle(this.ChartHeading[head.index].Report_Tab);
  }
  // DATE FETCH
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.GloabalDateRange = {
        from_date: this.DateService.dateConvert(new Date(dateRangeObj[0])),
        to_date: this.DateService.dateConvert(new Date(dateRangeObj[1]))
      };
    }
  }

  openFullscreen(e) {
    if (
      $(e.target.parentNode.parentNode.parentNode.offsetParent).hasClass(
        "dynamic"
      )
    ) {
      $(e.target.parentNode.parentNode.parentNode.offsetParent).removeClass(
        "dynamic"
      );
    } else {
      $(e.target.parentNode.parentNode.parentNode.offsetParent).addClass(
        "dynamic"
      );
    }
  }
  ExportImg(e) {
    const elemt = $(
      e.target.parentNode.parentNode.parentNode.offsetParent
    ).find("canvas");
    const href = elemt[0].toDataURL("image/png");
    const link = document.createElement("a");
    link.href = href;
    link.download = "Download.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  fullscreenCallback() {
    console.log("ss");
  }
  DynamicIcon(chart) {
    if (chart === "BAR") {
      return "fa fa-fw fa-bar-chart";
    } else if (
      chart === "PIE" ||
      chart === "DOUGHNUT" ||
      chart === "POLARAREA"
    ) {
      return "fa fa-fw fa-pie-chart";
    } else if (chart === "LINE") {
      return "fa fa-fw fa-area-chart";
    } else if (chart === "STACKBAR") {
      return "fa fa-fw fa-line-chart";
    } else if (chart === "HORIZONTALBAR") {
      return "glyphicon glyphicon-indent-left";
    }
  }
}
