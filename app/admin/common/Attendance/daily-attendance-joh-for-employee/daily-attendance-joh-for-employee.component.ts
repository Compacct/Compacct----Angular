import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-daily-attendance-joh-for-employee',
  templateUrl: './daily-attendance-joh-for-employee.component.html',
  styleUrls: ['./daily-attendance-joh-for-employee.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DailyAttendanceJohForEmployeeComponent implements OnInit {

  EmpList: any[] = []; //Emp List Array
  initDate: any = [];
  From_Date: Date = new Date();
  To_Date: Date = new Date();
  selectedEmpCode: string = '';
  objEmpInfo = new EmpInfo();
  seachSpinner = false;
  SerachFormSubmitted: boolean = false;
  EmpData: any = [];
  EmpDataFilterField: any = [];

  Total_Present: any;
  Total_Present_in_Weekly_Off: any;
  Total_Present_in_Public_Holiday: any;
  Total_Holiday: any;
  Total_Public_Holiday: any;
  Total_Weekly_Off: any;
  Total_Sick_Leave: any;
  Total_Casual_Leave: any;
  Total_Prevlage_Leave: any;
  Total_Compensatory_Off: any;
  Total_Absent: any;
  Leave_Without_Pay: any;
  Total_Left: any;
  Total_Late: any;
  Half_Day: any;
  Annual_Leave: any;
  Missed: any;

  constructor(
    private Header: CompacctHeader,
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }


  ngOnInit() {
    this.Header.pushHeader({
      Header: "Daily Attendance JOH for Employee",
      Link: " HR -> Transaction -> Daily Attendance JOH for Employee"
    });
    this.getEmpList();
  }

  getEmpList() {
    const obj = {
      "SP_String": "SP_HR_Attn_Sheet_Day_Wise",
      "Report_Name_String": "Get_Employee",
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('Emp list>>>', data);
      data.forEach((ele: any) => {
        ele["label"] = ele.Emp_Name;
        ele["value"] = ele.Emp_ID;
      })
      this.EmpList = data;
    });
  }

  getEmpCode(empId: any) {
    this.selectedEmpCode = '';
    this.EmpData = [];
    // console.log('Emp Id>>>', empId);
    if (empId) {
      let selectedEmp = this.EmpList.find((ele: any) => ele.Emp_ID == empId);
      this.selectedEmpCode = selectedEmp ? selectedEmp.Emp_Code : '';
      // console.log('Emp code>>>', selectedEmp);
    }
  }

  getDateRange(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.From_Date = dateRangeObj[0];
      this.To_Date = dateRangeObj[1];
    }
  }

  GetEmpData(valid: any) {
    // console.log('search form valid', valid);
    this.SerachFormSubmitted = true;
    if (valid) {
      this.SerachFormSubmitted = false;
      this.seachSpinner = true;
      this.objEmpInfo.Start_Date = this.DateService.dateConvert(this.From_Date ? this.From_Date : new Date());
      this.objEmpInfo.End_Date = this.DateService.dateConvert(this.To_Date ? this.To_Date : new Date());
      const obj = {
        "SP_String": "SP_HR_Attn_Sheet_Day_Wise",
        "Report_Name_String": "Get_HR_Attn_Sheet_Day_Wise_for_employee",
        "Json_Param_String": JSON.stringify([this.objEmpInfo])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.seachSpinner = false;
        console.log('Emp data>>>', data);
        this.EmpData = data;
        this.TotalLeaveType();
        if(data.length){
          this.EmpDataFilterField = Object.keys(data[0]);
        }
      })
    }
  }


  
  TotalLeaveType() {
    var present = this.EmpData.filter(item => item.Sht_Desc === "P")
    this.Total_Present = present.length ? present.length : undefined;
    // console.log("this.Total_Present===",this.Total_Present);

    var pwoff = this.EmpData.filter(item => item.Sht_Desc === "PWO" || item.Sht_Desc === "PW")
    this.Total_Present_in_Weekly_Off = pwoff.length ? pwoff.length : undefined;

    var pph = this.EmpData.filter(item => item.Sht_Desc === "PPH")
    this.Total_Present_in_Public_Holiday = pph.length ? pph.length : undefined;


    var holiday = this.EmpData.filter(item => item.Sht_Desc === "HL")
    this.Total_Holiday = holiday.length ? holiday.length : undefined;

    var pholiday = this.EmpData.filter(item => item.Sht_Desc === "PH")
    this.Total_Public_Holiday = pholiday.length ? pholiday.length : undefined;


    var woff = this.EmpData.filter(item => item.Sht_Desc === "WO")
    this.Total_Weekly_Off = woff.length ? woff.length : undefined;


    var sickle = this.EmpData.filter(item => item.Sht_Desc === "SL")
    this.Total_Sick_Leave = sickle.length ? sickle.length : undefined;


    var casualle = this.EmpData.filter(item => item.Sht_Desc === "CL")
    this.Total_Casual_Leave = casualle.length ? casualle.length : undefined;


    var prle = this.EmpData.filter(item => item.Sht_Desc === "PL")
    this.Total_Prevlage_Leave = prle.length ? prle.length : undefined;


    var comoff = this.EmpData.filter(item => item.Sht_Desc === "CO")
    this.Total_Compensatory_Off = comoff.length ? comoff.length : undefined;

    var absent = this.EmpData.filter(item => item.Sht_Desc === "A")
    this.Total_Absent = absent.length ? absent.length : undefined;

    var leavewthoutpay = this.EmpData.filter(item => item.Sht_Desc === "LWP")
    this.Leave_Without_Pay = leavewthoutpay.length ? leavewthoutpay.length : undefined;

    var left = this.EmpData.filter(item => item.Sht_Desc === "L")
    this.Total_Left = left.length ? left.length : undefined;

    var late = this.EmpData.filter(item => item.Sht_Desc === "LT")
    this.Total_Late = late.length ? late.length : undefined;

    var halfday = this.EmpData.filter(item => item.Sht_Desc === "HD")
    this.Half_Day = halfday.length ? halfday.length : undefined;

    var annualleave = this.EmpData.filter(item => item.Sht_Desc === "AL")
    this.Annual_Leave = annualleave.length ? annualleave.length : undefined;

    var missed = this.EmpData.filter(item=>item.Sht_Desc === "MS")
    this.Missed = missed.length ? missed.length : undefined;
  }


  onReject() {
    this.compacctToast.clear("c");
    this.compacctToast.clear("re");
  }

  onConfirm(){

  }
  
}

class EmpInfo {
  Emp_ID: any;
  Start_Date: any;
  End_Date: any;
}