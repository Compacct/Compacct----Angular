import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, wtfEndTimeRange } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { NgxUiLoaderService } from "ngx-ui-loader";
declare var $:any;
@Component({
  selector: 'app-k4c-outlet-sale-bill',
  templateUrl: './k4c-outlet-sale-bill.component.html',
  styleUrls: ['./k4c-outlet-sale-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cOutletSaleBillComponent implements OnInit,AfterViewInit {
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
  selectitemView = [];
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
  withoutdisamt:any;
  taxb4disamt:any;
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
  walletlist: any;
  GST_Tax_Per_Amt: any;
  TotalTaxable: any;
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
  ProductTypeFilterSelected:any;
  FromCostCentId: any;
  checkSave = true;
  BackupWallet : number = 0;
  CanRemarksPoppup = false;
  Cancle_Remarks : string;
  cancleFormSubmitted = false;
  Can_Remarks = false;
  couponflag = false;
  Del_Cost_Cent_ID : any;
  gststatus: any;
  FranchiseBill:any;
  CGST_Ledger_Id: any;
  SGST_Ledger_Id: any;
  IGST_Ledger_Id: any;
  ProductType = undefined;
  isservice = undefined;
  Regeneratelist = [];
  contactname = undefined;

  constructor(
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) {
    
   console.log('constr');
    this.route.queryParamMap.subscribe((val:any) => {
      this.CustomerDisabledFlag = false;
      this.ObjaddbillForm.Ledger_Name = '';
      console.log('constr --2');
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
          this.ObjaddbillForm.Order_Date = this.QueryStringObj.Order_Date;
          this.ObjaddbillForm.Ledger_Name = this.QueryStringObj.Ledger_Name;
          this.getwalletamount();
          //this.ObjcashForm.Credit_To_Ac_ID = 5;
        }
        if(this.QueryStringObj.Browse_Flag) {
          this.CustomerDisabledFlag = false;
        }
        // if(this.QueryStringObj.Txn_ID){
        //   this.CustomerDisabledFlag = true;
        //   this.getwalletamount();
        //   this.OnlineEditmaster(this.QueryStringObj);
        // }
        if(this.QueryStringObj.Edit){
          this.CustomerDisabledFlag = true;
          this.getwalletamount();
          this.editmaster(this.QueryStringObj);
        }
        if(this.QueryStringObj.Edit_from_order){
          this.CustomerDisabledFlag = true;
          this.getorderno(this.QueryStringObj);
          this.getwalletamount();
          this.ObjaddbillForm.Advance = this.QueryStringObj.Order_No;
          this.ObjaddbillForm.Order_Date = this.QueryStringObj.Order_Date;
        }
        if(this.QueryStringObj.Edit_from_Border){
          this.CustomerDisabledFlag = true;
          this.getorderno(this.QueryStringObj);
          this.getwalletamount();
          this.Del_Cost_Cent_ID = this.QueryStringObj.Del_Cost_Cent_ID;
         // console.log("this.Del_Cost_Cent_ID===",this.Del_Cost_Cent_ID)
          // this.ObjaddbillForm.Advance = this.QueryStringObj.Order_No;
          // this.ObjaddbillForm.Order_Date = this.QueryStringObj.Order_Date;
        }
      }
    } );
    this.Header.pushHeader({
      Header: "POS Bill",
      Link: " Outlet -> Sale Bill"
    });
   // this.getselectitem();
  }

  ngOnInit() {
   console.log('ngOnInit');

    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "POS Bill",
      Link: " Outlet -> Sale Bill"
    });
    this.getselectitem();
    this.GetProductTypeFilterList();
    this.getbilldate();
    this.getcostcenid();
    this.getgodownid();
    //this.getadvorderdetails();
    this.getwalletamount();
    this.getcredittoaccount();
    this.gstchecking();
    //console.log(this.QueryStringObj);

  }
  ngAfterViewInit(){
    console.log(this.Product2)
    this.Product2.applyFocus()
    this.Product2.containerViewChild.nativeElement.click();
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
            this.Objcustomerdetail.Customer_DOB = ReturnObj.DOB ? this.DateService.dateConvert(ReturnObj.DOB) : undefined;
            this.Objcustomerdetail.Customer_Anni = ReturnObj.DOA ? this.DateService.dateConvert(ReturnObj.DOA) : undefined;
            //this.Objcustomerdetail.Customer_DOB = ReturnObj.DOB;
            //this.Objcustomerdetail.Customer_Anni = ReturnObj.DOA;
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
    this.ProductTypeFilterSelected = undefined;
    const tempobj = {
      Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "GET Product Type",
      "Json_Param_String": JSON.stringify([tempobj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       data.forEach(el=>{
         el['label'] = el.Product_Type;
         el['value'] = el.Product_Type_ID;
       });
       const obj2 = {
        Product_Type : 'ALL',
        Product_Type_ID : 0,
        label:'ALL',
        value: 0
       }
       this.ProductTypeFilterList = data;
       this.ProductTypeFilterList.push(obj2);
       this.ProductTypeFilterSelected=0;
      // console.log('searchlist=====',this.ProductTypeFilterList)
     })
  }
  // ProductTypeFilterChange() {
  //   this.Batch_NO =[];
  //   this.ObjaddbillForm.Product_Description = undefined;
  //   this.ObjaddbillForm.Product_ID = undefined;
  //   this.ObjaddbillForm.Net_Price =  undefined;
  //   this.ObjaddbillForm.GST_Tax_Per =  undefined;
  //   if(this.ProductTypeFilterSelected == "0") {
  //     this.selectitemView = this.selectitem;
  //   } else {
  //     this.selectitemView = this.selectitem.filter(item=> Number(item.Product_Type_ID) === Number(this.ProductTypeFilterSelected));
  //   }
  //   console.log(this.selectitemView)
  // }
  chipclick(ev) {
    console.log(ev);
      this.Batch_NO =[];
      this.ObjaddbillForm.Product_Description = undefined;
      this.ObjaddbillForm.Product_ID = undefined;
      this.ObjaddbillForm.Net_Price =  undefined;
      this.ObjaddbillForm.GST_Tax_Per =  undefined;
      const val = ev.value;
    if(val !== 0) {
      let LeadArr = this.selectitem.filter(function (e) {
        return (Number(val) === Number(e['Product_Type_ID']))
      });
      this.selectitemView = LeadArr.length ? LeadArr : [];
    } else {
      this.selectitemView = this.selectitem;
    }
    console.log(this.selectitemView)

  }
  GetSearchedlist(){
    this.seachSpinner = true;
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
      Cost_Cen_ID : this.ObjaddbillForm.Browseroutlet ? this.ObjaddbillForm.Browseroutlet : 0
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
  getTotalValue(key){
    let Amtval = 0;
    this.Searchedlist.forEach((item)=>{
      Amtval += Number(item[key]);
    });

    return Amtval ? Amtval.toFixed(2) : '-';
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
    "Report_Name_String": "Get - Cost Center Name All",
    "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
    //"Json_Param_String": JSON.stringify([{User_ID : 61}])
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.returnedID = data;
   this.FromCostCentId = data[0].Cost_Cen_ID ? data[0].Cost_Cen_ID : 0;
   this.ObjaddbillForm.selectitem = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
   //this.FranchiseBill = data[0].Franchise;
  // console.log('this.FranchiseBill ===', this.FranchiseBill)
  // this.ObjaddbillForm.selectitem = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
   if(this.$CompacctAPI.CompacctCookies.User_Type == 'U'){
   this.ObjaddbillForm.Browseroutlet = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
   } else {
    this.ObjaddbillForm.Browseroutlet = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
   }
   //console.log("this.ObjaddbillForm.BroeItem",this.ObjaddbillForm.BroeItem);

   this.ObjaddbillForm.Advance = this.QueryStringObj.Order_No ? this.QueryStringObj.Order_No : '';
   this.ObjaddbillForm.Order_Date = this.QueryStringObj.Order_Date;
   this.ObjaddbillForm.Ledger_Name = this.QueryStringObj.Ledger_Name ? this.QueryStringObj.Ledger_Name : '';
   this.getselectitem();
   this.autoaFranchiseBill();
  //console.log("this.returnedID======",this.returnedID);

  console.log('ngonit --2');

  });
}
// FRANCISE BILL
autoaFranchiseBill() {
  //this.ExpiredProductFLag = false;
 if(this.ObjaddbillForm.selectitem) {
   const ctrl = this;
   const autofrnchiseObj = $.grep(ctrl.returnedID,function(item: any) {return item.Cost_Cen_ID == ctrl.ObjaddbillForm.selectitem})[0];
   console.log(autofrnchiseObj);
   this.FranchiseBill = autofrnchiseObj.Franchise;
   console.log("this.FranchiseBill ==", this.FranchiseBill)
   
  }
  }

 getselectitem(){
   //if(this.ObjaddbillForm.Cost_Cen_ID){
    this.Objcustomerdetail.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    //console.log("this.ObjaddbillForm.Doc_Date ===",this.ObjaddbillForm.Doc_Date)
    // const TempObj = {
    //   User_ID:this.$CompacctAPI.CompacctCookies.User_ID,
    //   Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    //   Doc_Type : "Sale_Bill",
    //   Doc_Date : this.Objcustomerdetail.Doc_Date
    //  }
    const TempObj = {
        User_ID:this.$CompacctAPI.CompacctCookies.User_ID,
        Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        Doc_Type : "Sale_Bill",
        Product_Type_ID : 0,
        bill_type : this.QueryStringObj.Ledger_Name ? 'Online' : ''
       }
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String" : "Get Sale Requisition Product",
     "Json_Param_String": JSON.stringify([TempObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // if(data.length) {
      //   data.forEach(element => {
      //     element['label'] = element.Product_Description,
      //     element['value'] = element.Product_ID,
      //     element['Product_Type_ID'] = element.Product_Type_ID
      //   });
        this.selectitem = data;
        this.selectitemView = data;

        if (!this.productSubmit.length) {
        this.Product2.applyFocus()
        this.Product2.containerViewChild.nativeElement.click();
        }
      // } else {
      //   this.selectitem = [];
      //   this.selectitemView = [];

      // }
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
   //console.log('godownid ==', data)

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
   this.Batch_NO = data.length ? data : [];
   this.ObjaddbillForm.Batch_No = this.Batch_NO.length ? this.Batch_NO[0].Batch_NO : undefined;
  // console.log('Batch No ==', data)

  });
}

