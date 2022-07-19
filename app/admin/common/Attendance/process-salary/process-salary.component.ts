import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import * as XLSX from 'xlsx';
declare var $:any;

@Component({
  selector: 'app-process-salary',
  templateUrl: './process-salary.component.html',
  styleUrls: ['./process-salary.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ProcessSalaryComponent implements OnInit {
  currentdate = new Date();
  Doc_date : any;
  display = false;
  Spinner = false;
  Month_Name : any;
  startdate = undefined;
  AllAttendanceData = [];

  DynamicHeader:any = [];
  cols:any =[]
  BrowseList = [];

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
      Header: "Process Salary",
      Link: " HR -> Transaction -> Process Salary"
    });
    // this.getAttendanceType();
    const d = new Date();
    let month = d.getMonth() + 1;
    console.log('month',month)
    let year = d.getFullYear();
    this.Month_Name = month < 10 ? year+'-'+0+month : year+'-'+month
    //this.startdate = this.Month_Name+'-'+'01'
    console.log('Month_Name',this.Month_Name)
   // this.Month_Name = new Date();
    this.GetBrowseData();
  }
  GetBrowseData(){
    this.BrowseList = [];
    var firstDate = this.Month_Name+'-'+'01'
    console.log('firstDate',firstDate)
    const AtObj = {
      StartDate : this.DateService.dateConvert(new Date(firstDate)),
    }
    if (this.Month_Name) {
    const obj = {
      "SP_String": "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String": "Browse Salary Process",
      "Json_Param_String": JSON.stringify([AtObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Data From Api",data);
      this.BrowseList = data;
      if(this.BrowseList.length){
        this.DynamicHeader = Object.keys(data[0]);
         this.DynamicHeader.forEach((el:any)=>{
          this.cols.push({
           header: el 
          })
        })
      }
      else {
        this.DynamicHeader = [];
      }
      console.log('this.BrowseList',this.BrowseList)
  })
  }
  }
  UpdateSPBrowseData(){
    this.BrowseList = [];
    var firstDate = this.Month_Name+'-'+'01'
    console.log('firstDate',firstDate)
    const AtObj = {
      StartDate : this.DateService.dateConvert(new Date(firstDate)),
    }
    if (this.Month_Name) {
    const obj = {
      "SP_String": "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String": "Update Salary Process",
      "Json_Param_String": JSON.stringify([AtObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Data From Api",data);
      this.BrowseList = data;
      if(this.BrowseList.length){
        this.DynamicHeader = Object.keys(data[0]);
         this.DynamicHeader.forEach((el:any)=>{
          this.cols.push({
           header: el 
          })
        })
        this.GetBrowseData();
      }
      else {
        this.DynamicHeader = [];
        this.GetBrowseData();
      }
      console.log('this.BrowseList',this.BrowseList)
  })
  }
  }
  exportoexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }

}
