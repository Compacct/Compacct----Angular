import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { DateTimeConvertService } from './../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from './../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from './../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import { CompacctGlobalApiService } from './../../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-k4-c-stock-details',
  templateUrl: './k4-c-stock-details.component.html',
  styleUrls: ['./k4-c-stock-details.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4CStockDetailsComponent implements OnInit {
  tabIndexToView = 0;
  initDate: any = [];
  objsearch: search = new search();
  SearchedlistBrowse: any = [];
  AllCostCenter: any = [];
  CostCenterList: any = [];
  AllStockList: any = [];
  StockList: any = [];
  AllProductList: any = [];
  ProductList: any = [];
  seachSpinner: boolean = false;
  ViewOPQTYModal: boolean = false;
  ViewRECQTYModal: Boolean = false;
  ViewISSUQTYModal: Boolean = false;
  ViewCLOSQTYModal: Boolean = false;
  opningQTYlist: any = [];
  ReceiveQTYlist: any = [];
  IssueQTYlist: any = [];
  ClosingQTYlist: any = [];
  productId = undefined;
  DynamicHeaderOpningQTY: any = [];
  DynamicHeaderReceiveQTYlist: any = [];
  DynamicHeaderIssueQTYlist: any = [];
  DynamicHeaderClosingQTYlist: any = [];
  titleHeder: string = "";
  userType = "";
  DisablePop :boolean = false
  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
  ) {}

  ngOnInit() {
    this.header.pushHeader({
    Header: "Stock Details",
    Link: "Financial Management-> Master-> K4C Stock Details "
    })
   // this.Finyear();
    this.getCostCenter();
    this.getProdDetails();
    this.userType = this.$CompacctAPI.CompacctCookies.User_Type
  }
getDateRange(dateRangeObj){
    if (dateRangeObj.length) {
      console.log("dateRangeObj",dateRangeObj);
      this.objsearch.Start_Date = dateRangeObj[0];
      this.objsearch.End_Date = dateRangeObj[1];
    }
}

getAlldata(valid){
  this.seachSpinner = true;
  if (valid) {
const start = this.objsearch.Start_Date
? this.DateService.dateConvert(new Date(this.objsearch.Start_Date))
: this.DateService.dateConvert(new Date());
const end = this.objsearch.End_Date
? this.DateService.dateConvert(new Date(this.objsearch.End_Date))
: this.DateService.dateConvert(new Date());
      const tempobj = {
        Cost_Cen_ID: this.objsearch.Cost_Cen_ID ? this.objsearch.Cost_Cen_ID : 0 ,
        Godown_ID :this.objsearch.Godown_ID ? this.objsearch.Godown_ID :0 ,
        CAT_ID: this.objsearch.CAT_ID ? this.objsearch.CAT_ID :0,
        StDate: start,
        EndDate: end
      }
      const obj = {
        "SP_String": "SP_Stock_Report_New",
        "Report_Name_String": "Get_Stock_Details",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.SearchedlistBrowse = data;
        if (this.SearchedlistBrowse.length) {
          this.seachSpinner = false;
        }
        else {
          this.seachSpinner = false;
        }
       // console.log('SearchedlistBrowse<==>',this.SearchedlistBrowse)
      })
    }
}
getCostCenter() {
 this.AllCostCenter=[]; 
   this.CostCenterList = [];
     const obj = {
       "SP_String": "SP_Stock_Report_New",
       "Report_Name_String":"Get_Cost_Center",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.AllCostCenter = data;
     // console.log("AllCostCenter",this.AllCostCenter);
       this.AllCostCenter.forEach(el => {
         this.CostCenterList.push({
           label: el.Cost_Cen_Name,
           value: el.Cost_Cen_ID
         });
       });
        if (this.userType == "U") {
          this.DisablePop = true
          this.objsearch.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
          this.getStockDetails();
        }
        else {
          this.objsearch.Cost_Cen_ID = this.objsearch.Cost_Cen_ID;
          this.DisablePop = false
        }
     })  
}
getStockDetails() {
 this.AllStockList=[]; 
   this.StockList = [];
     const obj = {
       "SP_String": "SP_Stock_Report_New",
       "Report_Name_String": "Get_Stock_Point",
       "Json_Param_String": JSON.stringify({Cost_Cen_ID : this.objsearch.Cost_Cen_ID}) 
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.AllStockList = data;
     // console.log("AllStockList",this.AllStockList);
       this.AllStockList.forEach(el => {
         this.StockList.push({
           label: el.godown_name,
           value: el.godown_id
         });
       });
     })   
}
getProdDetails(){
  this.AllProductList=[]; 
   this.ProductList = [];
     const obj = {
       "SP_String": "SP_Stock_Report_New",
       "Report_Name_String":"Get_Product_Category",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.AllProductList = data;
     // console.log("AllProductList",this.AllProductList);
       this.AllProductList.forEach(el => {
         this.ProductList.push({
           label: el.Cat_Name,
           value: el.Cat_ID
         });
       });
     })  
  }
