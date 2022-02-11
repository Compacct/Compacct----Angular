import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { DatePickerComponent, DateTimePickerModule, TimePickerComponent } from "@syncfusion/ej2-angular-calendars";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { time } from 'console';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { valHooks } from 'jquery';
import { compareElementParent } from '@syncfusion/ej2-base';
import { NgxUiLoaderService } from "ngx-ui-loader";
declare var $:any;
@Component({
  selector: 'app-k4c-outlet-advance-order',
  templateUrl: './k4c-outlet-advance-order.component.html',
  styleUrls: ['./k4c-outlet-advance-order.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.Emulated
})
export class K4cOutletAdvanceOrderComponent implements OnInit {
  items = [];
  Spinner = false;
  tabIndexToView = 0;
  buttonname = "Save & Print Bill";
  searchObj : search = new search();
  seachSpinner = false;
  seachSpinner1 = false;
  Searchlist = [];
  MobileSubmitFormSubmitted = false;
  Searchbymobilelist = [];
  Search_By = "Delivery Date";
  dateList: any;
  myDate: Date;
  returnedID = [];
  selectitem = [];
  ObjaddbillForm : addbillForm  = new addbillForm();
  productSubmit = [];

  Objcustomerdetail : customerdetail = new customerdetail();
  GSTvalidFlag = false;

  ObjcashForm : cashForm  = new cashForm();
  delloclist: any;
  addbillFormSubmitted = false;
  creditlist: any;
  walletlist: any;
  Total: any;
  Round_Off: any;
  Amount_Payable: any;
  FlavourList = [];
  Amount: any;
  Dis_Amount: any;
  Gross_Amount: any;
  SGST_Amount: any;
  CGST_Amount: any;
  GST_Tax_Per_Amt: any;
  SavePrintFormSubmitted = false;
  delivery_Date = new Date();
  editList: any;
  Cancel_Order: any;
  //DocNO = undefined;
 // Delivey_Time = new Date();

  // FOR MAKE PAYMENT
  MakePaymentModal = false;
  Amt_Payable: any;

  ObjHomeDelivery : HomeDelivery = new HomeDelivery();
  HomeDeliverypopup = false;
  CustomerDetailsFormSubmitted = false;
  @ViewChild("Del_Date2" ,{static : false}) Del_Date2 : DatePickerComponent;
  @ViewChild("Del_time" ,{static : false}) Del_timepic : TimePickerComponent;
  @ViewChild("Product2" ,{static : false}) Product2: Dropdown;
  @ViewChild("location", { static: false}) locationInput: ElementRef;
  AdvOrderfieldlist: any;
  Finishinglist: any;
  Shapelist: any;
  Tierlist: any;
  Baselist: any;
  public QueryStringObj : any;
  CustomerDisabledFlag = false;
  Hold_Order_Flag = false;

  minTime: Date;
  maxTime: Date;
  Additional_Payment : number;
  FromCostCentId: any;
  Fromgodown_id: any;
  checkSave = true;
  // TimeValue: Date = new Date('10:00 AM');
  RefundPopup = false;
  Adv_Order_No: any;
  ObjRefundcashForm : RefundcashForm  = new RefundcashForm();
  RAmount_Payable: any;
  Cancle_Remarks : string;
  cancleFormSubmitted = false;
  Can_Remarks = false;

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private route : ActivatedRoute,
    private router : Router,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) {
    this.route.queryParamMap.subscribe((val:any) => {
      this.CustomerDisabledFlag = false;
      if(val.params) {
        this.QueryStringObj = val.params;
        if(this.QueryStringObj.Foot_Fall_ID) {
          this.CustomerDisabledFlag = true;
          this.tabIndexToView = 1;
          this.UpdateCustomerDetails(this.QueryStringObj);

        }
        if(this.QueryStringObj.Browse_Flag) {
          this.CustomerDisabledFlag = false;
        }
        if(this.QueryStringObj.Edit){
          this.CustomerDisabledFlag = true;
          this.Edit(this.QueryStringObj);
        }
        if(this.QueryStringObj.Edit_Adv_Order){
          this.CustomerDisabledFlag = true;
          this.EditFromBrowse(this.QueryStringObj);
        }
      }
     } );
    this.Header.pushHeader({
      Header: "Customized Order",
      Link: " Outlet -> Customized Order"
    });
  }

  ngOnInit() {
    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Customized Order",
      Link: " Outlet -> Customized Order"
    });
     this.getorderdate();
     this.getcostcenid();
     this.getgodownid();
     this.getdellocation();
     this.getselectitem();
     this.getcredittoaccount();
     this.getwalletamount();
     this.getAdvOrderfield();
     
     //Delivery Date
   //this.DateService.dateConvert(new Date (this.delivery_Date));
   this.delivery_Date.setDate(new Date(this.delivery_Date).getDate() + 1);
   this.minTime = this.setHours(new Date(), "10:00am");
   this.maxTime = this.setHours(new Date(), "06:00pm");
   //this.DateService.dateTimeConvert(new Date(this.Delivey_Time));
  }
  setHours(dt, h):any {
    const s = /(\d+):(\d+)(.+)/.exec(h);
    dt.setHours(s[3] === "pm" ?
      12 + parseInt(s[1], 10) :
      parseInt(s[1], 10));
    dt.setMinutes(parseInt(s[2],10));
    return dt;
  }
  UpdateCustomerDetails(data){

    this.Objcustomerdetail.Foot_Fall_ID = data.Foot_Fall_ID;
   this.Objcustomerdetail.Costomer_Mobile = data.Mobile_No;
   this.Objcustomerdetail.Customer_Name = undefined;
   this.Objcustomerdetail.Customer_DOB = undefined;
   this.Objcustomerdetail.Customer_Anni = undefined;
   this.Objcustomerdetail.Cost_Cen_ID = undefined;
   this.Objcustomerdetail.Customer_GST = undefined;
   this.Objcustomerdetail.Bill_Remarks = undefined;
   console.log(this.Objcustomerdetail.Costomer_Mobile);
   if(this.Objcustomerdetail.Costomer_Mobile) {
     const obj = {
       "SP_String": "SP_Controller_Master",
       "Report_Name_String": "GET_OUTLET_CUSTOMER_DETAILS",
       "Json_Param_String" : JSON.stringify([{'Costomer_Mobile' : this.Objcustomerdetail.Costomer_Mobile}])
     }
     this.GlobalAPI
         .getData(obj)
         .subscribe((data: any) => {
          console.log(data);
          const ReturnObj = data.length ? data[0] : {};
          if(ReturnObj.Foot_Fall_ID) {
           this.Objcustomerdetail.Foot_Fall_ID = ReturnObj.Foot_Fall_ID;
           this.Objcustomerdetail.Customer_Name = ReturnObj.Contact_Name;
           this.Objcustomerdetail.Cost_Cen_ID = ReturnObj.Cost_Cen_ID;
           this.Objcustomerdetail.Customer_DOB = ReturnObj.DOB ? this.DateService.dateConvert(ReturnObj.DOB) : undefined;
           this.Objcustomerdetail.Customer_Anni = ReturnObj.DOA ? this.DateService.dateConvert(ReturnObj.DOA) : undefined;
          //  this.Objcustomerdetail.Customer_DOB = ReturnObj.DOB;
          //  this.Objcustomerdetail.Customer_Anni = ReturnObj.DOA;
           this.Objcustomerdetail.Bill_Remarks = ReturnObj.Remarks;
           this.Objcustomerdetail.Customer_GST = ReturnObj.GST_No;
           this.Del_Date2.focusIn();
           this.Del_Date2.show();
          } else {
           this.Objcustomerdetail.Foot_Fall_ID = 0;
          }
     });
   }
 }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save & Print Bill";
    this.productSubmit =[];
    this.clearData();
    this.clearlistamount();
    this.cleartotalamount();
    //this.searchObj.Outlet = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
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
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.searchObj.start_date = dateRangeObj[0];
      this.searchObj.end_date = dateRangeObj[1];
    }
  }

  Showdata(){
    this.seachSpinner = true;
    this.Searchlist = [];
    //console.log("Search_By",this.Search_By)
    const start = this.searchObj.start_date
      ? this.DateService.dateConvert(new Date(this.searchObj.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.searchObj.end_date
      ? this.DateService.dateConvert(new Date(this.searchObj.end_date))
      : this.DateService.dateConvert(new Date());
    const tempobj = {
      From_Date : start,
      To_Date : end,
      User_Id : this.$CompacctAPI.CompacctCookies.User_ID,
      Menu_Ref_Id : this.$CompacctAPI.CompacctCookies.Menu_Ref_ID,
      //Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Cost_Cent_ID : this.ObjaddbillForm.BrowserDeliveryto ? this.ObjaddbillForm.BrowserDeliveryto : 0,
      Search_By : this.Search_By
    }

    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Browse Outlet Transaction Advance Order",
      "Json_Param_String": JSON.stringify([tempobj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Searchlist = data;
       //console.log('searchlist=====',this.Searchlist)
       //this.seachSpinner = false;
       this.seachSpinner = false;
     })
  }
  getTotalValue(key){
    let Amtval = 0;
    this.Searchlist.forEach((item)=>{
      Amtval += Number(item[key]);
    });

    return Amtval ? Amtval : '-';
  }

  Showdatabymobile(valid){
    this.Searchlist = [];
    this.MobileSubmitFormSubmitted = true;
    if(valid){
    const tempobj = {
      User_Id : this.$CompacctAPI.CompacctCookies.User_ID,
      Menu_Ref_Id : this.$CompacctAPI.CompacctCookies.Menu_Ref_ID,
      Costomer_Mobile : this.Objcustomerdetail.Costomer_Mobile
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Browse Outlet Transaction Advance Order Using Mobile No",
      "Json_Param_String": JSON.stringify([tempobj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Searchlist = data;
       //console.log('Searchbymobilelist=====',this.Searchlist)
       //this.seachSpinner = false;
       this.MobileSubmitFormSubmitted = false;
     })
    }
  }

  //CANCLE BROWSE ROW
  Cancle(row){
    //console.log(this.Objcustomerdetail.Adv_Order_No)
    this.Cancle_Remarks = "";
    this.cancleFormSubmitted = false;
    this.Objcustomerdetail.Adv_Order_No = undefined ;
    if(row.Adv_Order_No){
      this.checkSave = true;
      this.Can_Remarks = true;
    this.Objcustomerdetail.Adv_Order_No = row.Adv_Order_No;
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
   onConfirm(valid) {
    this.Can_Remarks = true;
    this.cancleFormSubmitted = true;
    const Tempobj = {
      Doc_No : this.Objcustomerdetail.Adv_Order_No,
      Order_Cancel_Remarks : this.Cancle_Remarks
    }
    if (valid) {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Cancle Advance Order",
      "Json_Param_String": JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      var msg = data[0].Column1;
      //console.log(data);
      //if(data[0].Column1 === "Cancel Successfully") {
        if(data[0].Column1) {
        this.Showdata();
        this.Showdatabymobile(true);
        this.cancleFormSubmitted = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Adv_Order_No : " + this.Objcustomerdetail.Adv_Order_No,
          detail:  msg
        });

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

  onReject() {
    this.compacctToast.clear("c");
  }
  //onKeydownMain(event,nextElemID): void {
  // GLOBAL KEY EVENT
  onKeydownMain(event,nextElemID): void {
  if (event.key === "Enter" && nextElemID){
      if (nextElemID === 'enter'){
          console.log('Table Data last enter')
          const elem  = document.getElementById('row-Add');
          elem.click();
      } else if (nextElemID === 'Delivey_Time') {
          // this.Del_Date2.applyFocus()
          // this.Del_Date2.containerViewChild.nativeElement.click();
          console.log('Product Focus Done');
      } else {
        const elem  = document.getElementById(nextElemID);
        elem.focus();
      }
      event.preventDefault();
      }

   // focus if not null
   }
  enableButton(event) {
    if (event.key === "Enter" && this.delivery_Date) {

      this.Del_timepic.focusIn();
      this.Del_timepic.show();
    }
    event.preventDefault();
    }
  DeliveryChange(event){
    console.log(event)
    if (event.event.code === "Enter"){
      this.Del_timepic.focusIn();
      this.Del_timepic.show();
    }
  }
  DeliveryTimeChange(event){
    console.log(this.Objcustomerdetail.Del_Date_Time)
    if (event.event.code === "Enter"){
      const elem  = document.getElementById('delLocation');
          elem.click();
    }
  }

getorderdate(){
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Outlet Order Date",
      //"Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.dateList = data;
    //console.log("this.dateList  ===",this.dateList);
   this.myDate =  new Date(data[0].Outlet_Order_Date);
    // on save use this
   // this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));

  })
}

getcostcenid(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Cost Center Name All",
    "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
    //"Json_Param_String": JSON.stringify([{User_ID : 61}])
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.returnedID = data;
   this.FromCostCentId = data[0].Cost_Cen_ID ? data[0].Cost_Cen_ID : 0;
   //this.ObjaddbillForm.selectitem = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
   this.ObjaddbillForm.selectitem = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
   if(this.$CompacctAPI.CompacctCookies.User_Type == 'U'){
   this.ObjaddbillForm.BrowserDeliveryto = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
   } else {
    this.ObjaddbillForm.BrowserDeliveryto = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
   }
   //console.log("this.ObjaddbillForm.BroeItem",this.ObjaddbillForm.BroeItem);
   this.getselectitem();
  //console.log("this.returnedID======",this.returnedID);

  });
  // const obj = {
  //   "SP_String": "SP_Controller_Master",
  //   "Report_Name_String": "Get Sale Requisition Outlet",
  //   "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
  //   //"Json_Param_String": JSON.stringify([{User_ID : 61}])
  //  }
  // this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //  this.returnedID = data;
  //  this.FromCostCentId = data[0].Cost_Cen_ID ? data[0].Cost_Cen_ID : 0;
  //  //this.ObjaddbillForm.selectitem = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  //  this.ObjaddbillForm.selectitem = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
  // //  if(this.$CompacctAPI.CompacctCookies.User_Type == 'U'){
  // this.ObjaddbillForm.BrowserDeliveryto = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
  // //  }
  //  //console.log("this.ObjaddbillForm.BroeItem",this.ObjaddbillForm.BroeItem);
  //  this.getselectitem();
  //  //console.log("this.returnedID======",this.returnedID); 


  // });
}
getgodownid(){
  const TempObj = {
    Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
   }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Godown For Sale Bill",
    "Json_Param_String": JSON.stringify([TempObj])
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Fromgodown_id = data[0].godown_id ? data[0].godown_id : 0;
   //console.log('godownid ==', data)

  });
}

