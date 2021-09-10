import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { time } from 'console';
import { ActivatedRoute, Router } from '@angular/router';
import { valHooks } from 'jquery';
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
  Searchlist = [];
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
  cardlist: any;
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

  @ViewChild("Product2" ,{static : false}) Product2: Dropdown;
  AdvOrderfieldlist: any;
  Finishinglist: any;
  Shapelist: any;
  Tierlist: any;
  Baselist: any;
  public QueryStringObj : any;
  CustomerDisabledFlag = false;
  Hold_Order_Flag = false;

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private route : ActivatedRoute,
    private router : Router,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) {
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
     this.getdellocation();
     this.getselectitem();
     this.getcredittoaccount();
     this.getcardamount();
     this.getAdvOrderfield();
     this.route.queryParamMap.subscribe((val:any) => {
      this.CustomerDisabledFlag = false;
      if(val.params) {
        this.QueryStringObj = val.params;
        if(this.QueryStringObj.Foot_Fall_ID) {
          this.CustomerDisabledFlag = true;
          this.tabIndexToView = 1;
          this.UpdateCustomerDetails(this.QueryStringObj)
        }
        if(this.QueryStringObj.Browse_Flag) {
          this.CustomerDisabledFlag = false;
        }
        if(this.QueryStringObj.Edit){
          this.CustomerDisabledFlag = true;
          this.Edit(this.QueryStringObj);
        }
      }
    } );
     //Delivery Date
   //this.DateService.dateConvert(new Date (this.delivery_Date));
   this.delivery_Date.setDate(new Date(this.delivery_Date).getDate() + 1);
   //this.DateService.dateTimeConvert(new Date(this.Delivey_Time));
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
           this.Objcustomerdetail.Customer_DOB = ReturnObj.DOB;
           this.Objcustomerdetail.Customer_Anni = ReturnObj.DOA;
           this.Objcustomerdetail.Bill_Remarks = ReturnObj.Remarks;
           this.Objcustomerdetail.Customer_GST = ReturnObj.GST_No;
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
      Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
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
     })
  }

  Showdatabymobile(){
    this.Searchlist = [];
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
     })
  }

  //CANCLE BROWSE ROW
  Cancle(row){
    //console.log(this.Objcustomerdetail.Adv_Order_No)
    this.Objcustomerdetail.Adv_Order_No = undefined ;
    if(row.Adv_Order_No){
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
   onConfirm() {
    const Tempobj = {
      Doc_No : this.Objcustomerdetail.Adv_Order_No
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Cancle Advance Order",
      "Json_Param_String": JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log(data);
      if(data[0].Column1 === "Cancel Successfully") {
        this.Showdata();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Adv_Order_No : " + this.Objcustomerdetail.Adv_Order_No,
          detail:  "Succesfully Cancle"
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
      } else if (nextElemID === 'Qty') {
          this.Product2.applyFocus()
          this.Product2.containerViewChild.nativeElement.click();
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
    if (event.key === "Enter" && this.ObjaddbillForm.Product_ID) {
      const elem  = document.getElementById('Qty');
      elem.focus();
    }
    event.preventDefault();
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
    "Report_Name_String": "Get Sale Requisition Outlet",
    "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
    //"Json_Param_String": JSON.stringify([{User_ID : 61}])
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.returnedID = data;
   //this.ObjaddbillForm.selectitem = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
   this.ObjaddbillForm.selectitem = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
  //  if(this.$CompacctAPI.CompacctCookies.User_Type == 'U'){
  this.ObjaddbillForm.BrowserDeliveryto = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
  //  }
   //console.log("this.ObjaddbillForm.BroeItem",this.ObjaddbillForm.BroeItem);
   this.getselectitem();
   //console.log("this.returnedID======",this.returnedID);


  });
}

getdellocation(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Outlet Name",
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.delloclist = data;
   this.Objcustomerdetail.Del_Cost_Cent_ID ='32';
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
      Doc_Type : "Sale_Bill",
      Product_Type_ID : 0
     }
    // const TempObj = {
    //   User_ID:this.$CompacctAPI.CompacctCookies.User_ID,
    //   Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    //   Doc_Type : "Sale_Bill",
    //   Doc_Date : this.Objcustomerdetail.Doc_Date
    //  }
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

getcardamount(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Data for Card to Amount",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.cardlist = data;
     //console.log('card=====',this.cardlist)
   })
}

