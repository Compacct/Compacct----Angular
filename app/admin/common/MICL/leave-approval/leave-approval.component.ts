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
  employeelist = [];
  ApprovalList:any = [];
  empid: any;
  Bussidisabled = false;
  Reportdisabled = false;
  approvedisabled = false;

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
    this.Header.pushHeader({
      Header: "Leave Approval",
      Link: " HR -> Transaction -> Leave Approval"
    });
    this.getemployee();
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
       this.getApprovaldetails();
    })
  }
  getApprovaldetails(){
    //console.log(this.ObjBrowse.Doc_No);
    const obj = {
      "SP_String": "SP_Leave_Application",
      "Report_Name_String": "Get_Leave_Apply_Data",
      "Json_Param_String": JSON.stringify([{Emp_ID : this.empid}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ApprovalList = data;
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
              this.getApprovaldetails();
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
        detail: "Something Wrong"
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

}