getcredittoaccount(){
  this.creditlist = [];
  // if(this.QueryStringObj && this.QueryStringObj.Txn_ID) {
  //   const obj = {
  //     "SP_String": "SP_Controller_Master",
  //     "Report_Name_String": "Get - Online Ledger"
  //    }
  //    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //      this.creditlist = data;
  //      this.creditlist = this.creditlist.filter(item => item.Txn_ID.toString() === this.QueryStringObj.Txn_ID.toString());
  //      this.ObjcashForm.Credit_To_Ac_ID = this.QueryStringObj.Txn_ID;
  //      console.log('credit ==', this.creditlist)
  //    })

  // } else {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Data for Credit to Account",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.creditlist = data;
       if (!this.QueryStringObj.Ledger_Name) {
        this.creditlist = data;
       } else {
        var couponid = this.creditlist.filter(function(value, index, arr){
          return value.Txn_ID == 5;
        });
        this.creditlist = couponid;
       }
     })
  //}
}

getwalletamount(){
  this.walletlist = [];
  if(this.QueryStringObj && this.QueryStringObj.Txn_ID) {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Online Ledger"
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.walletlist = data;
       this.walletlist = this.walletlist.filter(item => item.Txn_ID.toString() === this.QueryStringObj.Txn_ID.toString());
       this.ObjcashForm.Wallet_Ac_ID = this.QueryStringObj.Txn_ID;
       console.log('wallet ==', this.walletlist)
     })
  } else {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Data for Card to Amount",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.walletlist = data;
    //  if(this.QueryStringObj.Txn_ID) {
    //   this.cardlist = this.cardlist.filter(item => item.Txn_ID.toString() === this.QueryStringObj.Txn_ID.toString());
    //  }
     //console.log('card=====',this.cardlist)
   })
  }
}

