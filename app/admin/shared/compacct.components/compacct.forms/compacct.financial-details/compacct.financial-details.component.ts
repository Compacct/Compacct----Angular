import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from "@angular/core";
import { CompacctCommonApi } from "../../../compacct.services/common.api.service";
import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
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
  _viewModel: any;
get Edit() {
    return this._viewModel;
}
@Input() set Edit(value: any) {
    this._viewModel = value;
    this.EditFinalcial(this._viewModel)
    console.log('input',this._viewModel);  // this should print something when new data is received
}
  PurchaseACFlag = false;
  SalesACFlag = false;
  constructor(
    private $http: HttpClient,
    private $CompacctAPI: CompacctCommonApi,
    private GlobalAPI:CompacctGlobalApiService,
    private ngxService: NgxUiLoaderService
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
  async synApiCall(apiData) {
    const obj = {
      "SP_String": apiData.SP_String,
      "Report_Name_String": apiData.Report_Name_String,
      "Json_Param_String": 'NA',
      'Json_1_String':  'NA',
      'Json_2_String': 'NA' ,
      'Json_3_String': 'NA',
      'Json_4_String': 'NA'
    }
  const httpOptions = {
    headers: new HttpHeaders().set('accept', 'application/json')
    .set('content-type', 'application/json')
    }
    const returnData = await this.$http.post<any>('/Common/Common_SP_For_All', obj, httpOptions).toPromise();
    return returnData;
}
  async getPurchaseledger(edit?){
    this.PurchaseData=[]; 
     this.AllPurchaseData = [];
     console.log("1 PurchaseData==");
    
     // const data = await this.GlobalAPI.getData(obj).toPromise();
     const obj = {
      "SP_String": "SP_Master_Product_New",
      "Report_Name_String": this.PurchaseACFlag ? "Get_All_Ledger" : "Get_Purchase_AC_Ledger",
    }
    const SiteDta = await this.synApiCall(obj);  
    const data = SiteDta ?  JSON.parse(SiteDta) : [];   
    console.log(data)
    console.log("2 PurchaseData==");
      if(data){
        this.PurchaseData = data;
        
        this.PurchaseData.forEach((el : any) => {
          this.AllPurchaseData.push({
            label: el.Ledger_Name,
            value: el.Ledger_ID,
            
          });
        })
        if(!edit){
          this.ObjFinancial.Purchase_Ac_Ledger = this.PurchaseData.length ? data[0].Ledger_ID : undefined;
          this.ObjFinancial.Purchase_Return_Ledger_ID = this.PurchaseData.length ? data[0].Ledger_ID : undefined;
        }
      }
      this.EventEmitDefault();
  }
  async  getSalesledger(edit?){
    this.SalesData=[]; 
     this.AllSalesData = [];
     if (this.SalesACFlag) {
      const obj = {
        "SP_String": "SP_Master_Product_New",
        "Report_Name_String":"Get_All_Ledger",
       }
       const data = await  this.GlobalAPI.getData(obj).toPromise();
      if(data){
        this.SalesData = data;
       console.log("SalesData==",this.SalesData);
        this.SalesData.forEach((el : any) => {
          this.AllSalesData.push({
            label: el.Ledger_Name,
            value: el.Ledger_ID,
            
          });
        });

        if(!edit){
          this.ObjFinancial.Sales_Ac_Ledger = this.SalesData.length ? data[0].Ledger_ID : undefined;
          this.ObjFinancial.Sales_Return_Ledger_ID = this.SalesData.length ? data[0].Ledger_ID : undefined;
        }
      }
        
        this.EventEmitDefault();
     }
     else {
        const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String":"Get_Sales_AC_Ledger",
        } 
        const data = await  this.GlobalAPI.getData(obj).toPromise();
        if(data){
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
        }
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
  async getDiscountReceive(edit?){
    this.DiscountData=[]; 
     this.DiscountReceiveList = [];
        const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String":"Get_Discount_Receive_Ledger",
        }
        const data = await this.GlobalAPI.getData(obj).toPromise();
        if(data.length){
         this.DiscountData = data;
        console.log("DiscountDataRec==",this.DiscountData);
          this.DiscountData.forEach((el : any) => {
            this.DiscountReceiveList.push({
              label: el.Ledger_Name,
             value: el.Ledger_ID,
             
           });
        });
          if(!edit){
            this.ObjFinancial.Discount_Receive_Ledger_ID = data[0].Ledger_ID;
          }
        }
  }
 async getDiscountGiven(edit?){
    this.GivenData=[]; 
     this.DiscountGivenList = [];
        const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String":"Get_Discount_Given_Ledger",
        }
        const data = await this.GlobalAPI.getData(obj).toPromise();
        if(data){
         this.GivenData = data;
        console.log("DataDiscount==",this.GivenData);
          this.GivenData.forEach((el : any) => {
            this.DiscountGivenList.push({
              label: el.Ledger_Name,
             value: el.Ledger_ID,
             
           });
          });
          if(!edit){
            this.ObjFinancial.Discount_Given_Ledger_ID = data[0].Ledger_ID;
          }
          
          this.EventEmitDefault();
        }
  }
  EventEmitDefault(){
  //  this.FinacialDetailsObj.emit(this.ObjFinancial);
  }
 async EditFinalcial(arr){
  this.ngxService.start();
    let data = arr;
    const EditData = await data;
    this.ObjFinancial.Can_Purchase = await EditData.Can_Purchase;
    this.ObjFinancial.Billable = await EditData.Billable;
    this.PurchaseACFlag = true;
    this.SalesACFlag = true
    console.log("0 PurchaseData==");
    this.getPurchaseledger(true);
    this.getSalesledger(true)
    setTimeout(() => {
      console.log("3 PurchaseData==");
      if(EditData.Can_Purchase){
        this.ObjFinancial.Purchase_Ac_Ledger = EditData.Purchase_Ac_Ledger ?  Number(EditData.Purchase_Ac_Ledger) : undefined;
        this.ObjFinancial.Purchase_Return_Ledger_ID = EditData.Purchase_Return_Ledger_ID ?  Number(EditData.Purchase_Return_Ledger_ID) : undefined;
        this.ObjFinancial.Discount_Receive_Ledger_ID =  EditData.Discount_Receive_Ledger_ID ?  Number(EditData.Discount_Receive_Ledger_ID) : undefined;
        this.ObjFinancial.Discount_Given_Ledger_ID = EditData.Discount_Given_Ledger_ID ?  Number(EditData.Discount_Given_Ledger_ID) : undefined;
        console.log("Can_Purchase ObjFinancial",this.ObjFinancial);
      }
      if(EditData.Billable){
        this.ObjFinancial.Discount_Receive_Ledger_ID = EditData.Discount_Receive_Ledger_ID ?  Number(EditData.Discount_Receive_Ledger_ID) : undefined;
        this.ObjFinancial.Discount_Given_Ledger_ID = EditData.Discount_Given_Ledger_ID ?  Number(EditData.Discount_Given_Ledger_ID): undefined;
        this.ObjFinancial.Sales_Return_Ledger_ID = EditData.Sales_Return_Ledger_ID ?  Number(EditData.Sales_Return_Ledger_ID) : undefined;
        this.ObjFinancial.Sales_Ac_Ledger = EditData.Sales_Ac_Ledger ?  Number(EditData.Sales_Ac_Ledger) : undefined;
        console.log("Billable ObjFinancial",this.ObjFinancial);
    
      }
      this.ngxService.stop();
    }, 2000);
    
    
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
   //this.FinancialFormSubmit = changes.requirFinancial.currentValue
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