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
  items = [];
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
    this.Finyear();
}
TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE","PENDING RDB"];
     this.buttonname = "Save";
     this.Spinner = false;
     this.TabFlag =true;
     this.clearData();
}
clearData(){
this.seachSpinner = false;
this.Spinner = false;
this.GRN_Date = this.GNRdata;
this.PODate = new Date();
this.SENo = "";
this.INVNo = "";
this.disabledflaguom = false;
this.disabledflaghsn = false;
this.RDBMcreatFormSubmitted =false;
this.RDBTcreatFormSubmitted = false;
this.RDBNolist = [];
this.productaddSubmit = [];
this.ObjLowerCreat = new LowerCreat();
this.createListObj ={};
this.SearchedlistPanding =[];
this.Searchedlist =[];
}
getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjPanding.From_Date = dateRangeObj[0];
    this.ObjPanding.To_Date = dateRangeObj[1];
  }
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
   this.ObjTopCreat.godown_id = this.Godownlist.length ? this.Godownlist[0].godown_id : undefined;
 //console.log("Godownlist======",this.Godownlist);
});
}
GetRDBNo(){
  const obj = {
    "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
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
   "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
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
  this.ObjMiddleCreat.Challan_Qty = data[0].Challan_Qty;
  this.ObjMiddleCreat.Received_Qty = data[0].Received_Qty;
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
  if(this.ObjMiddleCreat.Product_ID) {
    const ctrl = this;
    const RateObj = $.grep(ctrl.ProductDetailslist,function(item: any) {return item.Product_ID == ctrl.ObjMiddleCreat.Product_ID})[0];
    console.log(RateObj);
    this.ObjMiddleCreat.Rate = RateObj.Rate;
    this.ObjMiddleCreat.Product_Details = RateObj.Product_Description;
    this.ObjMiddleCreat.GST_Tax_Per = RateObj.GST_Tax_Per;
    this.ObjMiddleCreat.Unit = RateObj.UOM,
    this.ObjMiddleCreat.HSN_Code = RateObj.HSN_Code
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
    if (Number(this.ObjMiddleCreat.Received_Qty) && Number(this.ObjMiddleCreat.Received_Qty) <= Number(this.ObjMiddleCreat.Challan_Qty)){
      if (Number(this.ObjMiddleCreat.Rejected_Qty) >= 0) {
    let amount = Number(this.ObjMiddleCreat.Accepted_Qty * this.ObjMiddleCreat.Rate).toFixed(2);
    let taxsgstcgst =  (Number(Number(amount) * Number(this.ObjMiddleCreat.GST_Tax_Per)) / 100).toFixed(2);
    let totalamount = (Number(amount) + Number(taxsgstcgst)).toFixed(2);
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
    Taxable_Value : Number(amount).toFixed(2),
    GST_Tax_Per : Number(this.ObjMiddleCreat.GST_Tax_Per),
    Tax :  Number(taxsgstcgst).toFixed(2),
    Total_Amount : Number(totalamount).toFixed(2)
  };
  this.productaddSubmit.push(productObj);
  console.log("Product Submit",this.productaddSubmit);
  this.RDBMcreatFormSubmitted = false;
  this.ObjMiddleCreat = new MiddleCreat();
  this.ObjMiddleCreat.Rate = undefined;
  this.ObjMiddleCreat.Product_Details = undefined;
  this.ObjMiddleCreat.GST_Tax_Per = undefined;
  this.disabledflaguom = false;
  this.disabledflaghsn = false;
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
  "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
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
 })
}
}
createGRN(DocnoObj:any){
  this.DocNoId= undefined;
  this.TabFlag = true;
  if (DocnoObj.RDB_No) {
    this.TabFlag =false;
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
  this.ObjTopCreat.RDB_No = this.createListObj.RDB_No;
  setTimeout(() => {
    this.GetProductDetails()
  }, 500);
  
 console.log("RDB_No",this.ObjTopCreat.RDB_No)
 }
  console.log("create==",this.createListObj)
 })
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
    let tempArr =[]
    this.productaddSubmit.forEach(item => {
      const obj = {
          Product_ID : item.Product_ID,
          HSN_Code : item.HSN_Code,
          UOM : item.Unit,
          Challan_Qty : Number(item.Challan),
          Received_Qty : Number(item.Received),
          Rejected_Qty : Number(item.Rejected),
          Accepted_Qty : Number(item.Accepted),
          Rate : Number(item.Rate),
          Taxable_Value : Number(item.Taxable_Value).toFixed(2),
          Tax_Percentage : item.GST_Tax_Per,
          Total_Tax_Amount : Number(item.Tax).toFixed(2),
          Total_Amount : Number(item.Total_Amount).toFixed(2),
          Remarks : item.Remarks,
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
  const obj = {
    "SP_String": "SP_Repair_And_Maintenance_GRN",
    "Report_Name_String" : "Create_Repair_And_Maintenance_GRN",
   "Json_Param_String": this.DataForSaveProduct()
  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    console.log(data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      this.compacctToast.clear();
      //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Return_ID  " + tempID,
       detail: "Succesfully Saved" //+ mgs
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
     this.ObjTopCreat.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjTopCreat.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.GetGodown();

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
    "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
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
  Remarks : string;
  Created_By : string;
}
