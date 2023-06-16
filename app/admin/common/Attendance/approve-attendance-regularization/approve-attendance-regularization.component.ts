import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-approve-attendance-regularization',
  templateUrl: './approve-attendance-regularization.component.html',
  styleUrls: ['./approve-attendance-regularization.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None

})
export class ApproveAttendanceRegularizationComponent implements OnInit {

  tabIndexToView: number = 0;
  Items: any = ['PENDING APPROVAL', 'APPROVED APPROVAL', 'DISAPPROVE APPROVAL'];
  UserID: number = 0;
  EmpID: number = 0;
  Pending_EmployeeList: any = [];
  SelectedPendingEmployeeList: any = [];
  pendingTableData: any = [];
  pendingTableFilterList: any = [];
  DisplayPopup: boolean = false;
  disabled_Obj: any = {};
  popupTableData: any = [];
  popupTableSearchField: any = [];
  Business_Manager_ID = 0;
  Report_Manager_ID = 0;
  Approved_Note_Reporting_Manager: any;
  Approved_Note_Business_Manager: any;
  remarksFormSubmit: boolean = false;
  Approve_Spinner: boolean = false;
  Disapprove_Spinner: boolean = false;
  approvedTableData: any = [];
  approvedTableFilterData: any = [];
  Approve_EmployeeList: any = [];
  SelectedApproveEmployeeList: any = [];
  disApprovedTableData: any = [];
  disApprovedTableFilterData: any = [];
  DisApprove_EmployeeList: any = [];
  SelectedDisApproveEmployeeList: any = [];
  disApprovedFormSubmit: boolean = false;

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
      Header: "Approve Attendance Regularization",
      Link: "JOH --> Approve Attendance Regularization"
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
      console.log('emp data', data);
      this.EmpID = data[0].Emp_ID;
      // let id: any = data[0].Emp_ID;
      this.getPendingApproval(this.EmpID);
      this.getApproveTableData(this.EmpID);
      this.getDisapproveTableData(this.EmpID);
    });
  }

  getPendingApproval(id) {
    this.Pending_EmployeeList = [];
    const obj = {
      "SP_String": "SP_HR_Txn_Attendance_Regularization",
      "Report_Name_String": "PENDING APPROVAL",
      "Json_Param_String": JSON.stringify([{ "Emp_ID": id }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log('pending table data', data);
      this.pendingTableData = data;
      if (data.length) {
        this.pendingTableFilterList = Object.keys(data[0]);
      }
      data.forEach(element => {
        this.Pending_EmployeeList.push({
          "label": element.Emp_Name,
          "value": element.Emp_Name
        })
      });
    });
  }

  FilterPending() {
    let backupTableData = this.pendingTableData;
    this.pendingTableData = [];
    if (this.SelectedPendingEmployeeList.length) {
      this.SelectedPendingEmployeeList.forEach((ele: any) => {
        let filterData = backupTableData.filter((data: any) => {
          return data.Emp_Name == ele;
        });
        console.log('filterData', filterData);
        if (filterData.length) {
          filterData.forEach((e: any) => {
            this.pendingTableData.push(e);
            console.log('pendingTableData', this.pendingTableData);
          })
        }
      });
    }
    else {
      this.pendingTableData = [...backupTableData];
      console.log('backupTableData', backupTableData, this.pendingTableData);
    }
  }

  ApproveAndDisapprove(col) {
    if (col) {
      this.DisplayPopup = true;
      this.disabled_Obj = col;
      this.Report_Manager_ID = col.Report_Manager;
      this.Business_Manager_ID = col.Business_Manager;
      console.log('ids', this.Report_Manager_ID, this.Business_Manager_ID);
      console.log('empId', this.EmpID);
      const obj = {
        "SP_String": "SP_HR_Txn_Attendance_Regularization",
        "Report_Name_String": "Last_one_month_Attendance_Regularization",
        "Json_Param_String": JSON.stringify([{ "Emp_ID": col.Emp_ID, "Atten_Date": this.DateService.dateConvert(col.Atten_Date) }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log('popup table data', data);
        this.popupTableData = data;
        if (data.length) {
          this.popupTableSearchField = Object.keys(data[0]);
        }
      });
    }
  }

  Approved(valid: any) {
    this.remarksFormSubmit = true;
    if (valid) {
      this.remarksFormSubmit = false;
      this.Approve_Spinner = true;
      let saveObj = {};
      if (this.EmpID == this.Report_Manager_ID) {
        saveObj = {
          "Emp_ID": this.disabled_Obj.Emp_ID,
          "Atten_Date": this.DateService.dateConvert(this.disabled_Obj.Atten_Date),
          "Approved_Status_Reporting_Manager": "Y",
          "Approved_Note_Reporting_Manager": this.Approved_Note_Reporting_Manager,
          "Approved_Status_Business_Manager": this.disabled_Obj.Approved_Status_Business_Manager,
          "Approved_Note_Business_Manager": this.disabled_Obj.Approved_Note_Business_Manager,
          "Changed_In_Time": this.DateService.dateTimeConvert(new Date(this.disabled_Obj.Changed_In_Time)),
          "Changed_Out_Time": this.DateService.dateTimeConvert(new Date(this.disabled_Obj.Changed_Out_Time))
        }
      }
      if (this.EmpID == this.Business_Manager_ID) {
        saveObj = {
          "Emp_ID": this.disabled_Obj.Emp_ID,
          "Atten_Date": this.DateService.dateConvert(this.disabled_Obj.Atten_Date),
          "Approved_Status_Reporting_Manager": this.disabled_Obj.Approved_Status_Reporting_Manager,
          "Approved_Note_Reporting_Manager": this.disabled_Obj.Approved_Note_Reporting_Manager,
          "Approved_Status_Business_Manager": "Y",
          "Approved_Note_Business_Manager": this.Approved_Note_Business_Manager,
          "Changed_In_Time": this.DateService.dateTimeConvert(new Date(this.disabled_Obj.Changed_In_Time)),
          "Changed_Out_Time": this.DateService.dateTimeConvert(new Date(this.disabled_Obj.Changed_Out_Time))
        }
      }
      console.log('approve Object', saveObj);
      const obj = {
        "SP_String": "SP_HR_Txn_Attendance_Regularization",
        "Report_Name_String": "Approve_Attendance_Regularization",
        "Json_Param_String": JSON.stringify([saveObj])
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        console.log('approve Res', data);
        this.Approve_Spinner = false;
        this.DisplayPopup = false;
        if (data[0].Column1 == "Done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Regularization Approve Succesfully",
            detail: "Succesfully Approve"
          });
          this.tabIndexToView = 1;
          this.getPendingApproval(this.EmpID);
          this.getApproveTableData(this.EmpID);
          this.getDisapproveTableData(this.EmpID);
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
      if (this.EmpID == this.Report_Manager_ID) {
        saveObj = {
          "Emp_ID": this.disabled_Obj.Emp_ID,
          "Atten_Date": this.DateService.dateConvert(this.disabled_Obj.Atten_Date),
          "Approved_Status_Reporting_Manager": "N",
          "Approved_Note_Reporting_Manager": this.Approved_Note_Reporting_Manager,
          "Approved_Status_Business_Manager": this.disabled_Obj.Approved_Status_Business_Manager,
          "Approved_Note_Business_Manager": this.disabled_Obj.Approved_Note_Business_Manager,
          "Changed_In_Time": this.DateService.dateTimeConvert(new Date(this.disabled_Obj.Changed_In_Time)),
          "Changed_Out_Time": this.DateService.dateTimeConvert(new Date(this.disabled_Obj.Changed_Out_Time))
        }
      }
      if (this.EmpID == this.Business_Manager_ID) {
        saveObj = {
          "Emp_ID": this.disabled_Obj.Emp_ID,
          "Atten_Date": this.DateService.dateConvert(this.disabled_Obj.Atten_Date),
          "Approved_Status_Reporting_Manager": this.disabled_Obj.Approved_Status_Reporting_Manager,
          "Approved_Note_Reporting_Manager": this.disabled_Obj.Approved_Note_Reporting_Manager,
          "Approved_Status_Business_Manager": "N",
          "Approved_Note_Business_Manager": this.Approved_Note_Business_Manager,
          "Changed_In_Time": this.DateService.dateTimeConvert(new Date(this.disabled_Obj.Changed_In_Time)),
          "Changed_Out_Time": this.DateService.dateTimeConvert(new Date(this.disabled_Obj.Changed_Out_Time))
        }
      }
      console.log('disapproved obj', saveObj);
      const obj = {
        "SP_String": "SP_HR_Txn_Attendance_Regularization",
        "Report_Name_String": "Approve_Attendance_Regularization",
        "Json_Param_String": JSON.stringify([saveObj])
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        console.log('disapprove Res', data);
        this.Disapprove_Spinner = false;
        this.DisplayPopup = false;
        if (data[0].Column1 == "Done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Regularization Dispprove Succesfully",
            detail: "Succesfully Dispprove"
          });
          this.tabIndexToView = 2;
          this.getPendingApproval(this.EmpID);
          this.getApproveTableData(this.EmpID);
          this.getDisapproveTableData(this.EmpID);
          this.clearData();
        }
      });
    }
  }

  ClosePopUp() {
    this.DisplayPopup = false;
    this.disabled_Obj = {};
    this.Report_Manager_ID = 0;
    this.Business_Manager_ID = 0;
    this.Approved_Note_Reporting_Manager = undefined;
    this.Approved_Note_Business_Manager = undefined;
    this.remarksFormSubmit = false;
  }

  getApproveTableData(id) {
    this.Approve_EmployeeList = [];
    const obj = {
      "SP_String": "SP_HR_Txn_Attendance_Regularization",
      "Report_Name_String": "APPROVED APPROVAL",
      "Json_Param_String": JSON.stringify([{ "Emp_ID": id }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log('Approve Table Data', data);
      this.approvedTableData = data;
      if (data.length) {
        this.approvedTableFilterData = Object.keys(data[0]);
      }
      data.forEach(element => {
        this.Approve_EmployeeList.push({
          "label": element.Emp_Name,
          "value": element.Emp_Name
        })
      });
    })
  }

  FilterApprove() {
    let backupTableData = this.approvedTableData;
    this.approvedTableData = [];
    if (this.SelectedApproveEmployeeList.length) {
      this.SelectedApproveEmployeeList.forEach((ele: any) => {
        let filterData = backupTableData.filter((data: any) => {
          return data.Emp_Name == ele;
        });
        console.log('filterData', filterData);
        if (filterData.length) {
          filterData.forEach((e: any) => {
            this.approvedTableData.push(e);
            console.log('ApproveTableData', this.approvedTableData);
          })
        }
      });
    }
    else {
      this.approvedTableData = [...backupTableData];
      console.log('backupTableData', backupTableData, this.approvedTableData);
    }
  }

  getDisapproveTableData(id) {
    this.DisApprove_EmployeeList = [];
    const obj = {
      "SP_String": "SP_HR_Txn_Attendance_Regularization",
      "Report_Name_String": "DISAPPROVED APPROVAL",
      "Json_Param_String": JSON.stringify([{ "Emp_ID": id }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log('Disapprove Table Data', data);
      this.disApprovedTableData = data;
      if (data.length) {
        this.disApprovedTableFilterData = Object.keys(data[0]);
      }
      data.forEach(element => {
        this.DisApprove_EmployeeList.push({
          "label": element.Emp_Name,
          "value": element.Emp_Name
        })
      });
    })
  }

  FilterDisApprove() {
    let backupTableData = this.disApprovedTableData;
    this.disApprovedTableData = [];
    if (this.SelectedDisApproveEmployeeList.length) {
      this.SelectedDisApproveEmployeeList.forEach((ele: any) => {
        let filterData = backupTableData.filter((data: any) => {
          return data.Emp_Name == ele;
        });
        console.log('filterData', filterData);
        if (filterData.length) {
          filterData.forEach((e: any) => {
            this.disApprovedTableData.push(e);
            console.log('disapproveTableData', this.disApprovedTableData);
          })
        }
      });
    }
    else {
      this.disApprovedTableData = [...backupTableData];
      console.log('backupTableData', backupTableData, this.disApprovedTableData);
    }
  }

  disapproveApproval(col) {
    this.disabled_Obj = col;
    this.Report_Manager_ID = col.Report_Manager;
    this.Business_Manager_ID = col.Business_Manager;
    this.CompacctToast.clear();
    this.CompacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
    });

  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  clearData() {
    this.disabled_Obj = {};
    this.Report_Manager_ID = 0;
    this.Business_Manager_ID = 0;
    this.Approved_Note_Reporting_Manager = undefined;
    this.Approved_Note_Business_Manager = undefined;
    this.remarksFormSubmit = false;
    this.disApprovedFormSubmit = false;
  }

  onConfirm(valid) {
    this.disApprovedFormSubmit = true;
    if (valid) {
      this.disApprovedFormSubmit = false;
      let saveObj = {};
      if (this.EmpID == this.Report_Manager_ID) {
        saveObj = {
          "Emp_ID": this.disabled_Obj.Emp_ID,
          "Atten_Date": this.DateService.dateConvert(this.disabled_Obj.Atten_Date),
          "Approved_Status_Reporting_Manager": "N",
          "Approved_Note_Reporting_Manager": this.Approved_Note_Reporting_Manager,
          "Approved_Status_Business_Manager": this.disabled_Obj.Approved_Status_Business_Manager,
          "Approved_Note_Business_Manager": this.disabled_Obj.Approved_Note_Business_Manager,
          "Changed_In_Time": this.DateService.dateTimeConvert(new Date(this.disabled_Obj.Changed_In_Time)),
          "Changed_Out_Time": this.DateService.dateTimeConvert(new Date(this.disabled_Obj.Changed_Out_Time))
        }
      }
      if (this.EmpID == this.Business_Manager_ID) {
        saveObj = {
          "Emp_ID": this.disabled_Obj.Emp_ID,
          "Atten_Date": this.DateService.dateConvert(this.disabled_Obj.Atten_Date),
          "Approved_Status_Reporting_Manager": this.disabled_Obj.Approved_Status_Reporting_Manager,
          "Approved_Note_Reporting_Manager": this.disabled_Obj.Approved_Note_Reporting_Manager,
          "Approved_Status_Business_Manager": "N",
          "Approved_Note_Business_Manager": this.Approved_Note_Business_Manager,
          "Changed_In_Time": this.DateService.dateTimeConvert(new Date(this.disabled_Obj.Changed_In_Time)),
          "Changed_Out_Time": this.DateService.dateTimeConvert(new Date(this.disabled_Obj.Changed_Out_Time))
        }
      }
      console.log('disapproved obj', saveObj);
      const obj = {
        "SP_String": "SP_HR_Txn_Attendance_Regularization",
        "Report_Name_String": "Approve_Attendance_Regularization",
        "Json_Param_String": JSON.stringify([saveObj])
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        console.log('again disapprove Res', data);
        if (data) {
          if (data[0].Column1 == "Done") {
            this.CompacctToast.clear("c");
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Regularization Dispprove Succesfully",
              detail: "Succesfully Dispprove"
            });
            this.getPendingApproval(this.EmpID);
            this.getApproveTableData(this.EmpID);
            this.getDisapproveTableData(this.EmpID);
            this.clearData();
          }
        }
      });
    }
  }

  onReject() {
    this.CompacctToast.clear("c");
    this.clearData();
  }
}
