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
  addpurchaList:any = []
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
    this.addpurchaList = []
  }
  onConfirm(){}
  onReject(){
    this.compacctToast.clear("c");
  }
  GetproductList(){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Product_Purchase_Request"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("data",data)
      if(data.length){

        data.forEach((xy:any) => {
         xy['label'] = xy.Product_Name
         xy['value'] = xy.Product_ID
        });
       this.productList = data
      }
   
     });
  }
  getUOM(){
    if(this.objpurchaseRequest.Product_ID){
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Get_Data_From_Requisition_Salesman",
        "Json_Param_String": JSON.stringify([{Product_ID : this.objpurchaseRequest.Product_ID}])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
       if(data.length){
        this.objpurchaseRequest.Requisition_Qty = data[0].Requisition_Qty
        this.objpurchaseRequest.UOM = data[0].UOM
       }
      })
    }
    else{
     this.objpurchaseRequest.UOM = undefined
    }
   }
   addpur(valid:any){
    this.purchaseRequestFormSubmit = true
    if(valid){
      const filterproductList = this.productList.find((x:any)=> Number(x.Product_ID) == Number(this.objpurchaseRequest.Product_ID) )
       this.addpurchaList.push({
        Product_ID : Number(this.objpurchaseRequest.Product_ID),
        Product_Description : filterproductList ? filterproductList.Product_Name : "",            
        Requisition_Qty: this.objpurchaseRequest.Requisition_Qty,
        UOM : this.objpurchaseRequest.UOM,
        Purchase_Request_Qty: this.objpurchaseRequest.Purchase_Request_Qty
       })
       this.objpurchaseRequest = new purchaseRequest()
       this.purchaseRequestFormSubmit = false
    }
   }
   DeleteAddPurchase(index) {
    this.addpurchaList.splice(index,1);
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