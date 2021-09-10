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
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,) {
      this.route.queryParams.subscribe((val:any) => {
        this.QueryStringFootfall = undefined;
        if(val.Foot_Fall_ID) {
          this.QueryStringFootfall = window.atob(val['Foot_Fall_ID']);
          this.Mobile_No = window.atob(val['Foot_Fall_ID']);
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
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts",
        "Report_Name_String": "Get Student Details",
        "Json_Param_String": JSON.stringify([{Mobile:this.Mobile_No}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log(data);
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
      this.savedata ={
      Txn_ID : el.Txn_ID,
      Direct_Sale_Revised_Amt : Number(el.Direct_Sale_Revised_Amt)
      }
    })
    console.log("this.savedata",this.savedata);
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "Update_Direct_Sale_Product_Details",
      "Json_Param_String": JSON.stringify([this.savedata])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      const tempID = data[0].message;
      console.log("tempID",tempID);
      if(data[0].message){
        this.display = false;
        console.log("Subscription_Txn_ID",this.Subscription_Txn_ID);
        console.log("this.Foot_Fall_ID",this.Foot_Fall_ID);
        const Link = '/Tutopia_Student_Order?Subscription_Txn_ID='+ window.btoa(this.Subscription_Txn_ID)+'&Menu_Ref_ID='+window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID)+'&Foot_Fall_ID='+window.btoa(this.Foot_Fall_ID);
        window.open(Link);
      }

    })
  }

  makePayment(tabledata){
    console.log("payment",tabledata);
       const Subscription_Txn_ID = tabledata.Subscription_Txn_ID
       const Foot_Fall_ID = tabledata.Foot_Fall_ID;
        console.log("Subscription_Txn_ID",Subscription_Txn_ID);
        console.log("this.Foot_Fall_ID",Foot_Fall_ID);
    //const Link = '/Tutopia_Order_Payment?Subscription_Txn_ID='+ window.btoa(this.Subscription_Txn_ID);
    const Link = '/Tutopia_Order_Payment?Subscription_Txn_ID='+ window.btoa(Subscription_Txn_ID)+'&Menu_Ref_ID='+window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID)+'&Foot_Fall_ID='+window.btoa(Foot_Fall_ID);
        window.open(Link);


  }
  printOut(col){
    console.log("Print");
   window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + col.Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }
}
