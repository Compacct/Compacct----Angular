import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';
import { format } from 'url';
declare var $:any;
import { FileUpload } from "primeng/primeng";
import { NgxUiLoaderService } from "ngx-ui-loader";


@Component({
  selector: 'app-hr-loan-approval',
  templateUrl: './hr-loan-approval.component.html',
  styleUrls: ['./hr-loan-approval.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HrLoanApprovalComponent implements OnInit {
  items:any = [];
  menuList:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  employeelist = [];
  ApprovalList:any = [];
  empid: any;
  Bussidisabled = false;
  Reportdisabled = false;
  approvedisabled = false;
  BackupApprovalList:any = [];
  DistEmpName:any = [];
  SelectedDistEmpName:any = [];
  SearchFields:any = [];
  ShowObj:any = {};

  ApprovedApprovalList:any = [];
  BackupApprovedApprovalList:any = [];
  DistEmpNameTab2:any = [];
  SelectedDistEmpNameTab2:any = [];
  SearchFieldsTab2:any = [];
  DynamicHeaderforTabSecond:any = [];

  DisApprovedApprovalList:any = [];
  DynamicHeaderforTabThird:any = [];
  BackupDisApprovedApprovalList:any = [];
  DistEmpNameTab3:any = [];
  SelectedDistEmpNameTab3:any = [];
  SearchFieldsTab3:any = [];

  DetailsModal = false;
  AllEmpLeaveList:any = [];
  Issued_From_Date:Date;
  Issued_To_Date:Date;
  txnid: any;
  pendingempid: any;
  attntypeid: any;
  LoanAppDatalist:any = [];
  OngoingLoanlist:any = [];
  // DisApprovedbutton = "DisApproved";
  // Approvedbutton = "Approved"
  BusinessManager: any;
  ReportManager: any;
  Apply_From_Date: Date;
  Apply_To_Date: Date;
  Approved_Note_Business_Manager: any;
  Approved_Note_Reporting_Manager: any;
  ApproveFormSubmit = false;
  Approved_Status_Business_Manager: any;
  Approved_Status_Reporting_Manager: any;
  NoteBusinessManager: any;
  NoteReportingManager: any;
  loanid: any;
  Sanction_Date: Date;
  Sanction_Loan_Amount: any;
  Sanction_EMI: any;
  EMI_Amount: any;
  EMI_Start_From_Date_Month: Date;
  Ac_Voucher_No: any;
  Remarks: any;
  ProductPDFFile:any = {}
  @ViewChild("fileInput", { static: false }) fileInput!: FileUpload;
  documenturllink: any;

  constructor(
    private route : ActivatedRoute,
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["PENDING LOAN", "APPROVED LOAN", "DISAPPROVED LOAN"];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ]; 
    this.Header.pushHeader({
      Header: "Loan Approval",
      Link: " HR -> Transaction -> Loan Approval"
    });
    this.getemployee();
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["PENDING LOAN", "APPROVED LOAN", "DISAPPROVED LOAN"];
    //  this.buttonname = "Save";
    //  this.Spinner = false;
    //  this.clearData();
   }
   getemployee(){
    this.empid = undefined;
    const obj = {
      "SP_String": "SP_Leave_Application",
      "Report_Name_String": "Get_Emp_ID",
      "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.employeelist = data;
      this.empid = data[0].Emp_ID;
       console.log("employeelist ===", this.employeelist);
       this.getPedingApprovaldetails();
       this.getApprovedApprovaldetails();
       this.getDisApprovedApprovaldetails();
    })
  }
   // For Pending Loan
  getPedingApprovaldetails(){
    const obj = {
      "SP_String": "SP_HR_Txn_Loan",
      "Report_Name_String": "PENDING LOAN FOR APPROVAL",
      "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID, Emp_ID : this.empid}]) //, Heading:"PENDING APPROVAL"

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ApprovalList = data;
      this.BackupApprovalList = data;
      this.GetDistinct();
      console.log("this.ApprovalList  ===",this.ApprovalList);
      // this.ApprovalList.forEach(element => {
        // if ((element['Approved_Status_Business_Manager'] === "Y") && (element['Approved_Status_Reporting_Manager'] === "Y")) {
        //   element['approvedisabled'] = true;
        // }
        // else {
        //   element['approvedisabled'] = false;
        // }
        // element['Approved_Status_Business_Manager'] = element['Approved_Status_Business_Manager'] != null ? 
        //                                               element['Approved_Status_Business_Manager'] : undefined;
        // element['Approved_Status_Reporting_Manager'] = element['Approved_Status_Reporting_Manager'] != null ?
        //                                                element['Approved_Status_Reporting_Manager'] : undefined;
        // if (Number(element['Business_Manager']) ===  Number(this.empid)) {
        //   this.Reportdisabled = true;
        //   this.Bussidisabled = false;
        // }
        // else if (Number(element['Report_Manager']) ===  Number(this.empid)) {
        //   this.Bussidisabled = true;
        //   this.Reportdisabled = false;
        // }
        // else {
        //   this.Reportdisabled = false;
        //   this.Bussidisabled = false;
        // }

      // });
      // for(let i = 0; i < this.AuthorizedList.length ; i++){
      // this.AuthorizedList[i].Confirm_Qty = this.AuthorizedList[i].Order_Qty;
      // this.AuthorizedList[i].Confirm_Rate = this.AuthorizedList[i].Rate;
      // this.AuthorizedList[i].Confirm_Amount = Number(this.AuthorizedList[i].Confirm_Qty * this.AuthorizedList[i].Confirm_Rate).toFixed(2);
      // this.AuthorizedList[i].Confirm_Amount_With_GST = Number(((this.AuthorizedList[i].Confirm_Qty * this.AuthorizedList[i].Confirm_Rate) * this.AuthorizedList[i].GST_PER) / 100).toFixed(2);
      // //this.AuthorizedList[i].Vendor_Name = this.AuthorizedList[i].Sub_Ledger_ID;
      // }
    })
  }
  ShowDocument(obj){
    if(obj.Document_Link) {
      window.open(obj.Document_Link);
    }
  }
  // DISTINCT & FILTER
  GetDistinct() {
  let DEmpName:any = [];
  this.DistEmpName =[];
  this.SelectedDistEmpName =[];
  this.SearchFields =[];
  this.ApprovalList.forEach((item) => {
 if (DEmpName.indexOf(item.Emp_ID) === -1) {
  DEmpName.push(item.Emp_ID);
 this.DistEmpName.push({ label: item.Emp_Name, value: item.Emp_ID });
 }
});
   this.BackupApprovalList = [...this.ApprovalList];
  }
  FilterDist() {
  let DEmpName:any = [];
  this.SearchFields =[];
if (this.SelectedDistEmpName.length) {
  this.SearchFields.push('Emp_ID');
  DEmpName = this.SelectedDistEmpName;
}
this.ApprovalList = [];
if (this.SearchFields.length) {
  let LeadArr = this.BackupApprovalList.filter(function (e) {
    return (DEmpName.length ? DEmpName.includes(e['Emp_ID']) : true)
  });
this.ApprovalList = LeadArr.length ? LeadArr : [];
} else {
this.ApprovalList = [...this.BackupApprovalList] ;
}
  }
  ApprovedLeave(obj){
    if(obj.Txn_App_ID && obj.Emp_ID) {
      if (((Number(obj.Business_Manager) === Number(this.empid)) && (obj.Approved_Status_Business_Manager && obj.Approved_Note_Business_Manager)) || 
         ((Number(obj.Report_Manager) === Number(this.empid)) && (obj.Approved_Status_Reporting_Manager && obj.Approved_Note_Reporting_Manager))){
      // if ((obj.Approved_Status_Business_Manager && obj.Approved_Note_Business_Manager) || 
      //     (obj.Approved_Status_Reporting_Manager && obj.Approved_Note_Reporting_Manager)) {
      const TObj = {
        Txn_App_ID : obj.Txn_App_ID,
        Emp_ID : obj.Emp_ID,
        HR_Year_ID : obj.HR_Year_ID,
        LEAVE_TYPE : obj.Atten_Type_ID.toString(),
        Apply_From_Date : this.DateService.dateConvert(new Date(obj.Apply_From_Date)),
        Apply_To_Date : this.DateService.dateConvert(new Date(obj.Apply_To_Date)),
        No_Of_Days_Apply : obj.No_Of_Days_Apply,
        Remarks : obj.Remarks,
        Issued_From_Date : this.DateService.dateConvert(new Date(obj.Issued_From_Date)),
        Issued_To_Date : this.DateService.dateConvert(new Date(obj.Issued_To_Date)),
        No_Of_Days_Issued : obj.No_Of_Days_Issued,
        Approved_Status_Business_Manager : obj.Approved_Status_Business_Manager ? obj.Approved_Status_Business_Manager : null,
        Approved_Status_Reporting_Manager : obj.Approved_Status_Reporting_Manager ? obj.Approved_Status_Reporting_Manager : null,
        Approved_Note_Business_Manager : obj.Approved_Note_Business_Manager,
        Approved_Note_Reporting_Manager : obj.Approved_Note_Reporting_Manager,
        Approval_ID : obj.Approval_ID,
        HR_Remarks : obj.HR_Remarks
       }
    const Tempobj = {
        "SP_String": "SP_Leave_Application",
        "Report_Name_String": "Approve_Leave_Application",
        "Json_Param_String" : JSON.stringify([TObj])
      }
      this.GlobalAPI.postData(Tempobj).subscribe((data:any)=>{
           // console.log(data);
            if(data[0].Column1 === "Done") {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: 'Emp ID : ' + obj.Emp_ID,
                detail: "Succesfully Approved."
              });
              this.getPedingApprovaldetails();
              this.getApprovedApprovaldetails();
              this.getDisApprovedApprovaldetails();
            }
            else if(data[0].Column1 === "Something Wrong") {
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "c", 
                sticky: true,
                closable: false,
                severity: "warn", // "info",
                summary: "Approve date should be between apply date.",
                // detail: data[0].Column1
              });
            }
            else {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Error",
                detail: "Error Occured"
              });
            }
      });
      console.log('Update ===', TObj)
    }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Enter Remarks"
      });
    }
  }
  else {
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Something Wrong"
    });
  }
  }
  onReject(){
    this.compacctToast.clear("c");
  }

  CalculateEmi(){
    this.EMI_Amount = 0 ;
    if(this.Sanction_Loan_Amount || this.Sanction_EMI) {
      this.EMI_Amount = Number(Number(this.Sanction_Loan_Amount) / Number(this.Sanction_EMI)).toFixed(2);
    }
  }
  //View Pop Panding 
  ApprovedPopup(col){
    this.txnid = undefined;
    this.loanid = undefined;
    this.pendingempid = undefined;
    this.attntypeid = undefined;
    this.BusinessManager = undefined;
    this.ReportManager = undefined;
    this.Approved_Note_Business_Manager = undefined;
    this.Approved_Note_Reporting_Manager = undefined;
    this.Approved_Status_Business_Manager = undefined;
    this.Approved_Status_Reporting_Manager = undefined;
    this.NoteBusinessManager = undefined;
    this.NoteReportingManager = undefined;
    this.ApproveFormSubmit = false;
    this.Sanction_Date = undefined;
    this.Sanction_Loan_Amount = undefined;
    this.Sanction_EMI = undefined;
    this.EMI_Amount = 0;
    this.EMI_Start_From_Date_Month = undefined;
    this.Ac_Voucher_No = undefined;
    this.documenturllink = undefined;
    if (col) {
      this.ProductPDFFile = {}
      this.fileInput.clear();
      this.ShowObj = col;
      this.loanid = col.Loan_ID;
      this.txnid = col.Txn_App_ID;
      this.pendingempid = col.Emp_ID;
      this.attntypeid = col.Atten_Type_ID;
      this.BusinessManager = col.Business_Manager;
      this.ReportManager = col.Report_Manager;
    // this.Issued_From_Date = new Date(col.Issued_From_Date);
    // this.Issued_To_Date = new Date(col.Issued_To_Date);
    // this.Apply_From_Date = new Date(col.Issued_From_Date);
    // this.Apply_To_Date = new Date(col.Issued_To_Date);
    this.Approved_Status_Business_Manager = col.Approved_Status_Business_Manager;
    this.Approved_Status_Reporting_Manager = col.Approved_Status_Reporting_Manager;
    this.NoteBusinessManager = col.Approved_Note_Business_Manager;
    this.NoteReportingManager = col.Approved_Note_Reporting_Manager;
    this.Sanction_Date = new Date(col.Application_Date);
    this.Sanction_Loan_Amount = Number(col.Loan_Amount);
    this.Sanction_EMI = Number(col.No_Of_EMI);
    this.EMI_Amount = Number(this.Sanction_Loan_Amount / this.Sanction_EMI).toFixed(2);
    this.Remarks = col.Remarks;
    this.documenturllink = col.Document_Link;
    // var month = new Date(col.EMI_Start_Month).toLocaleString('default', { month: 'long' });
    // console.log(month)
    // var year = new Date(col.EMI_Start_Month).getFullYear()
    // var monthyear = month+'-'+year
    // console.log(monthyear)
    this.EMI_Start_From_Date_Month = new Date(col.EMI_Start_Month);
    console.log(this.EMI_Start_From_Date_Month)
    if (Number(col.Business_Manager) ===  Number(this.empid)) {
      this.Bussidisabled = true;
      this.Reportdisabled = false;
    }
    else if (Number(col.Report_Manager) ===  Number(this.empid)) {
      this.Reportdisabled = true;
      this.Bussidisabled = false;
    }
    else {
      this.Reportdisabled = false;
      this.Bussidisabled = false;
    }
    this.GetLoanApplicationData();
    }
  }
  GetLoanApplicationData(){
    const sendobj = {
      Emp_ID : this.pendingempid,
      Loan_ID : this.loanid
    }
    const obj = {
      "SP_String": "SP_HR_Txn_Loan",
      "Report_Name_String": "Loan_Application_Data",
      "Json_Param_String": JSON.stringify([sendobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.LoanAppDatalist = data;
      this.GetOngoingLoan();
      //  console.log("OngoingLoanlist ===", this.OngoingLoanlist);
    })
  }
  GetOngoingLoan(){
    const sendobj = {
      Emp_ID : this.pendingempid
    }
    const obj = {
      "SP_String": "SP_HR_Txn_Loan",
      "Report_Name_String": "Ongoing_Loan_Application_Data",
      "Json_Param_String": JSON.stringify([sendobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.OngoingLoanlist = data;
      this.DetailsModal = true;
      //  console.log("OngoingLoanlist ===", this.OngoingLoanlist);
    })
  }
  handleFileSelect(event:any) {
    this.ProductPDFFile = {};
    if (event) {
      console.log(event)
      this.ProductPDFFile = event.files[0];
   }
  }
  approve(valid:any){
    this.ApproveFormSubmit = true;
    this.ngxService.start();
   if (valid){
    if(this.ProductPDFFile['size']){
      this.UploadDocApprove();
    }
    else{
      this.ApprovedLoans();
    }
   }
   else{
    this.ngxService.stop();
   }

  }
  UploadDocApprove(){
    // this.ApproveFormSubmit = true;
  //  if (valid){
    if(this.ProductPDFFile['size']){
    this.GlobalAPI.CommonFileUpload(this.ProductPDFFile)
    .subscribe((data : any)=>
    {
      this.documenturllink = data.file_url;
      if(this.documenturllink){
        this.ApprovedLoans()
      }
      else {
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Fail to upload"
      });
      }
    }) 
    }
    else {
      this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Error",
      detail: "No File Found"
    });
    }
  //  }
  }
  ApprovedLoans(){
    // this.ApproveFormSubmit = true;
    // if (valid){
    // if(this.txnid && this.pendingempid) {
      if (((Number(this.BusinessManager) === Number(this.empid)) && (this.Approved_Note_Business_Manager)) || 
         ((Number(this.ReportManager) === Number(this.empid)) && (this.Approved_Note_Reporting_Manager))){
      // if ((obj.Approved_Status_Business_Manager && obj.Approved_Note_Business_Manager) || 
      //     (obj.Approved_Status_Reporting_Manager && obj.Approved_Note_Reporting_Manager)) {
      const TObj = {
        Loan_ID : this.loanid,
        Emp_ID : this.pendingempid,
        Voucher_No : this.Ac_Voucher_No,
        Sanction_Date : this.DateService.dateConvert(new Date(this.Sanction_Date)),
        Sanction_Loan_Amount : this.Sanction_Loan_Amount,
        No_Of_EMI_Sanctioned : this.Sanction_EMI,
        EMI_Amount_Sanctioned : this.EMI_Amount,
        EMI_Start_Month_Sanctioned : this.DateService.dateConvert(new Date(this.EMI_Start_From_Date_Month)),
        Remarks : this.Remarks,
        Approved_Status_Business_Manager : this.Approved_Note_Business_Manager ? "Y" : this.Approved_Status_Business_Manager,
        Approved_Status_Reporting_Manager : this.Approved_Note_Reporting_Manager ? "Y" : this.Approved_Status_Reporting_Manager,
        Approved_Note_Business_Manager : this.Approved_Note_Business_Manager ? this.Approved_Note_Business_Manager : this.NoteBusinessManager,
        Approved_Note_Reporting_Manager : this.Approved_Note_Reporting_Manager ? this.Approved_Note_Reporting_Manager : this.NoteReportingManager,
        Document_Link:this.documenturllink ? this.documenturllink : null
        // Approval_ID : obj.Approval_ID,
        // HR_Remarks : obj.HR_Remarks
       }
    const Tempobj = {
        "SP_String": "SP_HR_Txn_Loan",
        "Report_Name_String": "Update_Loan_Application",
        "Json_Param_String" : JSON.stringify(TObj)
      }
      this.GlobalAPI.postData(Tempobj).subscribe((data:any)=>{
           // console.log(data);
            if(data[0].Column1 === "Done") {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: 'Emp ID : ' + this.pendingempid,
                detail: "Succesfully Approved."
              });
              this.ngxService.stop();
              this.ApproveFormSubmit = false;
              this.DetailsModal = false;
              this.Ac_Voucher_No = undefined;
              this.Approved_Note_Business_Manager = undefined;
              this.Approved_Note_Reporting_Manager = undefined;
              this.getPedingApprovaldetails();
              this.getApprovedApprovaldetails();
              this.getDisApprovedApprovaldetails();
            }
            else if(data[0].Column1 === "Something Wrong") {
              this.onReject();
              this.ngxService.stop();
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "c", 
                sticky: true,
                closable: false,
                severity: "warn", // "info",
                summary: "Approve date should be between apply date.",
                // detail: data[0].Column1
              });
            }
            else {
              this.ngxService.stop();
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Error",
                detail: "Error Occured"
              });
            }
      });
      console.log('Update ===', TObj)
    }
    else {
      this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Enter Remarks"
      });
    }
  // }
  // else {
  //   this.compacctToast.clear();
  //   this.compacctToast.add({
  //     key: "compacct-toast",
  //     severity: "error",
  //     summary: "Warn Message",
  //     detail: "Something Wrong"
  //   });
  // }
    // }
  }
  disapprove(valid:any){
    this.ApproveFormSubmit = true;
    this.ngxService.start();
   if (valid){
    if(this.ProductPDFFile['size']){
      this.UploadDocDisapprove();
    }
    else{
      this.DisapprovedLoans();
    }
   }
   else {
    this.ngxService.stop();
   }

  }
  UploadDocDisapprove(){
    // this.ApproveFormSubmit = true;
    // if (valid){
      this.documenturllink = undefined;
    if(this.ProductPDFFile['size']){
     this.GlobalAPI.CommonFileUpload(this.ProductPDFFile)
     .subscribe((data : any)=>
     {
      this.documenturllink = data.file_url;
       if(this.documenturllink){
         this.DisapprovedLoans()
       }
       else {
        this.ngxService.stop();
         this.compacctToast.clear();
         this.compacctToast.add({
         key: "compacct-toast",
         severity: "error",
         summary: "Error",
         detail: "Fail to upload"
       });
       }
     }) 
    }
    else {
      this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Error",
      detail: "No File Found"
    });
    }
    // }
   }
  DisapprovedLoans(){
    // this.ApproveFormSubmit = true;
    // if (valid){
    // if(this.txnid && this.pendingempid) {
      if (((Number(this.BusinessManager) === Number(this.empid)) && (this.Approved_Note_Business_Manager)) || 
         ((Number(this.ReportManager) === Number(this.empid)) && (this.Approved_Note_Reporting_Manager))){
      // if ((obj.Approved_Status_Business_Manager && obj.Approved_Note_Business_Manager) || 
      //     (obj.Approved_Status_Reporting_Manager && obj.Approved_Note_Reporting_Manager)) {
      const TObj = {
        Loan_ID : this.loanid,
        Emp_ID : this.pendingempid,
        Voucher_No : this.Ac_Voucher_No,
        Sanction_Date : this.DateService.dateConvert(new Date(this.Sanction_Date)),
        Sanction_Loan_Amount : this.Sanction_Loan_Amount,
        No_Of_EMI_Sanctioned : this.Sanction_EMI,
        EMI_Amount_Sanctioned : this.EMI_Amount,
        EMI_Start_Month_Sanctioned : this.DateService.dateConvert(new Date(this.EMI_Start_From_Date_Month)),
        Remarks : this.Remarks,
        Approved_Status_Business_Manager : this.Approved_Note_Business_Manager ? "N" : this.Approved_Status_Business_Manager,
        Approved_Status_Reporting_Manager : this.Approved_Note_Reporting_Manager ? "N" : this.Approved_Status_Reporting_Manager,
        Approved_Note_Business_Manager : this.Approved_Note_Business_Manager ? this.Approved_Note_Business_Manager : this.NoteBusinessManager,
        Approved_Note_Reporting_Manager : this.Approved_Note_Reporting_Manager ? this.Approved_Note_Reporting_Manager : this.NoteReportingManager,
        Document_Link: this.documenturllink ? this.documenturllink : null
        // Approval_ID : obj.Approval_ID,
        // HR_Remarks : obj.HR_Remarks
       }
    const Tempobj = {
        "SP_String": "SP_HR_Txn_Loan",
        "Report_Name_String": "Update_Loan_Application",
        "Json_Param_String" : JSON.stringify(TObj)
      }
      this.GlobalAPI.postData(Tempobj).subscribe((data:any)=>{
           // console.log(data);
            if(data[0].Column1 === "Done") {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: 'Emp ID : ' + this.pendingempid,
                detail: "Leave Disapproved."
              });
              this.ngxService.stop();
              this.ApproveFormSubmit = false;
              this.DetailsModal = false;
              this.Ac_Voucher_No = undefined;
              this.Approved_Note_Business_Manager = undefined;
              this.Approved_Note_Reporting_Manager = undefined;
              this.getPedingApprovaldetails();
              this.getApprovedApprovaldetails();
              this.getDisApprovedApprovaldetails();
            }
            else if(data[0].Column1 === "Something Wrong") {
              this.onReject();
              this.ngxService.stop();
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "c", 
                sticky: true,
                closable: false,
                severity: "warn", // "info",
                summary: "Approve date should be between apply date.",
                // detail: data[0].Column1
              });
            }
            else {
              this.ngxService.stop();
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Error",
                detail: "Error Occured"
              });
            }
      });
      console.log('Update ===', TObj)
    }
    else {
      this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Enter Remarks"
      });
    }
  // }
  // else {
  //   this.compacctToast.clear();
  //   this.compacctToast.add({
  //     key: "compacct-toast",
  //     severity: "error",
  //     summary: "Warn Message",
  //     detail: "Something Wrong"
  //   });
  // }
    // }
  }
  // showApproved(col:any){
  // this.ViewPopList = [];
  // this.masterPopview = undefined 
  // if(col.Doc_No){
  //   this.masterPopview = col.Doc_No
  //   const tempobj = {
  //     Doc_No  : this.masterPopview
  //   }
  //   const obj = {
  //     "SP_String": "SP_PO_Authorization",
  //     "Report_Name_String": "PO_approval_view",
  //     "Json_Param_String": JSON.stringify([tempobj])
  //   }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //   this.ViewPopList = JSON.parse(data[0].T_element)
  //   this.TElementobj = this.ViewPopList[0];
  //   this.masterPopview = undefined;
  //   this.DetailsArrList = this.ViewPopList[0].pod_Element ? this.ViewPopList[0].pod_Element :undefined;
  //   this.TermsArrList = this.ViewPopList[0].term_Element ? this.ViewPopList[0].term_Element :undefined;
  //  // console.log("TElementobj",this.TElementobj)
  //   //console.log("DetailsArrList",this.DetailsArrList)
  //  // console.log("TermsArrList",this.TermsArrList)
  //      //console.log(this.TElementobj.Doc_NO);
  //     })
  //   setTimeout(() => {
  //     this.ViewProTypeModal = true;
  //   }, 300);
  // }
  // }

  // Approved Approval
  getApprovedApprovaldetails(){
    //console.log(this.ObjBrowse.Doc_No);
    const obj = {
      "SP_String": "SP_HR_Txn_Loan",
      "Report_Name_String": "APPROVED LOAN",
      "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID, Emp_ID : this.empid}]) // , Heading:"APPROVED APPROVAL"

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ApprovedApprovalList = data;
      if(this.ApprovedApprovalList.length){
        this.DynamicHeaderforTabSecond = Object.keys(data[0]);
      }
      else {
        this.DynamicHeaderforTabSecond = [];
      }
      this.BackupApprovedApprovalList = data;
      this.GetDistinctForTab2();
      console.log("this.ApprovedApprovalList  ===",this.ApprovedApprovalList);
      });
  }
  // DISTINCT & FILTER
  GetDistinctForTab2() {
  let DEmpNameTab2:any = [];
  this.DistEmpNameTab2 =[];
  this.SelectedDistEmpNameTab2 =[];
  this.SearchFieldsTab2 =[];
  this.ApprovedApprovalList.forEach((item) => {
 if (DEmpNameTab2.indexOf(item.Emp_ID) === -1) {
  DEmpNameTab2.push(item.Emp_ID);
 this.DistEmpNameTab2.push({ label: item.Emp_Name, value: item.Emp_ID });
 }
});
   this.BackupApprovedApprovalList = [...this.ApprovedApprovalList];
  }
  FilterDistTab2() {
  let DEmpNameTab2:any = [];
  this.SearchFieldsTab2 =[];
if (this.SelectedDistEmpNameTab2.length) {
  this.SearchFieldsTab2.push('Emp_ID');
  DEmpNameTab2 = this.SelectedDistEmpNameTab2;
}
this.ApprovedApprovalList = [];
if (this.SearchFieldsTab2.length) {
  let LeadArr = this.BackupApprovedApprovalList.filter(function (e) {
    return (DEmpNameTab2.length ? DEmpNameTab2.includes(e['Emp_ID']) : true)
  });
this.ApprovedApprovalList = LeadArr.length ? LeadArr : [];
} else {
this.ApprovedApprovalList = [...this.BackupApprovedApprovalList] ;
}
  }

  // Disapproved Loan
  getDisApprovedApprovaldetails(){
    //console.log(this.ObjBrowse.Doc_No);
    const obj = {
      "SP_String": "SP_HR_Txn_Loan",
      "Report_Name_String": "DISAPPROVED LOAN",
      "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID, Emp_ID : this.empid}]) // , Heading:"DISAPPROVED APPROVAL"

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.DisApprovedApprovalList = data;
      if(this.DisApprovedApprovalList.length){
        this.DynamicHeaderforTabThird = Object.keys(data[0]);
      }
      else {
        this.DynamicHeaderforTabThird = [];
      }
      this.BackupDisApprovedApprovalList = data;
      this.GetDistinctForTab3();
      console.log("this.DisApprovedApprovalList  ===",this.DisApprovedApprovalList);
      });
  }
  // DISTINCT & FILTER
  GetDistinctForTab3() {
  let DEmpNameTab3:any = [];
  this.DistEmpNameTab3 =[];
  this.SelectedDistEmpNameTab3 =[];
  this.SearchFieldsTab3 =[];
  this.DisApprovedApprovalList.forEach((item) => {
 if (DEmpNameTab3.indexOf(item.Emp_ID) === -1) {
  DEmpNameTab3.push(item.Emp_ID);
 this.DistEmpNameTab3.push({ label: item.Emp_Name, value: item.Emp_ID });
 }
});
   this.BackupDisApprovedApprovalList = [...this.DisApprovedApprovalList];
  }
  FilterDistTab3() {
  let DEmpNameTab3:any = [];
  this.SearchFieldsTab3 =[];
  if (this.SelectedDistEmpNameTab3.length) {
  this.SearchFieldsTab2.push('Emp_ID');
  DEmpNameTab3 = this.SelectedDistEmpNameTab3;
  }
  this.DisApprovedApprovalList = [];
  if (this.SearchFieldsTab3.length) {
  let LeadArr = this.BackupDisApprovedApprovalList.filter(function (e) {
    return (DEmpNameTab3.length ? DEmpNameTab3.includes(e['Emp_ID']) : true)
  });
  this.DisApprovedApprovalList = LeadArr.length ? LeadArr : [];
  } else {
  this.DisApprovedApprovalList = [...this.BackupDisApprovedApprovalList] ;
  }
  }

}
