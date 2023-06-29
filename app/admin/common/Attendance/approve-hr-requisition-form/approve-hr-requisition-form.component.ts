import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-approve-hr-requisition-form',
  templateUrl: './approve-hr-requisition-form.component.html',
  styleUrls: ['./approve-hr-requisition-form.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ApproveHrRequisitionFormComponent implements OnInit {
  tabIndexToView: number = 0;
  Items: any = ['PENDING APPROVAL', 'APPROVED APPROVAL', 'DISAPPROVE APPROVAL'];
  UserID: number = 0;
  EmpID: number = 0;
  TxnID: number = 0;
  Created_By: number = 0;
  disableObj: any = {};
  DisplayPopup: boolean = false;
  Report_Manager_ID: number = 0;
  Business_Manager_ID: number = 0;
  Approved_Note_Reporting_Manager: string = "";
  Approved_Note_Business_Manager: string = "";
  Approved_Note_inGeneral: string = "";
  remarksFormSubmit: boolean = false;
  Approve_Spinner: boolean = false;
  Disapprove_Spinner: boolean = false;
  buttonname: string = 'Create';
  pendingTableData: any = [];
  pendingTableDataSearch: any = [];
  approveTableData: any = [];
  approveTableDataSearch: any = [];
  disapproveTableData: any = [];
  disapproveTableDataSearch: any = [];
  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) {
    this.UserID = this.commonApi.CompacctCookies.User_ID;
  }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Approve Hr Requisition Form",
      Link: "JOH --> Approve Hr Requisition Form"
    });
    this.getEmpId();
  }

  getEmpId() {
    const obj = {
      "SP_String": "SP_HR_Txn_Attendance_Regularization",
      "Report_Name_String": "Get_Emp_ID",
      "Json_Param_String": JSON.stringify([{ "User_ID": this.UserID }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('emp data', data);
      this.EmpID = data[0].Emp_ID;
      this.getPendingList(this.EmpID);
      this.getApproveList(this.EmpID);
      this.getDisapproveList(this.EmpID);

    });
  }

  getPendingList(id) {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
      "Report_Name_String": "PENDING APPROVAL",
      "Json_Param_String": JSON.stringify([{ "Emp_ID": this.EmpID }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('pending List', data);
      this.pendingTableData = data;
      if (data.length) {
        this.pendingTableDataSearch = Object.keys(data[0]);
      }
    })
  }

  getApproveList(id) {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
      "Report_Name_String": "APPROVED APPROVAL",
      "Json_Param_String": JSON.stringify([{ "Emp_ID": this.EmpID }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('approve List', data);
      this.approveTableData = data;
      if (data.length) {
        this.approveTableDataSearch = Object.keys(data[0]);
      }
    })
  }

  getDisapproveList(id) {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
      "Report_Name_String": "DISAPPROVED APPROVAL",
      "Json_Param_String": JSON.stringify([{ "Emp_ID": this.EmpID }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('disapprove List', data);
      this.disapproveTableData = data;
      if (data.length) {
        this.disapproveTableDataSearch = Object.keys(data[0]);
      }
    })
  }

  ApproveDisapprove(col: any) {
    if (col) {
      this.disableObj = col;
      this.Report_Manager_ID = col.Report_Manager1;
      this.Business_Manager_ID = col.Business_Manager;
      this.TxnID = col.Txn_ID;
      this.Created_By = col.Created_By;
      this.DisplayPopup = true;
    }
  }

  Approved(valid: any) {
    this.remarksFormSubmit = true;
    if (valid) {
      this.remarksFormSubmit = false;
      this.Approve_Spinner = true;
      let saveObj = {};
      if (this.EmpID == this.Report_Manager_ID && this.EmpID == this.Business_Manager_ID) {
        saveObj = {
          "Txn_ID": this.TxnID,
          "Created_By": this.Created_By,
          "Approved_Status_Reporting_Manager": "Y",
          "Approved_Note_Reporting_Manager": this.Approved_Note_inGeneral,
          "Approved_Status_Business_Manager": "Y",
          "Approved_Note_Business_Manager": this.Approved_Note_inGeneral,
        }
      }
      else if (this.EmpID == this.Report_Manager_ID) {
        saveObj = {
          "Txn_ID": this.TxnID,
          "Created_By": this.Created_By,
          "Approved_Status_Reporting_Manager": "Y",
          "Approved_Note_Reporting_Manager": this.Approved_Note_Reporting_Manager,
          "Approved_Status_Business_Manager": this.disableObj.Approved_Status_Business_Manager,
          "Approved_Note_Business_Manager": this.disableObj.Approved_Note_Business_Manager,
        }
      }
      else if (this.EmpID == this.Business_Manager_ID) {
        saveObj = {
          "Txn_ID": this.TxnID,
          "Created_By": this.Created_By,
          "Approved_Status_Reporting_Manager": this.disableObj.Approved_Status_Reporting_Manager,
          "Approved_Note_Reporting_Manager": this.disableObj.Approved_Note_Reporting_Manager,
          "Approved_Status_Business_Manager": "Y",
          "Approved_Note_Business_Manager": this.Approved_Note_Business_Manager,
        }
      }
      // console.log('approve Object', saveObj);
      const obj = {
        "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
        "Report_Name_String": "Approve_Requisition",
        "Json_Param_String": JSON.stringify([saveObj])
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        // console.log('approve Res', data);
        this.Approve_Spinner = false;
        this.DisplayPopup = false;
        if (data[0].Column1 == "Done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Requisition Approve Succesfully",
            detail: "Succesfully Approve"
          });
          this.tabIndexToView = 1;
          this.getPendingList(this.EmpID);
          this.getApproveList(this.EmpID);
          this.getApproveList(this.EmpID);
          this.clearData();
        }
      });
    }

  }

  Disapproved(valid: any) {
    this.remarksFormSubmit = true;
    if (valid) {
      this.remarksFormSubmit = false;
      this.Disapprove_Spinner = true;
      let saveObj = {};

      if (this.EmpID == this.Report_Manager_ID && this.EmpID == this.Business_Manager_ID) {
        saveObj = {
          "Txn_ID": this.TxnID,
          "Created_By": this.Created_By,
          "Approved_Status_Reporting_Manager": "N",
          "Approved_Note_Reporting_Manager": this.Approved_Note_inGeneral,
          "Approved_Status_Business_Manager": "N",
          "Approved_Note_Business_Manager": this.Approved_Note_inGeneral,
        }
      }

      else if (this.EmpID == this.Report_Manager_ID) {
        saveObj = {
          "Txn_ID": this.TxnID,
          "Created_By": this.Created_By,
          "Approved_Status_Reporting_Manager": "N",
          "Approved_Note_Reporting_Manager": this.Approved_Note_Reporting_Manager,
          "Approved_Status_Business_Manager": this.disableObj.Approved_Status_Business_Manager,
          "Approved_Note_Business_Manager": this.disableObj.Approved_Note_Business_Manager,
        }
      }
      else if (this.EmpID == this.Business_Manager_ID) {
        saveObj = {
          "Txn_ID": this.TxnID,
          "Created_By": this.Created_By,
          "Approved_Status_Reporting_Manager": this.disableObj.Approved_Status_Reporting_Manager,
          "Approved_Note_Reporting_Manager": this.disableObj.Approved_Note_Reporting_Manager,
          "Approved_Status_Business_Manager": "N",
          "Approved_Note_Business_Manager": this.Approved_Note_Business_Manager,
        }
      }
      // console.log('disapproved obj', saveObj);
      const obj = {
        "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
        "Report_Name_String": "Approve_Requisition",
        "Json_Param_String": JSON.stringify([saveObj])
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        // console.log('disapprove Res', data);
        this.Disapprove_Spinner = false;
        this.DisplayPopup = false;
        if (data[0].Column1 == "Done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Requisition Dispprove Succesfully",
            detail: "Succesfully Dispprove"
          });
          this.tabIndexToView = 2;
          this.getPendingList(this.EmpID);
          this.getApproveList(this.EmpID);
          this.getDisapproveList(this.EmpID);
          this.clearData();
        }
      });
    }
  }

  ClosePopUp() {
    this.DisplayPopup = false;
    this.clearData();
  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  clearData() {
    this.disableObj = {};
    this.Report_Manager_ID = 0;
    this.Business_Manager_ID = 0;
    this.TxnID = 0;
    this.Created_By = 0;
    this.Approved_Note_Reporting_Manager = "";
    this.Approved_Note_Business_Manager = "";
    this.Approved_Note_inGeneral = "";
    this.remarksFormSubmit = false;
    this.Approve_Spinner = false;
    this.Disapprove_Spinner = false;
  }

}
