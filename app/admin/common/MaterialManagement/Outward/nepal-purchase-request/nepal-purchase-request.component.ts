import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { IfStmt, THIS_EXPR, ThrowStmt } from "@angular/compiler/src/output/output_ast";

import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctProjectComponent } from "../../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component";
import { ActivatedRoute } from "@angular/router";
import { DateNepalConvertService } from "../../../../shared/compacct.global/dateNepal.service"
declare var NepaliFunctions: any;
const NepaliDate = require('nepali-date');

@Component({
  selector: 'app-nepal-purchase-request',
  templateUrl: './nepal-purchase-request.component.html',
  styleUrls: ['./nepal-purchase-request.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalPurchaseRequestComponent implements OnInit {
  items:any = []
  tabIndexToView:number = 0
  buttonname = "Save"
  objpurchaseRequest:purchaseRequest = new purchaseRequest()
  productList:any = []
  purchaseRequestFormSubmit:boolean = false
  constructor(private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.items =  ["BROWSE", "CREATE"];
    this.Header.pushHeader({
     Header: "Purchase Request",
     Link: "Material Management -> Outward -> Purchase Request"
   });
   this.GetproductList()
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData(){
    this.items = ["BROWSE", "CREATE"];
    this.tabIndexToView = 0
    this.buttonname = "Save"
    this.objpurchaseRequest = new purchaseRequest()
  }
  onConfirm(){}
  onReject(){
    this.compacctToast.clear("c");
  }
  GetproductList(){
    const obj = {
      "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
      "Report_Name_String": "Browse_Requisition_From_Salesman"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if(data.length){
        data.forEach((xy:any) => {
         xy['label'] = xy.Product_Description
         xy['value'] = xy.Product_ID
        });
       this.productList = data
      }
   
     });
  }
  getUOM(){
    if(this.objpurchaseRequest.Product_ID){
      this.objpurchaseRequest.UOM = undefined
     const FilterproductList = this.productList.find((xz:any)=> Number(xz.Product_ID) == Number(this.objpurchaseRequest.Product_ID))
      this.objpurchaseRequest.UOM = FilterproductList ? FilterproductList.UOM : undefined
      this.objpurchaseRequest.Requisition_Qty = FilterproductList ? FilterproductList.Requisition_Qty : undefined
    }
    else{
     this.objpurchaseRequest.UOM = undefined
    }
   }
}
class purchaseRequest{
  Purchase_Request_No:any
  Purchase_Request_Date :any
  User_ID :any
  Product_ID :any			                  
  Requisition_Qty:any
  UOM :any
  Purchase_Request_Qty:any
}