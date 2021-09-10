import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import * as moment from "moment";
declare var $:any;

@Component({
  selector: 'app-compacct-stock-report',
  templateUrl: './compacct-stock-report.component.html',
  styleUrls: ['./compacct-stock-report.component.css'],
  providers: [MessageService]
})
export class CompacctStockReportComponent implements OnInit {
  url = window["config"];
  buttonname = "Create";
  Spinner = false;
  seachSpinner = false;

  ProductTypeList = [];
  ProductSubTypeList = [];
  StockReportList = [];

  ProductTypeID = 0;
  ProductSubTypeID = 0;

  DistinctStructure = [];
  DynamicKey = [];

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {this.Header.pushHeader({
    Header: "Stock Report",
    Link: " Material Management -> Report ->  Stock Report"
  });
  this.GetProductType();
  }
   // FUNCTION
  GetProductType() {
    this.ProductTypeList = [];
    this.$http.get('/Master_Product_Type/Master_Product_Type_Browse').subscribe((data: any) => {
      this.ProductTypeList = data ? JSON.parse(data) : [];
    });
  }
  GetProductSubType(ProductType) {
    this.ProductSubTypeList = [];
    this.ProductSubTypeID = 0
    if(ProductType) {
      this.$http
      .get('/Master_Product_Sub_Type/Master_Product_Sub_Type_Get_All_Data?Product_Type_ID=' + ProductType)
      .subscribe((data: any) => {
        this.ProductSubTypeList = data ? JSON.parse(data) : [];
      });
    }

  }


  // SERACH
  SearchStockReport(valid) {
    this.StockReportList = [];
    if (valid) {
      this.seachSpinner = true;
      const ProductTypeID  = this.ProductTypeID ? this.ProductTypeID.toString() : '0';
      const ProductSubTypeID= this.ProductSubTypeID ? this.ProductSubTypeID.toString() : '0';
      const params = new HttpParams()
        .set("Product_Type_ID", ProductTypeID)
        .set("Product_Sub_Type_ID", ProductSubTypeID);
      this.$http
        .get("/CRM_Stock_Report/Get_Product_Stock", { params })
        .subscribe((data: any) => {
          this.StockReportList = data ? JSON.parse(data) : [];
          console.log(this.StockReportList)
          this.FecthData();
          this.seachSpinner = false;
        });
    }
  }
  FecthData() {
    this.DistinctStructure = [];
    const processed1 = [];
    this.DynamicKey = this.StockReportList.length ? Object.keys(this.StockReportList[0]):[];
    for(let i = 0; i < this.StockReportList.length; i++) {

      if (processed1.indexOf(this.StockReportList[i].Product_Type)<0) {
        processed1.push(this.StockReportList[i].Product_Type);
        this.DistinctStructure.push({
          Product_Type:this.StockReportList[i].Product_Type,
          ToggleFlag: false,
          Product_Sub_Type_Flag : false,
          Sub_dist_Item: [],
          Product_Sub_Type_List : []
        });
      }
    }
    const processed2 = [];
    for(let i = 0; i < this.DistinctStructure.length; i++) {
      const productType = this.DistinctStructure[i].Product_Type;
      const tempArr1 = $.grep(this.StockReportList,function(obj) { return obj.Product_Type === productType});
      for(let k = 0; k < tempArr1.length; k++) {
        if (processed1.indexOf(tempArr1[k].Product_Sub_Type)<0) {
          processed1.push(tempArr1[k].Product_Sub_Type);
          this.DistinctStructure[i].Product_Sub_Type_Flag = true;
          this.DistinctStructure[i].Product_Sub_Type_List.push({
            Product_Sub_Type:tempArr1[k].Product_Sub_Type,
            ToggleFlag: false,
            Product_Flag : false,
            Product_List : []
          });
        }
      }
    }
    const processed3 = [];
    for(let i = 0; i < this.DistinctStructure.length; i++) {
      for(let k = 0; k <  this.DistinctStructure[i].Product_Sub_Type_List.length; k++) {
      const productType = this.DistinctStructure[i].Product_Type;
      const productsUBType = this.DistinctStructure[i].Product_Sub_Type_List[k].Product_Sub_Type;
      const tempArr1 = $.grep(this.StockReportList,function(obj) { return obj.Product_Type === productType && obj.Product_Sub_Type === productsUBType});

      for(let l = 0; l < tempArr1.length; l++) {
        this.DistinctStructure[i].Product_Flag = true;
        this.DistinctStructure[i].Product_Sub_Type_List[k].Product_List.push(tempArr1[l]);
      }
      }
    }
    console.log(this.DistinctStructure)
  }
  getStockFuncList (productSubtype , productType) {
    const tempArr = $.grep(this.StockReportList,function(obj) { return obj.productType === productType && obj.Product_Sub_Type === productSubtype});
   return tempArr;
  }
  GetTotal(Arr){
    let count = 0;
    for(let i = 0; i < Arr.length; i++) {
      if(Arr[i].Product) {
        count += Number(Arr[i].AKS);
        count += Number(Arr[i].BFP );
        count += Number(Arr[i].BKH);
        count += Number(Arr[i].BRT);
        count += Number(Arr[i].BUTWAL);
        count += Number(Arr[i].CHN);
        count += Number(Arr[i].KCL);
        count += Number(Arr[i].KRISHNA);
        count += Number(Arr[i].KTM);
        count += Number(Arr[i].NIRMAL);
        count += Number(Arr[i].TA00001);
        count += Number(Arr[i].TAPP);
        count += Number(Arr[i].VKS);

      }
    }
    return count;
  }
}
