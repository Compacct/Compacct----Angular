
import { Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit ,ViewChild,ViewEncapsulation} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import {NavigationExtras, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-k4c-pos-bill-order',
  templateUrl: './k4c-pos-bill-order.component.html',
  styleUrls: ['./k4c-pos-bill-order.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cPosBillOrderComponent implements OnInit, OnDestroy {

  TopDataList:any = [];
  OnlineLedgerList:any =[];
  HoldBillDataList = [];
  HoldCustomOrderDataList = [];
  OutForDeliveryDataList = [];
  ClickedOnlineLedger:any = {};
  Objcustomerdetail : Customerdetail = new Customerdetail();
  CustomerDetailsFormSubmitted = false;
  GSTvalidFlag = false;
  CustomerDetailsPopUpFlag = false;
  UpperDataList: any = [];
  Todaydate = new Date();
  ObjLead : Lead = new Lead();
  @ViewChild("location", { static: false }) locationInput: ElementRef;
  @ViewChild("location", { static: false }) CustMob: ElementRef;
  NoPhoneFlag = false;
  takeawayflag = false;
  NoPhonedisable = false;
  dateList: any;
  billdate: Date;
  PreviousDate: any;
  EODCheckFlag = false; 
  EODstatus: any;
  BillWithoutStockPopup = false;
  ObjcashForm : cashForm  = new cashForm();
  Objcustomer : customer = new customer();
  ObjHomeDelivery : HomeDelivery = new HomeDelivery();
  walletlist: any;
  creditlist: any;
  Amount_Payable: any;
  Adv_Order_No: any;
  CreateBillList = [];
  CurrentDate = new Date();
  productSubmit = [];
  delivery_Date = new Date();
  Del_Date_Time : any;
  minTime: Date;
  maxTime: Date;
  EditDeliverypopup = false;
  delloclist: any;
  Del_Cost_Cent_ID : string;
  Round_Off: any;
  Adv: any;
  Net_Payable: any;
  Bill_No: any;
  Total: any;


  constructor( private Header: CompacctHeader,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) {
      this.Header.pushHeader({
        Header: "",
        Link: ""
      });
    }

  ngOnInit() {
    $(".content-header").addClass("collapse-pos");
    $(".content-header").addClass("hide-pos");
    $(".content").addClass("collapse-pos");
    // $("[data-widget='collapse']").click();
    $("body").addClass("sidebar-collapse");
    $("button.otherdata[data-widget='collapse']").click();
    this.GetUpperData();
    this.GetOnlineLedger();
    this.GetTodaysDel();
    this.GetHoldBill();
    this.GetHoldOrder();
    this.getbilldate();
    this.EODCheck();

    this.minTime = this.setHours(new Date(), "10:00am");
    this.maxTime = this.setHours(new Date(), "06:00pm");
    
  }
  setHours(dt, h):any {
    const s = /(\d+):(\d+)(.+)/.exec(h);
    dt.setHours(s[3] === "pm" ?
      12 + parseInt(s[1], 10) :
      parseInt(s[1], 10));
    dt.setMinutes(parseInt(s[2],10));
    return dt;
  }
  ngOnDestroy() {
    if ($(".content-header").hasClass("hide-pos")) {
      $(".content-header").removeClass("hide-pos");
    }
  }
//   getTodayDate(){
//     const obj = {
//      "SP_String": "SP_Controller_Master",
//      "Report_Name_String": "Get - Outlet Bill Date",
//      //"Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])

//    }
//    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//      this.dateList = data;
//    //console.log("this.dateList  ===",this.dateList);
//   this.Todayate =  new Date(data[0].Outlet_Bill_Date);
//    // on save use this
//   // this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));

//  })
// }
  checkGSTvalid(g){
    this.GSTvalidFlag = false;
    if(g) {
      let regTest = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(g)
      if(regTest){
        let a = 65,b = 55, c =36;
        let p;
        return Array['from'](g).reduce((i:any,j:any,k:any,g:any)=>{
          p =(p=(j.charCodeAt(0)<a?parseInt(j):j.charCodeAt(0)-b)*(k%2+1))>c?1+(p-c):p;
          return k<14?i+p:j==((c=(c-(i%c)))<10?c:String.fromCharCode(c+b));
        },0);
      }
      this.GSTvalidFlag = !regTest;
    }

  }

  onKeydownMain(event,nextElemID): void {
    if (event.key === "Enter" && nextElemID){
          const elem  = document.getElementById(nextElemID);
          elem.focus();
          event.preventDefault();
        }
  }
  onKeydownMain2(event,nextElemID): void {
    if (event.key === "Enter" &&  this.Objcustomerdetail.Mobile && this.Objcustomerdetail.Contact_Name ){
          this.OnCustomerDetailsSubmit(true)
          //this.DynamicRedirectTo(true);
        }
  }
  onKeydownMain3(event,nextElemID): void {
    if (event.key === "Enter" ){
          this.onConfirm()
        }
  }
  GetUpperData() {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get -dashboard Upper Values",
      "Json_Param_String" :  JSON.stringify([{ Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.UpperDataList = data.length ? data : {};
       console.log(this.UpperDataList)
     })
  }
  GetTodaysDel() {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - order for delivery",
      "Json_Param_String" : JSON.stringify([{ Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.OutForDeliveryDataList = data;
      // console.log(' Delivery list ===', data)
     })
  }
  GetHoldBill () {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Hold Bill",
      "Json_Param_String" :  JSON.stringify([{ Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.HoldBillDataList = data;
      // console.log('Hold bill order ===', data)
     })
  }
  GetHoldOrder () {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Hold Customer Order",
      "Json_Param_String" :  JSON.stringify([{ Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.HoldCustomOrderDataList = data;
      // console.log('Hold custom order ===', data)
     })
  }
  GetOnlineLedger() {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Online Ledger"
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.OnlineLedgerList = data;
     })
  }

  GetCustomerDetails() {
    this.Objcustomerdetail.Foot_Fall_ID = undefined;
    this.Objcustomerdetail.Contact_Name = undefined;
    this.Objcustomerdetail.Address = undefined;
    this.Objcustomerdetail.DOB = undefined;
    this.Objcustomerdetail.DOA = undefined;
    this.Objcustomerdetail.Cost_Cen_ID = undefined;
    this.Objcustomerdetail.GST_No = undefined;
    if(this.Objcustomerdetail.Mobile && this.Objcustomerdetail.Mobile.length === 10) {
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "GET_OUTLET_CUSTOMER_DETAILS",
        "Json_Param_String" : JSON.stringify([{'Costomer_Mobile' : this.Objcustomerdetail.Mobile}])
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
           console.log("get customer details" ,data);
           const ReturnObj = data.length ? data[0] : {};
           if(ReturnObj.Foot_Fall_ID) {
            this.Objcustomerdetail.Foot_Fall_ID = ReturnObj.Foot_Fall_ID;
            this.Objcustomerdetail.Contact_Name = ReturnObj.Contact_Name;
            this.Objcustomerdetail.Cost_Cen_ID = ReturnObj.Cost_Cen_ID;
            this.Objcustomerdetail.Address = ReturnObj.Address;
            console.log(ReturnObj)
            // const dob = ReturnObj.DOB ? this.DateService.dateConvert(ReturnObj.DOB) : undefined;
            // const doa = ReturnObj.DOA ? this.DateService.dateConvert(ReturnObj.DOA) : undefined;

            // this.Objcustomerdetail.DOB = dob && dob.split('/', 1)[0].length === 1 ? '0'+ dob : dob;
            // this.Objcustomerdetail.DOA = doa && doa.split('/', 1)[0].length === 1 ? '0'+ doa : doa;
           if(ReturnObj.DOB) {
            var dateObj = new Date(ReturnObj.DOB);
            var month:any = (dateObj.getMonth() + 1).toString().length == 1 ? '0' + (dateObj.getMonth() + 1).toString() : dateObj.getMonth() + 1;
            var day:any = dateObj.getDate().toString().length == 1 ? '0' + dateObj.getDate().toString() : dateObj.getDate();
            var year = dateObj.getFullYear();
            this.Objcustomerdetail.DOB =  day + "/" + month + "/" + year;
           }
           if(ReturnObj.DOA) {
            var dateObj = new Date(ReturnObj.DOA);
            var month:any = (dateObj.getMonth() + 1).toString().length == 1 ? '0' + (dateObj.getMonth() + 1).toString() : dateObj.getMonth() + 1;
            var day:any = dateObj.getDate().toString().length == 1 ? '0' + dateObj.getDate().toString() : dateObj.getDate();
            var year = dateObj.getFullYear();
            this.Objcustomerdetail.DOA =  day + "/" + month + "/" + year;
           }
            this.Objcustomerdetail.Remarks = ReturnObj.Bill_Remarks;
            this.Objcustomerdetail.GST_No = ReturnObj.GST_No;
            }
           else {
            this.Objcustomerdetail.Foot_Fall_ID = '0';
            this.Objcustomerdetail.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
           }
      });
    }
  }

  ShowCustomerDetailsPopUp (val) {
    this.Objcustomerdetail = new Customerdetail();
    this.Objcustomerdetail.Redirect_To = val;
    this.GSTvalidFlag = false;
    this.ClickedOnlineLedger = {};
    this.CustomerDetailsFormSubmitted = false;
    if (this.EODstatus === "YES"){
      this.CustomerDetailsPopUpFlag = true;
    } else {
        this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail: "Cannot found EOD In Previous Date "
          })
    }
    this.locationInput.nativeElement.value = '';
    this.NoPhonedisable = false;
    this.NoPhoneFlag = false;
    setTimeout(function(){
      const elem  = document.getElementById('Customer');
      elem.focus();
    },500)
    // this.CustMob.applyFocus()
    // this.CustMob.click();
  }
  ShowCustomerDetailsadvPopUp (val) {
    this.Objcustomerdetail = new Customerdetail();
    this.Objcustomerdetail.Redirect_To = val;
    this.GSTvalidFlag = false;
    this.ClickedOnlineLedger = {};
    this.CustomerDetailsFormSubmitted = false;
    this.CustomerDetailsPopUpFlag = true;
    this.locationInput.nativeElement.value = '';
    this.NoPhonedisable = false;
    this.NoPhoneFlag = false;
    setTimeout(function(){
      const elem  = document.getElementById('Customer');
      elem.focus();
    },500)
    // this.CustMob.applyFocus()
    // this.CustMob.click();
  }
  ShowOnlineDelOrderNo (obj) {
    this.ClickedOnlineLedger = {};
    if(obj.Txn_ID){
      this.ClickedOnlineLedger = obj;
      this.ClickedOnlineLedger['Order_Date'] = new Date();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "OrderNo",
        sticky: true,
        severity: "info",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
        });
      setTimeout(function(){
        const elem  = document.getElementById('OrderNoCheck');
        elem.focus();
      },500)
    }
  }
  onConfirm() {
    if(this.ClickedOnlineLedger['Order_No'] && this.ClickedOnlineLedger['Order_Date']) {
      this.ClickedOnlineLedger['Order_Date'] = this.DateService.dateConvert(new Date(this.ClickedOnlineLedger['Order_Date']));
      this.compacctToast.clear('OrderNo');
      this.ClickedOnlineLedger['Redirect_To'] = './K4C_Outlet_Sale_Bill';
      this.DynamicRedirectTo(this.ClickedOnlineLedger);
      this.ClickedOnlineLedger = {};
    }
  }
  onReject() {
    this.ClickedOnlineLedger = {};
    this.compacctToast.clear('OrderNo');
  }

  NoPhone(){
    this.Objcustomerdetail.Mobile = undefined;
    this.Objcustomerdetail.Contact_Name = undefined;
    if (this.NoPhoneFlag) {
      this.Objcustomerdetail.Mobile = "9999999999";
      this.GetCustomerDetails();
      this.NoPhonedisable = true;
      // this.Objcustomerdetail.Contact_Name = "Customer";
    }else{
      this.NoPhonedisable = false;
    }
  }

  getAddressOnChange(e) {
    this.ObjLead.Location = undefined;
    if (e) {
      this.ObjLead.Location = e;
    }
  }
  IsNumeric(input)
  {
     return (input - 0) == input && input.length > 0;
  }
  checkDOB(){
    console.log(this.Objcustomerdetail.DOB)
    if(this.Objcustomerdetail.DOB){
      const DateArr =  this.Objcustomerdetail.DOB.split("/");
      const day:any  = DateArr[0] ,month:any  = DateArr[1] , year:any  = DateArr[2];
      if (!this.IsNumeric(day) || day < 1) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "DOB Date Format Invalid.",
          detail: "Date Format Must Be - dd/mm/yyyy"
        });
        return false;
      }
      if (!this.IsNumeric(month) || (month < 1) || (month > 12))  {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "DOB Date Format Invalid.",
          detail: "Date Format Must Be - dd/mm/yyyy"
        });
        return false;
      }
      if (!this.IsNumeric(year) || (year < 1900) || (year > 2100))  {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "DOB Date Format Invalid.",
          detail: "Date Format Must Be - dd/mm/yyyy"
        });
        return false;
      }
      return true;
    } else {
      return true;
    }


  }
  checkAnniversary(){
    console.log(this.Objcustomerdetail.DOA)
    if(this.Objcustomerdetail.DOA) {
        const DateArr =  this.Objcustomerdetail.DOA.split("/");
        const day:any  = DateArr[0] ,month:any  = DateArr[1] , year:any  = DateArr[2];
        if (!this.IsNumeric(day) || day < 1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "DOB Date Format Invalid.",
            detail: "Date Format Must Be - dd/mm/yyyy"
          });
          return false;
        }
        if (!this.IsNumeric(month) || (month < 1) || (month > 12))  {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "DOB Date Format Invalid.",
            detail: "Date Format Must Be - dd/mm/yyyy"
          });
          return false;
        }
        if (!this.IsNumeric(year) || (year < 1900) || (year > 2100))  {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "DOB Date Format Invalid.",
            detail: "Date Format Must Be - dd/mm/yyyy"
          });
          return false;
        }
        return true;
    } else {
      return true;
    }
  }
  CheckValidDateGlobal(){
    let flag = true;
    if(!this.checkDOB()) {
      flag = false;
    }
    if(!this.checkAnniversary()) {
      flag = false;
    }
    return flag;

  }
  getbilldate(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Outlet Bill Date",
      //"Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.dateList = data;
    //console.log("this.dateList  ===",this.dateList);
     this.billdate =  new Date(data[0].Outlet_Bill_Date);
     this.PreviousDate = this.DateService.dateConvert(new Date(this.billdate));
     console.log("this.billdate  ===",this.PreviousDate);
    //  let Datetemp:Date =  new Date(data[0].Outlet_Bill_Date)
    //   const Timetemp =  Datetemp.getDate() - 1;
    //   this.PreviousDate = new Date(Timetemp);
    //   console.log("minDate==", this.PreviousDate)
    // on save use this
   // this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));

  })
  }
  EODCheck(){
    const TempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Date : this.PreviousDate
   }
    const obj = {
      "SP_String": "SP_K4C_Day_End_Process",
      "Report_Name_String": "Check_Day_End",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.EODstatus = data[0].Status;
      console.log("EOD status ===" , this.EODstatus);
    })
  }

  OnCustomerDetailsSubmit(valid) {
    this.CustomerDetailsFormSubmitted = true;
    if(this.GSTvalidFlag){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "GST No. is not valid."
      });
      return false;
    }

    if(valid && this.CheckValidDateGlobal()) {
      this.CustomerDetailsFormSubmitted = false;
      this.Objcustomerdetail.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      if(this.Objcustomerdetail.DOB) {
        const DOB:any = this.Objcustomerdetail.DOB.split("/");
        var dateObject1 = this.DateService.dateConvert(new Date(+DOB[2], DOB[1] - 1, +DOB[0]));
        this.Objcustomerdetail.DOB = dateObject1;
      } else {
        this.Objcustomerdetail.DOB = '01/Jan/1900';
      }
      if(this.Objcustomerdetail.DOA) {
        const DOA:any = this.Objcustomerdetail.DOA.split("/");
        const dateObject2 = this.DateService.dateConvert(new Date(+DOA[2], DOA[1] - 1, +DOA[0]));
        this.Objcustomerdetail.DOA = dateObject2;
      } else {
        this.Objcustomerdetail.DOA = '01/Jan/1900';
      }
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "SAVE_OUTLET_CUSTOMER_DETAILS",
        "Json_Param_String" : JSON.stringify([this.Objcustomerdetail])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("save customer details" ,data);
        if(data[0].Foot_Fall_ID) {
          data[0].Mobile_No = this.Objcustomerdetail.Mobile;
          data[0].Redirect_To = this.Objcustomerdetail.Redirect_To;
          this.Objcustomerdetail = new Customerdetail();
          this.GSTvalidFlag = false;
          this.ClickedOnlineLedger = {};
          this.CustomerDetailsPopUpFlag = false;
          this.DynamicRedirectTo(data[0]);
        } else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      })
    }
  }
  DynamicRedirectTo (obj){
    const navigationExtras: NavigationExtras = {
      queryParams: obj,
    };
    this.router.navigate([obj.Redirect_To], navigationExtras);
  }
  RedirectTo(val) {
    if(val === 'bill') {
      const obj = {
        Redirect_To : './K4C_Outlet_Sale_Bill',
        Browse_Flag : true
      }
      this.DynamicRedirectTo(obj);
    } 
    if(val === 'order') {
      const obj = {
        Redirect_To : './K4C_Outlet_Advance_Order',
        Browse_Flag : true
      }
      this.DynamicRedirectTo(obj);
    }
    if(val === 'factory' && this.EODstatus === "YES") {
      const obj = {
        Redirect_To : './K4C_Factory_Return',
        //Browse_Flag : false
        //Create_Flag : true
      }
      this.DynamicRedirectTo(obj);
    } else {
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message ",
          detail: "Cannot found EOD In Previous Date "
        })
    }
    if(val === 'requisition') {
      const obj = {
        Redirect_To : './K4C_Outlet_Requisition',
        //Browse_Flag : true
      }
      this.DynamicRedirectTo(obj);
    }
    if(val === 'acceptchallan') {
      const obj = {
        Redirect_To : './Accept_Receive_Distribution_Challan',
        //Browse_Flag : true
      }
      this.DynamicRedirectTo(obj);
    }
    if(val === 'outletstocktrancfer' && this.EODstatus === "YES") {
      const obj = {
        Redirect_To : './K4C_Outlet_Stock_Transfer',
        //Browse_Flag : true
      }
      this.DynamicRedirectTo(obj);
    } else {
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message ",
          detail: "Cannot found EOD In Previous Date "
        })
    }
    if(val === 'outletstocktrancferautobatch' && this.EODstatus === "YES") {
      const obj = {
        Redirect_To : './Outlet_Stock_Transfer_Atuto_Batch',
        //Browse_Flag : true
      }
      this.DynamicRedirectTo(obj);
    } else {
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message ",
          detail: "Cannot found EOD In Previous Date "
        })
    }
    if(val === 'viewstock') {
      const obj = {
        Redirect_To : './Outlet_Stock_Movement',
        mtype : 'OUT',
        Report_Name : 'Outlet Report'
      }
      this.DynamicRedirectTo(obj);
    }
    if(val === 'bankcollection') {
      const obj = {
        Redirect_To : './Outlet_Txn_Bank_Deposit',
      }
      this.DynamicRedirectTo(obj);
    }
    if(val === 'dayendprocess') {
      const obj = {
        Redirect_To : './K4C_Day_End_Process',
      }
      this.DynamicRedirectTo(obj);
    }
  }

  RedrectEdit(obj,val) {
    if(val === 'ordertobill') {
      const TempObj = {
        Redirect_To : './K4C_Outlet_Sale_Bill',
        Adv_Order_No : obj.Adv_Order_No,
        Edit_from_order : true
      }
      this.DynamicRedirectTo(TempObj);
    } // ORDER TO BILL
    if(val === 'holdbill') {
      const TempObj = {
        Redirect_To : './K4C_Outlet_Sale_Bill',
        Bill_No : obj.Bill_No,
        Edit : true
      }
      this.DynamicRedirectTo(TempObj);
    }
    if(val === 'delivery') {
      const TempObj = {
        Redirect_To : './K4C_Outlet_Advance_Order',
        Adv_Order_No : obj.Adv_Order_No,
        Edit : true
      }
      this.DynamicRedirectTo(TempObj);
    }

  }
  
  // BILL WITHOUT STOCK
  getwalletamount(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Data for Card to Amount",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.walletlist = data;
       //console.log('card=====',this.cardlist)
     })
  }
  getcredittoaccount(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Data for Credit to Account",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.creditlist = data;
       //console.log('credit=====',this.creditlist)
     })
  }
  AmountChange(){
    //console.log("called");
  var credit_amount = this.ObjcashForm.Credit_To_Amount ? this.ObjcashForm.Credit_To_Amount : 0;
  var wallet_amount = this.ObjcashForm.Wallet_Amount ? this.ObjcashForm.Wallet_Amount : 0;
  var cash_amount = this.ObjcashForm.Cash_Amount ? this.ObjcashForm.Cash_Amount : 0 ;
  var card_amount = this.ObjcashForm.Card_Amount ? this.ObjcashForm.Card_Amount : 0;

   this.ObjcashForm.Total_Paid = Number(credit_amount) + Number(wallet_amount) + Number(cash_amount) + Number(card_amount); 

   if(Number(this.Net_Payable) < this.ObjcashForm.Total_Paid){
    this.ObjcashForm.Refund_Amount = (Number(this.ObjcashForm.Total_Paid) - Number(this.Net_Payable)).toFixed(2);
  } else {
    this.ObjcashForm.Refund_Amount = 0 ;
   }

   this.ObjcashForm.Due_Amount = (Number(this.ObjcashForm.Total_Paid) - Number(this.ObjcashForm.Refund_Amount) - Number(this.Net_Payable)).toFixed(2);

  }
  BillWithoutStock(advorderno){
    this.ObjcashForm  =  new cashForm();
    this.CreateBillList = [];
    this.getwalletamount();
    this.getcredittoaccount();
    if (advorderno.Adv_Order_No) {
      this.Adv_Order_No = advorderno.Adv_Order_No;
       this.BillWithoutStockPopup = true;
      // this.Amount_Payable = advorderno.Net_Due;
    }
    this.CreateBillData();
  }
  CreateBillData(){
    const Tempobj = {
      Doc_No : this.Adv_Order_No,
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Create Bill Without Stock",
      "Json_Param_String": JSON.stringify([Tempobj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.CreateBillList = data;
       console.log('CreateBillList=====',this.CreateBillList)
       this.Objcustomer.Costomer_Mobile = data[0].Costomer_Mobile;
       this.Objcustomer.Customer_Name= data[0].Customer_Name;
       this.Objcustomer.Customer_DOB = data[0].Customer_DOB ? this.DateService.dateConvert(data[0].Customer_DOB) : undefined;
       this.Objcustomer.Customer_Anni= data[0].Customer_Anni ? this.DateService.dateConvert(data[0].Customer_Anni) : undefined;
       this.Objcustomer.Customer_GST = data[0].Customer_GST;
       this.Objcustomer.Bill_Remarks = data[0].Bill_Remarks;

       this.CreateBillList.forEach(element => {
        const  productObj = {
            Product_ID : element.Product_ID,
            Product_Description : element.Product_Description,
            Modifier : element.Product_Modifier,
            Weight_in_Pound : element.Weight_in_Pound,
            Flavour : element.Flavour,
            Finishing : element.Finishing,
            Shape : element.Shape,
            Tier : element.Tier,
            Base : element.Base,
            Boxes : element.Boxes,
            Changes_on_Cake : element.Changes_on_Cake,
            Order_Taken_By : element.Order_Taken_By,
            Net_Price : Number(element.Adv_Rate),
            Stock_Qty :  Number(element.Qty),
            Amount :Number(element.Amount).toFixed(2),
            Max_Discount : Number(element.Discount_Per),
            Dis_Amount : Number(element.Discount_Amt).toFixed(2),
            Gross_Amount : Number(element.Gross_Amt).toFixed(2),
            SGST_Per : Number(element.SGST_Per).toFixed(2),
            SGST_Amount : Number(element.SGST_Amt).toFixed(2),
            CGST_Per : Number(element.CGST_Per).toFixed(2),
            CGST_Amount : Number(element.CGST_Amt).toFixed(2),
            GST_Tax_Per : Number(element.IGST_Per),
            GST_Tax_Per_Amt : element.IGST_Amt,
            Net_Amount : Number(element.Net_Amount).toFixed(2)
          };
    
          this.productSubmit.push(productObj);
        });
        // this.ObjcashForm.Credit_To_Ac_ID = data[0].Credit_To_Ac_ID ? data[0].Credit_To_Ac_ID : undefined;
        // this.ObjcashForm.Credit_To_Ac = data[0].Credit_To_Ac ? data[0].Credit_To_Ac : undefined;
        // this.ObjcashForm.Credit_To_Amount = data[0].Credit_To_Amount ? data[0].Credit_To_Amount : "";
        // this.ObjcashForm.Wallet_Ac_ID = data[0].Wallet_Ac_ID ? data[0].Wallet_Ac_ID : undefined;
        // this.ObjcashForm.Wallet_Ac = data[0].Wallet_Ac ? data[0].Wallet_Ac : undefined;
        // this.ObjcashForm.Wallet_Amount = data[0].Wallet_Amount ? data[0].Wallet_Amount : "";
        // this.ObjcashForm.Cash_Amount = data[0].Cash_Amount ? data[0].Cash_Amount : "";
        // this.ObjcashForm.Card_Amount = data[0].Card_Amount ? data[0].Card_Amount : "";
        // this.ObjcashForm.Total_Paid = data[0].Total_Paid;
       // this.ObjcashForm.Net_Due = data[0].Net_Due;
    
        this.Objcustomerdetail.Foot_Fall_ID = data[0].Foot_Fall_ID;
        this.Objcustomerdetail.Cost_Cen_ID = data[0].Cost_Cent_ID;
        //this.Adv_Order_No = data[0].Adv_Order_No;
    
       // this.billstockDate = data[0].Order_Date;
        this.Total = data[0].Net_Amount;
        this.Round_Off = data[0].Rounded_Off;
        this.Amount_Payable = data[0].Amount_Payable;
        this.Adv = data[0].Advance,
        this.Net_Payable = data[0].Net_Payable,
       console.log("this.editList  ===",data);
       this.ObjHomeDelivery.Delivery_Type = data[0].Delivery_Type;
       this.ObjHomeDelivery.Delivery_Mobile_No = data[0].Delivery_Mobile_No;
       this.ObjHomeDelivery.Delivery_Alt_Mobile_No = data[0].Delivery_Alt_Mobile_No;
       this.ObjHomeDelivery.Delivery_Name = data[0].Delivery_Name;
       this.ObjHomeDelivery.Delivery_Address = data[0].Delivery_Address;
       this.ObjHomeDelivery.Delivery_Near_By = data[0].Delivery_Near_By;
       this.ObjHomeDelivery.Delivery_Pin_Code = data[0].Delivery_Pin_Code;


     })
  }
  getdataforSaveBill(){
    if(this.ObjcashForm.Wallet_Ac_ID){
      this.walletlist.forEach(el => {
        if(Number(this.ObjcashForm.Wallet_Ac_ID) === Number(el.Txn_ID)){
          this.ObjcashForm.Wallet_Ac = el.Ledger_Name
        }
      });
  }
  if(this.ObjcashForm.Credit_To_Ac_ID){
    this.creditlist.forEach(el => {
      if(Number(this.ObjcashForm.Credit_To_Ac_ID) === Number(el.Txn_ID)){
        this.ObjcashForm.Credit_To_Ac = el.Ledger_Name
      }
    });
}
this.ObjcashForm.Wallet_Ac_ID = this.ObjcashForm.Wallet_Ac_ID ? this.ObjcashForm.Wallet_Ac_ID : 0 ;
this.ObjcashForm.Wallet_Ac = this.ObjcashForm.Wallet_Ac ? this.ObjcashForm.Wallet_Ac : "NA" ;
this.ObjcashForm.Credit_To_Ac_ID = this.ObjcashForm.Credit_To_Ac_ID ? this.ObjcashForm.Credit_To_Ac_ID : 0 ;
this.ObjcashForm.Credit_To_Ac = this.ObjcashForm.Credit_To_Ac ? this.ObjcashForm.Credit_To_Ac : "NA" ;
  this.ObjcashForm.Credit_To_Amount = this.ObjcashForm.Credit_To_Amount ? this.ObjcashForm.Credit_To_Amount : 0;
  this.ObjcashForm.Wallet_Amount = this.ObjcashForm.Wallet_Amount ? this.ObjcashForm.Wallet_Amount : 0;
  this.ObjcashForm.Cash_Amount = this.ObjcashForm.Cash_Amount ? this.ObjcashForm.Cash_Amount : 0;
  this.ObjcashForm.Card_Amount = this.ObjcashForm.Card_Amount ? this.ObjcashForm.Card_Amount : 0;
  //console.log("this.ObjcashForm.Card_Ac",this.productSubmit);
  if(this.productSubmit.length) {
    let tempArr =[]
    this.productSubmit.forEach(item => {
      const obj = {
          Product_ID : item.Product_ID,
          Product_Description : item.Product_Description,
          Product_Modifier : item.Modifier,
          Rate : item.Net_Price,
          Batch_No : item.Batch_No,
          Qty : item.Stock_Qty,
          Amount : item.Amount,
          Discount_Per : item.Max_Discount,
          Discount_Amt : item.Dis_Amount,
          Gross_Amt : item.Gross_Amount,
          SGST_Per : item.SGST_Per,
          SGST_Amt : item.SGST_Amount,
          CGST_Per : item.CGST_Per,
          CGST_Amt : item.CGST_Amount,
          IGST_Per : item.GST_Tax_Per,
          IGST_Amt : item.GST_Tax_Per_Amt,
          Net_Amount : item.Net_Amount,
          //Advance : item.Advance
      }

    const TempObj = {
      Created_By : this.$CompacctAPI.CompacctCookies.User_ID,
      Foot_Fall_ID : this.Objcustomerdetail.Foot_Fall_ID,
      Bill_Date : this.DateService.dateConvert(new Date(this.billdate)),
      //Doc_No : this.ObjaddbillForm.Doc_No,
      Doc_No : "A",
      Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      //Adv_Order_No : this.ObjaddbillForm.Advance,
      Rounded_Off : 0,
      Amount_Payable : this.Amount_Payable,
      Advance : this.Adv,
      Net_Payable : this.Net_Payable,
      Hold_Bill  : "N",
      Order_Txn_ID : 0,
      Adv_Order_No : this.Adv_Order_No,
      Online_Order_No : null,
      Online_Order_Date : null

    }
    tempArr.push({...obj,...TempObj,...this.Objcustomerdetail,...this.ObjcashForm})
  });
  console.log("save bill =" , tempArr)
  return JSON.stringify(tempArr);
  }
  }
  SaveBill(){
    if(this.ObjcashForm.Total_Paid - this.ObjcashForm.Refund_Amount != this.Net_Payable){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Collected Amount is not equal to net payable "
    });
    return false;
  }
  if((!this.ObjcashForm.Wallet_Ac_ID && this.ObjcashForm.Wallet_Amount) ||
     (!this.ObjcashForm.Wallet_Amount && this.ObjcashForm.Wallet_Ac_ID )){
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Error in wallet Amount"
    });
    return false;
  }
  if((!this.ObjcashForm.Credit_To_Ac_ID && this.ObjcashForm.Credit_To_Amount) ||
     (!this.ObjcashForm.Credit_To_Amount && this.ObjcashForm.Credit_To_Ac_ID )){
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Error in Credit to Account"
    });
    return false;
  }

   const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String" : "Add Outlet Transaction Sale Bill without Stock",
   "Json_Param_String": this.getdataforSaveBill()

  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    //console.log(data);
    var tempID = data[0].Column1;
    this.Bill_No = data[0].Column1;
    if(data[0].Column1){
      this.compacctToast.clear();
     // const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Sale_Bill_ID  " + tempID,
       detail: "Succesfully Saved" 
     });
     this.productSubmit =[];
     this.ObjcashForm  =  new cashForm();
     this.BillWithoutStockPopup = false;
     this.Amount_Payable = null;
     this.GetTodaysDel();
     this.SaveNPrintBill();
    } else{

      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
    }
  })
  }
  SaveNPrintBill() {
    if (this.Bill_No) {
      window.open("/Report/Crystal_Files/K4C/K4C_Bill_Print.aspx?DocNo=" + this.Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  
      );
    }
   // console.log('Doc_No ==', this.Objcustomerdetail.Bill_No)
  }
  // END

  // EDIT DELIVERY
  getdellocation(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Outlet Name",
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.delloclist = data;
     this.Del_Cost_Cent_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID ;
     //console.log("this.delloclist======",this.delloclist);
  
  
    });
  }
  tConv24(time24) {
  let ts = time24;
  let H = +ts.substr(0, 2);
  let h:any = (H % 12) || 12;
  h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
  let ampm = H < 12 ? "am" : "pm";
  ts = h + ts.substr(2, 3) + ampm;
  return ts;
  }
  EditDelivery(advorno){
    this.getdellocation();
    // this.delivery_Date = new Date();
    // this.Del_Date_Time = "";
    if (advorno.Adv_Order_No) {
      this.Adv_Order_No = advorno.Adv_Order_No;
       this.EditDeliverypopup = true;
       this.delivery_Date = advorno.Del_Date;
       //this.Del_Date_Time = advorno.Del_Date_Time_2;
       if(advorno.Del_Date_Time_2){
        const format = this.tConv24(advorno.Del_Date_Time_2);
       this.Del_Date_Time =this.setHours(new Date(), format);
       console.log("this.Del_Date_Time===", this. Del_Date_Time)
      }
    }
    //this.CreateBillData();
  }
  EditDeliverySave(){
    const Deltime = new Date(this.Del_Date_Time);
     var hr = Deltime.getHours();
     let min:any = Deltime.getMinutes();
         min = min < 10 ? '0'+min : min;
         this.Del_Date_Time = hr+ ":" +min
     console.log("time ==" , this.Del_Date_Time)
    const Tempobj = {
      Doc_No : this.Adv_Order_No,
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Del_Location_ID : this.Del_Cost_Cent_ID,
      Del_Date : this.DateService.dateConvert(new Date (this.delivery_Date)),
      Del_Time : this.Del_Date_Time
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Edit Delivery Location Date Time",
      "Json_Param_String": JSON.stringify([Tempobj])
     }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      //console.log(data);
      //var tempID = data[0].Column1;
     // this.Bill_No = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
       // const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Delivery Details",
         detail: "Succesfully Updated" 
       });
       this.EditDeliverypopup = false;
       //this.delivery_Date = new Date();
       //this.Del_Date_Time = "";
       this.Del_Cost_Cent_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
       this.GetTodaysDel();
      } else{
  
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
    })
  }
  // END
}
class Customerdetail{
  Mobile : string;
  Contact_Name : string;
  DOB : string;
  DOA : string;
  GST_No : string;
  Remarks : string;
  Foot_Fall_ID = '0';
  Cost_Cen_ID : number;
  User_ID : string;
  Posted_On : string;
  Address : string;
  Redirect_To : string;

}
class Lead{
  Location : string;
}
class cashForm{
  Coupon_Per : number;
  Credit_To_Ac_ID : any;
  Credit_To_Ac : string;
  Credit_To_Amount: number;
  Wallet_Ac_ID : any;
  Wallet_Ac : string;
  Wallet_Amount : number;
  Cash_Amount: number;
  Card_Amount: number;
  Total_Paid : number;
  Net_Due : number;
  //Refund_Amount = 0;
  Refund_Amount : any;
  Due_Amount : any;
}
class customer{
  Costomer_Mobile : number;
  Customer_Name : string;
  Customer_DOB : string;
  Customer_Anni : string;
  Customer_GST : string;
  Bill_Remarks : string;
  // Delivery_Date : string;
  Del_Date_Time : any;
  Del_Cost_Cent_ID : string;
  Foot_Fall_ID = 0;
  Cost_Cen_ID : number;
  Doc_Date : string;
  //Doc_No = "A" ;
  Adv_Order_No : any;
  //Advance = "NA" ;
  Cuppon_No : string;
  Cuppon_OTP : string;
}
class HomeDelivery{
  Delivery_Type : string;
  Delivery_Mobile_No : any;
  Delivery_Alt_Mobile_No : any;
  Delivery_Name : any;
  Delivery_Address: any;
  Delivery_Near_By : any;
  Delivery_Pin_Code : any;
  //Delivery_Alt_Mobile_No:any;
}