ProductChange() {
if(this.ObjaddbillForm.Product_ID) {
  const ctrl = this;
  const productObj = $.grep(ctrl.selectitem,function(item) {return item.Product_ID == ctrl.ObjaddbillForm.Product_ID})[0];
  //console.log(productObj);
  //this.rate = productObj.Sale_rate;
  this.ObjaddbillForm.Product_Description = productObj.Product_Description;
  //this.ObjaddbillForm.Stock_Qty = productObj.Stock_Qty;
  this.ObjaddbillForm.Net_Price =  productObj.Net_Price;
  this.ObjaddbillForm.GST_Tax_Per =  productObj.GST_Tax_Per;
}
}
tConv24(time24) {
  let ts = time24;
  let H = +ts.substr(0, 2);
  let h:any = (H % 12) || 12;
  h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
  let ampm = H < 12 ? " AM" : " PM";
  ts = h + ts.substr(2, 3) + ampm;
  return ts;
};
// CALCULATION
add(valid) {
  this.addbillFormSubmitted = true;
  if(valid) {

  //console.log("this.ObjaddbillForm===",this.ObjaddbillForm)
  var Amount;
 if ( this.ObjaddbillForm.Weight_in_Pound) {
   Amount = Number(this.ObjaddbillForm.Stock_Qty * this.ObjaddbillForm.Net_Price * this.ObjaddbillForm.Weight_in_Pound);
 } else {
   Amount = Number(this.ObjaddbillForm.Stock_Qty * this.ObjaddbillForm.Net_Price);
 }

  var Dis_Amount = Number(Amount * Number(this.ObjaddbillForm.Max_Discount) / 100);
  var SGST_Per = Number(this.ObjaddbillForm.GST_Tax_Per / 2);
  var Gross_Amount = Number(Amount - Dis_Amount) ;
  var SGST_Amount = Number((Gross_Amount * SGST_Per) / 100) ;
  var CGST_Per = Number(this.ObjaddbillForm.GST_Tax_Per / 2);
  var CGST_Amount = Number((Gross_Amount * CGST_Per) / 100) ;
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
    Modifier : this.ObjaddbillForm.Modifier,
    Flavour : flavourValue != undefined ? flavourValue.Field_Value : '', // added for flavour message
    Finishing : finishingValue != undefined ? finishingValue.Field_Value : '',
    Shape : shapeValue != undefined ? shapeValue.Field_Value : '',
    Tier : tierValue != undefined ? tierValue.Field_Value : '',
    Base : baseValue != undefined ? baseValue.Field_Value : '',
    Boxes : this.ObjaddbillForm.Boxes,
    Changes_on_Cake : this.ObjaddbillForm.Changes_on_Cake,
    Weight_in_Pound : this.ObjaddbillForm.Weight_in_Pound,
    Order_Taken_By : this.ObjaddbillForm.Order_Taken_By,

    Net_Price : Number(this.ObjaddbillForm.Net_Price),
    Stock_Qty :  Number(this.ObjaddbillForm.Stock_Qty),
    Amount :Number(Amount).toFixed(2),
    Max_Discount : Number(this.ObjaddbillForm.Max_Discount),
    Dis_Amount : Number(Dis_Amount).toFixed(2),
    Gross_Amount : Number(Gross_Amount).toFixed(2),
    SGST_Per : Number(SGST_Per).toFixed(2),
    SGST_Amount : Number(SGST_Amount).toFixed(2),
    CGST_Per : Number(CGST_Per).toFixed(2),
    CGST_Amount : Number(CGST_Amount).toFixed(2),
    GST_Tax_Per : Number(this.ObjaddbillForm.GST_Tax_Per),
    GST_Tax_Per_Amt : this.ObjaddbillForm.GST_Tax_Per_Amt,
    Net_Amount : Number(Gross_Amount + SGST_Amount + CGST_Amount).toFixed(2)
  };

 // console.log(productObj);

  var sameProdTypeFlag = false;
  this.productSubmit.forEach(item => {
    //console.log('enter select');
    //console.log(item.Product_ID);
    //console.log(this.ObjaddbillForm.Product_ID);
    //console.log(item.Product_ID == this.ObjaddbillForm.Product_ID);
    if(item.Product_ID == this.ObjaddbillForm.Product_ID && item.Modifier == this.ObjaddbillForm.Modifier) {
      //console.log('select item true');
      item.Stock_Qty = Number(item.Stock_Qty) + Number( productObj.Stock_Qty);
      item.Max_Discount = Number(item.Max_Discount) + Number(productObj.Max_Discount);
      item.Amount = Number(item.Amount) + Number(productObj.Amount);
      item.Gross_Amount = Number(item.Gross_Amount) + Number(productObj.Gross_Amount);
      item.Dis_Amount = Number(item.Dis_Amount) + Number(productObj.Dis_Amount);
      item.SGST_Amount = (Number(item.SGST_Amount) + Number(productObj.SGST_Amount)).toFixed(2);
      item.CGST_Amount = (Number(item.CGST_Amount) + Number(productObj.CGST_Amount)).toFixed(2);
      item.Net_Amount = (Number(item.Net_Amount) + Number(productObj.Net_Amount)).toFixed(2);

      sameProdTypeFlag = true;
    }
    // count = count + Number(item.Net_Amount);
  });

  if(sameProdTypeFlag == false) {
    this.productSubmit.push(productObj);
  }

 //console.log("this.productSubmit",this.productSubmit);
  const selectedCostCenter = this.ObjaddbillForm.selectitem;
  this.ObjaddbillForm = new addbillForm();
  this.ObjaddbillForm.selectitem = selectedCostCenter;
  this.getselectitem();
  this.addbillFormSubmitted = false;
  this.CalculateTotalAmt();
  this.listofamount();
  // this.Product2.applyFocus()
  // this.Product2.containerViewChild.nativeElement.click();
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
  this.ObjcashForm.Total_Paid = Number(this.ObjcashForm.Credit_To_Amount) + Number(this.ObjcashForm.Cash_Amount) + Number(this.ObjcashForm.Card_Amount);
  this.ObjcashForm.Net_Due = Number(this.Amount_Payable) - Number(this.ObjcashForm.Total_Paid);

}

