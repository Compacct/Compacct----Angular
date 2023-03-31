import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import {CompacctGetDistinctService } from "../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";
declare var $:any;
import * as XLSX from 'xlsx';
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { ActivatedRoute } from '@angular/router';
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-np-sup-tkt-sales-return-request',
  templateUrl: './np-sup-tkt-sales-return-request.component.html',
  styleUrls: ['./np-sup-tkt-sales-return-request.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NPSupTktSalesReturnRequestComponent implements OnInit {
  items:any = []
  tabIndexToView: number = 0;
  buttonname = "Save";
  ExecutiveList:any = []
  customarList:any = []
  ProductList:any = []
  ReasonReturnList:any = []
  objsaleReturn:saleReturn = new saleReturn()
  ObjaddSaleReturn:addSaleReturn = new addSaleReturn
  salereturnFormsSubmitted:boolean = false
  addSalereturnFormsSubmitted:boolean = false
  DocDate: any = {};
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService: DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE RETURN REQUEST"];
    this.Header.pushHeader({
      Header: "Sales Return Request",
      Link: "Ticket Management -> Sales Return Request"
    });
  }
  TabClick(e:any){
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE RETURN REQUEST"];
    this.buttonname = "Save";
    this.clearData()
  }
  clearData(){
    this.buttonname = "Save";
    this.salereturnFormsSubmitted = false
    this.objsaleReturn = new saleReturn()
    this.DocDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
  }
  onReject() {
    this.compacctToast.clear("c");
    this.ngxService.stop();
  }
  onConfirm(){

  }
  addSalereturn(valid:any){
    this.addSalereturnFormsSubmitted = true
    if(valid){
      this.addSalereturnFormsSubmitted = false
    }
  }
}

class saleReturn{
      Request_ID:any
      Sales_Man_ID:any
      Request_Date:any
      Sub_Ledger_ID:any
     Posted_By:any
}

class addSaleReturn {
  Product_ID:any
  Qty:any
  Reason_Of_Return:any
  Condition_Of_Goods:any
  Type_Of_Return:any
  Return_Text:any	
  Against_Challan_No:any
  Tax_Invoice_No:any
}