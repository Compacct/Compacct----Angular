import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-repair-and-mantaince-grn',
  templateUrl: './repair-and-mantaince-grn.component.html',
  styleUrls: ['./repair-and-mantaince-grn.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class RepairAndMantainceGRNComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";
  ObjBrowse : Browse = new Browse ();
  ObjPanding : Panding = new Panding ();
  ObjTopCreat : TopCreat = new TopCreat ();
  ObjMiddleCreat : MiddleCreat = new MiddleCreat();
  ObjLowerCreat : LowerCreat = new LowerCreat();
  companyList:any =[];
  Supplierlist:any =[];
  CostCenterlist:any =[];
  Godownlist :any =[];
  RDBNolist :any =[];
  ProductDetailslist :any =[];
  RDBSearchFormSubmitted =false;
  RDBPandingSearchFormSubmitted =false;
  RDBTcreatFormSubmitted =false;
  RDBMcreatFormSubmitted =false;
  SE_No_Date: Date;
  Inv_Date :Date;
  INVNo:string ="-"
  SENo:string = "-";
  podatedisabled = true;
  disabledflaguom = false;
  disabledflaghsn = false;
  productaddSubmit :any =[];
  DynamicHeader:any = [];
  DynamicHeader2:any = [];
  SearchedlistPanding :any =[];
  Searchedlist :any =[];
  initDate:any = [];
  initDate2:any =[];
  GnrmaxDate = new Date();
  GnrminDate = new Date();
  RDBmaxDate = new Date();
  RDBminDate = new Date();
  GNRdata = new Date();
  GRN_Date = new Date();
  RDB_Date = new Date()
  PODate : any = new Date();
  RDBdata = new Date();
  doc_no: any;
  createListObj:any={};
  DocNoId:any =[];
  TabFlag =true;
  FreightPFPerc: any;
  DiscountAmount: any;
  addPurchaseListInput:boolean = false;
  DocNo:any;
  editlist:any = [];
  ObjTerm:Term = new Term()
  TermList:any = [];
  TermFormSubmitted = false;
  AddTermList:any = [];
  termeditlist:any = [];
  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) {}

