import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"

@Component({
  selector: 'app-nepal-bl-txn-purchase-order',
  templateUrl: './nepal-bl-txn-purchase-order.component.html',
  styleUrls: ['./nepal-bl-txn-purchase-order.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalBLTxnPurchaseOrderComponent implements OnInit {
  tabIndexToView = 0;
  items :any = [] ;
  buttonname = "Save";
  ObjPurchase: Purchase = new Purchase();
  DocDate: any = {};
  BrowseStartDate:any = {}
  BrowseEndDate:any = {}
  PurchaseOrderForm: boolean = false;
  SearchFormSubmit: boolean = false;
  TotalRate = 0;
  GodownList: any = [];
  VendorList: any = [];
  POnoList: any = [];
  ProductList: any = [];
  ProductQtyTotal: number = 0;
  QtyTotal: number = 0;
  Searchedlist: any = [];
  masterDoc = undefined;
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
  this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Nepal BL Txn Purchase Order",
      Link: " Procurement ->  Nepal BL Txn Purchase Order"
    });
    this.DocDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.BrowseStartDate =this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.BrowseEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.getGodown();
    this.getVendor();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData() {
    this.PurchaseOrderForm = false;
    this.ObjPurchase = new Purchase(); 
    this.ProductList = [];
  }
  getGodown() {
    this.$http.get("/CRM_Billing_Order/Get_Godown_Name").subscribe((data: any) => {
    //console.log("data==",data)
      this.GodownList = data ? JSON.parse(data) : [];
     //  console.log("GodownList==",this.GodownList)
      if(this.GodownList.length){
        this.GodownList.forEach((xy:any) => {
         xy['label'] = xy.Godown
         xy['value'] = xy.Godown
        });
      }
    });
    
  }
  getVendor() {
   this.VendorList =[]
   const obj = {
        "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
        "Report_Name_String": "Get_Sub_Ledger_For_Purchase",
   }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if(data.length){
        data.forEach((xy:any) => {
         xy['label'] = xy.Sub_Ledger_Name
         xy['value'] = xy.Sub_Ledger_ID
        });
        this.VendorList = data
       // console.log("VendorList==",this.VendorList)
      } 
     });  
  }
  getPRno() {
    this.POnoList = []
    if (this.ObjPurchase.Sub_Ledger_ID) {
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Get_Purchase_Request_Doc_No_with_Vendor",
        "Json_Param_String": JSON.stringify([{ Sub_Ledger_ID: this.ObjPurchase.Sub_Ledger_ID }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if(data.length){
          data.forEach((xy:any) => {
           xy['label'] = xy.Purchase_Request_No_Text
           xy['value'] = xy.Purchase_Request_No
          });
          this.POnoList = data
         // console.log("POnoList==",this.POnoList)
        } 
      });
    } 
  }
  getPRoduct() {
    const obj = {
         "SP_String": "sp_Bl_Txn_Purchase_Request",
         "Report_Name_String": "Get_Details_with_Purchase_Request_No",
         "Json_Param_String": JSON.stringify([{ Purchase_Request_No :this.ObjPurchase.Purchase_Request_No}])
        }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       
         this.ProductList = data 
         this.ObjPurchase.Qty = data.Purchase_Request_Qty,
           this.ObjPurchase.Rate = data.Rate
         this.ProductList.forEach(ele => {
          ele.Line_Total = Number(ele.Purchase_Request_Qty)* Number(ele.Rate)
         });
         //this.getTotalClc();
         this.GetTotalPro();
         this.getTotal();
        // console.log("ProductList",this.ProductList)
       })
  }
  getTotalClc(i:any) { 
    this.ProductList[i].Line_Total = Number(this.ProductList[i].Purchase_Request_Qty) * Number(this.ProductList[i].Rate)
  }
  GetTotalPro(){
   let flg:Number = 0
   this.ProductList.forEach((ele:any) => {
     (flg) = Number(ele.Purchase_Request_Qty) + Number(flg)
   });
   this.ProductQtyTotal = Number(Number(flg).toFixed())
   return this.ProductQtyTotal
  }
  getTotal() {
     let flg:Number = 0
   this.ProductList.forEach((ele:any) => {
     (flg) = Number(ele.Line_Total) + Number(flg)
   });
   this.QtyTotal = Number(Number(flg).toFixed())
   return this.QtyTotal
  }
  SavePo(vaild) {
    this.PurchaseOrderForm = true;
    let ArrData:any =[];
    this.ProductList.forEach(element => {
    const TempObj = {
    Doc_No : "A",                                        
    Purchase_Request_No : this.ObjPurchase.Purchase_Request_No  ,                   
    Doc_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.DocDate)) ,                                
    Cost_Center_ID : 2,                     
    Sub_Ledger_ID: this.ObjPurchase.Sub_Ledger_ID,
    Remarks : this.ObjPurchase.Remarks,                                     
    Heading : this.ObjPurchase.Heading,
    Godown: this.ObjPurchase.Godown,
    Product_ID : element.Product_ID,                                        				                  
    Qty: element.Purchase_Request_Qty,                                            
    Rate: element.Rate,
    UOM : element.UOM,  
    Line_Total:element.Line_Total ,                                
    Grant_Total :this.getTotal() ,                                                                   			 
    Posted_By:  this.$CompacctAPI.CompacctCookies.User_ID,                                         
      }
       ArrData.push(TempObj)
    })
    console.log("ArrData====",ArrData)
    if (vaild) {
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
        "Report_Name_String": "Create_Purchase_Order",
        "Json_Param_String": JSON.stringify(ArrData)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Purchase Order",
            detail: "Succesfully Save"
          });
          this.tabIndexToView = 0;
          this.ObjPurchase = new Purchase();
        }
      })
    }
  }
  BrowseSearch(valid) {
   this.SearchFormSubmit = true
    if(valid){
      this.Searchedlist = []
      const tempobj = {
        From_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseStartDate)),
        To_Date  : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseEndDate)),
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
        "Report_Name_String": "Browse_Purchase_Order",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if(data.length){
          this.Searchedlist = data
           data.forEach((y:any) => {
          y.Doc_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(y.Doc_Date);
          });
        // console.log("Searchedlist",this.Searchedlist)
        }
      })
    }  
  }
  DeleteBrowse(DocID) {
    this.masterDoc = undefined;
    if (DocID.Doc_No) {
      this.masterDoc = DocID.Doc_No;
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
  onConfirm() {
   if(this.masterDoc){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
      "Report_Name_String": "Delete_Purchase_Order",
      "Json_Param_String": JSON.stringify([{Doc_No : this.masterDoc}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if (data[0].Column1){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Doc ID: " + this.masterDoc,
          detail: "Succesfully Deleted"
        });
        this.BrowseSearch(true);
       }
    })
  } 
  }
}
class Purchase{
Doc_No :any;	            
Purchase_Request_No	:any;	
Doc_Date:any;	           
Cost_Center_ID: any = 2;	
Godown: any;
Sub_Ledger_ID	:any;
Product_ID:any;	  	
Qty	:any = 0;       
UOM	:any;
Rate:any = 0;	           
Line_Total	:number;
Grant_Total:number;	
Remarks:any;	     
Heading	:any;      
}
