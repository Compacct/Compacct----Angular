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
import { NUMBER_TYPE, THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  LedgerListLow:any = [];
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
  costTrnList:any = [];
  seachSpinner:boolean = false
  JournalSearchFormSubmit:boolean = false;
  journallowerFormSubmitted:boolean = false;
  userType = "";
  BankTransactionTypeList:any = [];
  voucherminDate = new Date();
  vouchermaxDate = new Date();
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
      this.objjournal.DrCrdata = Number(this.VoucherTypeID) === 1 ? "DR" : Number(this.VoucherTypeID) === 2 ? "CR" : Number(this.VoucherTypeID) === 4 ? "DR" : "" 
      this.objjournalloweer.DrCrdataLower = this.objjournal.DrCrdata === "DR" ? "CR" : "DR" 
      if(this.VoucherTypeID){
        this.GetLedgerTop()
        this.GetLedgerlow()
      }
      if(Number(this.VoucherTypeID) == 4){
         this.GestCostHead();
      }
   
     })
  }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE","REPORT"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: this.headerText,
      Link: "Financial Management --> Transaction -> "+this.headerText
    });
    
    this.getcompany()
    this.GetCostCenter()
    this.Finyear()
    this.userType = this.$CompacctAPI.CompacctCookies.User_Type
    
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){}
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE","REPORT"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){
    this.journalFormSubmitted = false
    let backupobjjournal = {...this.objjournal}
    this.objjournal = new journalTopper()
    this.objjournal.DrCrdata = backupobjjournal.DrCrdata
    this.objjournal.Cost_Cen_ID_Trn  = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.objjournal.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
  }
  GetLedgerTop(){
    const obj = {
      "SP_String": "SP_Financial_Voucher",
      "Report_Name_String": "Get_Ledger",
      "Json_Param_String": JSON.stringify({Topper : 'Y',Type_ID: Number(this.VoucherTypeID)})
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log(data);
    this.LedgerList = data
    })
  }
  GetLedgerlow(){
    const obj = {
      "SP_String": "SP_Financial_Voucher",
      "Report_Name_String": "Get_Ledger",
      "Json_Param_String": JSON.stringify({Topper : 'N',Type_ID: Number(this.VoucherTypeID)})
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log(data);
    this.LedgerListLow = data
    })
  }
  getsubLedgertop(LedgerId:any){
    console.log("LedgerId",LedgerId)
    this.GetBankTransactionType(LedgerId)
    if(LedgerId && Number(this.VoucherTypeID) == 4){
      const obj = {
        "SP_String": "SP_Financial_Voucher",
        "Report_Name_String": "Get_Subledger_with_Ledger_ID",
        "Json_Param_String": JSON.stringify({ledger_id: Number(LedgerId)})
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.SubLedgerList = data
       console.log("SubLedgerList",this.SubLedgerList)
      })
    }
  }
  getTotalDRCR(){

  }
  getsubLedgerLow(LedgerId:any){
    if(LedgerId ){
      const obj = {
        "SP_String": "SP_Financial_Voucher",
        "Report_Name_String": "Get_Subledger_with_Ledger_ID",
        "Json_Param_String": JSON.stringify({ledger_id: Number(LedgerId)})
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.SubLedgerListlow = data
       console.log("SubLedgerListlow",this.SubLedgerListlow)
      })
    }
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
   getcompany(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Dropdown_Company",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.companyList = data
     console.log("companyList",this.companyList)
     this.objjournal.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    })
  }
  GetCostCenter(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Cost_Center_Details_Dropdown",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.costTrnList = data;
        this.objjournal.Cost_Cen_ID_Trn  = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     })
    }
  GestCostHead(){
    const obj = {
      "SP_String": "SP_Financial_Voucher",
      "Report_Name_String": "Cost_Head_Dropdown",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Cost Head",data);
      this.costHeadDataList = data
    })
  }
  GetBankTransactionType(LedgerId:any){
    if(LedgerId ){
      const obj = {
        "SP_String": "SP_Financial_Voucher",
        "Report_Name_String": "Get_Bank_Transaction_Type",
        "Json_Param_String": JSON.stringify({ledger_id: Number(LedgerId)})
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.BankTransactionTypeList = data
       console.log("BankTransactionTypeList",this.BankTransactionTypeList)
      })
    }
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      this.voucherminDate = new Date(data[0].Fin_Year_Start)
      this.vouchermaxDate = new Date(data[0].Fin_Year_End)
      console.log("voucherminDate",this.voucherminDate)

      });
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
  DrCrdata:string = "DR"
  DrCrdataLower = "CR"
  Amount:any
  Company_ID:any
  Ref_Doc_Type:any
  Txn_Type_Name:any
}
class search{
  Voucher_Type_ID:any
  Cost_Cen_ID	:any
  Start_date:any
  End_date:any
}