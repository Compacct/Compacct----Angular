
import { Component, OnDestroy, OnInit ,ViewEncapsulation} from '@angular/core';
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
  }
  ngOnDestroy() {
    if ($(".content-header").hasClass("hide-pos")) {
      $(".content-header").removeClass("hide-pos");
    }
  }
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
           console.log(data);
           const ReturnObj = data.length ? data[0] : {};
           if(ReturnObj.Foot_Fall_ID) {
            this.Objcustomerdetail.Foot_Fall_ID = ReturnObj.Foot_Fall_ID;
            this.Objcustomerdetail.Contact_Name = ReturnObj.Contact_Name;
            this.Objcustomerdetail.Cost_Cen_ID = ReturnObj.Cost_Cen_ID;
            this.Objcustomerdetail.Address = ReturnObj.Address;
            this.Objcustomerdetail.DOB = ReturnObj.DOB;
            this.Objcustomerdetail.DOA = ReturnObj.DOA;
            this.Objcustomerdetail.Remarks = ReturnObj.Bill_Remarks;
            this.Objcustomerdetail.GST_No = ReturnObj.Costomer_Mobile;
           } else {
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
    this.CustomerDetailsPopUpFlag = true;
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



  OnCustomerDetailsSubmit(valid) {
    this.CustomerDetailsFormSubmitted = false;
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
    if(valid) {
      this.CustomerDetailsFormSubmitted = false;
      this.Objcustomerdetail.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "SAVE_OUTLET_CUSTOMER_DETAILS",
        "Json_Param_String" : JSON.stringify([this.Objcustomerdetail])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log(data);
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
    if(val === 'factory') {
      const obj = {
        Redirect_To : './K4C_Factory_Return',
        //Browse_Flag : false
        Create_Flag : true
      }
      this.DynamicRedirectTo(obj);
    }
    if(val === 'Browsefactory') {
      const obj = {
        Redirect_To : './K4C_Factory_Return',
        Browse_Flag : true
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