getdellocation(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Outlet Name",
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.delloclist = data;
   this.Objcustomerdetail.Del_Cost_Cent_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID ;
   //console.log("this.delloclist======",this.delloclist);


  });
}

getselectitem(){
   //if(this.ObjaddbillForm.Cost_Cen_ID){
    this.Objcustomerdetail.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    //console.log("this.ObjaddbillForm.Doc_Date ===",this.ObjaddbillForm.Doc_Date)
    const TempObj = {
      User_ID:this.$CompacctAPI.CompacctCookies.User_ID,
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Doc_Type : "ORDER",
      //Doc_Date : this.Objcustomerdetail.Doc_Date,
      Product_Type_ID : 0
     }
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String" : "Get Sale Requisition Product",
     "Json_Param_String": JSON.stringify([TempObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID
        });
        this.selectitem = data;

      } else {
        this.selectitem = [];

      }
      //console.log("this.selectitem======",this.selectitem);


    });



}

getAdvOrderfield(){
  this.FlavourList =[];
  this.Finishinglist=[];
  this.Shapelist =[];
  this.Tierlist=[];
  this.Baselist=[];

  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Advance Order Field",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.AdvOrderfieldlist = data;
     //console.log('Adv orer field list=====',this.AdvOrderfieldlist)
     this.AdvOrderfieldlist.forEach((ele,i) => {
        const ObjFla = this.AdvOrderfieldlist.filter((elem) => elem.Field_Head === "Flavour ")[i];
        const ObjFin = this.AdvOrderfieldlist.filter((elem) => elem.Field_Head === "Finishing")[i];
        const ObjShape = this.AdvOrderfieldlist.filter((elem) => elem.Field_Head === "Shape")[i];
        const ObjTier = this.AdvOrderfieldlist.filter((elem) => elem.Field_Head === "Tier")[i];
        const ObjBase = this.AdvOrderfieldlist.filter((elem) => elem.Field_Head === "Base")[i];
        if(ObjFla){
          this.FlavourList.push(ObjFla);
         }
        if(ObjFin){
          this.Finishinglist.push(ObjFin);
         }
        if(ObjShape){
          this.Shapelist.push(ObjShape);
         }
        if(ObjTier){
          this.Tierlist.push(ObjTier);
         }
        if(ObjBase){
          this.Baselist.push(ObjBase);
         }
     });

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
// g-MAp
getAddressOnChange(e) {
  this.ObjHomeDelivery.Delivery_Near_By = undefined;
  if (e) {
    this.ObjHomeDelivery.Delivery_Near_By = e;
  }
}
ProductChange() {
if(this.ObjaddbillForm.Product_ID) {
  const ctrl = this;
  const productObj = $.grep(ctrl.selectitem,function(item) {return item.Product_ID == ctrl.ObjaddbillForm.Product_ID})[0];
  //console.log(productObj);
  //this.rate = productObj.Sale_rate;
  this.ObjaddbillForm.Product_Description = productObj.Product_Description;
  //this.ObjaddbillForm.Stock_Qty = productObj.Stock_Qty;
  this.ObjaddbillForm.Sale_rate =  productObj.Sale_rate;
  this.ObjaddbillForm.GST_Tax_Per =  productObj.GST_Tax_Per;
  this.ObjaddbillForm.Product_Type_ID = productObj.Product_Type_ID;
}
}
tConv24(time24) {
  let ts = time24;
  let H = +ts.substr(0, 2);
  let h:any = (H % 12) || 12;
  h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
  let ampm = H < 12 ? "am" : "pm";
  ts = h + ts.substr(2, 3) + ampm;
  return ts;
};
// CALCULATION
add(valid) {
  this.addbillFormSubmitted = true;
  if(valid) {

  //console.log("this.ObjaddbillForm===",this.ObjaddbillForm)

//   var Amount;
//   if (!this.ObjaddbillForm.Weight_in_Pound && !this.ObjaddbillForm.Acompanish){
//     Amount = Number(this.ObjaddbillForm.Stock_Qty * this.ObjaddbillForm.Net_Price);
//   }
//  else if ( this.ObjaddbillForm.Weight_in_Pound && this.ObjaddbillForm.Acompanish) {
//    Amount = Number(this.ObjaddbillForm.Stock_Qty * this.ObjaddbillForm.Net_Price * this.ObjaddbillForm.Weight_in_Pound) + Number(this.ObjaddbillForm.Acompanish);
//  } else if (!this.ObjaddbillForm.Acompanish){
//    Amount = Number(this.ObjaddbillForm.Stock_Qty * this.ObjaddbillForm.Net_Price * this.ObjaddbillForm.Weight_in_Pound);
//  } else if (!this.ObjaddbillForm.Weight_in_Pound){
//    Amount = Number(this.ObjaddbillForm.Stock_Qty * this.ObjaddbillForm.Net_Price) + Number(this.ObjaddbillForm.Acompanish);
//  }
  var Amount;
    Amount = Number(this.ObjaddbillForm.Stock_Qty * this.ObjaddbillForm.Sale_rate);
    var totalAmt;
    if(this.ObjaddbillForm.Weight_in_Pound != 0){
    totalAmt = Number(this.ObjaddbillForm.Stock_Qty * this.ObjaddbillForm.Sale_rate * this.ObjaddbillForm.Weight_in_Pound) + Number(this.ObjaddbillForm.Acompanish);
    } else {
    totalAmt = Number(this.ObjaddbillForm.Stock_Qty * this.ObjaddbillForm.Sale_rate) + Number(this.ObjaddbillForm.Acompanish);
    }
    var qtyweightAmt;
    if(this.ObjaddbillForm.Weight_in_Pound != 0){
      qtyweightAmt = this.ObjaddbillForm.Stock_Qty * this.ObjaddbillForm.Weight_in_Pound;
    } else {
      qtyweightAmt = this.ObjaddbillForm.Stock_Qty;
    }
//  console.log("amount ==", Amount)
  var rate =(Number(this.ObjaddbillForm.Sale_rate * 100)) / (Number(this.ObjaddbillForm.GST_Tax_Per) + 100);
  var Accoplish_Amt = (Number(this.ObjaddbillForm.Acompanish * 100)) / (Number(this.ObjaddbillForm.GST_Tax_Per) + 100);
  var Amt = Number((rate * qtyweightAmt) + Number(this.ObjaddbillForm.Acompanish));
  var Dis_Amount = Number(totalAmt * Number(this.ObjaddbillForm.Max_Discount) / 100);
  var SGST_Per = Number(this.ObjaddbillForm.GST_Tax_Per / 2);
  var Gross_Amount = Number(Amt - Dis_Amount) ;
  var SGST_Amount = Number((totalAmt - (rate * qtyweightAmt) - Accoplish_Amt) / 2) ;
  var CGST_Per = Number(this.ObjaddbillForm.GST_Tax_Per / 2);
  var CGST_Amount = Number((totalAmt - (rate * qtyweightAmt) - Accoplish_Amt) / 2) ;
  //this.ObjaddbillForm.Gross_Amt = Gross_Amount;
  //var GST_Tax_Per_Amt = 0;

  var flavourValue = this.FlavourList.find(flavour => flavour.Txn_ID == this.ObjaddbillForm.Flavour);// added for flavour message
  var finishingValue = this.Finishinglist.find(finishing => finishing.Txn_ID == this.ObjaddbillForm.Finishing);
  var shapeValue = this.Shapelist.find(shape => shape.Txn_ID == this.ObjaddbillForm.Shape);
  var tierValue = this.Tierlist.find(tier => tier.Txn_ID == this.ObjaddbillForm.Tier);
  var baseValue = this.Baselist.find(base => base.Txn_ID == this.ObjaddbillForm.Base);
  //new add
  var productObj = {
    Product_ID : this.ObjaddbillForm.Product_ID,
    Product_Description : this.ObjaddbillForm.Product_Description,
    Product_Type_ID : this.ObjaddbillForm.Product_Type_ID,
    //Modifier : this.ObjaddbillForm.Modifier,
    Modifier1 : this.ObjaddbillForm.Modifier1,
    Modifier2 : this.ObjaddbillForm.Modifier2,
    Modifier3 : this.ObjaddbillForm.Modifier3,
    Modifier4 : this.ObjaddbillForm.Modifier4,
    Modifier5 : this.ObjaddbillForm.Modifier5,
    Flavour : flavourValue != undefined ? flavourValue.Field_Value : null, // added for flavour message
    Finishing : finishingValue != undefined ? finishingValue.Field_Value : null,
    Shape : shapeValue != undefined ? shapeValue.Field_Value : null,
    Tier : tierValue != undefined ? tierValue.Field_Value : null,
    Base : baseValue != undefined ? baseValue.Field_Value : null,
    Boxes : this.ObjaddbillForm.Boxes,
    Changes_on_Cake : this.ObjaddbillForm.Changes_on_Cake,
    // Weight_in_Pound : this.ObjaddbillForm.Weight_in_Pound,
    // Acompanish : this.ObjaddbillForm.Acompanish,
    Order_Taken_By : this.ObjaddbillForm.Order_Taken_By,
    Delivery_Charge : this.ObjaddbillForm.Delivery_Charge ? this.ObjaddbillForm.Delivery_Charge : 0,

    Net_Price : Number(rate).toFixed(2),
    Stock_Qty :  Number(this.ObjaddbillForm.Stock_Qty),
    Weight_in_Pound : this.ObjaddbillForm.Weight_in_Pound,
    Acompanish : Number(Accoplish_Amt).toFixed(2),
    Amount :Number(Amt).toFixed(2),
    Max_Discount : Number(this.ObjaddbillForm.Max_Discount),
    Dis_Amount : Number(Dis_Amount).toFixed(2),
    Gross_Amount : Number(Gross_Amount).toFixed(2),
    SGST_Per : Number(SGST_Per).toFixed(2),
    SGST_Amount : Number(SGST_Amount).toFixed(2),
    CGST_Per : Number(CGST_Per).toFixed(2),
    CGST_Amount : Number(CGST_Amount).toFixed(2),
    GST_Tax_Per : Number(this.ObjaddbillForm.GST_Tax_Per),
    GST_Tax_Per_Amt : this.ObjaddbillForm.GST_Tax_Per_Amt,
    Net_Amount : this.ObjaddbillForm.Delivery_Charge ? (Number(totalAmt) + Number(this.ObjaddbillForm.Delivery_Charge)).toFixed(2) : Number(totalAmt).toFixed(2)
  };
    this.productSubmit.push(productObj);

 // console.log(productObj);

//   var sameProdTypeFlag = false;
//   this.productSubmit.forEach(item => {
//     //console.log('enter select');
//     //console.log(item.Product_ID);
//     //console.log(this.ObjaddbillForm.Product_ID);
//     //console.log(item.Product_ID == this.ObjaddbillForm.Product_ID);
//     if(item.Product_ID == this.ObjaddbillForm.Product_ID && item.Modifier == this.ObjaddbillForm.Modifier1) {
//       //console.log('select item true');
//       item.Delivery_Charge = Number(item.Delivery_Charge) + Number( productObj.Delivery_Charge);
//       item.Stock_Qty = Number(item.Stock_Qty) + Number( productObj.Stock_Qty);
//       item.Weight_in_Pound = Number(item.Weight_in_Pound) + Number( productObj.Weight_in_Pound);
//       item.Max_Discount = Number(item.Max_Discount) + Number(productObj.Max_Discount);
//       item.Amount = Number(item.Amount) + Number(productObj.Amount);
//       item.Gross_Amount = Number(item.Gross_Amount) + Number(productObj.Gross_Amount);
//       item.Dis_Amount = Number(item.Dis_Amount) + Number(productObj.Dis_Amount);
//       item.SGST_Amount = (Number(item.SGST_Amount) + Number(productObj.SGST_Amount)).toFixed(2);
//       item.CGST_Amount = (Number(item.CGST_Amount) + Number(productObj.CGST_Amount)).toFixed(2);
//       item.Net_Amount = (Number(item.Net_Amount) + Number(productObj.Net_Amount)).toFixed(2);

//       sameProdTypeFlag = true;
//     }
//     // count = count + Number(item.Net_Amount);
//   });

//   if(sameProdTypeFlag == false) {
//     this.productSubmit.push(productObj);
//   } 

//  console.log("this.productSubmit",this.productSubmit); 

  const selectedCostCenter = this.ObjaddbillForm.selectitem;
  this.ObjaddbillForm = new addbillForm();
  this.ObjaddbillForm.selectitem = selectedCostCenter;
  this.getselectitem();
  this.addbillFormSubmitted = false;
  this.CalculateTotalAmt();
  this.listofamount();
  this.Product2.applyFocus()
  this.Product2.containerViewChild.nativeElement.click();
  }
}

delete(index) {
  this.productSubmit.splice(index,1)
  this.CalculateTotalAmt();
  this.listofamount();
 }

CalculateTotalAmt() {
  this.Total = undefined;
  let count = 0;
  this.productSubmit.forEach(item => {
    count = count + Number(item.Net_Amount);
  });
  this.Total = (count).toFixed(2);
  // PAYABLE Math.round(this.Total)
  this.Round_Off = (Number(this.Total) - Math.round(this.Total)).toFixed(2)
  //this.Round_Off = (Math.round(this.Total) - Number(this.Total)).toFixed(2);
  this.Amount_Payable = Math.round(this.Total);
  //console.log(this.Round_Off)
  this.AmountChange();
}
cleartotalamount(){
  this.Total = [];
  this.Round_Off = [];
  this.Amount_Payable = [];

}

listofamount(){
  this.Amount = undefined;
  let count = 0;
  this.Dis_Amount = undefined;
  let count1 = 0;
  this.Gross_Amount = undefined;
  let count2 = 0;
  this.SGST_Amount = undefined;
  let count3 = 0;
  this.CGST_Amount = undefined;
  let count4 = 0;
  this.GST_Tax_Per_Amt = undefined;
  let count5 = 0;

  this.productSubmit.forEach(item => {
    count = count + Number(item.Amount);
    count1 = count1 + Number(item.Dis_Amount);
    count2 = count2 + Number(item.Gross_Amount);
    count3 = count3 + Number(item.SGST_Amount);
    count4 = count4 + Number(item.CGST_Amount);
    count5 = count5 + Number(item.GST_Tax_Per_Amt);
  });
  this.Amount = (count).toFixed(2);
  this.Dis_Amount = (count1).toFixed(2);
  this.Gross_Amount = (count2).toFixed(2);
  this.SGST_Amount = (count3).toFixed(2);
  this.CGST_Amount = (count4).toFixed(2);
  this.GST_Tax_Per_Amt = (count5).toFixed(2);
  //console.log(this.Gross_Amount);
}
clearlistamount(){
  this.Amount = [];
  this.Dis_Amount = [];
  this.Gross_Amount = [];
  this.SGST_Amount = [];
  this.CGST_Amount = [];
  this.GST_Tax_Per_Amt = [];
}

AmountChange(){
  //console.log("called");
  var coupon_per = this.ObjcashForm.Coupon_Per ? this.ObjcashForm.Coupon_Per : 0;
  var credit_amount = this.ObjcashForm.Credit_To_Amount ? this.ObjcashForm.Credit_To_Amount : 0;
  var wallet_amount = this.ObjcashForm.Wallet_Amount ? this.ObjcashForm.Wallet_Amount : 0;
  var cash_amount = this.ObjcashForm.Cash_Amount ? this.ObjcashForm.Cash_Amount : 0 ;
  var card_amount = this.ObjcashForm.Card_Amount ? this.ObjcashForm.Card_Amount : 0;
  var AdditionalPayment = this.Additional_Payment ? this.Additional_Payment : 0;
  //this.Additional_Payment = 0;
  // if(this.Additional_Payment){
    // if (this.ObjcashForm.Coupon_Per || Number(this.ObjcashForm.Coupon_Per) === 0) {
    //   this.ObjcashForm.Credit_To_Amount = Number(this.Amount_Payable * coupon_per) / 100;
    //  // this.ObjcashForm.Total_Paid = Number(this.ObjcashForm.Credit_To_Amount) + Number(wallet_amount) + Number(cash_amount) + Number(card_amount);
    //  // this.ObjcashForm.Net_Due = Number(this.ObjcashForm.Total_Paid) - Number(this.Amount_Payable) ;
    // } else {
   this.ObjcashForm.Total_Paid = Number(credit_amount) + Number(wallet_amount) + Number(cash_amount) + Number(card_amount) + Number(AdditionalPayment);
    //}
  // } else {
  //this.ObjcashForm.Total_Paid = Number(credit_amount) + Number(wallet_amount) + Number(cash_amount) + Number(card_amount);
  //}
   this.ObjcashForm.Net_Due = Number(this.Amount_Payable) - Number(this.ObjcashForm.Total_Paid);

}

// DAY END CHECK
saveCheck(){
  if(this.FromCostCentId && this.Fromgodown_id){
    this.Spinner = true;
    this.ngxService.start();
   const TempObj = {
     Cost_Cen_ID : this.FromCostCentId,
     Godown_Id : this.Fromgodown_id
  }
   const obj = {
     "SP_String": "SP_Controller_Master",
     "Report_Name_String": "Check_Day_End",
     "Json_Param_String": JSON.stringify([TempObj])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     if(data[0].Status === "Allow"){
       this.saveprintandUpdate();
     }
     else if(data[0].Status === "Disallow"){    // Disallow
      this.checkSave = false;
      this.Spinner = false;
      this.ngxService.stop();
       this.compacctToast.clear();
       this.compacctToast.add({
         key: "c",
         sticky: true,
         severity: "error",
         summary: data[0].Message,
         detail: "Confirm to proceed"
       });
       this.productSubmit = [];
       this.clearlistamount();
       this.cleartotalamount();
       this.clearData();
     }
   })
 }

}
// CREATE AND UPDATE
saveprintandUpdate(){
  this.SavePrintFormSubmitted = true;
  if(this.GSTvalidFlag){
    this.Spinner = false;
    this.ngxService.stop();
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "GST No. is not valid."
    });
    return false;
  }
  if(this.ObjcashForm.Net_Due < 0){
    this.Spinner = false;
    this.ngxService.stop();
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Error in collected amount."
    });
    return false;
  }
  if(this.buttonname != "Hold Order"){
  if((this.ObjcashForm.Wallet_Ac_ID == undefined && this.ObjcashForm.Wallet_Amount) ||
     (!this.ObjcashForm.Wallet_Amount && this.ObjcashForm.Wallet_Ac_ID )){
      this.Spinner = false;
      this.ngxService.stop();
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Error in wallet Amount"
    });
    return false;
  }
  if((this.ObjcashForm.Credit_To_Ac_ID == undefined && this.ObjcashForm.Credit_To_Amount) ||
     (!this.ObjcashForm.Credit_To_Amount && this.ObjcashForm.Credit_To_Ac_ID )){
      this.Spinner = false;
      this.ngxService.stop();
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Error in Credit to Account"
    });
    return false;
  }
  if(this.ObjcashForm.Coupon_Per && !this.Objcustomerdetail.Bill_Remarks){
    this.Spinner = false;
    this.ngxService.stop();
    this.compacctToast.clear();
    this.compacctToast.add({
    key: "compacct-toast",
    severity: "error",
    summary: "Warn Message",
    detail: "Enter Remarks"
  });
  return false;
  }
  }
  // if(this.ObjcashForm.Total_Paid - this.ObjcashForm.Refund_Amount == this.Net_Payable){

    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String" : "Add Edit Outlet Transaction Advance Order",
      "Json_Param_String": this.getDataForSaveEdit()

    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      //console.log(data);
      var tempID = data[0].Column1;
      this.Objcustomerdetail.Adv_Order_No = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
        const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "Updated";
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Advance_Order_ID  " + tempID,
         detail: "Succesfully " + mgs
       });
       this.Spinner = false;
      this.ngxService.stop();
      if(this.buttonname !== "Update"){
       this.SaveNPrintBill();
       this.clearData();
       this.productSubmit =[];
       this.clearlistamount();
       this.cleartotalamount();
       this.router.navigate(['./POS_BIll_Order']);
      } else {
       this.SaveNPrintBill();
       this.clearData();
       this.productSubmit =[];
       this.clearlistamount();
       this.cleartotalamount();
       this.tabIndexToView = 0;
       this.router.navigate(['./K4C_Outlet_Advance_Order']);
       this.getcostcenid();
       this.Showdata();
       this.Showdatabymobile(true);
      }
      } else{
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
      this.ObjcashForm.Wallet_Ac_ID = undefined;
      this.ObjcashForm.Credit_To_Ac_ID = undefined;
    })

  }

