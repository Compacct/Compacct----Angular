import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import * as XLSX from "xlsx";

@Component({
  selector: "app-approve-evaluate-for-traning",
  templateUrl: "./approve-evaluate-for-traning.component.html",
  styleUrls: ["./approve-evaluate-for-traning.component.css"],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class ApproveEvaluateForTraningComponent implements OnInit {
  tabIndexToView: number = 0;
  Items: any = ["PENDING APPROVAL", "APPROVED APPROVAL", "DISAPPROVE APPROVAL"];
  Spinner: boolean = false;
  disSpinner: boolean = false;
  UserID: number = 0;
  EmpID: number = 0;
  pendingTableData: any = [];
  pendingTableFilterList: any = [];
  approveTableData: any = [];
  approveTableFilterList: any = [];
  disApproveTableData: any = [];
  disApproveTableFilterList: any = [];
  selectedRows: any = [];
  approveFormSubmit: boolean = false;
  DisplayApprovePopup: boolean = false;
  DisplayDisapprovePopup: boolean = false;
  Remarks: string = "";

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Approve Evaluate For Traning",
      Link: "JOH HR --> Approve Evaluate For Traning",
    });
    this.UserID = this.commonApi.CompacctCookies.User_ID;
    this.getEmpId(this.UserID);
    this.getPendinglList(this.UserID);
    this.getApprovalList(this.UserID);
    this.getDisapprovalList(this.UserID);
  }

  getEmpId(id: number) {
    const obj = {
      SP_String: "SP_HR_Txn_Attendance_Regularization",
      Report_Name_String: "Get_Emp_ID",
      Json_Param_String: JSON.stringify([{ User_ID: id }]),
    };
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("emp data", data);
      this.EmpID = data[0].Emp_ID;
    });
  }

  getPendinglList(id: number) {
    const obj = {
      SP_String: "SP_HR_Evaluate_For_Training",
      Report_Name_String: "PENDING APPROVAL",
      Json_Param_String: JSON.stringify([{ User_ID: id }]),
    };
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("Pending List", data);
      this.pendingTableData = data;
      if (data.length) {
        this.pendingTableFilterList = Object.keys(data[0]);
      }
    });
  }

  getApprovalList(id: number) {
    const obj = {
      SP_String: "SP_HR_Evaluate_For_Training",
      Report_Name_String: "APPROVED APPROVAL",
      Json_Param_String: JSON.stringify([{ User_ID: id }]),
    };
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("Approved List", data);
      this.approveTableData = data;
      if (data.length) {
        this.approveTableFilterList = Object.keys(data[0]);
      }
    });
  }

  getDisapprovalList(id: number) {
    const obj = {
      SP_String: "SP_HR_Evaluate_For_Training",
      Report_Name_String: "DISAPPROVED APPROVAL",
      Json_Param_String: JSON.stringify([{ User_ID: id }]),
    };
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("Disapproved List", data);
      this.disApproveTableData = data;
      if (data.length) {
        this.disApproveTableFilterList = Object.keys(data[0]);
      }
    });
  }

  ApprovePopup() {
    this.DisplayApprovePopup = true;
  }

  closeApprovePopup() {
    this.DisplayApprovePopup = false;
    this.Remarks = '';
    this.approveFormSubmit = false;
  }

  DisapprovePopup() {
    this.DisplayDisapprovePopup = true;
  }

  closeDisapprovePopup() {
    this.DisplayDisapprovePopup = false;
    this.Remarks = '';
    this.approveFormSubmit = false;
  }

  Approve(valid: any) {
    this.approveFormSubmit = true;
    if (valid && this.selectedRows.length) {
      this.approveFormSubmit = false;
      this.Spinner = true;
      let saveObj: any = [];
      this.selectedRows.forEach((ele: any) => {
        saveObj.push({
          Auto_ID: ele,
          Approval_One: this.EmpID,
          Approval_Two: this.EmpID,
          Approval_One_Remarks: this.Remarks,
          Approval_Two_Remarks: this.Remarks,
          Approval_One_Status: "Y",
          Approval_Two_Status: "Y",
        });
      });
      console.log("save obj", saveObj);
      const obj = {
        SP_String: "SP_HR_Evaluate_For_Training",
        Report_Name_String: "Update_Data",
        Json_Param_String: JSON.stringify(saveObj),
      };
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        this.DisplayApprovePopup = false;
        console.log("Approve Res", data);
        if (data[0].Column1 == "Done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Succesfull",
            detail: "Succesfully Approved",
          });
          this.Spinner = false;
          this.tabIndexToView = 1;
          this.clearData();
          this.getPendinglList(this.UserID);
          this.getApprovalList(this.UserID);
          this.getDisapprovalList(this.UserID);
        } else {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Went Wrong",
          });
        }
      });
    }
  }

  Disapprove(valid: any) {
    this.approveFormSubmit = true;
    if (valid && this.selectedRows.length) {
      this.approveFormSubmit = false;
      this.disSpinner = true;
      let saveObj: any = [];
      this.selectedRows.forEach((ele: any) => {
        saveObj.push({
          Auto_ID: ele,
          Approval_One: this.EmpID,
          Approval_Two: this.EmpID,
          Approval_One_Remarks: this.Remarks,
          Approval_Two_Remarks: this.Remarks,
          Approval_One_Status: "N",
          Approval_Two_Status: "N",
        });
      });
      console.log("save obj", saveObj);

      const obj = {
        SP_String: "SP_HR_Evaluate_For_Training",
        Report_Name_String: "Update_Data",
        Json_Param_String: JSON.stringify(saveObj),
      };
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log("disApprove Res", data);
        this.DisplayDisapprovePopup = false;
        if (data[0].Column1 == "Done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Succesfull",
            detail: "Succesfully Disapproved",
          });
          this.disSpinner = false;
          this.tabIndexToView = 2;
          this.clearData();
          this.getPendinglList(this.UserID);
          this.getApprovalList(this.UserID);
          this.getDisapprovalList(this.UserID);
        } else {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Went Wrong",
          });
        }
      });
    }
  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  clearData() {
    this.Spinner = false;
    this.disSpinner = false;
    this.selectedRows = [];
    this.approveFormSubmit = false;
    this.Remarks = "";
  }
}
