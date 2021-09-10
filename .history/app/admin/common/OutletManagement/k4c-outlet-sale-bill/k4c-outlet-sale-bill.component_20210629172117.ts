import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, wtfEndTimeRange } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
declare var $:any;
@Component({
  selector: 'app-k4c-outlet-sale-bill',
  templateUrl: './k4c-outlet-sale-bill.component.html',
  styleUrls: ['./k4c-outlet-sale-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cOutletSaleBillComponent implements OnInit {
  items = [];
  tabIndexToView = 0;
  searchObj : search = new search();
  seachSpinner = false;
  Searchedlist = [];

  addbillFormSubmitted = false;
  ObjaddbillForm : addbillForm  = new addbillForm();
  url = window["config"];
  billdate = [];
  //Billno = false;
  selectitem = [];
  EditDoc_No = undefined;
  dateList: any;
  myDate: Date;
  returnedID = [];
  buttonname = "Save & Print Bill";
  Spinner = false;
  addbillForm = [];
  tempArr = [];
  data = [];
  productSubmit = [];
  Dis_Amount : any;
  Total:any;
  Amount:any;
  Gross_Amount:any;
  SGST_Amount:any;
  CGST_Amount:any;
  @ViewChild("Product2" ,{static : false}) Product2: Dropdown;
  // @ViewChild("ItemField" ,{static : false}) myItemField: ElementRef;
  Objcustomerdetail : customerdetail = new customerdetail();
  Round_Off: any;
  Amount_Payable: any;
  Net_Payable: any;
  Adv: any;
  //Discount: any;
  ObjcashForm : cashForm  = new cashForm();
  creditlist: any;
  cardlist: any;
  GST_Tax_Per_Amt: any;
  //Total_Paid : number;
  //Refund_Amount: number;
  SavePrintFormSubmitted = false;
  GSTvalidFlag = false;
  editList: any;
  public sub: Observable<string>;
  public QueryStringObj : any;
  CustomerDisabledFlag = false;
  Hold_Bill_Flag = false;
  AdvOderDetailList: any;
  godown_id: any;
  Batch_NO = [];
  Adv_Order_No: any;
  IsAdvance = false;
  ProductTypeFilterList = [];
  ProductTypeFilterSelected = undefined;
  constructor(
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) {
    this.Header.pushHeader({
      Header: "POS Bill",
      Link: " Outlet -> Sale Bill"
    });
  }

  ngOnInit() {
   // console.log(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);

    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "POS Bill",
      Link: " Outlet -> Sale Bill"
    });
    this.GetProductTypeFilterList();
    this.getbilldate();
    this.getcostcenid();
    this.getselectitem();
    this.getcardamount();
    this.getgodownid();
    //this.getadvorderdetails();
    this.route.queryParamMap.subscribe((val:any) => {
      this.CustomerDisabledFlag = false;
      if(val.params) {
        this.QueryStringObj = val.params;
        if(this.QueryStringObj.Foot_Fall_ID) {
          this.CustomerDisabledFlag = true;
          this.tabIndexToView = 1;
          this.UpdateCustomerDetails(this.QueryStringObj)
        }
        if(this.QueryStringObj.Txn_ID) {
          this.CustomerDisabledFlag = true;
          this.tabIndexToView = 1;
          this.ObjaddbillForm.Advance = this.QueryStringObj.Order_No;
        }
        if(this.QueryStringObj.Browse_Flag) {
          this.CustomerDisabledFlag = false;
        }
        if(this.QueryStringObj.Edit){
          this.CustomerDisabledFlag = true;
          this.editmaster(this.QueryStringObj);
        }
        if(this.QueryStringObj.Edit_from_order){
          this.CustomerDisabledFlag = true;
          this.getorderno(this.QueryStringObj);
          this.ObjaddbillForm.Advance = this.QueryStringObj.Order_No;
        }
      }
    } );
    this.getcredittoaccount();
    //console.log(this.QueryStringObj);


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
    //console.log(this.Objcustomerdetail.Costomer_Mobile);
    if(this.Objcustomerdetail.Costomer_Mobile) {
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "GET_OUTLET_CUSTOMER_DETAILS",
        "Json_Param_String" : JSON.stringify([{'Costomer_Mobile' : this.Objcustomerdetail.Costomer_Mobile}])
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
          // console.log(data);
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
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.searchObj.start_date = dateRangeObj[0];
      this.searchObj.end_date = dateRangeObj[1];
    }
  }
  GetProductTypeFilterList(){
    const tempobj = {
      Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "GET Product Type",
      "Json_Param_String": JSON.stringify([tempobj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ProductTypeFilterList = data;
       console.log('searchlist=====',this.Searchedlist)
     })
  }
  GetSearchedlist(){
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
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get Outlet Bill Details",
      "Json_Param_String": JSON.stringify([tempobj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Searchedlist = data;
       //console.log('searchlist=====',this.Searchedlist)
       this.seachSpinner = false;
     })
  }
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

  getbilldate(){
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Outlet Bill Date",
      //"Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.dateList = data;
    //console.log("this.dateList  ===",this.dateList);
   this.myDate =  new Date(data[0].Outlet_Bill_Date);
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
   if(this.$CompacctAPI.CompacctCookies.User_Type == 'U'){
   this.ObjaddbillForm.Browseroutlet = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
   }
   //console.log("this.ObjaddbillForm.BroeItem",this.ObjaddbillForm.BroeItem);
   this.getselectitem();
    //console.log("this.returnedID======",this.returnedID);


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
      Doc_Date : this.Objcustomerdetail.Doc_Date
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
     // console.log("this.selectitem======",this.selectitem);


    });



}
//
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
   this.godown_id = data[0].godown_id ? data[0].godown_id : 0;
  // console.log('godownid ==', data)

  });
}
getBatchNo(){
 // console.log(this.godown_id)
 // console.log(this.ObjaddbillForm.Product_ID)
  const TempObj = {
    Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    Godown_Id : this.godown_id,
    Product_ID : this.ObjaddbillForm.Product_ID,
    //Cost_Cen_ID : 2,
    //Godown_Id : 4,
    //Product_ID : 3383
   }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get_Product_Wise_Batch",
    "Json_Param_String": JSON.stringify([TempObj])
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Batch_NO = data;
   this.ObjaddbillForm.Batch_No = this.Batch_NO ? this.Batch_NO[0].Batch_NO : undefined;
  // console.log('Batch No ==', data)

  });
}

