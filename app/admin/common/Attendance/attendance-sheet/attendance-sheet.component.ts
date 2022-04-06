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
  selector: 'app-attendance-sheet',
  templateUrl: './attendance-sheet.component.html',
  styleUrls: ['./attendance-sheet.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AttendanceSheetComponent implements OnInit {
  employeelist = [];
  MonthdayDatelist = [];
  currentdate = new Date();
  Attendance_Status = undefined;
  attendanceFormSubmitted = false;
  employeename = undefined;
  Doc_date = undefined;
  panelvisible = false;
  gtdate : any;
  dateNumber:any = [];
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
      Header: "Attendance Sheet",
      // Link: " Outlet -> Pos Bill -> Outlet Report"
    });
    this.getemployeename();
    this.getmonthdaydate();
  }
  getemployeename(){
    // this.employeelist = [
    //   {value:"employee 1", Name:"employee 1"},
    //   {value:"employee 2", Name:"employee 2"},
    //   {value:"employee 3", Name:"employee 3"},
    //   {value:"employee 4", Name:"employee 4"}
    // ]
    const obj = {
      "SP_String": "HR_Txn_Attn_Sheet",
      "Report_Name_String": "Get_EMP_Data"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.employeelist = data;
      //this.getOutlet();
      //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      //this.BrandDisable = false;
       console.log("employeelist ===",this.employeelist);
    })
  }
  getmonthdaydate(){
    var firstDay = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth(), 1);
    var lastDay = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth() + 1, 0);
    const TObj = {
      Start_Date : this.DateService.dateConvert(new Date(firstDay)),
      End_Date : this.DateService.dateConvert(new Date(lastDay))
    }
    const obj = {
      "SP_String": "HR_Txn_Attn_Sheet",
      "Report_Name_String": "Month_Data",
      "Json_Param_String": JSON.stringify([TObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.MonthdayDatelist = data;
     
    ///let myArray = text.split(" ");
    data.forEach(ele => {
      let spdata =  ele.Date.split(" ")
      this.dateNumber.push({
        date :spdata[0]
      })
    });
      console.log("tempArr",this.dateNumber)
  
      // console.log("MonthdayDatelist ===",this.MonthdayDatelist);
    })
  }
  getpanel(row){
    if (row.Emp_ID) {
      this.employeename = row.Emp_Name
      //this.Doc_date = col.
    this.panelvisible = true;
    }
  }
  toggle($event,row) {
    if (row.Emp_ID) {
      console.log(row.Emp_ID)
      this.employeename = row.Emp_Name
      //this.Doc_date = col.
    this.panelvisible = true;
    }
  }
  test(col:any){
    console.log("col",col)
  }
  // getdays(){
  //   this.Datelist = [
  //     {date:"1" , day:"Mon"},
  //     {date:"2" , day:"Tue"},
  //     {date:"3" , day:"Wed"},
  //     {date:"4" , day:"Thrus"}
  //   ]
  // }

}
