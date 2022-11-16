import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"
import { map } from 'rxjs/operators';
import { isUndefined } from 'util';

@Component({
  selector: 'app-nepal-purchase-request-negotiate-price',
  templateUrl: './nepal-purchase-request-negotiate-price.component.html',
  styleUrls: ['./nepal-purchase-request-negotiate-price.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalPurchaseRequestNegotiatePriceComponent implements OnInit {
  items:any = []
  tabIndexToView:number = 0
  buttonname = "Save"
  poRequestList:any = []
  vendorSelectionFormSubmit:boolean = false
  PoDate:any
  Searchedlist:any = []
  prList:any = []
  Venderlist:any = []
  VenderSelect:any = undefined
  SaveSpinner:boolean = false
  seachSpinner:boolean = false
  BrowseStartDate:any = {}
  BrowseEndDate:any = {}
  SearchFormSubmit:boolean = false
  ObjnegotiatePrice:negotiatePrice = new negotiatePrice()
  PurchaseTypeList:any = []
  PurchaseTypeSelect:any = undefined
  PaymentMethodList:any = []
  PaymentMethodSelect:any = undefined
  CurrencyList:any = []
  CurrencySelect:any = []
  ViewPurchaseTypeModal :boolean = false
  PurchaseId =undefined
  PaymentId= undefined
  ViewPaymentTypeModal :boolean =false
  ViewCurrencyTypeModal:boolean =false
  PurchaseTypeModal:boolean =false
  PaymentTypeModal :boolean = false
  CurrencyTypeModal :boolean =false
  PurchaseTypeFormSubmitted :boolean =false
  PaymentFormSubmitted :boolean = false
  CurrencyFormSubmitted :boolean = false
  PurchaseTypeName = undefined;
  PaymentTypeName = undefined
  CurrencyId =undefined
  CurrencyName = undefined
  Spinner:boolean = false;
  constructor( private $http: HttpClient,
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
     Header: "Purchase Request Negotiate Price",
     Link: "Procurement -> Purchase Request Negotiate Price"
   });
   this.BrowseStartDate =this.DateNepalConvertService.GetNepaliCurrentDateNew();
   this.BrowseEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
   this.getPRno()
   this.getPurchaseType()
   this.getPaymentMethod()
   this.GetCurrency()
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData(){
  this.ObjnegotiatePrice = new negotiatePrice()
  this.vendorSelectionFormSubmit = false
  this.PoDate = undefined
  this.prList = []
  this.SaveSpinner = false
  this.PurchaseTypeSelect = undefined
  this.PaymentMethodSelect = undefined
  this.CurrencySelect = undefined
  }
  onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("A");
    this.compacctToast.clear("B");
    this.compacctToast.clear("D");
   }
   getPRno(){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Purchase_Request_Doc_No"
    }
    this.GlobalAPI.getData(obj)
    .subscribe((data: any) => {
      console.log("data",data)
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Purchase_Request_No,
          element['value'] = element.Purchase_Request_No_Actual
        });
       this.poRequestList = data;
     // console.log("Requlist======",this.Requlist);
      }
       else {
        this.poRequestList = [];
  
      }
      console.log("poRequestList",this.poRequestList)
    })
   }
   purchaseRequestChange(){
    if(this.ObjnegotiatePrice.Purchase_Request_No){
      this.getPr()
      const poRequestListFilter = this.poRequestList.filter((y:any)=> y.Purchase_Request_No_Actual == this.ObjnegotiatePrice.Purchase_Request_No)[0]
      if(poRequestListFilter){
        this.PoDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(poRequestListFilter.Purchase_Request_Date)
      }
    }
    else{
      this.prList = []
      this.VenderSelect = undefined
      this.PoDate = null
    }
  
  }
  getPr(){
    const obj = {
         "SP_String": "sp_Bl_Txn_Purchase_Request",
         "Report_Name_String": "Get_Data_From_Purchase_Request",
         "Json_Param_String": JSON.stringify([{ Purchase_Request_No :this.ObjnegotiatePrice.Purchase_Request_No}])
        }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("prList",data)
       this.prList = data
       })
      }
  getPurchaseType(){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Purchase_Type"
    }
    this.GlobalAPI.getData(obj)
    .subscribe((data: any) => {
      console.log("data",data)
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Purchase_Type,
          element['value'] = element.Purchase_Type
        });
       this.PurchaseTypeList = data;
     // console.log("Requlist======",this.Requlist);
      }
       else {
        this.PurchaseTypeList = [];
  
      }
      console.log("PurchaseTypeList",this.PurchaseTypeList)
    })
  }
  getPaymentMethod(){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Payment_Method"
    }
    this.GlobalAPI.getData(obj)
    .subscribe((data: any) => {
      console.log("data",data)
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Payment_Method,
          element['value'] = element.Payment_Method
        });
       this.PaymentMethodList = data;
     // console.log("Requlist======",this.Requlist);
      }
       else {
        this.PaymentMethodList = [];
  
      }
      console.log("PaymentMethodList",this.PaymentMethodList)
    })
  }
  GetCurrency(){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Currency"
    }
    this.GlobalAPI.getData(obj)
    .subscribe((data: any) => {
      console.log("data",data)
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Currency,
          element['value'] = element.Currency
        });
       this.CurrencyList = data;
     // console.log("Requlist======",this.Requlist);
      }
       else {
        this.CurrencyList = [];
  
      }
      console.log("CurrencyList",this.CurrencyList)
    })
  }
  CurrencyChange(){
  this.prList.forEach((ele:any) => {
    ele['Currency'] = this.CurrencySelect
  }); 

  }
  negotiateSave(){
    if(this.PaymentMethodSelect && this.ObjnegotiatePrice.Purchase_Request_No && this.PurchaseTypeSelect && this.CurrencySelect){
      let saveData:any=[]
       this.prList.forEach((ele:any) => {
        saveData.push({
          Purchase_Request_No: this.ObjnegotiatePrice.Purchase_Request_No,
          Purchase_Type: this.PurchaseTypeSelect,
          Payment_Method: this.PaymentMethodSelect,
          Currency : this.CurrencySelect,
          Negotiate_Price: Number(ele.Negotiate_Price),
          Product_ID: Number( ele.Product_ID)
        })
       });
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Update_Negotiate_Price",
        "Json_Param_String": JSON.stringify(saveData)
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1 == "Done"){
          this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           detail: "Negotiate Price Succesfully "+this.buttonname
         });
         this.prList = []
        this.VenderSelect = undefined
        this.ObjnegotiatePrice = new negotiatePrice()
        this.ngxService.stop();
        this.SaveSpinner = false
        this.PoDate = undefined
        this.items = ["BROWSE", "CREATE"];
        this.buttonname = "Save";
        this.PurchaseTypeSelect = undefined
        this.PaymentMethodSelect = undefined
        this.GetSearchedList(true)
        }
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
          this.ngxService.stop();
          this.SaveSpinner = false
        }
      })
    }
  }
  GetSearchedList(valid:any){
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
        "Report_Name_String": "Browse_Purchase_Request_For_Negotiate_Price",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if(data.length){
        this.Searchedlist = data
        data.forEach((y:any) => {
          y.Date = this.DateNepalConvertService.convertEngToNepaliFormatDateObj(y.Date);
          });
         console.log("Searchedlist",this.Searchedlist)
        }
        this.seachSpinner = false
      })
    }
  }
  EditNegotiate(col:any){
    if(col.Purchase_Request_No){
      this.items = ["BROWSE", "UPDATE"];
      this.tabIndexToView = 1
      this.buttonname = "Update"
      this.ObjnegotiatePrice.Purchase_Request_No = col.Purchase_Request_No
      this.purchaseRequestChange()
      this.PurchaseTypeSelect = col.Purchase_Type
      this.PaymentMethodSelect = col.Payment_Method
      this.CurrencySelect = col.Currency
    }
  }

  ViewPurchasePOP(){
      this.PurchaseTypeList = [];
       this.getPurchaseType();
      setTimeout(() => {
        this.ViewPurchaseTypeModal = true;
      }, 200);
  }
  deletePurchaseType(mettype){
    this.PurchaseId = undefined;
    if(mettype.Purchase_Type){
      this.PurchaseId = mettype.Purchase_Type;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "A",
        sticky: true,
        severity:'warn',
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }
  onConfirm1(){
    if(this.PurchaseId){
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Delete_Purchase_Type",
        "Json_Param_String": JSON.stringify([{Purchase_Type : this.PurchaseId}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        let msg = data[0].Column1 == 'Can Not Delete' ? data[0].Column1 : this.PurchaseId
        let Tempo = data[0].Column1 == 'Can Not Delete' ? data[0].Column1 : "Successfully Delete"
        let Data = data[0].Column1 == 'Can Not Delete' ? 'error' : 'success'
        if (data[0].Column1){
          this.onReject();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: Data,
            summary: "Purchase Type: " + msg,
            detail: Tempo
          });
          this.getPurchaseType();
        }
      })
  }
  }
  PurchasePopup(){
  this.PurchaseTypeFormSubmitted = false;
  this.PurchaseTypeName = undefined;
  this.PurchaseTypeModal = true;
  }
  CreatPurchasePOP(valid){
    this.PurchaseTypeFormSubmitted = true;
      const Obj = {
        Purchase_Type : this.PurchaseTypeName,
      }
      if(valid){
         const obj = {
           "SP_String": "sp_Bl_Txn_Purchase_Request",
           "Report_Name_String" : "Create_Purchase_Type ",
           "Json_Param_String": JSON.stringify([Obj])     
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
          let msg = data[0].Column1 == 'Already Exisis' ? data[0].Column1 : this.PurchaseTypeName
          let Tempo = data[0].Column1 == 'Already Exisis' ? data[0].Column1 : "Successfully Create"
          let Data = data[0].Column1 == 'Already Exisis' ? 'error' : 'success'
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: Data,
             summary: "Purchase Type " + msg,
             detail: Tempo
           });
           this.PurchaseTypeFormSubmitted = false;
           this.PurchaseTypeName = undefined;
           this.PurchaseTypeModal = false;
           this.getPurchaseType();
       
           }
          })
  }
  }

  ViewPaymentPOP(){
    this.PaymentMethodList = [];
    this.getPaymentMethod();
   setTimeout(() => {
     this.ViewPaymentTypeModal = true;
   }, 200);
  }
  deletePaymentType(Valid){
    this.PaymentId = undefined;
    if(Valid.Payment_Method){
      this.PaymentId = Valid.Payment_Method;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "B",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }  
  }
  onConfirm2(){
    if(this.PaymentId){
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Delete_Payment_Method",
        "Json_Param_String": JSON.stringify([{Payment_Method : this.PaymentId}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        let msg = data[0].Column1 == 'Can Not Delete' ? data[0].Column1 : this.PaymentId
        let Tempo = data[0].Column1 == 'Can Not Delete' ? data[0].Column1 : "Successfully Delete"
        let Data = data[0].Column1 == 'Can Not Delete' ? 'error' : 'success'
        if (data[0].Column1){
          this.onReject();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: Data,
            summary: "Payment Method: " +msg,
            detail: Tempo
          });
          this.getPaymentMethod();
        }
      })
  }
  }
  PaymentPOP(){
    this.PaymentFormSubmitted = false;
    this.PaymentTypeName = undefined;
    this.PaymentTypeModal = true; 
  }
  creatPaymentPOP(valid){
    this.PaymentFormSubmitted = true;
      const Obj = {
        Payment_Method : this.PaymentTypeName,
      }
      if(valid){
         const obj = {
           "SP_String": "sp_Bl_Txn_Purchase_Request",
           "Report_Name_String" : "Create_Payment_Method ",
           "Json_Param_String": JSON.stringify([Obj])     
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
          let msg = data[0].Column1 == 'Already Exisis' ? data[0].Column1 : this.PaymentTypeName
          let Tempo = data[0].Column1 == 'Already Exisis' ? data[0].Column1 : "Successfully Create"
          let Data = data[0].Column1 == 'Already Exisis' ? 'error' : 'success'
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: Data,
             summary: "Payment Type " + msg,
             detail: Tempo
           });
           this.PaymentFormSubmitted = false;
           this.PaymentTypeName = undefined;
           this.PaymentTypeModal = false;
           this.getPaymentMethod();
       
           }
          })
  }  
  }


  ViewCurrencyPOP(){
    this.CurrencyList = [];
       this.GetCurrency();
      setTimeout(() => {
        this.ViewCurrencyTypeModal = true;
      }, 200);
  }
  deleteCurrencyType(Valid){
    this.CurrencyId = undefined;
    if(Valid.Currency){
      this.CurrencyId = Valid.Currency;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "D",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }  
  }
  onConfirm3(){
    if(this.CurrencyId){
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Delete_Currency",
        "Json_Param_String": JSON.stringify([{Currency : this.CurrencyId}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        let msg = data[0].Column1 == 'Can Not Delete' ? data[0].Column1 : this.CurrencyId
        let Tempo = data[0].Column1 == 'Can Not Delete' ? data[0].Column1 : "Successfully Delete"
        let Data = data[0].Column1 == 'Can Not Delete' ? 'error' : 'success'
        if (data[0].Column1){
          this.onReject();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: Data,
            summary: "Currency: " + msg,
            detail: Tempo
          });
          this.GetCurrency();
        }
      })
  }
  }
  CurrencyPOP(){
    this.CurrencyFormSubmitted = false;
    this.CurrencyName = undefined;
    this.CurrencyTypeModal = true;   
  }
  CreatCurrencyPOP(valid){
    this.CurrencyFormSubmitted = true;
    const Obj = {
      Currency : this.CurrencyName,
    }
    if(valid){
       const obj = {
         "SP_String": "sp_Bl_Txn_Purchase_Request",
         "Report_Name_String" : "Create_Currency",
         "Json_Param_String": JSON.stringify([Obj])     
       }
       this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        let msg = data[0].Column1 == 'Already Exisis' ? data[0].Column1 : this.CurrencyName
        let Tempo = data[0].Column1 == 'Already Exisis' ? data[0].Column1 : "Successfully Create"
        let Data = data[0].Column1 == 'Already Exisis' ? 'error' : 'success'
        console.log(msg)
         if(data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: Data,
           summary: "Currency" + msg  ,
           detail: Tempo
         });
         this.CurrencyFormSubmitted = false;
         this.CurrencyName = undefined;
         this.CurrencyTypeModal = false;
         this.GetCurrency();
         }
        })
     }    
  }
}
class negotiatePrice{
  Purchase_Request_No:any
  Purchase_Request_Date:any
}