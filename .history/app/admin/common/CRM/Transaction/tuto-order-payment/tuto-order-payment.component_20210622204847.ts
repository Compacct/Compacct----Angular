import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Data } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-tuto-order-payment',
  templateUrl: './tuto-order-payment.component.html',
  styleUrls: ['./tuto-order-payment.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoOrderPaymentComponent implements OnInit {
  Param_Flag ='';
  Param_FootfallID = '';
  stdName = undefined;
  stdModile = undefined;
  stdOrderNO = undefined;
  stdOrderDate = undefined;
  stdOrderAmount = undefined;
  Bank_Txn_id = undefined;
  TransactionDis = true;
  Spinner = false;
  Bank_NameDis = true;
  Bank_Branch_NameDis = true;
  Transaction_DateDis = false;
  buttonDis = true;
  PaymentByList = [];
  PaymentTypeList = [];
  backupPaymentTypeList =[];
  adddataList :any = [];
  totalAmt:any = undefined;
  Foot_Fall_ID = undefined;
  Subscription_Txn_ID = undefined;
  savedataList:any = [];
  saveadddataList :any =[];
  paymentFormSubmitted = false;
  aftersave = false;
  payDetails = [];
  saveButtonDis = false;
  addButtonDis = false;
  delivery_Date = new Date()
  Objpayment: payment = new payment();
  TransactionIDFormSubmited = false;
  Loan_Ac_No = undefined;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
  ) {
    this.route.queryParams.subscribe(params => {
      if(params['Subscription_Txn_ID']) {
        this.Param_Flag = window.atob(params['Subscription_Txn_ID']);
        this.Param_FootfallID = window.atob(params['Foot_Fall_ID']);
        this.GetDetails();
        this.getpayDetails();
      }
    })
   }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Payment Order",
      Link: "Channel Sale -> Payment Order"
    });
     this.GetLedge();
     this.getPaymentType();
  }
  CheckValidAC(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if(charCode === 45 || charCode === 32) {
      return true;
    }else {
      const regex = new RegExp("^[a-zA-Z0-9]+$");
      const key = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);
      if (!regex.test(key)) {
        evt.preventDefault();
        return false;
      }else {
        return true;
      }
    }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){}
  getpayDetails(){
    this.Loan_Ac_No = undefined;
    this.TransactionIDFormSubmited = false;
    const tempObj = {
      Subscription_Txn_ID : this.Param_Flag
    }
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "Get_Finance_Payment_Details",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("pay==",data);
      this.payDetails = data;
      let TranscationID = false;
      this.payDetails.forEach(el =>{
        if(el.Transaction_ID === 'NOT RECIEVED') {
          TranscationID = true;
        }
        this.adddataList.push({
          Ledger_ID : el.Ledger_ID,
          Bank_Txn_Type_ID : el.Bank_Txn_Type_ID,
          Transaction_Date : el.Transaction_Date,
          Bank_Name : el.Bank_Name,
          Bank_Branch_Name : el.Bank_Branch_Name,
          Amount :el.Amount,
          Transaction_ID : el.Transaction_ID,
          Ledger_Name : el.Ledger_Name,
          Txn_Type_Name : el.Txn_Type_Name,
           del : 'NA'
        });
      });
      console.log("adddataList",this.adddataList);
      this.getTotalValue()
      this.Objpayment.Amount = Number(this.stdOrderAmount) - Number(this.totalAmt);
      if(TranscationID) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "c4",
          sticky: true,
          severity: "warn",
          summary: "",
          closable : false,
          detail: ""
        });
      }
     });

  }
  SaveTransactionID() {
    if(this.Loan_Ac_No) {
      this.TransactionIDFormSubmited = false;
      this.payDetails.forEach(el =>{
        el.Transaction_ID = this.Loan_Ac_No;
      });
      this.adddataList.forEach(el =>{
        el.Transaction_ID = this.Loan_Ac_No;
      });
      this.compacctToast.clear("c4");
    }else {
      this.TransactionIDFormSubmited = true;

    }
  }
  GetDetails(){
    const tempObj = {
      Subscription_Txn_ID : this.Param_Flag
    }
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "Get_Payment_Details",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.stdName = data[0].Contact_Name;
      this.stdModile = data[0].Mobile;
      this.stdOrderNO = data[0].Order_No;
      this.stdOrderDate = data[0].Order_Date;
      this.stdOrderAmount = data[0].Total_Order_Amount;
      this.Foot_Fall_ID = data[0].Foot_Fall_ID
      this.Objpayment.Amount = Number(this.stdOrderAmount) - Number(this.totalAmt);
    })
  }
  GetLedge(){
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "Get_Ledger_Details",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log(data);
      this.PaymentByList = data;
      console.log("test",this.PaymentByList)

    })
  }
