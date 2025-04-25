import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CommonUserActivityService } from "../../../../shared/compacct.services/common-user-activity.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service"
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-hearing-stock-report-new',
  templateUrl: './hearing-stock-report-new.component.html',
  styleUrls: ['./hearing-stock-report-new.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HearingStockReportNewComponent implements OnInit {
  StockReportFormSubmit:boolean = false;
  ObjStockReport: StockReport = new StockReport();
  CostCenterList:any = [];
  ProductCategoryList:any = [];
  printSpinner:boolean = false;
  AsOnDate: any;
  StockDetailsFormSubmit:boolean = false;
  ObjStockDetails: StockDetails = new StockDetails();
  CostCenterNameList:any = [];
  GodownList:any = [];
  ProductCategoryNameList:any = [];
  SearchSpinner:boolean = false;
  getStockDetailsList:any = [];
  getStockDetailsListHeader:any = [];

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private _CommonUserActivity : CommonUserActivityService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Stock Report",
      Link: " Material Management -> Report -> Stock Report"
    });
    this.GetCostCenter();
    this.GetProductCategory();
    this.GetCostCenterName();
    this.GetProductCategoryStockDetails();
  }

  GetCostCenter() {
    this.$CompacctAPI.getCostCenter().subscribe((res: any) => { 
      const data =  res ? JSON.parse(res) : [];
      data.forEach(e=>{
        e['label'] = e.Cost_Cen_Name;
        e['value'] = e.Cost_Cen_ID;
      });
      this.CostCenterList = data.length ? data : [];   
    });
  }
  GetProductCategory() {
    this.$http.get('/Master_Product_Category/GetAllData').subscribe((data: any) => {
      data.forEach(e=>{
        e['label'] = e.Cat_Name;
        e['value'] = e.Cat_ID;
      });
      this.ProductCategoryList = data ? data : [];
    });
  }
  GetStockValueReport(valid){}
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjStockDetails.from_date = dateRangeObj[0];
      this.ObjStockDetails.to_date = dateRangeObj[1];
    }
  }
  GetCostCenterName() {
    this.$CompacctAPI.getCostCenter().subscribe((res: any) => { 
      const data =  res ? JSON.parse(res) : [];
      data.forEach(e=>{
        e['label'] = e.Cost_Cen_Name;
        e['value'] = e.Cost_Cen_ID;
      });
      this.CostCenterNameList = data.length ? data : [];   
      this.ObjStockDetails.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.GetGodown(this.ObjStockDetails.Cost_Cen_ID);
    });
  }
  GetGodown(costCenID){
    this.GodownList = [];
    if (costCenID) {
      this.$http.post("/Common/Get_Godown_list", { 'Cost_Cent_ID': costCenID }).subscribe((data: any) => {
        this.GodownList = data ? JSON.parse(data) : [];
        this.ObjStockDetails.Godown_ID = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
      });
  }
  }
  GetProductCategoryStockDetails() {
    this.$http.get('/Master_Product_Category/GetAllData').subscribe((data: any) => {
      data.forEach(e=>{
        e['label'] = e.Cat_Name;
        e['value'] = e.Cat_ID;
      });
      this.ProductCategoryNameList = data ? data : [];
    });
  }
  async GetStockDetails(valid = true){

    // const resulit = await this._CommonUserActivity.GetUserActivity('test','testDetalis','test','0011')
    // console.log(resulit)
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){}

}
class StockReport {
  Report_Type: string;
  Report_By: string = "Vendor_Wise";
  Cost_Cen_ID: number;
  Product_Category_ID: number;
  as_on_date:string;
}
class StockDetails {
  from_date:string;
  to_date:string;
  Cost_Cen_ID: string;
  Godown_ID: string;
  Product_Category_ID: string;
}