viewOpeningQTY(col){
this.titleHeder =""
  this.opningQTYlist = [];
  this.productId = undefined
  if (col.product_id) {
  this.titleHeder = col.PRODUCT_DESCRIPTION
  this.productId = col.product_id
const start = this.objsearch.Start_Date
? this.DateService.dateConvert(new Date(this.objsearch.Start_Date))
: this.DateService.dateConvert(new Date());
const end = this.objsearch.End_Date
? this.DateService.dateConvert(new Date(this.objsearch.End_Date))
: this.DateService.dateConvert(new Date());
  const tempobj = {
    Cost_Cen_ID:this.objsearch.Cost_Cen_ID ? this.objsearch.Cost_Cen_ID : 0,
    Godown_ID:this.objsearch.Godown_ID ?this.objsearch.Godown_ID : 0,
    StDate:start,
    EndDate:end,
    Product_ID:this.productId
  }
  const obj = {
    "SP_String": "SP_Stock_Report_New",
    "Report_Name_String": "Get_Product_Details_For_Openning",
    "Json_Param_String": JSON.stringify([tempobj])
  }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.opningQTYlist = data;
  if (this.opningQTYlist.length){
    this.DynamicHeaderOpningQTY = Object.keys(data[0]);
    // console.log(this.DynamicHeaderOpningQTY)
    this.ViewOPQTYModal = true

  }
  else {
    this.DynamicHeaderOpningQTY = [];
    this.ViewOPQTYModal = false;
  } 
})
}
}
viewReceiveQTY(col){
this.titleHeder =""
this.ReceiveQTYlist = [];
  this.productId = undefined
  if (col.product_id) {
  this.titleHeder = col.PRODUCT_DESCRIPTION
  this.productId = col.product_id
const start = this.objsearch.Start_Date
? this.DateService.dateConvert(new Date(this.objsearch.Start_Date))
: this.DateService.dateConvert(new Date());
const end = this.objsearch.End_Date
? this.DateService.dateConvert(new Date(this.objsearch.End_Date))
: this.DateService.dateConvert(new Date());
  const tempobj = {
    Cost_Cen_ID:this.objsearch.Cost_Cen_ID ? this.objsearch.Cost_Cen_ID : 0,
    Godown_ID:this.objsearch.Godown_ID ?this.objsearch.Godown_ID : 0,
    StDate:start,
    EndDate:end,
    Product_ID:this.productId
  }
  const obj = {
    "SP_String": "SP_Stock_Report_New",
    "Report_Name_String": "Get_Product_Details_For_Receive",
    "Json_Param_String": JSON.stringify([tempobj])
  }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ReceiveQTYlist = data;
  if (this.ReceiveQTYlist.length){
    this.DynamicHeaderReceiveQTYlist = Object.keys(data[0]);
    // console.log(this.DynamicHeaderOpningQTY)
    this.ViewRECQTYModal = true

  }
  else {
    this.DynamicHeaderReceiveQTYlist = [];
    this.ViewRECQTYModal =false
  } 
})
}
}
viewIssueQTY(col){
this.titleHeder =""
this.IssueQTYlist = [];
  this.productId = undefined
if (col.product_id) {
  this.titleHeder = col.PRODUCT_DESCRIPTION
  this.productId = col.product_id
const start = this.objsearch.Start_Date
? this.DateService.dateConvert(new Date(this.objsearch.Start_Date))
: this.DateService.dateConvert(new Date());
const end = this.objsearch.End_Date
? this.DateService.dateConvert(new Date(this.objsearch.End_Date))
: this.DateService.dateConvert(new Date());
  const tempobj = {
    Cost_Cen_ID:this.objsearch.Cost_Cen_ID ? this.objsearch.Cost_Cen_ID : 0,
    Godown_ID:this.objsearch.Godown_ID ?this.objsearch.Godown_ID : 0,
    StDate:start,
    EndDate:end,
    Product_ID:this.productId
  }
  const obj = {
    "SP_String": "SP_Stock_Report_New",
    "Report_Name_String": "Get_Product_Details_For_ISSUE",
    "Json_Param_String": JSON.stringify([tempobj])
  }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.IssueQTYlist = data;
  if (this.IssueQTYlist.length){
    this.DynamicHeaderIssueQTYlist = Object.keys(data[0]);
    // console.log(this.DynamicHeaderOpningQTY)
    this.ViewISSUQTYModal = true

  }
  else {
    this.DynamicHeaderIssueQTYlist = [];
    this.ViewISSUQTYModal =false
  } 
})
}
}
viewClosingQTY(col){
this.titleHeder =""
this.ClosingQTYlist = [];
  this.productId = undefined
if (col.product_id) {
  this.titleHeder = col.PRODUCT_DESCRIPTION
  this.productId = col.product_id
const start = this.objsearch.Start_Date
? this.DateService.dateConvert(new Date(this.objsearch.Start_Date))
: this.DateService.dateConvert(new Date());
const end = this.objsearch.End_Date
? this.DateService.dateConvert(new Date(this.objsearch.End_Date))
: this.DateService.dateConvert(new Date());
  const tempobj = {
    Cost_Cen_ID:this.objsearch.Cost_Cen_ID ? this.objsearch.Cost_Cen_ID : 0,
    Godown_ID:this.objsearch.Godown_ID ?this.objsearch.Godown_ID : 0,
    StDate:start,
    EndDate:end,
    Product_ID:this.productId
  }
  const obj = {
    "SP_String": "SP_Stock_Report_New",
    "Report_Name_String": "Get_Product_Details_For_Closing",
    "Json_Param_String": JSON.stringify([tempobj])
  }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ClosingQTYlist = data;
  if (this.ClosingQTYlist.length){
    this.DynamicHeaderClosingQTYlist = Object.keys(data[0]);
    // console.log(this.DynamicHeaderOpningQTY)
    this.ViewCLOSQTYModal = true

  }
  else {
    this.DynamicHeaderClosingQTYlist = [];
    this.ViewCLOSQTYModal =false
  } 
})
}
  }
GetExcelSheet(Arr,): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, "Stock Report"+'.xlsx');
  }
  
// Finyear(){
//     this.http
//       .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
//       .subscribe((res: any) => {
//       let data = JSON.parse(res)
//      this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
//       });
// }

}
class search{
  Start_Date: any;
  End_Date: any;
  Cost_Cen_ID: any;
  Godown_ID: any;
  CAT_ID: any;
}