getPaymentType(){
  const obj = {
    "SP_String": "Tutopia_Subscription_Accounts",
    "Report_Name_String": "Get_Bank_Tran_Type",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log(data);
    //this.PaymentTypeList = data;
    this.backupPaymentTypeList = data;

  })
}
getPaymentTypedata(){

  this.PaymentByList.forEach(el=>{
    if(this.Objpayment.Ledger_ID == el.Ledger_ID){
        this.Bank_Txn_id = el.Bank_Txn_Type_ID;
    }
  })
  console.log("this.Bank_Txn_id",this.Bank_Txn_id);
  var splitted = this.Bank_Txn_id.split(",");
  console.log("splitted",splitted);

  if(splitted.length){
    let tempProduct = [];
    splitted.forEach(item => {
      this.backupPaymentTypeList.forEach((el,i)=>{
         const ProductObj = this.backupPaymentTypeList.filter((elem) => elem.Bank_Txn_Type_ID == Number(item))[i];
        //const ProductObj = el;
        console.log("ProductObj",ProductObj);
        if(ProductObj)
        tempProduct.push(ProductObj)
        })
      })

  this.PaymentTypeList  = [...tempProduct];
  console.log("if.PaymentTypeList",this.PaymentTypeList)
  }
}
getDisable(){
  this.TransactionDis = true;
  this.Bank_NameDis = true;
  this.Bank_Branch_NameDis = true;
  this.Transaction_DateDis = false;

  if(this.Objpayment.Bank_Txn_Type_ID) {
    if(this.Objpayment.Bank_Txn_Type_ID == 6 || this.Objpayment.Bank_Txn_Type_ID == 3 || this.Objpayment.Bank_Txn_Type_ID == 5 || this.Objpayment.Bank_Txn_Type_ID == 4|| this.Objpayment.Bank_Txn_Type_ID == 7 || this.Objpayment.Bank_Txn_Type_ID == 1){
      this.TransactionDis = false;
      this.Transaction_DateDis = true;
    }
    if(this.Objpayment.Bank_Txn_Type_ID == 3 || this.Objpayment.Bank_Txn_Type_ID == 5 || this.Objpayment.Bank_Txn_Type_ID == 1 ){
      this.Bank_NameDis = false;
      this.Bank_Branch_NameDis = false;
    }
    if(this.Objpayment.Bank_Txn_Type_ID == 3 || this.Objpayment.Bank_Txn_Type_ID == 1){
      this.Bank_Branch_NameDis = false;
    }
  }

}
addorder(valid){
  this.paymentFormSubmitted = true;
  console.log(valid);
  this.getTotalValue();
  const amtValid = this.Objpayment.Amount ? Number(this.Objpayment.Amount) <= Number(this.stdOrderAmount) : true;
  const TotalamtValid = this.totalAmt ? (Number(this.totalAmt) + Number(this.Objpayment.Amount)) <= Number(this.stdOrderAmount) : true;
  if(valid && amtValid && TotalamtValid ){
    console.log("this.TransactionDis",this.TransactionDis);
   this.PaymentByList.forEach(el=>{
     if(this.Objpayment.Ledger_ID == el.Ledger_ID){
         this.Objpayment.Ledger_Name = el.Ledger_Name
     }
   })
   this.backupPaymentTypeList.forEach(el=>{
    if(this.Objpayment.Bank_Txn_Type_ID == el.Bank_Txn_Type_ID){
        this.Objpayment.Txn_Type_Name = el.Txn_Type_Name
    }
  })
  this.Objpayment.Transaction_Date = this.delivery_Date;
  this.adddataList.push({
    Ledger_ID : this.Objpayment.Ledger_ID,
    Bank_Txn_Type_ID : this.Objpayment.Bank_Txn_Type_ID,
    Transaction_Date : this.Objpayment.Transaction_Date,
    Bank_Name : this.Objpayment.Bank_Name,
    Bank_Branch_Name : this.Objpayment.Bank_Branch_Name,
    Amount : this.Objpayment.Amount,
    Transaction_ID : this.Objpayment.Transaction_ID,
    Ledger_Name : this.Objpayment.Ledger_Name,
    Txn_Type_Name : this.Objpayment.Txn_Type_Name
  })
  this.Objpayment = new payment();
  this.paymentFormSubmitted = false;
  this.getTotalValue();
  this.Objpayment.Amount = Number(this.stdOrderAmount) - Number(this.totalAmt);
  if(this.totalAmt == this.stdOrderAmount){
        this.buttonDis = false;
        this.addButtonDis = true;
  }
console.log("this.adddataList",this.adddataList);
  }
  if(!amtValid) {
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Validation Message",
      detail: "Amount is Greater Than Order Amount. "
    });
  }
  if(!TotalamtValid) {
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Validation Message",
      detail: "Total Amount is Greater Than Order Amount. "
    });
  }
}
getTotalValue(){
  let val:number = 0;
  console.log("this.adddataList.length",this.adddataList.length);
  console.log("this.adddataList",this.adddataList);
  this.adddataList.forEach((item)=>{
    (val) += Number(item.Amount)
  });
  this.totalAmt = val;
  console.log("this.totalAmt",this.totalAmt);


}
delete(index) {
  this.buttonDis = true;

  console.log("index",index);

  console.log("this.Objpayment.Amount",this.Objpayment.Amount);
  this.adddataList.splice(index,1)
  this.getTotalValue();
  this.Objpayment.Amount = Number(this.stdOrderAmount) - Number(this.totalAmt);
  this.addButtonDis = false;
 }
 savePayment(){
   console.log("this.adddataList",this.adddataList);
    this.adddataList.forEach(el => {
     this.savedataList.push({
      Order_Date : this.stdOrderDate,
      Order_No : this.stdOrderNO,
      Foot_Fall_ID : Number(this.Param_FootfallID),
      Subscription_Txn_ID : Number(this.Param_Flag),
      Ledger_ID : Number(el.Ledger_ID),
      Ledger_Name : el.Ledger_Name,
      Amount : Number(el.Amount),
      Transaction_Date : this.DateService.dateConvert(new Date (el.Transaction_Date)) ? this.DateService.dateConvert(new Date (el.Transaction_Date)) : "",
      Transaction_ID : el.Transaction_ID ? el.Transaction_ID : "",
      Bank_Name : el.Bank_Name ? el.Bank_Name : "",
      Bank_Branch_Name : el.Bank_Branch_Name ? el.Bank_Branch_Name : "",
      Bank_Txn_Type_ID : el.Bank_Txn_Type_ID,
      Txn_Type_Name : el.Txn_Type_Name
       })

    });
  console.log("this.savedataList",this.savedataList);
  const obj = {
    "SP_String": "Tutopia_Subscription_Accounts",
    "Report_Name_String": "Save Tutopia Subscription Order Payment",
    "Json_Param_String": JSON.stringify(this.savedataList)
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log(data);
    if (data[0].Column1 === "Save Successfully"){
      //this.aftersave = true;
       this.saveButtonDis = true;
       }
   })

 }
 amountChange(){
   console.log(this.Objpayment.Amount)
   if(this.Objpayment.Amount > this.stdOrderAmount){
        this.addButtonDis = true;
   }
   else{
    this.addButtonDis = false;
   }
 }
 printOut(){
   console.log("Print");
  window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + this.stdOrderNO, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
 }
}

class payment {
  Ledger_ID : any;
  Bank_Txn_Type_ID : any
  Transaction_Date : Date;
  Transaction_ID : any;
  Bank_Name : any;
  Bank_Branch_Name : any;
  Amount : number = 0;
  Ledger_Name : any;
  Txn_Type_Name : any;
}
