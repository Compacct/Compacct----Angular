import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Data, NavigationExtras, Router } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-tuto-order-booking',
  templateUrl: './tuto-order-booking.component.html',
  styleUrls: ['./tuto-order-booking.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoOrderBookingComponent implements OnInit {
  orderBookingFormSubmitted = false;
  seachSpinner = false;
  Mobile_No : any;
  getAlldata = [];
  stdname : any;
  stdclass : any;
  regdate : any;
  popdataList =[];
  display: boolean = false;
  Subscription_Txn_ID : any;
  Foot_Fall_ID : any;
  savedata:any = [];
  totalvalue = undefined;
  QueryStringFootfall = undefined;

  OrderNo = undefined;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private router : Router,
    public $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,) {
      this.route.queryParams.subscribe((val:any) => {
        this.QueryStringFootfall = undefined;
        if(val.Mobile) {
          this.Mobile_No = window.atob(val['Mobile']);
          this.GetstudentDetails(true);
        }
      } ); }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Direct Sale Order",
      Link: "Channel Sale -> Direct Sale Order"
    });
  }

GetstudentDetails(valid){
  this.orderBookingFormSubmitted = true;
  console.log("valid",valid);
  if(valid){
    if(this.Mobile_No){
      this.seachSpinner = true;
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts",
        "Report_Name_String": "Get Student Details",
        "Json_Param_String": JSON.stringify([{Mobile:this.Mobile_No}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log(data);
        this.seachSpinner = false;
        if(data.length) {
          this.getAlldata = data;
          this.getAlldata.forEach(el=>{
            el.Billed = el.Billed == "Y" ? "Yes" : "No";
            el.Paid = el.Paid == "Y" ? "Yes" : "No";
          })
        this.stdname = data[0].Student_Name;
        this.stdclass = data[0].Class_Name;
        this.regdate = data[0].Registered_On;
        // this.Subscription_Txn_ID = data[0].Subscription_Txn_ID
        // this.Foot_Fall_ID = data[0].Foot_Fall_ID;
        } else{
          this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "No Unbilled Subscription Found Against this Phone Number"
            });
        }

      })
     }
    }
  }
  Billcreation(tabledata) {
    console.log("Billcreation",tabledata);
    this.Subscription_Txn_ID = undefined;
    this.Foot_Fall_ID = undefined;
    this.Subscription_Txn_ID = tabledata.Subscription_Txn_ID
    this.Foot_Fall_ID = tabledata.Foot_Fall_ID;
  //  const Link = '/Tutopia_Student_Order?Subscription_Txn_ID='+ window.btoa(col.Subscription_Txn_ID)+'&Menu_Ref_ID='+window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID)+'&Foot_Fall_ID='+window.btoa(col.Foot_Fall_ID);
  //    window.open(Link);
  this.display = true;
   this.popdataList =[];
   if(this.Subscription_Txn_ID){
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "Get_Direct_Sale_Product_Details",
      "Json_Param_String": JSON.stringify([{Subscription_Txn_ID : this.Subscription_Txn_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.popdataList = data;
        console.log("this.popdataList",this.popdataList);

    })
   }

}
  getTotalValue(){
    let val:number= 0;
    this.popdataList.forEach((item)=>{
      val += Number(item.Direct_Sale_Revised_Amt)
    });
    //console.log("val",val);
    return val ? val : '-';
  }
  UpdateSale(){
    this.savedata =[];
    console.log("this.popdataList",this.popdataList);
    this.popdataList.forEach(el=>{
     const  productObj ={
      Txn_ID : el.Txn_ID,
      Direct_Sale_Revised_Amt : Number(el.Direct_Sale_Revised_Amt)
      }
      this.savedata.push(productObj)
    })
    console.log("this.savedata",this.savedata);
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "Update_Direct_Sale_Product_Details",
      "Json_Param_String": JSON.stringify(this.savedata)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      const tempID = data[0].message;
      console.log("tempID",tempID);
      if(data[0].message){
        this.display = false;
        console.log("Subscription_Txn_ID",this.Subscription_Txn_ID);
        console.log("this.Foot_Fall_ID",this.Foot_Fall_ID);
        const obj1 = {
          Subscription_Txn_ID :  window.btoa(this.Subscription_Txn_ID),
          Menu_Ref_ID : window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID),
          Foot_Fall_ID : window.btoa(this.Foot_Fall_ID)
        }
        this.DynamicRedirectTo(obj1,'./Tutopia_Student_Order');

      }

    })
  }

  makePayment(tabledata){
        const obj = {
          Subscription_Txn_ID :  window.btoa(tabledata.Subscription_Txn_ID),
          Menu_Ref_ID : window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID),
          Foot_Fall_ID : window.btoa(tabledata.Foot_Fall_ID)
        }
        this.DynamicRedirectTo(obj,'./Tutopia_Order_Payment');
    // const Link = '/Tutopia_Order_Payment?Subscription_Txn_ID='+ window.btoa(this.Subscription_Txn_ID);
    // const Link = '/Tutopia_Order_Payment?Subscription_Txn_ID='+ window.btoa(Subscription_Txn_ID)+'&Menu_Ref_ID='+window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID)+'&Foot_Fall_ID='+window.btoa(Foot_Fall_ID);
    //     window.open(Link);


  }
  DynamicRedirectTo (obj,Redirect_To){
    const navigationExtras: NavigationExtras = {
      queryParams: obj,
    };
    this.router.navigate([Redirect_To], navigationExtras);
  }
  printOut(col){
    console.log("Print");
   window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + col.Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }

  CancelBil(obj){
    this.OrderNo = undefined;
    if(obj.Bill_No) {
      this.OrderNo = obj.Bill_No;
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
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm() {
    const Tempobj = {
      Order_No : this.OrderNo,
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String" : "Tutopia_Subscription_Accounts",
      "Report_Name_String" : "Cancel_Bill",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log(data);
      if(data[0].message === "success") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Order No : " + this.OrderNo,
          detail:  "Succesfully Cancelled."
        });
        this.OrderNo = undefined;
        this.GetstudentDetails(true);
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
