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
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class GrnComponent implements OnInit {
  items:any = [];
  menuList:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";
  CurrentDate = new Date();

  GRNFormSubmitted = false;
  ObjGRN1 : GRN1 = new GRN1();
  ObjGRN : GRN = new GRN ();
  GRNDate = new Date();
  Supplierlist:any = [];
  CostCenterlist:any = [];
  Godownlist:any = [];
  RDBNolist:any = [];
  PODate : any = new Date();
  podatedisabled = true;
  ProductDetailslist:any = [];

  GRN2FormSubmitted = false;
  ObjGRN2 : GRN2 = new GRN2();
  Productlist:any = [];
  productaddSubmit:any = [];

  Searchedlist:any = [];
  EditList:any = [];
  doc_no: any;
  SENo:string = "-"
  INVNo:string = "-"
  disabledflaguom = false;
  disabledflaghsn = false;
  
  companyList:any = [];
  ObjBrowse : Browse = new Browse ();
  GRNSearchFormSubmitted = false;
  SE_No_Date: Date;
  INV_No_Date: Date;

  ObjPendingRDB = new PendingRDB();
  PendingRDBFormSubmitted = false;
  PendingRDBList:any = [];
  DynamicHeaderforPRDB:any = [];
  deleteError = false;
  Save = false;
  Del = false;
  
  initDate:any = [];
  hrYeatList:any = [];
  HR_Year_ID:any;
  dataforcretegrn: any;
  DocNo: undefined;
  editlist:any = [];
  DiscountAmount: any;
  RegisterSpinner = false;
  ObjGRNRegister = new GRNRegister();
  FreightPFPerc: any;

  ObjPendRDBProWise = new PendRDBProWise();
  PendRDBProWiseFormSubmitted = false;
  PendRDBProWiseList:any = [];
  DynamicHeaderforPRDBProWise:any = [];
  ObjTerm:Term = new Term()
  TermList:any = [];
  TermFormSubmitted = false;
  AddTermList:any = [];
  termeditlist:any = [];
  addPurchaseListInput:boolean = false;

  grTotal:any = 0
  disTotal:any = 0
  ExciTotal:any = 0
  taxAblTotal:any = 0
  GSTTotal:any = 0
  NetTotal:any = 0;
  disAmtBackUpAMT:number = 0
  disAmtBackUpPer:number = 0
  GrTermAmount:number = 0
  GrGstTermAmt:number = 0
  grNetTerm: number = 0
  TCSTaxRequiredValidation = false;
  TCSdataList:any = [];


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
    this.items = ["BROWSE", "CREATE", "PENDING RDB", "PENDING RDB PRODUCT WISE", "GRN REGISTER"];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ]; 
    this.Header.pushHeader({
      Header: "GRN",
      Link: " Material Management -> Inward -> GRN"
    });
    this.Finyear();
    this.GetSupplier();
    this.GetCostCenter();
    // this.GetSearchedlist(true);
    this.getcompany();
    this.GettermAmt();
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE", "PENDING RDB", "PENDING RDB PRODUCT WISE", "GRN REGISTER"];
     this.buttonname = "Save";
     this.Spinner = false;
    //  this.clearData();
     this.ObjGRN1 = new GRN1();
     this.GRNFormSubmitted = false;
     this.TCSTaxRequiredValidation = false;
     this.productaddSubmit = [];
     this.ObjGRN2 = new GRN2;
     this.GRN2FormSubmitted = false;
     this.PODate = new Date();
     this.GRNDate = new Date();
     this.podatedisabled = true;
     this.Spinner = false;
     this.Godownlist = [];
     this.RDBNolist = [];
     this.ProductDetailslist = [];
     this.disabledflaguom = false;
     this.disabledflaghsn = false;
     this.ObjGRN = new GRN;
     this.SENo = "";
     this.INVNo = "";
     this.ObjGRN1.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjGRN1.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.GetGodown();
     this.deleteError = false;
     this.SENo = undefined;
     this.INVNo = undefined;
     this.SE_No_Date = undefined;
     this.INV_No_Date = undefined;
     this.ObjTerm = new Term();
     this.AddTermList = [];
     this.grTotal = 0;
       this.taxAblTotal = 0;
       this.disTotal = 0;
       this.ExciTotal = 0;
       this.ExciTotal = 0;
       this.GSTTotal = 0;
       this.NetTotal = 0;
       this.GrTermAmount = 0
       this.GrGstTermAmt = 0
       this.grNetTerm = 0
     this.addPurchaseListInput = false;
     this.DocNo = undefined;
   }
   clearData(){
   this.Spinner = false;
   //  this.clearData();
    this.ObjGRN1 = new GRN1();
    this.GRNFormSubmitted = false;
    this.TCSTaxRequiredValidation = false;
    this.productaddSubmit = [];
    this.ObjGRN2 = new GRN2;
    this.GRN2FormSubmitted = false;
    this.PODate = new Date();
    // this.GRNDate = new Date();
    this.podatedisabled = true;
    this.Spinner = false;
    this.Godownlist = [];
    this.RDBNolist = [];
    this.ProductDetailslist = [];
    this.disabledflaguom = false;
    this.disabledflaghsn = false;
    this.ObjGRN = new GRN;
    this.SENo = "";
    this.INVNo = "";
    this.ObjGRN1.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    this.ObjGRN1.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.GetGodown();
    this.deleteError = false;
    this.grTotal = 0;
    this.taxAblTotal = 0;
    this.disTotal = 0;
    this.ExciTotal = 0;
    this.ExciTotal = 0;
    this.GSTTotal = 0;
    this.NetTotal = 0;
    this.GrTermAmount = 0
    this.GrGstTermAmt = 0
    this.grNetTerm = 0
    this.SENo = undefined;
    this.INVNo = undefined;
    this.SE_No_Date = undefined;
    this.INV_No_Date = undefined;
   }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
      // this.voucherminDate = new Date(data[0].Fin_Year_Start);
      // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }
   getcompany(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Dropdown_Company",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.companyList = data
     console.log("companyList",this.companyList)
     this.ObjGRN1.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjPendingRDB.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjPendRDBProWise.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    })
  }
   GetSupplier(){
      this.Supplierlist = [];
      const obj = {
        "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
        "Report_Name_String": "Get_Sub_Ledger"

     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
          data.forEach(element => {
            element['label'] = element.Sub_Ledger_Name,
            element['value'] = element.Sub_Ledger_ID
          });
         this.Supplierlist = data;
       console.log("Supplierlist======",this.Supplierlist);
        }
         else {
          this.Supplierlist = [];
  
        }
     });
   }
   GetCostCenter(){
    this.CostCenterlist = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Get_Cost_Center"

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.CostCenterlist = data;
     console.log("CostCenterlist======",this.CostCenterlist);
     this.ObjGRN1.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.GetGodown();
   });
 }
 GetGodown(editcostgodown?){
  this.Godownlist = [];
  const obj = {
    "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
    "Report_Name_String": "Get_Cost_Center_Godown",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.ObjGRN1.Cost_Cen_ID}])

 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Godownlist = data;
   console.log("Godownlist======",this.Godownlist);
   if(editcostgodown){
    this.ObjGRN1.godown_id = editcostgodown;
  }
  else{
    this.ObjGRN1.godown_id = this.Godownlist.length ? this.Godownlist[0].godown_id : undefined;
  }
 });
}
   GetRDBNo(){
    this.RDBNolist = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Get_Pending_RDB_Nos",
      "Json_Param_String": JSON.stringify([{Sub_Ledger_ID : this.ObjGRN1.Sub_Ledger_ID}])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.RDBNolist = data;
     console.log("RDBNolist======",this.RDBNolist);
   });
  }

  GetProductDetails(){
     this.ProductDetailslist = [];
    this.ObjGRN.Rate = undefined;
    this.ObjGRN.Product_Details = undefined;
    this.ObjGRN.GST_Tax_Per = undefined;
    this.SENo = "-"
    this.INVNo = "-"
    this.ObjGRN = new GRN();
    if(this.ObjGRN1.RDB_No) {
    const postobj = {
      Doc_No : this.ObjGRN1.RDB_No
    }
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Get_product_Details",
      "Json_Param_String": JSON.stringify([postobj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ProductDetailslist = data;
     console.log("RDBNolist======",this.ProductDetailslist);
     this.SE_No_Date = new Date(data[0].SE_Date);
     this.INV_No_Date = new Date(data[0].Inv_Date);
     this.ObjGRN1.Mode_Of_transport = data[0].Mode_Of_transport;
     this.ObjGRN1.LR_No_Date = data[0].LR_No_Date;
     this.ObjGRN1.Vehicle_No = data[0].Vehicle_No;
    //  this.ObjGRN.Challan_Qty = data[0].Challan_Qty;
    //  this.ObjGRN.Received_Qty = data[0].Received_Qty;
     this.SENo = data[0].SE_No+" & "
     this.ObjGRN1.SE_No_Date = this.SENo + this.DateService.dateConvert(this.SE_No_Date);
     this.INVNo = data[0].Inv_No+" & "
     this.ObjGRN1.INV_No_Date = this.INVNo + this.DateService.dateConvert(this.INV_No_Date);

     this.GetPODate();
   });
  }
 }
 GetRate(){

  console.log(this.ObjGRN.Rate)
  this.disabledflaguom = false;
  this.disabledflaghsn = false;
  this.FreightPFPerc = undefined;
  this.DiscountAmount = undefined;
  if(this.ObjGRN.Product_ID) {
    const ctrl = this;
    const RateObj = $.grep(ctrl.ProductDetailslist,function(item: any) {return item.Product_ID == ctrl.ObjGRN.Product_ID})[0];
    console.log(RateObj);
    this.ObjGRN.Rate = RateObj.Rate;
    this.ObjGRN.Product_Details = RateObj.Product_Description;
    this.ObjGRN.GST_Tax_Per = RateObj.GST_Tax_Per;
    this.ObjGRN.Unit = RateObj.UOM,
    this.ObjGRN.HSN_Code = RateObj.HSN_Code
    this.ObjGRN.Challan_Qty = RateObj.Challan_Qty;
    this.ObjGRN.Received_Qty = RateObj.Received_Qty;
    this.FreightPFPerc = RateObj.Freight_PF_Perc;
    this.DiscountAmount = RateObj.Discount_Amount;
    if(RateObj.UOM) {
    this.disabledflaguom = true;
    }
    if(RateObj.HSN_Code) {
      this.disabledflaghsn = true;
      }
   }
}
 GetPODate(){
  this.ObjGRN1.RDB_Date = undefined;
  this.podatedisabled = true;
  if(this.ObjGRN1.RDB_No) {
    const ctrl = this;
    const DateObj = $.grep(ctrl.RDBNolist,function(item: any) {return item.RDB_No == ctrl.ObjGRN1.RDB_No})[0];
    console.log(DateObj);
    this.ObjGRN1.RDB_Date = new Date(DateObj.RDB_Date);
    this.PODate = new Date(this.ObjGRN1.RDB_Date);
    this.podatedisabled = false;
   }
   else {
     this.PODate = new Date();
     this.podatedisabled = true;
   }
}
 RecQtyValidation(){
   if (Number(this.ObjGRN.Received_Qty) && Number(this.ObjGRN.Received_Qty) > Number(this.ObjGRN.Challan_Qty)){
    // this.ngxService.stop();
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Received Qty is more than Challan Qty "
  });
  return false;
   }
   this.Calculate();
 }
 Calculate() {
  //this.ExpiredProductFLag = false;
 if(Number(this.ObjGRN.Challan_Qty) && Number(this.ObjGRN.Accepted_Qty)) {
  //  this.ObjGRN.Rejected_Qty = Number(Number(this.ObjGRN.Received_Qty) - Number(this.ObjGRN.Accepted_Qty)).toFixed(2);
   this.ObjGRN.Rejected_Qty = Number(Number(this.ObjGRN.Challan_Qty) - Number(this.ObjGRN.Accepted_Qty)).toFixed(2);
  //  this.ObjGRN.Accepted = Number(Number(this.ObjGRN.Challan) - Number(this.ObjGRN.Rejected)).toFixed(2);
  }
  else {
    this.ObjGRN.Rejected_Qty = 0;
  }
  }
  
  Add(valid){
    this.GRNFormSubmitted = true;
    if(valid){
      if (new Date(this.GRNDate).toISOString() >= new Date(this.PODate).toISOString()) {
      if (Number(this.ObjGRN.Received_Qty) && Number(this.ObjGRN.Received_Qty) <= Number(this.ObjGRN.Challan_Qty)){
        if (Number(this.ObjGRN.Rejected_Qty) >= 0) {
        // var FreightPFPerc = this.FreightPFPerc ? this.FreightPFPerc : 0;
        var FreightPFPerc = 0;
        var apidiscountamt = this.DiscountAmount;
        var qtydis = Number(apidiscountamt / this.ObjGRN.Received_Qty).toFixed(2);
        // var discountamt = Number(Number(qtydis) * this.ObjGRN.Accepted_Qty).toFixed(2);
        // var amount = Number(this.ObjGRN.Accepted_Qty * this.ObjGRN.Rate).toFixed(2);
        // var qtydis = Number(apidiscountamt / this.ObjGRN.Challan_Qty).toFixed(2);
        var discountamt = Number(Number(qtydis) * this.ObjGRN.Challan_Qty).toFixed(2);
      var amount = Number(this.ObjGRN.Challan_Qty * this.ObjGRN.Rate).toFixed(2);
      var FreightPFCharges = (Number(amount) * (Number(FreightPFPerc) / 100)).toFixed(2);
      var amtwithfreightcharges = (Number(amount) + Number(FreightPFCharges)).toFixed(2);
      var taxable = Number(amtwithfreightcharges) - Number(discountamt);
      // var taxablevalue = Number((Number(amount) * 100) / Number(this.ObjGRN1.GST_Tax_Per) + 100).toFixed(2);
      var taxsgstcgst =  (Number(Number(taxable) * Number(this.ObjGRN.GST_Tax_Per)) / 100).toFixed(2);
      var totalamount = (Number(taxable) + Number(taxsgstcgst)).toFixed(2);
      // var PT = this.producttypelist.filter((el) => el.Product_Type_ID == this.ObjMPtype.Product_Type)[0];
      var productObj = {
      //Product_Type_ID : this.ObjPurchasePlan.Product_Type_ID,
    // Product_Type : this.ObjPurchasePlan.product_type,
      Product_ID : this.ObjGRN.Product_ID,
      Product_Details : this.ObjGRN.Product_Details,
      HSN_Code : this.ObjGRN.HSN_Code,
      Unit : this.ObjGRN.Unit,
      Challan : this.ObjGRN.Challan_Qty,
      Received : this.ObjGRN.Received_Qty,
      Rejected : this.ObjGRN.Rejected_Qty,
      Accepted : this.ObjGRN.Accepted_Qty,
      // Rate : this.DateService.dateConvert(new Date(this.LastPurDate)),
      Rate : this.ObjGRN.Rate,
      Freight_PF_Perc : Number(FreightPFPerc).toFixed(2),
      Freight_PF_Charges : Number(FreightPFCharges).toFixed(2),
      Discount_Amount : Number(discountamt).toFixed(2),
      Taxable_Value : Number(taxable).toFixed(2),
      GST_Tax_Per : Number(this.ObjGRN.GST_Tax_Per),
      //Last_Purchase_With_GST : Number(lastpurchaseGST),
      Tax :  Number(taxsgstcgst).toFixed(2),
      Total_Amount : Number(totalamount).toFixed(2)
    };
    // this.productaddSubmit.push(productObj);
    // console.log("Product Submit",this.productaddSubmit);
    // this.GRNFormSubmitted = false;
    // // this.clearData();
    // this.ObjGRN = new GRN();
    // this.ObjGRN.Rate = undefined;
    // this.ObjGRN.Product_Details = undefined;
    // this.ObjGRN.GST_Tax_Per = undefined;
    // this.disabledflaguom = false;
    // this.disabledflaghsn = false;
    //this.localpurchaseFLag = false;
    if(this.productaddSubmit.length && this.addPurchaseListInput){
      this.productaddSubmit.forEach((xz:any,i) => {
        // console.log(i)
        if(xz.Product_ID == this.ObjGRN.Product_ID){
          const productFilter = this.ProductDetailslist.filter(el=> Number(el.Product_ID) === Number(this.ObjGRN.Product_ID))[0];
          // this.addPurchaseList[i] = {...this.objaddPurchacse}
          this.productaddSubmit[i].Product_ID =  Number(this.ObjGRN.Product_ID)
          this.productaddSubmit[i].Product_Name = this.ObjGRN.Product_Details
          this.productaddSubmit[i].Unit = this.ObjGRN.Unit
          this.productaddSubmit[i].HSN_Code = this.ObjGRN.HSN_Code
          // this.productaddSubmit[i].Rate = Number(productFilter.Rate),
          this.productaddSubmit[i].Challan  = Number(this.ObjGRN.Challan_Qty)
          this.productaddSubmit[i].Received = Number(this.ObjGRN.Received_Qty)
          this.productaddSubmit[i].Accepted  = Number(this.ObjGRN.Accepted_Qty)
          this.productaddSubmit[i].Rejected = Number(this.ObjGRN.Rejected_Qty)
          this.productaddSubmit[i].Discount_Amount = Number(discountamt).toFixed(2)
          this.productaddSubmit[i].Taxable_Value = Number(taxable).toFixed(2)
          this.productaddSubmit[i].GST_Tax_Per = Number(this.ObjGRN.GST_Tax_Per)
          this.productaddSubmit[i].Tax = Number(taxsgstcgst).toFixed(2)
          this.productaddSubmit[i].Total_Amount = Number(totalamount).toFixed(2)
        }
       });
       console.log("Product Update",this.productaddSubmit);
       this.addClear()
     }
     else{
      this.productaddSubmit.push(productObj);
      console.log("Product Submit",this.productaddSubmit);
      this.GRNFormSubmitted = false;
      this.ObjGRN = new GRN();
      this.ObjGRN.Rate = undefined;
      this.ObjGRN.Product_Details = undefined;
      this.ObjGRN.GST_Tax_Per = undefined;
      this.disabledflaguom = false;
      this.disabledflaghsn = false;
      this.addClear()
     }
        }
         else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Rejected Qty is less than Zero "
          });
         }
        }
      else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Received Qty is more than Challan Qty "
        });
      }
    }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "RDB Date can't be greater than GRN Date "
      });
    }
   }
   }
    // Edit Add RDB 
  EditAdd(inx:any){
    this.ProductDetailslist = [];
    // console.log(this.addPurchaseList[inx])
    // this.objaddPurchacse.Req_No = this.addPurchaseList[inx].Req_No
    // this.addPurchaseListInputField = this.addPurchaseList[inx]
    // setTimeout(() => {
      // this.getProductDetails(this.ObjRdb.PO_Doc_No)
    // }, 300);
    setTimeout(() => {
             this.ProductDetailslist.push({
               Product_ID : this.productaddSubmit[inx].Product_ID,
               Product_Description : this.productaddSubmit[inx].Product_Details,
              //  Rate : this.productaddSubmit[inx].Rate,
              //  Discount_Amount : Number(this.productaddSubmit[inx].PO_Discount_Amount),
              //  GST_Percentage : this.productaddSubmit[inx].Tax_Percentage
             });
    }, 300);
     this.ObjGRN.Product_ID = this.productaddSubmit[inx].Product_ID
    //  this.objaddPurchacse = {...this.addPurchaseList[inx]}
     this.ObjGRN.Unit = this.productaddSubmit[inx].Unit;
     this.ObjGRN.Rate = Number(this.productaddSubmit[inx].Rate);
     this.DiscountAmount = Number(this.productaddSubmit[inx].RDB_Discount_Amount);
     this.ObjGRN.GST_Tax_Per = Number(this.productaddSubmit[inx].GST_Tax_Per);
     this.ObjGRN.HSN_Code = this.productaddSubmit[inx].HSN_Code;
     this.addPurchaseListInput = true;
     this.ObjGRN.Challan_Qty =  this.productaddSubmit[inx].Challan;
     this.ObjGRN.Received_Qty = this.productaddSubmit[inx].Received;
     this.ObjGRN.Accepted_Qty =  this.productaddSubmit[inx].Accepted;
     this.ObjGRN.Rejected_Qty = this.productaddSubmit[inx].Rejected;
  
  }
  addClear(){
        this.ObjGRN = new GRN();
        this.GRNFormSubmitted = false;
        this.TCSTaxRequiredValidation = false;
        if(this.buttonname === "Update") {
        this.ProductDetailslist = [];
        }
        this.addPurchaseListInput = false
        // this.addPurchaseListInputField = {}
        // console.log("addPurchaseList",this.addPurchaseList);
      this.getAllTotal();
      this.TcsAmtCalculation();
  }
   delete(index) {
    this.productaddSubmit.splice(index,1);
    this.getAllTotal();
    this.TcsAmtCalculation();
    this.ObjGRN1.TCS_Y_N = this.productaddSubmit.length == 0 ? undefined : this.ObjGRN1.TCS_Y_N;
    this.ObjGRN1.TCS_Per = this.productaddSubmit.length == 0 ? undefined : this.ObjGRN1.TCS_Per;

  }
  DataForSaveProduct(){
    // console.log(this.DateService.dateConvert(new Date(this.myDate)))
     this.ObjGRN1.GRN_Date = this.DateService.dateConvert(new Date(this.GRNDate));
     this.ObjGRN1.RDB_Date = this.DateService.dateConvert(new Date(this.PODate));
     this.ObjGRN2.Created_By = this.$CompacctAPI.CompacctCookies.User_ID;
     this.ObjGRN1.Product_Gross = this.getTofix(this.grTotal);
     this.ObjGRN1.Product_Discount = this.getTofix(this.disTotal) ;
     this.ObjGRN1.Product_Taxable = this.getTofix(this.taxAblTotal) ;
     this.ObjGRN1.Product_GST = this.getTofix(this.GSTTotal);
     this.ObjGRN1.Product_Net = this.getTofix(this.NetTotal);
     this.ObjGRN1.Term_Taxable = this.getTofix(this.GrTermAmount);
     this.ObjGRN1.Term_GST = this.getTofix(this.GrGstTermAmt);
     this.ObjGRN1.Term_Net = this.getTofix(this.grNetTerm)
     this.ObjGRN1.Total_GST = this.getTofix(Number(this.GSTTotal) + Number(this.GrGstTermAmt))
     this.ObjGRN1.Rounded_Off = Number(this.getRoundedOff());
     this.ObjGRN1.Total_Net_Amount = Number(this.RoundOff(this.taxAblTotal + this.GrTermAmount + this.GSTTotal + this.GrGstTermAmt));
    if(this.productaddSubmit.length) {
      let tempArr:any =[]
      this.productaddSubmit.forEach(item => {
        const obj = {
            GRN_No : this.DocNo ? this.DocNo : 'A',
            Product_ID : item.Product_ID,
            //Product_Description : item.Product_Description,
            HSN_Code : item.HSN_Code,
            UOM : item.Unit,
            Challan_Qty : Number(item.Challan),
            Received_Qty : Number(item.Received),
            Rejected_Qty : Number(item.Rejected),
            Accepted_Qty : Number(item.Accepted),
            Rate : Number(item.Rate),
            Freight_PF_Perc : Number(item.Freight_PF_Perc),
            Freight_PF_Charges : Number(item.Freight_PF_Charges),
            Discount_Amount : Number(item.Discount_Amount).toFixed(2),
            Taxable_Value : Number(item.Taxable_Value).toFixed(2),
            Tax_Percentage : item.GST_Tax_Per,
            Total_Tax_Amount : Number(item.Tax).toFixed(2),
            Total_Amount : Number(item.Total_Amount).toFixed(2),
            Remarks : item.Remarks,
            Batch_Number : item.Batch_No ? item.Batch_No :  "A"
        }

        // const TempObj = {
        //  // UOM : "PCS",
        //   Doc_No : this.PPdoc_no ? this.PPdoc_no : "A",
        //   Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
        //   User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        //   Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        //   //Return_Reason_ID : this.ObjProductaddForm.Return_Reason_ID
        //   Autho_One_Staus : "NO"

        // }
        tempArr.push({...this.ObjGRN1,...obj,...this.ObjGRN2})
      });
      console.log(tempArr)
      return JSON.stringify(tempArr);

    }
   }
   SaveGRN(valid){
    this.Spinner = true;
    this.GRN2FormSubmitted = true;
    this.TCSTaxRequiredValidation = true;
    this.ngxService.start();
    this.Save = false;
    this.Del = false;
    if (valid && this.productaddSubmit.length && this.ObjGRN1.TCS_Y_N) {
      this.Save = true;
      this.Del = false;
      this.Spinner = true;
      this.ngxService.start();
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "c",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
    // const obj = {
    //   "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
    //   "Report_Name_String" : "Create_BL_Txn_Purchase_Challan_GRN",
    //  "Json_Param_String": this.DataForSaveProduct()

    // }
    // this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    //   console.log(data);
    //   var tempID = data[0].Column1;
    //   if(data[0].Column1){
    //     this.compacctToast.clear();
    //     //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
    //     this.compacctToast.add({
    //      key: "compacct-toast",
    //      severity: "success",
    //      summary: "Return_ID  " + tempID,
    //      detail: "Succesfully Saved" //+ mgs
    //    });
    //    this.PrintPGRN(data[0].Column1);
    //    this.ObjGRN1 = new GRN1();
    //    this.GRNFormSubmitted = false;
    //    this.productaddSubmit = [];
    //    this.ObjGRN2 = new GRN2;
    //    this.GRN2FormSubmitted = false;
    //    this.PODate = new Date();
    //    this.podatedisabled = true;
    //    this.Spinner = false;
    //    this.Godownlist = [];
    //    this.RDBNolist = [];
    //    this.ProductDetailslist = [];
    //    this.ngxService.stop();
    //    this.GetSearchedlist(true);
    //    this.GetPendingRDB(true);
    //    this.ObjGRN1.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    //    this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    //    this.ObjGRN1.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    //    this.GetGodown();
    //    this.deleteError = false

    //   } 
    //   else{
    //     this.Spinner = false;
    //     this.ngxService.stop();
    //     this.compacctToast.clear();
    //     this.compacctToast.add({
    //       key: "compacct-toast",
    //       severity: "error",
    //       summary: "Warn Message",
    //       detail: "Error Occured "
    //     });
    //   }
    // })
    }
    else{
      this.ngxService.stop();
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
    }

   }
   onConfirmSave(){
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String" : "Create_BL_Txn_Purchase_Challan_GRN",
     "Json_Param_String": this.DataForSaveProduct()

    }
    this.GlobalAPI.postData(obj).subscribe(async (data:any)=>{
      console.log(data);
      var tempID = data[0].Column1;
      if(data[0].Column1){
        const constSaveData = await this.TermSave(data[0].Column1);
        if(constSaveData){
        this.compacctToast.clear();
        const mgs = this.buttonname === 'Save' ? "Saved" : "Updated";
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Return_ID  " + tempID,
         detail: "Succesfully " + mgs
       });
       this.PrintPGRN(data[0].Column1);
       this.ObjGRN1 = new GRN1();
       this.GRNFormSubmitted = false;
       this.TCSTaxRequiredValidation = false;
       this.productaddSubmit = [];
       this.ObjGRN2 = new GRN2;
       this.GRN2FormSubmitted = false;
       this.PODate = new Date();
       this.GRNDate = new Date();
       this.podatedisabled = true;
       this.Spinner = false;
       this.Godownlist = [];
       this.RDBNolist = [];
       this.ProductDetailslist = [];
       this.ngxService.stop();
       this.GetSearchedlist(true);
       this.GetPendingRDB(true);
       this.GetPendRDBProWise(true);
       this.ObjGRN1.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
       this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
       this.ObjGRN1.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
       this.GetGodown();
       this.deleteError = false;
       this.SENo = undefined;
       this.INVNo = undefined;
       this.SE_No_Date = undefined;
       this.INV_No_Date = undefined;
       this.ObjTerm = new Term();
       this.AddTermList = [];
       this.grTotal = 0;
       this.taxAblTotal = 0;
       this.disTotal = 0;
       this.ExciTotal = 0;
       this.ExciTotal = 0;
       this.GSTTotal = 0;
       this.NetTotal = 0;
       this.GrTermAmount = 0
       this.GrGstTermAmt = 0
       this.grNetTerm = 0
       if (this.buttonname === "Update") {
        this.tabIndexToView = 0;
        this.items = ["BROWSE", "CREATE", "PENDING RDB", "PENDING RDB PRODUCT WISE", "GRN REGISTER"];
        this.buttonname = "Save";
        this.DocNo = undefined;
       }

      } 
      else{
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
    } 
    else{
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
   Edit(col){
    this.clearData();
    this.DocNo = undefined;
    if(col.GRN_No){
      this.DocNo = col.GRN_No;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE", "PENDING RDB", "PENDING RDB PRODUCT WISE", "GRN REGISTER"];
      this.buttonname = "Update";
      this.getedit(col.GRN_No);
      setTimeout(() => {
        this.gettermedit(col.GRN_No);
        this.gettcsedit(col.GRN_No);
      }, 200);
     }
   }
   getedit(Dno){
    this.editlist = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Get_GRN_Details",
      "Json_Param_String": JSON.stringify([{Doc_No : Dno}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editlist = data;
      console.log("Edit data",data);
      // this.ObjGRN1 = data[0];
      // this.ObjGRN2 = data[0];
      this.GRNDate = new Date(data[0].GRN_Date);
      this.ObjGRN1.Company_ID = data[0].Company_ID;
      this.ObjGRN1.Sub_Ledger_ID = data[0].Sub_Ledger_ID;
      this.ObjGRN1.Cost_Cen_ID = data[0].Cost_Cen_ID;
      this.GetGodown(data[0].godown_id);
      this.ObjGRN1.RDB_No = data[0].RDB_No;
      this.PODate = new Date(data[0].RDB_Date);
      this.SENo = data[0].SE_No + "&";
      this.SE_No_Date = new Date(data[0].SE_Date);
      this.ObjGRN1.SE_No_Date = this.SENo + this.DateService.dateConvert(this.SE_No_Date);
      this.INVNo = data[0].Inv_No + "&";
      this.INV_No_Date = new Date(data[0].Inv_Date);
      this.ObjGRN1.Mode_Of_transport = data[0].Mode_Of_transport;
      this.ObjGRN1.LR_No_Date = data[0].LR_No_Date;
      this.ObjGRN1.Vehicle_No = data[0].Vehicle_No;
      this.ObjGRN1.TCS_Y_N = data[0].TCS_Y_N; 
      this.GetTCSdat();
      this.ObjGRN1.TCS_Per = data[0].TCS_Persentage;
      this.TcsAmtCalculation();     // this.AddTermList = data[0].Term_element ? data[0].Term_element : [];
      // this.RDBListAdd = data[0].L_element;
      this.ObjGRN2.Quantity_Remarks = data[0].Quantity_Remarks;
      this.ObjGRN2.Quality_Rejection_Remarks = data[0].Quality_Rejection_Remarks;
      this.ObjGRN2.Deduction_For_Rejection = data[0].Deduction_For_Rejection;
      this.ObjGRN2.All_Over_Remarks = data[0].All_Over_Remarks;
      this.ObjGRN2.Created_By = data[0].Created_By;
      data.forEach(element => {
        const  productObj = {
            Product_ID : element.Product_ID,
            Product_Details : element.Product_Description,
            HSN_Code : element.HSN_Code,
            Unit : element.UOM,
            Challan : Number(element.Challan_Qty),
            Received : Number(element.Received_Qty),
            Rejected : Number(element.Rejected_Qty),
            Accepted : Number(element.Accepted_Qty),
            Rate :  Number(element.Rate),
            Discount_Amount : Number(element.Discount_Amount).toFixed(2),
            RDB_Discount_Amount : Number(element.RDB_Discount_Amount).toFixed(2),
            Taxable_Value : Number(element.Taxable_Value).toFixed(2),
            GST_Tax_Per : Number(element.Tax_Percentage),
            Tax : Number(element.Total_Tax_Amount).toFixed(2),
            Total_Amount : Number(element.Total_Amount).toFixed(2),
            Remarks : element.Remarks,
            Batch_No : element.Batch_No
          };
    
          this.productaddSubmit.push(productObj);
        });
        if(this.productaddSubmit.length){
          this.getAllTotal();
        }
    })
   }
   gettermedit(Dno){
    this.termeditlist = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Get_GRN_Details_Term",
      "Json_Param_String": JSON.stringify([{Doc_No : Dno}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.termeditlist = data;
      console.log("termeditlist data",data);
      data.forEach(element => {
        const  termObj = {
            Sale_Pur : element.Sale_Pur,
            Term_ID : element.Term_ID,
            Term_Name : element.Term_Name,
            HSN_No : element.HSN_No,
            Term_Amount : element.Term_Amount,
            GST_Per : Number(element.GST_Per),
            GST_Amount : Number(element.GST_Amount)
          };
    
          this.AddTermList.push(termObj);
        });
        if(this.AddTermList.length){
          this.getAllTotal();
        }
    })
   }
   gettcsedit(Dno){
    // this.termeditlist = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Get_GRN_Details_TCS",
      "Json_Param_String": JSON.stringify([{Doc_No : Dno}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // this.termeditlist = data;
      console.log("tcseditlist data",data);
      this.ObjGRN1.TCS_Y_N = data[0].TCS_Y_N; 
      this.getAllTotal();
      this.TcsAmtCalculation();
    })
   }
   GetDataforUpdate(){
  //    this.EditList = [];
  //   //console.log(this.ObjBrowse.Doc_No);
  //   const obj = {
  //     "SP_String": "SP_Purchase_Planning",
  //     "Report_Name_String": "Get Data For Approved",
  //     "Json_Param_String": JSON.stringify([{Doc_No : this.PPdoc_no}])

  //   }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //      this.EditList = data;
  //      this.PPdoc_no = data[0].Doc_No;
  //      this.todayDate = new Date(data[0].Doc_Date);
  //      this.ObjMPtype.Material_Type = data[0].Material_Type;
  //      this.getproducttype(data[0].Product_Type_ID);
  //      this.ObjMPtype.Product_Type = data[0].Product_Type_ID;
  //      this.LastPurDate = new Date(data[0].Last_Puchase_Date);
  //      this.Vendor_ID = data[0].Sub_Ledger_ID;
  //      this.Credit_Days = data[0].Credit_days;
  //     console.log("this.EditList  ===",this.EditList);
  //     this.EditList.forEach(ele => {
  //       const  productObj = {
  //         Material_Type : ele.Material_Type,
  //         //Product_Type_ID : ele.Product_Type_ID,
  //         Product_Type : ele.Product_Type ? ele.Product_Type : '-',
  //         Product_ID : ele.Product_ID,
  //         Product_Description : ele.Product_Description,
  //         Weekly_Avg_Cons : ele.Weekly_Avg_Cons,
  //         UOM : ele.Order_UOM,
  //         Weekly_Cons_Value : ele.Weekly_Cons_Value,
  //         Last_Puchase_Date : this.DateService.dateConvert(new Date(ele.Last_Puchase_Date)),
  //         Last_Puchase_Qty : ele.Last_Puchase_Qty,
  //         AL_UOM : ele.Order_Stock_UOM,
  //         Last_Purchase_Rate : ele.Last_Purchase_Rate,
  //         //Last_Purchase_With_GST : Number(lastpurchaseGST),
  //         Current_Stock : ele.Current_Stock,
  //         Pcs_UOM : ele.Order_Stock_UOM,
  //         Due_Payment : ele.Due_Payment,
  //         Order_Qty : ele.Order_Qty,
  //         Alt_UOM : ele.Order_UOM,
  //         Sale_rate : ele.Rate,
  //         // Order_Qty :  this.ObjPurchasePlan.Stock_Qty,
  //         // Current_Rate : this.ObjPurchasePlan.Sale_rate,
  //         Order_Value : Number(ele.Order_Qty) * ele.Rate,
  //         Stock_Qty : ele.Order_Stock_Qty,
  //         Stock_UOM : ele.Order_Stock_UOM,
  //         Estimated_Time_Of_Delivery : ele.Estimated_Time_Of_Delivery,
  //         //Total_Amount_With_GST : Number(AmtWithGST),
  //        // Indent_Qty : this.ObjPurchasePlan.Indent_Qty ? this.ObjPurchasePlan.Indent_Qty : '-',
  //         Remarks : ele.Remarks ? ele.Remarks : '-',
  //        // Vendor :  VV.Sub_Ledger_Name ? VV.Sub_Ledger_Name : this.ObjPurchasePlan.Vendor,
  //         Vendor_ID :  ele.Sub_Ledger_ID,
  //         Vendor : ele.Vendor_Name,
  //         Credit_days : ele.Credit_days
  //      };
  //       this.productaddSubmit.push(productObj);
  //  });
  //   })
   }
   GettermAmt(){
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Get_Term",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.TermList = data
    })
  }
  TermChange(){
    this.ObjTerm.HSN_No = undefined;
    if(this.ObjTerm.Term_ID) {
    const ctrl = this;
    const termobj = $.grep(ctrl.TermList,function(item: any) {return item.Term_ID == ctrl.ObjTerm.Term_ID})[0];
    console.log(termobj);
    this.ObjTerm.Term_ID = termobj.Term_ID
    this.ObjTerm.Term_Name = termobj.Term_Name;
    this.ObjTerm.HSN_No = termobj.HSN_No;
    this.ObjTerm.GST_Per = termobj.GST_Tax_Per;
    this.ObjTerm.Sale_Pur = termobj.Sale_Pur;
    }
  }
  AddTerm(valid){
    this.TermFormSubmitted = true;
    if(valid && this.TeramChek()) {
      var TERMobj = {
      Sale_Pur : this.ObjTerm.Sale_Pur,
      Term_ID : this.ObjTerm.Term_ID,
      Term_Name : this.ObjTerm.Term_Name,
      Term_Amount : Number(this.ObjTerm.Term_Amount),
      GST_Per : Number(this.ObjTerm.GST_Per).toFixed(2),
      GST_Amount:  Number(Number(Number(this.ObjTerm.Term_Amount) * Number(this.ObjTerm.GST_Per) / 100).toFixed(2)),
      HSN_No : this.ObjTerm.HSN_No,
    };
    this.AddTermList.push(TERMobj);
    this.getAllTotal();
    this.TcsAmtCalculation();
    this.ObjTerm = new Term();
    this.TermFormSubmitted = false;
      
    }
  }
  getTofix(key){
    return Number(Number(key).toFixed(2))
   }
   RoundOff(key:any){
    return Math.round(Number(Number(key).toFixed(2)))
  }
   TeramChek(){
    if(this.AddTermList.length){
      const FilterAddTermList = this.AddTermList.find((el:any)=> Number(el.Term_ID) == Number(this.ObjTerm.Term_ID))
      if(FilterAddTermList){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Same Term Name Can't be Added."
        });
        return false;
      }
      else {
        return true;
      }
    }
    else{
      return true;
    }
   }
  DeteteTerm(index) {
    this.AddTermList.splice(index,1)
    this.getAllTotal();
    this.TcsAmtCalculation();
  }
  async TermSave(doc:any){
    if(doc){
       if(this.AddTermList.length){
        this.AddTermList.forEach((ele:any) => {
          ele['DOC_No'] = doc
        });
       }
       else{
        this.AddTermList.push({
          "DOC_No": doc,
          "Term_ID":0
        })
       }
      const obj = {
        "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
        "Report_Name_String": "Insert_Term_Details",
        "Json_Param_String": JSON.stringify(this.AddTermList)
      }
      const TermData = await  this.GlobalAPI.getData(obj).toPromise();
     // console.log("projectData",TermData);
      return TermData
    }
  }
  getAllTotal(){
    this.grTotal = 0;
    this.taxAblTotal = 0;
    this.disTotal = 0;
    this.ExciTotal = 0;
    this.ExciTotal = 0;
    this.GSTTotal = 0;
    this.NetTotal = 0;
    this.GrTermAmount = 0
    this.GrGstTermAmt = 0
    this.grNetTerm = 0
    if(this.productaddSubmit.length){
      this.productaddSubmit.forEach(ele => {
        this.grTotal += Number(ele.Challan) && Number(ele.Rate) ? Number(Number(ele.Challan) * Number(ele.Rate)) : 0
        this.taxAblTotal += Number(ele.Taxable_Value) ? Number(ele.Taxable_Value) : 0
        this.disTotal += Number(ele.Discount_Amount) ?  Number(ele.Discount_Amount) : 0
        this.ExciTotal += Number(ele.Excise_Amount) ? Number(ele.Excise_Amount) : 0
        this.GSTTotal += Number(ele.Tax) ? Number(ele.Tax) : 0
        this.NetTotal += Number(ele.Total_Amount) ? Number(ele.Total_Amount)  :0
      });
    }
    
  if(this.AddTermList.length){
   this.AddTermList.forEach((el:any) => {
     this.GrTermAmount += Number(el.Term_Amount);
     this.GrGstTermAmt += Number(el.GST_Amount);
     this.grNetTerm += Number(Number(el.Term_Amount) + Number(el.GST_Amount))
   });
  }
  
  }
  getRoundedOff(){
    return this.getTofix( Math.round(Number((this.taxAblTotal + this.GrTermAmount + this.GSTTotal + this.GrGstTermAmt + this.ObjGRN1.TCS_Amount).toFixed(2))) - Number((this.taxAblTotal + this.GrTermAmount + this.GSTTotal + this.GrGstTermAmt + this.ObjGRN1.TCS_Amount).toFixed(2))) 
  }

  GetTCSdat(){
    this.ObjGRN1.TCS_Ledger_ID = 0;
    if (this.ObjGRN1.TCS_Y_N === 'YES') {
    this.ngxService.start();
    const obj = {
      "SP_String": "Sp_Purchase_Order",
      "Report_Name_String": "Get_Tcs_Percentage_And Ledger",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log(data)
    this.TCSdataList = data;
    this.ngxService.stop();
  }); 
    }  
    else {
      this.ObjGRN1.TCS_Persentage = 0;
      this.ObjGRN1.TCS_Amount = 0;
      this.ObjGRN1.TCS_Per = undefined;
      // this.objaddPurchacse.Grand_Total = this.objaddPurchacse.Net_Amt;
      this.getRoundedOff();
      // this.ObjVoucherTopper.DR_Amt = this.ObjSaleBillNew.Grand_Total;
  }
  }
  TcsAmtCalculation(){
    this.ObjGRN1.TCS_Ledger_ID = 0;
    if (this.ObjGRN1.TCS_Per) {
      var tcspercentage = this.TCSdataList.filter(el=> Number(el.TCS_Persentage) === Number(this.ObjGRN1.TCS_Per))
          this.ObjGRN1.TCS_Ledger_ID = tcspercentage[0].TCS_Ledger_ID;
          this.ObjGRN1.TCS_Persentage = tcspercentage[0].TCS_Persentage;
          var netamount = (Number(this.taxAblTotal) + Number(this.GrTermAmount) + Number(this.GSTTotal) + Number(this.GrGstTermAmt)).toFixed(2);
          var TCS_Amount = (Number(Number(netamount) * this.ObjGRN1.TCS_Persentage) / 100).toFixed(2);
          this.ObjGRN1.TCS_Amount = Number(TCS_Amount);
          // this.objaddPurchacse.Grand_Total = (Number(this.objaddPurchacse.Net_Amt) + Number(this.objaddPurchacse.TCS_Amount)).toFixed(2);
          // this.Round_off = (Number(Math.round(this.ObjSaleBillNew.Grand_Total)) - Number(this.ObjSaleBillNew.Grand_Total)).toFixed(2);
          // this.Net_Amt = Number(Math.round(this.ObjSaleBillNew.Grand_Total)).toFixed(2);
          this.getRoundedOff();
          // this.ObjVoucherTopper.DR_Amt = this.ObjSaleBillNew.Grand_Total;
          this.ngxService.stop();
    }
      else {
        this.ObjGRN1.TCS_Persentage = 0;
        this.ObjGRN1.TCS_Amount = 0;
        // this.objaddPurchacse.Grand_Total = this.objaddPurchacse.Net_Amt;
        this.getRoundedOff();
        // this.ObjVoucherTopper.DR_Amt = this.ObjSaleBillNew.Grand_Total;
    }
  }

   // CREATE TAB END

   getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.From_date = dateRangeObj[0];
      this.ObjBrowse.To_date = dateRangeObj[1];
    }
  }
   GetSearchedlist(valid){
    this.GRNSearchFormSubmitted = true;
    this.seachSpinner = true;
    this.Searchedlist = [];
    this.ngxService.start();
    const From_date = this.ObjBrowse.From_date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_date))
    : this.DateService.dateConvert(new Date());
    const To_date = this.ObjBrowse.To_date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.To_date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
     From_date : From_date,
     To_date : To_date,
     Company_ID : this.ObjBrowse.Company_ID
   }
   if (valid) {
  const obj = {
    "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
    "Report_Name_String": "Browse_BL_Txn_Purchase_Challan_GRN",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Searchedlist = data;
     this.ngxService.stop();
    //  this.BackupSearchedlist = data;
     //console.log('Search list=====',this.Searchedlist)
     this.seachSpinner = false;
    // this.SearchFactoryFormSubmit = false;
   })
  }
  else {
    this.ngxService.stop();
       }
   }
   Delete(data){
    this.doc_no = undefined;
    this.Del = false;
    this.Save = false;
    if (data.GRN_No) {
      this.Del = true;
      this.Save = false;
     this.doc_no = data.GRN_No;
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
   onConfirmDel(){
      const objj = {
       "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
       "Report_Name_String": "Delete_BL_Txn_Purchase_Challan_GRN",
       "Json_Param_String": JSON.stringify([{Doc_No : this.doc_no , Created_By : this.$CompacctAPI.CompacctCookies.User_ID }])
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
        //var msg = data[0].Column1;
        if (data[0].Column1 === 'Done'){
          //this.onReject();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Doc No.: " + this.doc_no.toString(),
            detail: "Succefully Deleted"
          });
          this.doc_no = undefined;
          this.GetSearchedlist(true);
          this.GetPendingRDB(true);
          this.GetPendRDBProWise(true);
        }
        
        else {
          this.onReject();
          this.deleteError = true;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "c", 
            sticky: true,
            closable: false,
            severity: "warn", // "info",
            summary: data[0].Column1,
            // detail: data[0].Column1
          });
          this.doc_no = undefined;
          this.GetSearchedlist(true);
        }
      })
   }
  onReject(){
   this.compacctToast.clear("c");
   this.Spinner = false;
   this.ngxService.stop();
   this.deleteError = false;
  }
  getDateFormat(dateValue:any){
   return  dateValue ? this.DateService.dateConvert(dateValue) : "-"
  }
  PrintPGRN(DocNo) {
    if(DocNo) {
    const objtemp = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "GRN_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var GRNprintlink = data[0].Column1;
      window.open(GRNprintlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }
  RejectionPrintPGRN(DocNo) {
    if(DocNo) {
    const objtemp = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Rejection_GRN_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var GRNRejprintlink = data[0].Column1;
      window.open(GRNRejprintlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }
  //  Order(pro_id){
    //  //this.clearData();
    // if(pro_id.Product_ID){
    // this.ObjStockLevel.Product_ID = pro_id.Product_ID;
    // this.tabIndexToView = 1;
    // this.productdisabled = true;
    // this.uomdisabeld = true;
    // //this.items = ["BROWSE", "CREATE", "ORDER-STOCK REPORT"];
    // // this.buttonname = "Save";
    // // console.log("this.EditDoc_No ", this.Adv_Order_No );
    // this.getOrderdetails(this.ObjStockLevel.Product_ID);
    // }
  // }
  // getOrderdetails(Product_ID){
    // const tempobj = {
    //   Product_ID : this.ObjStockLevel.Product_ID,
    //   Material_Type : this.ObjStockLevel.Material_Type,
    //   Cost_Cen_ID : this.ObjStockLevel.Cost_Cen_ID,
    //   Godown_ID : this.ObjStockLevel.Godown_ID
    // }
    // const obj = {
    //   "SP_String": "SP_Purchase_Planning",
    //   "Report_Name_String": "Product Details For Order",
    //   "Json_Param_String": JSON.stringify([tempobj])
    // }
    //  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //    this.Orderlist = data;
    //    console.log('Orderlist list=====',this.Orderlist)
    //   //  this.ObjMPtype.Material_Type = data[0].Material_Type;
    //   //  this.getproducttype(data[0].Product_Type_ID);
    //   //  this.ObjMPtype.Product_Type = data[0].Product_Type_ID;
    //   //  this.ObjPurchasePlan.Product_ID = data[0].Product_ID;
    //   //  this.getproduct(data[0].Product_ID);
    //   //  this.ObjPurchasePlan.Product_Description = data[0].Product_Description;
    //   //  this.ObjPurchasePlan.Weekly_Avg_Cons = data[0].Weekly_Avg_Cons;
    //   //  this.ObjPurchasePlan.UOM = data[0].UOM;
    //   //  this.ObjPurchasePlan.Weekly_Cons_Value = data[0].Weekly_Cons_Value;
    //   //  this.LastPurDate = this.DateService.dateConvert(new Date(data[0].Last_Purchase_Date));
    //   //  this.ObjPurchasePlan.Last_Purchase_Qty = data[0].Last_Purchase_Qty;
    //   //  this.ObjPurchasePlan.AL_UOM = data[0].Alt_UOM;
    //   //  this.ObjPurchasePlan.Last_Purchase_Rate = data[0].Last_Purchase_Rate;
    //   //  this.ObjPurchasePlan.Current_Stock = data[0].Stock_Qty;
    //   //  this.ObjPurchasePlan.Pcs_UOM = data[0].UOM;
    //   //  this.ObjPurchasePlan.Alt_UOM = data[0].Alt_UOM;
    //   //  this.ObjPurchasePlan.Stock_UOM = data[0].UOM;
    //   //  this.ObjPurchasePlan.UOM_Qty = data[0].UOM_Qty;
    //   //  this.ObjPurchasePlan.Due_Payment = data[0].Due_Payment;
    //   //  this.ObjPurchasePlan.Sale_rate = data[0].Last_Purchase_Rate;

    //  })
  // }

  // PENDING RDB
  getDateRangeprdb(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjPendingRDB.start_date = dateRangeObj[0];
      this.ObjPendingRDB.end_date = dateRangeObj[1];
    }
  }
  GetPendingRDB(valid){
      this.PendingRDBFormSubmitted = true;
      const start = this.ObjPendingRDB.start_date
      ? this.DateService.dateConvert(new Date(this.ObjPendingRDB.start_date))
      : this.DateService.dateConvert(new Date());
      const end = this.ObjPendingRDB.end_date
      ? this.DateService.dateConvert(new Date(this.ObjPendingRDB.end_date))
      : this.DateService.dateConvert(new Date());
      const tempobj = {
       From_Date : start,
       To_Date : end,
       Company_ID : this.ObjPendingRDB.Company_ID,
       proj : "N"
      }
      if (valid) {
      const obj = {
        "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
        "Report_Name_String": "PENDING_RDB",
        "Json_Param_String": JSON.stringify([tempobj])
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.PendingRDBList = data;
        // this.BackupSearchedlist = data;
        // this.GetDistinct();
        if(this.PendingRDBList.length){
          this.DynamicHeaderforPRDB = Object.keys(data[0]);
        }
        else {
          this.DynamicHeaderforPRDB = [];
        }
        this.seachSpinner = false;
        this.PendingRDBFormSubmitted = false;
        console.log("PendingRDBList",this.PendingRDBList);
      })
      }
  }
  PrintPRDB(DocNo) {
    if(DocNo) {
    const objtemp = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
      "Report_Name_String": "RDB_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }

  CreateGRN(row){
    this.clearData();
    // this.ReqDate = new Date();
    if(row.RDB_No) {
      this.tabIndexToView = 1;
      this.dataforcreategrn(row.RDB_No);
    }
        
  }
  dataforcreategrn(Doc_No){
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Get_Data_For_Create_GRN",
      "Json_Param_String": JSON.stringify([{Doc_No:Doc_No}])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.dataforcretegrn = data;
      console.log("this.dataforcretegrn ===",this.dataforcretegrn)
      this.ObjGRN1.Cost_Cen_ID = data[0].Cost_Cen_ID;
      this.GetGodown();
      this.ObjGRN1.Sub_Ledger_ID = data[0].Sub_Ledger_ID;
      this.GetRDBNo();
      this.ObjGRN1.RDB_No = data[0].RDB_No;
      this.ObjGRN2.Quality_Rejection_Remarks = data[0].Ins_Remarks;
      setTimeout(() => {
      this.GetProductDetails()
      }, 200);
      // this.PODate = new Date(data[0].RDB_Date);
      // this.ObjRdb.godown_id = this.AllStockList.length === 1 ? this.AllStockList[0].godown_id : undefined;
    })
  }
  getDateRangeprdbprowise(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjPendRDBProWise.start_date = dateRangeObj[0];
      this.ObjPendRDBProWise.end_date = dateRangeObj[1];
    }
  }
  GetPendRDBProWise(valid){
    this.PendRDBProWiseFormSubmitted = true;
    const start = this.ObjPendRDBProWise.start_date
    ? this.DateService.dateConvert(new Date(this.ObjPendRDBProWise.start_date))
    : this.DateService.dateConvert(new Date());
    const end = this.ObjPendRDBProWise.end_date
    ? this.DateService.dateConvert(new Date(this.ObjPendRDBProWise.end_date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
     From_Date : start,
     To_Date : end,
     Company_ID : this.ObjPendRDBProWise.Company_ID,
     proj : "N"
    }
    if (valid) {
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Pending_RDB_Product_Wise",
      "Json_Param_String": JSON.stringify([tempobj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.PendRDBProWiseList = data;
      // this.BackupSearchedlist = data;
      // this.GetDistinct();
      if(this.PendRDBProWiseList.length){
        this.DynamicHeaderforPRDBProWise = Object.keys(data[0]);
      }
      else {
        this.DynamicHeaderforPRDBProWise = [];
      }
      this.seachSpinner = false;
      this.PendRDBProWiseFormSubmitted = false;
      console.log("PendRDBProWiseList",this.PendRDBProWiseList);
    })
    }
}

  // RDB REGISTER
  getDateRangeForRegister(dateRangeObjRegister) {
    if (dateRangeObjRegister.length) {
      this.ObjGRNRegister.start_date = dateRangeObjRegister[0];
      this.ObjGRNRegister.end_date = dateRangeObjRegister[1];
    }
  }
  PrintGRNRegister() {
    // console.log("print register")
    this.RegisterSpinner = true;
    // if(DocNo) {
    // const objtemp = {
    //   "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
    //   "Report_Name_String": "RDB_Print"
    //   }
    // this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
    //   var printlink = data[0].Column1;
    // if(this.start_date && this.end_date) {
      const start = this.ObjGRNRegister.start_date
      ? this.DateService.dateConvert(new Date(this.ObjGRNRegister.start_date))
      : this.DateService.dateConvert(new Date());
      const end = this.ObjGRNRegister.end_date
      ? this.DateService.dateConvert(new Date(this.ObjGRNRegister.end_date))
      : this.DateService.dateConvert(new Date());
    //   console.log(start)
    //   console.log(end)
    if(start && end) {
    window.open("/Report/Crystal_Files/MICL/GRN_Register.aspx?From_Date=" + start + "&" + "To_Date=" + end, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    this.RegisterSpinner = false;
    }
    // })
    // }
  }


}

class GRN1 {
  GRN_Date : any;
  Company_ID : any;
  Sub_Ledger_ID : any;
  Cost_Cen_ID : any;
  godown_id : any;
  RDB_No_Date : any;
  SE_No_Date : any ;
  INV_No_Date : any;
  RDB_No : any;
  RDB_Date : any;
  Mode_Of_transport : any;
  LR_No_Date : any;
  Vehicle_No : any;
  TCS_Ledger_ID:any;
  TCS_Y_N : any;
  TCS_Persentage : any;
  TCS_Amount : number = 0;
  TCS_Per : any;

  Product_Gross :any 
  Product_Discount :any
  Product_Taxable :any
  Product_GST :any
  Product_Net :any
  Term_Taxable :any
  Term_GST :any
  Term_Net :any
  Total_GST :any
  Rounded_Off :any
  Total_Net_Amount :any
}

class GRN {
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
  All_Over_Remarks : string;
  Created_By : string;
 }
 class Browse {
  Company_ID : any;
  From_date : Date;
  To_date : Date;
 }
 class PendingRDB{
  Company_ID : any;
  start_date : Date;
  end_date : Date;
  Cost_Cen_ID : any;
}
class GRNRegister {
  start_date : Date;
  end_date : Date;
}
class PendRDBProWise{
  Company_ID : any;
  start_date : Date;
  end_date : Date;
  Cost_Cen_ID : any;
}
class Term {
  DOC_No:any
  Sale_Pur:any
  Term_ID:any
  Term_Name:any
  Term_Amount:any
  GST_Per:any
  GST_Amount:any
  HSN_No:any
}





