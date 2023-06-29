import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { collectExternalReferences, THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-joh-daily-attendance',
  templateUrl: './joh-daily-attendance.component.html',
  styleUrls: ['./joh-daily-attendance.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class JohDailyAttendanceComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  ShowSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  myDate = new Date();
  EmpDailyAttenList:any = [];
  BackupEmpDailyAttenList:any = [];
  AttenTypelist:any = [];
  Daily_Atten_Date = new Date();
  AttendancePopup = false;
  attendancetypeFormSubmitted = false;
  empid: any;
  Atten_Type: any;
  employeename: any;
  checkbuttonname: any;
  AttendanceTypeList:any = [];
  DetailsModal = false;
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
  Total_Late:any;
  Half_Day: any;
  Annual_Leave: any;
  DistWorkLocation:any = [];
  SelectedDistWorkLocation:any = [];
  SearchFields:any = [];
  databaseName:any;
  recaptureSpinner = false;
  Recapture:any;
  CheckFinalizedOrNot:any;
  SaveButtonDisabled:boolean = false;
  OTPopup:boolean = false;
  OtEmpid: any;
  OtEmpname: any;
  OT_Hours:any;
  OTFormSubmitted:boolean = false;
  Overtime_Rate:any;
  Per_Hours:any;
  Total_Amount:any;
  Add_Custom_Salary_Multiple: any;
  otattntype: any;
  Balance: any;
  ottotalmin:any;
  fixedtotalamt: any;
  backupperhour: any;


  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Daily Attendance Sheet",
      Link: " HR -> Transaction -> Daily Attendance Sheet"
    });
    this.getDatabase();
    this.getAttendanceType();
    // this.GetEmpData();
  }
  getDatabase(){
    this.$http
        .get("/Common/Get_Database_Name",
        {responseType: 'text'})
        .subscribe((data: any) => {
          this.databaseName = data;
          console.log(data)
        });
  }
  getAttendanceType(){
    const obj = {
      "SP_String": "SP_HR_Attn_Sheet_Day_Wise",
      "Report_Name_String": "Get_Attn_Data_Type"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.AttenTypelist = data;
       console.log("AttenTypelist ===",this.AttenTypelist);
      //  this.AttenTypelist.forEach((val) => {
      //    if(val.Sht_Desc) {
      //     this.attendanceIdMap.set(val.Sht_Desc.trim(),val);
      //    }
      //  })
    })
  }
  getdataforbuttondisabled(){
    this.CheckFinalizedOrNot = undefined;
    // this.SaveButtonDisabled = false;
    var date = new Date(this.Daily_Atten_Date);
    var month = date.getMonth() + 1;
    // console.log('month>>>',month)
    var year = date.getFullYear();
    // console.log('year>>>',year)
    var firstDate = year+"-"+month+"-"+"01";
    // console.log('firstdate>>>',this.DateService.dateConvert(new Date(firstdate)))
    const obj = {
      "SP_String": "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String": "Check Finalized Or Not",
      "Json_Param_String": JSON.stringify([{StartDate : this.DateService.dateConvert(new Date(firstDate))}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.CheckFinalizedOrNot = data ? data[0].Column1 : undefined;
      this.SaveButtonDisabled = this.CheckFinalizedOrNot === "Finalized" ? true : false;
    })
  }
   GetEmpData(){
    this.seachSpinner = true;
    this.checkbuttonname = undefined;
    this.Recapture = undefined;
    const AtObj = {
      Date : this.DateService.dateConvert(new Date(this.Daily_Atten_Date)),
    }
    const obj = {
      "SP_String": "SP_HR_Attn_Sheet_Day_Wise",
      "Report_Name_String": "Get_HR_Attn_Sheet_Day_Wise",
      "Json_Param_String": JSON.stringify([AtObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.EmpDailyAttenList = data;
      this.BackupEmpDailyAttenList = data;
      this.GetDistinct();
      this.seachSpinner = false;
      this.checkbuttonname = data[0].Btn_Name;
      if (this.checkbuttonname === "Update") {
        this.buttonname = "Update";
      }
      else{
        this.buttonname = "Save";
      }
      this.EmpDailyAttenList.forEach((val) => {
        val["OTdisabled"] = false;
        val["Work_Minute"] = 0;//val.Work_Minute;
        val["minDate"] = Date;
        if(val.Atten_Type_ID) {
        var attendanceid = this.AttenTypelist.filter( ele => Number(ele.Atten_Type_ID) === Number(val.Atten_Type_ID));
        val.Atten_Type_ID = attendanceid ?  attendanceid[0].Sht_Desc : null;
        }
          val["OTdisabled"] = true;
      })
      this.TotalLeaveType();
      this.getdataforbuttondisabled();
     })
  }
  GetReCaptureData(){
    this.recaptureSpinner = true;
    this.checkbuttonname = undefined;
    this.Recapture = undefined;
    const AtObj = {
      Date : this.DateService.dateConvert(new Date(this.Daily_Atten_Date)),
    }
    const obj = {
      "SP_String": "SP_HR_Attn_Sheet_Day_Wise",
      "Report_Name_String": "Recapture_HR_Attn_Sheet_Day_Wise",
      "Json_Param_String": JSON.stringify([AtObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.EmpDailyAttenList = data;
      this.BackupEmpDailyAttenList = data;
      this.GetDistinct();
      this.recaptureSpinner = false;
      this.checkbuttonname = data[0].Btn_Name;
      this.Recapture = data[0].Recapture;
      if (this.checkbuttonname === "Update") {
        this.buttonname = "Update";
      }
      else{
        this.buttonname = "Save";
      }
      this.EmpDailyAttenList.forEach((val) => {
        val["OTdisabled"] = false;
        val["Work_Minute"] = 0;//val.Work_Minute;
        val["minDate"] = Date;
        if(val.Atten_Type_ID) {
        var attendanceid = this.AttenTypelist.filter( ele => Number(ele.Atten_Type_ID) === Number(val.Atten_Type_ID));
        val.Atten_Type_ID = attendanceid ?  attendanceid[0].Sht_Desc : null;
        }
          val["OTdisabled"] = true;
      })
      this.TotalLeaveType();
      this.getdataforbuttondisabled();
     })
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DWorkLocation:any = [];
    this.DistWorkLocation =[];
    this.SelectedDistWorkLocation =[];
    this.SearchFields =[];
    this.EmpDailyAttenList.forEach((item) => {
   if (DWorkLocation.indexOf(item.Work_Location) === -1) {
    DWorkLocation.push(item.Work_Location);
   this.DistWorkLocation.push({ label: item.Work_Location, value: item.Work_Location });
   }
  });
     this.BackupEmpDailyAttenList = [...this.EmpDailyAttenList];
  }
  FilterDist() {
    let DWorkLocation:any = [];
    this.SearchFields =[];
  if (this.SelectedDistWorkLocation.length) {
    this.SearchFields.push('Process_ID');
    DWorkLocation = this.SelectedDistWorkLocation;
  }
  this.EmpDailyAttenList = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupEmpDailyAttenList.filter(function (e) {
      return (DWorkLocation.length ? DWorkLocation.includes(e['Work_Location']) : true)
    });
  this.EmpDailyAttenList = LeadArr.length ? LeadArr : [];
  } else {
  this.EmpDailyAttenList = [...this.BackupEmpDailyAttenList] ;
  }
  this.TotalLeaveType();
  }
  TotalLeaveType(){
    var present = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "P")
    this.Total_Present = present.length ? present.length : undefined;
    // console.log("this.Total_Present===",this.Total_Present);

    var pwoff = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "PWO" || item.Atten_Type_ID === "PW")
    this.Total_Present_in_Weekly_Off = pwoff.length ? pwoff.length : undefined;
    // console.log("this.Total_Present_in_Weekly_Off===",this.Total_Present_in_Weekly_Off);

    var pph = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "PPH")
    this.Total_Present_in_Public_Holiday = pph.length ? pph.length : undefined;
    // console.log("this.Total_Present_in_Public_Holiday===",this.Total_Present_in_Public_Holiday);

    var holiday = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "HL")
    this.Total_Holiday = holiday.length ? holiday.length : undefined;
    // console.log("this.Total_Holiday===",this.Total_Holiday);

    var pholiday = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "PH")
    this.Total_Public_Holiday = pholiday.length ? pholiday.length : undefined;
    // console.log("this.Total_Public_Holiday===",this.Total_Public_Holiday);

    var woff = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "WO")
    this.Total_Weekly_Off = woff.length ? woff.length : undefined;
    // console.log("this.Total_Weekly_Off===",this.Total_Weekly_Off);
    
    var sickle = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "SL")
    this.Total_Sick_Leave = sickle.length ? sickle.length : undefined;
    // console.log("this.Total_Sick_Leave===",this.Total_Sick_Leave);

    var casualle = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "CL")
    this.Total_Casual_Leave = casualle.length ? casualle.length : undefined;
    // console.log("this.Total_Casual_Leave===",this.Total_Casual_Leave);

    var prle = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "PL")
    this.Total_Prevlage_Leave = prle.length ? prle.length : undefined;
    // console.log("this.Total_Prevlage_Leave===",this.Total_Prevlage_Leave);

    var comoff = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "CO")
    this.Total_Compensatory_Off = comoff.length ? comoff.length : undefined;
    // console.log("this.Total_Compensatory_Off===",this.Total_Compensatory_Off);

    var absent = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "A")
    this.Total_Absent = absent.length ? absent.length : undefined;
    // console.log("this.Total_Absent===",this.Total_Absent);

    var leavewthoutpay = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "LWP")
    this.Leave_Without_Pay = leavewthoutpay.length ? leavewthoutpay.length : undefined;
    // console.log("this.Leave_Without_Pay===",this.Leave_Without_Pay);

    var left = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "L")
    this.Total_Left = left.length ? left.length : undefined;
    // console.log("this.Total_Left===",this.Total_Left);

    var late = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "LT")
    this.Total_Late = late.length ? late.length : undefined;
    // console.log("this.Total_Late===",this.Total_Late);

    var halfday = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "HD")
    this.Half_Day = halfday.length ? halfday.length : undefined;
    // console.log("this.Half_Day===",this.Half_Day);

    var annualleave = this.EmpDailyAttenList.filter(item=>item.Atten_Type_ID === "AL")
    this.Annual_Leave = annualleave.length ? annualleave.length : undefined;
    // console.log("this.Half_Day===",this.Half_Day);
  }
  getAttenTypedropdown(atnid){
    const obj = {
      "SP_String": "SP_HR_Attn_Sheet_Day_Wise",
      "Report_Name_String": "Get_Attn_Data_Type"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      var attntypelist = data;
      //  console.log("AttendanceTypeList ===",this.AttendanceTypeList);
      if (atnid == "WO") {
        var atdata = attntypelist.filter(function(value){
          return value.Atten_Type_ID != 2 && 
                 value.Atten_Type_ID != 3 && 
                 value.Atten_Type_ID != 4 && 
                 value.Atten_Type_ID != 5 && 
                 value.Atten_Type_ID != 6 && 
                 value.Atten_Type_ID != 8 && 
                 value.Atten_Type_ID != 9 && 
                 value.Atten_Type_ID != 10 &&
                 value.Atten_Type_ID != 11 &&
                 value.Atten_Type_ID != 12 && 
                 value.Atten_Type_ID != 13 && 
                 value.Atten_Type_ID != 15 
                //  Number(value.Atten_Type_ID) == 1 && 
                //  Number(value.Atten_Type_ID) == 7 && 
                //  Number(value.Atten_Type_ID) == 11 && 
                //  Number(value.Atten_Type_ID) == 14 && 
                //  Number(value.Atten_Type_ID) == 15 ;
        });
        this.AttendanceTypeList = atdata;
      }
      else if (atnid == "PH") {
        var atdata = attntypelist.filter(function(value){
          return value.Atten_Type_ID != 2 && 
                 value.Atten_Type_ID != 3 && 
                 value.Atten_Type_ID != 4 && 
                 value.Atten_Type_ID != 5 && 
                 value.Atten_Type_ID != 6 && 
                 value.Atten_Type_ID != 7 &&
                 value.Atten_Type_ID != 8 && 
                 value.Atten_Type_ID != 9 && 
                 value.Atten_Type_ID != 10 &&
                 value.Atten_Type_ID != 12 && 
                 value.Atten_Type_ID != 13 && 
                 value.Atten_Type_ID != 14
        });
        this.AttendanceTypeList = atdata;
      }
      else if (atnid == "PWO" || atnid == "PW" || atnid == "PPH") {
        this.AttendanceTypeList = attntypelist;
      }
      else {
        var atdata = attntypelist.filter(function(value){
          return value.Atten_Type_ID != 14 &&
                 value.Atten_Type_ID != 15;
        });
        this.AttendanceTypeList = atdata;
      }
    })
  }
  ShowAttendancePopup(obj){
    this.empid = undefined;
    this.employeename = undefined;
    this.Atten_Type = undefined;
    if(obj.Emp_ID && obj.Atten_Type_ID) {
      this.empid = obj.Emp_ID;
      this.employeename = obj.Emp_Name;
      var attnid = this.AttenTypelist.filter(ele=> ele.Sht_Desc === obj.Atten_Type_ID)
      this.Atten_Type = attnid[0].Atten_Type_ID;
      console.log("this.Atten_Type===",this.Atten_Type)
      if(this.Atten_Type === 8 || this.Atten_Type === 6){
      this.GetBalance();
      }
      this.AttendancePopup = true;
    }
  }
  GetBalance() {
    this.Balance = undefined;
    const AtObj = {
      Emp_ID : this.empid,
      Atten_Type_ID : this.Atten_Type,
      Date : this.DateService.dateConvert(new Date(this.Daily_Atten_Date))
    }
    const objtemp = {
      "SP_String": "SP_HR_Attn_Sheet_Day_Wise",
      "Report_Name_String": "Show_Balance",
      "Json_Param_String": JSON.stringify([AtObj])
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      this.Balance = data.length ? data[0].Balance : "0";
    })
  }
  // CheckIsLeave () {
  //   const attndata = this.AttenTypelist.filter(item=> Number(item.Atten_Type_ID) === Number(this.Atten_Type));
  //     if(attndata.length) {
  //       if(attndata[0].Is_Leave === true) {
  //         return true;
  //       } else {
  //         this.compacctToast.clear();
  //         this.compacctToast.add({
  //           key: "compacct-toast",
  //           severity: "error",
  //           summary: "Warn Message",
  //           detail: "Quantity can't be more than in batch available quantity "
  //         });
  //         return false;
  //       }
  //     } else {
  //       return true;
  //     }
  //   }
  CheckApproveStatus(valid){
    this.attendancetypeFormSubmitted = true;
    var attndata = this.AttenTypelist.filter(item=> Number(item.Atten_Type_ID) === Number(this.Atten_Type))
    var isleave = attndata[0].Is_Leave;
    const objattn = {
      Emp_ID : this.empid,
      Atten_Type_ID : this.Atten_Type,
      Date : this.DateService.dateConvert(new Date(this.Daily_Atten_Date))
    }
    if(valid){
    if(isleave === true) {
      const obj = {
        "SP_String": "SP_Leave_Application",
        "Report_Name_String" : "Check_Approve_Status",
       "Json_Param_String": JSON.stringify([objattn])

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        if(data[0].Column1 === "OK"){
         this.SaveAttendanceType();
        } else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "c",
            sticky: true,
            severity: "warn",
            summary: data[0].Column1,
            detail: ""
          });
        }
      })
    }
    else {
      this.SaveAttendanceType();
    }
    }
  }
  SaveAttendanceType(){
    // this.attendancetypeFormSubmitted = true;
    // if (valid){
       this.EmpDailyAttenList.forEach((el:any)=>{
         if(Number(el.Emp_ID )== Number(this.empid)){
          var attenshtdes = this.AttenTypelist.filter( ele => Number(ele.Atten_Type_ID) === Number(this.Atten_Type));
          el.Atten_Type_ID = attenshtdes ?  attenshtdes[0].Sht_Desc : null;
         }
       })
      //  this.attendancestatusFormSubmitted = false;
       this.AttendancePopup = false;
    // }
  }
  CalculateTime(obj){
    // console.log("obj.Off_Out_Time",new Date(obj.Off_Out_Time))
    // console.log("obj.Off_In_Time",new Date(obj.Off_In_Time))
      // obj.Work_Minute = undefined;
      if (obj.Off_In_Time) {
        obj.minDate = new Date(obj.Off_In_Time);
      }
      if (obj.Off_In_Time && obj.Off_Out_Time) {
        // console.log("obj.Off_Out_Time",obj.Off_In_Time)
        // console.log("obj.Off_In_Time",obj.Off_In_Time)
        var outtime:any = new Date(obj.Off_Out_Time);
        var intime:any = new Date(obj.Off_In_Time);
        // console.log("getOut_Time",outtime.getTime())
        // console.log("getIn_Time",intime.getTime())
      // var minutes = Math.abs(outtime.getTime() - intime.getTime()) / 36e5 * 60;
      var minutes = (Math.abs(outtime.getTime() - intime.getTime()) / (1000 * 60));
      obj.Work_Minute = minutes;
      // console.log(this.DateService.dateTimeConvert(new Date(this.objemployee.Off_In_Time)));
      // console.log(this.DateService.dateTimeConvert(new Date(this.objemployee.Off_Out_Time)));
    } 
  }
  // TimeChq(col){
  //   this.flag = false;
  //   console.log("col",col);
  //   if(col.Delivery_Qty){
  //     if(col.Delivery_Qty <=  col.Batch_Qty){
  //       this.flag = false;
  //       return true;
  //     }
  //     else {
  //       this.flag = true;
  //       this.compacctToast.clear();
  //            this.compacctToast.add({
  //                key: "compacct-toast",
  //                severity: "error",
  //                summary: "Warn Message",
  //                detail: "Quantity can't be more than in batch available quantity "
  //              });
  
  //            }
  //   }
  //  }
  // SAVE AND UPDATE
  dataforSave(){
    // console.log(this.DateService.dateConvert(new Date(this.myDate)))
    if(this.BackupEmpDailyAttenList.length) {
      // if(this.saveRemarks()){
      let tempArr:any =[]
      this.BackupEmpDailyAttenList.forEach(item => {
        // if (new Date(item.Off_Out_Time) <= new Date(item.Off_In_Time)) {
        // if(item.Wastage_Qty && Number(item.Wastage_Qty) != 0) {
        //  var Prorecqty = this.MaterialType_Flag === "Semi Finished" ? "Production_Qty" : "Receive_Qty"
        var attenid = this.AttenTypelist.filter(el=> el.Sht_Desc === item.Atten_Type_ID)
     const TempObj = {
            Date : this.DateService.dateConvert(new Date(this.Daily_Atten_Date)),
            Emp_Code	: item.Emp_Code,
            Emp_ID : item.Emp_ID,
            Emp_Name	: item.Emp_Name,
            Atten_Type_ID	: attenid[0].Atten_Type_ID,
            Off_In_Time : item.Off_In_Time ? this.DateService.dateTimeConvert(new Date(item.Off_In_Time)) : null,
            Off_Out_Time	: item.Off_Out_Time ? this.DateService.dateTimeConvert(new Date(item.Off_Out_Time)) : null,
            Working_Hours_Mins : item.Working_Hours_Mins ? item.Working_Hours_Mins : null,
            Work_Minute : item.Work_Minute ? item.Work_Minute : null,
            OT_Minutes : item.OT_Minutes,
            OT_Avail	: item.OT_Avail,
            Amount : item.Amount,
            Remarks	: item.Remarks,
            OT_Hours : item.OT_Hours,
            Per_Hours : item.Per_Hours,
            Add_Custom_Salary_Multiple : item.Add_Custom_Salary_Multiple,
            Overtime_Rate : item.Overtime_Rate
         }
        tempArr.push(TempObj)
      // }
      //   else { 
      //     this.compacctToast.clear();
      //     this.compacctToast.add({
      //       key: "compacct-toast",
      //       severity: "error",
      //       summary: "Warn Message",
      //       detail: "Out Time is Greater Than In Time "
      //     });
      //   }
      });
      console.log("Save Data ===", tempArr)
      return JSON.stringify(tempArr);

    // }
    }
  }
  Showdialog(){
    if(this.Recapture === "Recapture") {
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "re",
       sticky: true,
       severity: "warn",
       summary: "All Attendance data will remove for this Date. Want to Procced?"
     });
    }
    else {
      this.SaveDailyAttendance();
    }
  }
  SaveDailyAttendance(){
      if(this.BackupEmpDailyAttenList.length){
      const obj = {
        "SP_String": "SP_HR_Attn_Sheet_Day_Wise",
        "Report_Name_String" : "Insert_HR_Attn_Sheet_Day_Wise",
       "Json_Param_String": this.dataforSave()

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        if(data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Message ",
           detail: "Succesfully Saved "
         });
         this.GetEmpData();
        } else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      })
    }
    // else{
    //   this.compacctToast.clear();
    //   this.compacctToast.add({
    //       key: "compacct-toast",
    //       severity: "error",
    //       summary: "Warn Message",
    //       detail: "Quantity can't be more than in batch available quantity "
    //     });
    // }

  }

