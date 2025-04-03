
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
  constructor(
        private Header: CompacctHeader,
        private GlobalAPI: CompacctGlobalApiService,
        private DateService: DateTimeConvertService,
        private $CompacctAPI: CompacctCommonApi,
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
  }

  onReject() {
    this.compacctToast.clear("c");
  }

  onConfirm(){}

  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.objsearch.Start_date = dateRangeObj[0];
      this.objsearch.End_date = dateRangeObj[1];
    }
  }

  GetCostCenter() {
    this.$http.get(this.url.apiGetCostCenter).subscribe((data:any)=>{
      this.costCenterList = data ? JSON.parse(data) : [];
      this.objsearch.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
  
     })
  }

  ShowSearchData(valid){
    this.searchFormSubmit = true;
    this.seachSpinner = true;
    if(valid){
     this.objsearch.Start_date = this.objsearch.Start_date
      ? this.DateService.dateConvert(new Date(this.objsearch.Start_date))
      : this.DateService.dateConvert(new Date());
      this.objsearch.End_date = this.objsearch.End_date
      ? this.DateService.dateConvert(new Date(this.objsearch.End_date))
      : this.DateService.dateConvert(new Date());
    
      const obj = {
        "SP_String": "Sp_Acc_Journal",
        "Report_Name_String": "BL_Txn_Acc_Journal_Browse",
        "Json_Param_String" : JSON.stringify([this.objsearch])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("all Data",data);
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

  }
}


class search{
  Cost_Cen_ID	:any
  Start_date:any
  End_date:any
}

class pettyCash{
  Cost_Cen_ID	:any
  Voucher_No	:any
  Voucher_Date	:any
  Cost_Cen_ID_Trn:any
  Ledger_ID:any
  Amount	:any
  Balance:any
}

class pettyCashLower{
  Cost_Cen_ID	:any
  Voucher_No	:any
  Voucher_Date	:any
  Cost_Cen_ID_Trn:any
  Ledger_ID:any
  Amount	:any
  Balance:any
}