import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-good-receive-details',
  templateUrl: './good-receive-details.component.html',
  styleUrls: ['./good-receive-details.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class GoodReceiveDetailsComponent implements OnInit {
  // items:any = [];
  // tabIndexToView = 0;
  // menuList:any = [];
  ObjBrowse:Browse = new Browse();
  // StockSearchFormSubmitted:boolean = false;
  initDate:any = [];
  seachSpinner:boolean = false;
  BrowseList:any = [];
  EXCELSpinner:boolean =false;
  DynamicHeader:any = [];

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    // this.items = ["STOCK REPORT", "CLOSING REPORT"];
    // this.menuList = [
    //   { label: "Edit", icon: "pi pi-fw pi-user-edit" },
    //   { label: "Delete", icon: "fa fa-fw fa-trash" }
    // ];
    this.Header.pushHeader({
      Header: "Good Receice Details",
      Link: " Material Management -> Report -> Receice Details"
    });
   this.Finyear()
  }
  onReject(){}
  onConfirm(){}
   Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]

      });
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.Start_Date = dateRangeObj[0];
      this.ObjBrowse.End_Date = dateRangeObj[1];
    }
  }
  searchData(){
    this.seachSpinner = true;
    if(this.ObjBrowse.Start_Date && this.ObjBrowse.End_Date){
      this.ngxService.start();
      const start = this.ObjBrowse.Start_Date
      ? this.DateService.dateConvert(new Date(this.ObjBrowse.Start_Date))
      : this.DateService.dateConvert(new Date());
      const end = this.ObjBrowse.End_Date
      ? this.DateService.dateConvert(new Date(this.ObjBrowse.End_Date))
      : this.DateService.dateConvert(new Date());
      const CCTempobj={
        StDate: start,
        EndDate: end
      }
      const obj = {
        "SP_String": "REP_Stock_Report",
        "Report_Name_String": 'Goods_Receive_Details',
        "Json_Param_String": JSON.stringify([CCTempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log(data)
         this.BrowseList = data;
         if(this.BrowseList.length){
          this.DynamicHeader = Object.keys(data[0]);
        }
        else {
          this.DynamicHeader = [];
        }
         this.seachSpinner = false;
        //  this.GetDistinct();
         this.ngxService.stop();
      })
     
    }
  }
  exportexcel(Arr,fileName): void {
    this.EXCELSpinner = true;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
    this.EXCELSpinner = false;
  }

}
class Browse {		
  Start_Date:any 				
  End_Date:any
 }
