import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
declare var $:any;

@Component({
  selector: 'app-tuto-bda-wise-target',
  templateUrl: './tuto-bda-wise-target.component.html',
  styleUrls: ['./tuto-bda-wise-target.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoBdaWiseTargetComponent implements OnInit {
  tabIndexToView = 0;
  items = [];

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
    this.items = ["Attendance", "Booking","Conduction Done","Subscriber","Revenue"];
    this.Header.pushHeader({
      Header: "Tutopia BDA Wise Target",
      Link: " CRM Master -> BDA -> Tutopia BDA Wise Target"
    });
    //this.getAttendanceType();
    const d = new Date();
    let month = d.getMonth() + 1;
    console.log('month',month)
    let year = d.getFullYear();
    this.Month_Name = month < 10 ? year+'-'+0+month : year+'-'+month
    //this.startdate = this.Month_Name+'-'+'01'
    console.log('Month_Name',this.Month_Name)
   // this.Month_Name = new Date();
    this.getmonthdaydate();
  }
  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["Attendance", "Booking","Conduction Done","Subscriber","Revenue"];
    // this.buttonname = "Save";
    this.clearData();
  }
  clearData(){
    //this.getAttendanceType();
    const d = new Date();
    let month = d.getMonth() + 1;
    console.log('month',month)
    let year = d.getFullYear();
    this.Month_Name = month < 10 ? year+'-'+0+month : year+'-'+month
    //this.startdate = this.Month_Name+'-'+'01'
    console.log('Month_Name',this.Month_Name)
   // this.Month_Name = new Date();
    this.getmonthdaydate();
  }
  getemployeename(){
    const obj = {
      "SP_String": "SP_Tutopia_BDA_Wise_Target",
      "Report_Name_String": "Get_EMP_Data"
    }
    this.GlobalAPI.tutopiacallapis(obj).subscribe((data:any)=>{
      data.forEach(obj=> {
        obj.monthData = [...new Array(this.MonthdayDatelist.length)];
      })
      this.employeelist = data;
       console.log("employeelist ===", this.employeelist);
    })
  }
  getmonthdaydate(){
    this.dateNumber = [];
    // var firstDay = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth(), 1);
    //var lastDay = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth() + 1, 0);
    var firstDay = this.Month_Name+'-'+'01'
    console.log('firstDay',firstDay)
    const TObj = {
      Start_Date : this.DateService.dateConvert(new Date(firstDay)),
      //End_Date : this.DateService.dateConvert(new Date(lastDay))
    }
    const obj = {
      "SP_String": "SP_Tutopia_BDA_Wise_Target",
      "Report_Name_String": "Month_Data",
      "Json_Param_String": JSON.stringify([TObj])
    }
    this.GlobalAPI.tutopiacallapis(obj).subscribe((data:any)=>{
      this.MonthdayDatelist = data;
     
    ///let myArray = text.split(" ");
    data.forEach(ele => {
      let spdata =  ele.Date.split(" ")
      this.dateNumber.push({
        date :spdata[0]
      })
    });
      this.getemployeename();
      this.getAttendanceData();
      console.log("tempArr",this.dateNumber)
  
       console.log("MonthdayDatelist ===",this.MonthdayDatelist);
    })
  }
  // getAttendanceType(){
  //   const obj = {
  //     "SP_String": "SP_Tutopia_BDA_Wise_Target",
  //     "Report_Name_String": "Get_Attn_Data_Type"
  //   }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //     this.AttenTypelist = data;
  //      console.log("AttenTypelist ===",this.AttenTypelist);
  //      this.AttenTypelist.forEach((val) => {
  //        if(val.Sht_Desc) {
  //         this.attendanceIdMap.set(val.Sht_Desc.trim(),val);
  //        }
  //      })
  //   })
  // }
  // onrightclick(i,row,i2){
  //   event.preventDefault();
  //   console.log("sgclicki",i)
  //   console.log("sgclicki2",i2)
  //   if(!this.employeelist[i].monthData[i2]) {
  //   this.employeelist[i].monthData[i2] = 'P';
  //   }
  // }
  getdialog(i,row,i2){
    this.attendancestatusFormSubmitted = false;
    this.Attendance_Status = undefined;
    console.log("i",i)
    console.log("i2",i2)
    console.log("row",row)
   //this.employeelist[i].monthData[i2] = 'deba'
   this.employeename = row.Member_Name;
   this.index = i;
   this.index2 = i2;
   this.MonthdayDatelist.forEach((ele,inx) => {
    if(inx === i2){
      //console.log("ele",ele);
      this.Doc_date = ele.Date;
    }
    });
    this.display = true;
    // var Attent = this.AttenTypelist.filter( items => items.Sht_Desc === this.employeelist[this.index].monthData[this.index2]);
    // this.Attendance_Status = Attent ? Attent[0].Atten_Type_ID : undefined;
     // this.Doc_date = col.Date;
    console.log("this.employeename",this.employeename)
    console.log("this.Doc_date",this.Doc_date)
    
  }
  SaveAttendanceType(){
   // this.attendancestatusFormSubmitted = true;
    //if(valid){
      //var AttenType = this.AttenTypelist.filter( items => Number(items.Atten_Type_ID) === Number(this.Attendance_Status));
      //this.Atten_Type = AttenType != null && AttenType.length > 0 ? AttenType[0].Sht_Desc : undefined;
      //this.color = AttenType != null && AttenType.length > 0 ? AttenType[0].Colour_Code : undefined;
      this.employeelist[this.index].monthData[this.index2] = this.Attendance_Status;
      this.display = false;
    //}
  }
  getAttendanceData(){
    this.AllAttendanceData = [];
    var firstDate = this.Month_Name+'-'+'01'
    console.log('firstDate',firstDate)
    this.ngxService.start();
    const AtObj = {
      Date : this.DateService.dateConvert(new Date(firstDate)),
    }
    let reportname;
    if(this.tabIndexToView === 0) {
      reportname = "Get_Tutopia_BDA_Target_Attendance";
    }
    else if (this.tabIndexToView === 1) {
      reportname = "Get_Tutopia_BDA_Target_Booking";
    }
    else if (this.tabIndexToView === 2) {
      reportname = "Get_Tutopia_BDA_Target_Conduction";
    }
    else if (this.tabIndexToView === 3) {
      reportname = "Get_Tutopia_BDA_Target_Subcriber";
    }
    else if (this.tabIndexToView === 4) {
      reportname = "Get_Tutopia_BDA_Target_Revenue";
    }
    const obj = {
      "SP_String": "SP_Tutopia_BDA_Wise_Target",
      "Report_Name_String": reportname,
      "Json_Param_String": JSON.stringify([AtObj])

    }
    this.GlobalAPI.tutopiacallapis(obj).subscribe((data:any)=>{
      console.log("Data From Api",data);
      this.AllAttendanceData = data;
       data.forEach(element => {
         var empid = this.employeelist.findIndex(el=> el.Member_ID === element.Member_ID && el.User_ID === element.User_ID);
         var date = new Date(element.Target_Date);
         const ctrl = this;
         setTimeout(function () {
         if(empid != null && date != null) {
          ctrl.employeelist[empid].monthData[date.getDate() - 1] = element.Target;
         }
        }, 100)
          console.log('this.AllAttendanceData',this.AllAttendanceData)
     });
     this.ngxService.stop();

  })
  }
  getdataforattendance(){
    if(this.employeelist.length) {
      let tempArr =[]
      var firstDateofmonth = this.Month_Name+'-'+'01'

      this.employeelist.forEach((item,index) => {
     const TempObj = {
            Start_Date : this.DateService.dateConvert(new Date(firstDateofmonth)),
            Member_ID:  item.Member_ID,
            Member_Name: item.Member_Name,
            User_ID: item.User_ID
            // Date: this.DateService.dateConvert(new Date(empdate[0].Date)),//empdate,//item.monthData[length],
            // Atten_Type_ID : attendanceid[0].Atten_Type_ID
         }
      //tempArr.push(TempObj)
      item.monthData.forEach((el,x) => {
        var empdate = this.MonthdayDatelist[x];//filter((dateitem,ind) => ind === el.indexOf(el[x]));
        console.log('empdate',empdate != null ? empdate.Date : null);
        // var attendanceid = this.attendanceIdMap.get(el);//this.AttenTypelist.filter( ele => ele.Sht_Desc === el);
        // console.log('attendanceid',attendanceid ? attendanceid.Atten_Type_ID : null);
        const dateattenidobj = {
          Target_Date: empdate.Date ? this.DateService.dateConvert(new Date(empdate.Date)) : null,//empdate,//item.monthData[length],
          Target : el ?  Number(el) : null
        }
        
      tempArr.push({...TempObj,...dateattenidobj})
      })
      });
      console.log("Save Data ===", tempArr)
      return JSON.stringify(tempArr);

    }
  }
  saveAttendance(){
   console.log(this.Month_Name)
   this.ngxService.start();
   let reportnameinsert;
    if(this.tabIndexToView === 0) {
      reportnameinsert = "Insert_Tutopia_BDA_Target_Attendance";
    }
    else if (this.tabIndexToView === 1) {
      reportnameinsert = "Insert_Tutopia_BDA_Target_Booking";
    }
    else if (this.tabIndexToView === 2) {
      reportnameinsert = "Insert_Tutopia_BDA_Target_Conduction";
    }
    else if (this.tabIndexToView === 3) {
      reportnameinsert = "Insert_Tutopia_BDA_Target_Subcriber";
    }
    else if (this.tabIndexToView === 4) {
      reportnameinsert = "Insert_Tutopia_BDA_Target_Revenue";
    }
    const obj = {
      "SP_String" : "SP_Tutopia_BDA_Wise_Target",
      "Report_Name_String" : reportnameinsert,
      "Json_Param_String" : this.getdataforattendance()

    }
    this.GlobalAPI.tutopiacallapis(obj).subscribe((data:any)=>{
      //console.log(data);
      var tempID = data[0].Column1;
      console.log("After Save",tempID);
     // this.Objproduction.Doc_No = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
        const mgs = this.buttonname === "Save" ? "Saved" : "Updated";
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         detail: "Succesfully  " + mgs
       });
       this.ngxService.stop();
       this.getmonthdaydate();
      //  const ctrl = this;
      //  setTimeout(function () {
      //   ctrl.getAttendanceData();
      //  }, 200)
      //  this.clearData();
      //  this.franchisechallandate = undefined;
      //  this.searchData(true);
      //  this.ProductList =[];
      //  this.franchiseSalebillFormSubmitted = false;
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
  ChangeAllRow(ind){
    this.Doc_date_AllEmp = undefined;
    console.log("col" ,ind)
    this.inddate = ind;
    this.MonthdayDatelist.forEach((ele,inx) => {
      if(inx === ind){
        //console.log("ele",ele);
        this.Doc_date_AllEmp = ele.Date;
        this.DayName = ele.WeekDay;
      }
      });
    this.displayALLEmployee = true;
    this.Attendance_Status_ALlEmployee = undefined;
    
  }
  SaveForALLEmployee(){
    // var AttenTypeAllEmp = this.AttenTypelist.filter( items => Number(items.Atten_Type_ID) === Number(this.Attendance_Status_ALlEmployee));
    //   this.Atten_Type_AllEmployee = AttenTypeAllEmp != null && AttenTypeAllEmp.length > 0 ? AttenTypeAllEmp[0].Sht_Desc : undefined;
    //   this.colorAllEmp = AttenTypeAllEmp != null && AttenTypeAllEmp.length > 0 ? AttenTypeAllEmp[0].Colour_Code : undefined;
     // this.employeelist[this.index].monthData[this.index2] = this.Atten_Type_AllEmployee;
      this.employeelist.forEach((el)=>{
        el.monthData[this.inddate] = this.Attendance_Status_ALlEmployee;

      })
      this.displayALLEmployee = false;
  }
  // exportoexcel(Arr,fileName): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
  //   const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  //   XLSX.writeFile(workbook, fileName+'.xlsx');
  // }

}
