import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { connected } from 'process';
declare var $: any;


@Component({
  selector: 'app-outlet-txn-bank-deposit',
  templateUrl: './outlet-txn-bank-deposit.component.html',
  styleUrls: ['./outlet-txn-bank-deposit.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class OutletTxnBankDepositComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save"
  ObjBrowse : Browse  = new Browse();
  ObjBankTransfer : BankTransfer = new BankTransfer ();
  dateList: any;
  myDate: Date;
  Outletid = [];
  costcentdisableflag = false;
  BankTransferFormSubmitted = false;
  SearchFormSubmitted = false;
  Searchedlist = [];
  editList = [];
  Transfer_To: any = [];
  DisableSlipno = false;
  DisableBank = false;
  todayDate : any = new Date();
  cashcollfromDate : any = new Date();
  cashcollToDate : any = new Date();
  BankNameList: any;
  lockdate:any;

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.Transfer_To = ["Bank / Collection" , "HO"]
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Bank / HO Cash Transfer",
      Link: " Outlet -> Bank / HO Cash Transfer "
    });
    this.getLockDate();
    this.getCostCenter();
    this.getbilldate();
    this.GetBankName();
    // if(this.ObjBankTransfer.Transfer_To = "HO"){
    //   this.ObjBankTransfer.Slip_No = "NA";
    //   this.DisableSlipno = true;
    // }
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  GetBankName(){
    const obj = {
      "SP_String": "SP_Outlet_Txn_Bank_Deposit",
      "Report_Name_String": "Get_Bank",
      //"Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])
 
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BankNameList = data;
      console.log("this.BankNameList  ===",this.BankNameList);
   // this.myDate =  new Date(data[0].Outlet_Bill_Date);
 
  })
  }
  SlipnoChange(){
    this.ObjBankTransfer.Slip_No = undefined;
   // this.ObjBankTransfer.Bank_Name = undefined;
    this.DisableSlipno = false;
    this.DisableBank = false;
    if(this.ObjBankTransfer.Transfer_To == "HO"){
      this.ObjBankTransfer.Slip_No = "NA";
      this.ObjBankTransfer.Ledger_ID = undefined;
      this.DisableSlipno = true;
      this.DisableBank = true;
     }
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
getCostCenter(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Outlet Name",
    "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
    //"Json_Param_String": JSON.stringify([{User_ID : 61}])
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.Outletid = data;
   if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
   //this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
   this.ObjBrowse.Outlet = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
   this.costcentdisableflag = true;
   //this.getGodown();
   } else {
     this.ObjBrowse.Outlet = undefined;
     this.costcentdisableflag = false;
   }
    console.log("cost center ======",this.Outletid);

  });
}
SaveBankTransfer(valid){
  this.BankTransferFormSubmitted = true;
    this.Spinner = true;
    var bankname = this.BankNameList.find(ele => ele.Ledger_ID == this.ObjBankTransfer.Ledger_ID);
    if(!this.ObjBankTransfer.Ledger_ID) {
      this.ObjBankTransfer.Bank_Name = "NA";
    } else {
      this.ObjBankTransfer.Bank_Name = bankname.Bank_Name;
    }
  const tempObj = {
    Txn_ID :	this.ObjBankTransfer.Txn_ID ? this.ObjBankTransfer.Txn_ID : 0,
    Transfer_To	: this.ObjBankTransfer.Transfer_To,
    //Date		:  this.DateService.dateConvert(new Date(this.myDate)),
    Date    : this.DateService.dateConvert(new Date(this.todayDate)),
    cash_Form_Date    :  this.DateService.dateConvert(new Date(this.cashcollfromDate)),
    cash_To_Date    :  this.DateService.dateConvert(new Date(this.cashcollToDate)),
    Amount	:  Number(this.ObjBankTransfer.Amount),
    Ledger_ID : this.ObjBankTransfer.Ledger_ID ? Number(this.ObjBankTransfer.Ledger_ID) : 0,
    Bank_Name	: this.ObjBankTransfer.Bank_Name,
    Slip_No		: this.ObjBankTransfer.Slip_No,
    Cost_Cen_ID	: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
  }
  if(valid && this.checkLockDate(this.DateService.dateConvert(new Date(this.todayDate)))){
  const obj = {
    "SP_String": "SP_Outlet_Txn_Bank_Deposit",
    "Report_Name_String": "Add_update_Outlet_Txn_Bank_Deposit",
    "Json_Param_String": JSON.stringify([tempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //console.log(data);
    var tempID = data[0].Txn_ID;
    if(data[0].Txn_ID){
      this.compacctToast.clear();
      const mgs = this.buttonname === 'Save' ? "Saved" : "updated";
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Txn_ID  " + tempID,
       detail: "Succesfully " + mgs
     });
     this.clearData();
     this.tabIndexToView = 0;
     this.GetSearchedList(true);

    } else{
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
    }
  })
  } else{
    this.Spinner = false;
  }
}
getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowse.start_date = dateRangeObj[0];
    this.ObjBrowse.end_date = dateRangeObj[1];
  }
}
GetSearchedList(valid){
  //console.log(valid)
  this.SearchFormSubmitted = true;
  this.Searchedlist = [];
const start = this.ObjBrowse.start_date
? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
: this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
: this.DateService.dateConvert(new Date());
if(valid){
  this.seachSpinner = true;
const tempobj = {
From_date : start,
To_Date	 : end,
Cost_Cen_ID : this.ObjBrowse.Outlet,
//Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
}
const obj = {
"SP_String": "SP_Outlet_Txn_Bank_Deposit",
"Report_Name_String": "Browse_Outlet_Txn_Bank_Deposit",
"Json_Param_String": JSON.stringify([tempobj])
}
this.GlobalAPI.getData(obj).subscribe((data:any)=>{
 this.Searchedlist = data;
 console.log('Search list=====',this.Searchedlist)
 this.seachSpinner = false;
 this.SearchFormSubmitted = false;
})
}
}
getLockDate(){
  const obj = {
   "SP_String": "sp_Comm_Controller",
   "Report_Name_String": "Get_LockDate",
  }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  // console.log('LockDate===',data);
  this.lockdate = data[0].dated;
  // let tempDate:Date =  new Date(data[0].dated)
  // const tempTimeBill =  tempDate.setDate(tempDate.getDate() + 1);
  // this.minlockdate = new Date(tempTimeBill);

})
}
checkLockDate(docdate){
  if(this.lockdate && docdate){
    if(new Date(docdate) > new Date(this.lockdate)){
      return true;
    } else {
      var msg = this.tabIndexToView === 0 ? "edit or delete" : "create";
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "error",
       summary: "Warn Message",
       detail: "Can't "+ msg +" this document. Transaction locked till "+ this.DateService.dateConvert(new Date (this.lockdate))
    });
      return false;
    }
  } else {
    this.Spinner = false;
    this.compacctToast.clear();
    this.compacctToast.add({
     key: "compacct-toast",
     severity: "error",
     summary: "Warn Message",
     detail: "Date not found."
    });
    return false;
  }
}
Edit(TxnId){
  // console.log("editmaster ==",DocNo);
 this.clearData();
 if(TxnId.Txn_ID){
  if(this.checkLockDate(TxnId.Date)){
 this.ObjBankTransfer.Txn_ID = TxnId.Txn_ID;
 this.tabIndexToView = 1;
 this.items = ["BROWSE", "UPDATE"];
 this.buttonname = "Update";
 // console.log("this.EditDoc_No ==", this.Objproduction.Doc_No);
 this.GetEdit(this.ObjBankTransfer.Txn_ID);
 //this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
  }
 }
}
 GetEdit(Txn_ID){
  this.editList = [];
  //this.ProductionFormSubmitted = false;
  const obj = {
    "SP_String": "SP_Outlet_Txn_Bank_Deposit",
    "Report_Name_String": "Get_Edit_Data_Outlet_Txn_Bank_Deposit",
    "Json_Param_String": JSON.stringify([{Txn_ID : this.ObjBankTransfer.Txn_ID}])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.editList = data;
     this.ObjBankTransfer.Transfer_To = data[0].Transfer_To;
     //this.myDate = data[0].Date;
     this.todayDate = data[0].Date;
     this.cashcollfromDate = data[0].cash_Form_Date;
     this.cashcollToDate = data[0].cash_To_Date;
     this.ObjBankTransfer.Amount = data[0].Amount;
     this.ObjBankTransfer.Ledger_ID = data[0].Ledger_ID;
     //this.ObjBankTransfer.Bank_Name = data[0].Bank_Name;
     this.ObjBankTransfer.Slip_No = data[0].Slip_No;
     this.SlipnoChange();
     this.ObjBankTransfer.Slip_No = data[0].Slip_No;
     this.ObjBankTransfer.Bank_Name = data[0].Bank_Name;
    console.log("this.editList  ===",data);
  // console.log("edit From_Process_IDe ===" , this.Objproduction.From_Process_ID)

})
}
Delete(TxnId){
  this.ObjBankTransfer.Txn_ID = undefined ;
  if(TxnId.Txn_ID){
    if(this.checkLockDate(TxnId.Date)){
  this.ObjBankTransfer.Txn_ID = TxnId.Txn_ID;
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
}
onConfirm() {
  const Tempobj = {
    Txn_ID : this.ObjBankTransfer.Txn_ID
  }
  const obj = {
    "SP_String" : "SP_Outlet_Txn_Bank_Deposit",
    "Report_Name_String" : "Delete_Outlet_Txn_Bank_Deposit",
    "Json_Param_String" : JSON.stringify([Tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   // console.log(data);
    if(data[0].Column1 === "Done") {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Txn_ID : " + this.ObjBankTransfer.Txn_ID,
        detail:  "Succesfully Delete"
      });
      this.GetSearchedList(true);
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
clearData(){
  this.ObjBankTransfer = new BankTransfer();
  this.DisableSlipno = false;
  this.DisableBank = false;
  this.ObjBankTransfer.Txn_ID = undefined;
  this.getbilldate();
  this.items = ["BROWSE", "CREATE"];
  this.buttonname = "Save";
  this.todayDate = new Date();
  this.cashcollfromDate = new Date();
  this.cashcollToDate = new Date();
  this.BankTransferFormSubmitted = false;
  this.Spinner = false;
}

}
class BankTransfer {
  Transfer_To : string;
  Amount : string;
  Ledger_ID  : any;
  Bank_Name : string;
  Slip_No : any;
  Txn_ID : any;
 }
 class Browse {
  start_date : Date ;
  end_date : Date;
  Outlet : string;
}
