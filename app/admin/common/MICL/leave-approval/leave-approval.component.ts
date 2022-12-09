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

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class LeaveApprovalComponent implements OnInit {
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

  constructor(
    private route : ActivatedRoute,
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.items = ["PENDING APPROVAL", "APPROVED APPROVAL", "DISAPPROVED APPROVAL"];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ]; 
    this.Header.pushHeader({
      Header: "Leave Approval",
      Link: " HR -> Transaction -> Leave Approval"
    });
    this.getemployee();
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["PENDING APPROVAL", "APPROVED APPROVAL", "DISAPPROVED APPROVAL"];
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
  // For Pending Approval
  getPedingApprovaldetails(){
    //console.log(this.ObjBrowse.Doc_No);
    const obj = {
      "SP_String": "SP_Leave_Application",
      // "Report_Name_String": "Get_Leave_Apply_Data",
      "Report_Name_String": "PENDING APPROVAL",
      "Json_Param_String": JSON.stringify([{Emp_ID : this.empid}]) //, Heading:"PENDING APPROVAL"

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ApprovalList = data;
      this.BackupApprovalList = data;
      this.GetDistinct();
      console.log("this.ApprovalList  ===",this.ApprovalList);
      this.ApprovalList.forEach(element => {
        if ((element['Approved_Status_Business_Manager'] === "Y") && (element['Approved_Status_Reporting_Manager'] === "Y")) {
          element['approvedisabled'] = true;
        }
        else {
          element['approvedisabled'] = false;
        }
        element['Approved_Status_Business_Manager'] = element['Approved_Status_Business_Manager'] != null ? 
                                                      element['Approved_Status_Business_Manager'] : undefined;
        element['Approved_Status_Reporting_Manager'] = element['Approved_Status_Reporting_Manager'] != null ?
                                                       element['Approved_Status_Reporting_Manager'] : undefined;
        if (Number(element['Business_Manager']) ===  Number(this.empid)) {
          this.Reportdisabled = true;
          this.Bussidisabled = false;
        }
        else if (Number(element['Report_Manager']) ===  Number(this.empid)) {
          this.Bussidisabled = true;
          this.Reportdisabled = false;
        }
        else {
          this.Reportdisabled = false;
          this.Bussidisabled = false;
        }

      });
      // for(let i = 0; i < this.AuthorizedList.length ; i++){
      // this.AuthorizedList[i].Confirm_Qty = this.AuthorizedList[i].Order_Qty;
      // this.AuthorizedList[i].Confirm_Rate = this.AuthorizedList[i].Rate;
      // this.AuthorizedList[i].Confirm_Amount = Number(this.AuthorizedList[i].Confirm_Qty * this.AuthorizedList[i].Confirm_Rate).toFixed(2);
      // this.AuthorizedList[i].Confirm_Amount_With_GST = Number(((this.AuthorizedList[i].Confirm_Qty * this.AuthorizedList[i].Confirm_Rate) * this.AuthorizedList[i].GST_PER) / 100).toFixed(2);
      // //this.AuthorizedList[i].Vendor_Name = this.AuthorizedList[i].Sub_Ledger_ID;
      // }
    })
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

  //View Pop Panding 
  ApprovedPopup(col){
    this.ShowObj = col;
    this.DetailsModal = true;
  }
  ApprovedPo(){}
  DisapprovedPo(){}
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
      "SP_String": "SP_Leave_Application",
      "Report_Name_String": "APPROVED APPROVAL",
      "Json_Param_String": JSON.stringify([{Emp_ID : this.empid}]) // , Heading:"APPROVED APPROVAL"

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

  // Disapproved Approval
  getDisApprovedApprovaldetails(){
    //console.log(this.ObjBrowse.Doc_No);
    const obj = {
      "SP_String": "SP_Leave_Application",
      "Report_Name_String": "DISAPPROVED APPROVAL",
      "Json_Param_String": JSON.stringify([{Emp_ID : this.empid}]) // , Heading:"DISAPPROVED APPROVAL"

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
