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
  productListHeader:any = []
  purchaseRequestFormSubmit:boolean = false
  addpurchaList:any = []
  DocDate:any=  {}
  Spinner:boolean = false
  PurchaseRequestNo:any = undefined
  Searchedlist:any = []
  seachSpinner:boolean = false
  BrowseStartDate:any = {}
  BrowseEndDate:any = {}
  SearchFormSubmit:boolean = false
  ReqQtyList:any = []
  Requisitionpopup:boolean = false
  viewPurchasePopup:boolean = false
  viewPurchaseList:any = []
  BrandList:any = []
  BrandId:any = undefined
  scrollableCols:any = [];
  frozenCols:any = [];
  ProductSpinner:Boolean = false
  editDisdate:boolean = false
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
   
   this.getBrand()
   this.DocDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
   this.BrowseStartDate =this.DateNepalConvertService.GetNepaliCurrentDateNew();
   this.BrowseEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
   this.tabIndexToView = 0
   this.frozenCols = [
    { field: 'Product_Description', header: 'Product Description' },
];
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData(){
    console.log("call")
    this.items = ["BROWSE", "CREATE"];
   // this.tabIndexToView = 0
    this.buttonname = "Save"
    this.objpurchaseRequest = new purchaseRequest()
    this.addpurchaList = []
    this.DocDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.PurchaseRequestNo = undefined
    this.ReqQtyList = []
    this.Requisitionpopup = false
    this.viewPurchasePopup = false
    this.BrandId = undefined
    this.purchaseRequestFormSubmit = false
    this.GetSearchedList(true)
    this.scrollableCols = [];
    this.productListHeader = []
    this.ProductSpinner = false
    this.frozenCols = []
    this.editDisdate = false
  }
 
  onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("s");
  }
  getBrand(){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Brand_Product"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("BrandList",data)
      if(data.length){

        data.forEach((xy:any) => {
         xy['label'] = xy.Brand_Name
         xy['value'] = xy.Product_Mfg_Comp_ID
        });
       this.BrandList = data
      }
   
     });
  }
  GetproductList(valid){
    this.purchaseRequestFormSubmit = true
    if(valid){
      this.ProductSpinner = true
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Get_Requistion_Product_List",
        "Json_Param_String": JSON.stringify([{Product_Mfg_Comp_ID : Number(this.BrandId)}])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("productList",data)
        this.setProductListTable(data)
        this.purchaseRequestFormSubmit = false
        this.ProductSpinner = false
        });
    }
    else{
      this.productList = []
    }
  
  }
  setProductListTable(data:any){
    if(data.length){
      this.frozenCols = [
        { field: 'Product_Description', header: 'Product Description' },
    ];
    this.productList = data
    let dataHeader = Object.keys(data[0])
    this.productListHeader = Object.keys(data[0])
    dataHeader.forEach((ele:any) => {
      if(ele != "Product_ID" && ele != "Product_Description"){
        this.scrollableCols.push({
          field : ele,
          header: ele
        })
      }
    });
  }
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
     this.objpurchaseRequest.Requisition_Qty = undefined
    }
   }
   addpur(valid:any){
    this.purchaseRequestFormSubmit = true
    console.log(valid)
    if(valid){
      const filterproductList = this.productList.find((x:any)=> Number(x.Product_ID) == Number(this.objpurchaseRequest.Product_ID) )
       this.addpurchaList.push({
        Purchase_Request_No:"A",
        Product_ID : Number(this.objpurchaseRequest.Product_ID),
        Purchase_Request_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.DocDate)),
        Product_Description : filterproductList ? filterproductList.Product_Name : "",            
        Requisition_Qty: this.objpurchaseRequest.Requisition_Qty,
        UOM : this.objpurchaseRequest.UOM,
        Purchase_Request_Qty: this.objpurchaseRequest.Purchase_Request_Qty,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID
       })
       this.objpurchaseRequest = new purchaseRequest()
       this.purchaseRequestFormSubmit = false
    }
   }
   DeleteAddPurchase(index) {
    this.addpurchaList.splice(index,1);
  }
  ConfirmSave(){
    let saveData:any = []
    this.addpurchaList = []
     this.productList.forEach((xz:any) => {
     
      if(xz.Purchase_Request_Qty){
       let saveTemp = {
        Purchase_Request_No: this.PurchaseRequestNo ? this.PurchaseRequestNo : "A",
        Purchase_Request_Date :  this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.DocDate)),
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      }
      xz.Purchase_Request_Qty = Number(xz.Purchase_Request_Qty)
        this.addpurchaList.push({...xz,...saveTemp})
      }
      
     });
   
     if(this.addpurchaList.length){
      this.compacctToast.clear();
      this.compacctToast.add({
      key: "s",
      sticky: true,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
      });
     }
   
  }
  SavePur(){
    
     const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Create_Purchase_Request",
      "Json_Param_String": JSON.stringify(this.addpurchaList)
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("data",data)
      if(data[0].Column1){
        this.GetSearchedList(true)
       
        this.onReject()
        console.log("PurchaseRequestNo",this.PurchaseRequestNo)
        if(this.PurchaseRequestNo){
         this.tabIndexToView = 0
        }
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        detail:  "Succesfully "+ this.buttonname
      });
      this.clearData()
      }
      else if(data[0].Success == "False"){
        this.onReject()
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: data[1].Error
        });
      }
      
    })
  }
  GetSearchedList(valid){
    this.SearchFormSubmit = true
    if(valid){
      this.seachSpinner = true
      this.Searchedlist = []
      const tempobj = {
        From_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseStartDate)),
        To_Date  : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseEndDate)),
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Browse_Purchase_Request",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("search Data",data)
        if(data.length){
         data.forEach((y:any) => {
          y.Date = this.DateNepalConvertService.convertEngToNepaliFormatDateObj(y.Date);
          });
         this.Searchedlist = data
         console.log("Searchedlist",this.Searchedlist)
        }
        this.seachSpinner = false
      })
    }
  }
  EditPur(col:any){
    if(col.Purchase_Request_No){
      this.ngxService.start();
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.tabIndexToView = 1
      this.PurchaseRequestNo = undefined
      this.PurchaseRequestNo = col.Purchase_Request_No
      this.editDisdate = true
      this.getEditData(col.Purchase_Request_No)
     }
  }
  getEditData(PurchaseRequestNo:any){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Data_From_Purchase_Request",
      "Json_Param_String": JSON.stringify([{ Purchase_Request_No :PurchaseRequestNo}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("Edit",data)
     if(data.length){
      this.DocDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].Purchase_Request_Date)
      this.setProductListTable(data)
     
     }
     this.ngxService.stop();
    })
  }
  DetailsReqQty(){
   if(this.objpurchaseRequest.Product_ID){
    this.ReqQtyList = []
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Show_Data_PopUp_Requisition_Salesman",
      "Json_Param_String": JSON.stringify([{Product_ID :Number(this.objpurchaseRequest.Product_ID)}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Requisitionpopup = true
      if(data.length){
        this.ReqQtyList = data
        this.ReqQtyList.forEach(ele => {
          ele.Date = this.DateNepalConvertService.convertEngToNepaliFormatDateObj(ele.Date);
        });
      }
      
      console.log("ReqQtyList",this.ReqQtyList)
     
    })
   }
  }
  
  viewPurchase(col){
   if(col.Purchase_Request_No){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Data_From_Purchase_Request",
      "Json_Param_String": JSON.stringify([{ Purchase_Request_No :col.Purchase_Request_No}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("view",data)
    this.viewPurchaseList = data
    setTimeout(() => {
      this.viewPurchasePopup = true
    }, 300);
    })
   }
  }

  Deletepur(col:any){
    if(col.Purchase_Request_No){
      this.PurchaseRequestNo = undefined
      this.PurchaseRequestNo = col.Purchase_Request_No
      this.compacctToast.clear();
      this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
      });
    }
  }
  onConfirm(){
    if(this.PurchaseRequestNo){
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Delete_Purchase_Request",
        "Json_Param_String": JSON.stringify([{Purchase_Request_No : this.PurchaseRequestNo}])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1 =="Done"){
          this.onReject()
          this.GetSearchedList(true)
         this.PurchaseRequestNo = undefined
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          detail:  "Succesfully Delete"
        })
        }
      })
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