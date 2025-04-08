
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MessageService } from "primeng/api";
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { AnyNsRecord } from 'dns';
@Component({
  selector: 'app-bl-txn-petty-cash-voucher',
  templateUrl: './bl-txn-petty-cash-voucher.component.html',
  styleUrls: ['./bl-txn-petty-cash-voucher.component.css'],
    providers: [MessageService],
    encapsulation: ViewEncapsulation.None
})
export class BlTxnPettyCashVoucherComponent implements OnInit {

  url = window["config"];

  items:any = [];
  menuList:any = [];
  tabIndexToView = 0;
  buttonname = "Create";
  seachSpinner = false;
  objpettyCash:pettyCash = new pettyCash() 
  pettyCashFormSubmit:boolean = false;
  voucherdata = new Date();

  objsearch:search = new search();
  searchFormSubmit:boolean = false;
  costCenterList:any[] = []
  AllsearchData:any[] = []
  DynamicHeader:any[] = []

  LedgerList:any[] = []
  billdata =new Date()

  ExpenseHeadLedgerList:any[] = []
  pettyCashlowerFormSubmit:boolean = false;
  objpettyCashLower:pettyCashLower = new pettyCashLower() 
  lowerList:any = [];
  Spinner:boolean = false;
  voucherNo:any;
  constructor(
        private Header: CompacctHeader,
        private GlobalAPI: CompacctGlobalApiService,
        private DateService: DateTimeConvertService,
        public $CompacctAPI: CompacctCommonApi,
        private compacctToast: MessageService,
        private route: ActivatedRoute,
        private ngxService: NgxUiLoaderService,
        private $http: HttpClient,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE", "DIAGNOSIS"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: 'Petty Cash',
      Link: "Sales & Distribution --> Petty Cash"
    });

   this.GetCostCenter()
   this.Getcashledger()
   this.GetExpenseHeadLedger()
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){
    this.buttonname = "Create";
    this.items = ["BROWSE", "CREATE"];
    this.objpettyCash = new pettyCash();
    this.pettyCashFormSubmit = false;
    this.voucherdata = new Date();
    this.objpettyCashLower = new pettyCashLower();
    this.lowerList = [];
    this.objpettyCash.Cost_Cen_ID_Trn = this.$CompacctAPI.CompacctCookies.User_Type != 'A' ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  DeleteVoucher(val): void{
    this.voucherNo = undefined
   if(val.Voucher_No){
     this.voucherNo = val.Voucher_No
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
    if(this.voucherNo){
      const tempobj = {
        Voucher_No : this.voucherNo
      }
      const obj = {
        "SP_String": "SP_Petty_Cash_Voucher",
        "Report_Name_String": "Delete_Payment_Voucher",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("del Data===", data[0].Column1)
        if (data[0].Result === "Done"){
          this.onReject();
          this.ShowSearchData(true)
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Voucher_No: " + this.voucherNo.toString(),
            detail: "Succesfully Deleted"
          });
          this.voucherNo = undefined ;
         }
      })
    }
  }
  Print(obj){
    if (obj.Voucher_No) {
      window.open("/Report/Crystal_Files/Finance/Voucher/Petty_Cash_Voucher.html?Voucher_No=" + obj.Voucher_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  
      );
    }
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.objsearch.From_Date = dateRangeObj[0];
      this.objsearch.To_Date = dateRangeObj[1];
    }
  }
  GetCostCenter() {
    this.$http.get(this.url.apiGetCostCenter).subscribe((data:any)=>{
      this.costCenterList = data ? JSON.parse(data) : [];
      this.objsearch.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
      this.objpettyCash.Cost_Cen_ID_Trn = this.$CompacctAPI.CompacctCookies.User_Type != 'A' ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
  
     })
  }
  ShowSearchData(valid){
    this.searchFormSubmit = true;
    this.seachSpinner = true;
    if(valid){
     this.seachSpinner = false;
     this.objsearch.From_Date = this.objsearch.From_Date
      ? this.DateService.dateConvert(new Date(this.objsearch.From_Date))
      : this.DateService.dateConvert(new Date());
      this.objsearch.To_Date = this.objsearch.To_Date
      ? this.DateService.dateConvert(new Date(this.objsearch.To_Date))
      : this.DateService.dateConvert(new Date());
    
      const obj = {
        "SP_String": "SP_Petty_Cash_Voucher",
        "Report_Name_String": "Get_Payment_Voucher_Browse",
        "Json_Param_String" : JSON.stringify([this.objsearch])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //  console.log("all Data",data);
       this.AllsearchData = data;
       this.seachSpinner = false;
        if(this.AllsearchData.length){
          this.DynamicHeader = Object.keys(data[0]);
          this.seachSpinner = false;
        }
       })
    }
  }
  Getcashledger() {
    this.LedgerList = [];
    const obj = {
      "SP_String": "SP_Petty_Cash_Voucher",
      "Report_Name_String": "Get_cash_ledger",   
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.LedgerList = data ;
        this.LedgerList.forEach(el => {
       
            el['label']= el.Ledger_Name,
            el['value']= el.Ledger_ID
          
         
        });
        
    })
 
  }
  GetExpenseHeadLedger() {
    this.ExpenseHeadLedgerList = [];
    const obj = {
      "SP_String": "SP_Petty_Cash_Voucher",
      "Report_Name_String": "Get_expense_head_ledger",   
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ExpenseHeadLedgerList = data ;
        this.ExpenseHeadLedgerList.forEach(el => {
          el['label']= el.Ledger_Name,
          el['value']= el.Ledger_ID
        });
        
    })
 
  }
  changesubLedgertop(LedgerID:AnyNsRecord){
   this.GetBalance();
  }
  GetBalance(){
    if(this.objpettyCash.Ledger_ID){
      const tempobj = {
        Ledger_ID : this.objpettyCash.Ledger_ID
      }
      const obj = {
        "SP_String": "SP_Petty_Cash_Voucher",
        // "Report_Name_String": "Delete_Payment_Voucher",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.objpettyCash.Balance = 1000;
      })
    }
  }
  AddDetails(valid){
  this.pettyCashlowerFormSubmit = true;
  if(valid){
    const ledgername:any = this.ExpenseHeadLedgerList.filter((el:any)=>Number(el.Ledger_ID) === Number(this.objpettyCashLower.Ledger_ID));
      const obj = {
        Voucher_No : "",
        Voucher_Date : this.DateService.dateConvert(new Date(this.voucherdata)),
        Ledger_ID : this.objpettyCashLower.Ledger_ID,
        Ledger_Name : ledgername[0].Ledger_Name,
        Fin_Year_ID : Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID),
        DR_Amt : Number(this.objpettyCashLower.Amount),
        CR_Amt : 0,
        Cost_Cen_ID : this.objpettyCash.Cost_Cen_ID_Trn,
        Cost_Cen_ID_Trn : this.objpettyCash.Cost_Cen_ID_Trn,
        User_ID : Number(this.$CompacctAPI.CompacctCookies.User_ID),
        bill_ref_no_for_petty : this.objpettyCashLower.bill_ref_no_for_petty,
        bill_ref_date_petty : this.DateService.dateConvert(new Date(this.billdata)),
        remarks_for_petty : this.objpettyCashLower.remarks_for_petty ? this.objpettyCashLower.remarks_for_petty : '',
        Is_Topper:"N",
      }
      this.lowerList.push(obj)
      this.GetTotalCrAmt();
      this.pettyCashlowerFormSubmit = false;
      this.objpettyCashLower = new pettyCashLower();
  
  }
  }
  GetTotalCrAmt(){
    let flg:Number = 0
    this.lowerList.forEach(ele => {
      flg += ele.DR_Amt
    });
     return Number(Number(flg).toFixed())
  }
  DeleteProduct(index){
    this.lowerList.splice(index, 1);
  }
  SavePettyCash(valid){
    this.pettyCashFormSubmit = true
    if(valid){
      this.pettyCashFormSubmit = false
      if(this.GetTotalCrAmt() <= Number(this.objpettyCash.Balance)){
        let topperList:any = [];
        const ledgername:any = this.LedgerList.filter((el:any)=>Number(el.Ledger_ID) === Number(this.objpettyCash.Ledger_ID));
        const topperobj = {
          Voucher_No : "",
          Voucher_Date : this.DateService.dateConvert(new Date(this.voucherdata)),
          Ledger_ID : this.objpettyCash.Ledger_ID,
          Ledger_Name : ledgername[0].Ledger_Name,
          Fin_Year_ID : Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID),
          DR_Amt : 0,
          CR_Amt : this.GetTotalCrAmt(),
          Cost_Cen_ID : this.objpettyCash.Cost_Cen_ID_Trn,
          Cost_Cen_ID_Trn : this.objpettyCash.Cost_Cen_ID_Trn,
          User_ID : Number(this.$CompacctAPI.CompacctCookies.User_ID),
          bill_ref_no_for_petty : '',
          bill_ref_date_petty : '',
          remarks_for_petty : '',
          Is_Topper:"Y",
        }
        topperList.push(topperobj);
        let combinedList = topperList.concat(this.lowerList);
        let reportname = ""
        let mes = ""
      if(this.voucherNo){
        // reportname = "BL_Txn_Acc_Journal_Update"
        // mes = "Update"
        // this.objpettyCash.Voucher_No = this.voucherNo
      }
      else {
        reportname = "Create_Payment_Voucher"
        mes = "Create"
      }
      // console.log('Save Data===',JSON.stringify(combinedList));
      const obj = {
        "SP_String": "SP_Petty_Cash_Voucher",
        "Report_Name_String": reportname,
        "Json_Param_String": JSON.stringify(combinedList)
       }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        console.log("Final save data ==",data);
        if (data[0].Voucher_No){
          this.items = ["BROWSE", "CREATE"];
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Voucher "+mes,
            detail: "Succesfully " 
          });
          }
          this.Spinner = false;
          this.tabIndexToView = 0;
          this.voucherNo = ""
          this.pettyCashFormSubmit = false;
          this.objpettyCash = new pettyCash();
          this.clearData()
          this.ShowSearchData(true)
        });
    }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error Occured",
        detail: "Total CR amount is greater than balance."
        // key: "c",
        // sticky: true,
        // severity: "error",
        // summary: "Total Dr Amount and Cr Amount not match",
       // detail: "Confirm to proceed"
      });
    }
  }
  }
}


class search{
  Cost_Cen_ID	:any
  From_Date:any
  To_Date:any
}

class pettyCash{
  Cost_Cen_ID	:any
  Voucher_No	:any
  Voucher_Date	:any
  Cost_Cen_ID_Trn:any
  Ledger_ID:any
  Amount	:any
  Balance:any
  Fin_Year_ID:any
  DR_Amt:any
  CR_Amt:any
  User_ID:any
  Is_Topper:string = "Y"
}

class pettyCashLower{
  Cost_Cen_ID	:any
  Voucher_No	:any
  Voucher_Date	:any
  Cost_Cen_ID_Trn:any
  Ledger_ID:any
  Amount	:any
  Balance:any
  bill_ref_no_for_petty:any
  bill_ref_date_petty:any
  remarks_for_petty:any
}