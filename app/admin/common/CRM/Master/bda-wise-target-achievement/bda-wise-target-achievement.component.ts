import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
declare var $:any;

@Component({
  selector: 'app-bda-wise-target-achievement',
  templateUrl: './bda-wise-target-achievement.component.html',
  styleUrls: ['./bda-wise-target-achievement.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BdaWiseTargetAchievementComponent implements OnInit {
  From_Date : Date;
  To_Date : Date;
  employeelist:any = [];
  MonthdayDatelist = [];
  AttenTypelist = [];
  currentdate = new Date();
  Attendance_Status = undefined;
  attendancestatusFormSubmitted = false;
  employeename = undefined;
  Doc_date = undefined;
  panelvisible = false;
  gtdate : any;
  dateNumber:any = [];
  display = false;
  Spinner = false;
  AttendancSheetList = [];
  Atten_Type : any;
  index = undefined;
  index2 = undefined;
  Month_Name = undefined;
  startdate = undefined;
  color = undefined;
  buttonname = "Save"
  AllAttendanceData = [];
  attendanceIdMap = new Map();

  displayALLEmployee = false;
  Attendance_Status_ALlEmployee = undefined;
  Atten_Type_AllEmployee : any;
  colorAllEmp = undefined;
  inddate = undefined;
  Doc_date_AllEmp = undefined;
  DayName = undefined;

  Select_ISM = undefined;
  MainList = [];
  Report_Name = undefined;
  Member_ID = undefined;
  Forward_Link = undefined;
  Back_Link = undefined;
  tablemsg: any;

  constructor(
    private route : ActivatedRoute,
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "BDA Wise Target Achievement",
      Link: " CRM Master -> BDA -> BDA Wise Target Achievement"
    });
    this.getDateRange(true);
    // const d = new Date();
    // let month = d.getMonth() + 1;
    // console.log('month',month)
    // let year = d.getFullYear();
    // this.Month_Name = month < 10 ? year+'-'+0+month : year+'-'+month
    //this.startdate = this.Month_Name+'-'+'01'
    // console.log('Month_Name',this.Month_Name)
   // this.Month_Name = new Date();
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.From_Date = dateRangeObj[0];
      this.To_Date = dateRangeObj[1];
      this.GetMain();
    }
  }
  
  GetMain(){
    const mainobj ={
      Member_ID : 729,
		  From_Date : this.DateService.dateConvert(new Date(this.From_Date)),
	   	To_Date : this.DateService.dateConvert(new Date(this.To_Date))
    }
    const obj = {
      "SP_String": "sp_Tutopia_BDA_Target_Achievement",
      "Report_Name_String": "MAIN",
      "Json_Param_String": JSON.stringify(mainobj)
    }
    this.GlobalAPI.tutopiacallapis(obj).subscribe((data:any)=>{
      // console.log("MainList  ===",data);
      this.MainList = data;
      this.tablemsg = data[0].Success;
      // console.log(this.tablemsg)
      if (this.tablemsg === "False" || !this.MainList.length) {
        this.Report_Name = "Main Report";
      }
      else {
        this.Report_Name = data[0].Report_Name;
      }
      })
  }
  CheckLengthMemberID(ID) {
    const tempArr = this.MainList.filter(item=> item.Member_ID == ID);
    return tempArr.length
  }
  CheckIndexMemberID(ID) {
    let found = 0;
    for(let i = 0; i < this.MainList.length; i++) {
        if (this.MainList[i].Member_ID == ID) {
            found = i;
            break;
        }
    }
    return found;
  }
  TableChange(obj){
    this.Member_ID = undefined;
    this.Forward_Link = undefined;
    this.Back_Link = undefined;
  if(obj.Member_ID){
    if (obj.Forward_Link) {
     this.Member_ID = obj.Member_ID;
     this.Forward_Link = obj.Forward_Link;
     this.Back_Link = obj.Back_Link;
     this.ApicallForTableChange();
   }
   else {
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "No Data Found "
    });
  }
  }
  }
  ApicallForTableChange(){
    this.MainList = [];
    const mainobj ={
      Member_ID : this.Member_ID,
		  From_Date : this.DateService.dateConvert(new Date(this.From_Date)),
	   	To_Date : this.DateService.dateConvert(new Date(this.To_Date))
    }
    const reportnamestring = this.Forward_Link;
    const obj = {
      "SP_String": "sp_Tutopia_BDA_Target_Achievement",
      "Report_Name_String": reportnamestring,
      "Json_Param_String": JSON.stringify(mainobj)
    }
    this.GlobalAPI.tutopiacallapis(obj).subscribe((data:any)=>{
      // console.log("MainList  ===",data);
      this.MainList = data;
      this.tablemsg = data[0].Success;
      if (this.tablemsg === "False" || !this.MainList.length) {
        this.Report_Name = "Main Report";
        }
        else {
          this.Report_Name = data[0].Report_Name;
        }
      })
  }
  Back(back){
    this.MainList = [];
    if (back.Back_Member_ID) {
    const mainobj ={
      Member_ID : back.Back_Member_ID,
		  From_Date : this.DateService.dateConvert(new Date(this.From_Date)),
	   	To_Date : this.DateService.dateConvert(new Date(this.To_Date))
    }
    // const reportnamestring = this.Back_Link;
    const obj = {
      "SP_String": "sp_Tutopia_BDA_Target_Achievement",
      "Report_Name_String": back.Back_Link,
      "Json_Param_String": JSON.stringify(mainobj)
    }
    this.GlobalAPI.tutopiacallapis(obj).subscribe((data:any)=>{
      // console.log("MainList  ===",data);
      this.MainList = data;
      this.tablemsg = data[0].Success;
      if (this.tablemsg === "False" || !this.MainList.length) {
        this.Report_Name = "Main Report";
        }
        else {
          this.Report_Name = data[0].Report_Name;
        }
      })
  }
  }
  // onrightclick(i,row,i2){
  //   event.preventDefault();
  //   console.log("sgclicki",i)
  //   console.log("sgclicki2",i2)
  //   if(!this.employeelist[i].monthData[i2]) {
  //   this.employeelist[i].monthData[i2] = 'P';
  //   }
  //   // event.preventDefault();
  //   // return false;
  //   // const noContext = document.getElementById('noContextMenu');

  //   // noContext.addEventListener('contextmenu', e => {
  //   //   e.preventDefault();
  //   // });
  // }

}