getcredittoaccount(){
  this.creditlist = [];
  if(this.QueryStringObj && this.QueryStringObj.Txn_ID) {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Online Ledger"
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.creditlist = data;
       this.creditlist = this.creditlist.filter(item => item.Txn_ID.toString() === this.QueryStringObj.Txn_ID.toString());
       this.ObjcashForm.Credit_To_Ac_ID = this.QueryStringObj.Txn_ID;
     })

  } else {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Data for Credit to Account",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.creditlist = data;
     })
  }
}

getcardamount(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Data for Card to Amount",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.cardlist = data;
    //  if(this.QueryStringObj.Txn_ID) {
    //   this.cardlist = this.cardlist.filter(item => item.Txn_ID.toString() === this.QueryStringObj.Txn_ID.toString());
    //  }
     //console.log('card=====',this.cardlist)
   })
}

ProductChange() {
  this.Batch_NO =[];
if(this.ObjaddbillForm.Product_ID) {
  const ctrl = this;
  this.getBatchNo();
  const productObj = $.grep(ctrl.selectitem,function(item) {return item.Product_ID == ctrl.ObjaddbillForm.Product_ID})[0];
  //console.log(productObj);
  //this.rate = productObj.Sale_rate;
  this.ObjaddbillForm.Product_Description = productObj.Product_Description;
  //this.ObjaddbillForm.Stock_Qty = productObj.Stock_Qty;
  this.ObjaddbillForm.Net_Price =  productObj.Net_Price;
  this.ObjaddbillForm.GST_Tax_Per =  productObj.GST_Tax_Per;
}
}
add(valid) {
  //console.log(this.ObjaddbillForm.Product_ID)
  this.addbillFormSubmitted = true;
  if(valid && this.GetSelectedBatchqty()) {
   //console.log("call");
  //console.log("this.ObjaddbillForm===",this.ObjaddbillForm)
  var Amount = Number(this.ObjaddbillForm.Stock_Qty * this.ObjaddbillForm.Net_Price);
  var Dis_Amount = Number(Amount * Number(this.ObjaddbillForm.Max_Discount) / 100);
  var SGST_Per = Number(this.ObjaddbillForm.GST_Tax_Per / 2);
  var Gross_Amount = Number(Amount - Dis_Amount) ;
  var SGST_Amount = Number((Gross_Amount * SGST_Per) / 100) ;
  var CGST_Per = Number(this.ObjaddbillForm.GST_Tax_Per / 2);
  var CGST_Amount = Number((Gross_Amount * CGST_Per) / 100) ;
  //this.ObjaddbillForm.Gross_Amt = Gross_Amount;
  //var GST_Tax_Per_Amt = 0;
  //new add
  var productObj = {
    Product_ID : this.ObjaddbillForm.Product_ID,
    Product_Description : this.ObjaddbillForm.Product_Description,
    Modifier : this.ObjaddbillForm.Modifier,
    Net_Price : Number(this.ObjaddbillForm.Net_Price),
    Stock_Qty :  Number(this.ObjaddbillForm.Stock_Qty),
    Batch_No : this.ObjaddbillForm.Batch_No,
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
  this.productSubmit.push(productObj);

  // var sameProdTypeFlag = false;
  // this.productSubmit.forEach(item => {
  //   //console.log('enter select');
  //   //console.log(item.Product_ID);
  //   //console.log(this.ObjaddbillForm.Product_ID);
  //   //console.log(item.Product_ID == this.ObjaddbillForm.Product_ID);
  //   if(item.Product_ID == this.ObjaddbillForm.Product_ID && item.Modifier == this.ObjaddbillForm.Modifier) {
  //     //console.log('select item true');
  //     item.Stock_Qty = Number(item.Stock_Qty) + Number( productObj.Stock_Qty);
  //     item.Max_Discount = Number(item.Max_Discount) + Number(productObj.Max_Discount);
  //     item.Amount = Number(item.Amount) + Number(productObj.Amount);
  //     item.Gross_Amount = Number(item.Gross_Amount) + Number(productObj.Gross_Amount);
  //     item.Dis_Amount = Number(item.Dis_Amount) + Number(productObj.Dis_Amount);
  //     item.SGST_Amount = (Number(item.SGST_Amount) + Number(productObj.SGST_Amount)).toFixed(2);
  //     item.CGST_Amount = (Number(item.CGST_Amount) + Number(productObj.CGST_Amount)).toFixed(2);
  //     item.Net_Amount = (Number(item.Net_Amount) + Number(productObj.Net_Amount)).toFixed(2);

  //     sameProdTypeFlag = true;
  //   }
  //   // count = count + Number(item.Net_Amount);
  // });

  // if(this.sameProdTypeFlag == false) {
  //  this.productSubmit.push(productObj);
  // }

 // console.log("this.productSubmit",this.productSubmit);
  const selectedCostCenter = this.ObjaddbillForm.selectitem;
  this.ObjaddbillForm = new addbillForm();
  this.ObjaddbillForm.selectitem = selectedCostCenter;
  this.getselectitem();
  this.addbillFormSubmitted = false;
  this.CalculateTotalAmt();
  this.listofamount();
  //this.clearData();

  this.Product2.applyFocus()
  this.Product2.containerViewChild.nativeElement.click();
  }
}
GetSelectedBatchqty () {
  const sameproductwithbatch = this.productSubmit.filter(item=> item.Batch_No === this.ObjaddbillForm.Batch_No && item.Product_ID === this.ObjaddbillForm.Product_ID );
  if(sameproductwithbatch.length) {
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Product with same batch no. detected."
        });
    return false;
  }
  const baychqtyarr = this.Batch_NO.filter(item=> item.Batch_NO === this.ObjaddbillForm.Batch_No);
    if(baychqtyarr.length) {
      if(this.ObjaddbillForm.Stock_Qty <=  baychqtyarr[0].Qty) {
        return true;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Quantity can't be more than in batch available quantity "
        });
        return false;
      }
    } else {
      return true;
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
  this.Adv = this.IsAdvance ? this.Adv : 0;
  this.Net_Payable = Number((this.Amount_Payable) - Number(this.Adv)).toFixed(2);
  if(this.QueryStringObj && this.QueryStringObj.Txn_ID){
    this.ObjcashForm.Credit_To_Amount = this.Net_Payable;
    this.ObjcashForm.Total_Paid = this.Net_Payable;
  }
  //console.log(this.Round_Off)
}
cleartotalamount(){
  this.Total = [];
  this.Round_Off = [];
  this.Amount_Payable = [];
  this.Adv = 0;
  this.Net_Payable = [];
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
   if(Number(this.Net_Payable) < this.ObjcashForm.Total_Paid){
     this.ObjcashForm.Refund_Amount = Number(this.ObjcashForm.Total_Paid) - Number(this.Net_Payable)
   }
   else {
    this.ObjcashForm.Refund_Amount = 0 ;
   }
}

