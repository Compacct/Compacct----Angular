import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from "@angular/core";
import { CompacctCommonApi } from "../../../compacct.services/common.api.service";
import { HttpParams, HttpClient } from "@angular/common/http";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-compacct-financial-details',
  templateUrl: './compacct.financial-details.component.html',
  styleUrls: ['./compacct.financial-details.component.css']
})
export class CompacctFinancialDetailsComponent implements OnInit,OnChanges {
  PurchaseData = [];
  AllPurchaseData = [];
  ObjFinancial = new Financial();
  FinancialFormSubmit = false;
  SalesData = [];
  AllSalesData = [];
  PrData = [];
  PurchaseReturnList = [];
  SalesReturn = [];
  SalesReturnList = [];
  DiscountData = [];
  DiscountReceiveList = [];
  GivenData = [];
  DiscountGivenList = [];
  _required = false
  @Output() FinacialDetailsObj = new EventEmitter<Financial>();
  @Input() requirFinancial :any
  PurchaseACFlag = false;
  SalesACFlag = false;
  constructor(
    private $http: HttpClient,
    private $CompacctAPI: CompacctCommonApi,
    private GlobalAPI:CompacctGlobalApiService
  ) { }

  ngOnInit() {
    this.getPurchaseledger();
    this.getSalesledger();
    // this.getPrReturn();
    // this.getSalesReturn();
    this.getDiscountReceive();
    this.getDiscountGiven();

    // this.ObjFinancial.Purchasable_Product = true;
    // this.ObjFinancial.Billable_Product = true;
    // this.EventEmitDefault();
    this.clear()
  }
  getPurchaseledger(edit?){
    this.PurchaseData=[]; 
     this.AllPurchaseData = [];
     if (this.PurchaseACFlag) {
       
      const obj = {
        "SP_String": "SP_Master_Product_New",
        "Report_Name_String":"Get_All_Ledger",
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.PurchaseData = data;
       console.log("PurchaseData==",this.PurchaseData);
        this.PurchaseData.forEach((el : any) => {
          this.AllPurchaseData.push({
            label: el.Ledger_Name,
            value: el.Ledger_ID,
            
          });
        });
        if(edit){
          
        }
        else{
          this.ObjFinancial.Purchase_Ac_Ledger = this.PurchaseData.length ? data[0].Ledger_ID : undefined;
          this.ObjFinancial.Purchase_Return_Ledger_ID = this.PurchaseData.length ? data[0].Ledger_ID : undefined;
        }
  
        this.EventEmitDefault();
      })
     }
      else {
        const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String":"Get_Purchase_AC_Ledger",
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.PurchaseData = data;
        console.log("PurchaseData==",this.PurchaseData);
         this.PurchaseData.forEach((el : any) => {
           this.AllPurchaseData.push({
             label: el.Ledger_Name,
             value: el.Ledger_ID,
             
           });
         });
         if(edit){

         }
         else{
          this.ObjFinancial.Purchase_Ac_Ledger = this.PurchaseData.length ? data[0].Ledger_ID : undefined;
         this.ObjFinancial.Purchase_Return_Ledger_ID = this.PurchaseData.length ? data[0].Ledger_ID : undefined;
         }
        
         this.EventEmitDefault();
       })
      }
  }
  getSalesledger(edit?){
    this.SalesData=[]; 
     this.AllSalesData = [];
     if (this.SalesACFlag) {
      const obj = {
        "SP_String": "SP_Master_Product_New",
        "Report_Name_String":"Get_All_Ledger",
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.SalesData = data;
       console.log("SalesData==",this.SalesData);
        this.SalesData.forEach((el : any) => {
          this.AllSalesData.push({
            label: el.Ledger_Name,
            value: el.Ledger_ID,
            
          });
        });

        if(edit){

        }
        else{

        }
        this.ObjFinancial.Sales_Ac_Ledger = this.SalesData.length ? data[0].Ledger_ID : undefined;
        this.ObjFinancial.Sales_Return_Ledger_ID = this.SalesData.length ? data[0].Ledger_ID : undefined;
        this.EventEmitDefault();
      })
     }
     else {
        const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String":"Get_Sales_AC_Ledger",
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.SalesData = data;
        console.log("SalesData==",this.SalesData);
          this.SalesData.forEach((el : any) => {
            this.AllSalesData.push({
              label: el.Ledger_Name,
             value: el.Ledger_ID,
             
           });
          });
          if(edit){

          }
          else {
            this.ObjFinancial.Sales_Ac_Ledger = this.SalesData.length ? data[0].Ledger_ID : undefined;
            this.ObjFinancial.Sales_Return_Ledger_ID = this.SalesData.length ? data[0].Ledger_ID : undefined;
          }
          
          this.EventEmitDefault();
       })
      }
  }
  getPrReturn(){
    this.PrData=[]; 
     this.PurchaseReturnList = [];
        const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String":"Get_Purchase_AC_Ledger",
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.PrData = data;
        console.log("PrData==",this.PrData);
          this.PrData.forEach((el : any) => {
            this.PurchaseReturnList.push({
              label: el.Ledger_Name,
              value: el.Ledger_ID,
             
           });
          });
       })
  }
  getSalesReturn(){
    this.SalesReturn=[]; 
     this.SalesReturnList = [];
        const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String":"Get_Sales_AC_Ledger",
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.SalesReturn = data;
        console.log("SalesReturn==",this.SalesReturn);
          this.SalesReturn.forEach((el : any) => {
            this.SalesReturnList.push({
              label: el.Ledger_Name,
             value: el.Ledger_ID,
             
           });
          });
       })
  }
  getDiscountReceive(edit?){
    this.DiscountData=[]; 
     this.DiscountReceiveList = [];
        const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String":"Get_Discount_Receive_Ledger",
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.DiscountData = data;
        console.log("DiscountDataRec==",this.DiscountData);
          this.DiscountData.forEach((el : any) => {
            this.DiscountReceiveList.push({
              label: el.Ledger_Name,
             value: el.Ledger_ID,
             
           });
          });
          if(edit){

          }
          else {
            this.ObjFinancial.Discount_Receive_Ledger_ID = data[0].Ledger_ID;
          }
          
       })
  }
  getDiscountGiven(edit?){
    this.GivenData=[]; 
     this.DiscountGivenList = [];
        const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String":"Get_Discount_Given_Ledger",
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.GivenData = data;
        console.log("DataDiscount==",this.GivenData);
          this.GivenData.forEach((el : any) => {
            this.DiscountGivenList.push({
              label: el.Ledger_Name,
             value: el.Ledger_ID,
             
           });
          });
          if(edit){

          }
          else {
            this.ObjFinancial.Discount_Given_Ledger_ID = data[0].Ledger_ID;
          }
          
          this.EventEmitDefault();
       })
  }
  EventEmitDefault(){
    this.FinacialDetailsObj.emit(this.ObjFinancial);
  }
  EditFinalcial(arr){
    console.log("Financial",JSON.parse(arr))
    let data = JSON.parse(arr)
    const EditData = data[0]
    this.ObjFinancial.Can_Purchase = EditData.Can_Purchase
    this.ObjFinancial.Billable = EditData.Billable
     if(EditData.Can_Purchase){
      this.getPurchaseledger(true)
      this.getDiscountReceive(true)
      this.getDiscountGiven(true)
      setTimeout(() => {
      this.ObjFinancial.Discount_Receive_Ledger_ID = EditData.Discount_Receive_Ledger_ID
      this.ObjFinancial.Discount_Given_Ledger_ID = EditData.Discount_Given_Ledger_ID
      this.ObjFinancial.Purchase_Ac_Ledger = EditData.Purchase_Ac_Ledger
      this.ObjFinancial.Purchase_Return_Ledger_ID = EditData.Purchase_Return_Ledger_ID
      }, 1000);
    }
    if(EditData.Billable){
     this.getSalesledger()
     this.getDiscountReceive(true)
     this.getDiscountGiven(true)
     setTimeout(() => {
      this.ObjFinancial.Discount_Receive_Ledger_ID = EditData.Discount_Receive_Ledger_ID
      this.ObjFinancial.Discount_Given_Ledger_ID = EditData.Discount_Given_Ledger_ID
      this.ObjFinancial.Sales_Return_Ledger_ID = EditData.Sales_Return_Ledger_ID
      this.ObjFinancial.Sales_Ac_Ledger = EditData.Sales_Ac_Ledger
     }, 1000);
  
    }
    
  }
  clear() {
    // this.VendorAddressLists = [];
    console.log("Clear")
    this.ObjFinancial = new Financial();
    this.ObjFinancial.Can_Purchase = true;
    this.ObjFinancial.Billable = true;
    this.PurchaseACFlag = false;
    this.SalesACFlag = false
    this.getPurchaseledger();
    this.getSalesledger();
    this.getDiscountReceive();
    this.getDiscountGiven();
  }
  ngOnChanges(changes: SimpleChanges) {
        
    //this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values
    console.log("changes >>",changes);
    this.FinancialFormSubmit = changes.requirFinancial.currentValue
  }


}
class Financial{
  Can_Purchase : boolean;
  Billable : boolean;
  Purchase_Ac_Ledger:any;
  Sales_Ac_Ledger:any;
  Purchase_Return_Ledger_ID:any;
  Sales_Return_Ledger_ID:any;
  Discount_Receive_Ledger_ID:any;
  Discount_Given_Ledger_ID:any;
}