onConfirm(){}
onReject(){
  this.compacctToast.clear("c");
  this.compacctToast.clear("re");
}
information() {
  // if(DocNo) {
  const objtemp = {
    "SP_String": "HR_Txn_Attn_Sheet",
    "Report_Name_String": "Attendance_Details_HTML"
    }
  this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
    var printlink = data[0].Column1;
    // this.DetailsModal = true;
  if(printlink) {
  window.open(printlink, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }
  })
}

OTpopup(otdata){
  // this.OT_Hours = undefined;
  // this.OtEmpid = undefined;
  // this.OtEmpname = undefined;
  // this.otattntype = undefined;
  // this.Per_Hours = undefined;
  // this.Add_Custom_Salary_Multiple = undefined;
  // this.Total_Amount = undefined;
  if(otdata.Emp_ID && otdata.Atten_Type_ID) {
    this.OtEmpid = otdata.Emp_ID;
    this.OtEmpname = otdata.Emp_Name;
    this.otattntype = otdata.Atten_Type_ID
    
    this.Overtime_Rate = otdata.Overtime_Rate ? otdata.Overtime_Rate : "Fixed_Amount";
    console.log('this.Overtime_Rate----',this.Overtime_Rate)
    this.GetPerHour();

    this.OT_Hours = otdata.OT_Hours;
    this.Per_Hours = otdata.Per_Hours;
    this.Add_Custom_Salary_Multiple = otdata.Add_Custom_Salary_Multiple;
    this.Total_Amount = otdata.Amount;
  }
  this.OTPopup = true;
}
calculatemin(){
  if(this.OT_Hours){
    var othours:any = this.OT_Hours;
    var gethr:any = othours.split(":");
    var hr = gethr[0];
    var min = gethr[1];
    console.log("ot===",hr);
    var otmin = ((60 * Number(hr)) + Number(min));
    this.ottotalmin = Number(otmin);
    console.log("ot min===",this.ottotalmin);
    this.Calculatemultiple();
  }
}
gethalfdaytime(){
  this.OT_Hours = "04:30";
  this.calculatemin();
}
getfulldaytime(){
  this.OT_Hours = "09:00";
  this.calculatemin();
}
GetPerHour() {
  if(this.Overtime_Rate === "Fixed_Amount"){
  const objtemp = {
    "SP_String": "SP_HR_Attn_Sheet_Day_Wise",
    "Report_Name_String": "Get_Per_Hour_Amount",
    "Json_Param_String": JSON.stringify([{Emp_ID: this.OtEmpid}])
    }
  this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
    this.backupperhour = data[0].Per_Hour_Amount;
    this.Per_Hours = Number(this.backupperhour).toFixed(2);
    this.Add_Custom_Salary_Multiple = undefined;
    this.Calculatemultiple();
  })
  } 
  else {
    this.Per_Hours = Number(this.backupperhour).toFixed(2);
    this.Calculatemultiple();
  }
}
Calculatemultiple(){
  if(this.OT_Hours){
  var gethractototalmin = Number((this.Per_Hours * this.ottotalmin) / 60).toFixed(2);
  this.fixedtotalamt =  Number(gethractototalmin).toFixed(2);
  if(this.Add_Custom_Salary_Multiple) {
    this.Total_Amount = Number(Number(this.Add_Custom_Salary_Multiple) * Number(this.fixedtotalamt)).toFixed(2);
    console.log("this.Total_Amount===",this.Total_Amount);
  }
  else {
    this.Total_Amount = Number(this.fixedtotalamt).toFixed(2);
  }
  }
}
SaveOT(){
      this.EmpDailyAttenList.forEach((el:any)=>{
        if(Number(el.Emp_ID )== Number(this.OtEmpid)){
         el.OT_Minutes = this.ottotalmin ?  this.ottotalmin : 0;
         el.Amount = this.Total_Amount ? this.Total_Amount : 0;
         el.OT_Hours = this.OT_Hours;
         el.Per_Hours = this.Per_Hours;
         el.Add_Custom_Salary_Multiple = this.Add_Custom_Salary_Multiple;
         el.Overtime_Rate = this.Overtime_Rate;
        }
      })
      this.OTPopup = false;
}
}
