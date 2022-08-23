import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DateTimeConvertService } from '../../compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../compacct.services/common.api.service';
import { CompacctHeader } from '../../compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../compacct.services/compacct.global.api.service';
import { MessageService } from "primeng/api";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
import { NOTIMP } from 'dns';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class StockReportComponent implements OnInit {
  items:any = [];
  tabIndexToView = 0;
  menuList:any = [];
  ObjBrowse:Browse = new Browse();
  StockSearchFormSubmitted:boolean = false;
  initDate:any = [];
  costCenterList:any = [];
  GodownList:any = [];
  userType:string = "";
  seachSpinner:boolean = false;
  stockList:any = [];
  backUpstockList:any = [];
  DistProductType:any =[];
  SelectedDistProduct:any = [];
  DistProductSubType:any = [];
  SelectedDistProductSubType:any = [];
  DistMaterialType:any = [];
  SelectedDistMaterial:any = [];
  viewHeader:string = "";
  DetalisView:boolean = false;
  popUpList:any = [];
  popUpListHeader:any = [];
  report_Type:string = "Cost_Center_Wise";
  productTypeList:any = []
  EXCELSpinner:boolean =false;
  DistProductName:any = [];
  SelectedDistProductName:any = [];
  DistCostCen:any = [];
  SelectedDistCostCen:any = [];
  DistStockPoint:any = [];
  SelectedDistStockPoint:any = [];
  EXCELpopSpinner:boolean = false;
  ClosingReportSearchFormSubmitted:boolean = false;
  Report_Type:string = "Closing_Stock_Report";
  ObjClosingStockBrowse:ClosingStockBrowse = new ClosingStockBrowse();
  ClosingReportList:any = [];
  backUpClosingReportList:any = [];
  EXCELClosingSpinner:boolean = false;
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
    this.items = ["STOCK REPORT", "CLOSING REPORT"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
   this.userType =this.$CompacctAPI.CompacctCookies.User_Type
   this.getCosCenter();
   this.getProductType();
   this.Finyear()
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["STOCK REPORT", "CLOSING REPORT"];
    //this.ObjBrowseData = new BrowseData ()
  }
  onReject(){
    this.compacctToast.clear("c");
   }
   onConfirm(){

   }
   getDateRange(dateRangeObj){
    if (dateRangeObj.length) {
      this.ObjBrowse.StDate = dateRangeObj[0];
      this.ObjBrowse.EndDate = dateRangeObj[1];
    }
   }
   Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]

      });
  }
  getCosCenter(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Master_Cost_Center_Dropdown"
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("Cost Center",data)
     data.forEach(el => {
      el['label'] = el.Cost_Cen_Name
      el['value'] = el.Cost_Cen_ID
    });
     this.costCenterList = data
     this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
     this.GetgodownBrowse(this.ObjBrowse.Cost_Cen_ID);
    })
  }
  GetgodownBrowse(CostID){
    if(CostID){
      this.GodownList = [];
      const obj = {
        "SP_String": "SP_Txn_Requisition",
        "Report_Name_String": "Get_Cost_Center_Godown",
        "Json_Param_String": JSON.stringify([{Cost_Cen_ID : CostID}])
  
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.GodownList = data;
        console.log("this.GodownList",this.GodownList);
        this.ObjBrowse.Godown_ID = this.GodownList.length ? this.GodownList[0].Godown_ID : undefined
        })
    }
    else{
      this.GodownList = [];
      this.ObjBrowse.Godown_ID = undefined;
    }

   
  }
  searchData(valid){
    this.StockSearchFormSubmitted = true
    if(valid){
      this.ngxService.start();
      this.ObjBrowse.StDate = this.ObjBrowse.StDate ? this.DateService.dateConvert(new Date(this.ObjBrowse.StDate)) : this.DateService.dateConvert(new Date())
      this.ObjBrowse.EndDate = this.ObjBrowse.EndDate ? this.DateService.dateConvert(new Date(this.ObjBrowse.EndDate)) : this.DateService.dateConvert(new Date())
      this.ObjBrowse.Cost_Cen_ID = this.ObjBrowse.Cost_Cen_ID ? Number(this.ObjBrowse.Cost_Cen_ID) : 0
      this.ObjBrowse.Godown_ID = this.ObjBrowse.Godown_ID ? Number(this.ObjBrowse.Godown_ID) : 0
      this.ObjBrowse.Product_Type_ID = this.ObjBrowse.Product_Type_ID ? Number(this.ObjBrowse.Product_Type_ID) : 0
      const CCTempobj={
        StDate: this.ObjBrowse.StDate,
        EndDate: this.ObjBrowse.EndDate,
        Cost_Cen_ID: this.ObjBrowse.Cost_Cen_ID,
        Godown_ID: this.ObjBrowse.Godown_ID
      }
      const PtempObj = {
        StDate: this.ObjBrowse.StDate,
        EndDate: this.ObjBrowse.EndDate,
        Product_Type_ID : this.ObjBrowse.Product_Type_ID
      }
      const obj = {
        "SP_String": "REP_Stock_Report",
        "Report_Name_String": this.report_Type === 'Cost_Center_Wise'? "GET_STOCK" : "GET_Product_Wise_Stock",
        "Json_Param_String": this.report_Type === 'Cost_Center_Wise'? JSON.stringify([CCTempobj]):JSON.stringify([PtempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log(data)
         this.stockList = data;
         this.backUpstockList = data;
         this.GetDistinct();
         this.ngxService.stop();
      })
    }
  }
  FilterDist() {
    let materialType:any = [];
    let productType:any = [];
    let productSubType:any = [];
    let productName:any = [];
    let CostCenterName:any = [];
    let stockPoint:any = [];
    let SearchFields:any =[];
  if (this.SelectedDistMaterial.length) {
     SearchFields.push('Type_Of_Product');
      materialType = this.SelectedDistMaterial;
  }
  if (this.SelectedDistProduct.length) {
    SearchFields.push('Product_Type');
    productType = this.SelectedDistProduct;
  }
  if (this.SelectedDistProductSubType.length) {
    SearchFields.push('Product_Sub_Type');
    productSubType = this.SelectedDistProductSubType;
  }
  if (this.SelectedDistProductName.length) {
    SearchFields.push('PRODUCT_DESCRIPTION');
    productName = this.SelectedDistProductName;
  }
  if (this.SelectedDistCostCen.length) {
    SearchFields.push('Cost_Cen_Name');
    CostCenterName = this.SelectedDistCostCen;
  }
  if (this.SelectedDistStockPoint.length) {
    SearchFields.push('Stock_Point');
    stockPoint = this.SelectedDistStockPoint;
  }
  this.stockList = [];
  if (SearchFields.length) {
    let LeadArr = this.backUpstockList.filter(function (e) {
      return (materialType.length ? materialType.includes(e['Type_Of_Product']) : true)
      && (productType.length ? productType.includes(e['Product_Type']) : true)
      && (productSubType.length ? productSubType.includes(e['Product_Sub_Type']) : true)
      && (productName.length ? productName.includes(e['PRODUCT_DESCRIPTION']) : true)
      && (CostCenterName.length ? CostCenterName.includes(e['Cost_Cen_Name']) : true)
      && (stockPoint.length ? stockPoint.includes(e['Stock_Point']) : true)
    });
  this.stockList = LeadArr.length ? LeadArr : [];
  } else {
  this.stockList = [...this.backUpstockList] ;
  }
  
  }
  exportexcel(Arr): void {
    this.EXCELSpinner =true
     let excelData:any = []
    Arr.forEach(ele => {
        if( this.report_Type == 'Product_Wise'){
          excelData.push({
            'Cost Center Name': ele.Cost_Cen_Name,
            'Stock Point': ele.Stock_Point,
            'Material Type': ele.Type_Of_Product,
            'Product Type': ele.Product_Type,
            'Product Sub Type': ele.Product_Sub_Type,
            'Product Name': ele.PRODUCT_DESCRIPTION,
            'Opening': ele.OPENING_QTY,
            'Recieve': ele.RECV_QTY,
            'Issue/Used': ele.ISSUE_QTY,
            'Closing': ele.CLOSING_QTY
            })
        }
        else {
          excelData.push({
           'Stock Point': ele.Stock_Point,
            'Material Type': ele.Type_Of_Product,
            'Product Type': ele.Product_Type,
            'Product Sub Type': ele.Product_Sub_Type,
            'Product Name': ele.PRODUCT_DESCRIPTION,
            'Opening': ele.OPENING_QTY,
            'Recieve': ele.RECV_QTY,
            'Issue/Used': ele.ISSUE_QTY,
            'Closing': ele.CLOSING_QTY
            })
        }
        
    });


    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, 'stock_report.xlsx');
    this.EXCELSpinner = false
  }
  exportexcelpopup(arr){
    this.EXCELpopSpinner = true
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, 'stock_report.xlsx');
    this.EXCELpopSpinner = false
  }
  GetDistinct() {
    let materialType:any = [];
    let productType:any = [];
    let productSubType:any = [];
    let productName:any = [];
    let costCenterName:any = []
    let stockPoint:any = []
    this.DistMaterialType =[];
    this.SelectedDistMaterial =[];
    this.DistProductType =[];
    this.SelectedDistProduct =[];
    this.DistProductSubType =[];
    this.SelectedDistProductSubType =[];
    this.DistProductName = [];
    this.SelectedDistProductName = [];
    this.DistCostCen = [];
    this.SelectedDistCostCen = [];
    this.DistStockPoint = [];
    this.SelectedDistStockPoint = [];
    this.stockList.forEach((item) => {
   if (productType.indexOf(item.Product_Type) === -1) {
    productType.push(item.Product_Type);
   this.DistProductType.push({ label: item.Product_Type, value: item.Product_Type });
   }
  if (productSubType.indexOf(item.Product_Sub_Type) === -1) {
    productSubType.push(item.Product_Sub_Type);
    this.DistProductSubType.push({ label: item.Product_Sub_Type, value: item.Product_Sub_Type });
    }
  if (materialType.indexOf(item.Type_Of_Product) === -1) {
    materialType.push(item.Type_Of_Product);
    this.DistMaterialType.push({ label: item.Type_Of_Product, value: item.Type_Of_Product });
    }
  if (productName.indexOf(item.PRODUCT_DESCRIPTION) === -1) {
    productName.push(item.PRODUCT_DESCRIPTION);
    this.DistProductName.push({ label: item.PRODUCT_DESCRIPTION, value: item.PRODUCT_DESCRIPTION });
    }
  if (costCenterName.indexOf(item.Cost_Cen_Name) === -1) {
    costCenterName.push(item.Cost_Cen_Name);
    this.DistCostCen.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
    }
  if (stockPoint.indexOf(item.Stock_Point) === -1) {
    stockPoint.push(item.Stock_Point);
    this.DistStockPoint.push({ label: item.Stock_Point, value: item.Stock_Point });
    }
  });
     this.backUpstockList = [...this.stockList];
  }
  reportTypeChange(){
    this.DistMaterialType =[];
    this.SelectedDistMaterial =[];
    this.DistProductType =[];
    this.SelectedDistProduct =[];
    this.DistProductSubType =[];
    this.SelectedDistProductSubType =[];
    this.DistProductName = [];
    this.SelectedDistProductName = [];
    this.DistCostCen = [];
    this.SelectedDistCostCen = [];
    this.DistStockPoint = [];
    this.SelectedDistStockPoint = [];
    this.ObjBrowse = new Browse();
    this.stockList = [];
    this.backUpstockList = [];
    this.StockSearchFormSubmitted = false;
    this.getCosCenter();
    this.getProductType();
    this.Finyear()
  }
  qtyDetalis(col:any,text){
   
   if(col.Product_ID){
   
    const tempObj = {
      Cost_Cen_ID	: Number(col.Cost_Cen_ID),			
			Godown_ID	: Number(col.godown_id),
			StDate	:  this.ObjBrowse.StDate ? this.DateService.dateConvert(new Date(this.ObjBrowse.StDate)) : this.DateService.dateConvert(new Date()),				
			EndDate	: this.ObjBrowse.EndDate ? this.DateService.dateConvert(new Date(this.ObjBrowse.EndDate)) : this.DateService.dateConvert(new Date()),		
			Product_ID : Number(col.Product_ID)
    }
    const obj = {
      "SP_String": "REP_Stock_Report",
      "Report_Name_String": text,
      "Json_Param_String":JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log(data);
       this.viewHeader = (text.replace('_',' ')).split(" ").splice(-1)[0]+" QTY"
       this.popUpList = [];
      this.popUpListHeader = [];
      if(data.length){
        this.popUpList = data;
        this.popUpListHeader = Object.keys(data[0])
      }
      setTimeout(() => {
        this.DetalisView = true;
      }, 500);
    })
   }
  }
  getProductType(){
    const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_product_Type_For_Stock",
      "Json_Param_String":JSON.stringify([{PROJECT_ID : 0}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Product_Type
        el['value'] = el.Product_Type_ID
      });
       
      this.productTypeList = data;
     console.log("productTypeList",this.productTypeList);
     })
  }
  getDateRangeClosingReport(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjClosingStockBrowse.Start_Date = dateRangeObj[0];
      this.ObjClosingStockBrowse.End_Date = dateRangeObj[1];
    }
  }
  searchClosingReportData(valid){
    this.ClosingReportSearchFormSubmitted = true
    this.seachSpinner = true;
    if(valid){
      this.ngxService.start();
      const start = this.ObjClosingStockBrowse.Start_Date
      ? this.DateService.dateConvert(new Date(this.ObjClosingStockBrowse.Start_Date))
      : this.DateService.dateConvert(new Date());
      const end = this.ObjClosingStockBrowse.End_Date
      ? this.DateService.dateConvert(new Date(this.ObjClosingStockBrowse.End_Date))
      : this.DateService.dateConvert(new Date());
      if(this.Report_Type === "Closing_Stock_Report") {
      //   console.log(start)
      //   console.log(end)
      if(start && end) {
      window.open("/Report/Crystal_Files/MICL/Closing_Stock.aspx?From_Date=" + start + "&" + "To_Date=" + end, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      this.ClosingReportSearchFormSubmitted = false;
      this.seachSpinner = false;
      this.ngxService.stop();
      }
      }
      else {
      const CCTempobj={
        StDate: start,
        EndDate: end
      }
      const obj = {
        "SP_String": "REP_Stock_Report",
        "Report_Name_String": this.Report_Type === 'Closing_Stock_High_Value'? "Closing_Stock_High_Value" : "Closing_Stock_Low_Value",
        "Json_Param_String": JSON.stringify([CCTempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log(data)
         this.ClosingReportList = data;
         this.backUpClosingReportList = data;
         this.ClosingReportSearchFormSubmitted = false;
         this.seachSpinner = false;
        //  this.GetDistinct();
         this.ngxService.stop();
      })
     }
    }
  }
  exportexcel2(Arr,fileName): void {
    this.EXCELClosingSpinner = true;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
    this.EXCELClosingSpinner = false;
  }
}
class Browse {
  Cost_Cen_ID:Number			
  Godown_ID:any		
  StDate:any 				
  EndDate:any
  Product_Type_ID:Number
 }
 class ClosingStockBrowse {
  Start_Date:any 				
  End_Date:any
 }