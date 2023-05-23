import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { data, escapeSelector } from "jquery";
import { Console, timeStamp } from "console";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ExportExcelService } from "../../../shared/compacct.services/export-excel.service";

@Component({
  selector: 'app-hr-coupon-report',
  templateUrl: './hr-coupon-report.component.html',
  styleUrls: ['./hr-coupon-report.component.css'],
  providers:[MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HrCouponReportComponent implements OnInit {
  ObjBrowse:Browse = new Browse()
  seachSpinner:boolean = false
 
  constructor(
    private http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private route : ActivatedRoute,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService,
    private _exportExcel : ExportExcelService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header:  " HR Coupon Report" ,
      Link: "HR-> HR Coupon Report " 
    });
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.From_date = dateRangeObj[0];
      this.ObjBrowse.To_date = dateRangeObj[1];
    }
  }
  SearchData(){

    const start =  this.ObjBrowse.From_date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_date))
    : this.DateService.dateConvert(new Date());
    const end =   this.ObjBrowse.To_date
    ? this.DateService.dateConvert(new Date( this.ObjBrowse.To_date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
      StartDate  : start,
      EndDate  : end,
    }

    const obj = {
      "SP_String": "SP_MICL_HR_Coupon_Report",
      "Report_Name_String": 'FACTORY CANTEEN DETAILS',
      "Json_Param_String": JSON.stringify([tempobj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      
      if(data.length){
        this.GetSTATEMENTData(data)
      }
    })
 }

 GetSTATEMENTData(data1){
  const start =  this.ObjBrowse.From_date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_date))
    : this.DateService.dateConvert(new Date());
    const end =   this.ObjBrowse.To_date
    ? this.DateService.dateConvert(new Date( this.ObjBrowse.To_date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
      StartDate  : start,
      EndDate  : end,
    }

    const obj = {
      "SP_String": "SP_MICL_HR_Coupon_Report",
      "Report_Name_String": 'STATEMENT OF DAILY MEALS',
      "Json_Param_String": JSON.stringify([tempobj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("data",data)
      this._exportExcel.exporttoExcelCouponReport(data1,data,tempobj) 
    })
 }
}
class Browse {
  From_date : Date;
  To_date : Date;
 }