getDataForSaveEdit(){
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

if((this.ObjHomeDelivery.Delivery_Mobile_No == undefined || this.ObjHomeDelivery.Delivery_Mobile_No == "") &&
  (this.ObjHomeDelivery.Delivery_Alt_Mobile_No == undefined || this.ObjHomeDelivery.Delivery_Alt_Mobile_No == "") &&
  (this.ObjHomeDelivery.Delivery_Name == undefined || this.ObjHomeDelivery.Delivery_Name == "") &&
  (this.ObjHomeDelivery.Delivery_Address == undefined || this.ObjHomeDelivery.Delivery_Address == "") &&
  (this.ObjHomeDelivery.Delivery_Near_By == undefined || this.ObjHomeDelivery.Delivery_Near_By == "") &&
  (this.ObjHomeDelivery.Delivery_Pin_Code == undefined || this.ObjHomeDelivery.Delivery_Pin_Code == "")){
    this.ObjHomeDelivery.Delivery_Type = "PICKUP";
  }else{
    this.ObjHomeDelivery.Delivery_Type = "DELIVERY"
  }
  //console.log("this.ObjcashForm.Card_Ac",this.productSubmit);

  if(this.productSubmit.length) {
    let tempArr =[];
    const Deltime = new Date(this.Objcustomerdetail.Del_Date_Time);
     var hr = Deltime.getHours();
     let min:any = Deltime.getMinutes();
         min = min < 10 ? '0'+min : min;
         this.Objcustomerdetail.Del_Date_Time = hr+ ":" +min
     console.log("time ==" , this.Objcustomerdetail.Del_Date_Time)
    this.productSubmit.forEach(item => {
      const obj = {
          Product_ID : item.Product_ID,
          Product_Description : item.Product_Description,
          Product_Type_ID : item.Product_Type_ID,
          Product_Modifier : item.Modifier1,
          Product_Modifier_1 : item.Modifier2,
          Product_Modifier_2 : item.Modifier3,
          Product_Modifier_3 : item.Modifier4,
          Product_Modifier_4 : item.Modifier5,
          Flavour : item.Flavour,
          Finishing : item.Finishing,
          Shape : item.Shape,
          Tier : item.Tier,
          Base : item.Base,
          Boxes : item.Boxes,
          Changes_on_Cake : item.Changes_on_Cake,
          Weight_in_Pound : item.Weight_in_Pound,
          Acompanish : item.Acompanish,
          Order_Taken_By : item.Order_Taken_By,
          Rate : item.Net_Price,
          Delivery_Charge : item.Delivery_Charge,
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
      }

    const TempObj = {
      Created_By : this.$CompacctAPI.CompacctCookies.User_ID,
      Foot_Fall_ID : this.Objcustomerdetail.Foot_Fall_ID,
      Order_Date : this.DateService.dateConvert(new Date(this.myDate)),
      //Doc_No : "A",
      Doc_No : this.Objcustomerdetail.Adv_Order_No ?  this.Objcustomerdetail.Adv_Order_No : "A",
      Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    // Del_Cost_Cent_ID : this.Objcustomerdetail.Del_Location,
      Del_Date : this.DateService.dateConvert(new Date (this.delivery_Date)),
      //Del_Date_Time	: this.DateService.dateTimeConvert(new Date(this.Objcustomerdetail.Del_Date_Time)),
      Del_Date_Time : this.Objcustomerdetail.Del_Date_Time,
      Rounded_Off : this.Round_Off,
      Amount_Payable : this.Amount_Payable,
      Hold_Order : this.Hold_Order_Flag ? "Y" : "N",
      Sub_Ledger_ID : this.QueryStringObj.Sub_Ledger_ID ? this.QueryStringObj.Sub_Ledger_ID : 0 ,
      Fin_Year_ID : Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
    }
    tempArr.push({...obj,...TempObj,...this.Objcustomerdetail,...this.ObjcashForm,...this.ObjHomeDelivery})
  });
  console.log(tempArr)
  return JSON.stringify(tempArr);
  }

}
SaveNPrintBill() {
  if (this.Hold_Order_Flag == false){
  if (this.Objcustomerdetail.Adv_Order_No) {
    window.open("/Report/Crystal_Files/K4C/K4C_Advance_Order_Print.aspx?DocNo=" + this.Objcustomerdetail.Adv_Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
 );
  }
  }
  //console.log('Doc_No ==', this.Objcustomerdetail.Adv_Order_No)
}

