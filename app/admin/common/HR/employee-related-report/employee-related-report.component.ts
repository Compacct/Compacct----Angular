import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { ExportExcelService } from '../../../shared/compacct.services/export-excel.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-related-report',
  templateUrl: './employee-related-report.component.html',
  styleUrls: ['./employee-related-report.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeRelatedReportComponent implements OnInit {
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
  seachSpinner: boolean = false;
  buttonname: string = 'Create';
  EmployeeList: any = [];
  Emp_ID: any;
  Atten_Type_ID: any;
  AttenTypelist: any = [];
  GridList: any = [];
  GridListHeader: any = [];
  employeedisabled: boolean = false;
  DateRangeflag: boolean = false;
  excelflag: boolean = false;
  employeeflag: boolean = false;
  attentypeflag: boolean = false;

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService,
    private ExportExcelService: ExportExcelService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Employee Related Report",
      Link: "HR --> Employee Related Report"
    });
    this.getReportNames();
    this.EmployeeData();
    this.getAttendanceType();
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
      "Report_Name_String": "Get_Report_Names_emp",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('report Names', data);
      this.replist = data;
    });
  }

  structureData(repname: any) {
    this.visibleDate = "";
    this.findObj = this.replist.find((ele: any) => ele.report_name == repname)
    console.log('selected report', this.findObj);
    this.DateRangeflag = false;
    this.excelflag = false;
    this.employeeflag = false;
    this.attentypeflag = false;
    if (this.findObj) {
      this.visibleDate = this.findObj.allowed_control;
      console.log('this.visibleDate===', this.visibleDate);
      var allowFields: any = [];
      allowFields = this.visibleDate.split(','); //DT,XL,EMP,AT
      for (let i = 0; i < allowFields.length; i++) {
        if (allowFields[i] == 'DT') {
          this.DateRangeflag = true;
          // console.log('this.DateRangeflag===',this.DateRangeflag)
        }
        else if (allowFields[i] == 'XL') {
          this.excelflag = true;
          // console.log('this.excelflag===',this.excelflag)
        }
        else if (allowFields[i] == 'EMP') {
          this.employeeflag = true;
          // console.log('this.employeeflag===',this.employeeflag)
        }
        else if (allowFields[i] == 'AT') {
          this.attentypeflag = true;
          // console.log('this.attentypeflag===',this.attentypeflag)
        }
      }
    }
  }
  EmployeeData() {
    this.EmployeeList = []
    const obj = {
      "SP_String": "SP_HR_Reports",
      "Report_Name_String": "Get_Employee_List",
      "Json_Param_String": JSON.stringify([{ User_ID: this.$CompacctAPI.CompacctCookies.User_ID }])
    }
    this.GlobalAPI.getData(obj)
      .subscribe((data: any) => {
        if (data.length) {
          data.forEach((ele: any) => {
            ele['label'] = ele.Emp_Name,
              ele['value'] = ele.Emp_ID
          });
          this.EmployeeList = data;
          var empname = this.EmployeeList.filter(el => Number(el.User_ID) === Number(this.$CompacctAPI.CompacctCookies.User_ID))
          console.log(empname)
          this.Emp_ID = empname.length ? empname[0].Emp_ID : undefined;
          this.employeedisabled = empname.length ? true : false;
          console.log("employee==", this.EmployeeList);
        } else {
          this.EmployeeList = [];
          this.Emp_ID = undefined;
        }
      });
  }
  getAttendanceType() {
    this.AttenTypelist = [];
    const obj = {
      "SP_String": "SP_HR_Reports",
      "Report_Name_String": "Get_Leave_Type_List"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.AttenTypelist = data;
      //  console.log("AttenTypelist ===",this.AttenTypelist);
    })
  }
  GetGridData() {
    this.GridList = [];
    this.GridListHeader = [];
    this.seachSpinner = true;
    this.ngxService.start();
    const start = this.From_Date
      ? this.DateService.dateConvert(new Date(this.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.To_Date
      ? this.DateService.dateConvert(new Date(this.To_Date))
      : this.DateService.dateConvert(new Date());
    const senddata = {
      Emp_ID: this.Emp_ID ? this.Emp_ID : 0,
      Atten_Type_ID: this.Atten_Type_ID ? this.Atten_Type_ID : 0,
      StartDate: start,
      EndDate: end
    }
    const obj = {
      "SP_String": "SP_HR_Reports",
      "Report_Name_String": this.ReportName,
      "Json_Param_String": JSON.stringify([senddata])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.GridList = data;
      this.GridListHeader = data.length ? Object.keys(data[0]) : []
      this.seachSpinner = false;
      this.ngxService.stop();
      //  console.log("GridList ===",this.GridList);
    })
  }

  exportExcel(GridList:any,ReportName:any): void {
    let fileName = {report_name:ReportName}
    this.ngxService.start();
    this.ExportExcelService.exprtToExcelHR_Reports(GridList, fileName);
    this.ngxService.stop();
  }

  TabClick(e: any) {
  }
}
