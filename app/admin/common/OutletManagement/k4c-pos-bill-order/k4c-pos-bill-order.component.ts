
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
