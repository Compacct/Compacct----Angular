import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
  CopiedFlag = false;
  CopyModalFlag = false;
  PaymentObj:any;
  PaymentTypeDisabled = false;
  BillType = undefined;
  tomorrow = new Date();

  
  PDFFlag = false;D
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  ProductPDFFile:any = {};
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
     this.tomorrow.setDate(this.tomorrow.getDate()+1);
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
        if(el.Transaction_ID) {
          this.Loan_Ac_No = el.Transaction_ID;
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
      const online = this.payDetails.filter(item=> item.Ledger_Name === 'ONLINE PAYMENT');
      if(online.length) {
        TranscationID = false;
      }
      console.log("adddataList",this.adddataList);
      this.getTotalValue()
      this.Objpayment.Amount = Number(this.stdOrderAmount) - Number(this.totalAmt);
      if(this.totalAmt == this.stdOrderAmount){
        this.buttonDis = false;
        this.addButtonDis = true;
      }
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
  checkIfManualEMI(){
    if (this.Param_Flag) {
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts_PG_Request",
        "Report_Name_String": "Get_Bill_Type",
        "Json_Param_String" : JSON.stringify([{'Subscription_Txn_ID': this.Param_Flag }])
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
            this.BillType = data[0].Billing_Type;
            this.Header.pushHeader({
              Header: "Payment Order" + ' - ' + this.BillType,
              Link: "Channel Sale -> Payment Order"
            });
            if(data[0].Pay_ID != 2) {
              this.PaymentByList = this.PaymentByList.filter(item => item.Ledger_ID != 609);
            }
            console.log(data)
      });

    }
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
      this.getpayDetails();
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
      this.checkIfManualEMI();
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
    this.PaymentTypeDisabled = false;
    this.Objpayment.Bank_Txn_Type_ID = undefined;
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
    if(this.Objpayment.Ledger_ID == "589"){
      this.Objpayment.Bank_Txn_Type_ID = "8";
      this.getDisable();
      this.Objpayment.Transaction_ID = 'NA';
      this.PaymentTypeDisabled = true;
    }
    if(this.Objpayment.Ledger_ID == "608"){
      this.Objpayment.Bank_Txn_Type_ID = "9";
      this.Objpayment.Amount = undefined;
      this.getDisable();
      this.Objpayment.Transaction_ID = 'NA';
      this.Objpayment.Bank_Branch_Name = 'NA';
      this.Objpayment.Bank_Name = 'NA';
      this.PaymentTypeDisabled = true;
    }
    if(this.Objpayment.Ledger_ID == "609"){
      this.Objpayment.Bank_Txn_Type_ID = "10";
      this.delivery_Date = this.tomorrow;
      this.PaymentTypeDisabled = true;
    }
    console.log("if.PaymentTypeList",this.PaymentTypeList)
    }
  }
  preventInput(event){
    let value=this.Objpayment.Amount;
    if (Number(value) > 5){
      event.preventDefault();
      this.Objpayment.Amount = undefined;
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
  async addorder(valid){
    this.paymentFormSubmitted = true;
    console.log(valid);
    this.getTotalValue();
    const amtValid = this.Objpayment.Amount ? Number(this.Objpayment.Amount) <= Number(this.stdOrderAmount) : true;
    const TotalamtValid = this.totalAmt ? (Number(this.totalAmt) + Number(this.Objpayment.Amount)) <= Number(this.stdOrderAmount) : true;
    const Duplicate = this.checkDup();
    if(valid && amtValid && TotalamtValid && Duplicate && Number(this.Objpayment.Amount) && this.checkImgvalid()){
        this.Objpayment.File_URL = undefined;
        if(this.Objpayment.Ledger_ID == "590" && this.ProductPDFFile['size'] && this.stdOrderNO){
          const imgUploadRes = await this.upload(this.stdOrderNO);
        }
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
          Txn_Type_Name : this.Objpayment.Txn_Type_Name,
          File_URL : this.Objpayment.File_URL
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
    if(!Duplicate) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Validation Message",
        detail: "Payment By Already Exits."
      });
    }
    if(!this.checkImgvalid()) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Validation Message",
        detail: "Image Required."
      });
    }
  }
  async upload(Order_No){
    const formData: FormData = new FormData();
        formData.append("file", this.ProductPDFFile);
    let response = await fetch('https://tutopiafilestorage.azurewebsites.net/api/Subscription_Payment_File_Upload?code=00B7bmC0PzSrrPGWsDduj4PGqm0teKd/00C01ilcDIflY9Y8VQIRqQ==&&ConTyp='+this.ProductPDFFile['type']+'&ext='+this.ProductPDFFile['name'].split('.').pop()+'&Order_No='+Order_No ,{ 
                  method: 'POST',
                  body: formData // This is your file object
                });
    let responseText = await response.text();
    if(JSON.parse(responseText).status === "TRUE"){
      this.Objpayment.File_URL = JSON.parse(responseText).message;
    }
    console.log(this.Objpayment.File_URL)
  };
  checkImgvalid() {
    let tempFlag = true;
    if(this.Objpayment.Ledger_ID == "590"){
      tempFlag = false;
      if(this.ProductPDFFile['size']) {
        tempFlag = true;
      }
    }else {
      tempFlag = true;
    }
    return tempFlag;
  }
  checkDup(){
    let flag = true;
    if(this.adddataList.length) {
        flag =  (!this.adddataList.filter(item=> item.Ledger_ID == this.Objpayment.Ledger_ID && item.Transaction_ID == this.Objpayment.Transaction_ID).length)
    }
    return flag;
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
      Txn_Type_Name : el.Txn_Type_Name,
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
      File_URL: el.File_URL,
       })

    });
    const online = this.payDetails.filter(item=> item.Ledger_Name === 'ONLINE PAYMENT' && item.Transaction_ID !== 'NA');
    if(online.length) {
      this.CallTutopiaAppApi();
    }
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
        this.PaymentLink();
       this.saveButtonDis = true;
       }
   })

 }
  PaymentLink() {
  this.CopiedFlag = false;
  this.PaymentObj = {};
  this.adddataList.forEach(el => {
    if(el.Ledger_ID == '589' && el.Transaction_ID == 'NA') {
      const obj = {
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        Order_No : this.stdOrderNO,
        Subscription_Txn_ID : Number(this.Param_Flag),
        Amount : Number(el.Amount),
       };
       this.$http
          .post("/Create_Payment_Link/Tutopia_PG_Get_Link_Tutopia", obj)
          .subscribe((data: any) => {
            this.CopiedFlag = false;
            this.CopyModalFlag = true;
            this.PaymentObj = data;
            console.log(data);
          });
    }
  });
 }
 copyToClipboard(item) {
  this.CopiedFlag = false;
  document.addEventListener('copy', (e: ClipboardEvent) => {
    e.clipboardData.setData('text/plain', (item));
    e.preventDefault();
    document.removeEventListener('copy', null);
  });
  document.execCommand('copy');
  this.CopiedFlag = true;
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

 CallTutopiaAppApi() {
  if (this.stdOrderNO) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer aZyAs0ynGvmOSNyyAOkJauiV')
    }
    const TempObj = {
      "order_id": this.Param_Flag,
      "payment_detail": "Paid",
      "payment_txn_id": this.stdOrderNO
    };
    this.$http
      .post("https://api.tutopia.in/api/crm/v1/subscription/confirm", TempObj, httpOptions)
      .subscribe((data: any) => {
        console.log(data);
        this.SaveConfirmSuscription();
        
      });
  }
  }
 SaveConfirmSuscription() {
    if (this.Param_Flag) {
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts",
        "Report_Name_String": "UPDATE_APP_CONFIRM",
        "Json_Param_String" : JSON.stringify([{'Subscription_Txn_ID': this.Param_Flag }])
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
            console.log(data)
      });

    }
  }

  // IMAGE 
 
  FetchPDFFile(event) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    if (event) {
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
    }
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
  File_URL:any;
}
