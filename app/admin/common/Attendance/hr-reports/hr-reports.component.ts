import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { ExportExcelService } from '../../../shared/compacct.services/export-excel.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-hr-reports',
  templateUrl: './hr-reports.component.html',
  styleUrls: ['./hr-reports.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HrReportsComponent implements OnInit {
  tabIndexToView: number = 0;
  ReportName: any;
  replist: any = [];
  visibleDate: string = "";
  currentMonth: Date = new Date();
  From_Date: Date = new Date();
  To_Date: Date = new Date();
  findObj: any;
  initDate: any = [];
  reportFormSubmit: boolean = false;
  Spinner: boolean = false;
  buttonname: string = 'Create';
  DateRangeflag: boolean = false;
  Monthflag: boolean = false;
  excelflag: boolean = false;
  employeeflag: boolean = false;
  attentypeflag: boolean = false;
  HRyearflag: boolean = false;
  AccHRyearflag: boolean = false;
  Quaterflag: boolean = false;
  quaterlist: any = [];
  HrYearList: any = [];
  AccHrYearList: any = [];
  Quarter: any;
  HR_Year_ID: any;
  Acc_HR_Year_ID: any;
  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService,
    private ExportExcelService: ExportExcelService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "HR Reports",
      Link: "JOH HR --> HR Reports"
    });
    this.getReportNames();
    this.gethrYearList();
    this.getAcchrYearList();
    this.getQuaterNames();
  }

  getDateRange(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.From_Date = dateRangeObj[0];
      this.To_Date = dateRangeObj[1];
    }
  }

  getReportNames() {
    const obj = {
      "SP_String": "SP_HR_Reports",
      "Report_Name_String": "Get_Report_Names",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('report Names', data);
      this.replist = data;
    });
  }
  gethrYearList(){
    const obj = {
      "SP_String":"SP_Leave_Application",
      "Report_Name_String":"Get_HR_Year_List"
   }
   this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.HrYearList = data;
      this.HR_Year_ID =  this.HrYearList.length ? this.HrYearList[0].HR_Year_ID : undefined;
      });
  }
  getAcchrYearList(){
    const obj = {
      "SP_String":"SP_HR_Reports",
      "Report_Name_String":"Get A/C Year"
   }
   this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.AccHrYearList = data;
      this.Acc_HR_Year_ID =  this.AccHrYearList.length ? this.AccHrYearList[0].accyear : undefined;
      });
  }
  getQuaterNames() {
    const obj = {
      "SP_String": "SP_HR_Reports",
      "Report_Name_String": "Get_Quarter_Names",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('report Names', data);
      this.quaterlist = data;
    });
  }

  structureData(repname: any) {
    this.HR_Year_ID =  this.HrYearList.length ? this.HrYearList[0].HR_Year_ID : undefined;
    this.Acc_HR_Year_ID =  this.AccHrYearList.length ? this.AccHrYearList[0].accyear : undefined;
    this.Quarter = undefined;
    this.currentMonth = new Date();
    this.visibleDate = "";
    this.findObj = this.replist.find((ele: any) => ele.report_name == repname)
    console.log('selected report', this.findObj);
    this.DateRangeflag = false;
    this.Monthflag = false;
    this.excelflag = false;
    this.employeeflag = false;
    this.attentypeflag = false;
    this.HRyearflag = false;
    this.AccHRyearflag = false;
    this.Quaterflag = false;
    if (this.findObj) {
      this.visibleDate = this.findObj.allowed_control;
      console.log('this.visibleDate===', this.visibleDate);
      var allowFields: any = [];
      allowFields = this.visibleDate.split(','); //DT,XL,EMP,AT
      for (let i = 0; i < allowFields.length; i++) {
        if (allowFields[i] == 'DT') {
          this.DateRangeflag = true;
        }
        if (allowFields[i] == 'MT') {
          this.Monthflag = true;
        }
        else if (allowFields[i] == 'XL') {
          this.excelflag = true;
        }
        else if (allowFields[i] == 'EMP') {
          this.employeeflag = true;
        }
        else if (allowFields[i] == 'AT') {
          this.attentypeflag = true;
        }
        else if (allowFields[i] == 'YR') {
          this.HRyearflag = true;
        }
        else if (allowFields[i] == 'AccYR') {
          this.AccHRyearflag = true;
        }
        else if (allowFields[i] == 'QR') {
          this.Quaterflag = true;
        }
      }
    }
  }

  exportExcel(valid: any) {
    this.reportFormSubmit = true;
    if (valid) {
      this.reportFormSubmit = false;
      if (this.visibleDate == "MT,XL") {
        this.Spinner = true;
        let paramDate = this.currentMonth ? new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1) : new Date;
        const apiObj = {
          "SP_String": "SP_HR_Reports",
          "Report_Name_String": this.findObj.report_name,
          "Json_Param_String": JSON.stringify([{ "StartDate": this.DateService.dateConvert(paramDate) }])
        }
        this.GlobalAPI.postData(apiObj).subscribe(async (data: any) => {
          // console.log("export excel data", data);
          this.Spinner = false;
          if (data.length) {
            this.ngxService.start();
            await this.ExportExcelService.exprtToExcelHR_Reports(data, this.findObj);
            this.ngxService.stop();
          }
          else {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Excel Export Fail",
              detail: "No Data Available"
            });
          }
        });
      }
      else if (this.visibleDate == "DT,XL") {
        this.Spinner = true;
        const apiObj = {
          "SP_String": "SP_HR_Reports",
          "Report_Name_String": this.findObj.report_name,
          "Json_Param_String": JSON.stringify([{ "StartDate": this.DateService.dateConvert(this.From_Date), "EndDate": this.DateService.dateConvert(this.To_Date) }])
        }
        this.GlobalAPI.postData(apiObj).subscribe(async (data: any) => {
          // console.log("export excel data", data);
          this.Spinner = false;
          if (data.length) {
            this.ngxService.start();
            await this.ExportExcelService.exprtToExcelHR_Reports(data, this.findObj);
            this.ngxService.stop();
          }
          else {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Excel Export Fail",
              detail: "No Data Available"
            });
          }
        });
      }
      else if (this.visibleDate == "XL") {
        this.Spinner = true;
        const apiObj = {
          "SP_String": "SP_HR_Reports",
          "Report_Name_String": this.findObj.report_name
        }
        this.GlobalAPI.postData(apiObj).subscribe(async (data: any) => {
          // console.log("export excel data", data);
          this.Spinner = false;
          if (data.length) {
            this.ngxService.start();
            await this.ExportExcelService.exprtToExcelHR_Reports(data, this.findObj);
            this.ngxService.stop();
          }
          else {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Excel Export Fail",
              detail: "No Data Available"
            });
          }
        });
      }
      else if (this.visibleDate == "YR,QR,XL" || this.visibleDate == "YR,XL" || this.visibleDate == "QR,XL") {
        this.Spinner = true;
        const apiObj = {
          "SP_String": "SP_HR_Reports",
          "Report_Name_String": this.findObj.report_name,
          "Json_Param_String": JSON.stringify([{ "HR_Year_ID": this.HR_Year_ID, "Quarter": this.Quarter }])
        }
        this.GlobalAPI.postData(apiObj).subscribe(async (data: any) => {
          // console.log("export excel data", data);
          this.Spinner = false;
          if (data.length) {
            this.ngxService.start();
            await this.ExportExcelService.exprtToExcelHR_Reports(data, this.findObj);
            this.ngxService.stop();
          }
          else {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Excel Export Fail",
              detail: "No Data Available"
            });
          }
        });
      }
      else if (this.visibleDate == "AccYR,QR,XL") {
        this.Spinner = true;
        let accstartenddate = this.AccHrYearList.filter(ele=> ele.accyear === this.Acc_HR_Year_ID)
        const apiObj = {
          "SP_String": "SP_HR_Reports",
          "Report_Name_String": this.findObj.report_name,
          "Json_Param_String": JSON.stringify([{ "StartDate": this.DateService.dateConvert(accstartenddate[0].StartDate), "EndDate": this.DateService.dateConvert(accstartenddate[0].EndDate), HR_Year_ID:0, "Quarter": this.Quarter }])
        }
        this.GlobalAPI.postData(apiObj).subscribe(async (data: any) => {
          // console.log("export excel data", data);
          this.Spinner = false;
          if (data.length) {
            this.ngxService.start();
            await this.ExportExcelService.exprtToExcelHR_Reports(data, this.findObj);
            this.ngxService.stop();
          }
          else {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Excel Export Fail",
              detail: "No Data Available"
            });
          }
        });
      }
    }
  }

  TabClick(e: any) {
  }
}
