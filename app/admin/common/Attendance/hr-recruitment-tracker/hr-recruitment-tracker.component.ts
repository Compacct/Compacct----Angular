import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-hr-recruitment-tracker',
  templateUrl: './hr-recruitment-tracker.component.html',
  styleUrls: ['./hr-recruitment-tracker.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HrRecruitmentTrackerComponent implements OnInit {
  tabIndexToView: number = 0;
  Items: any = ['BROWSE', 'CREATE'];
  tableData: any = [];
  tableSearchField: any = [];
  Requisition_Manager_List: any = [];
  requisition_Date: Date = new Date();
  clinic_Opening_Date: any;
  Clinic_Opening_Timings: any;
  Clinic_Closing_Timings: any;
  new_Hiring_Date: any;
  PositionList: any = [];
  DepartmentList: any = [];
  CostCenterList: any = [];
  StateList: any = [];
  RepManPosList: any = [];
  Spinner: boolean = false;
  buttonname: string = 'Save';
  RequisitionFormSubmitted: boolean = false;
  editMode: boolean = false;
  objRequisitionTracker = new RequisitionTracker();

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "HR Recruitment Tracker",
      Link: "JOH HR --> HR Recruitment Tracker"
    });
    this.getBrowseData();
    this.getRequisitionManager();
    this.getPositionTitle();
    this.getDepartment();
    this.getCostCenter();
    this.getState();
  }

  getBrowseData() {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Recruitment_Tracker",
      "Report_Name_String": "Browse_HR_Txn_Recruitment_Tracker",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('browse response', data);
      this.tableData = data;
      if (data.length) {
        this.tableSearchField = Object.keys(data[0]);
      }
    })
  }

  getRequisitionManager() {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Recruitment_Tracker",
      "Report_Name_String": "Get_Employee_List"
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('Emp List', data);
      data.forEach(element => {
        this.Requisition_Manager_List.push({
          "label": element.Emp_Name,
          "value": element.Emp_ID
        });
        this.RepManPosList.push({
          "label": element.Emp_Name,
          "value": element.Emp_ID
        });
      });
    });
  }

  getPositionTitle() {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Recruitment_Tracker",
      "Report_Name_String": "Get_Designation"
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('position List', data);
      data.forEach(element => {
        this.PositionList.push({
          "label": element.Designation,
          "value": element.Desig_ID
        })
      });
    })
  }

  getDepartment() {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Recruitment_Tracker",
      "Report_Name_String": "Get_Dept"
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('department List', data);
      data.forEach(element => {
        this.DepartmentList.push({
          "label": element.Dept_Name,
          "value": element.Dept_ID
        })
      });
    })
  }

  getCostCenter() {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Recruitment_Tracker",
      "Report_Name_String": "Get_Cost_Center"
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('costcenter List', data);
      data.forEach(element => {
        this.CostCenterList.push({
          "label": element.Location,
          "value": element.Cost_Cen_ID
        })
      });
    })
  }

  getState() {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Recruitment_Tracker",
      "Report_Name_String": "Get_State"
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('State List', data);
      data.forEach(element => {
        this.StateList.push({
          "label": element.State_Name,
          "value": element.State_ID
        })
      });
    })
  }

  departMentChange() {
    // console.log('changes works');
    this.objRequisitionTracker.Dept_Name = undefined;
    if (this.objRequisitionTracker.Dept_ID) {
      let dept = this.DepartmentList.filter((data: any) => {
        return data.value == this.objRequisitionTracker.Dept_ID;
      })
      // console.log('depart name', dept);
      this.objRequisitionTracker.Dept_Name = dept.length ? dept[0].label : undefined;
      // console.log('dept name', this.objRequisitionTracker.Dept_Name);

    }
  }

  clinicChange() {
    // console.log("Clinic Change Works");
    this.clinic_Opening_Date = undefined;
    this.Clinic_Opening_Timings = undefined;
    this.Clinic_Closing_Timings = undefined;
    this.objRequisitionTracker.Weekly_Off_Day = undefined;
    if (this.objRequisitionTracker.Clinic_Type == "New Clinic") {
      this.clinic_Opening_Date = new Date();
      this.Clinic_Opening_Timings = new Date();
      this.Clinic_Closing_Timings = new Date();
    }
  }

  changeVacancyStatus() {
    this.objRequisitionTracker.Selection_Phase = undefined;
    this.objRequisitionTracker.Decision = undefined;
    this.objRequisitionTracker.Vacant_Urgency = undefined;
    this.objRequisitionTracker.Alternative_Plan = undefined;
    this.objRequisitionTracker.Overall_Remarks = undefined;

  }

  SaveForm(valid) {
    // console.log('function works');
    this.RequisitionFormSubmitted = true;
    if (valid) {
      let repName = "";
      let msg = "";
      if (this.editMode) {
        repName = "Update_HR_Txn_Recruitment_Tracker";
        msg = "Update";
      }
      else {
        repName = "Create_HR_Txn_Recruitment_Tracker";
        msg = "Create";
      }
      this.Spinner = true;
      this.RequisitionFormSubmitted = false;
      this.objRequisitionTracker.Req_Date = this.DateService.dateConvert(this.requisition_Date);
      this.objRequisitionTracker.Clinic_Opening_Date = this.clinic_Opening_Date ? this.DateService.dateConvert(this.clinic_Opening_Date) : undefined;
      this.objRequisitionTracker.Clinic_Time_Start = this.Clinic_Opening_Timings ? this.DateService.dateTimeConvert(this.Clinic_Opening_Timings) : undefined;
      this.objRequisitionTracker.Clinic_Time_End = this.Clinic_Closing_Timings ? this.DateService.dateTimeConvert(this.Clinic_Closing_Timings) : undefined;
      this.objRequisitionTracker.New_Hiring_Start_Date = this.new_Hiring_Date ? this.DateService.dateConvert(this.new_Hiring_Date) : undefined;
      this.objRequisitionTracker.Created_By = this.commonApi.CompacctCookies.User_ID;
      this.objRequisitionTracker.Created_On = this.DateService.dateConvert(new Date());
      // console.log('Form valid', this.objRequisitionTracker);
      const obj = {
        "SP_String": "SP_HR_Txn_Employee_Recruitment_Tracker",
        "Report_Name_String": repName,
        "Json_Param_String": JSON.stringify([this.objRequisitionTracker])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('save response', data);
        this.Spinner = false;
        if (data[0].Column1 == "done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Succesfull",
            detail: "Recruitment Tracker Succesfully" + msg
          });
          this.tabIndexToView = 0;
          this.getBrowseData();
          this.clearData();
        }
        else {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Went Wrong"
          });
        }
      });
    }
  }

  Edit(col: any) {
    // console.log('edit works');
    if (col.Txn_ID) {
      this.editMode = true;
      this.Items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      const obj = {
        "SP_String": "SP_HR_Txn_Employee_Recruitment_Tracker",
        "Report_Name_String": "Get_HR_Txn_Recruitment_Tracker",
        "Json_Param_String": JSON.stringify([{ "Txn_ID": col.Txn_ID }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('edit response', data);
        if (data.length) {
          this.tabIndexToView = 1;
          this.objRequisitionTracker = data[0];
          this.objRequisitionTracker.Vacancy_Status = data[0].Vacancy_Status ? data[0].Vacancy_Status : undefined;
          this.objRequisitionTracker.Selection_Phase = data[0].Selection_Phase ? data[0].Selection_Phase : undefined;
          this.objRequisitionTracker.Decision = data[0].Decision ? data[0].Decision : undefined;
          this.objRequisitionTracker.Vacant_Urgency = data[0].Vacant_Urgency ? data[0].Vacant_Urgency : undefined;
          this.new_Hiring_Date = data[0].New_Hiring_Start_Date ? data[0].New_Hiring_Start_Date : undefined;
          this.requisition_Date = new Date(data[0].Req_Date);
          if (data[0].Clinic_Type == "New Clinic") {
            // console.log('date time edit executed');
            this.clinic_Opening_Date = new Date(data[0].Clinic_Opening_Date);
            this.Clinic_Opening_Timings = new Date(data[0].Clinic_Time_Start);
            this.Clinic_Closing_Timings = new Date(data[0].Clinic_Time_End);
          }
          // console.log('update object', this.objRequisitionTracker);
        }
      })
    }
  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  onConfirm() {
  }

  onReject() {
    this.CompacctToast.clear("c");
  }

  clearData() {
    this.editMode = false;
    this.objRequisitionTracker = new RequisitionTracker();
    this.RequisitionFormSubmitted = false;
    this.Spinner = false;
    this.buttonname = "Save";
    this.Items = ['BROWSE', 'CREATE'];
    this.clinic_Opening_Date = undefined;
    this.Clinic_Opening_Timings = undefined;
    this.Clinic_Closing_Timings = undefined;
    this.requisition_Date = new Date();
    this.new_Hiring_Date = undefined;
  }
}

class RequisitionTracker {
  Txn_ID: any;
  Req_Manager: any;
  Req_Date: any;
  Position_Title: any;
  Position_Type: any;
  Source: any;
  Position_Details: any;
  Dept_ID: any;
  Dept_Name: any;
  Clinic_Type: any;
  Cost_Cen_ID: any;
  Location: any;
  Region: any;
  State: any;
  Needed_For: any;
  Recruitment_Urgency: any;
  Report_manager: any;
  Note: any;
  Setup_Type: string = "SIS";
  Clinic_Opening_Date: any;
  Clinic_Time_Start: any;
  Clinic_Time_End: any;
  Weekly_Off_Day: any;
  Highest_Qualification: any;
  Year_Of_Experience: any;
  Sourcing_Benchmark: any;
  Hire_From_Companies: any;
  Additional_Spec: any;
  CTC_As_Per_Budget: any;
  Proposed_CTC_Bond: any;
  Max_CTC_Varience: any;
  Grade_As_Per_Budget: any;
  Proposed_Grade_Range_Designation: any;
  The_Request_is: any;
  Remarks: any;
  New_Hiring_Start_Date: any;
  Vacancy_Status: any;
  Selection_Phase: any;
  Decision: any;
  Vacant_Urgency: any;
  Alternative_Plan: any;
  Overall_Remarks: any;
  Created_By: any;
  Created_On: any;
}