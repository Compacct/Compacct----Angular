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
  selector: 'app-daily-attendance-sheet',
  templateUrl: './daily-attendance-sheet.component.html',
  styleUrls: ['./daily-attendance-sheet.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DailyAttendanceSheetComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  ShowSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  myDate = new Date();
  EmpDailyAttenList:any = [];
  AttenTypelist:any = [];
  Daily_Atten_Date = new Date();
  AttendancePopup = false;
  attendancetypeFormSubmitted = false;
  empid: any;
  Atten_Type: any;
  employeename: any;
  checkbuttonname: any;
  AttendanceTypeList:any = [];

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
    this.getAttendanceType();
    // this.GetEmpData();
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
   GetEmpData(){
    this.seachSpinner = true;
    this.checkbuttonname = undefined;
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
        if(val.OT_Avail === 0 || val.OT_Avail === null) {
          // val["OT_Minutes"] = val.OT_Minutes;
          val["OTdisabled"] = true;
        } else {
          val["OTdisabled"] = false;
        }
      })
     })
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
      else if (atnid == "PWO" || atnid == "PPH") {
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
      this.getAttenTypedropdown(obj.Atten_Type_ID);
      this.AttendancePopup = true;
    }
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
      if (obj.OT_Avail === 0 || obj.OT_Avail === null) {
        obj.OT_Minutes = 0;
      }
      else {
        this.CalculateOTMin(obj);
      }
      // console.log(this.DateService.dateTimeConvert(new Date(this.objemployee.Off_In_Time)));
      // console.log(this.DateService.dateTimeConvert(new Date(this.objemployee.Off_Out_Time)));
    } 
    else {
      // obj.Work_Minute = obj.Working_Hours_Mins;
      obj.OT_Minutes = obj.OT_Minutes;
    }
  }
  CalculateOTMin(object){
    // console.log("object.Work_Minute ====", object.Work_Minute)
    if(object.Working_Hours_Mins && object.Work_Minute) {
      var otmin = Number(object.Working_Hours_Mins) - Number(object.Work_Minute);
      // console.log(Number(otmin))
      object.OT_Minutes = Number(otmin);
    } else {
      object.OT_Minutes = object.OT_Minutes;
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
    if(this.EmpDailyAttenList.length) {
      // if(this.saveRemarks()){
      let tempArr:any =[]
      this.EmpDailyAttenList.forEach(item => {
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
            Remarks	: item.Remarks
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
  SaveDailyAttendance(){
      if(this.EmpDailyAttenList.length){
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
}
}
