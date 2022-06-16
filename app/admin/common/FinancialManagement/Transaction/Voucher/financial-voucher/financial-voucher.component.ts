import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MessageService } from "primeng/api";
import { Console } from 'console';
import { CompacctGlobalUrlService } from '../../../../../shared/compacct.global/global.service.service';
import { CompacctHeader } from '../../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from '../../../../../shared/compacct.services/common.api.service';
import { DateTimeConvertService } from '../../../../../shared/compacct.global/dateTime.service';
import { ActivatedRoute } from '@angular/router';
import { identity } from 'rxjs';
import { NUMBER_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-financial-voucher',
  templateUrl: './financial-voucher.component.html',
  styleUrls: ['./financial-voucher.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FinancialVoucherComponent implements OnInit {
  items:any = [];
  menuList:any = [];
  tabIndexToView:number = 0;
  buttonname:string = "Create";
  Spinner:boolean = false;
  VoucherTypeID:any = undefined;
  objjournal:journalTopper = new journalTopper();
  objjournalloweer:journalTopper = new journalTopper();
  objsearch:search = new search();
  voucherdata:Date = new Date();
  journalFormSubmitted:boolean = false;
  costHeadList:any = [];
  LedgerList:any = [];
  SubLedgerList:any = [];
  costHeadDataList:any = [];
  projectDataList:any = [];
  NEFTDate:Date = new Date();
  SubLedgerListlow:any = [];
  RefDocDate:Date = new Date();
  lowerList:any = [];
  totalDR:number = 0;
  totalCR:number = 0;
  companyList:any = [];
  headerText:string = "";
  initDate:any = [];
  VoucherTypeList:any = [];
  seachSpinner:boolean = false
  JournalSearchFormSubmit:boolean = false;
  journallowerFormSubmitted:boolean = false;
  
  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
  ) { 
    this.route.queryParams.subscribe(params => {
      console.log("params",params.Voucher_Type_ID);
      this.VoucherTypeID = params.Voucher_Type_ID
      this.headerText = Number(this.VoucherTypeID) === 1 ? "Receive Voucher" : Number(this.VoucherTypeID) === 2 ? "Payment Voucher" : Number(this.VoucherTypeID) === 4 ? "Journal Voucher" : "" 
     })
  }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: this.headerText,
      Link: "Financial Management --> Transaction -> "+this.headerText
    });
    this.objjournal.DrCrdata = Number(this.VoucherTypeID) === 1 ? "DR" : Number(this.VoucherTypeID) === 2 ? "CR" : Number(this.VoucherTypeID) === 4 ? "DR" : "" 
    this.objjournalloweer.DrCrdataLower = this.objjournal.DrCrdata === "DR" ? "CR" : "DR"
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){}
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){

  }
  getsubLedgertop(Ledger:any){

  }
  getTotalDRCR(){

  }
  getsubLedger(ledger:any){

  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      console.log("dateRangeObj",dateRangeObj);
      this.objsearch.Start_date = dateRangeObj[0];
      this.objsearch.End_date = dateRangeObj[1];
    }
  }
  ShowSearchData(valid){

  }
  getToFix(number){
    if(number){
     return Number(Number(number).toFixed(2))
    }
   }
}
class journalTopper{
  User_ID:any;
  Voucher_No:any
  Voucher_Type_ID:any;
  Voucher_Date:any;
  Ledger_ID:any;
  Sub_Ledger_ID:any;
  Cost_Cen_ID:any;
  Cost_Cen_ID_Trn:any;
  Cost_Head_ID:any;
  DR_Amt:any;
  CR_Amt:any;
  Naration:any;
  Project_ID:any;
  Ref_Doc_No:any;
  Ref_Doc_Date:any;
  HSN_NO:any;
  GST_Per	:any;
  ITC_Eligibility	:any;
  DrCrdata = "DR"
  DrCrdataLower = "CR"
  Amount:any
  Company_ID:any
}
class search{
  Voucher_Type_ID:any
  Cost_Cen_ID	:any
  Start_date:any
  End_date:any
}