// EDIT ORDER
EditFromBrowse(Erow){
  //this.DocNO = undefined;
    //console.log("Edit",eROW);
    this.clearData();
    if(Erow.Adv_Order_No){
    this.Objcustomerdetail.Adv_Order_No = Erow.Adv_Order_No;
   // console.log('advance order id ==',eROW.Adv_Order_No)
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    //console.log("this.EditDoc_No ", this.Objcustomerdetail.Adv_Order_No);
    this.geteditlist(this.Objcustomerdetail.Adv_Order_No);
    }

  }
Edit(eROW){
  //this.DocNO = undefined;
    //console.log("Edit",eROW);
    this.clearData();
    if(eROW.Adv_Order_No){
    this.Objcustomerdetail.Adv_Order_No = eROW.Adv_Order_No;
   // console.log('advance order id ==',eROW.Adv_Order_No)
    this.tabIndexToView = 1;
    // this.items = ["BROWSE", "UPDATE"];
    // this.buttonname = "Update";
    //console.log("this.EditDoc_No ", this.Objcustomerdetail.Adv_Order_No);
    this.geteditlist(this.Objcustomerdetail.Adv_Order_No);
    }

  }
geteditlist(Adv_Order_No){
    //this.DocNO = Adv_Order_No;
      const Tempobj = {
        Doc_No : this.Objcustomerdetail.Adv_Order_No
      }
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Get Advance Order Data For Edit",
        "Json_Param_String": JSON.stringify([Tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log(data);
       this.editList = data;
       this.Objcustomerdetail.Costomer_Mobile = data[0].Costomer_Mobile;
       this.Objcustomerdetail.Customer_Name= data[0].Customer_Name;
      //  this.Objcustomerdetail.Customer_DOB = data[0].Customer_DOB;
      //  this.Objcustomerdetail.Customer_Anni= data[0].Customer_Anni;
       this.Objcustomerdetail.Customer_DOB = data[0].Customer_DOB ? this.DateService.dateConvert(data[0].Customer_DOB) : undefined;
       this.Objcustomerdetail.Customer_Anni= data[0].Customer_Anni ? this.DateService.dateConvert(data[0].Customer_Anni) : undefined;
       this.Objcustomerdetail.Customer_GST = data[0].Customer_GST;
       this.Objcustomerdetail.Bill_Remarks = data[0].Bill_Remarks;
       //this.Objcustomerdetail.Del_Date_Time = this.DateService.dateTimeConvert(new Date(data[0].Del_Date_Time));
       //this.Objcustomerdetail.Del_Date_Time = new Date (data[0].Del_Date_Time);
       this.Objcustomerdetail.Del_Cost_Cent_ID = data[0].Del_Cost_Cent_ID;
       //this.Objcustomerdetail.Adv_Order_No = data[0].Adv_Order_No;
       console.log("e time==", data[0].Del_Date_Time)
       if(data[0].Del_Date_Time){
         const format = this.tConv24(data[0].Del_Date_Time);
        this.Objcustomerdetail.Del_Date_Time =this.setHours(new Date(), format);
       }
       console.log("edit time ===", this.Objcustomerdetail.Del_Date_Time)

    data.forEach(element => {
    const  productObj = {
        Product_ID : element.Product_ID,
        Product_Description : element.Product_Description,
        Modifier : element.Product_Modifier,
        Weight_in_Pound : element.Weight_in_Pound,
        Acompanish : element.Acompanish,
        Flavour : element.Flavour,
        Finishing : element.Finishing,
        Shape : element.Shape,
        Tier : element.Tier,
        Base : element.Base,
        Boxes : element.Boxes,
        Changes_on_Cake : element.Changes_on_Cake,
        Order_Taken_By : element.Order_Taken_By,
        Net_Price : Number(element.Rate),
        Delivery_Charge : Number(element.Delivery_Charge),
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
    this.ObjcashForm.Credit_To_Ac_ID = data[0].Credit_To_Ac_ID ? data[0].Credit_To_Ac_ID : undefined;
    this.ObjcashForm.Credit_To_Ac = data[0].Credit_To_Ac ? data[0].Credit_To_Ac : undefined;
    this.ObjcashForm.Credit_To_Amount = data[0].Credit_To_Amount ? data[0].Credit_To_Amount : "";
    this.ObjcashForm.Wallet_Ac_ID = data[0].Wallet_Ac_ID ? data[0].Wallet_Ac_ID : undefined;
    this.ObjcashForm.Wallet_Ac = data[0].Wallet_Ac ? data[0].Wallet_Ac : undefined;
    this.ObjcashForm.Wallet_Amount = data[0].Wallet_Amount ? data[0].Wallet_Amount : "";
    this.ObjcashForm.Cash_Amount = data[0].Cash_Amount ? data[0].Cash_Amount : "";
    this.ObjcashForm.Card_Amount = data[0].Card_Amount ? data[0].Card_Amount : "";
    this.Additional_Payment = data[0].Additional_Payment ? data[0].Additional_Payment : 0;
    this.ObjcashForm.Total_Paid = data[0].Total_Paid;
   // this.ObjcashForm.Net_Due = data[0].Net_Due;

    this.Objcustomerdetail.Foot_Fall_ID = data[0].Foot_Fall_ID;
    this.Objcustomerdetail.Cost_Cen_ID = data[0].Cost_Cen_ID;
    //this.ObjaddbillForm.Doc_Date = data[0].Order_Date;
    this.Objcustomerdetail.Adv_Order_No = data[0].Adv_Order_No;

    this.myDate = data[0].Order_Date;
    this.delivery_Date = data[0].Del_Date;
    this.Total = data[0].Net_Amount;
    this.Amount_Payable = data[0].Amount_Payable;
    this.Round_Off = data[0].Rounded_Off;
    this.CalculateTotalAmt();
    this.listofamount();
   console.log("this.editList  ===",data);
 //this.myDate =  new Date(data[0].Column1);
  // on save use this
 // this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));
    this.ObjHomeDelivery.Delivery_Type = data[0].Delivery_Type;
    this.ObjHomeDelivery.Delivery_Mobile_No = data[0].Delivery_Mobile_No;
    this.ObjHomeDelivery.Delivery_Alt_Mobile_No = data[0].Delivery_Alt_Mobile_No;
    this.ObjHomeDelivery.Delivery_Name = data[0].Delivery_Name;
    this.ObjHomeDelivery.Delivery_Address = data[0].Delivery_Address;
    this.ObjHomeDelivery.Delivery_Near_By = data[0].Delivery_Near_By;
    this.ObjHomeDelivery.Delivery_Pin_Code = data[0].Delivery_Pin_Code;

})
}
//BROWSE BILL
PrintOrder(obj) {
  if (obj.Adv_Order_No) {
    window.open("/Report/Crystal_Files/K4C/K4C_Advance_Order_Print.aspx?DocNo=" + obj.Adv_Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
}

// FOR MAKE PAYMENT POPUP
MakePayment(orderno){
  if(orderno.Adv_Order_No){
  this.Objcustomerdetail.Adv_Order_No = orderno.Adv_Order_No;
  //console.log('Adv_Order_No====',this.Objcustomerdetail.Adv_Order_No)
 this.MakePaymentModal = true;
  }
  //console.log(orderno)
  this.Amount_Payable = orderno.Net_Due;
}
// DAY END CHECK FOR ADD PAYMENT
AddPamentsaveCheck(){
  if(this.FromCostCentId && this.Fromgodown_id){
   const TempObj = {
     Cost_Cen_ID : this.FromCostCentId,
     Godown_Id : this.Fromgodown_id
  }
   const obj = {
     "SP_String": "SP_Controller_Master",
     "Report_Name_String": "Check_Day_End",
     "Json_Param_String": JSON.stringify([TempObj])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     if(data[0].Status === "Allow"){
       this.AddPayment();
     }
     else if(data[0].Status === "Disallow"){    // Disallow
      this.CloseMPaymentModal();
      this.checkSave = false;
       this.compacctToast.clear();
       this.compacctToast.add({
         key: "c",
         sticky: true,
         severity: "error",
         summary: data[0].Message,
         detail: "Confirm to proceed"
       });
       //this.productSubmit = [];
       this.clearData();
     }
   })
 }

}
AddPayment(){
  if(this.ObjcashForm.Net_Due < 0){
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Error in collected amount."
    });
    return false;
  }
  if((this.ObjcashForm.Wallet_Ac_ID == undefined && this.ObjcashForm.Wallet_Amount) ||
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
  if((this.ObjcashForm.Credit_To_Ac_ID == undefined && this.ObjcashForm.Credit_To_Amount) ||
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
    "Report_Name_String" : "Save Outlet Adv Order Payment",
    "Json_Param_String": this.getdataforAddPayment()

  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    //console.log(data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Advance_Order_ID  " + tempID,
       detail: "Succesfully Add"
     });
     this.MakePaymentModal = false;
     this.Showdata();
     this.Showdatabymobile(true);
     this.clearData();
     this.clearlistamount();
     this.cleartotalamount();
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
getdataforAddPayment(){
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

let temparr = []
const TempObj = {
  Payment_Ref_No : "a",
  Doc_No : this.Objcustomerdetail.Adv_Order_No,
  Payment_Date : this.DateService.dateConvert(new Date(this.myDate)),
  Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
  //Created_On : this.Objcustomerdetail.Del_Date_Time,
  Created_By : this.$CompacctAPI.CompacctCookies.User_ID,
  // Credit_To_Ac_ID : this.ObjcashForm.Credit_To_Ac_ID,
  // Credit_To_Ac : this.ObjcashForm.Credit_To_Ac,
  // Credit_To_Amount : this.ObjcashForm.Credit_To_Amount,
  // Cash_Amount : this.ObjcashForm.Cash_Amount,
  // Card_Ac_ID : this.ObjcashForm.Card_Ac_ID,
  // Card_Ac : this.ObjcashForm.Card_Ac,
  // Card_Amount : this.ObjcashForm.Card_Amount,
  // Total_Paid : this.ObjcashForm.Total_Paid,
  // Net_Due : this.ObjcashForm.Net_Due,
}
 temparr.push({...TempObj,...this.ObjcashForm})
 //console.log(temparr)
 return JSON.stringify(temparr);
}
CloseMPaymentModal(){
  this.MakePaymentModal = false;
  this.Amount_Payable = [];
  this.ObjcashForm = new cashForm();
}

// FOR HOME DELIVERY POPUP
ShowHomeDeliverypopup(){
  //this.locationInput.nativeElement.value = '';
  this.HomeDeliverypopup = true;
  this.ObjHomeDelivery.Delivery_Mobile_No = this.Objcustomerdetail.Costomer_Mobile;
  this.ObjHomeDelivery.Delivery_Name = this.Objcustomerdetail.Customer_Name;
   //console.log('Mobile No===', this.ObjHomeDelivery.Delivery_Mobile_No);
   //console.log('Name ====', this.ObjHomeDelivery.Delivery_Name);
}
DeliveryDetailSubmit(){
  this.HomeDeliverypopup = false;
}

HoldBill(){
  //this.buttonname = this.Hold_Order_Flag ? "Hold Order" : 'Save & Print Bill';
  if(this.QueryStringObj.Edit_Adv_Order){
    this.buttonname = this.Hold_Order_Flag ? "Hold Order" : 'Update';
  } else {
    this.buttonname = this.Hold_Order_Flag ? "Hold Order" : 'Save & Print Bill';
  }

}
RedirectTo (obj){
  const navigationExtras: NavigationExtras = {
    queryParams: obj,
  };
  this.router.navigate([obj.Redirect_To], navigationExtras);
}
CreateBill(col,val){
  if (val === 'advordertosalebill') {
    const TempObj = {
      Redirect_To : './K4C_Outlet_Sale_Bill',
      Adv_Order_No : col.Adv_Order_No,
      Del_Cost_Cent_ID : col.Del_Cost_Cent_ID,
      Edit_from_Border : true
    }
    this.RedirectTo(TempObj);
  }
  if (val === 'editorder') {
    const TempObj = {
      Redirect_To : './K4C_Outlet_Advance_Order',
      Adv_Order_No : col.Adv_Order_No,
      Edit_Adv_Order : true
    }
    this.RedirectTo(TempObj);
  }
}
PrintBill(obj) {
  if (obj.Bill_No) {
    window.open("/Report/Crystal_Files/K4C/K4C_Bill_Print.aspx?DocNo=" + obj.Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
}

clearData(){
  this.ObjaddbillForm = new addbillForm();
  this.ObjcashForm = new cashForm();
  this.Objcustomerdetail = new customerdetail();
  this.ObjaddbillForm.selectitem = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
  this.ObjaddbillForm.BrowserDeliveryto = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;

  this.addbillFormSubmitted = false;
  this.SavePrintFormSubmitted = false;
  this.seachSpinner = false;
  this.getorderdate();
  //this.delivery_Date;
  this.delivery_Date = new Date();
  this.delivery_Date.setDate(this.delivery_Date.getDate() + 1);
  //console.log('Delivery Date ===' , this.delivery_Date)
  this.Objcustomerdetail.Del_Cost_Cent_ID ='32';
  this.Hold_Order_Flag = false;
  //this.DocNO = undefined;
}

// REFUND
Refund(advono){
  this.ObjRefundcashForm = new RefundcashForm();
  if (advono.Adv_Order_No) {
    this.Adv_Order_No = advono.Adv_Order_No;
    this.RAmount_Payable = advono.Total_Paid - advono.Refund_Amt;
    this.RefundPopup = true;
  }

}
getdataforRefundSave(){
  if(this.ObjRefundcashForm.Wallet_Ac_ID){
    this.walletlist.forEach(el => {
      if(Number(this.ObjRefundcashForm.Wallet_Ac_ID) === Number(el.Txn_ID)){
        this.ObjRefundcashForm.Wallet_Ac = el.Ledger_Name
      }
    });
}
this.ObjRefundcashForm.Wallet_Ac_ID = this.ObjRefundcashForm.Wallet_Ac_ID ? this.ObjRefundcashForm.Wallet_Ac_ID : 0 ;
this.ObjRefundcashForm.Wallet_Ac = this.ObjRefundcashForm.Wallet_Ac ? this.ObjRefundcashForm.Wallet_Ac : "NA" ;
this.ObjRefundcashForm.Wallet_Amount = this.ObjRefundcashForm.Wallet_Amount ? this.ObjRefundcashForm.Wallet_Amount : 0;
this.ObjRefundcashForm.Cash_Amount = this.ObjRefundcashForm.Cash_Amount ? this.ObjRefundcashForm.Cash_Amount : 0;

let temparr = []
const TempObj = {
  Doc_No : this.Adv_Order_No,
  Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
  //Created_On : this.Objcustomerdetail.Del_Date_Time,
  Created_By : this.$CompacctAPI.CompacctCookies.User_ID
}
 temparr.push({...TempObj,...this.ObjRefundcashForm})
 //console.log(temparr)
 return JSON.stringify(temparr);
}
RefundSave(){
  if((this.ObjRefundcashForm.Cash_Amount > this.RAmount_Payable) ||
     (this.ObjRefundcashForm.Wallet_Amount > this.RAmount_Payable)){
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Refund amount is more than amount received"
    });
    return false;
  }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Save Outlet Adv Order Refund Payment",
    "Json_Param_String": this.getdataforRefundSave()
   }
   this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    //console.log(data);
    var tempID = data[0].Column1;
    this.Adv_Order_No = data[0].Column1;
    if(data[0].Column1){
      this.compacctToast.clear();
     // const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: " " + tempID,
       //detail: "Succesfully done" 
     });
     this.RefundPopup = false;
     this.Showdata();
     this.Showdatabymobile(true);
     this.ObjRefundcashForm = new RefundcashForm();
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
 class search{
  start_date : string;
  end_date : string;
  //Outlet : string;
 }

 class addbillForm{
  selectitem : string;
  Product_ID : string;
  Product_Type_ID : string;
  BrowserDeliveryto : any;
  //User_ID : any;
  Doc_Type : any;
  /*Billno : string;
  selectitem : string;
  Qty : string;
 */
 // Modifier : string;
  Modifier1 : string;
  Modifier2 : string;
  Modifier3 : string;
  Modifier4 : string;
  Modifier5 : string;
  Product_Description : string;
  Sale_rate : number;
  //Net_Price : number;
  Stock_Qty : number;
  Amount : number;
  Max_Discount : number = 0;
  Dis_Amount : number;
  Gross_Amt : number;
  SGST_Per : number;
  SGST_Amount  : number;
  CGST_Per : number;
  CGST_Amount : number;
  Net_Amount : number;
  GST_Tax_Per : number;
  GST_Tax_Per_Amt : number = 0;
  /* constructor(){
    this.Max_Discount = 0;
  } */
  Flavour : string;
  Finishing : string;
  Shape : string;
  Tier : string;
  Base : string;
  Boxes : string;
  Changes_on_Cake : string;
  Weight_in_Pound : number;
  Acompanish : number;
  Order_Taken_By : string;
  Delivery_Charge : number;
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
  // Refund_Amount : number = 0;
}
class customerdetail{
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
class RefundcashForm{
  Wallet_Ac_ID : any;
  Wallet_Ac : string;
  Wallet_Amount : number;
  Cash_Amount: number;
  // Refund_Amount : number = 0;
}

