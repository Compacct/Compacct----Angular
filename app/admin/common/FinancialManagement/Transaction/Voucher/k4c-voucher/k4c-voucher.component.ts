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
  selector: 'app-k4c-voucher',
  templateUrl: './k4c-voucher.component.html',
  styleUrls: ['./k4c-voucher.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cVoucherComponent implements OnInit {
  items:any = [];
  menuList:any = [];
  tabIndexToView = 0;
  buttonname = "Create";
  seachSpinner = false;
  objjournal:journalTopper = new journalTopper();
  objjournalloweer:journalTopper = new journalTopper();
  objsearch:search = new search();
  journalFormSubmitted = false;
  voucherdata = new Date();
  costCentList:any = [];
  costHeadList:any = [];
  NEFTDate = new Date();
  journallowerFormSubmitted = false;
  Spinner = false;
  lowerList:any = [];
  LedgerList:any = [];
  SubLedgerList:any =[];
  LedgerdataList:any = [];
  SubLedgerDataList:any = [];
  SubLedgerDataListlow:any = [];
  SubLedgerListlow:any = [];
  JournalSearchFormSubmit = false;
  initDate:any = [];
  VoucherTypeList:any = [];
  AlljournalData:any = [];
  totalDR:number = 0;
  totalCR:number= 0;
  RefDocDate = new Date();
  VoucherNo = undefined;
  costHeadDataList:any = [];
  costCenterDataList:any = [];
  projectDataList:any = [];
  DynamicHeader:any = [];
  VoucherTypeID = undefined;
  headerText:string = "";
  DocumentTypeList:any = [];
  RefDocumentList:any = [];
  BankTransactionTypeList:any = [];
  labelText1:string = ""
  labelText2:string = ""
  labelText3:string = ""
  labelText4:string = ""
  buttondisabled:boolean = true;
  diagnosiscostHeadList:any = [];
  From_Date: any;
  To_Date: any;
  Cost_Cen_ID:any;
  GridList:any = [];
  GridListHeader:any = [];

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
      this.headerText = Number(this.VoucherTypeID) === 1 ? "Receive Voucher" : Number(this.VoucherTypeID) === 2 ? "Payment Voucher" : Number(this.VoucherTypeID) === 3 ? "Contra Voucher" : ""
      
     })
   }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE", "DIAGNOSIS"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: this.headerText,
      Link: "Financial Management --> Transaction ->" + this.headerText
    });
    this.Getledger();
    this.getCostCenter();
    this.getVoucherType();
    this.GetCostHead();
    this.getProject();
    this.GetdiagnosisCostCenter();
    this.gettoCostCentercontra();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE", "DIAGNOSIS"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){
    this.journallowerFormSubmitted = false;
    this.journalFormSubmitted = false;
    this.objjournal = new journalTopper()
    this.getTotalDRCR();
    this.lowerList = [];
    this.RefDocDate = new Date();
    this.voucherdata = new Date();
    this.buttonname = "Create";
    this.seachSpinner = false;
    this.objjournal = new journalTopper();
    this.journalFormSubmitted = false;
    this.VoucherNo = undefined;
    this.objjournal.Cost_Cen_ID_Trn = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.objsearch.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.totalDR = undefined;
    this.totalCR = undefined;
    // this.initDate = [new Date(),new Date()];
    this.getCostCenter();
    // this.AlljournalData = [];
    // this.objsearch.Voucher_Type_ID = undefined
    this.Spinner = false;
    this.buttondisabled = true;
    this.objjournalloweer.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  }
  GetBankTransactionType(LedgerId:any){
    // this.objjournal.Bank_Txn_Type = undefined;
    this.BankTransactionTypeList = [];
    if(LedgerId ){
      const obj = {
        "SP_String": "SP_Financial_Voucher",
        "Report_Name_String": "Get_Bank_Txn_Type",
        "Json_Param_String": JSON.stringify([{ledger_id: Number(LedgerId)}])
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.BankTransactionTypeList = data
       console.log("BankTransactionTypeList",this.BankTransactionTypeList)
      })
    }
  }
  convartNumber(n:any){
    return typeof(n) === "number" ? n : Number(n)
    }
    getBankTRNType(id:any){
      console.log("Type Check",typeof(id));
      if(id){
        this.objjournal.Cheque_No = undefined
        this.NEFTDate = new Date()
        this.objjournal.Bank_Name = undefined
        this.objjournal.Bank_Branch_Name = undefined
        if(Number(id) === 1){
          this.labelText1 = "Transaction No"
          this.labelText2 = "Transaction Date"
          this.labelText3 = "Bank Name"
          this.labelText4 = "Bank Branch Name"
        }
        else if(Number(id) === 2){
          this.labelText1 = ""
          this.labelText2 = ""
          this.labelText3 = ""
          this.labelText4 = ""
        }
        else if(Number(id) === 3){
          this.labelText1 = "Cheque No"
          this.labelText2 = "Cheque Date"
          this.labelText3 = "Bank Name"
          this.labelText4 = "Bank Branch Name"
        }
        else if(Number(id) === 4){
          this.labelText1 = "NEFT No"
          this.labelText2 = "NEFT Date"
          this.labelText3 = ""
          this.labelText4 = ""
        }
        else if(Number(id) === 6){
          this.labelText1 = "Transaction No"
          this.labelText2 = "Transaction Date"
          this.labelText3 = "Card Issue Bank"
          this.labelText4 = ""
        }
        else if(Number(id) === 7){
          this.labelText1 = "Transaction No"
          this.labelText2 = "Transaction Date"
          this.labelText3 = ""
          this.labelText4 = ""
        }
        else if(Number(id) === 5){
          this.labelText1 = "Transaction No"
          this.labelText2 = "Transaction Date"
          this.labelText3 = "Finance"
          this.labelText4 = ""
        }
      }
    }
    getBankTRNTypeforedit(id:any){
      console.log("Type Check",typeof(id));
      if(id){
        if(Number(id) === 1){
          this.labelText1 = "Transaction No"
          this.labelText2 = "Transaction Date"
          this.labelText3 = "Bank Name"
          this.labelText4 = "Bank Branch Name"
        }
        else if(Number(id) === 2){
          this.labelText1 = ""
          this.labelText2 = ""
          this.labelText3 = ""
          this.labelText4 = ""
        }
        else if(Number(id) === 3){
          this.labelText1 = "Cheque No"
          this.labelText2 = "Cheque Date"
          this.labelText3 = "Bank Name"
          this.labelText4 = "Bank Branch Name"
        }
        else if(Number(id) === 4){
          this.labelText1 = "NEFT No"
          this.labelText2 = "NEFT Date"
          this.labelText3 = ""
          this.labelText4 = ""
        }
        else if(Number(id) === 6){
          this.labelText1 = "Transaction No"
          this.labelText2 = "Transaction Date"
          this.labelText3 = "Card Issue Bank"
          this.labelText4 = ""
        }
        else if(Number(id) === 7){
          this.labelText1 = "Transaction No"
          this.labelText2 = "Transaction Date"
          this.labelText3 = ""
          this.labelText4 = ""
        }
        else if(Number(id) === 5){
          this.labelText1 = "Transaction No"
          this.labelText2 = "Transaction Date"
          this.labelText3 = "Finance"
          this.labelText4 = ""
        }
      }
    }
  GetSameCostCenANDledger() {
    if (this.VoucherTypeID != 3) {
    const sameCostCenWithSameLedger = this.lowerList.filter(item=> Number(item.Sub_Ledger_ID) === Number(this.objjournalloweer.Sub_Ledger_ID) && Number(item.Ledger_ID) === Number(this.objjournalloweer.Ledger_ID));
    if(sameCostCenWithSameLedger.length) {
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Same combination can't be added."
          });
      return false;
    }
    else {
      return true;
    }
  }
  if (this.VoucherTypeID == 3) {
    const sameCostCenWithSameLedger = this.lowerList.filter(item=> Number(item.Cost_Cen_ID) === Number(this.objjournalloweer.Cost_Cen_ID) && Number(item.Ledger_ID) === Number(this.objjournalloweer.Ledger_ID));
    if(sameCostCenWithSameLedger.length) {
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Same combination can't be added."
          });
      return false;
    }
    else {
      return true;
    }
  }
  }
  lowerAdd(valid){
    this.journallowerFormSubmitted = true;
    console.log("valid",valid);
   if(valid && this.GetSameCostCenANDledger()){
     let sl = 1
    let LedgerFilter = this.LedgerdataList.filter((el) => el.Ledger_ID == Number(this.objjournalloweer.Ledger_ID));
    let LedgersubFilter = this.SubLedgerDataListlow.filter((el) => el.Sub_Ledger_ID == Number(this.objjournalloweer.Sub_Ledger_ID));
    let costCernterFilter = this.costHeadDataList.filter((el)=>el.Cost_Head_ID === Number(this.objjournalloweer.Cost_Head_ID))
    let costcentname = this.costCenterDataList.filter((el)=>el.Cost_Cen_ID === Number(this.objjournalloweer.Cost_Cen_ID))
    console.log("this.objjournalloweer.ITC_Eligibility",this.objjournalloweer.ITC_Eligibility);
    var cramt;
    var dramt;
    if (this.VoucherTypeID == 3) {
      dramt = this.objjournalloweer.DR_Amt;
      cramt = 0;
    } else {
      dramt = this.objjournalloweer.DrCrdata === "DR" ? Number(Number(this.objjournalloweer.Amount).toFixed(2)) : 0,
      cramt = this.objjournalloweer.DrCrdata === "CR" ? Number(Number(this.objjournalloweer.Amount).toFixed(2)) : 0;
    }
    this.lowerList.push({
     Slno: this.lowerList.length + 1,
     Ledger_ID: Number(this.objjournalloweer.Ledger_ID),
     Cost_Cen_ID: this.VoucherTypeID == 3 ? this.objjournalloweer.Cost_Cen_ID : 0,
     Cost_Cen_Name: costcentname.length ? costcentname[0].Cost_Cen_Name : undefined,
     Ledger_Name : LedgerFilter[0].Ledger_Name,
     Sub_Ledger_ID : Number(this.objjournalloweer.Sub_Ledger_ID),
     Sub_Ledger_Name : LedgersubFilter.length ? LedgersubFilter[0].Sub_Ledger_Name : "",
     Adjustment_Doc_No: this.objjournalloweer.Ref_Doc_No,
     DR_Amt : dramt,
     CR_Amt: cramt,
     Cost_Head_ID : Number(this.objjournalloweer.Cost_Head_ID),
     Cost_Head_Name : costCernterFilter.length ? costCernterFilter[0].Cost_Head_Name : "",
     Ref_Doc_No : this.objjournalloweer.Ref_Doc_No,
     Ref_Doc_Date : this.objjournalloweer.Ref_Doc_No ?  this.DateService.dateConvert(new Date(this.RefDocDate)) : "01/Jan/1900",
     HSN_NO : this.objjournalloweer.HSN_NO,
     GST_Per : Number(this.objjournalloweer.GST_Per),
     ITC_Eligibility : this.objjournalloweer.ITC_Eligibility ? this.objjournalloweer.ITC_Eligibility : "",
     Fin_Year_ID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
     Is_Topper: "N"
      })
      console.log("lowerList",this.lowerList)
    this.journallowerFormSubmitted = false;
    this.objjournalloweer = new journalTopper()
    this.getTotalDRCR();
   }

  }
  Getledger() {
    this.LedgerList = [];
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Master_Accounting_Ledger_Dropdown",   
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.LedgerdataList = data ;
      console.log("LedgerList",this.LedgerdataList);
        this.LedgerdataList.forEach(el => {
          this.LedgerList.push({
            label: el.Ledger_Name,
            value: el.Ledger_ID
          });
         
        });
        
    })
 
  }
 getsubLedgertop(id,subID?){
  this.GetBankTransactionType(id);
  if(id){
    this.SubLedgerList = [];
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Accounting_Sub_Ledger_Dropdown",
      "Json_Param_String": JSON.stringify([{Ledger_ID : id}])      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.SubLedgerDataList = data;
     
      console.log("SubLedgerList",this.SubLedgerDataList);
      this.SubLedgerDataList.forEach(el => {
        this.SubLedgerList.push({
            label: el.Sub_Ledger_Name,
            value: el.Sub_Ledger_ID
          });
         
        });
        if(subID){
          this.objjournal.Sub_Ledger_ID = undefined;
          setTimeout(()=>{
            this.objjournal.Sub_Ledger_ID = Number(subID);
            console.log("fun sub",this.objjournal.Sub_Ledger_ID);
          },900)
        }
        
      
    })
    
  }
 
 }
 getsubLedger(id){
  if(id){
    this.SubLedgerListlow = [];
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Accounting_Sub_Ledger_Dropdown",
      "Json_Param_String": JSON.stringify([{Ledger_ID : id}])      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.SubLedgerDataListlow = data;
     
      console.log("SubLedgerDataListlow",this.SubLedgerDataListlow);
      this.SubLedgerDataListlow.forEach(el => {
        this.SubLedgerListlow.push({
            label: el.Sub_Ledger_Name,
            value: el.Sub_Ledger_ID
          });
         
        });
       
    })
  }
 
 }
 getCostCenter(){
  const obj = {
    "SP_String": "sp_Comm_Controller",
    "Report_Name_String": "Get_Master_Cost_Center_Dropdown",
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log(data);
    this.costHeadList = data;
    this.objsearch.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    this.objjournal.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    console.log("costHeadList",this.costHeadList);
   })
 }
 gettoCostCentercontra(){
  const obj = {
    "SP_String": "sp_Comm_Controller",
    "Report_Name_String": "Get_Master_Cost_Center_Dropdown",
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.costCenterDataList = data;
   })
 }
 DeleteProduct(index) {
  this.lowerList.splice(index,1);
  this.getTotalDRCR();
}
getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    console.log("dateRangeObj",dateRangeObj);
    this.objsearch.Start_date = dateRangeObj[0];
    this.objsearch.End_date = dateRangeObj[1];
  }
}
ShowSearchData(valid){
  this.JournalSearchFormSubmit = true;
  this.seachSpinner = true;
  if(valid){
   this.objsearch.Start_date = this.objsearch.Start_date
    ? this.DateService.dateConvert(new Date(this.objsearch.Start_date))
    : this.DateService.dateConvert(new Date());
    this.objsearch.End_date = this.objsearch.End_date
    ? this.DateService.dateConvert(new Date(this.objsearch.End_date))
    : this.DateService.dateConvert(new Date());
    let saveData = {
      Voucher_Type_ID: Number(this.VoucherTypeID),
      Cost_Cen_ID: this.objsearch.Cost_Cen_ID,
      Satrt_date: this.objsearch.Start_date,
      End_date: this.objsearch.End_date
    }
    const obj = {
      "SP_String": "Sp_Acc_Journal",
      "Report_Name_String": "BL_Txn_Acc_Journal_Browse",
      "Json_Param_String" : JSON.stringify([saveData])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("all Data",data);
     this.AlljournalData = data;
     this.seachSpinner = false;
      if(this.AlljournalData.length){
        this.DynamicHeader = Object.keys(data[0]);
        this.seachSpinner = false;
      }
     })
  }
}
Print(obj) {
  //console.log("billno ===", true)
  if (obj.Voucher_No) {
    window.open("/Report/Crystal_Files/Finance/Voucher/report_voucher_print.aspx?Doc_No=" + obj.Voucher_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
}
getTotalDRCR(){
  this.totalDR = 0;
  this.totalCR = 0;
  if(this.objjournal.DrCrdata === "DR" && this.objjournal.Amount){
    this.totalDR = Number(Number((this.objjournal.Amount)).toFixed(2));
    this.objjournalloweer.DrCrdata = "CR"
   }
   else if(this.objjournal.DrCrdata === "CR" && this.objjournal.Amount){
    this.totalCR = Number(Number((this.objjournal.Amount)).toFixed(2));
    this.objjournalloweer.DrCrdata = "DR"
   }
   else {
     console.log("objjournal.DrCrdata Not Found",this.objjournal.DrCrdata);
   }
 this.lowerList.forEach(el=>{
  this.totalDR += Number(Number(el.DR_Amt).toFixed(2));
  this.totalCR += Number(Number(el.CR_Amt).toFixed(2));
 })

 
}
getVoucherType(){
  this.VoucherTypeList = [];
  const obj = {
    "SP_String": "sp_Comm_Controller",
    "Report_Name_String": "Get_Master_Accouting_Journal_Type_Dropdown",
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log(data);
    data.forEach(el=>{
      if(el.Voucher_Type_ID === 4){
       this.VoucherTypeList.push({
        Voucher_Type_ID : el.Voucher_Type_ID,
        Voucher_Type : el.Voucher_Type

       })
      }
    })
    
   
   })
}
saveJournal(valid){
 console.log("save Valid",valid);
 this.journalFormSubmitted = true;
 if(valid){
    const bankListFilter = this.BankTransactionTypeList.filter((el:any)=> Number(el.Bank_Txn_Type_ID) === Number(this.objjournal.Bank_Txn_Type))[0]
    if(bankListFilter){
     this.objjournal.Bank_Txn_Type = bankListFilter.Txn_Type_Name
    }
    let msg = "";
    let rept = ""
    var cramt;
    var dramt;
    if (this.VoucherTypeID == 3) {
      dramt = 0;
      cramt = this.objjournal.CR_Amt;
    } else {
      dramt = this.objjournal.DrCrdata === "DR" ? Number(this.objjournal.Amount) : 0,
      cramt = this.objjournal.DrCrdata === "CR" ? Number(this.objjournal.Amount) : 0;
    }
   this.objjournal.DR_Amt = dramt
   this.objjournal.CR_Amt = cramt
   this.objjournal.Voucher_Type_ID = Number(this.VoucherTypeID)
   this.objjournal.Voucher_Date = this.DateService.dateConvert(this.voucherdata)
   this.objjournal.Fin_Year_ID = Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
   this.objjournal.User_ID = Number(this.$CompacctAPI.CompacctCookies.User_ID)
   this.objjournal.Posted_On = this.DateService.dateConvert(new Date())
   this.objjournal.Project_ID = this.objjournal.Project_ID ? Number(this.objjournal.Project_ID) : 0 
   this.objjournal.Cost_Cen_ID = Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID)
   this.objjournal.Cheque_Date = this.objjournal.Bank_Txn_Type == 2 ? this.DateService.dateConvert(new Date("01/01/1900")) : this.DateService.dateConvert(this.NEFTDate)
   this.objjournal.L_element = this.lowerList
   this.journalFormSubmitted = false
  console.log("this.objProject",this.objjournal)
  if(this.VoucherNo){
    msg = "Update"
    rept = "BL_Txn_Acc_Journal_Update"
    this.objjournal.Voucher_No = this.VoucherNo;
  }
  else{
    msg = "Craete"
    rept = "BL_Txn_Acc_Journal_Create"
  }
    const obj = {
      "SP_String": "Sp_Acc_Journal",
      "Report_Name_String": rept,
      "Json_Param_String" : JSON.stringify([this.objjournal])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     if(data[0].Column1 === "Done"){
      if(this.VoucherNo){
        this.tabIndexToView = 0;
        this.items = ["BROWSE", "CREATE", "DIAGNOSIS"];
        this.buttonname = "Create";
        this.ShowSearchData(true)
      }
      // else {
      //   this.initDate = [new Date(),new Date()];
      // }
      this.ShowSearchData(true)
      this.GetGridData();
      this.getCostCenter();
      this.Spinner = false;
      // this.AlljournalData = [];
      // this.objsearch.Voucher_Type_ID = undefined
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Journal",
        detail: "Succesfully "+msg
      });
      this.totalDR = undefined;
      this.totalCR = undefined;
      this.clearData();
     }
     else {
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something wrong"
      });
     }
    })
 }
}
GetCostHead(){
  const obj = {
    "SP_String": "sp_Comm_Controller",
    "Report_Name_String": "Get_Master_Accounting_Cost_Head_Dropdown",
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log(data);
    this.costHeadDataList = data ;
    console.log("costHeadDataList",this.costHeadDataList);
   })
}
GetDocumentType(){
  this.objjournalloweer.Doc_Type_ID = undefined;
  this.RefDocumentList = [] ;
  this.objjournalloweer.Ref_Doc_No = undefined;
  if(this.objjournalloweer.Sub_Ledger_ID){
    const sendobj = {
      Voucher_Type_ID : Number(this.VoucherTypeID),
      Sub_Ledger_ID : this.objjournalloweer.Sub_Ledger_ID
    }
  const obj = {
    "SP_String": "SP_Financial_Voucher",
    "Report_Name_String": "Get_Doc_Type",
    "Json_Param_String": JSON.stringify([sendobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log(data);
    this.DocumentTypeList = data ;
    console.log("DocumentTypeList",this.DocumentTypeList);
   })
  }
}
ChangeDocumentType(){
  this.RefDocumentList = [] ;
  this.objjournalloweer.Ref_Doc_No = undefined;
  if(this.objjournalloweer.Sub_Ledger_ID && this.objjournalloweer.Doc_Type_ID){
    const sendobj = {
      Sub_Ledger_ID : this.objjournalloweer.Sub_Ledger_ID,
      Voucher_Type_ID : this.objjournalloweer.Doc_Type_ID
    }
  const obj = {
    "SP_String": "SP_Financial_Voucher",
    "Report_Name_String": "Get_Search_Document_No",
    "Json_Param_String": JSON.stringify([sendobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log(data);
    if(data.length){
      data.forEach(element => {
        element['value'] = element.Voucher_No,
        element['label'] = element.Voucher_No +', '+ this.DateService.dateConvert(new Date(element.Voucher_Date))+', '+ element.Balance_Amount+', '+ element.Amount
      });
      this.RefDocumentList = data ;
    } else {
      this.RefDocumentList = [] ;
    }
    // console.log("RefDocumentList",this.RefDocumentList);
   })
  }
}
RefDocNoChange(){
  if(this.objjournalloweer.Ref_Doc_No){
    const VoucherNoFilter = this.RefDocumentList.filter((el:any)=>el.Voucher_No === this.objjournalloweer.Ref_Doc_No)[0]
    this.objjournalloweer.Amount = VoucherNoFilter.Balance_Amount
  }
}
getProject(){
  const obj = {
    "SP_String": "sp_Comm_Controller",
    "Report_Name_String": "Get_Master_Project_Detail_Dropdown",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("Project Data ==>",data);
     this.projectDataList = data;
   })
}
ViewJournal(col){
  this.VoucherNo = undefined;
  this.objjournal = new journalTopper();
  this.buttondisabled = true;
  this.lowerList = [];
  this.SubLedgerList = [];
  this.totalDR = 0;
  this.totalCR= 0;
  this.objjournalloweer = new journalTopper();
  this.journallowerFormSubmitted = false;
  this.journalFormSubmitted = false;
  if(col.Voucher_No){
    this.buttondisabled = false;
    this.VoucherNo = col.Voucher_No;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "VIEW", "DIAGNOSIS"];
    this.GetEditMasterUom(col.Voucher_No)
  }
}
EditJournal(col){
  if(col.Voucher_No){
    this.VoucherNo = undefined;
    this.VoucherNo = col.Voucher_No;
    this.objjournal = new journalTopper();
    this.lowerList = [];
    this.SubLedgerList = [];
    this.totalDR = 0;
    this.totalCR= 0;
    this.journallowerFormSubmitted = false;
    this.objjournalloweer = new journalTopper();
    this.journalFormSubmitted = false;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE", "DIAGNOSIS"];
    this.buttonname = "Update";
    this.GetEditMasterUom(col.Voucher_No)
  }
}
CopyJournal(col){
    this.VoucherNo = undefined;
    this.objjournal = new journalTopper();
    this.buttondisabled = true;
    this.lowerList = [];
    this.SubLedgerList = [];
    this.totalDR = 0;
    this.totalCR= 0;
    this.objjournalloweer = new journalTopper();
    this.journallowerFormSubmitted = false;
    this.journalFormSubmitted = false;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "COPY VOUCHER", "DIAGNOSIS"];
    this.GetEditMasterUom(col.Voucher_No)  
}
GetEditMasterUom(V_NO){
  const obj = {
    "SP_String": "Sp_Acc_Journal",
    "Report_Name_String":"BL_Txn_Acc_Journal_Get",
    "Json_Param_String": JSON.stringify([{Voucher_No : V_NO}]) 
   }
   this.GlobalAPI.getData(obj).subscribe((res:any)=>{
     let data = JSON.parse(res[0].T_element);
     console.log("Edit Data",data);
     this.objjournal = data[0];
     this.objjournal.Voucher_No = (this.buttonname === "Create" && this.buttondisabled) ? undefined : data[0].Voucher_No
     this.voucherdata = new Date(data[0].Voucher_Date)
     this.getsubLedgertop(data[0].Ledger_ID,data[0].Sub_Ledger_ID);
     this.NEFTDate = data[0].Cheque_Date ? new Date(data[0].Cheque_Date) : new Date();
     this.lowerList = data[0].L_element ? data[0].L_element : [];
     setTimeout(() => {
      if(data[0].Bank_Txn_Type){
        const bankTrnFilter = this.BankTransactionTypeList.filter((el:any)=> el.Txn_Type_Name === data[0].Bank_Txn_Type)[0]
        this.objjournal.Bank_Txn_Type  = bankTrnFilter.Bank_Txn_Type_ID
        console.log("this.objjournal.Bank_Txn_Type",typeof(this.objjournal.Bank_Txn_Type))
        this.getBankTRNTypeforedit(this.objjournal.Bank_Txn_Type)
      }
    }, 200);

     if(data[0].DR_Amt){
      this.objjournal.Amount = Number((data[0].DR_Amt).toFixed(2))
      this.objjournal.DrCrdata = "DR";
      this.getTotalDRCR()
    }
    else if (data[0].CR_Amt){
      this.objjournal.Amount = Number((data[0].CR_Amt).toFixed(2))
      this.objjournal.DrCrdata = "CR";
      this.getTotalDRCR()
    }
    else {
      console.error("Amount Not Found");
    }
   })
}
DeleteJournal(col){
  console.log("Col",col);
 if(col.Voucher_No){
   this.VoucherNo = undefined;
   this.VoucherNo = col.Voucher_No;
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
onReject() {
  this.compacctToast.clear("c");
}
onConfirm(){
  if(this.VoucherNo){
    const obj = {
      "SP_String": "Sp_Acc_Journal",
      "Report_Name_String":"BL_Txn_Acc_Journal_Delete",
      "Json_Param_String": JSON.stringify([{Voucher_No : this.VoucherNo,User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]) 
      }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("data ==",data[0].Column1);
      if (data[0].Column1 === "Done"){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Jouranl Delete Succesfully",
          detail: "Succesfully Delete"
        });
        }
        this.ShowSearchData(true);
       });
  }


}
getDate(date){
return date != "01/Jan/1900" ? date : ""
}
validcheck(){
  return this.SubLedgerList.length ? true : false
}
validchecklow(){
  return this.SubLedgerListlow.length ? true : false
}
getToFix(number){
 if(number){
  return Number(Number(number).toFixed(2))
 }
}
//K4C DIAGNOSIS
getDateRangediagnosis(dateRangeObj: any) {
  if (dateRangeObj.length) {
    this.From_Date = dateRangeObj[0];
    this.To_Date = dateRangeObj[1];
  }
}
GetdiagnosisCostCenter() {
  const obj = {
    "SP_String": "sp_Comm_Controller",
    "Report_Name_String": "Get_Master_Cost_Center_Dropdown",
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log(data);
    this.diagnosiscostHeadList = data;
    this.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    console.log("diagnosiscostHeadList",this.diagnosiscostHeadList);
   })
}

