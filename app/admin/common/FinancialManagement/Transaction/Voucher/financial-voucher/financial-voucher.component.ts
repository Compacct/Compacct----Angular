import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
declare var $: any;
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
import { CompacctProjectComponent } from '../../../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component';

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
  objjournalloweer:journalLower = new journalLower();
  objsearch:search = new search();
  voucherdata:Date = new Date();
  journalFormSubmitted:boolean = false;
  journalFormSubmittedsearch:boolean = false;
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
  ReminderDate = new Date();
  ReminderTypeList:any = [];
  VoucherNoList:any = [];
  labelText1:string = ""
  labelText2:string = ""
  labelText3:string = ""
  labelText4:string = ""
  optgroupL='Voucher_No.............,'+'Voucher_Date,'+'Balance_Amt,'+'Amount,'
  validatation = {
    required : false,
    projectMand : 'N'
  }
  openProject = "N"
  projectMand = "N";
  projectDisable = false;
  objProject:any = {}
  RefDocTypeList:any = [];
  maxDate:Date;
  minDate:Date;
  voucherNo:string
  costCenterList:any = [];
  DynamicHeader:any = [];
  getAllDataList:any = [];
  ObjCol:any = {}
  overlayPanelText:string = ""
  @ViewChild("project", { static: false })
  ProjectInput: CompacctProjectComponent;
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
      this.VoucherTypeID = params.Voucher_Type_ID;
      this.openProject = params['proj'];
      this.projectMand = params['mand'];
      this.validatation.projectMand = params['mand']
      this.headerText = Number(this.VoucherTypeID) === 1 ? "Receive Voucher" : Number(this.VoucherTypeID) === 2 ? "Payment Voucher" : Number(this.VoucherTypeID) === 4 ? "Journal Voucher" : ""
      this.objjournal.DrCrdata = Number(this.VoucherTypeID) === 1 ? "DR" : Number(this.VoucherTypeID) === 2 ? "CR" : Number(this.VoucherTypeID) === 4 ? "DR" : "" 
      this.objjournalloweer.DrCrdataLower = this.objjournal.DrCrdata === "DR" ? "CR" : "DR" 
      if(this.VoucherTypeID){
        this.GetLedgerTop()
        this.GetLedgerlow()
      }
       })
  }

  ngOnInit() {
    $(document).prop('title', this.headerText ? this.headerText : $('title').text());
    this.items = ["BROWSE", "CREATE","REPORT"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: this.headerText,
      Link: "Financial Management --> Transaction -> "+this.headerText
    });
    this.buttonname = "Create";
    this.getcompany()
    this.GetCostCenter()
    this.Finyear()
    this.GestCostHead();
   // this.getFinDate();
    this.getGetReminder()
    this.getCosCenter();
    this.userType = this.$CompacctAPI.CompacctCookies.User_Type
    
  }
  onReject() {
    this.compacctToast.clear("c");
  }

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
    this.getTotalDRCR()
    this.objjournal.DrCrdata = backupobjjournal.DrCrdata
    this.objjournal.Cost_Cen_ID_Trn  = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.objjournal.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
   
    this.objjournalloweer = new journalLower();
    this.objjournalloweer.DrCrdataLower = this.objjournal.DrCrdata === "DR" ? "CR" : "DR" 
    this.lowerList = [];
    this.BankTransactionTypeList = [];
    this.SubLedgerList = [];
    this.journallowerFormSubmitted = false;
    this.journalFormSubmitted = false
    this.ReminderDate = new Date()
    this.SubLedgerListlow = []
    this.RefDocTypeList = []
    this.VoucherNoList = []
    this.BankTransactionTypeList = []
    this.SubLedgerList = []
    this.voucherNo = ""
    this.seachSpinner = false
    this.clearProject();
    this.totalDR = 0
    this.totalCR = 0
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
    this.totalDR = 0;
    this.totalCR = 0;
    this.getDocType();
    if(this.objjournal.DrCrdata === "DR" && this.objjournal.Amount){
      this.totalDR = Number(Number((this.objjournal.Amount)).toFixed(2));
      this.objjournalloweer.DrCrdataLower = "CR"
     }
     else if(this.objjournal.DrCrdata === "CR" && this.objjournal.Amount){
      this.totalCR = Number(Number((this.objjournal.Amount)).toFixed(2));
      this.objjournalloweer.DrCrdataLower = "DR"
     }
     else {
       //console.error("objjournal.DrCrdata Not Found",this.objjournal.DrCrdata);
       
     }
   console.log("lowerList",this.lowerList);
   this.lowerList.forEach(el=>{
    el.DR_Amt = el.DR_Amt ? el.DR_Amt : 0
    el.CR_Amt = el.CR_Amt ? el.CR_Amt : 0
    this.totalDR +=  Number(Number(el.DR_Amt).toFixed(2));
    this.totalCR += Number(Number(el.CR_Amt).toFixed(2));
   })
  
   
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
    else {
      this.objjournalloweer.Sub_Ledger_ID = undefined;
      this.SubLedgerListlow = []
    }
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      console.log("dateRangeObj",dateRangeObj);
      this.objsearch.st_dt_time = this.DateService.dateConvert(dateRangeObj[0]);
      this.objsearch.end_dt_time = this.DateService.dateConvert(dateRangeObj[1]);
    }
  }
  ShowSearchData(valid){
    this.JournalSearchFormSubmit = true
    if(valid){
      this.seachSpinner = true
      this.objsearch.Company_ID = Number(this.objsearch.Company_ID)
      this.objsearch.Cost_Cen_ID = Number(this.objsearch.Cost_Cen_ID)
      this.objsearch.Voucher_Type_ID = Number(this.VoucherTypeID)
      this.objsearch.proj = this.openProject ? this.openProject : "N"
      const obj = {
        "SP_String": "SP_Acc_Journal",
        "Report_Name_String": "BL_Txn_Acc_Journal_Browse",
        "Json_Param_String": JSON.stringify([this.objsearch])
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("data",data)
        this.getAllDataList = data
        if(this.getAllDataList.length){
          this.DynamicHeader = Object.keys(data[0]);
        }
        this.seachSpinner = false
        this.JournalSearchFormSubmit = false
      })
    }
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
     this.objsearch.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
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
        "Report_Name_String": "Get_Bank_Txn_Type",
        "Json_Param_String": JSON.stringify([{ledger_id: Number(LedgerId)}])
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.BankTransactionTypeList = data
       console.log("BankTransactionTypeList",this.BankTransactionTypeList)
      })
    }
    else{
      this.objjournal.Bank_Txn_Type = 0;
      this.BankTransactionTypeList = [];
    }
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
       this.vouchermaxDate = new Date(data[0].Fin_Year_End);
     this.voucherminDate = new Date(data[0].Fin_Year_Start);
     this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]

      });
  }
  addFinancialVoucher(valid:any){
    this.journallowerFormSubmitted = true
    this.validatation.required = true
    if(valid && this.checkreq()){
     console.log("add Data",this.objjournalloweer)
     const LedgerFilter = this.LedgerListLow.filter((el:any)=>Number(el.value) === Number(this.objjournalloweer.Ledger_ID))[0]
     const subledgerFilter = this.SubLedgerListlow.filter((el:any)=>Number(el.value) === Number(this.objjournalloweer.Sub_Ledger_ID))[0]
     const costheadFilter = this.costHeadDataList.filter((el:any) => Number(el.Cost_Head_ID) === Number(this.objjournalloweer.Cost_Head_ID))[0]
     const VoucherNoListFilter = this.VoucherNoList.filter((el:any) => el.Voucher_No == this.objjournalloweer.Adjustment_Doc_No)
     this.objjournalloweer.Voucher_Date = VoucherNoListFilter.length ? this.DateService.dateConvert(VoucherNoListFilter[0].Voucher_Date) : this.DateService.dateConvert(new Date('01/01/1900'))
     
     const tempAddobj = {
      Ledger_ID: Number(this.objjournalloweer.Ledger_ID),
      Ledger_Name: LedgerFilter.label ? LedgerFilter.label : " ",
      Sub_Ledger_ID: Number(this.objjournalloweer.Sub_Ledger_ID),
      Sub_Ledger_Name : subledgerFilter ? subledgerFilter.label : " ",
      Adjustment_Doc_No: this.objjournalloweer.Adjustment_Doc_No,
      DR_Amt: this.objjournalloweer.DrCrdataLower === "DR" ? Number(this.objjournalloweer.Amount) : undefined,
      CR_Amt:this.objjournalloweer.DrCrdataLower === "CR" ? Number(this.objjournalloweer.Amount) : undefined,
      Cost_Head_ID : Number(this.objjournalloweer.Cost_Head_ID),
      Cost_Head_Name : costheadFilter ? costheadFilter.Cost_Head_Name :" ",
      Reminder_Req : this.objjournalloweer.Reminder_Req,
      Reminder_Date : this.objjournalloweer.Reminder_Req === "Y" ? this.DateService.dateConvert(this.ReminderDate) : this.DateService.dateConvert(new Date("01/01/1900")),
      Reminder_Type : this.objjournalloweer.Reminder_Req === "Y" ? this.objjournalloweer.Reminder_Type : "NA",
      Cheque_No: "NA",
      Cheque_Date: this.DateService.dateConvert(new Date("01/01/1900")),
      Bank_Name: "NA",
      Bank_Txn_Type: "NA",
      Bank_Branch_Name: "NA",
      Naration: "NA",
      Is_Topper:"N",
      Voucher_Type_ID: this.objjournalloweer.Voucher_Type_ID ? Number(this.objjournalloweer.Voucher_Type_ID) : 0,
      Cost_Cen_ID_Trn : Number(this.objjournal.Cost_Cen_ID_Trn),
      Cost_Cen_ID : Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID),
      Voucher_Date : this.objjournalloweer.Voucher_Date,
      DOC_DATE:this.DateService.dateConvert(new Date(this.voucherdata)),				
      DOC_TYPE: this.headerText,			
      PROJECT_ID: this.objProject.PROJECT_ID ? this.objProject.PROJECT_ID : 0,				
      SITE_ID:this.objProject.SITE_ID ? this.objProject.SITE_ID :0,			
      Budget_Group_ID:this.objProject.Budget_Group_ID ? this.objProject.Budget_Group_ID : 0,				
      Budget_Sub_Group_ID:this.objProject.Budget_Sub_Group_ID ? this.objProject.Budget_Sub_Group_ID :0,			
      Work_Details_ID:this.objProject.Work_Details_ID ? this.objProject.Work_Details_ID :0,			
      SL_NO: this.lowerList.length + 1,
     }
     this.lowerList.push(tempAddobj);
     this.objjournalloweer = new journalLower()
     this.RefDocDate = new Date()
     this.ReminderDate = new Date()
     this.journallowerFormSubmitted = false
     this.validatation.required = false
     this.SubLedgerListlow = []
     this.objProject = {}
     this.getTotalDRCR();
     this.clearProject();
  
    }
  }
  getProjectName(fieldName,value){
    if(fieldName == "PROJECT_ID"){
      const tempObj:any = this.ProjectInput.getValue(fieldName,Number(value))
      return tempObj ? tempObj.Project_Description : ""
    }
    if(fieldName == "SITE_ID"){
      const tempObj:any = this.ProjectInput.getValue(fieldName,Number(value))

      return  tempObj ? tempObj.Site_Description : ""
    }
    if(fieldName == "Budget_Group_ID"){
      const tempObj:any = this.ProjectInput.getValue(fieldName,Number(value))
      return  tempObj ? tempObj.Budget_Group_Name : " "
    }
    if(fieldName == "Budget_Sub_Group_ID"){
      const tempObj:any = this.ProjectInput.getValue(fieldName,Number(value))
      return tempObj ? tempObj.Budget_Sub_Group_Name : ""
    }
    if(fieldName == "Work_Details_ID"){
      const tempObj:any = this.ProjectInput.getValue(fieldName,Number(value))
      return tempObj ? tempObj.Work_Details : ""
    }
  }
 
  DeleteProduct(index){
    this.lowerList.splice(index,1);
    this.getTotalDRCR();
  }
  getProjectData(e){
    console.log("Project Data",e);
    this.objProject = e
    console.log("objProjectRequi",this.objProject)
    let temparr = Object.keys(this.objProject)
    console.log(temparr)
    console.log("LedgerListLow",this.LedgerListLow)
    // if(temparr.indexOf("PROJECT_ID") != -1 && temparr.indexOf("Budget_Group_ID") != -1 && temparr.indexOf("Budget_Sub_Group_ID") != -1 && temparr.indexOf("SITE_ID") != -1 && temparr.indexOf("Work_Details_ID") != -1){
    //  this.getProductType();
    //  this.GetRequlist();
    // }
    // else{
    //  this.objaddPurchacse.Product_Type_ID = undefined;
    //  this.objaddPurchacse.Product_ID = undefined;
    //  this.objaddPurchacse.Product_Spec = undefined;
    // }
   
  }
   whateverCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
  saveJournal(valid){
    this.journalFormSubmitted = true
    this.validatation.required = true
   if(valid ){
    const bankListFilter = this.BankTransactionTypeList.filter((el:any)=> Number(el.Bank_Txn_Type_ID) === Number(this.objjournal.Bank_Txn_Type))[0]
    if(bankListFilter){
     this.objjournal.Bank_Txn_Type = bankListFilter.Txn_Type_Name
    }
    let msg = "";
    let rept = ""
   this.objjournal.DR_Amt = this.objjournal.DrCrdata === "DR" ? Number(this.objjournal.Amount) : 0
   this.objjournal.CR_Amt = this.objjournal.DrCrdata === "CR" ? Number(this.objjournal.Amount) : 0
   this.objjournal.Voucher_Type_ID = Number(this.VoucherTypeID)
   this.objjournal.Voucher_Date = this.DateService.dateConvert(this.voucherdata)
   this.objjournal.Fin_Year_ID = Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
   this.objjournal.User_ID = Number(this.$CompacctAPI.CompacctCookies.User_ID)
   this.objjournal.Posted_On = this.DateService.dateConvert(new Date())
   this.objjournal.Project_ID = this.objProject.Project_ID ? Number(this.objProject.Project_ID) : 0 
   this.objjournal.Cost_Cen_ID = Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID)
   this.objjournal.Cheque_Date = this.objjournal.Bank_Txn_Type == 2 ? this.DateService.dateConvert(new Date("01/01/1900")) : this.DateService.dateConvert(this.NEFTDate)
   this.objjournal.bottom = this.lowerList
   this.journalFormSubmitted = false
   this.validatation.required = false
  console.log("this.objProject",this.objjournal)
  if(this.voucherNo){
    msg = "Update"
    rept = "BL_Txn_Acc_Journal_Update"
    this.objjournal.Voucher_No = this.voucherNo;
  }
  else{
    msg = "Craete"
    rept = "BL_Txn_Acc_Journal_Create"
  }
  const obj = {
    "SP_String": "SP_Acc_Journal",
    "Report_Name_String": rept,
    "Json_Param_String": JSON.stringify([this.objjournal])
    }
  this.GlobalAPI.getData(obj).subscribe(async (data:any)=>{
    this.validatation.required = false;
    if(data[0].Column1){
      this.showTost(msg,this.headerText)
      this.Spinner = false;
      this.ShowSearchData(true)
      if(this.voucherNo){
        this.tabIndexToView = 0;
        this.items = ["BROWSE", "CREATE","REPORT"];
        this.buttonname = "Create";
      }
      this.clearData();
      this.ShowSearchData(true);
    // this.Print(data[0].Column1)
      this.clearProject()
    }
    else {
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Something Wrong"
      });
    }
  })
   }
  }
  getBankTRNType(id:any){
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
  getDocType(){
    if(this.VoucherTypeID && this.objjournalloweer.Sub_Ledger_ID && this.objjournal.Company_ID && this.objjournal.DrCrdata){
      const tempObj = {
        Voucher_Type_ID: Number(this.VoucherTypeID),
        Sub_Ledger_ID: Number(this.objjournalloweer.Sub_Ledger_ID),
        Company_ID: Number(this.objjournal.Company_ID),
        txn_typ: this.objjournal.DrCrdata
      }
      const obj = {
        "SP_String": "SP_Financial_Voucher",
        "Report_Name_String": "Get_Doc_Type",
        "Json_Param_String": JSON.stringify([tempObj])
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("DocType",data)
        this.RefDocTypeList = data;
        this.getDocNo()
      })
    } 
  }
  getDocNo(){
    if(this.VoucherTypeID && this.objjournalloweer.Sub_Ledger_ID && this.objjournal.Company_ID && this.objjournal.DrCrdata){
      const tempObj = {
        Sub_Ledger_ID: Number(this.objjournalloweer.Sub_Ledger_ID),
        Company_ID: Number(this.objjournal.Company_ID),
        Voucher_Type_ID: Number(this.objjournalloweer.Voucher_Type_ID),
        txn_type: this.objjournal.DrCrdata,
        PROJECT_ID: this.objProject.PROJECT_ID,  
        Budget_Group_ID : this.objProject.Budget_Group_ID,
        Budget_Sub_Group_ID : this.objProject.Budget_Sub_Group_ID, 
        SITE_ID	: this.objProject.SITE_ID,
        Work_Details_ID	: this.objProject.Work_Details_ID
      }
      const obj = {
      "SP_String": "SP_Financial_Voucher",
      "Report_Name_String": "Get_Search_Document_No",
      "Json_Param_String": JSON.stringify([tempObj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("DocType",data)
      this.VoucherNoList = data
    })
  } 
  }
  getFinDate(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Dropdown_Financial_Year"
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Fin Date",data)
      let finDateDateFilter = data.filter((el:any)=> new Date(el.Fin_Year_Start).getMonth() === new Date(this.$CompacctAPI.CompacctCookies.Fin_Year_Start).getMonth())[0]
      //  this.maxDate = new Date(finDateDateFilter.Fin_Year_End);
      //  this.minDate = new Date(finDateDateFilter.Fin_Year_Start);
      this.vouchermaxDate = new Date(finDateDateFilter.Fin_Year_End);
      this.voucherminDate = new Date(finDateDateFilter.Fin_Year_Start);
      this.voucherdata = new Date().getMonth() > new Date(finDateDateFilter.Fin_Year_End).getMonth() ? new Date() : new Date(finDateDateFilter.Fin_Year_End)
      this.initDate =  [new Date(finDateDateFilter.Fin_Year_Start) , new Date(finDateDateFilter.Fin_Year_End)]
      })
  }
  getGetReminder(){
    const obj = {
      "SP_String": "SP_Financial_Voucher",
      "Report_Name_String": "Get_Reminder"
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Get Reminder",data)
    this.ReminderTypeList = data
    })
  }
  RefDocNoChange(){
    if(this.objjournalloweer.Adjustment_Doc_No){
      const VoucherNoFilter = this.VoucherNoList.filter((el:any)=>el.Voucher_No === this.objjournalloweer.Adjustment_Doc_No)[0]
      this.objjournalloweer.Amount = VoucherNoFilter.Balance_Amount
    }
  }
  reqriredCheck(arr){
    return arr.length ? true : false
  }
  checkreq(){
    let flg = false
    if(this.openProject === "Y" && this.projectMand === "Y"){
      let getArrValue = Object.values(this.objProject);
      console.log("getArrValue",getArrValue.length);
      if(getArrValue.indexOf(undefined) == -1){
        if(getArrValue.length === 5 || getArrValue.length > 5){
          flg = true
        }
        else {
          flg = false
        }
      }
      else {
        flg = false
      }
    }
    else {
      flg = true
    }
    return flg
  }
  showTost(msg,summary){
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: summary,
      detail: "Succesfully "+msg
    });
  }
  async SaveProject(docNo){
    if(docNo){
    this.objProject.DOC_NO = docNo,
    this.objProject.DOC_TYPE = this.headerText,
    this.objProject.DOC_DATE = this.DateService.dateConvert(this.voucherdata)
    }
    const obj = {
    "SP_String": "SP_BL_CRM_TXN_Project_Doc",
    "Report_Name_String": "Create_BL_CRM_TXN_Project_Doc",
    "Json_Param_String": JSON.stringify([this.objProject]) 
    }
    const projectData = await  this.GlobalAPI.getData(obj).toPromise();
    console.log("projectData",projectData);
    return projectData
  }
  clearProject(){
    if(this.openProject === "Y"){
      this.ProjectInput.clearData()
    }
  
  }
  getCosCenter(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Master_Cost_Center_Dropdown"
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Cost Center",data)
    this.costCenterList = data
    this.objsearch.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    })
  }
  EditVoucher(col){
    if(col.Voucher_No){
      this.voucherNo = "";
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE","REPORT"];
      this.buttonname = "Update";
      this.clearData();
      this.voucherNo = col.Voucher_No;
      this.objjournal = new journalTopper()
      this.clearProject();
      this.geteditmaster(col.Voucher_No);
      // if(this.openProject === "Y"){
      //   this.getEditProject(col.Voucher_No);
      // }
    
    }
  }
  geteditmaster(VoucherNo){
  if(VoucherNo){
    const obj = {
      "SP_String": "SP_Acc_Journal",
      "Report_Name_String": "BL_Txn_Acc_Journal_Get",
      "Json_Param_String": JSON.stringify([{Voucher_No : VoucherNo}])
      }
    this.GlobalAPI.getData(obj).subscribe((res:any)=>{
    let data = JSON.parse(res[0].topper)
    console.log("Edit Data",data)
    this.objjournal = data[0]
    this.objjournal.Voucher_No = data[0].voucher_No
    this
    this.GetBankTransactionType(data[0].Ledger_ID);
    this.voucherdata = new Date(data[0].Voucher_Date)
    this.lowerList = data[0].bottom;
    console.log("lowerList",this.lowerList)
    setTimeout(() => {
      if(data[0].Bank_Txn_Type){
        const bankTrnFilter = this.BankTransactionTypeList.filter((el:any)=> el.Txn_Type_Name === data[0].Bank_Txn_Type)[0]
        this.objjournal.Bank_Txn_Type  = bankTrnFilter.Bank_Txn_Type_ID
        console.log("this.objjournal.Bank_Txn_Type",typeof(this.objjournal.Bank_Txn_Type))
        this.getBankTRNType(this.objjournal.Bank_Txn_Type)
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

  FilterArrList(text,value){
    let flgReturn = ""
  if(text === 'Ledger'){
    const LedgerFilter = this.LedgerListLow.filter((el:any)=>Number(el.value) === Number(value))[0]
    flgReturn = LedgerFilter ? LedgerFilter.label : "Not Found"
  }
  else if(text === 'Sub_Ledger'){
    const subledgerFilter = this.SubLedgerListlow.filter((el:any)=>Number(el.value) === Number(value))[0]
    flgReturn = subledgerFilter ? subledgerFilter.label : "Not Found"
  }
  else if(text === 'Cost_Head'){
    const costheadFilter = this.costHeadDataList.filter((el:any) => Number(el.Cost_Head_ID) === Number(value))[0]
    flgReturn = costheadFilter ? costheadFilter.Cost_Head_Name : "Not Found"
  }
  else {
    console.warn("NO"+text+"Found")
  }
  }

  getEditProject(DocNo){
    if(DocNo){
      const obj = {
        "SP_String": "SP_BL_CRM_TXN_Project_Doc",
        "Report_Name_String": "Get_BL_CRM_TXN_Project_Doc",
        "Json_Param_String": JSON.stringify([{DOC_NO : DocNo}]) 
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.objProject = data
        console.log("this.projectEditData",this.objProject);
        
          this.ProjectInput.ProjectEdit(this.objProject)
        
          })
    }
  }
  DeleteVoucher(col){
    if(col.Voucher_No){
      this.voucherNo = "";
      this.voucherNo = col.Voucher_No;
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
      const obj = {
        "SP_String": "SP_Acc_Journal",
        "Report_Name_String":"BL_Txn_Acc_Journal_Delete",
        "Json_Param_String": JSON.stringify([{Voucher_No : this.voucherNo,User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]) 
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("data ==",data[0].Column1);
        if (data[0].Column1 === "Done"){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: this.headerText+" Delete Succesfully",
            detail: "Succesfully Delete"
          });
          }
          this.ShowSearchData(true);
        });
    }


  }
  convartNumber(n:any){
  return typeof(n) === "number" ? n : Number(n)
  }
  getColspanDR(){
    return this.openProject == 'Y' ? 10 : 5
                        
  }
  stringShort(str,wh) {
    let retuObj:any = {}
    if(str){
      if (str.length > 30) {
        retuObj = {
          field: str.substring(0, 30) + " ...",
          cssClass : "txt"
        }
      }
      else {
         retuObj = {
          field: str,
          cssClass : ""
        }
      }
    }
   
  return wh == "css" ? retuObj.cssClass : retuObj.field
  }
  selectWork(event,text, overlaypanel) {
   
    if (text.length > 30) {
      this.ObjCol = {}
      this.overlayPanelText= ""
     this.overlayPanelText = text
     overlaypanel.toggle(event); 
    }
   
    }
}
class journalTopper{
  Amount:any
  Company_ID:any
  Voucher_Type_ID:any
  Voucher_No:any
  Voucher_Date:any
  Reconsil_Date = "01/01/1900"
  Reconsil_Tag = "N"
  Ledger_ID:any
  Sub_Ledger_ID:any
  Cost_Head_ID:any
  Fin_Year_ID:any
  Cheque_No:any
  Cheque_Date:any
  Bank_Name:any
  Bank_Txn_Type:number = 0
  Bank_Branch_Name:any
  Naration:any
  DR_Amt:any	
  CR_Amt:any
  Cost_Cen_ID:any
  Cost_Cen_ID_Trn:any
  Project_ID:any
  Auto_Posted:string = "N"	
  Posted_On:any
  User_ID:any
  Is_Topper:String = "Y"
  Status:string = "A"
  Prev_doc_no	 = "NA"
  Foot_Fall_ID:number = 0
  Adjustment_Doc_No:any
  bottom:any
  DrCrdata:string = "DR"
 
}
class journalLower{
        Ledger_ID:any
				Sub_Ledger_ID:any
				Voucher_Type_ID:any
				Cheque_No:any
				Cheque_Date:any
				Bank_Name:any
				Bank_Txn_Type:any
				Bank_Branch_Name:any
				Naration:any
				DR_Amt:any
				CR_Amt:any	
				Is_Topper:string= "N"
				Reminder_Req:string = "N"
				Reminder_Date:any
				Reminder_Type:any
        DrCrdataLower = "CR"
        Amount:any
        Adjustment_Doc_No:any
        Cost_Head_ID:any
        Cost_Cen_ID:any
        Cost_Cen_ID_Trn:any
        Voucher_Date:any
}
class search{
  Company_ID:any;
  Voucher_Type_ID:any
  Cost_Cen_ID	:any
  st_dt_time:any
  end_dt_time:any
  proj:string
}