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
import { ExportExcelService } from '../../../../shared/compacct.services/export-excel.service';

@Component({
  selector: 'app-hearing-stock-report-new',
  templateUrl: './hearing-stock-report-new.component.html',
  styleUrls: ['./hearing-stock-report-new.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HearingStockReportNewComponent implements OnInit {
  tabIndexToView = 0;
  items:any = [];
  StockReportFormSubmit:boolean = false;
  ObjStockReport: StockReport = new StockReport();
  CostCenterList:any = [];
  ProductCategoryList:any = [];
  printSpinner:boolean = false;
  AsOnDate:any = new Date();
  StockDetailsFormSubmit:boolean = false;
  ObjStockDetails: StockDetails = new StockDetails();
  CostCenterNameList:any = [];
  GodownList:any = [];
  ProductCategoryNameList:any = [];
  SearchSpinner:boolean = false;
  getStockDetailsList:any = [];
  getStockDetailsListHeader:any = [];
  ProDetailsPopup:boolean = false;
  ProDetailsList:any = [];
  ProDetailsListHeader:any = [];
  product_id:any;
  productname:any;
  remarks:any;
  SerialOrBatchDetailsPopup:boolean = false;
  SerialOrBatchDetailsList:any = [];
  SerialOrBatchDetailsListHeader:any = [];
  SerialBatchNo:any;
  ObjStockRegister: StockRegister = new StockRegister();
  StockRegisterFormSubmit:boolean = false;
  CostCenterNameStockRegList:any = [];
  GodownregList:any = [];
  getStockRegisterList:any = [];
  StockRegSpinner:boolean = false;

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private _CommonUserActivity : CommonUserActivityService,
    private excelservice: ExportExcelService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Stock Report",
      Link: " Material Management -> Report -> Stock Report"
    });
     this.items = ["STOCK REPORT", "STOCK REGISTER"];
     this.GetCostCenter();
     this.GetProductCategory();
     this.GetCostCenterName();
     this.GetProductCategoryStockDetails();
     this.GetCostCenterNameStockReg();
  }
  TabClick(e){
     this.tabIndexToView = e.index;
     this.items = ["STOCK REPORT", "STOCK REGISTER"];
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
  GetStockValueReport(valid){
    this.StockReportFormSubmit = true;
    let Report_Type = this.ObjStockReport.Report_Type
    let Cost_Cen_ID = this.ObjStockReport.Cost_Cen_ID ? this.ObjStockReport.Cost_Cen_ID : 0
    let Cat_ID = this.ObjStockReport.Product_Category_ID ? this.ObjStockReport.Product_Category_ID : 0
    let Report_By = this.ObjStockReport.Report_By
    let AsOnDate = this.DateService.dateConvert(new Date(this.AsOnDate))
    if(valid){
      this.StockReportFormSubmit = false;
      window.open("/Report/Crystal_Files/Stock/Stock/Hearing_Stock_with_value.aspx?Report_Type=" + Report_Type + "&Cost_Cen_ID=" + Cost_Cen_ID +
        "&Cat_ID=" + Cat_ID + "&Report_By=" + Report_By + "&AsOnDate=" + AsOnDate, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
    
        );
    }
  }
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
  GetStockDetails(valid){
    this.StockDetailsFormSubmit = true;
    this.getStockDetailsList = [];
    this.getStockDetailsListHeader = [];
    const start = this.ObjStockDetails.from_date
      ? this.DateService.dateConvert(new Date(this.ObjStockDetails.from_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjStockDetails.to_date
      ? this.DateService.dateConvert(new Date(this.ObjStockDetails.to_date))
      : this.DateService.dateConvert(new Date());
    if(valid){
      this.StockDetailsFormSubmit = false;
      this.SearchSpinner = true;
      const tempobj = {
        start_date : start,
        end_date : end,
        CAT_ID : this.ObjStockDetails.Product_Category_ID ? this.ObjStockDetails.Product_Category_ID : 0,
        Godown_ID : this.ObjStockDetails.Godown_ID ? this.ObjStockDetails.Godown_ID : 0,
        CostCenter : this.ObjStockDetails.Cost_Cen_ID ? this.ObjStockDetails.Cost_Cen_ID : 0
      }
      
      const obj = {
        "SP_String": "sp_txn_stock_details",
        "Report_Name_String": "txn_stock_details",
        "Json_Param_String": JSON.stringify([tempobj])
      }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         if(data.length) {
          this.getStockDetailsList = data;
          this.getStockDetailsListHeader = Object.keys(data[0]);
          this.SearchSpinner = false;
         }
         else {
          this.SearchSpinner = false;
         }
       })
      //}
    }
    
  }
  GetProductDetails(dataobj,remark){
    this.ProDetailsList = [];
    this.ProDetailsListHeader = [];
    this.product_id = undefined; 
    this.productname = undefined;
    this.remarks = remark;
    const start = this.ObjStockDetails.from_date
      ? this.DateService.dateConvert(new Date(this.ObjStockDetails.from_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjStockDetails.to_date
      ? this.DateService.dateConvert(new Date(this.ObjStockDetails.to_date))
      : this.DateService.dateConvert(new Date());
    this.product_id = dataobj.Product_ID;
    this.productname = dataobj.Product_Description
    if (dataobj.Product_ID) {
      const sendobj = {
        start_date: start,
        end_date: end,
        Product_ID : dataobj.Product_ID,
        CAT_ID: this.ObjStockDetails.Product_Category_ID ? this.ObjStockDetails.Product_Category_ID : 0,
        Godown_ID: this.ObjStockDetails.Godown_ID ? this.ObjStockDetails.Godown_ID : 0,
        CostCenter: this.ObjStockDetails.Cost_Cen_ID ? this.ObjStockDetails.Cost_Cen_ID : 0,
        remark: remark
      }
    const obj = {
      "SP_String": "sp_txn_stock_details",
      "Report_Name_String": "txn_stock_serial_batch_details",
      "Json_Param_String": JSON.stringify(sendobj)
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.ProDetailsList = data;
        this.ProDetailsListHeader = Object.keys(data[0]);
        this.ProDetailsPopup = true;
      } else {
        this.ProDetailsList = [];
        this.ProDetailsListHeader = [];
        this.ProDetailsPopup = false;
      }
    });
    }
  }
  GetSerialOrBatchDetails(SerialOrBatchNo){
    this.SerialOrBatchDetailsList = [];
    this.SerialOrBatchDetailsListHeader = [];
    const start = this.ObjStockDetails.from_date
      ? this.DateService.dateConvert(new Date(this.ObjStockDetails.from_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjStockDetails.to_date
      ? this.DateService.dateConvert(new Date(this.ObjStockDetails.to_date))
      : this.DateService.dateConvert(new Date());
    if (SerialOrBatchNo) {
      this.SerialBatchNo = SerialOrBatchNo;
      const sendobj = {
        textbox : SerialOrBatchNo,
        Godown_ID: this.ObjStockDetails.Godown_ID ? this.ObjStockDetails.Godown_ID : 0,
        CostCenter: this.ObjStockDetails.Cost_Cen_ID ? this.ObjStockDetails.Cost_Cen_ID : 0,
        Product_ID: this.product_id
      }
    const obj = {
      "SP_String": "sp_txn_stock_details",
      "Report_Name_String": "Find Serial No",
      "Json_Param_String": JSON.stringify(sendobj)
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.SerialOrBatchDetailsList = data;
        this.SerialOrBatchDetailsListHeader = Object.keys(data[0]);
        this.SerialOrBatchDetailsPopup = true;
      } else {
        this.SerialOrBatchDetailsList = [];
        this.SerialOrBatchDetailsListHeader = [];
        this.SerialOrBatchDetailsPopup = false;
      }
    });
    }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){}

  getDateRangeStockRegister(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjStockRegister.from_date = dateRangeObj[0];
      this.ObjStockRegister.to_date = dateRangeObj[1];
    }
  }
  GetCostCenterNameStockReg() {
    this.CostCenterNameStockRegList = [];
    this.$CompacctAPI.getCostCenter().subscribe((res: any) => { 
      const data =  res ? JSON.parse(res) : [];
      data.forEach(e=>{
        e['label'] = e.Cost_Cen_Name;
        e['value'] = e.Cost_Cen_ID;
      });
      this.CostCenterNameStockRegList = data.length ? data : [];   
      this.ObjStockRegister.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.GetGodownStockReg(this.ObjStockRegister.Cost_Cen_ID);
    });
  }
  GetGodownStockReg(costCenID){
    this.GodownregList = [];
    if (costCenID) {
      this.$http.post("/Common/Get_Godown_list", { 'Cost_Cent_ID': costCenID }).subscribe((data: any) => {
        this.GodownregList = data ? JSON.parse(data) : [];
        this.ObjStockRegister.Godown_ID = this.GodownregList.length === 1 ? this.GodownregList[0].godown_id : undefined;
      });
  }
  }
  GetStockRegister(valid){
    this.StockRegisterFormSubmit = true;
    this.getStockRegisterList = [];
    const start = this.ObjStockRegister.from_date
      ? this.DateService.dateConvert(new Date(this.ObjStockRegister.from_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjStockRegister.to_date
      ? this.DateService.dateConvert(new Date(this.ObjStockRegister.to_date))
      : this.DateService.dateConvert(new Date());
    if(valid){
      this.StockRegisterFormSubmit = false;
      this.StockRegSpinner = true;
      const tempobj = {
        start_date : start,
        end_date : end,
        CostCenter : this.ObjStockRegister.Cost_Cen_ID ? this.ObjStockRegister.Cost_Cen_ID : 0,
        Godown_ID : this.ObjStockRegister.Godown_ID ? this.ObjStockRegister.Godown_ID : 0
      }
      
      const obj = {
        "SP_String": "sp_txn_stock_details",
        "Report_Name_String": "txn_stock_register",
        "Json_Param_String": JSON.stringify([tempobj])
      }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         if(data.length) {
          this.getStockRegisterList = data;
          this.StockRegSpinner = false;
          this.excelservice.ExportToExcelSaleRegister(this.getStockRegisterList);
         }
         else {
          this.StockRegSpinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "No data found."
          });
         }
       })
      //}
    }
    
  }
  ExportToExcelData(valid){
    const data = [
      {
        "Company": "WIDEX",
        "PRODUCT/COMPANY/SINo-.": "MOMENT MRR2D-440-DEMO",
        "MRP": "Demo",
        "Serial No.": "123",
        "Opening Stock": "0",
        "Rcd from H.O/BRANCHES": "",
        "MRN of Patient": "",
        "Direct Purchase from company": "1",
        "Sold to patient": "1",
        "Returned to Company": "",
        "Tfd to Ho/Other Centers": "",
        "CLOSING BALANCE": "0",
        "Trial Out": "",
        "Trial In": "",
        "Trial Out/ Loaner": "",
        "PHYSICAL BALANCE": "0",
        "Sale Comment": "",
        "Demo / Standby Comment": ""
      },
      {
        "Company": "WIDEX",
        "PRODUCT/COMPANY/SINo-.": "MOMENT MRR2D-440-DEMO",
        "MRP": "Demo",
        "Serial No.": "123",
        "Opening Stock": "0",
        "Rcd from H.O/BRANCHES": "",
        "MRN of Patient": "",
        "Direct Purchase from company": "1",
        "Sold to patient": "1",
        "Returned to Company": "",
        "Tfd to Ho/Other Centers": "",
        "CLOSING BALANCE": "0",
        "Trial Out": "",
        "Trial In": "",
        "Trial Out/ Loaner": "",
        "PHYSICAL BALANCE": "0",
        "Sale Comment": "",
        "Demo / Standby Comment": ""
      },
      {
        "Company": "GN RESOUND",
        "PRODUCT/COMPANY/SINo-.": "EN588-DW DEMO",
        "MRP": "Demo",
        "Serial No.": "456",
        "Opening Stock": "0",
        "Rcd from H.O/BRANCHES": "",
        "MRN of Patient": "",
        "Direct Purchase from company": "1",
        "Sold to patient": "1",
        "Returned to Company": "",
        "Tfd to Ho/Other Centers": "",
        "CLOSING BALANCE": "0",
        "Trial Out": "",
        "Trial In": "",
        "Trial Out/ Loaner": "",
        "PHYSICAL BALANCE": "0",
        "Sale Comment": "",
        "Demo / Standby Comment": ""
      },
      {
        "Company": "GN RESOUND",
        "PRODUCT/COMPANY/SINo-.": "EN588-DW DEMO",
        "MRP": "Demo",
        "Serial No.": "456",
        "Opening Stock": "0",
        "Rcd from H.O/BRANCHES": "",
        "MRN of Patient": "",
        "Direct Purchase from company": "1",
        "Sold to patient": "1",
        "Returned to Company": "",
        "Tfd to Ho/Other Centers": "",
        "CLOSING BALANCE": "0",
        "Trial Out": "",
        "Trial In": "",
        "Trial Out/ Loaner": "",
        "PHYSICAL BALANCE": "0",
        "Sale Comment": "",
        "Demo / Standby Comment": ""
      }
    ]
    this.excelservice.ExportToExcelSaleRegister(data);
  }

  // async GetStockDetails(valid = true){
  //   const resulit = await this._CommonUserActivity.GetUserActivity('test','testDetalis','test','0011')
  //   console.log(resulit)
  // }

}
class StockReport {
  Report_Type: string = "All";
  Report_By: string = "Vendor Wise";
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
class StockRegister {
  from_date:string;
  to_date:string;
  Cost_Cen_ID: string;
  Godown_ID: string;
  Product_Category_ID: string;
}
