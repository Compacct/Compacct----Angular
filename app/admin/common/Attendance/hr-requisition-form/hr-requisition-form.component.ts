import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';


@Component({
  selector: 'app-hr-requisition-form',
  templateUrl: './hr-requisition-form.component.html',
  styleUrls: ['./hr-requisition-form.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HrRequisitionFormComponent implements OnInit {

  tabIndexToView: number = 0;
  Items: any = ['BROWSE', 'CREATE'];
  tableData: any = [];
  tableSearchField: any = [];
  PositionList: any = [];
  DepartmentList: any = [];
  CostCenterList: any = [];
  RepManPosList: any = [];
  level1EmpList: any = [];
  level2EmpList: any = [];
  level3EmpList: any = [];
  ClinicOpeningDate: any;
  ClinicOpeningTimings: any;
  ClinicClosingTimings: any;
  Spinner: boolean = false;
  buttonname: string = 'Create';
  requisitionFormSubmitted: boolean = false;
  editMode: boolean = false;
  objRequisition = new Requisition();

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "HR Requisition Form",
      Link: "JOH --> HR Requisition Form"
    });
    this.getDsg();
    this.getDept();
    this.getCostCenter();
    this.getEmplyee();
    this.getBrowseData();
  }

  getBrowseData() {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
      "Report_Name_String": "Browse_HR_Txn_Employee_Requisition_Form",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('browse response', data);
      this.tableData = data;
      this.tableSearchField = Object.keys(data[0]);
    })
  }

  getDsg() {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
      "Report_Name_String": "Get_Designation",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((element: any) => {
          element["label"] = element.Designation;
          element["value"] = element.Desig_ID;
        });
        this.PositionList = data;
        // console.log("Designatin", data);
      }
    });
  }

  getDept() {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
      "Report_Name_String": "Get_Dept",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((element: any) => {
          element["label"] = element.Dept_Name;
          element["value"] = element.Dept_ID;
        });
        this.DepartmentList = data;
        // console.log("Depaertment", this.DepartmentList);
      }
    });
  }

  getCostCenter() {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((element: any) => {
          element["label"] = element.Location;
          element["value"] = element.Cost_Cen_ID;
        });
        this.CostCenterList = data;
        // console.log("costcenter list", this.CostCenterList);
      }
    });
  }

  getEmplyee() {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
      "Report_Name_String": "Get_Employee_List",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((element: any) => {
          this.RepManPosList.push({
            "label": element.Emp_Name,
            "value": element.Emp_ID
          });
          this.level1EmpList.push({
            "label": element.Emp_Name,
            "value": element.Emp_ID
          });
          this.level2EmpList.push({
            "label": element.Emp_Name,
            "value": element.Emp_ID
          });
          this.level3EmpList.push({
            "label": element.Emp_Name,
            "value": element.Emp_ID
          });
        })
        // console.log("employee list", data);
      }
    });
  }

  departMentChange() {
    // console.log('changes works');
    this.objRequisition.Dept_Name = undefined;
    if (this.objRequisition.Dept_ID) {
      let dept = this.DepartmentList.filter((data: any) => {
        return data.Dept_ID == this.objRequisition.Dept_ID;
      })
      // console.log('depart name', dept);

      this.objRequisition.Dept_Name = dept[0].Dept_Name;
    }
  }

  clinicChange() {
    this.ClinicOpeningDate = undefined;
    this.ClinicOpeningTimings = undefined;
    this.ClinicClosingTimings = undefined;
    this.objRequisition.Weekly_Off_Day = undefined;
    if (this.objRequisition.Clinic_Type == "New Clinic") {
      this.ClinicOpeningDate = new Date();
      this.ClinicOpeningTimings = new Date();
      this.ClinicClosingTimings = new Date();
    }
  }

  SaveForm(valid) {
    // console.log('function works');
    this.requisitionFormSubmitted = true;
    if (valid) {
      let repName = "";
      let msg = "";
      if (this.editMode) {
        repName = "Update_HR_Txn_Employee_Requisition_Form";
        msg = "Update";
      }
      else {
        repName = "Create_HR_Txn_Employee_Requisition_Form";
        msg = "Create";
      }
      this.Spinner = true;
      this.requisitionFormSubmitted = false;
      this.objRequisition.Clinic_Opening_Date = this.ClinicOpeningDate ? this.DateService.dateConvert(this.ClinicOpeningDate) : undefined;
      this.objRequisition.Clinic_Time_Start = this.ClinicOpeningTimings ? this.DateService.dateTimeConvert(this.ClinicOpeningTimings) : undefined;
      this.objRequisition.Clinic_Time_End = this.ClinicClosingTimings ? this.DateService.dateTimeConvert(this.ClinicClosingTimings) : undefined;
      this.objRequisition.Created_By = this.commonApi.CompacctCookies.User_ID;
      this.objRequisition.Created_On = this.DateService.dateConvert(new Date());
      // console.log('Form valid', this.objRequisition);
      const obj = {
        "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
        "Report_Name_String": repName,
        "Json_Param_String": JSON.stringify([this.objRequisition])
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
            detail: "Succesfully" + msg
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
        "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
        "Report_Name_String": "Get_HR_Txn_Employee_Requisition_Form_Data",
        "Json_Param_String": JSON.stringify([{ "Txn_ID": col.Txn_ID }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('edit response', data);
        if (data.length) {
          this.objRequisition = data[0];
          this.tabIndexToView = 1;
          if (data[0].Clinic_Type == "New Clinic") {
            // console.log('date time edit executed');

            this.ClinicOpeningDate = new Date(data[0].Clinic_Opening_Date);
            this.ClinicOpeningTimings = new Date(data[0].Clinic_Time_Start);
            this.ClinicClosingTimings = new Date(data[0].Clinic_Time_End);
          }
        }
      })
    }
  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  clearData() {
    this.editMode = false;
    this.objRequisition = new Requisition();
    this.requisitionFormSubmitted = false;
    this.Spinner = false;
    this.buttonname = "Create";
    this.Items = ['BROWSE', 'CREATE'];
    this.ClinicOpeningDate = undefined;
    this.ClinicOpeningTimings = undefined;
    this.ClinicClosingTimings = undefined;
  }
}

class Requisition {
  Txn_ID: any;
  Position_Title: any;
  Position_Type: any;
  Source: any;
  Position_Details: any;
  Dept_ID: any;
  Dept_Name: any; // retrive purpose
  Clinic_Type: any;
  Cost_Cen_ID: any;
  Location: any;
  Region: any;
  Needed_For: any;
  Recruitment_Urgency: any;
  Report_manager: any;
  Note: any;
  Interviewer_Level_1: any;
  Interviewer_Level_2: any;
  Interviewer_Level_3: any;
  Setup_Type: string = "SIS";
  Clinic_Opening_Date: any; // date field
  Clinic_Time_Start: any; // date time field
  Clinic_Time_End: any; // date time field
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
  Remarks: any;
  Created_By: any; // send form save
  Created_On: any; // send form save
}