import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-purchase-bill-from-grn',
  templateUrl: './purchase-bill-from-grn.component.html',
  styleUrls: ['./purchase-bill-from-grn.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PurchaseBillFromGrnComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";
  currentdate = new Date();
  DocDate = new Date();
  CNDate : Date;
  SupplierBillDate : Date;

  VendorList = [];
  maindisabled = false;
  StateList = [];
  CostCenterList = [];
  GRNnoList = [];
  BackupGRNnoList = [];
  GRNFilter = [];
  SelectedGRNno = [];
  
  TGRNnoList = [];
  ProductDetails = [];
  BackUpProductDetails = [];

  PurChallanGRNFormSubmitted = false;
  ObjPurBillChallan = new PurBillChallan();
  // ObjGRN : GRN = new GRN ();
  GRNDate = new Date();
  Supplierlist = [];
  CostCenterlist = [];
  Godownlist = [];
  POorderlist = [];
  PODate : any = new Date();
  podatedisabled = true;
  ProductDetailslist = [];

  GRN2FormSubmitted = false;
  ObjGRN2 : GRN2 = new GRN2();
  Productlist = [];
  productaddSubmit = [];

  Searchedlist = [];
  EditList = [];
  doc_no: any;
  SpinnerShow = false;
  inputBoxDisabled = false;


  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Purchase Bill From Challan",
      Link: " Material Management -> Inward -> Purchase Bill From Challan"
    });
    this.GetVendor();
    this.GetStateList();
    this.GetCostcenter();
    // this.GetCostCenter();
    // this.GetSearchedlist();
    this.ObjPurBillChallan.Currency_ID = 1;
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Save";
     this.Spinner = false;
     this.clearData();
    //  this.ObjGRN1 = new GRN1();
    //  this.GRNFormSubmitted = false;
     this.productaddSubmit = [];
     this.ObjGRN2 = new GRN2;
     this.GRN2FormSubmitted = false;
     this.PODate = new Date();
    //  this.podatedisabled = true;
     this.Spinner = false;
     this.Godownlist = [];
     this.POorderlist = [];
     this.ProductDetailslist = [];
   }
   onReject(){}
   clearData(){
     this.ObjPurBillChallan = new PurBillChallan();
     this.ObjPurBillChallan.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.GetCosCenAddress();
     this.DocDate = new Date();
     this.ObjPurBillChallan.Currency_ID = 1;
     this.GRNnoList = [];
   }
   GetVendor(){
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Bill_From_GRN",
      "Report_Name_String": "Get_Sub_Ledger",
     // "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.VendorList = data;
       if(data.length) {
         data.forEach(element => {
           element['label'] = element.Sub_Ledger_Name,
           element['value'] = element.Sub_Ledger_ID
         });
         this.VendorList = data;
        //  this.backUpproductList = this.Productlist;
        //  this.getproducttype();
       } else {
         this.VendorList = [];

       }
     console.log("vendor list======",this.VendorList);
   });
}
   VenderNameChange(){
     //this.ExpiredProductFLag = false;
   if(this.ObjPurBillChallan.Sub_Ledger_ID) {
    const ctrl = this;
    const vendorObj = $.grep(ctrl.VendorList,function(item: any) {return item.Sub_Ledger_ID == ctrl.ObjPurBillChallan.Sub_Ledger_ID})[0];
    console.log(vendorObj);
    this.ObjPurBillChallan.Sub_Ledger_Billing_Name = vendorObj.Billing_Name;
    this.GetGRNnoList();
   }
   }
   GetChooseAddress(){
    //this.ExpiredProductFLag = false;
  if(this.ObjPurBillChallan.Sub_Ledger_ID) {
    if(this.ObjPurBillChallan.Sub_Ledger_Address_1) {
   const ctrl = this;
   const MainObj = $.grep(ctrl.VendorList,function(item: any) {return item.Sub_Ledger_ID == ctrl.ObjPurBillChallan.Sub_Ledger_ID})[0];
   console.log(MainObj);
   this.maindisabled = true;
   this.ObjPurBillChallan.Sub_Ledger_State = MainObj.State;
   this.ObjPurBillChallan.Sub_Ledger_GST_No = MainObj.GST;
   this.ObjPurBillChallan.Sub_Ledger_Address_2 = MainObj.Address_1 +','+ MainObj.Address_2 +','+ MainObj.Address_3;
   this.ObjPurBillChallan.Sub_Ledger_Land_Mark = MainObj.Land_Mark;
   this.ObjPurBillChallan.Sub_Ledger_Pin = MainObj.Pin;
   this.ObjPurBillChallan.Sub_Ledger_District = MainObj.District;
   this.ObjPurBillChallan.Sub_Ledger_Country = MainObj.Country;
   this.ObjPurBillChallan.Sub_Ledger_Email = MainObj.Email;
   this.ObjPurBillChallan.Sub_Ledger_Mobile_No = MainObj.Mobile_No;
   this.ObjPurBillChallan.Sub_Ledger_PAN_No = MainObj.PAN_No;
   this.ObjPurBillChallan.Sub_Ledger_CIN_No = MainObj.CIN;
  }
  else {
    this.maindisabled = false;
  }
  }
  }
   GetStateList() {
    this.$http
      .get("/Common/Get_State_List")
      .subscribe((data: any) => {
        // this.StateList = data ? JSON.parse(data) : [];
        this.StateList = data;
        console.log('StateList',this.StateList)
      });
  }
  GetCostcenter(){
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Bill_From_GRN",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("costcenterList  ===",data);
      this.CostCenterList = data;
      // this.ObjPurBillChallan.Cost_Cen_ID = this.CostCenterList.length === 1 ? this.CostCenterList[0].Cost_Cen_ID : undefined;
      this.ObjPurBillChallan.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.GetCosCenAddress();
      })
  }
  GetCosCenAddress(){
    //this.ExpiredProductFLag = false;
    if(this.ObjPurBillChallan.Cost_Cen_ID) {
   const ctrl = this;
   const costcenObj = $.grep(ctrl.CostCenterList,function(item: any) {return item.Cost_Cen_ID == ctrl.ObjPurBillChallan.Cost_Cen_ID})[0];
   console.log(costcenObj);
   this.ObjPurBillChallan.Cost_Cen_Address1 = costcenObj.Address1;
   this.ObjPurBillChallan.Cost_Cen_Address2 = costcenObj.Address2;
   this.ObjPurBillChallan.Cost_Cen_State = costcenObj.State;
   this.ObjPurBillChallan.Cost_Cen_GST_No = costcenObj.GST_No;
   this.ObjPurBillChallan.Cost_Cen_Location = costcenObj.Location;
   this.ObjPurBillChallan.Cost_Cen_PIN = costcenObj.PIN;
   this.ObjPurBillChallan.Cost_Cen_District = costcenObj.District;
   this.ObjPurBillChallan.Cost_Cen_Country = costcenObj.Country;
   this.ObjPurBillChallan.Cost_Cen_Mobile = costcenObj.Mobile;
   this.ObjPurBillChallan.Cost_Cen_Phone = costcenObj.Phone;
   this.ObjPurBillChallan.Cost_Cen_Email = costcenObj.Email1;
  }
  }
  GetGRNnoList(){
     const TempObj = {
      //  Req_Date : this.DateService.dateConvert(new Date(this.ReqDate)),
       Sub_Ledger_ID : this.ObjPurBillChallan.Sub_Ledger_ID,
      }
    const obj = {
     "SP_String": "SP_BL_Txn_Purchase_Bill_From_GRN",
     "Report_Name_String" : "Get_Purchase_Challan_GRN_Nos",
    "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.GRNnoList = data;
       this.BackupGRNnoList = data;
    console.log("this.GRNnoList======",this.GRNnoList);
    this.GetGRNno();
   })
   }
   GetGRNno(){
     let DGRN = [];
     this.GRNFilter = [];
     this.SelectedGRNno = [];
     this.BackupGRNnoList.forEach((item) => {
       if (DGRN.indexOf(item.GRN_No) === -1) {
        DGRN.push(item.GRN_No);
         this.GRNFilter.push({ label: item.GRN_No + '(' + this.DateService.dateConvert(new Date(item.GRN_Date)) + ')' , value: item.GRN_No });
         console.log("this.GRNFilter", this.GRNFilter);
       }
     });
     this.BackupGRNnoList = [...this.GRNnoList];
   }
   filterGRNnoList() {
     //console.log("SelectedTimeRange", this.SelectedTimeRange);
     let DGRN = [];
     this.TGRNnoList = [];
     //const temparr = this.ProductionlList.filter((item)=> item.Qty);
     if (!this.EditList.length){
      this.BackUpProductDetails =[];
      this.ProductDetails = [];
      this.GetProductdetails();
      }
      // if(this.editIndentList.length){
      //   this.BackUpproductDetails =[];
      // this.productDetails = [];
      //   this.GetProductionproforEdit();
      //   }
    //  this.productDetails = [];
    //  this.GetshowProduct(true,true);
     if (this.SelectedGRNno.length) {
       this.TGRNnoList.push('Req_No');
       DGRN = this.SelectedGRNno;
     }
     if(this.EditList.length) {
      this.ProductDetails = [];
      if (this.TGRNnoList.length) {
        let LeadArr = this.BackUpProductDetails.filter(function (e) {
          return (DGRN.length ? DGRN.includes(e['GRN_No']) : true)
        });
        this.ProductDetails = LeadArr.length ? LeadArr : [];
      } else {
        this.ProductDetails = [...this.BackUpProductDetails];
        console.log("else Get GRN list", this.TGRNnoList)
      }
    }

   }
   dataforProductDetails(){
    if(this.SelectedGRNno.length) {
      let Arr =[]
      this.SelectedGRNno.forEach(el => {
        if(el){
          const Dobj = {
            Doc_No : el,
            // Doc_Date : this.DateService.dateConvert(new Date(this.ChallanDate))
            }
           Arr.push(Dobj)
        }

    });
      console.log("Table Data ===", Arr)
      return Arr.length ? JSON.stringify(Arr) : [];
    }
  }
   GetProductdetails(){
    // if(this.dataforShowproduct()){
      //this.SpinnerShow = true;
      // const tempObj = {
      //   Outlet_ID: Number(this.Objdispatch.Cost_Cen_ID),
      //   Dispatch_Outlet_ID: Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID),
      //   Dispatch_Godown_ID: Number(this.Objdispatch.From_Godown_ID),
      //   Challan_Date : this.DateService.dateConvert(new Date(this.ChallanDate)),
      //   Indent_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      // }
      const obj = {
        "SP_String": "SP_BL_Txn_Purchase_Bill_From_GRN",
        "Report_Name_String": "Get_product_Details",
        "Json_Param_String": this.dataforProductDetails()
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ProductDetails = data;
        //this.SpinnerShow = false;
        this.BackUpProductDetails = [...this.ProductDetails];
        console.log("this.ProductDetails",this.ProductDetails);
        // this.inputBoxDisabled = true;
        // this.indentdateDisabled = false;
        // this.From_Godown_ID_Dis = true;
        // this.To_Godown_ID_Dis = true;
  
        //this.clearData();
      })
    // }
  
  }
  DiscChange(obj){
    if(!obj.Discount_Type){
      obj.Discount = 0
    } 
    else {
      obj.Discount = undefined;
    }
  }
  AfterDiscCalChange(colobj){
    if (colobj.Discount) {
    if(colobj.Discount_Type == "%") {
      colobj.Discount_Type_Amount = Number((Number(colobj.Total_Amount) * Number(colobj.Discount)) / 100).toFixed(2);
    }
    if(colobj.Discount_Type == "AMT") {
      colobj.Discount_Type_Amount = Number(colobj.Discount);
    }
    colobj.Taxable_Amount = Number(Number(colobj.Total_Amount) - Number(colobj.Discount_Type_Amount)).toFixed(2);
    }
  }
  // listofamount(){
  //   this.Amount = undefined;
  //   let count = 0;
  //   this.Dis_Amount = undefined;
  //   let count1 = 0;
  //   this.Gross_Amount = undefined;
  //   let count2 = 0;
  //   this.SGST_Amount = undefined;
  //   let count3 = 0;
  //   this.CGST_Amount = undefined;
  //   let count4 = 0;
  //   this.GST_Tax_Per_Amt = undefined;
  //   let count5 = 0;
  //   this.TotalTaxable = undefined;
  //   let count6 = 0;
  //   this.withoutdisamt = undefined;
  //   let count7 = 0;
  //   this.taxb4disamt = undefined;
  //   let count8 = 0;
  
  
  //   this.productSubmit.forEach(item => {
  //     count = count + Number(item.Amount);
  //     if (item.product_type != "PACKAGING") {
  //       if (item.is_service != true) {
  //          count7 = count7 + Number(item.Amount);
  //          count8 = count8 + Number(item.Amount_berore_Tax);
  //       }
  //     }
  //     count1 = count1 + Number(item.Dis_Amount);
  //     //count2 = count2 + Number(item.Gross_Amount);
  //     // count2 = count2 + Number(item.Taxable - item.Dis_Amount);
  //     count3 = count3 + Number(item.SGST_Amount);
  //     count4 = count4 + Number(item.CGST_Amount);
  //     count5 = count5 + Number(item.GST_Tax_Per_Amt);
  //     count6 = count6 + Number(item.Taxable);
  //   });
  //   this.Amount = (count).toFixed(2);
  //   this.withoutdisamt = (count7).toFixed(2);
  //   this.taxb4disamt = (count8).toFixed(2);
  //   this.Dis_Amount = (count1).toFixed(2);
  //   this.TotalTaxable = (count6).toFixed(3);
  //   this.Gross_Amount = (count8).toFixed(2);
  //   //this.Gross_Amount = (count2).toFixed(2);
  //   //this.Gross_Amount = (Number(this.TotalTaxable) - Number(this.Dis_Amount)).toFixed(2);
  //   this.SGST_Amount = (count3).toFixed(2);
  //   this.CGST_Amount = (count4).toFixed(2);
  //   this.GST_Tax_Per_Amt = (count5).toFixed(2);
  //   //console.log(this.Gross_Amount);
  // }
  // clearlistamount(){
  //   this.Amount = [];
  //   this.withoutdisamt = [];
  //   this.taxb4disamt = [];
  //   this.Dis_Amount = [];
  //   this.Gross_Amount = [];
  //   this.SGST_Amount = [];
  //   this.CGST_Amount = [];
  //   this.GST_Tax_Per_Amt = [];
  //   this.TotalTaxable = [];
  // }
   GetGodown(){}
   SaveGRN(){}
   
   GetIndentList(){}

}
class PurBillChallan {
  Sub_Ledger_ID : any;
  Sub_Ledger_Billing_Name : string;
  Sub_Ledger_Address_1 : string;
  Sub_Ledger_State : any;
  Sub_Ledger_GST_No : any;
  Sub_Ledger_Address_2 : string;
  Sub_Ledger_Land_Mark : string;
  Sub_Ledger_Pin : any;
  Sub_Ledger_District : string;
  Sub_Ledger_Country : string;
  Sub_Ledger_Email : any;
  Sub_Ledger_Mobile_No : number;
  Sub_Ledger_PAN_No : any;
  Sub_Ledger_CIN_No : any;