ProductChange() {
  this.Batch_NO =[];
  this.ObjaddbillForm.Product_Description =undefined;
  this.ObjaddbillForm.Sale_rate =  undefined;
  this.ObjaddbillForm.GST_Tax_Per =  undefined;
  this.ProductType = undefined;
  this.isservice = undefined;
if(this.ObjaddbillForm.Product_ID) {
  const ctrl = this;
  this.getBatchNo();
  const productObj = $.grep(ctrl.selectitem,function(item) {return item.value == ctrl.ObjaddbillForm.Product_ID})[0];
  console.log(productObj);
  //this.rate = productObj.Sale_rate;
  this.ObjaddbillForm.Product_Description = productObj.label;
  //this.ObjaddbillForm.Stock_Qty = productObj.Stock_Qty;
  this.ObjaddbillForm.Sale_rate =  productObj.Sale_rate;
  //this.ObjaddbillForm.Sale_rate_Online = productObj.Sale_rate_Online;
  this.ObjaddbillForm.GST_Tax_Per =  productObj.GST_Tax_Per;
  this.CGST_Ledger_Id = productObj.CGST_Output_Ledger_ID;
  this.SGST_Ledger_Id = productObj.SGST_Output_Ledger_ID;
  this.IGST_Ledger_Id = productObj.IGST_Output_Ledger_ID;
  this.ProductType = productObj.Product_Type;
  this.isservice = productObj.Is_Service;

}
}
// GST CHECKING
gstchecking(){
  const TempObj = {
    Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
 }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Franchise Gst Type",
    "Json_Param_String": JSON.stringify([TempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.gststatus = data[0].Column1;
    console.log("this.gststatus ===", this.gststatus)
    //this.gst =
  })
}
// CALCULATION
add(valid) {
  //console.log(this.ObjaddbillForm.Product_ID)
  this.addbillFormSubmitted = true;
  if(valid && this.GetSelectedBatchqty()) {
    var SGST_Amount : any;
    var CGST_Amount : any;
    var totalgst : any;
    if (this.gststatus == "NO GST") {
      //var Amount = Number(this.ObjaddbillForm.Stock_Qty * this.ObjaddbillForm.Sale_rate);
      var Amount = Number(Number(this.ObjaddbillForm.Stock_Qty) * Number(this.ObjaddbillForm.Sale_rate));
      var Amtbeforetax = (Number(Amount * 100) / (Number(this.ObjaddbillForm.GST_Tax_Per) + 100));
      var rate =((Number(Number(this.ObjaddbillForm.Sale_rate) * 100)) / (0 + 100)).toFixed(2);
      //var tax = Number(Number(rate) * Number(this.ObjaddbillForm.Stock_Qty));
      var Dis_Amount = Number(Number(rate) * Number(this.ObjaddbillForm.Max_Discount) / 100);
      //var Gross_Amount = Number(rate - Dis_Amount) ;
      var SGST_Per = 0 ;
      SGST_Amount = 0 ;
      var CGST_Per = 0 ;
      CGST_Amount = 0 ;
      var IGST_Per = 0;
      var IGST_Amount = 0 ;
      totalgst = Number(IGST_Amount) ? (Number(SGST_Amount) + Number(CGST_Amount) + Number(IGST_Amount)).toFixed(2) : (Number(SGST_Amount) + Number(CGST_Amount)).toFixed(2);
      var tax = Number(Number(Amtbeforetax) - Number(Dis_Amount)); //- Number(totalgst));
    } 
    else {
   //console.log("call");
  //console.log("this.ObjaddbillForm===",this.ObjaddbillForm)
  var Amount = Number(Number(this.ObjaddbillForm.Stock_Qty) * Number(this.ObjaddbillForm.Sale_rate));
  var Amtbeforetax = (Number(Amount * 100) / (Number(this.ObjaddbillForm.GST_Tax_Per) + 100));
  //var rate =((Number(this.ObjaddbillForm.Sale_rate * 100)) / (Number(this.ObjaddbillForm.GST_Tax_Per) + 100)).toFixed(2);
  // var tax = Number(Number(rate) * Number(this.ObjaddbillForm.Stock_Qty));
  // var Dis_Amount = Number(Number(rate) * Number(this.ObjaddbillForm.Max_Discount) / 100);
  var Dis_Amount = Number(Number(this.ObjaddbillForm.Sale_rate) * Number(this.ObjaddbillForm.Max_Discount) / 100);
  var SGST_Per = Number(Number(this.ObjaddbillForm.GST_Tax_Per) / 2);
  //var Gross_Amount = Number(rate - Dis_Amount) ;
  SGST_Amount = (Number(Number(Amtbeforetax) * Number(SGST_Per)) / 100).toFixed(2); 
  //SGST_Amount = (Number(Number(Amount) * Number(SGST_Per)) / Number(Number(this.ObjaddbillForm.GST_Tax_Per) + 100)).toFixed(2);
  var CGST_Per = Number(Number(this.ObjaddbillForm.GST_Tax_Per) / 2);
  CGST_Amount = (Number(Number(Amtbeforetax) * Number(CGST_Per)) / 100).toFixed(2);
  // CGST_Amount = (Number(Number(Amount) * Number(CGST_Per)) / Number(Number(this.ObjaddbillForm.GST_Tax_Per) + 100)).toFixed(2);
  var IGST_Per = Number(this.ObjaddbillForm.GST_Tax_Per);
  var IGST_Amount = Number(this.ObjaddbillForm.GST_Tax_Per_Amt) ;
  totalgst = Number(IGST_Amount) ? (Number(SGST_Amount) + Number(CGST_Amount) + Number(IGST_Amount)).toFixed(2) : (Number(SGST_Amount) + Number(CGST_Amount)).toFixed(2);
  //var tax = Number(Number(Number(Amount) - Number(Dis_Amount))- Number(totalgst));
  var tax = Number(Number(Amtbeforetax) - Number(Dis_Amount));

  // console.log('taxable',tax)
  // var aftertaxable:any = Number(tax).toFixed(2);
  // console.log('aftertaxable',aftertaxable)
  // let afterdecval = Number(aftertaxable).toString().split('.')[1]
  // console.log('afterdecval',afterdecval)
  // let splitval = Number(afterdecval).toString().split()[1]
  // const oddOrEven = Number(afterdecval) % 2 === 0  ? 'even' : 'odd'
  // console.log('oddOrEven',oddOrEven)
  // if (oddOrEven == 'odd') {
  //   aftertaxable = (Number(aftertaxable) + Number(0.01)).toFixed(2)
  //   console.log("aftertaxable",aftertaxable)
  // } else {
  //   aftertaxable = Number(aftertaxable)
  //   console.log("aftertaxable",aftertaxable)
  // }
  var ntamt = Number(tax) + Number(totalgst);
  //var ntamt = Number(Number(Amtbeforetax) - Number(Dis_Amount)) + Number(totalgst);
    }
  //this.ObjaddbillForm.Gross_Amt = Gross_Amount;
  //var GST_Tax_Per_Amt = 0;
  //new add
  var productObj = {
    Product_ID : this.ObjaddbillForm.Product_ID,
    Product_Description : this.ObjaddbillForm.Product_Description,
    Modifier : this.ObjaddbillForm.Modifier,
    product_type : this.ProductType,
    is_service : this.isservice,
    // Modifier1 : this.ObjaddbillForm.Modifier1,
    // Modifier2 : this.ObjaddbillForm.Modifier2,
    // Modifier3 : this.ObjaddbillForm.Modifier3,
    // Modifier4 : this.ObjaddbillForm.Modifier4,
    // Modifier5 : this.ObjaddbillForm.Modifier5,
    // Net_Price : Number(rate).toFixed(2),
    Net_Price : Number(this.ObjaddbillForm.Sale_rate),
    Delivery_Charge : 0,
    Stock_Qty :  Number(this.ObjaddbillForm.Stock_Qty),
    Batch_No : this.ObjaddbillForm.Batch_No,
    Amount : Number(Amount).toFixed(2),
    Amount_berore_Tax : Number(Amtbeforetax).toFixed(2),
    Max_Discount : Number(this.ObjaddbillForm.Max_Discount),
    Dis_Amount : Number(Dis_Amount).toFixed(2),
    Taxable : Number(tax).toFixed(2),
    //Gross_Amount : Number(Number(tax) - Number(Dis_Amount)).toFixed(2),
    Gross_Amount : Number(Amtbeforetax).toFixed(2),
    SGST_Per : Number(IGST_Amount) ? 0 : Number(SGST_Per).toFixed(2),
    SGST_Amount : Number(SGST_Amount).toFixed(2),
    CGST_Per : Number(IGST_Amount) ? 0 : Number(CGST_Per).toFixed(2),
    CGST_Amount : Number(CGST_Amount).toFixed(2),
    GST_Tax_Per : Number(SGST_Amount) && Number(CGST_Amount) ? 0 : Number(IGST_Per).toFixed(2),
    GST_Tax_Per_Amt :  Number(IGST_Amount).toFixed(2),
    GST_Tax_Per_forcalcu : Number(IGST_Per).toFixed(2),
   // Net_Amount : Number(Gross_Amount + SGST_Amount + CGST_Amount).toFixed(2),
    Net_Amount : Number(ntamt).toFixed(2),
    // Taxable_Amount : Number(rate).toFixed(3),
    Taxable_Amount : Number(Amtbeforetax).toFixed(3),
    CGST_Output_Ledger_ID : this.CGST_Ledger_Id,
    SGST_Output_Ledger_ID : this.SGST_Ledger_Id,
    IGST_Output_Ledger_ID : this.IGST_Ledger_Id

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

  //console.log("this.productSubmit",this.productSubmit);
 
  this.Batch_NO = [];
  const selectedCostCenter = this.ObjaddbillForm.selectitem;
  const tempBackup = this.ObjaddbillForm;
  this.ObjaddbillForm = new addbillForm();
  this.ObjaddbillForm.selectitem = selectedCostCenter;
  this.ObjaddbillForm.Advance = tempBackup.Advance ? tempBackup.Advance : '';
  this.ObjaddbillForm.Order_Date = tempBackup.Order_Date;
  this.ObjaddbillForm.Ledger_Name = tempBackup.Ledger_Name ? tempBackup.Ledger_Name : '';
  this.getselectitem();
  this.addbillFormSubmitted = false;
  this.CalculateTotalAmt();
  this.listofamount();
  if(this.ObjcashForm.Credit_To_Amount) {
  if(this.ProductType != "PACKAGING") {
    if (this.isservice != true) {
     this.CalculateDiscount();
     if (this.ObjcashForm.Coupon_Per ) { 
      this.couponperchange();
    }
    }
  }
  }
  this.ProductType = undefined;
  this.isservice = undefined;
  //this.clearData();

  // this.Product2.applyFocus()
  // this.Product2.containerViewChild.nativeElement.click();
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
  if(this.ProductType != "PACKAGING") {
    if (this.isservice != true) {
     this.CalculateDiscount();
     if (this.ObjcashForm.Coupon_Per ) { 
      this.couponperchange();
    }
    }
  }
  // if (!this.productSubmit){
  // this.ObjcashForm.Coupon_Per = 0;
  // }

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
  this.Adv = this.IsAdvance ? Number(this.Adv) : 0;
  this.Net_Payable = Number(Number(this.Amount_Payable) - Number(this.Adv)).toFixed(2);
  //var creditamt = 0;
  if(this.QueryStringObj && this.QueryStringObj.Txn_ID){
    //this.ObjcashForm.Credit_To_Amount = creditamt;
    this.ObjcashForm.Wallet_Amount = this.Net_Payable;
    this.ObjcashForm.Total_Paid = this.Net_Payable;
    this.ObjcashForm.Refund_Amount = this.ObjcashForm.Total_Paid - this.Net_Payable;
   // this.ObjcashForm.Refund_Amount = this.ObjcashForm.Cash_Amount - this.Net_Payable;
    this.ObjcashForm.Due_Amount = Number(this.ObjcashForm.Total_Paid) - Number(this.ObjcashForm.Refund_Amount) - Number(this.Net_Payable);
  }
  //console.log(this.Round_Off)
  this.AmountChange();
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
  this.TotalTaxable = undefined;
  let count6 = 0;
  this.withoutdisamt = undefined;
  let count7 = 0;
  this.taxb4disamt = undefined;
  let count8 = 0;


  this.productSubmit.forEach(item => {
    count = count + Number(item.Amount);
    if (item.product_type != "PACKAGING") {
      if (item.is_service != true) {
         count7 = count7 + Number(item.Amount);
         count8 = count8 + Number(item.Amount_berore_Tax);
      }
    }
    count1 = count1 + Number(item.Dis_Amount);
    //count2 = count2 + Number(item.Gross_Amount);
    // count2 = count2 + Number(item.Taxable - item.Dis_Amount);
    count3 = count3 + Number(item.SGST_Amount);
    count4 = count4 + Number(item.CGST_Amount);
    count5 = count5 + Number(item.GST_Tax_Per_Amt);
    count6 = count6 + Number(item.Taxable);
  });
  this.Amount = (count).toFixed(2);
  this.withoutdisamt = (count7).toFixed(2);
  this.taxb4disamt = (count8).toFixed(2);
  this.Dis_Amount = (count1).toFixed(2);
  this.TotalTaxable = (count6).toFixed(3);
  this.Gross_Amount = (count8).toFixed(2);
  //this.Gross_Amount = (count2).toFixed(2);
  //this.Gross_Amount = (Number(this.TotalTaxable) - Number(this.Dis_Amount)).toFixed(2);
  this.SGST_Amount = (count3).toFixed(2);
  this.CGST_Amount = (count4).toFixed(2);
  this.GST_Tax_Per_Amt = (count5).toFixed(2);
  //console.log(this.Gross_Amount);
}
clearlistamount(){
  this.Amount = [];
  this.withoutdisamt = [];
  this.taxb4disamt = [];
  this.Dis_Amount = [];
  this.Gross_Amount = [];
  this.SGST_Amount = [];
  this.CGST_Amount = [];
  this.GST_Tax_Per_Amt = [];
  this.TotalTaxable = [];
}

AmountChange(){
  //console.log("called");
  this.ObjcashForm.Refund_Amount = 0;
  this.ObjcashForm.Due_Amount = 0;
  //var coupon_per = this.ObjcashForm.Coupon_Per ? this.ObjcashForm.Coupon_Per : 0;
  var credit_amount = this.ObjcashForm.Credit_To_Amount ? Number(this.ObjcashForm.Credit_To_Amount) : 0;
  var wallet_amount = this.ObjcashForm.Wallet_Amount ? Number(this.ObjcashForm.Wallet_Amount) : 0;
  var cash_amount = this.ObjcashForm.Cash_Amount ? Number(this.ObjcashForm.Cash_Amount) : 0 ;
  var card_amount = this.ObjcashForm.Card_Amount ? Number(this.ObjcashForm.Card_Amount) : 0;

  //if (this.ObjcashForm.Coupon_Per ) { 
    // credit_amount = Number(this.Net_Payable) * Number(this.ObjcashForm.Coupon_Per ) / 100;
    // this.ObjcashForm.Credit_To_Amount = (credit_amount).toFixed(2);
    // this.ObjcashForm.Total_Paid = (Number(this.ObjcashForm.Credit_To_Amount) + Number(wallet_amount) + Number(cash_amount) + Number(card_amount)).toFixed(2);
  //} else //if (!this.ObjcashForm.Coupon_Per) {
    //this.ObjcashForm.Credit_To_Amount = null;
    //this.ObjcashForm.Total_Paid = null;
    this.ObjcashForm.Total_Paid = Number((wallet_amount) + Number(cash_amount) + Number(card_amount)).toFixed(2);
  //}
  //  if(Number(this.Net_Payable) < this.ObjcashForm.Cash_Amount){
  //   // this.ObjcashForm.Refund_Amount = (Number(this.ObjcashForm.Total_Paid) - Number(this.Net_Payable)).toFixed(2);
  //   this.ObjcashForm.Refund_Amount = (Number(cash_amount) - Number(this.Net_Payable)).toFixed(2);
  //  }
  //  else {
  //   this.ObjcashForm.Refund_Amount = 0 ;
  //  }
  // if(Number(this.ObjcashForm.Total_Paid) < Number(this.Net_Payable)){
  // this.ObjcashForm.Due_Amount = Number(this.Net_Payable) - Number(this.ObjcashForm.Total_Paid) - Number(this.ObjcashForm.Refund_Amount);
  // }
  // else {
  //  this.ObjcashForm.Due_Amount = (Number(this.ObjcashForm.Total_Paid) - Number(this.ObjcashForm.Refund_Amount) - Number(this.Net_Payable)).toFixed(2);
  //}
  var lefttotal = Number(wallet_amount) + Number(card_amount);
  // if(this.Net_Payable > this.ObjcashForm.Wallet_Amount) {
  //   lefttotal = this.Net_Payable - wallet_amount;
  // }
  // if(this.Net_Payable > this.ObjcashForm.Card_Amount) {
  //   lefttotal = this.Net_Payable - card_amount;
  // }
  // if(this.Net_Payable > this.ObjcashForm.Credit_To_Amount) {
  //   lefttotal = this.Net_Payable - credit_amount;
  // }

  if((Number(this.Net_Payable) > Number(lefttotal)) && Number(cash_amount)) {
    const d = (Number(this.Net_Payable) - Number(lefttotal)).toFixed(2);
    if(Number(cash_amount) > Number(d)) {
      this.ObjcashForm.Refund_Amount = (Number(cash_amount) - Number(d)).toFixed(2);
    }
  //}
  // else if(Number(this.Net_Payable) < this.ObjcashForm.Cash_Amount) {
  //   this.ObjcashForm.Refund_Amount = (Number(cash_amount) - Number(this.Net_Payable)).toFixed(2);
  // }
  // else {
  //   this.ObjcashForm.Refund_Amount = 0 ;
  //  }
  // this.ObjcashForm.Due_Amount = (Number(this.ObjcashForm.Total_Paid) - Number(this.ObjcashForm.Refund_Amount) - Number(d)).toFixed(2);
  } 
  //else {
    this.ObjcashForm.Due_Amount = (Number(this.ObjcashForm.Total_Paid) - Number(this.ObjcashForm.Refund_Amount) - Number(this.Net_Payable)).toFixed(2);
  //}

  if(Number(lefttotal) > Number(this.Net_Payable)) {
    this.ngxService.stop();
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Collected Amount is more than net payable "
  });
  return false;
  }
  
}
couponperchange(){
  var credit_amount = this.ObjcashForm.Credit_To_Amount ? this.ObjcashForm.Credit_To_Amount : 0;
  var wallet_amount = this.ObjcashForm.Wallet_Amount ? this.ObjcashForm.Wallet_Amount : 0;
  var cash_amount = this.ObjcashForm.Cash_Amount ? this.ObjcashForm.Cash_Amount : 0 ;
  var card_amount = this.ObjcashForm.Card_Amount ? this.ObjcashForm.Card_Amount : 0;
  if (this.ObjcashForm.Coupon_Per ) { 
    credit_amount = Number(this.taxb4disamt) * Number(this.ObjcashForm.Coupon_Per ) / 100;
    this.ObjcashForm.Credit_To_Amount = Number(credit_amount).toFixed(2);
    console.log('this.ObjcashForm.Credit_To_Amount ==', this.ObjcashForm.Credit_To_Amount)
    this.ObjcashForm.Total_Paid = (Number(wallet_amount) + Number(cash_amount) + Number(card_amount)).toFixed(2);
    this.CalculateDiscount();
  } 
  else if (!this.ObjcashForm.Coupon_Per) {
    this.ObjcashForm.Credit_To_Amount = 0;
    //this.ObjcashForm.Total_Paid = null;
    this.ObjcashForm.Total_Paid = (Number(wallet_amount) + Number(cash_amount) + Number(card_amount)).toFixed(2);
    //this.ObjcashForm.Total_Paid = (Number(this.ObjcashForm.Credit_To_Amount) + Number(wallet_amount) + Number(cash_amount) + Number(card_amount)).toFixed(2);
   this.CalculateDiscount();
   }
}
CalculateDiscount(){
  if (this.ObjcashForm.Credit_To_Amount){
    console.log("discount amt",this.ObjcashForm.Credit_To_Amount)
    var damt;
    var netamount;
    let countnum = 0;
    this.productSubmit.forEach(el=>{ 
      if(el.product_type != "PACKAGING") {
      if (el.is_service != true) {
      //damt = Number((Number(el.Taxable) / Number(this.TotalTaxable)) * Number(this.ObjcashForm.Credit_To_Amount));
     // damt = Number((Number(el.Amount) / Number(this.withoutdisamt)) * Number(this.ObjcashForm.Credit_To_Amount));
      damt = Number((Number(el.Amount_berore_Tax) / Number(this.taxb4disamt)) * Number(this.ObjcashForm.Credit_To_Amount));
      el.Dis_Amount = Number(damt).toFixed(2);
      var da = Number(el.Dis_Amount);
      //var grossamt = Number(Number(el.Taxable) - Number(el.Dis_Amount));
      //var amt = (Number(el.Amount) - Number(da)).toFixed(2);
      var sgstperamt = (Number(((Number(el.Amount_berore_Tax) - Number(da)) * Number(el.SGST_Per)) / 100)).toFixed(2);
      var cgstperamt = (Number(((Number(el.Amount_berore_Tax) - Number(da)) * Number(el.CGST_Per)) / 100)).toFixed(2);
      var igstperamt = (Number(((Number(el.Amount_berore_Tax) - Number(da)) * Number(el.GST_Tax_Per)) / 100)).toFixed(2);
      // var sgstperamt = (Number(((Number(el.Taxable) - Number(da)) * Number(el.SGST_Per)) / 100)).toFixed(2);
      // var cgstperamt = (Number(((Number(el.Taxable) - Number(da)) * Number(el.CGST_Per)) / 100)).toFixed(2);
      // var igstperamt = (Number(((Number(el.Taxable) - Number(da)) * Number(el.GST_Tax_Per)) / 100)).toFixed(2);
      // var sgstperamt = Number((Number(amt) * Number(el.SGST_Per)) / Number(Number(el.GST_Tax_Per_forcalcu) + 100)).toFixed(2);
      // var cgstperamt = Number((Number(amt) * Number(el.CGST_Per)) / Number(Number(el.GST_Tax_Per_forcalcu) + 100)).toFixed(2);
      // var igstperamt = Number((Number(amt) * Number(el.GST_Tax_Per)) / Number(Number(el.GST_Tax_Per_forcalcu) + 100)).toFixed(2);
      var totalgstamt = Number(igstperamt) ? (Number(sgstperamt) + Number(cgstperamt) + Number(igstperamt)).toFixed(2) : (Number(sgstperamt) + Number(cgstperamt)).toFixed(2);
      //var taxamount = Number(Number(amt) - Number(totalgstamt)).toFixed(2);
      var taxamount = (Number(el.Amount_berore_Tax) - Number(da)).toFixed(2);
      netamount = Number(Number(taxamount) + Number(totalgstamt)).toFixed(2);
      //this.Dis_Amount = undefined;

     //el.Gross_Amount = Number(grossamt).toFixed(2);
     el.SGST_Amount = Number(sgstperamt).toFixed(2);
     el.CGST_Amount = Number(cgstperamt).toFixed(2);
     el.Taxable = Number(taxamount).toFixed(2);
     el.Net_Amount = Number(el.Delivery_Charge) ? (Number(netamount) + Number(el.Delivery_Charge)).toFixed(2) : Number(netamount).toFixed(2);
     countnum = countnum + Number(el.Dis_Amount);
    }
    }
    })
    this.Dis_Amount = (countnum).toFixed(2);
    this.CalculateTotalAmt();
    this.listofamount();
    this.checkdiscountamt();
   } else {
    this.productSubmit.forEach(el=>{
      //var netamount2 = el.Taxable + el.SGST_Amount + el.CGST_Amount;

      el.Dis_Amount = 0 ;
      //el.Gross_Amount = Number(Number(el.Amount_berore_Tax) - Number(el.Dis_Amount)).toFixed(2);
      el.SGST_Amount = Number((Number(el.Amount_berore_Tax) * Number(el.SGST_Per)) / 100).toFixed(2); 
      el.CGST_Amount = Number((Number(el.Amount_berore_Tax) * Number(el.CGST_Per)) / 100).toFixed(2);
      el.GST_Tax_Per_Amt = Number((Number(el.Amount_berore_Tax) * Number(el.GST_Tax_Per)) / 100).toFixed(2);
      // el.SGST_Amount = Number((Number(el.Taxable) * Number(el.SGST_Per)) / 100).toFixed(2); 
      // el.CGST_Amount = Number((Number(el.Taxable) * Number(el.CGST_Per)) / 100).toFixed(2);
      // el.SGST_Amount = Number((Number(el.Amount) * Number(el.SGST_Per)) / Number(Number(el.GST_Tax_Per_forcalcu) + 100)).toFixed(2); 
      // el.CGST_Amount = Number((Number(el.Amount) * Number(el.CGST_Per)) / Number(Number(el.GST_Tax_Per_forcalcu) + 100)).toFixed(2);
      // el.GST_Tax_Per_Amt = Number((Number(el.Amount) * Number(el.GST_Tax_Per)) / Number(Number(el.GST_Tax_Per_forcalcu) + 100)).toFixed(2);
      var totalgstamt = Number(el.GST_Tax_Per_Amt) ? (Number(el.SGST_Amount) + Number(el.CGST_Amount) + Number(el.GST_Tax_Per_Amt)).toFixed(2) : (Number(el.SGST_Amount) + Number(el.CGST_Amount)).toFixed(2);
      el.Taxable = Number(Number(el.Amount_berore_Tax) - Number(el.Dis_Amount)).toFixed(2); //- Number(totalgstamt)).toFixed(2);
      el.Net_Amount = Number(el.Delivery_Charge) ? (Number(el.Delivery_Charge) + Number(Number(el.Taxable) + Number(totalgstamt))).toFixed(2) :
      (Number(Number(el.Taxable)) + Number(totalgstamt)).toFixed(2);
     })
     //console.log("this.discount productSubmit",this.productSubmit);
     this.CalculateTotalAmt();
     this.listofamount();
     this.checkdiscountamt();
   }
}
// Check Discount Amount equal to total discount
checkdiscountamt(){
  this.productSubmit.forEach(el => {
    if(el.product_type != "PACKAGING") {
      if (el.is_service != true) {
        if (Number(this.ObjcashForm.Credit_To_Amount) != Number(this.Dis_Amount) && Number(this.ObjcashForm.Credit_To_Amount) > Number(this.Dis_Amount)) {
          var leftval = (Number(this.ObjcashForm.Credit_To_Amount) - Number(this.Dis_Amount)).toFixed(2);
          el.Dis_Amount = (Number(el.Dis_Amount) + Number(leftval)).toFixed(2);
      
          var sgstamt = Number(((Number(el.Amount_berore_Tax) - Number(el.Dis_Amount)) * Number(el.SGST_Per)) / 100);
          // var sgstamt = Number((Number(el.Amount) * Number(el.SGST_Per)) / Number(Number(el.GST_Tax_Per_forcalcu) + 100)).toFixed(2); 
          el.SGST_Amount = Number(sgstamt).toFixed(2);
      
          var cgstamt = Number(((Number(el.Amount_berore_Tax) - Number(el.Dis_Amount)) * Number(el.CGST_Per)) / 100);
          // var cgstamt = Number((Number(el.Amount) * Number(el.CGST_Per)) / Number(Number(el.GST_Tax_Per_forcalcu) + 100)).toFixed(2);
          el.CGST_Amount = Number(cgstamt).toFixed(2);

          var igstamt = Number(((Number(el.Amount_berore_Tax) - Number(el.Dis_Amount)) * Number(el.GST_Tax_Per)) / 100);
          // var igstamt = Number((Number(el.Amount) * Number(el.GST_Tax_Per)) / Number(Number(el.GST_Tax_Per_forcalcu) + 100)).toFixed(2);
          el.GST_Tax_Per_Amt = Number(igstamt).toFixed(2);

          var togstamt = Number(el.GST_Tax_Per_Amt) ? (Number(el.SGST_Amount) + Number(el.CGST_Amount) + Number(el.GST_Tax_Per_Amt)).toFixed(2) : (Number(el.SGST_Amount) + Number(el.CGST_Amount)).toFixed(2);
          el.Taxable = Number(Number(el.Amount_berore_Tax) - Number(el.Dis_Amount)).toFixed(2); // - Number(togstamt)).toFixed(2);
      
          var netamt = Number(Number(el.Taxable) + Number(togstamt)).toFixed(2);
          el.Net_Amount = Number(el.Delivery_Charge) ? (Number(netamt) + Number(el.Delivery_Charge)).toFixed(2) : Number(netamt).toFixed(2);
          console.log('leftval',leftval)
          console.log('Dis_Amount',el.Dis_Amount)
          this.listofamount();
        }
        if (Number(this.ObjcashForm.Credit_To_Amount) != Number(this.Dis_Amount) && Number(this.ObjcashForm.Credit_To_Amount) < Number(this.Dis_Amount)) {
          var leftval = (Number(this.Dis_Amount) - Number(this.ObjcashForm.Credit_To_Amount)).toFixed(2);
          el.Dis_Amount = (Number(el.Dis_Amount) - Number(leftval)).toFixed(2);
      
          var sgstamt = Number(((Number(el.Amount_berore_Tax) - Number(el.Dis_Amount)) * Number(el.SGST_Per)) / 100);
          // var sgstamt = Number((Number(el.Amount) * Number(el.SGST_Per)) / Number(Number(el.GST_Tax_Per_forcalcu) + 100)).toFixed(2);
          el.SGST_Amount = Number(sgstamt).toFixed(2);;
      
          var cgstamt = Number(((Number(el.Amount_berore_Tax) - Number(el.Dis_Amount)) * Number(el.CGST_Per)) / 100);
          // var cgstamt = Number((Number(el.Amount) * Number(el.CGST_Per)) / Number(Number(el.GST_Tax_Per_forcalcu) + 100)).toFixed(2);
          el.CGST_Amount = Number(cgstamt).toFixed(2);

          var igstamt = Number(((Number(el.Amount_berore_Tax) - Number(el.Dis_Amount)) * Number(el.GST_Tax_Per)) / 100);
          // var igstamt = Number((Number(el.Amount) * Number(el.GST_Tax_Per)) / Number(Number(el.GST_Tax_Per_forcalcu) + 100)).toFixed(2);
          el.GST_Tax_Per_Amt = Number(igstamt).toFixed(2);

          var togstamt = Number(el.GST_Tax_Per_Amt) ? (Number(el.SGST_Amount) + Number(el.CGST_Amount) + Number(el.GST_Tax_Per_Amt)).toFixed(2) : (Number(el.SGST_Amount) + Number(el.CGST_Amount)).toFixed(2);
          el.Taxable = Number(Number(el.Amount_berore_Tax) - Number(el.Dis_Amount)).toFixed(2); //- Number(togstamt)).toFixed(2);
      
          var netamt = Number(Number(el.Taxable)  + Number(togstamt)).toFixed(2);
          el.Net_Amount = Number(el.Delivery_Charge) ? (Number(netamt) + Number(el.Delivery_Charge)).toFixed(2) : Number(netamt).toFixed(2);
          console.log('leftval',leftval)
          console.log('Dis_Amount',el.Dis_Amount)
          this.listofamount();
        }
      }
    }
  })
}
// DAY END CHECK
saveCheck(){
  if(this.FromCostCentId && this.godown_id){
    this.Spinner = true;
    this.ngxService.start();
   const TempObj = {
     Cost_Cen_ID : this.FromCostCentId,
     Godown_Id : this.godown_id
  }
   const obj = {
     "SP_String": "SP_Controller_Master",
     "Report_Name_String": "Check_Day_End",
     "Json_Param_String": JSON.stringify([TempObj])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     if(data[0].Status === "Allow"){
       this.ValidateEntryCheck();
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
       this.cleartotalamount();
       this.clearlistamount();
       this.clearData();
     }
   })
 }


}
ValidateEntryCheck(){
  const obj = {
    "SP_String": "SP_Validate_Entry",
    "Report_Name_String": "Validate Issue",
    "Json_Param_String": this.getDataForSaveEdit()
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Validate Entry ===" , data);
    if(data[0].status === "True") {
      this.saveprintAndUpdate();
    }
    else if(data[0].status === "false"){
      var productDes = data[0].Product_Description;
      var batchn = data[0].Batch_No;
     this.Spinner = false;
     this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Insufficient Stock In",
        detail: productDes   +  ','  +   batchn
      })
    }
  })
}
// CREATE AND UPDATE
saveprintAndUpdate(){
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
  if(this.buttonname != "Hold Bill"){
  if(this.ObjcashForm.Total_Paid - this.ObjcashForm.Refund_Amount != this.Net_Payable){
    this.Spinner = false;
    this.ngxService.stop();
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
  if((!this.ObjcashForm.Credit_To_Ac_ID && this.ObjcashForm.Credit_To_Amount) ||
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
  if(!this.QueryStringObj.Ledger_Name && this.ObjcashForm.Coupon_Per && !this.Objcustomerdetail.Bill_Remarks ||
    !this.QueryStringObj.Ledger_Name && this.ObjcashForm.Credit_To_Ac_ID && !this.Objcustomerdetail.Bill_Remarks){
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
  if( this.ObjcashForm.Credit_To_Amount && Number(this.Dis_Amount) == 0 ){
    this.Spinner = false;
    this.ngxService.stop();
  this.compacctToast.clear();
  this.compacctToast.add({
    key: "compacct-toast",
    severity: "error",
    summary: "Warn Message",
    detail: "Discount Amount is zero"
  });
  return false;
}
 if( Number(this.Total) < 0 ){
   this.Spinner = false;
   this.ngxService.stop();
 this.compacctToast.clear();
 this.compacctToast.add({
   key: "compacct-toast",
   severity: "error",
   summary: "Warn Message",
   detail: "Net Amount is less than zero"
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
    this.Objcustomerdetail.Bill_No = data[0].Column1;
    if(data[0].Column1){
      if (this.FranchiseBill != "Y") {
        this.SaveFranSaleBill();
        this.SaveNPrintBill();
      } else {
        this.compacctToast.clear();
      const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Sale_Bill_ID  " + tempID,
       detail: "Succesfully " + mgs
     });
     this.productSubmit =[];
     this.clearlistamount();
     this.cleartotalamount();
     this.SaveNPrintBill();
     this.clearData();
     this.router.navigate(['./POS_BIll_Order']);
      }
      this.compacctToast.clear();
      const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Sale_Bill_ID  " + tempID,
       detail: "Succesfully " + mgs
     });
    //  this.productSubmit =[];
    //  this.clearlistamount();
    //  this.cleartotalamount();
    //  this.SaveNPrintBill();
    //  this.clearData();
    //  this.router.navigate(['./POS_BIll_Order']);

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
      if (Number(item.Amount_berore_Tax) && Number(item.Amount_berore_Tax) != 0) {
      const obj = {
          Product_ID : item.Product_ID,
          Product_Description : item.Product_Description,
          Product_Modifier : item.Modifier,
          Product_Type : item.product_type,
          Is_Service : item.is_service,
          Rate : item.Net_Price,
          Delivery_Charge : item.Delivery_Charge,
          Batch_No : item.Batch_No,
          Qty : item.Stock_Qty,
          Taxable : item.Amount_berore_Tax,
          Amount : item.Amount,
          Discount_Per : item.Max_Discount,
          Discount_Amt : item.Dis_Amount,
          // Gross_Amt : item.Gross_Amount,
          Gross_Amt : item.Amount_berore_Tax,
          SGST_Per : item.SGST_Per,
          SGST_Amt : item.SGST_Amount,
          CGST_Per : item.CGST_Per,
          CGST_Amt : item.CGST_Amount,
          IGST_Per : item.GST_Tax_Per,
          IGST_Amt : item.GST_Tax_Per_Amt,
          Net_Amount : item.Net_Amount,
          Taxable_Amonut : item.Taxable_Amount,
          CGST_OUTPUT_LEDGER_ID : item.CGST_Output_Ledger_ID,
          SGST_OUTPUT_LEDGER_ID : item.SGST_Output_Ledger_ID,
          IGST_OUTPUT_LEDGER_ID : item.IGST_Output_Ledger_ID,
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
      Adv_Order_No : this.Adv_Order_No != null ? this.Adv_Order_No : "" ,
      Online_Order_No : this.QueryStringObj.Order_No ? this.QueryStringObj.Order_No : null,
      Online_Order_Date : this.QueryStringObj.Order_Date ? this.QueryStringObj.Order_Date : null,

      Total_CGST_Amt : this.CGST_Amount,
      Total_SGST_Amt : this.SGST_Amount,
      Total_IGST_Amt : this.GST_Tax_Per_Amt,
      Bill_Gross_Amt : this.TotalTaxable,
      Total_Taxable : this.TotalTaxable,
      Bill_No : this.Objcustomerdetail.Bill_No,
      Doc_Number : "A",
      Doc_Date : this.DateService.dateConvert(new Date(this.myDate)),
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      Fin_Year_ID : Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID),


    }
    tempArr.push({...obj,...TempObj,...this.Objcustomerdetail,...this.ObjcashForm})
  } else {
    setTimeout(()=>{
    this.Spinner = false;
    this.ngxService.stop();
  this.compacctToast.clear();
  this.compacctToast.add({
     key: "compacct-toast",
    severity: "error",
    summary: "Warn Message",
    detail: "Error in Taxable amount"
  });
  },600)
}
  });
 // console.log("save bill =" , tempArr)
  return JSON.stringify(tempArr);
  }

}
SaveFranSaleBill(){
  let reportname = "";
  if (this.QueryStringObj.Ledger_Name) {
    reportname = "Save_Swiggy_Zomato_POS_Sale_Bill"
  } 
  else {
    reportname = "Save_POS_Sale_Bill"
  }
  const obj = {
    "SP_String" : "SP_POS_Sale_Bill",
    "Report_Name_String" : reportname,
    "Json_Param_String" : this.getDataForSaveEdit()

  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    //console.log(data);
    var tempID = data[0].Column1;
    console.log("After Save",tempID);
   // this.Objproduction.Doc_No = data[0].Column1;
    if(data[0].Column1){
     // this.ngxService.stop();
      this.compacctToast.clear();
      const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
      this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Sale_Bill_ID  " + tempID,
           detail: "Succesfully " + mgs
         });
     this.productSubmit =[];
     this.clearlistamount();
     this.cleartotalamount();
     this.SaveNPrintBill();
     this.clearData();
     this.router.navigate(['./POS_BIll_Order']);
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
  })
}
SaleBillPrint(obj) {
  //console.log("billno ===", true)
  if (obj.Bill_No) {
    window.open("/Report/Crystal_Files/Finance/SaleBill/Sale_Bill_GST_K4C.aspx?Doc_No=" + obj.Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
}

SaveNPrintBill() {
  if (this.Hold_Bill_Flag == false){
  if (this.Objcustomerdetail.Bill_No) {
    window.open("/Report/Crystal_Files/K4C/K4C_Bill_Print.aspx?DocNo=" + this.Objcustomerdetail.Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
  }
  console.log('Doc_No ==', this.Objcustomerdetail.Bill_No)
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
    // this.Objcustomerdetail.Customer_DOB = data[0].Customer_DOB;
    // this.Objcustomerdetail.Customer_Anni= data[0].Customer_Anni;
    this.Objcustomerdetail.Customer_DOB = data[0].Customer_DOB ? this.DateService.dateConvert(data[0].Customer_DOB) : undefined;
    this.Objcustomerdetail.Customer_Anni= data[0].Customer_Anni ? this.DateService.dateConvert(data[0].Customer_Anni) : undefined;
    this.Objcustomerdetail.Customer_GST = data[0].Customer_GST;
    this.Objcustomerdetail.Bill_Remarks = data[0].Bill_Remarks;
    this.Objcustomerdetail.Cuppon_No = data[0].Cuppon_No;
    this.Objcustomerdetail.Cuppon_OTP = data[0].Cuppon_OTP;

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
    //this.QueryStringObj && this.QueryStringObj.Txn_ID
    // if(data[0].Txn_ID){
    //   this.getwalletamount();
    //   // this.ObjcashForm.Wallet_Ac_ID = data[0].Wallet_Ac_ID ? data[0].Wallet_Ac_ID : undefined;
    //   // this.ObjcashForm.Wallet_Ac = data[0].Wallet_Ac ? data[0].Wallet_Ac : undefined;
    //   this.ObjcashForm.Wallet_Amount = data[0].Wallet_Amount ? data[0].Wallet_Amount : "";
    //   this.ObjcashForm.Credit_To_Ac_ID = data[0].Credit_To_Ac_ID ? data[0].Credit_To_Ac_ID : undefined;
    //   this.ObjcashForm.Credit_To_Ac = data[0].Credit_To_Ac ? data[0].Credit_To_Ac : undefined;
    //   this.ObjcashForm.Credit_To_Amount = data[0].Credit_To_Amount ? data[0].Credit_To_Amount : "";
    // } else {
    this.ObjcashForm.Credit_To_Ac_ID = data[0].Credit_To_Ac_ID ? data[0].Credit_To_Ac_ID : undefined;
    this.ObjcashForm.Credit_To_Ac = data[0].Credit_To_Ac ? data[0].Credit_To_Ac : undefined;
    this.ObjcashForm.Credit_To_Amount = data[0].Credit_To_Amount ? data[0].Credit_To_Amount : "";
    this.ObjcashForm.Wallet_Ac_ID = data[0].Wallet_Ac_ID ? data[0].Wallet_Ac_ID : undefined;
    this.ObjcashForm.Wallet_Ac = data[0].Wallet_Ac ? data[0].Wallet_Ac : undefined;
    this.ObjcashForm.Wallet_Amount = data[0].Wallet_Amount ? data[0].Wallet_Amount : "";
    this.ObjcashForm.Cash_Amount = data[0].Cash_Amount ? data[0].Cash_Amount : "";
    this.ObjcashForm.Card_Amount = data[0].Card_Amount ? data[0].Card_Amount : "";
    this.ObjcashForm.Total_Paid = data[0].Total_Paid;
    this.ObjcashForm.Refund_Amount = data[0].Refund_Amount;
    this.ObjcashForm.Due_Amount = data[0].Due_Amount;

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
//BROWSE BILL
PrintBill(obj) {
  if (obj.Bill_No) {
    window.open("/Report/Crystal_Files/K4C/K4C_Bill_Print.aspx?DocNo=" + obj.Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
}

//CANCLE BROWSE ROW
Cancle(row){
  //console.log(this.Objcustomerdetail.Bill_No)
  this.Cancle_Remarks = "";
  this.cancleFormSubmitted = false;
  this.Objcustomerdetail.Bill_No = undefined ;
  if(row.Bill_No){
  this.checkSave = true;
  //this.CanRemarksPoppup = true;
  this.Can_Remarks = true;
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
 onConfirm(){}
 onConfirmCan(valid) {
  this.Can_Remarks = true;
   this.cancleFormSubmitted = true;
  const Tempobj = {
    Doc_No : this.Objcustomerdetail.Bill_No,
    Cancel_Remarks : this.Cancle_Remarks
  }
 // if (this.Objcustomerdetail.Bill_No && this.Cancle_Remarks) {
   if (valid) {
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Cancle Sale Bill",
    "Json_Param_String": JSON.stringify([Tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //console.log(data);
    if(data[0].Column1 === "Cancel Successfully") {
      this.GetSearchedlist();
      this.cancleFormSubmitted = false;
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
  // } else{
  //  // this.compacctToast.clear();
  //   this.compacctToast.add({
  //     key: "compacct-toast",
  //     severity: "error",
  //     summary: "Warn Message",
  //     detail: "Remarks field empty "
  //   });
  }
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
    //this.Del_Cost_Cent_ID = orderno.Del_Cost_Cent_ID,
    this.tabIndexToView = 1;
    this.IsAdvance = true;
     //console.log("this.EditDoc_No ", this.Adv_Order_No );
    this.getadvorderdetails(this.Adv_Order_No);;
    }
  }
getadvorderdetails(Adv_Order_No){
    //console.log('Bill No ===', this.Adv_Order_No)
    const TempObj = {
      Cost_Cen_ID : this.QueryStringObj.Del_Cost_Cent_ID ? this.QueryStringObj.Del_Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Doc_No : this.Adv_Order_No
     }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get Advance Order For POS Bill",
      "Json_Param_String" :  JSON.stringify([TempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.AdvOderDetailList = data;
       console.log('Advance Order Detail ===', data)
       this.Objcustomerdetail.Costomer_Mobile = data[0].Costomer_Mobile;
       this.Objcustomerdetail.Customer_Name= data[0].Customer_Name;
       this.Objcustomerdetail.Customer_DOB = data[0].Customer_DOB ? this.DateService.dateConvert(data[0].Customer_DOB) : undefined;
       this.Objcustomerdetail.Customer_Anni= data[0].Customer_Anni ? this.DateService.dateConvert(data[0].Customer_Anni) : undefined;
       this.Objcustomerdetail.Customer_GST = data[0].Customer_GST;
       this.Objcustomerdetail.Bill_Remarks = data[0].Bill_Remarks;
       this.Objcustomerdetail.Cuppon_No = data[0].Cuppon_No;
       this.Objcustomerdetail.Cuppon_OTP = data[0].Cuppon_OTP;

       data.forEach(element => {
        const  productObj = {
            Product_ID : element.Product_ID,
            Product_Description : element.Product_Description,
            Modifier : element.Product_Modifier,
            Flavour : element.Flavour,
            Finishing : element.Finishing,
            Shape : element.Shape,
            Tier : element.Tier,
            Boxes : element.Boxes,
            Base :  element.Base,
            Changes_on_Cake : element.Changes_on_Cake,
            Order_Taken_By : element.Order_Taken_By,
            Weight_in_Pound : element.Weight_in_Pound,
            Net_Price : Number(element.Adv_Rate),
            Delivery_Charge : Number(element.Delivery_Charge),
            Batch_No : element.Batch_No,
            Stock_Qty :  Number(element.Qty),
            Amount : Number(element.Amount).toFixed(2),
            Amount_berore_Tax : Number(element.Taxable).toFixed(2),
            Max_Discount : Number(element.Discount_Per),
            Dis_Amount : Number(element.Discount_Amt).toFixed(2),
            Taxable : Number(Number(element.Taxable) - Number(element.Discount_Amt)).toFixed(2),
            Gross_Amount : Number(element.Gross_Amt).toFixed(2),
            SGST_Per : Number(element.SGST_Per).toFixed(2),
            SGST_Amount : Number(element.SGST_Amt).toFixed(2),
            CGST_Per : Number(element.CGST_Per).toFixed(2),
            CGST_Amount : Number(element.CGST_Amt).toFixed(2),
            GST_Tax_Per : Number(element.IGST_Per),
            GST_Tax_Per_Amt : element.IGST_Amt,
            GST_Tax_Per_forcalcu : Number(element.IGST_Per).toFixed(2),
            Net_Amount : Number(element.Net_Amount).toFixed(2),
            Taxable_Amount : Number(element.Amount),
            CGST_Output_Ledger_ID : Number(element.CGST_Output_Ledger_ID),
            SGST_Output_Ledger_ID : Number(element.SGST_Output_Ledger_ID),
            IGST_Output_Ledger_ID : Number(element.IGST_Output_Ledger_ID),
            deleteflag : true

          };
          this.productSubmit.push(productObj);
        });
        this.ObjcashForm.Credit_To_Ac_ID = data[0].Credit_To_Ac_ID ? data[0].Credit_To_Ac_ID : undefined;
        this.ObjcashForm.Credit_To_Ac = data[0].Credit_To_Ac;
        this.ObjcashForm.Credit_To_Amount = data[0].Credit_To_Amount ? data[0].Credit_To_Amount : undefined;
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

// ONLINE BILL
  // OnlineEditmaster(billno){
  //   //console.log("editmaster",eROW);
  //     this.clearData();
  //     if(billno.Bill_No){
  //     this.Objcustomerdetail.Bill_No = billno.Bill_No;
  //     this.tabIndexToView = 1;
  //     // this.items = ["BROWSE", "UPDATE"];
  //     // this.buttonname = "Update";
  //      //console.log("this.EditDoc_No ", this.Objcustomerdetail.Bill_No );
  //     this.OnlineGetEditmaster(this.Objcustomerdetail.Bill_No);
  //     //this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
  //     }
  //   }
  //   OnlineGetEditmaster(Bill_No){
  //     //console.log("Doc_No",Bill_No);
  //     this.walletlist = [];
  //     if(this.QueryStringObj && this.QueryStringObj.Txn_ID) {
  //     const obj = {
  //       "SP_String": "SP_Controller_Master",
  //       "Report_Name_String": "Get Outlet Bill Details For Edit",
  //       "Json_Param_String": JSON.stringify([{Doc_No : this.Objcustomerdetail.Bill_No}])

  //     }
  //     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //       this.editList = data;
  //       this.Objcustomerdetail.Costomer_Mobile = data[0].Costomer_Mobile;
  //       this.Objcustomerdetail.Customer_Name= data[0].Customer_Name;
  //       // this.Objcustomerdetail.Customer_DOB = data[0].Customer_DOB;
  //       // this.Objcustomerdetail.Customer_Anni= data[0].Customer_Anni;
  //       this.Objcustomerdetail.Customer_DOB = data[0].Customer_DOB ? this.DateService.dateConvert(data[0].Customer_DOB) : undefined;
  //       this.Objcustomerdetail.Customer_Anni= data[0].Customer_Anni ? this.DateService.dateConvert(data[0].Customer_Anni) : undefined;
  //       this.Objcustomerdetail.Customer_GST = data[0].Customer_GST;
  //       this.Objcustomerdetail.Bill_Remarks = data[0].Bill_Remarks;
  //       this.Objcustomerdetail.Cuppon_No = data[0].Cuppon_No;
  //       this.Objcustomerdetail.Cuppon_OTP = data[0].Cuppon_OTP;

  //       data.forEach(element => {
  //       const  productObj = {
  //           Product_ID : element.Product_ID,
  //           Product_Description : element.Product_Description,
  //           Modifier : element.Product_Modifier,
  //           Net_Price : Number(element.Rate),
  //           Batch_No : element.Batch_No,
  //           Stock_Qty :  Number(element.Qty),
  //           Amount : Number(element.Amount).toFixed(2),
  //           Max_Discount : Number(element.Discount_Per),
  //           Dis_Amount : Number(element.Discount_Amt).toFixed(2),
  //           Gross_Amount : Number(element.Gross_Amt).toFixed(2),
  //           SGST_Per : Number(element.SGST_Per).toFixed(2),
  //           SGST_Amount : Number(element.SGST_Amt).toFixed(2),
  //           CGST_Per : Number(element.CGST_Per).toFixed(2),
  //           CGST_Amount : Number(element.CGST_Amt).toFixed(2),
  //           GST_Tax_Per : Number(element.IGST_Per),
  //           GST_Tax_Per_Amt : element.IGST_Amt,
  //           Net_Amount : Number(element.Net_Amount).toFixed(2)
  //         };

  //         this.productSubmit.push(productObj);
  //       });
  //       this.ObjcashForm.Credit_To_Ac_ID = data[0].Credit_To_Ac_ID ? data[0].Credit_To_Ac_ID : undefined;
  //       this.ObjcashForm.Credit_To_Ac = data[0].Credit_To_Ac ? data[0].Credit_To_Ac : undefined;
  //       this.ObjcashForm.Credit_To_Amount = data[0].Credit_To_Amount ? data[0].Credit_To_Amount : "";
  //       this.ObjcashForm.Wallet_Ac_ID = data[0].Wallet_Ac_ID ? data[0].Wallet_Ac_ID : undefined;
  //       this.ObjcashForm.Wallet_Ac = data[0].Wallet_Ac ? data[0].Wallet_Ac : undefined;
  //       this.ObjcashForm.Wallet_Amount = data[0].Wallet_Amount ? data[0].Wallet_Amount : "";
  //       this.ObjcashForm.Cash_Amount = data[0].Cash_Amount ? data[0].Cash_Amount : "";
  //       this.ObjcashForm.Card_Amount = data[0].Card_Amount ? data[0].Card_Amount : "";
  //       this.ObjcashForm.Total_Paid = data[0].Total_Paid;
  //       this.ObjcashForm.Refund_Amount = data[0].Refund_Amount;
  //       this.ObjcashForm.Due_Amount = data[0].Due_Amount;

  //       this.Objcustomerdetail.Foot_Fall_ID = data[0].Foot_Fall_ID;
  //       this.Objcustomerdetail.Cost_Cen_ID = data[0].Cost_Cen_ID;
  //       //this.ObjaddbillForm.Doc_Date = data[0].Order_Date;
  //       this.Objcustomerdetail.Bill_No = data[0].Bill_No;
  //       this.myDate = data[0].Bill_Date;
  //       this.Total = data[0].Net_Amount;
  //       this.Amount_Payable = data[0].Amount_Payable;
  //       this.Round_Off = data[0].Rounded_Off;

  //       this.CalculateTotalAmt();
  //       this.listofamount();
  //     //console.log("this.editList  ===",data);
  //    //this.myDate =  new Date(data[0].Column1);
  //     // on save use this
  //    // this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));

  //   })
  // }
  //   }

clearData(){
  this.ObjaddbillForm = new addbillForm();
  this.ObjcashForm = new cashForm();
  this.Objcustomerdetail = new customerdetail();
  this.ObjaddbillForm.selectitem = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  //this.ObjaddbillForm.selectitem = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
  if(this.$CompacctAPI.CompacctCookies.User_Type == 'U'){
    this.ObjaddbillForm.Browseroutlet = this.returnedID.length === 1 ? this.returnedID[0].Cost_Cen_ID : undefined;
    }
  this.addbillFormSubmitted = false;
  this.SavePrintFormSubmitted = false;
  this.seachSpinner = false;
  this.Spinner = false;
  this.ngxService.stop();
  this.getbilldate();
  this.Hold_Bill_Flag = false;
}

// REGENERATE BILL FROM ADMIN
dataforregeneratingbill(DocNo){
  this.Regeneratelist = [];
  this.contactname = DocNo.Customer_Name;
  const obj = {
    "SP_String": "SP_POS_Sale_Bill",
    "Report_Name_String": "Refresh POS Bill Data",
    "Json_Param_String": JSON.stringify([{Bill_No : DocNo.Bill_No}])
  }
this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  console.log("From Api",data);
  this.Regeneratelist = data;
  // var Challan_No = data[0].Column1;
  console.log("this.Regeneratelist",this.Regeneratelist);
  if (this.Regeneratelist.length) {
    this.RegenerateBill()
  }
  else {
  // if(data[0].Column1){
  this.compacctToast.clear();
     this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "No data found "
    });
  }
   //console.log("this.Objdispatch",this.productDetails);

 })
}
RegenerateBill(){
      this.Regeneratelist.forEach(item => {
        item['Fin_Year_ID'] = Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      })
      let reportn = "";
      if (this.contactname === "SWIGGY" || this.contactname === "ZOMATO") {
        reportn = "Save_Swiggy_Zomato_POS_Sale_Bill"
      } 
      else {
        reportn = "Save_POS_Sale_Bill"
      }
     const obj = {
       "SP_String": "SP_POS_Sale_Bill",
       "Report_Name_String" : reportn,
       "Json_Param_String": JSON.stringify(this.Regeneratelist)
     }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      //this.FranchiseProductList = data;
     // console.log("this.FranchiseProductList======",this.FranchiseProductList);
      var bill_No = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
           this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Bill No. " + bill_No,
            detail: "Regenerate Bill Succesfully "
          });
          this.contactname = undefined;
          this.GetSearchedlist();
        } else {
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
  // Modifier1 : string;
  // Modifier2 : string;
  // Modifier3 : string;
  // Modifier4 : string;
  // Modifier5 : string;
  Product_Description : string;
  Net_Price : number;
  Sale_rate: number;
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
  Order_Date : Date;
  Ledger_Name : string;
}
class cashForm{
  Coupon_Per : number;
  Credit_To_Ac_ID : any;
  Credit_To_Ac : string;
  Credit_To_Amount : any;
  Wallet_Ac_ID : any;
  Wallet_Ac : string;
  Wallet_Amount : number;
  Cash_Amount : number;
  Card_Amount : number;
  Total_Paid : any;
  Refund_Amount : any;
  Due_Amount : any;
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
  Cuppon_No : string;
  Cuppon_OTP : string;

}


