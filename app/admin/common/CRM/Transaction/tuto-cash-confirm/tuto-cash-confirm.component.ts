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
  selector: 'app-tuto-cash-confirm',
  templateUrl: './tuto-cash-confirm.component.html',
  styleUrls: ['./tuto-cash-confirm.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoCashConfirmComponent implements OnInit {
  tabIndexToView = 0;
  brandInput = false ;
  items = [];
  buttonname = "Create";
  myDate : Date;
  menuList = [];
  REMARKS:any = "";
  UpdatecashFormSubmit = false;
  studentList = [];
  bankList = [];
  Ledger_ID = undefined;
  seachSpinner = false;
  start_date :any;
  end_date : any;
  start_date_Loan :any;
  end_date_Loan : any;
  loanstatusList = [];

  searchDataList = [];
  saveDataList = {};
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["PENDING DEPOSIT", "CONFIRMED DEPOSIT","LOAN STATUS"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Cash Deposit Confirmation",
      Link: "Channel Sale -> Subscription"
    });
    this.GetPendingData();
    this.GetBankData();
  this.myDate =  new Date();
  this.Ledger_ID = this.bankList.length === 1 ? this.bankList[0].Ledger_ID : undefined;
  }
  onConfirm(){
     const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "CONFIRM_DISTRIBUTOR_DEPOSIT",
      "Json_Param_String": JSON.stringify([this.saveDataList])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      const temp = data[0].Remarks;
      console.log("temp",temp);
      if(temp =='success'){
        console.log("save",data);
        this.GetPendingData();
        this.onReject();
      }

    })
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.brandInput = false ;
    this.items = ["PENDING DEPOSIT", "CONFIRMED DEPOSIT","LOAN STATUS"];
    this.buttonname = "Create";
    this.GetSearchFormData();
    this.clearData();
    // console.log("tabclick",this.ObjmasterProduct);
  }
  clearData(){
    this.Ledger_ID = this.bankList.length === 1 ? this.bankList[0].Ledger_ID : undefined;
    this.UpdatecashFormSubmit = false;
  }
  getPendingDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      // this.PendingsearchObj.start_date = dateRangeObj[0];
      // this.PendingsearchObj.end_date = dateRangeObj[1];
      this.start_date = dateRangeObj[0];
      this.end_date = dateRangeObj[1];
    }
  }
  getloanDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      // this.PendingsearchObj.start_date = dateRangeObj[0];
      // this.PendingsearchObj.end_date = dateRangeObj[1];
      this.start_date_Loan = dateRangeObj[0];
      this.end_date_Loan = dateRangeObj[1];
    }
  }
  GetPendingData(){
   const TempObj = {
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "GET_DISTRIBUTOR_PENDING",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.studentList = data;
      console.log("this.studentList",this.studentList);
    })
  }
  GetBankData(){
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "GET_DISTRIBUTOR_DEPOSIT_BANK"
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.bankList = data;
        this.Ledger_ID = this.bankList.length === 1 ? this.bankList[0].Ledger_ID : undefined;
        console.log("this.bankList",this.bankList);
      })
  }
  saveData(col,valid){
    this.saveDataList = {};
    this.UpdatecashFormSubmit = true;
    if(valid) {
      this.UpdatecashFormSubmit = false;
      console.log("saveData",col);
     this.saveDataList = {
      Txn_ID : col.Txn_ID,
      Ledger_ID : this.Ledger_ID,
      Remarks : this.REMARKS,
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID
    }

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
 GetSearchFormData(){
  const start = this.start_date
  ? this.DateService.dateConvert(new Date(this.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.end_date
  ? this.DateService.dateConvert(new Date(this.end_date))
  : this.DateService.dateConvert(new Date());
   const tempObj ={
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
    Start_Date : start,
    End_Date : end
   }
   const obj = {
    "SP_String": "Tutopia_Subscription_Accounts",
    "Report_Name_String": "GET_DISTRIBUTOR_CONFIRM",
    "Json_Param_String": JSON.stringify([tempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("SearchForm",data);
    this.searchDataList = data;
  })
 }
 GetLoanData(){
  const start = this.start_date_Loan
  ? this.DateService.dateConvert(new Date(this.start_date_Loan))
  : this.DateService.dateConvert(new Date());
const end = this.end_date_Loan
  ? this.DateService.dateConvert(new Date(this.end_date_Loan))
  : this.DateService.dateConvert(new Date());
  const tempObj ={
   User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
   Start_Date : start,
   End_Date : end
  }
  const obj = {
   "SP_String": "Tutopia_Subscription_Accounts",
   "Report_Name_String": "GET_LOAN_STATUS_DISTRIBUTOR",
   "Json_Param_String": JSON.stringify([tempObj])
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   console.log("loanstatusList",data);
   this.loanstatusList = data;
 })
}
 printOut(order_no){
  console.log("Print");
 window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + order_no, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
}

}