ngOnInit(){
    this.items = ["BROWSE", "CREATE","PENDING RDB"];
    this.Header.pushHeader({
      Header: "Repair and Maintenance GRN",
      Link: "Material Management -> Repair & Maintenance -> Repair and Maintenance GRN"
    });
    this.getcompany();
    this.GetSupplier();
    this.GetCostCenter();
    this.ObjTopCreat.godown_id = this.Godownlist.length ? this.Godownlist[0].godown_id : undefined;
    this.Finyear();
    this.GettermAmt();
}
TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE","PENDING RDB"];
     this.buttonname = "Save";
     this.Spinner = false;
    //  this.TabFlag =true;
     this.clearData();
    //  this.ObjTopCreat.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    //  this.GetGodown();
     this.DocNo = undefined;
     this.AddTermList = [];
}
clearData(){
this.ObjTopCreat = new TopCreat ();
this.seachSpinner = false;
this.Spinner = false;
this.GRN_Date = this.GNRdata;
this.PODate = new Date();
this.SENo = "";
this.INVNo = "";
this.ObjTopCreat.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
// this.ObjTopCreat.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
// this.GetGodown();
this.GetCostCenter();
this.ObjTopCreat.godown_id = this.Godownlist.length ? this.Godownlist[0].godown_id : undefined;
this.disabledflaguom = false;
this.disabledflaghsn = false;
this.RDBMcreatFormSubmitted =false;
this.RDBTcreatFormSubmitted = false;
this.RDBNolist = [];
this.productaddSubmit = [];
this.ObjLowerCreat = new LowerCreat();
this.createListObj ={};
// this.SearchedlistPanding =[];
// this.Searchedlist =[];
}
getDateRange(dateRangeObj) {
   if (dateRangeObj.length){
    this.ObjPanding.From_Date = dateRangeObj[0];
    this.ObjPanding.To_Date = dateRangeObj[1];
  }
}
Finyear(){
  this.$http
    .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
    .subscribe((res: any) => {
    let data = JSON.parse(res)
   this.GnrmaxDate = new Date(data[0].Fin_Year_End);
   this.GnrminDate = new Date(data[0].Fin_Year_Start);
   this.RDBmaxDate = new Date(data[0].Fin_Year_End);
   this.RDBminDate = new Date(data[0].Fin_Year_Start);
   this.GNRdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End);
   this.RDBdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
   this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)];
   this.initDate2 = [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
    });
}
getcompany(){
  const obj = {
    "SP_String": "sp_Comm_Controller",
    "Report_Name_String": "Dropdown_Company",
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.companyList = data
   //console.log("companyList",this.companyList)
   this.ObjPanding.Company_ID = this.companyList.length ? this.companyList[0].Company_ID : undefined;
   this.ObjBrowse.Company_ID = this.companyList.length ? this.companyList[0].Company_ID : undefined;
   this.ObjTopCreat.Company_ID = this.companyList.length ? this.companyList[0].Company_ID : undefined;
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
   //console.log("Supplierlist======",this.Supplierlist);
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
   //console.log("CostCenterlist======",this.CostCenterlist);
   this.ObjTopCreat.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
 this.GetGodown()
 });
}
GetGodown(){
this.Godownlist = [];
const obj = {
  "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
  "Report_Name_String": "Get_Cost_Center_Godown",
  "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.ObjTopCreat.Cost_Cen_ID}])

}
this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Godownlist = data;
  //  if (this.buttonname != "Save") {
  //  this.ObjTopCreat.godown_id = this.Godownlist.length ? this.Godownlist[0].godown_id : undefined;
  //  }
 //console.log("Godownlist======",this.Godownlist);
});
}
GetRDBNo(){
  const obj = {
    "SP_String": "SP_Repair_And_Maintenance_GRN",
    "Report_Name_String": "Get_Pending_RDB_Nos",
    "Json_Param_String": JSON.stringify([{Sub_Ledger_ID : this.ObjTopCreat.Sub_Ledger_ID}])

 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.RDBNolist = data;
   console.log("RDBNolist======",this.RDBNolist);
  
 });
}
GetProductDetails(){
  this.ProductDetailslist = [];
 this.ObjMiddleCreat.Rate = undefined;
 this.ObjMiddleCreat.Product_Details = undefined;
 this.ObjMiddleCreat.GST_Tax_Per = undefined;
 this.SENo = "-";
 this.INVNo ="-";
 this.ObjMiddleCreat = new MiddleCreat();
 const postobj = {
   Doc_No : this.ObjTopCreat.RDB_No
 }
 const obj = {
   "SP_String": "SP_Repair_And_Maintenance_GRN",
   "Report_Name_String": "Get_product_Details",
   "Json_Param_String": JSON.stringify([postobj])

}
this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.ProductDetailslist = data;
  console.log("ProductDetailslist======",this.ProductDetailslist);
  this.SE_No_Date = new Date(data[0].SE_Date);
  this.Inv_Date =new Date(data[0].Inv_Date);
  this.ObjTopCreat.RDB_Date = new Date(data[0].RDB_Date);
  this.ObjTopCreat.Mode_Of_transport = data[0].Mode_Of_transport;
  this.ObjTopCreat.LR_No_Date = data[0].LR_No_Date;
  this.ObjTopCreat.Vehicle_No = data[0].Vehicle_No;
  // this.ObjMiddleCreat.Challan_Qty = data[0].Challan_Qty;
  // this.ObjMiddleCreat.Received_Qty = data[0].Received_Qty;
  this.SENo = data[0].SE_No+" & ";
  this.INVNo = data[0].Inv_No+"&";
  this.ObjTopCreat.SE_No_Date = this.SENo + this.DateService.dateConvert(this.SE_No_Date);
  this.ObjTopCreat.Inv_Date = this.INVNo + this.DateService.dateConvert(this.Inv_Date);

});
this.GetPODate();
}
GetPODate(){
  this.ObjTopCreat.RDB_Date = undefined;
  this.podatedisabled = true;
  console
  if(this.ObjTopCreat.RDB_No) {
    console.log("RDBNolist check==",this.RDBNolist)
    const ctrl = this;
    const DateObj = $.grep(ctrl.RDBNolist,function(item: any) {return item.RDB_No == ctrl.ObjTopCreat.RDB_No})[0];
    console.log(DateObj);
    this.ObjTopCreat.RDB_Date = new Date(DateObj.RDB_Date);
    this.PODate = new Date(this.ObjTopCreat.RDB_Date);
    this.podatedisabled = false;
   }
   else {
    this.PODate = new Date();
     this.podatedisabled = true;
   }
}
GetRate(){
  console.log(this.ObjMiddleCreat.Rate)
  this.disabledflaguom = false;
  this.disabledflaghsn = false;
  this.FreightPFPerc = undefined;
  this.DiscountAmount = undefined;
  if(this.ObjMiddleCreat.Product_ID) {
    const ctrl = this;
    const RateObj = $.grep(ctrl.ProductDetailslist,function(item: any) {return item.Product_ID == ctrl.ObjMiddleCreat.Product_ID})[0];
    console.log(RateObj);
    this.ObjMiddleCreat.Rate = RateObj.Rate;
    this.ObjMiddleCreat.Product_Details = RateObj.Product_Description;
    this.ObjMiddleCreat.GST_Tax_Per = RateObj.GST_Tax_Per;
    this.ObjMiddleCreat.Unit = RateObj.UOM,
    this.ObjMiddleCreat.HSN_Code = RateObj.HSN_Code
    this.ObjMiddleCreat.Challan_Qty = RateObj.Challan_Qty;
    this.ObjMiddleCreat.Received_Qty = RateObj.Received_Qty;
    this.FreightPFPerc = RateObj.Freight_PF_Perc;
    this.DiscountAmount = RateObj.Discount_Amount;
    this.ObjLowerCreat.Quality_Rejection_Remarks = RateObj.Ins_Remarks;
    if(RateObj.UOM) {
    this.disabledflaguom = true;
    }
    if(RateObj.HSN_Code) {
      this.disabledflaghsn = true;
      }
   }
}
RecQtyValidation(){
  if (Number(this.ObjMiddleCreat.Received_Qty) && Number(this.ObjMiddleCreat.Received_Qty) > Number(this.ObjMiddleCreat.Challan_Qty)){
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
if(Number(this.ObjMiddleCreat.Received_Qty) && Number(this.ObjMiddleCreat.Accepted_Qty)) {
  this.ObjMiddleCreat.Rejected_Qty = Number(Number(this.ObjMiddleCreat.Received_Qty) - Number(this.ObjMiddleCreat.Accepted_Qty)).toFixed(2);
 }
 else {
   this.ObjMiddleCreat.Rejected_Qty = 0;
 }
}
Add(valid){
  this.RDBMcreatFormSubmitted = true;
  if(valid){
    if (new Date(this.GRN_Date).toISOString() >= new Date(this.PODate).toISOString()) {
    if (Number(this.ObjMiddleCreat.Received_Qty) && Number(this.ObjMiddleCreat.Received_Qty) <= Number(this.ObjMiddleCreat.Challan_Qty)){
      if (Number(this.ObjMiddleCreat.Rejected_Qty) >= 0) {
        var FreightPFPerc = 0;
        var apidiscountamt = this.DiscountAmount;
        var qtydis = Number(apidiscountamt / this.ObjMiddleCreat.Received_Qty).toFixed(2);
        var discountamt = Number(Number(qtydis) * this.ObjMiddleCreat.Challan_Qty).toFixed(2);
        // let amount = Number(this.ObjMiddleCreat.Accepted_Qty * this.ObjMiddleCreat.Rate).toFixed(2);
        var amount = Number(this.ObjMiddleCreat.Challan_Qty * this.ObjMiddleCreat.Rate).toFixed(2);
        var FreightPFCharges = (Number(amount) * (Number(FreightPFPerc) / 100)).toFixed(2);
        var amtwithfreightcharges = (Number(amount) + Number(FreightPFCharges)).toFixed(2);
        var taxable = Number(amtwithfreightcharges) - Number(discountamt);
        let taxsgstcgst =  (Number(Number(taxable) * Number(this.ObjMiddleCreat.GST_Tax_Per)) / 100).toFixed(2);
        let totalamount = (Number(taxable) + Number(taxsgstcgst)).toFixed(2);
    const productObj = {
    Product_ID : this.ObjMiddleCreat.Product_ID,
    Product_Details : this.ObjMiddleCreat.Product_Details,
    HSN_Code : this.ObjMiddleCreat.HSN_Code,
    Unit : this.ObjMiddleCreat.Unit,
    Challan : this.ObjMiddleCreat.Challan_Qty,
    Received : this.ObjMiddleCreat.Received_Qty,
    Rejected : this.ObjMiddleCreat.Rejected_Qty,
    Accepted : this.ObjMiddleCreat.Accepted_Qty,
    Rate : this.ObjMiddleCreat.Rate,
    Freight_PF_Perc : Number(FreightPFPerc).toFixed(2),
    Freight_PF_Charges : Number(FreightPFCharges).toFixed(2),
    Discount_Amount : Number(discountamt).toFixed(2),
    Taxable_Value : Number(taxable).toFixed(2),
    GST_Tax_Per : Number(this.ObjMiddleCreat.GST_Tax_Per),
    Tax :  Number(taxsgstcgst).toFixed(2),
    Total_Amount : Number(totalamount).toFixed(2)
  };
  // this.productaddSubmit.push(productObj);
  // console.log("Product Submit",this.productaddSubmit);
  // this.RDBMcreatFormSubmitted = false;
  // this.ObjMiddleCreat = new MiddleCreat();
  // this.ObjMiddleCreat.Rate = undefined;
  // this.ObjMiddleCreat.Product_Details = undefined;
  // this.ObjMiddleCreat.GST_Tax_Per = undefined;
  // this.disabledflaguom = false;
  // this.disabledflaghsn = false;
  if(this.productaddSubmit.length && this.addPurchaseListInput){
    this.productaddSubmit.forEach((xz:any,i) => {
      // console.log(i)
      if(xz.Product_ID == this.ObjMiddleCreat.Product_ID){
        const productFilter = this.ProductDetailslist.filter(el=> Number(el.Product_ID) === Number(this.ObjMiddleCreat.Product_ID))[0];
        // this.addPurchaseList[i] = {...this.objaddPurchacse}
        this.productaddSubmit[i].Product_ID =  Number(this.ObjMiddleCreat.Product_ID)
        this.productaddSubmit[i].Product_Name = this.ObjMiddleCreat.Product_Details
        this.productaddSubmit[i].Unit = this.ObjMiddleCreat.Unit
        this.productaddSubmit[i].HSN_Code = this.ObjMiddleCreat.HSN_Code
        // this.productaddSubmit[i].Rate = Number(productFilter.Rate),
        this.productaddSubmit[i].Challan  = Number(this.ObjMiddleCreat.Challan_Qty)
        this.productaddSubmit[i].Received = Number(this.ObjMiddleCreat.Received_Qty)
        this.productaddSubmit[i].Accepted  = Number(this.ObjMiddleCreat.Accepted_Qty)
        this.productaddSubmit[i].Rejected = Number(this.ObjMiddleCreat.Rejected_Qty)
        this.productaddSubmit[i].Discount_Amount = Number(discountamt).toFixed(2)
        this.productaddSubmit[i].Taxable_Value = Number(taxable).toFixed(2)
        this.productaddSubmit[i].GST_Tax_Per = Number(this.ObjMiddleCreat.GST_Tax_Per)
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
        this.RDBMcreatFormSubmitted = false;
        this.ObjMiddleCreat = new MiddleCreat();
        this.ObjMiddleCreat.Rate = undefined;
        this.ObjMiddleCreat.Product_Details = undefined;
        this.ObjMiddleCreat.GST_Tax_Per = undefined;
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
     this.ObjMiddleCreat.Product_ID = this.productaddSubmit[inx].Product_ID
    //  this.objaddPurchacse = {...this.addPurchaseList[inx]}
     this.ObjMiddleCreat.Unit = this.productaddSubmit[inx].Unit;
     this.ObjMiddleCreat.Rate = Number(this.productaddSubmit[inx].Rate);
     this.DiscountAmount = Number(this.productaddSubmit[inx].RDB_Discount_Amount);
     this.ObjMiddleCreat.GST_Tax_Per = Number(this.productaddSubmit[inx].GST_Tax_Per);
     this.ObjMiddleCreat.HSN_Code = this.productaddSubmit[inx].HSN_Code;
     this.addPurchaseListInput = true;
     this.ObjMiddleCreat.Challan_Qty =  this.productaddSubmit[inx].Challan;
     this.ObjMiddleCreat.Received_Qty = this.productaddSubmit[inx].Received;
     this.ObjMiddleCreat.Accepted_Qty =  this.productaddSubmit[inx].Accepted;
     this.ObjMiddleCreat.Rejected_Qty = this.productaddSubmit[inx].Rejected;
  
  }
  addClear(){
        this.ObjMiddleCreat = new MiddleCreat();
        this.RDBMcreatFormSubmitted = false;
        if(this.buttonname === "Update") {
        this.ProductDetailslist = [];
        }
        this.addPurchaseListInput = false
        // this.addPurchaseListInputField = {}
        // console.log("addPurchaseList",this.addPurchaseList);
  }
delete(index) {
this.productaddSubmit.splice(index,1)

} 
getDateFormat(dateValue:any){
  return  dateValue ? this.DateService.dateConvert(dateValue) : "-"
}
GetSearchedpandinglist(valid){
  this.RDBPandingSearchFormSubmitted = true;
  this.seachSpinner = true;
  this.SearchedlistPanding = [];
  this.ngxService.start();
  const start = this.ObjPanding.From_Date
  ? this.DateService.dateConvert(new Date(this.ObjPanding.From_Date))
  : this.DateService.dateConvert(new Date());
  const End = this.ObjPanding.To_Date
  ? this.DateService.dateConvert(new Date(this.ObjPanding.To_Date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
   From_Date : start,
   To_Date : End,
   Company_ID : this.ObjPanding.Company_ID,
   proj :"N"
 }
 if (valid) {
const obj = {
  "SP_String": "SP_Repair_And_Maintenance_GRN",
  "Report_Name_String": "PENDING_RDB",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  if(data.length){
   this.SearchedlistPanding = data;
   this.ngxService.stop();
   this.DynamicHeader2 = Object.keys(data[0]);
   console.log('SearchedlistPanding=====',this.SearchedlistPanding)
   this.seachSpinner = false;
   this.RDBPandingSearchFormSubmitted = false;
  }
  else {
    this.ngxService.stop();
    this.seachSpinner = false;
    this.RDBPandingSearchFormSubmitted = false;
  }
 })
}
}
createGRN(DocnoObj:any){
  this.DocNoId= undefined;
  // this.TabFlag = true;
  if (DocnoObj.RDB_No) {
    // this.TabFlag =false;
    this.DocNoId= undefined;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "CREATE","PENDING RDB"];
    this.buttonname = "Save";
    this.clearData();
    this.DocNoId = DocnoObj.RDB_No;
   //this.getDateFormat();
   this.GetcreateGRNMaster();
   }    
}
GetcreateGRNMaster(){
const tempobj = {
  Doc_No :this.DocNoId,
}
const obj = {
  "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
  "Report_Name_String":"Get_Data_For_Create_GRN",
  "Json_Param_String": JSON.stringify([tempobj]) 
 }
 this.GlobalAPI.getData(obj).subscribe((res:any)=>{
  //console.log("CreatForm==>>",res)
 if(res.length){
  this.createListObj = res[0]
  //this.objproject = data[0];
  //this.SearchedlistPanding.Doc_No = res[0].Doc_No;
  this.ObjTopCreat.Sub_Ledger_ID = this.createListObj.Sub_Ledger_ID;
  this.GetRDBNo();
  this.ObjTopCreat.Cost_Cen_ID = this.createListObj.Cost_Cen_ID;
  this.GetGodown();
  this.ObjTopCreat.godown_id = res[0].Godown_ID;
  this.ObjTopCreat.RDB_No = this.createListObj.RDB_No;
  this.ObjLowerCreat.Quality_Rejection_Remarks = res[0].Ins_Remarks;
  setTimeout(() => {
    this.GetProductDetails()
  }, 500);
  
 console.log("RDB_No",this.ObjTopCreat.RDB_No)
 }
  console.log("create==",this.createListObj)
 })
}
getDateRangebrowse(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowse.From_date = dateRangeObj[0];
    this.ObjBrowse.To_date = dateRangeObj[1];
  }
}
GetSearchedlist(valid){
  this.RDBSearchFormSubmitted = true;
  //this.seachSpinner = true;
  this.SearchedlistPanding = [];
  //this.ngxService.start();
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
  "SP_String": "SP_Repair_And_Maintenance_GRN",
  "Report_Name_String": "Browse_Repair_And_Maintenance_GRN",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  this.Searchedlist = data;
  if(data.length){
    //this.ngxService.stop();
   this.DynamicHeader = Object.keys(data[0]);
   console.log('Searchedlist=====',this.Searchedlist)
   //this.seachSpinner = false;
   this.RDBSearchFormSubmitted = false;
  }
 })
}
}
DataForSaveProduct(){
   this.ObjTopCreat.GRN_Date = this.DateService.dateConvert(new Date(this.GRN_Date));
   this.ObjTopCreat.RDB_Date = this.DateService.dateConvert(new Date(this.PODate));
   this.ObjLowerCreat.Created_By = this.$CompacctAPI.CompacctCookies.User_ID;
  if(this.productaddSubmit.length) {
    let tempArr:any =[]
    this.productaddSubmit.forEach(item => {
      const obj = {
          GRN_No : this.DocNo ? this.DocNo : 'A',
          Product_ID : item.Product_ID,
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
      tempArr.push({...this.ObjTopCreat,...obj,...this.ObjLowerCreat})
    });
    console.log(tempArr)
    return JSON.stringify(tempArr);
  }
}
SaveGRN(valid:any){
  this.Spinner = true;
  this.RDBTcreatFormSubmitted = true;
  this.ngxService.start();
  if (valid && this.productaddSubmit.length) {
      this.Spinner = true;
      this.ngxService.start();
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "s",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
  // const obj = {
  //   "SP_String": "SP_Repair_And_Maintenance_GRN",
  //   "Report_Name_String" : "Create_Repair_And_Maintenance_GRN",
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
  //    this.ObjTopCreat = new TopCreat();
  //    this.RDBTcreatFormSubmitted = false;
  //    this.productaddSubmit = [];
  //    this.tabIndexToView = 0;
  //    this.ObjLowerCreat = new LowerCreat();
  //    this.RDBTcreatFormSubmitted = false;
  //    this.PODate = new Date();
  //    this.podatedisabled = true;
  //    this.Spinner = false;
  //    this.Godownlist = [];
  //    this.RDBNolist = [];
  //    this.ProductDetailslist = [];
  //    this.ngxService.stop();
  //    this.GetSearchedlist(true);
  //    this.GetSearchedpandinglist(true);
  //    this.ObjTopCreat.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
  //    this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
  //    this.ObjTopCreat.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  //    this.GetGodown();

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
    "SP_String": "SP_Repair_And_Maintenance_GRN",
    "Report_Name_String" : "Create_Repair_And_Maintenance_GRN",
   "Json_Param_String": this.DataForSaveProduct()
  }
  this.GlobalAPI.postData(obj).subscribe(async(data:any)=>{
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
     this.ObjTopCreat = new TopCreat();
     this.RDBTcreatFormSubmitted = false;
     this.productaddSubmit = [];
     this.tabIndexToView = 0;
     this.ObjLowerCreat = new LowerCreat();
     this.RDBTcreatFormSubmitted = false;
     this.PODate = new Date();
     this.podatedisabled = true;
     this.Spinner = false;
     this.Godownlist = [];
     this.RDBNolist = [];
     this.ProductDetailslist = [];
     this.ngxService.stop();
     this.GetSearchedlist(true);
     this.GetSearchedpandinglist(true);
     this.ObjTopCreat.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjTopCreat.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    //  this.GetGodown();
     this.ObjTopCreat.godown_id = this.Godownlist.length ? this.Godownlist[0].godown_id : undefined;
     this.AddTermList = [];
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
    this.ObjTopCreat = data[0];
    this.ObjLowerCreat = data[0];
    this.GetGodown();
    this.ObjTopCreat.godown_id = data[0].godown_id;
    this.GRN_Date = new Date(data[0].GRN_Date);
    this.ObjTopCreat.RDB_No = data[0].RDB_No;
    this.PODate = new Date(data[0].RDB_Date);
    this.SENo = data[0].SE_No + "&";
    this.SE_No_Date = new Date(data[0].SE_Date);
    this.INVNo = data[0].Inv_No + "&";
    this.Inv_Date = new Date(data[0].Inv_Date);
    // this.AddTermList = data[0].Term_element ? data[0].Term_element : [];
    // this.RDBListAdd = data[0].L_element;
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
  // this.getAllTotal()
  this.ObjTerm = new Term();
  this.TermFormSubmitted = false;
    
  }
}
getTofix(key){
  return Number(Number(key).toFixed(2))
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
  // this.getAllTotal()
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
Delete(data:any){
  this.doc_no = undefined;
  if (data.GRN_No) {
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
onConfirm(){
    const objj = {
     "SP_String": "SP_Repair_And_Maintenance_GRN",
     "Report_Name_String": "Delete_Repair_And_Maintenance_GRN",
     "Json_Param_String": JSON.stringify([{Doc_No : this.doc_no , Created_By : this.$CompacctAPI.CompacctCookies.User_ID }])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      //var msg = data[0].Column1;
      if (data[0].Column1){
        //this.onReject();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Doc No.: " + this.doc_no.toString(),
          detail: "Succefully Deleted"
        });
        this.GetSearchedlist(true);
        this.GetSearchedpandinglist(true);
      }
      else {
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
PrintPGRN(DocNo:any) {
  if(DocNo) {
  const objtemp = {
    "SP_String": "SP_Repair_And_Maintenance_GRN",
    "Report_Name_String": "GRN_Print"
    }
  this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
    var GRNprintlink = data[0].Column1;
    window.open(GRNprintlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  })
  }
}
onReject(){
  this.compacctToast.clear("c");
  this.Spinner = false;
   this.ngxService.stop();
  //  this.deleteError = false;
}
onRejectsave(){
  this.compacctToast.clear("s");
  this.Spinner = false;
   this.ngxService.stop();
  //  this.deleteError = false;
}
Printrdb(DocNo) {
  if(DocNo) {
  const objtemp = {
    "SP_String": "SP_Repair_And_Maintenance_RDB",
    "Report_Name_String": "RDB_Print"
    }
  this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
    var printlink = data[0].Column1;
    window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  })
  }
}
}
class Browse {
  Company_ID : any;
  From_date : any;
  To_date : any;
}
 class Panding{
  Company_ID : any;
  From_Date : any;
  To_Date : any;
}
 class TopCreat{
  Company_ID : any;
  Sub_Ledger_ID : any;
  Cost_Cen_ID : any;
  godown_id : any;
  RDB_No :any;
  RDB_No_Date : any;
  SE_No_Date : any ;
  RDB_Date : any;
  Mode_Of_transport : any;
  LR_No_Date : any;
  Vehicle_No : any;
  GRN_Date : any;
  Inv_Date :any;
  Inv_No :any;
}
 class MiddleCreat{
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
 class LowerCreat{
  Quantity_Remarks : string;
  Quality_Rejection_Remarks : string;
  Deduction_For_Rejection : string;
  All_Over_Remarks : string;
  Created_By : string;
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
