import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import * as moment from "moment";

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
  ProductSubTypeID = 0

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
      const params = new HttpParams()
        .set("Product_Type_ID", this.ProductTypeID.toString())
        .set("Product_Sub_Type_ID", this.ProductSubTypeID.toString());
      this.$http
        .get("'/CRM_Stock_Report/Get_Product_Stock", { params })
        .subscribe((data: any) => {
          this.StockReportList = data.length ? data : [];
          this.FecthData();
          this.seachSpinner = false;
        });
    }
  }
  FecthData() {

  }

}
