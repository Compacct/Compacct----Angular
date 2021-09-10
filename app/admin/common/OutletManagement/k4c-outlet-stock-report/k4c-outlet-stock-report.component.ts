import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-k4c-outlet-stock-report',
  templateUrl: './k4c-outlet-stock-report.component.html',
  styleUrls: ['./k4c-outlet-stock-report.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cOutletStockReportComponent implements OnInit {
  ObjBrowseStockReport : BrowseStockReport = new BrowseStockReport ();
  Outletid = [];
  GodownId = [];
  outletdisableflag = false;
  stockdisableflag = false;
  Searchlist = [];
  tabIndexToView = 0;
  seachSpinner = false;
  StockReportFormSubmitted = false;
  exceldisable = true;
  OpBalancePoppup = false;
  opbaldetails = [];
  OpBalanceList = [];
  Product_ID : any;
  OpBalance: any;

  constructor(
    private route : ActivatedRoute,
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    //this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Stock Report",
      Link: "Outlet Management -> Stock Report"
    });
    this.getOutlet();

  }
  TabClick(e){}
  getOutlet(){
    this.Searchlist = [];
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name All",
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Outletid = data;
     if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
     //this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
     this.ObjBrowseStockReport.Outlet = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.outletdisableflag = true;
     this.getGodown();
     } else {
      this.ObjBrowseStockReport.Outlet = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.outletdisableflag = false;
      this.getGodown();
     }
      console.log("this.Outletid ======",this.Outletid);

    });
  }
  getGodown(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID:this.ObjBrowseStockReport.Outlet}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.GodownId = data;
     this.ObjBrowseStockReport.Godown_Id = this.GodownId.length === 1 ? this.GodownId[0].godown_id : undefined;
     if(this.GodownId.length === 1){
       this.stockdisableflag = true;
     }else{
       this.stockdisableflag = false;
     }
      console.log("this.GodownId ======",this.GodownId);

    });
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseStockReport.start_date = dateRangeObj[0];
      this.ObjBrowseStockReport.end_date = dateRangeObj[1];
    }
  }
  SearchStockReport(valid){
    this.StockReportFormSubmitted = true;
    this.Searchlist = [];
    const start = this.ObjBrowseStockReport.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseStockReport.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseStockReport.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseStockReport.end_date))
      : this.DateService.dateConvert(new Date());
    //  if(this.ObjBrowseStockView.Choose_Report = "Stock Movement"){
      if(valid){
    const tempobj = {
      From_date : start,
      To_Date : end,
      Cost_Cen_ID : this.ObjBrowseStockReport.Outlet,
      Godown_id : this.ObjBrowseStockReport.Godown_Id,
      Heading : '',
      Product_ID : 0
    }
    const obj = {
      "SP_String": "SP_Stock_Report",
      "Report_Name_String": "Stock Movement",
      "Json_Param_String": JSON.stringify([tempobj]),
      // "Json_1_String": "NA",
      // "Json_2_String": "NA",
      // "Json_3_String": "NA",
      // "Json_4_String": "NA"
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Searchlist = data;
       console.log('Stock list=====',this.Searchlist)
       this.seachSpinner = false;
       this.StockReportFormSubmitted = false;
       this.exceldisable = false;
     })
    }
  }
  exportoexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
  OpBalPopup(ProductId,field){
    this.Product_ID = undefined;
    this.OpBalanceList =  [];
    //this.clearData();
    if(ProductId.Product_ID){
    this.Product_ID = ProductId.Product_ID;
    this.OpBalance = ProductId.Op_Balance;
     console.log("this.Product_ID ", this.Product_ID );
    this.getOpdetails(field);;
    }
   }
   getOpdetails(field){
     this.OpBalanceList = [];
    const start = this.ObjBrowseStockReport.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseStockReport.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseStockReport.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseStockReport.end_date))
      : this.DateService.dateConvert(new Date());
    const TempObj = {
      Product_ID : this.Product_ID,
      Heading : field,
      From_date : start,
      To_Date : end,
      Cost_Cen_ID : this.ObjBrowseStockReport.Outlet,
      Godown_id : this.ObjBrowseStockReport.Godown_Id
    }
    const obj = {
      "SP_String": "SP_Stock_Report",
      "Report_Name_String": "Stock Movement Column",
      "Json_Param_String": JSON.stringify([TempObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
        this.OpBalanceList = data;
        this.OpBalancePoppup = true;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "No data found"
        });

      }
      console.log("opbalance list ===", this.OpBalanceList)
    })
   }


}
class BrowseStockReport {
  start_date : Date ;
  end_date : Date;
  Outlet : number;
  Godown_Id : number;
}
