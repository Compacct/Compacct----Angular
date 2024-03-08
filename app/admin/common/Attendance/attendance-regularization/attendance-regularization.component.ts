import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-attendance-regularization',
  templateUrl: './attendance-regularization.component.html',
  styleUrls: ['./attendance-regularization.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})

export class AttendanceRegularizationComponent implements OnInit {

  tabIndexToView: number = 0;
  Items: any = ['BROWSE', 'CREATE'];
  Spinner: boolean = false;
  buttonName: string = 'Apply';
  User_ID: number = 0;
  user_type: string = "";
  AttendenceFormSubmitted: boolean = false;
  apply_Date: Date = new Date();
  attendence_Date: Date;
  min_attendence_Date: Date;
  max_attendence_Date: Date;
  employeeList: any = [];
  Changed_In_Time: any;
  Changed_Out_Time: any;
  disabled_inTime: any;
  disabled_OutTime: any;
  tableData: any = [];
  tableHeader: any = [];
  form_Date: Date = new Date();
  to_Date: Date = new Date();
  Search_Spinner: boolean = false;
  initDate: any = [];
  del_empID: number = 0;
  del_ApplyDate: Date = new Date();
  del_AttenDate: Date = new Date();
  objAttendence = new Attendence();

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Attendance Regularization",
      Link: "JOH --> Attendance_Regularization"
    });
    this.User_ID = this.commonApi.CompacctCookies.User_ID;
    this.user_type = this.commonApi.CompacctCookies.User_Type;
    // console.log('user type', this.user_type);
    var currentdate:Date = new Date();
    const maxattndate =  currentdate.setDate(currentdate.getDate() - 1);
    this.max_attendence_Date = new Date(maxattndate);
    this.attendence_Date = new Date(maxattndate);
    this.getEmployeeList();
    this.getBrowseData();
  }

  getDateRange(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.form_Date = dateRangeObj[0];
      this.to_Date = dateRangeObj[1];
    }

  }

  getBrowseData() {
    const obj = {
      "SP_String": "SP_HR_Txn_Attendance_Regularization",
      "Report_Name_String": "Browse_HR_Txn_Attendance_Regularization",
      "Json_Param_String": JSON.stringify([{
        "From_Date": this.DateService.dateConvert(this.form_Date),
        "To_Date": this.DateService.dateConvert(this.to_Date),
        "User_ID": this.commonApi.CompacctCookies.User_ID
      }])
    }
    this.Search_Spinner = true;
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('browse data', data);
      this.Search_Spinner = false;
      this.tableData = data;
      this.tableHeader = Object.keys(data);
    })
  }

  deleteData(col: any) {
    if (col) {
      this.del_empID = col.Emp_ID;
      this.del_ApplyDate = col.Apply_Date;
      this.del_AttenDate = col.Atten_Date;
      this.CompacctToast.clear();
      this.CompacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });

    }
  }

  getEmployeeList() {
    const obj = {
      "SP_String": "SP_HR_Txn_Attendance_Regularization",
      "Report_Name_String": "Get_Employee_List",
      "Json_Param_String": JSON.stringify([{ "User_ID": this.User_ID }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log("EmployeeList", data);
      if (data.length) {
        data.forEach((employee: any) => {
          this.employeeList.push({
            "label": employee.Emp_Name,
            "value": employee.Emp_ID
          })
        })
      }
    })
  }

  getAttendanceTime() {
    // console.log('changes works');
    this.disabled_inTime = undefined;
    this.disabled_OutTime = undefined;
    if (this.objAttendence.Emp_ID && this.attendence_Date) {
      const obj = {
        "SP_String": "SP_HR_Txn_Attendance_Regularization",
        "Report_Name_String": "Get_Attendance_Time",
        "Json_Param_String": JSON.stringify([{ "Emp_ID": this.objAttendence.Emp_ID, "Date": this.DateService.dateConvert(this.attendence_Date) }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log("get time", data);
        if (data.length) {
          this.disabled_inTime = data[0].Off_In_Time
          this.disabled_OutTime = data[0].Off_Out_Time
        }
      })
    }
  }

  getInTime() {
    let date = new Date(this.attendence_Date.getFullYear(), this.attendence_Date.getMonth(), this.attendence_Date.getDate(), this.Changed_In_Time.getHours(), this.Changed_In_Time.getMinutes());
    return date;
  }
  getOutTime() {
    let date = new Date(this.attendence_Date.getFullYear(), this.attendence_Date.getMonth(), this.attendence_Date.getDate(), this.Changed_Out_Time.getHours(), this.Changed_Out_Time.getMinutes());
    return date;
  }

  SaveForm(valid) {
    this.AttendenceFormSubmitted = true;
    if (valid && this.apply_Date && this.attendence_Date && (this.Changed_In_Time || this.Changed_Out_Time)) {
      this.AttendenceFormSubmitted = false;
      this.Spinner = true;
      this.objAttendence.Apply_Date = this.DateService.dateConvert(this.apply_Date);
      this.objAttendence.Atten_Date = this.DateService.dateConvert(this.attendence_Date);
      this.Changed_In_Time ? this.objAttendence.Changed_In_Time = this.DateService.dateTimeConvert(this.getInTime()) : this.objAttendence.Changed_In_Time = undefined;
      this.Changed_Out_Time ? this.objAttendence.Changed_Out_Time = this.DateService.dateTimeConvert(this.getOutTime()) : this.objAttendence.Changed_Out_Time = undefined;
      this.disabled_inTime ? this.objAttendence.In_Time = this.DateService.dateTimeConvert(new Date(this.disabled_inTime)) : this.objAttendence.In_Time = undefined;
      this.disabled_OutTime ? this.objAttendence.Out_Time = this.DateService.dateTimeConvert(new Date(this.disabled_OutTime)) : this.objAttendence.Out_Time = undefined;
      this.objAttendence.Created_By = this.User_ID;
      // console.log('Save Object', this.objAttendence);

      const obj = {
        "SP_String": "SP_HR_Txn_Attendance_Regularization",
        "Report_Name_String": "Save_HR_Txn_Attendance_Regularization",
        "Json_Param_String": JSON.stringify([this.objAttendence])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('save response', data);
        if (typeof (data[0].Column1) == 'number') {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Succesfully",
            detail: "Succesfully Save"
          });
          this.getBrowseData();
          this.tabIndexToView = 0;
          this.clearData();
        }
        else {
          this.Spinner = false;
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Went Wrong"
          });
        }
      })
    }
    else {
      this.Spinner = false;
      this.CompacctToast.clear();
      this.CompacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Went Wrong"
      });
    }
  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  clearData() {
    this.AttendenceFormSubmitted = false;
    this.Spinner = false;
    this.objAttendence = new Attendence();
    this.apply_Date = new Date();
    var currentdate:Date = new Date();
    const maxattndate =  currentdate.setDate(currentdate.getDate() - 1);
    this.max_attendence_Date = new Date(maxattndate);
    this.attendence_Date = new Date(maxattndate);
    this.del_empID = 0;
    this.del_ApplyDate = new Date();
    this.disabled_inTime = undefined;
    this.disabled_OutTime = undefined;
    this.Changed_In_Time = undefined;
    this.Changed_Out_Time = undefined;
    this.buttonName = "Apply";
    this.Items = ["BROWSE", "CREATE"];
  }

  onConfirm() {
    const obj = {
      "SP_String": "SP_HR_Txn_Attendance_Regularization",
      "Report_Name_String": "Delete_HR_Txn_Attendance_Regularization",
      "Json_Param_String": JSON.stringify([{ "Emp_ID": this.del_empID, "Atten_Date": this.DateService.dateConvert(this.del_AttenDate) }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('delete res', data);
      if (data.length) {
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Succesfully",
          detail: "Succesfully Deleted"
        });
        this.getBrowseData();
      }

    })
  }

  onReject() {
    this.CompacctToast.clear("c");
    this.del_empID = 0;
    this.del_ApplyDate = new Date();
    this.del_AttenDate = new Date();
  }

}

class Attendence {
  Emp_ID: any;
  Apply_Date: any;
  Atten_Date: any;
  Changed_In_Time: any;
  Changed_Out_Time: any;
  In_Time: any;
  Out_Time: any;
  Remarks: any;
  Created_By: any;
}