  Cost_Cen_ID : any;
  Cost_Cen_Address1 : string;
  Cost_Cen_Address2 : string;
  Cost_Cen_State : string;
  Cost_Cen_GST_No : any;
  Cost_Cen_Location : string;
  Cost_Cen_PIN : any;
  Cost_Cen_District : string;
  Cost_Cen_Country : string;
  Cost_Cen_Mobile : number;
  Cost_Cen_Phone : number;
  Cost_Cen_Email : any;

  Doc_Date : any;
  Project_ID : number;
  CN_No : any;
  CN_Date : any;
  Currency_ID : number;
  Currency_Symbol : any;
  Revenue_Cost_Cent_ID : number;
  Supplier_Bill_No : any;
  Supplier_Bill_Date : any;

  Term_Name : any;
  HSN_No : any;
  Term_Amount : number;

  Product_ID : any;
  Product_Details : string;
  Rate : any;
  GST_Tax_Per : any;
  HSN_Code : any;
  Unit : string;
  Challan_Qty : any;
  Received_Qty : any;
  Rejected_Qty : any;
  Accepted_Qty : any;
 }
 class GRN2 {
  Quantity_Remarks : string;
  Quality_Rejection_Remarks : string;
  Deduction_For_Rejection : string;
  Created_By : string;
 }
 class Browse {
  Doc_No : any;
  start_date : Date ;
  end_date : Date;
}
