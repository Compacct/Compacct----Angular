import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-hr-late-arrival-early-departure',
  templateUrl: './hr-late-arrival-early-departure.component.html',
  styleUrls: ['./hr-late-arrival-early-departure.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HrLateArrivalEarlyDepartureComponent implements OnInit {
  items:any = [];
  menuList:any =[];
  AllData:any = [];
  empDataList:any = [];
  hrYeatList:any = [];
  leaveList:any = [];
  menuData:any = [];
  tabIndexToView= 0;
  buttonname = "Create";
  leaveHrFormSubmitted = false;
  ObjHrleave: Hrleave = new Hrleave ();
  HrleaveId = undefined ;
  Spinner = false;
  can_popup = false;
  act_popup = false;
  masterLeaveId : number;
  GlobalApi:any = [];
  txnId = undefined;
  mastertxnId = undefined;
  HRYearID = undefined;
  LEAVETYPE = undefined;
  TranType = undefined;
  Editdisable = false;
  // From_Time = new Date()
  // To_Time = new Date()
  // minDateFrom_Time = new Date()
  // minDateTo_Time = new Date()
  // maxDateFrom_Time = new Date()
  // maxDateTo_Time = new Date()
  showBaln = undefined;
  NOfDayApplyBackUp = undefined;
  leaveStatusCheck = true;
  showErrorMsg = false

  currentdate = new Date();
  FromDatevalue : any = Date;
  ToDatevalue = new Date();
  minFromDate : Date;
  maxFromDate : Date;
  minToDate : Date;
  maxToDate : Date;
  mndays = undefined;
  applydays = undefined;
  empid: any;
  TxnAppID: any;
  deleteError = false;
  
  ObjBrowse : Browse = new Browse ();
  HrLeaveApSearchFormSubmitted = false;
  seachSpinner = false;
  initDate:any = [];
  BackupAllData:any = [];
  DistEmpName:any = [];
  SelectedDistEmpName:any = [];
  SearchFields:any = [];

  ObjHrLateArrival : HrLateArrival = new HrLateArrival();
  HrLateArrivalSearchFormSubmitted = false;
  seachSpinnerForLA = false;
  LateArrivaldataList:any = [];
  DynamicHeaderforLA:any = [];
  Late_Arrival_Date_Time:any;

  ObjHrEarlyDeparture : HrEarlyDeparture = new HrEarlyDeparture();
  HrEarlyDepartureSearchFormSubmitted = false;
  seachSpinnerForED = false;
  EarlyDeparturedataList:any = [];
  DynamicHeaderforED:any = [];
  Early_Departure_Date_Time:any;

  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.items = ["LATE ARRIVAL", "EARLY DEPARTURE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
   
    this.header.pushHeader({
      Header: "Late Arrival / Early Departure",
      Link: " MICL -> Late Arrival / Early Departure"
    })
  // this.minDateTo_Time = this.From_Time
    this.FromDatevalue = new Date(this.currentdate);
    this.ToDatevalue = new Date();
    this.employeeData();
    this.GetLateArrivalData();
    this.GetEarlyDepartureData();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["LATE ARRIVAL", "EARLY DEPARTURE"];
    this.buttonname = "Save";
    this.clearData();
    this.Editdisable = false;
    this.HrLateArrivalSearchFormSubmitted = false;
    this.HrEarlyDepartureSearchFormSubmitted = false;
  }
  clearData(){
    this.HrLateArrivalSearchFormSubmitted = false;
    this.HrEarlyDepartureSearchFormSubmitted = false;
    this.ObjHrLateArrival = new HrLateArrival();
    this.ObjHrEarlyDeparture = new HrEarlyDeparture();
    this.seachSpinnerForLA = false;
    this.seachSpinnerForED = false;
    this.Late_Arrival_Date_Time = undefined;
    this.Early_Departure_Date_Time = undefined;
  }
employeeData(){
    const obj = {
      "SP_String":"SP_HR_Late_Arrival_Early_Departure",
      "Report_Name_String": "Get_Employee_List",
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
    }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.empDataList = data;
      // var empname = this.empDataList.filter(el=> Number(el.User_ID) === Number(this.$CompacctAPI.CompacctCookies.User_ID))
      // console.log(empname)
      // this.ObjHrleave.Emp_ID = empname.length ? empname[0].Emp_ID : undefined;
      console.log("employee==",this.empDataList);
      });
}
GetLateArrivalData(){
       const tempobj = {
         User_ID:this.$CompacctAPI.CompacctCookies.User_ID
         }
    const obj = {
      "SP_String":"SP_HR_Late_Arrival_Early_Departure",
      "Report_Name_String":"Get_Late_Arrival_List",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.LateArrivaldataList = data;
      if(this.LateArrivaldataList.length){
        this.DynamicHeaderforLA = Object.keys(data[0]);
      }
      else {
        this.DynamicHeaderforLA = [];
      }
      console.log("LateArrivaldataList",this.LateArrivaldataList);
      }); 
}
GetEarlyDepartureData(){
       const tempobj = {
          User_ID:this.$CompacctAPI.CompacctCookies.User_ID
         }
    const obj = {
      "SP_String":"SP_HR_Late_Arrival_Early_Departure",
      "Report_Name_String":"Get_Early_Departure_List",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.EarlyDeparturedataList = data;
      if(this.EarlyDeparturedataList.length){
        this.DynamicHeaderforED = Object.keys(data[0]);
      }
      else {
        this.DynamicHeaderforED = [];
      }
      console.log("EarlyDeparturedataList",this.EarlyDeparturedataList);
      }); 
}
saveLAData(valid){
  this.HrLateArrivalSearchFormSubmitted = true;
  this.seachSpinnerForLA = true;
  if(valid){
  this.seachSpinnerForLA = false;
  this.HrLateArrivalSearchFormSubmitted = false;
  this.compacctToast.clear();
  this.compacctToast.add({
  key: "la",
  sticky: true,
  severity: "warn",
  summary: "Are you sure?",
  detail: "Confirm to proceed"
  });
  }
  else {
    this.seachSpinnerForLA = false;
  }
}
onconfirmsaveLA(){
    // if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
   this.ObjHrLateArrival.Date_Time = this.DateService.dateTimeConvert(new Date(this.Late_Arrival_Date_Time));
   this.ObjHrLateArrival.Transaction_Date = this.DateService.dateConvert(new Date());
   this.ObjHrLateArrival.Created_By = this.$CompacctAPI.CompacctCookies.User_ID;
      const obj = {
        "SP_String": "SP_HR_Late_Arrival_Early_Departure",
        "Report_Name_String": 'Save_Late_Arrival',
        "Json_Param_String": JSON.stringify([this.ObjHrLateArrival])
       }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        console.log("Final save data ==",data);
        if (data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Succesfully " +data[0].Msg,
            detail: "Succesfully Saved"
          });
          this.seachSpinnerForLA = false;
          this.HrLateArrivalSearchFormSubmitted = false;     
          this.GetLateArrivalData();
          this.ObjHrLateArrival = new HrLateArrival();
          this.Late_Arrival_Date_Time = undefined;
          }
          else {
            this.Spinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message ",
              detail: "Error occured"
            });
          }
        });
      
}
saveEDData(valid){
  this.HrEarlyDepartureSearchFormSubmitted = true;
  this.seachSpinnerForED = true;
  if(valid){
  this.seachSpinnerForED = false;
  this.HrEarlyDepartureSearchFormSubmitted = false;
  this.compacctToast.clear();
  this.compacctToast.add({
  key: "ed",
  sticky: true,
  severity: "warn",
  summary: "Are you sure?",
  detail: "Confirm to proceed"
  });
  }
  else {
    this.seachSpinnerForED = false;
  }
}
onconfirmsaveED(){
    // if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
   this.ObjHrEarlyDeparture.Date_Time = this.DateService.dateTimeConvert(new Date(this.Early_Departure_Date_Time));
   this.ObjHrEarlyDeparture.Transaction_Date = this.DateService.dateConvert(new Date());
   this.ObjHrEarlyDeparture.Created_By = this.$CompacctAPI.CompacctCookies.User_ID;
      const obj = {
        "SP_String": "SP_HR_Late_Arrival_Early_Departure",
        "Report_Name_String": 'Save_Early_Departure',
        "Json_Param_String": JSON.stringify([this.ObjHrEarlyDeparture])
       }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        console.log("Final save data ==",data);
        if (data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Succesfully " +data[0].Msg,
            detail: "Succesfully Saved"
          });
          this.seachSpinnerForED = false;
          this.HrEarlyDepartureSearchFormSubmitted = false;     
          this.GetEarlyDepartureData();
          this.ObjHrEarlyDeparture = new HrEarlyDeparture();
          this.Early_Departure_Date_Time = undefined;
          }
          else {
            this.Spinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message ",
              detail: "Error occured"
            });
          }
        });
      
}
onReject(){
  this.compacctToast.clear("la");
  this.compacctToast.clear("ed");
}

}
class HrLateArrival {
  Emp_ID:any;		
  Date_Time:any;	
  Created_By:any;
  Transaction_Date:any;	
}
class HrEarlyDeparture {
  Emp_ID:any;
  Date_Time:any;	
  Created_By:any;
  Transaction_Date:any;
}
class Hrleave {
  Emp_ID:any;
  HR_Year_ID:any;				
  Leave_Type:any;			
  Apply_From_Date:any;
  Apply_To_Date:any;
  No_Of_Days_Apply:any;
  Remarks:any;
  Issued_From_Date:any;
  Issued_To_Date:any;
  No_Of_Days_Issued:any;
  Approved_Status_Business_Manager:any;
  Approved_Status_Reporting_Manager:any;
  Approved_Note_Business_Manager:any;
  Approved_Note_Reporting_Manager:any;
  Approval_ID:any;
  HR_Remarks:any
}
class Browse {
  Leave_Type : any;
  From_date : Date;
  To_date : Date;
 }