GetGridData(){
  this.GridList = [];
  this.GridListHeader = [];
  this.seachSpinner = true;
  const start = this.From_Date
  ? this.DateService.dateConvert(new Date(this.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.To_Date
  ? this.DateService.dateConvert(new Date(this.To_Date))
  : this.DateService.dateConvert(new Date());
  const senddata = {
    Satrt_date : start,
    End_date : end,
    Voucher_Type_ID : this.VoucherTypeID
  }
  const obj = {
    "SP_String": "Sp_Acc_Journal",
    "Report_Name_String": "Diagnosis_Journal_List",
    "Json_Param_String": JSON.stringify([senddata])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.GridList = data;
    this.GridListHeader = data.length ? Object.keys(data[0]): []
    this.seachSpinner = false;
    //  console.log("GridList ===",this.GridList);
  })
} 
editdiagnosismaster(eROW){
  if(eROW.Voucher_No){
    this.VoucherNo = undefined;
    this.VoucherNo = eROW.Voucher_No;
    this.objjournal = new journalTopper();
    this.lowerList = [];
    this.SubLedgerList = [];
    this.totalDR = 0;
    this.totalCR= 0;
    this.journallowerFormSubmitted = false;
    this.objjournalloweer = new journalTopper();
    this.journalFormSubmitted = false;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE", "DIAGNOSIS"];
    this.buttonname = "Update";
    this.geteditdiagnosismaster(eROW.Voucher_No)
  }
}
geteditdiagnosismaster(V_NO){
  const obj = {
    "SP_String": "Sp_Acc_Journal",
    "Report_Name_String":"BL_Txn_Acc_Journal_Get",
    "Json_Param_String": JSON.stringify([{Voucher_No : V_NO}]) 
   }
   this.GlobalAPI.getData(obj).subscribe((res:any)=>{
     let data = JSON.parse(res[0].T_element);
     console.log("Edit Data",data);
     this.objjournal = data[0];
     this.objjournal.Voucher_No = (this.buttonname === "Create" && this.buttondisabled) ? undefined : data[0].Voucher_No
     this.voucherdata = new Date(data[0].Voucher_Date)
     this.getsubLedgertop(data[0].Ledger_ID,data[0].Sub_Ledger_ID);
     this.NEFTDate = data[0].Cheque_Date ? new Date(data[0].Cheque_Date) : new Date();
     this.lowerList = data[0].L_element ? data[0].L_element : [];
     setTimeout(() => {
      if(data[0].Bank_Txn_Type){
        const bankTrnFilter = this.BankTransactionTypeList.filter((el:any)=> el.Txn_Type_Name === data[0].Bank_Txn_Type)[0]
        this.objjournal.Bank_Txn_Type  = bankTrnFilter.Bank_Txn_Type_ID
        console.log("this.objjournal.Bank_Txn_Type",typeof(this.objjournal.Bank_Txn_Type))
        this.getBankTRNTypeforedit(this.objjournal.Bank_Txn_Type)
      }
    }, 200);

     if(data[0].DR_Amt){
      this.objjournal.Amount = Number((data[0].DR_Amt).toFixed(2))
      this.objjournal.DrCrdata = "DR";
      this.getTotalDRCR()
    }
    else if (data[0].CR_Amt){
      this.objjournal.Amount = Number((data[0].CR_Amt).toFixed(2))
      this.objjournal.DrCrdata = "CR";
      this.getTotalDRCR()
    }
    else {
      console.error("Amount Not Found");
    }
   })
}
}
class journalTopper{
  Amount:any;
  Company_ID:any
  Voucher_Type_ID:any;
  Voucher_No:any
  Voucher_Date:any;
  Reconsil_Date = "01/01/1900"
  Reconsil_Tag = "N"
  Ledger_ID:any;
  Sub_Ledger_ID:any;
  Cost_Head_ID:any;
  Fin_Year_ID:any;
  Cheque_No:any;
  Cheque_Date:any;
  Bank_Name:any;
  Bank_Txn_Type:any;
  Bank_Branch_Name:any;
  Naration:any;
  DR_Amt:any;
  CR_Amt:any;
  Cost_Cen_ID:any;
  Cost_Cen_ID_Trn:any;
  Project_ID:any;
  Auto_Posted:string = "N"
  Posted_On:any;
  User_ID:any;
  Is_Topper:String = "Y"
  Status:string = "A"
  Prev_doc_no = "NA"
  Foot_Fall_ID:number = 0
  Adjustment_Doc_No:any
  L_element:any;
  DrCrdata = "DR";
  
  Doc_Type_ID:any;
  Ref_Doc_No:any;
  Ref_Doc_Date:any;
  HSN_NO:any;
  GST_Per	:any;
  ITC_Eligibility	:any;
  To_Cost_Cent:any;
}
class journal{
  Ledger_ID:number;
  Sub_Ledger_ID:number;
  Cost_Cen_ID:any;
  Amount:any;
  DrCrdata:any = "DR";
}
class search{
  Voucher_Type_ID:any
  Cost_Cen_ID	:any
  Start_date:any
  End_date:any
}