// CREATE AND UPDATE
saveprintAndUpdate(){
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
  if(this.buttonname != "Hold Bill"){
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
  }
// if(this.ObjcashForm.Total_Paid - this.ObjcashForm.Refund_Amount == this.Net_Payable){

   const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String" : "Add Outlet Transaction Sale Bill",
   "Json_Param_String": this.getDataForSaveEdit()

  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    //console.log(data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      this.compacctToast.clear();
      const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Sale_Bill_ID  " + tempID,
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
// } else{
//   this.compacctToast.clear();
//   this.compacctToast.add({
//     key: "compacct-toast",
//     severity: "error",
//     summary: "Warn Message",
//     detail: "Collected Amount is not equal to net payable "
//   });
// }
  // this.clearData();
  // this.productSubmit =[];
  // this.clearlistamount();
  // this.cleartotalamount();


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
      }

    const TempObj = {
      Created_By : this.$CompacctAPI.CompacctCookies.User_ID,
      Foot_Fall_ID : this.Objcustomerdetail.Foot_Fall_ID,
      Bill_Date : this.DateService.dateConvert(new Date(this.myDate)),
      //Doc_No : this.ObjaddbillForm.Doc_No,
      Doc_No : this.Objcustomerdetail.Bill_No ?  this.Objcustomerdetail.Bill_No : "A",
      Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      //Adv_Order_No : this.ObjaddbillForm.Advance,
      Rounded_Off : this.Round_Off,
      Amount_Payable : this.Amount_Payable,
      Advance : this.Adv,
      Net_Payable : this.Net_Payable,
      Hold_Bill  : this.Hold_Bill_Flag ? "Y" : "N",
      Order_Txn_ID : 0,
      Adv_Order_No : this.Adv_Order_No != null ? this.Adv_Order_No : ""
    }
    tempArr.push({...obj,...TempObj,...this.Objcustomerdetail,...this.ObjcashForm})
  });
 // console.log("save bill =" , tempArr)
  return JSON.stringify(tempArr);
  }

}
editmaster(eROW){
//console.log("editmaster",eROW);
  this.clearData();
  if(eROW.Bill_No){
  this.Objcustomerdetail.Bill_No = eROW.Bill_No;
  this.tabIndexToView = 1;
  // this.items = ["BROWSE", "UPDATE"];
  // this.buttonname = "Update";
   //console.log("this.EditDoc_No ", this.Objcustomerdetail.Bill_No );
  this.geteditmaster(this.Objcustomerdetail.Bill_No);
  //this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
  }
}
geteditmaster(Bill_No){
  //console.log("Doc_No",Bill_No);
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Outlet Bill Details For Edit",
    "Json_Param_String": JSON.stringify([{Doc_No : this.Objcustomerdetail.Bill_No}])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.editList = data;
    this.Objcustomerdetail.Costomer_Mobile = data[0].Costomer_Mobile;
    this.Objcustomerdetail.Customer_Name= data[0].Customer_Name;
    this.Objcustomerdetail.Customer_DOB = data[0].Customer_DOB;
    this.Objcustomerdetail.Customer_Anni= data[0].Customer_Anni;
    this.Objcustomerdetail.Customer_GST = data[0].Customer_GST;
    this.Objcustomerdetail.Bill_Remarks = data[0].Bill_Remarks;

    data.forEach(element => {
    const  productObj = {
        Product_ID : element.Product_ID,
        Product_Description : element.Product_Description,
        Modifier : element.Product_Modifier,
        Net_Price : Number(element.Rate),
        Batch_No : element.Batch_No,
        Stock_Qty :  Number(element.Qty),
        Amount : Number(element.Amount).toFixed(2),
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
    this.ObjcashForm.Refund_Amount = data[0].Refund_Amount;

    this.Objcustomerdetail.Foot_Fall_ID = data[0].Foot_Fall_ID;
    this.Objcustomerdetail.Cost_Cen_ID = data[0].Cost_Cen_ID;
    //this.ObjaddbillForm.Doc_Date = data[0].Order_Date;
    this.Objcustomerdetail.Bill_No = data[0].Bill_No;
    this.myDate = data[0].Bill_Date;
    this.Total = data[0].Net_Amount;
    this.Amount_Payable = data[0].Amount_Payable;
    this.Round_Off = data[0].Rounded_Off;

    this.CalculateTotalAmt();
    this.listofamount();
  //console.log("this.editList  ===",data);
 //this.myDate =  new Date(data[0].Column1);
  // on save use this
 // this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));

})
}

//CANCLE BROWSE ROW
Cancle(row){
  //console.log(this.Objcustomerdetail.Bill_No)
  this.Objcustomerdetail.Bill_No = undefined ;
  if(row.Bill_No){
  this.Objcustomerdetail.Bill_No = row.Bill_No;
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
    Doc_No : this.Objcustomerdetail.Bill_No
  }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Cancle Sale Bill",
    "Json_Param_String": JSON.stringify([Tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //console.log(data);
    if(data[0].Column1 === "Cancel Successfully") {
      this.GetSearchedlist();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Bill_No : " + this.Objcustomerdetail.Bill_No,
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

HoldBill(){
  this.buttonname = this.Hold_Bill_Flag ? "Hold Bill" : 'Save & Print Bill';

}

// ORDER TO BILL
getorderno(orderno){
  //console.log("get order no",orderno);
  this.IsAdvance = false;
    this.clearData();
    if(orderno.Adv_Order_No){
    this.Adv_Order_No = orderno.Adv_Order_No;
    this.tabIndexToView = 1;
    this.IsAdvance = true;
     //console.log("this.EditDoc_No ", this.Adv_Order_No );
    this.getadvorderdetails(this.Adv_Order_No);;
    }
  }
getadvorderdetails(Adv_Order_No){
    //console.log('Bill No ===', this.Adv_Order_No)
    const TempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Doc_No : this.Adv_Order_No
     }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get Advance Order For POS Bill",
      "Json_Param_String" :  JSON.stringify([TempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.AdvOderDetailList = data;
       //console.log('Advance Order Detail ===', data)
       this.Objcustomerdetail.Costomer_Mobile = data[0].Costomer_Mobile;
       this.Objcustomerdetail.Customer_Name= data[0].Customer_Name;
       this.Objcustomerdetail.Customer_DOB = data[0].Customer_DOB;
       this.Objcustomerdetail.Customer_Anni= data[0].Customer_Anni;
       this.Objcustomerdetail.Customer_GST = data[0].Customer_GST;
       this.Objcustomerdetail.Bill_Remarks = data[0].Bill_Remarks;

       data.forEach(element => {
        const  productObj = {
            Product_ID : element.Product_ID,
            Product_Description : element.Product_Description,
            Modifier : element.Product_Modifier,
            Net_Price : Number(element.Adv_Rate),
            Batch_No : element.Batch_No,
            Stock_Qty :  Number(element.Qty),
            Amount : Number(element.Amount).toFixed(2),
            Max_Discount : Number(element.Discount_Per),
            Dis_Amount : Number(element.Discount_Amt).toFixed(2),
            Gross_Amount : Number(element.Gross_Amt).toFixed(2),
            SGST_Per : Number(element.SGST_Per).toFixed(2),
            SGST_Amount : Number(element.SGST_Amt).toFixed(2),
            CGST_Per : Number(element.CGST_Per).toFixed(2),
            CGST_Amount : Number(element.CGST_Amt).toFixed(2),
            GST_Tax_Per : Number(element.IGST_Per),
            GST_Tax_Per_Amt : element.IGST_Amt,
            Net_Amount : Number(element.Net_Amount).toFixed(2),
            deleteflag : true

          };
          this.productSubmit.push(productObj);
        });
        // this.ObjcashForm.Credit_To_Ac_ID = data[0].Credit_To_Ac_ID;
        // this.ObjcashForm.Credit_To_Ac = data[0].Credit_To_Ac;
        // this.ObjcashForm.Credit_To_Amount = data[0].Credit_To_Amount;
        // this.ObjcashForm.Cash_Amount = data[0].Cash_Amount;
        // this.ObjcashForm.Card_Ac_ID = data[0].Card_Ac_ID;
        // this.ObjcashForm.Card_Ac = data[0].Card_Ac;
        // this.ObjcashForm.Card_Amount = data[0].Card_Amount;
        //this.ObjcashForm.Total_Paid = data[0].Total_Paid;
        this.Total = data[0].Net_Amount;
        this.Round_Off = data[0].Rounded_Off;
        this.Amount_Payable = data[0].Amount_Payable;
        this.Adv = data[0].Advance;
        this.Net_Payable = data[0].Net_Payable;
        //this.ObjcashForm.Refund_Amount = data[0].Refund_Amount;

        this.Objcustomerdetail.Foot_Fall_ID = data[0].Foot_Fall_ID;
        this.Objcustomerdetail.Cost_Cen_ID = data[0].Cost_Cen_ID;

        this.listofamount();
        this.CalculateTotalAmt();
     })
  }


clearData(){
  this.ObjaddbillForm = new addbillForm();
  this.ObjcashForm = new cashForm();
  this.Objcustomerdetail = new customerdetail();
  this.ObjaddbillForm.selectitem = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
  if(this.$CompacctAPI.CompacctCookies.User_Type == 'U'){
    this.ObjaddbillForm.Browseroutlet = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
    }
  this.addbillFormSubmitted = false;
  this.SavePrintFormSubmitted = false;
  this.seachSpinner = false;
  this.getbilldate();
  this.Hold_Bill_Flag = false;
}

}
 class search{
  start_date : string;
  end_date : string;
  Outlet : string;
 }

 class addbillForm{
  Advance = "NA" ;
  selectitem : string;
  Product_ID : string;
  Browseroutlet : any;
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
  Batch_No : any;
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
}
class cashForm{
  Credit_To_Ac_ID : any;
  Credit_To_Ac : string;
  Credit_To_Amount : number = 0;
  Cash_Amount : number = 0;
  Card_Ac_ID : any;
  Card_Ac : string;
  Card_Amount : number = 0;
  Total_Paid : number = 0;
  Refund_Amount : number = 0;
}
class customerdetail{
  Costomer_Mobile : number;
  Customer_Name : string;
  Customer_DOB : string;
  Customer_Anni : string;
  Customer_GST : string;
  Bill_Remarks : string;
  Foot_Fall_ID = 0;
  Cost_Cen_ID : number;
  Doc_Date : string;
  //Doc_No = "A" ;
  Bill_No : any;

}