// CREATE AND UPDATE
saveprintandUpdate(){
  this.SavePrintFormSubmitted = true;
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
  // if(this.ObjcashForm.Total_Paid - this.ObjcashForm.Refund_Amount == this.Net_Payable){

    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String" : "Add Edit Outlet Transaction Advance Order",
      "Json_Param_String": this.getDataForSaveEdit()

    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      //console.log(data);
      var tempID = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
        const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "Updated";
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Advance_Order_ID  " + tempID,
         detail: "Succesfully " + mgs
       });
       this.clearData();
       this.productSubmit =[];
       this.clearlistamount();
       this.cleartotalamount();
       this.router.navigate(['./POS_BIll_Order']);
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


getDataForSaveEdit(){
  if(this.ObjcashForm.Card_Ac_ID){
      this.cardlist.forEach(el => {
        if(Number(this.ObjcashForm.Card_Ac_ID) === Number(el.Txn_ID)){
          this.ObjcashForm.Card_Ac = el.Ledger_Name
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
this.ObjcashForm.Card_Ac_ID = this.ObjcashForm.Card_Ac_ID ? this.ObjcashForm.Card_Ac_ID : 0 ;
this.ObjcashForm.Card_Ac = this.ObjcashForm.Card_Ac ? this.ObjcashForm.Card_Ac : "NA" ;
this.ObjcashForm.Credit_To_Ac_ID = this.ObjcashForm.Credit_To_Ac_ID ? this.ObjcashForm.Credit_To_Ac_ID : 0 ;
this.ObjcashForm.Credit_To_Ac = this.ObjcashForm.Credit_To_Ac ? this.ObjcashForm.Credit_To_Ac : "NA" ;

if((this.ObjHomeDelivery.Delivery_Mobile_No == undefined || this.ObjHomeDelivery.Delivery_Mobile_No == "") &&
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
    let tempArr =[]
    this.productSubmit.forEach(item => {
      const obj = {
          Product_ID : item.Product_ID,
          Product_Description : item.Product_Description,
          Product_Modifier : item.Modifier,
          Flavour : item.Flavour,
          Finishing : item.Finishing,
          Shape : item.Shape,
          Tier : item.Tier,
          Base : item.Base,
          Boxes : item.Boxes,
          Changes_on_Cake : item.Changes_on_Cake,
          Weight_in_Pound : item.Weight_in_Pound,
          Order_Taken_By : item.Order_Taken_By,
          Rate : item.Net_Price,
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
     // Del_Date_Time	: this.Objcustomerdetail.Delivey_Time,
      Rounded_Off : this.Round_Off,
      Amount_Payable : this.Amount_Payable,
      Hold_Order : this.Hold_Order_Flag ? "Y" : "N"
    }
    tempArr.push({...obj,...TempObj,...this.Objcustomerdetail,...this.ObjcashForm,...this.ObjHomeDelivery})
  });
  //console.log(tempArr)
  return JSON.stringify(tempArr);
  }

}

// EDIT ORDER
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
       //console.log(data);
       this.editList = data;
       this.Objcustomerdetail.Costomer_Mobile = data[0].Costomer_Mobile;
       this.Objcustomerdetail.Customer_Name= data[0].Customer_Name;
       this.Objcustomerdetail.Customer_DOB = data[0].Customer_DOB;
       this.Objcustomerdetail.Customer_Anni= data[0].Customer_Anni;
       this.Objcustomerdetail.Customer_GST = data[0].Customer_GST;
       this.Objcustomerdetail.Bill_Remarks = data[0].Bill_Remarks;
       this.Objcustomerdetail.Del_Date_Time = data[0].Del_Date_Time;
       this.Objcustomerdetail.Del_Cost_Cent_ID = data[0].Del_Cost_Cent_ID;
       //this.Objcustomerdetail.Adv_Order_No = data[0].Adv_Order_No;

    data.forEach(element => {
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
        Net_Price : Number(element.Rate),
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
    this.ObjcashForm.Credit_To_Ac_ID = data[0].Credit_To_Ac_ID;
    this.ObjcashForm.Credit_To_Ac = data[0].Credit_To_Ac;
    this.ObjcashForm.Credit_To_Amount = data[0].Credit_To_Amount;
    this.ObjcashForm.Cash_Amount = data[0].Cash_Amount;
    this.ObjcashForm.Card_Ac_ID = data[0].Card_Ac_ID;
    this.ObjcashForm.Card_Ac = data[0].Card_Ac;
    this.ObjcashForm.Card_Amount = data[0].Card_Amount;
    this.ObjcashForm.Total_Paid = data[0].Total_Paid;
    this.ObjcashForm.Net_Due = data[0].Net_Due;

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
  //console.log("this.editList  ===",data);
 //this.myDate =  new Date(data[0].Column1);
  // on save use this
 // this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));
    this.ObjHomeDelivery.Delivery_Type = data[0].Delivery_Type;
    this.ObjHomeDelivery.Delivery_Mobile_No = data[0].Delivery_Mobile_No;
    this.ObjHomeDelivery.Delivery_Name= data[0].Delivery_Name;
    this.ObjHomeDelivery.Delivery_Address = data[0].Delivery_Address;
    this.ObjHomeDelivery.Delivery_Near_By= data[0].Delivery_Near_By;
    this.ObjHomeDelivery.Delivery_Pin_Code = data[0].Delivery_Pin_Code;

})
}

MakePayment(orderno){
  if(orderno.Adv_Order_No){
  this.Objcustomerdetail.Adv_Order_No = orderno.Adv_Order_No;
  //console.log('Adv_Order_No====',this.Objcustomerdetail.Adv_Order_No)
 this.MakePaymentModal = true;
  }
  //console.log(orderno)
  this.Amount_Payable = orderno.Net_Due;
}
AddPayment(){
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
  if(this.ObjcashForm.Card_Ac_ID){
    this.cardlist.forEach(el => {
      if(Number(this.ObjcashForm.Card_Ac_ID) === Number(el.Txn_ID)){
        this.ObjcashForm.Card_Ac = el.Ledger_Name
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
this.ObjcashForm.Card_Ac_ID = this.ObjcashForm.Card_Ac_ID ? this.ObjcashForm.Card_Ac_ID : 0 ;
this.ObjcashForm.Card_Ac = this.ObjcashForm.Card_Ac ? this.ObjcashForm.Card_Ac : "NA" ;
this.ObjcashForm.Credit_To_Ac_ID = this.ObjcashForm.Credit_To_Ac_ID ? this.ObjcashForm.Credit_To_Ac_ID : 0 ;
this.ObjcashForm.Credit_To_Ac = this.ObjcashForm.Credit_To_Ac ? this.ObjcashForm.Credit_To_Ac : "NA" ;

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
  this.buttonname = this.Hold_Order_Flag ? "Hold Order" : 'Save & Print Bill';

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

}
 class search{
  start_date : string;
  end_date : string;
  //Outlet : string;
 }

 class addbillForm{
  selectitem : string;
  Product_ID : string;
  BrowserDeliveryto : any;
  //User_ID : any;
  Doc_Type : any;
  /*Billno : string;
  selectitem : string;
  Qty : string;
 */
  Modifier : string;
  Product_Description : string;
  //Sale_rate : number;
  Net_Price : number;
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
  Order_Taken_By : string;
}
class cashForm{
  Credit_To_Ac_ID : any;
  Credit_To_Ac : string;
  Credit_To_Amount: number = 0;
  Cash_Amount: number = 0;
  Card_Ac_ID : any;
  Card_Ac : string;
  Card_Amount: number = 0;
  Total_Paid : number = 0;
  Net_Due : number = 0;
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
}
class HomeDelivery{
  Delivery_Type : string;
  Delivery_Mobile_No : any;
  Delivery_Name : any;
  Delivery_Address: any;
  Delivery_Near_By : any;
  Delivery_Pin_Code : any;

}

