import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from "primeng/api";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-rep-stock-report-hbr',
  templateUrl: './rep-stock-report-hbr.component.html',
  styleUrls: ['./rep-stock-report-hbr.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class REPStockReportHBRComponent implements OnInit {
  tabIndexToView: number = 0;
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
  DistMaterial_Type_Harbauer:any=[];
  SelectedMaterial_Type_Harbauer: any=[];
  DistProductSubType:any = [];
  SelectedDistProductSubType:any = [];
  DistMaterialType:any = [];
  SelectedDistMaterial:any = [];
  viewHeader:string = "";
  DetalisView:boolean = false;
  popUpList:any = [];
  popUpListHeader:any = [];
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
  ClosingReportList:any = [];
  backUpClosingReportList:any = [];
  EXCELClosingSpinner:boolean = false;
  SelectedDistMatClStk:any = [];
  SelectedDistProTypeClStk:any = [];
  SelectedDistProSubTypeClStk:any = [];
  SelectedDistProDescriptionClStk:any = [];
  SelectedDistCostCenCS:any = [];
  SelectedDistStockPointCS:any = [];
  DistMatTypeClStk:any = [];
  DistProTypeClStk:any = [];
  DistProSubTypeClStk:any = [];
  DistProDescriptionClStk:any = [];
  DistCostCenCS:any = [];
  DistStockPointCS:any = [];
  allTotalObj:any = {}
  TotalProValue:any = undefined
  AgeingList:any = []
  clst_Cost_Cen_ID:any = undefined;
  clst_Godown_ID:any = undefined;
  costCenterClStkList:any = [];
  GodownClstkList:any = [];
  databaseName: any = undefined;
  report_Type: any = undefined;
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
   this.report_Type = 'Cost_Center_Wise';
   this.userType =this.$CompacctAPI.CompacctCookies.User_Type
   this.getCosCenter();
   this.Finyear()
  }
  onReject(){
  this.compacctToast.clear("c");
  }
  onConfirm(){}
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
     //console.log("Cost Center",data)
     data.forEach(el => {
      el['label'] = el.Cost_Cen_Name
      el['value'] = el.Cost_Cen_ID
    });
     this.costCenterList = data
     this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.clst_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
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
        //console.log("this.GodownList",this.GodownList);
        this.ObjBrowse.Godown_ID = this.GodownList.length ? this.GodownList[0].Godown_ID : undefined;
        this.clst_Godown_ID = this.GodownList.length ? this.GodownList[0].Godown_ID : undefined;
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
        Cost_Cen_ID: this.ObjBrowse.Cost_Cen_ID ? this.ObjBrowse.Cost_Cen_ID : 0,
        Godown_ID: this.ObjBrowse.Godown_ID ? this.ObjBrowse.Godown_ID : 0
      }
      const obj = {
        "SP_String": "REP_Stock_Report",
        "Report_Name_String": 'GET_STOCK',
        "Json_Param_String": JSON.stringify([CCTempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         //console.log('seacrching datas',data)
         this.stockList = data;
         this.backUpstockList = data;
         this.GetDistinct();
         this.getTotal(this.stockList)
         this.ngxService.stop();
      })
    }
  }
  FilterDist() {
    let materialType:any = [];
    let productType:any = [];
    let productSubType:any = [];
    let materialTypeHarbauer:any=[];
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
  if (this.SelectedMaterial_Type_Harbauer.length) {
    SearchFields.push('Materials_Type');
    materialTypeHarbauer = this.SelectedMaterial_Type_Harbauer;
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
      && (materialTypeHarbauer.length ? materialTypeHarbauer.includes(e['Materials_Type']) : true)
      && (productName.length ? productName.includes(e['PRODUCT_DESCRIPTION']) : true)
      && (CostCenterName.length ? CostCenterName.includes(e['Cost_Cen_Name']) : true)
      && (stockPoint.length ? stockPoint.includes(e['Stock_Point']) : true)
    });
  this.stockList = LeadArr.length ? LeadArr : [];
  } else {
  this.stockList = [...this.backUpstockList] ;
  }
  this.getTotal(this.stockList)
  }
  exportexcel(Arr): void {
    this.EXCELSpinner =true
     let excelData:any = []
    Arr.forEach(ele => {         
          excelData.push({
            'Stock Point': ele.Stock_Point,
            'Product classification': ele.Type_Of_Product,
            'Material-Type': ele.Materials_Type,
            'Product Type': ele.Product_Type,
            'Product Sub Type': ele.Product_Sub_Type,
            'Product Name': ele.PRODUCT_DESCRIPTION,
            'UOM': ele.UOM,
            // 'Rate': ele.Rate,
            'Opening': ele.OPENING_QTY,
            'Recieve': ele.RECV_QTY,
            'Issue/Used': ele.ISSUE_QTY,
            'Closing': ele.CLOSING_QTY
            })
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
    let materialTypeHarbauer:any=[];
    let productName:any = [];
    let costCenterName:any = []
    let stockPoint:any = []
    this.DistMaterialType =[];
    this.SelectedDistMaterial =[];
    this.DistProductType =[];
    this.SelectedDistProduct =[];
    this.DistProductSubType =[];
    this.SelectedDistProductSubType =[];
    this.DistMaterial_Type_Harbauer=[];
    this.SelectedMaterial_Type_Harbauer=[];
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
  if (materialTypeHarbauer.indexOf(item.Materials_Type) === -1) {
    materialTypeHarbauer.push(item.Materials_Type);
      this.DistMaterial_Type_Harbauer.push({ label: item.Materials_Type, value: item.Materials_Type });
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
  getTotal(arrList:any){
    if(arrList.length){
      this.allTotalObj.Total_Opening =0
        this.allTotalObj.Total_Recieve = 0
        this.allTotalObj.Total_IssueUsed = 0
        this.allTotalObj.Total_Closing = 0
      arrList.forEach(ele => {
        this.allTotalObj.Total_Opening = Number(Number(ele.OPENING_QTY) + Number(this.allTotalObj.Total_Opening)).toFixed(3)
        this.allTotalObj.Total_Recieve = Number(Number(ele.RECV_QTY) + Number(this.allTotalObj.Total_Recieve)).toFixed(3)
        this.allTotalObj.Total_IssueUsed = Number(Number(ele.ISSUE_QTY) + Number(this.allTotalObj.Total_IssueUsed)).toFixed(3)
        this.allTotalObj.Total_Closing = Number(Number(ele.CLOSING_QTY) + Number(this.allTotalObj.Total_Closing)).toFixed(3)
      });
    }
    //console.log(this.allTotalObj)
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
       //console.log(data);
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

}
class Browse {
  Cost_Cen_ID:Number			
  Godown_ID:any		
  StDate:any 				
  EndDate:any
  Product_Type_ID:Number
 }
