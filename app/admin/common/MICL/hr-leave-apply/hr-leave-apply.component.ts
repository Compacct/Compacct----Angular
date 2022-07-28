import { data } from 'jquery';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import * as moment from "moment";
@Component({
  selector: 'app-hr-leave-apply',
  templateUrl: './hr-leave-apply.component.html',
  styleUrls: ['./hr-leave-apply.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HrLeaveApplyComponent implements OnInit {
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
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
   
    this.header.pushHeader({
      Header: "HR Leave Apply",
      Link: " MICL -> HR-leave-apply"
    })
  // this.minDateTo_Time = this.From_Time
    this.FromDatevalue = new Date(this.currentdate);
    this.ToDatevalue = new Date();
    this.employeeData();
    // this.GetBrowseData();
    this.hrYearList();
    this.leaveTypList();
    this.GetNumberOfdays();
    this.ToDatevalue = new Date();
    // this.initDate = [new Date(),new Date()]
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    this.Editdisable = false;
    // this.hrYearList();
  }
  clearData(){
    this.leaveHrFormSubmitted = false;
    this.ObjHrleave =new Hrleave();
    this.HrleaveId = undefined;
    // this.From_Time = new Date(this.To_Time.setDate(new Date().getDate() + 1 ))
    // this.To_Time = new Date(this.To_Time.setDate(this.From_Time.getDate() + 1 ))
    this.minToDate = this.FromDatevalue
    this.showBaln = undefined;
    this.showErrorMsg = false
    this.GetNumberOfdays();
    this.ObjHrleave.HR_Year_ID =  this.hrYeatList.length ? this.hrYeatList[0].HR_Year_ID : undefined;
    }
  getDateRange(dateRangeObj) {
      if (dateRangeObj.length) {
        this.ObjBrowse.From_date = dateRangeObj[0];
        this.ObjBrowse.To_date = dateRangeObj[1];
      }
    }
   GetBrowseData(valid){
    this.HrLeaveApSearchFormSubmitted = true;
    // this.seachSpinner = true;
    const From_date = this.ObjBrowse.From_date
       ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_date))
       : this.DateService.dateConvert(new Date());
     const To_date = this.ObjBrowse.To_date
       ? this.DateService.dateConvert(new Date(this.ObjBrowse.To_date))
       : this.DateService.dateConvert(new Date());
       const tempobj = {
         Start_Date : From_date,
         End_Date : To_date,
         Atten_Type_ID : this.ObjBrowse.Leave_Type
         }
    if(valid){
    const obj = {
      "SP_String":"SP_Leave_Application",
      "Report_Name_String":"Browse_Leave_Application",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.AllData = data;
      this.BackupAllData = data;
      this.GetDistinct();
     this.HrLeaveApSearchFormSubmitted = false;
     this.seachSpinner = false;
      console.log("Browse data==",this.AllData);
      }); 
    }
   }
    // DISTINCT & FILTER
 GetDistinct() {
  let DEmpName = [];
  this.DistEmpName =[];
  this.SelectedDistEmpName =[];
  this.SearchFields =[];
  this.AllData.forEach((item) => {
 if (DEmpName.indexOf(item.Emp_ID) === -1) {
  DEmpName.push(item.Emp_ID);
 this.DistEmpName.push({ label: item.Emp_Name, value: item.Emp_ID });
 }
});
   this.BackupAllData = [...this.AllData];
}
FilterDist() {
  let DEmpName = [];
  this.SearchFields =[];
if (this.SelectedDistEmpName.length) {
  this.SearchFields.push('Emp_ID');
  DEmpName = this.SelectedDistEmpName;
}
this.AllData = [];
if (this.SearchFields.length) {
  let LeadArr = this.BackupAllData.filter(function (e) {
    return (DEmpName.length ? DEmpName.includes(e['Emp_ID']) : true)
  });
this.AllData = LeadArr.length ? LeadArr : [];
} else {
this.AllData = [...this.BackupAllData] ;
}
}
   employeeData(){
     const obj = {
       "SP_String":"SP_Leave_Application",
       "Report_Name_String": "Get_Employee_List"
     }
      this.GlobalAPI.getData(obj)
      .subscribe((data:any)=>{
       this.empDataList = data;
       console.log("employee==",this.empDataList);
       });
   }
   hrYearList(){
     const obj = {
       "SP_String":"SP_Leave_Application",
       "Report_Name_String":"Get_HR_Year_List"
    }
    this.GlobalAPI.getData(obj)
      .subscribe((data:any)=>{
       this.hrYeatList = data;
       console.log("Hr Year==",this.hrYeatList);
       this.ObjHrleave.HR_Year_ID =  this.hrYeatList.length ? this.hrYeatList[0].HR_Year_ID : undefined;

        // if(this.ObjHrleave.HR_Year_ID){
         this.getMaxMindate()
      // }
       });
   }
   leaveTypList(){
     const obj = {
       "SP_String":"SP_Leave_Application",
       "Report_Name_String":"Get_Leave_Type_List"
    }
      this.GlobalAPI.getData(obj)
      .subscribe((data:any)=>{
       this.leaveList = data;
       console.log("leave list==",this.leaveList);
       });
   }
  saveData(valid:any){
    console.log("savedata==",this.ObjHrleave);
    this.leaveHrFormSubmitted = true;
    if(valid){
      console.log("HrleaveId==",this.HrleaveId);
      this.Spinner = true
      if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
     this.ObjHrleave.Apply_From_Date = this.DateService.dateConvert(new Date(this.FromDatevalue));
     this.ObjHrleave.Apply_To_Date = this.DateService.dateConvert(new Date(this.ToDatevalue));
     this.ObjHrleave.Issued_From_Date = this.ObjHrleave.Apply_From_Date;
     this.ObjHrleave.Issued_To_Date =  this.ObjHrleave.Apply_To_Date;
     this.ObjHrleave.No_Of_Days_Issued = this.ObjHrleave.No_Of_Days_Apply;
     this.ObjHrleave.Approval_ID = this.$CompacctAPI.CompacctCookies.User_ID;
     this.ObjHrleave.HR_Remarks = this.ObjHrleave.Remarks
     //this.ObjHrleave.Leave_Month = "NA"
    // this.ObjHrleave.Leave_Year = "NA"
      }
      
        const obj = {
          "SP_String": "SP_Leave_Application",
          "Report_Name_String": 'Save_Leave_Application',
          "Json_Param_String": JSON.stringify([this.ObjHrleave])
         }
         this.GlobalAPI.getData(obj)
         .subscribe((data:any)=>{
          console.log("Final save data ==",data);
          if (data[0].Status === "True"){
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Succesfully " +data[0].Msg,
              detail: "Succesfully "
            });
            this.Spinner = false;
            this.GetBrowseData(true);
            this.HrleaveId = undefined;
            this.txnId = undefined;
            this.Editdisable = false;
            this.tabIndexToView = 0;
            this.leaveHrFormSubmitted = false;
            this.ObjHrleave =new Hrleave();
            this.FromDatevalue = new Date()
            this.ToDatevalue = new Date()
            this.GetNumberOfdays();
            }
            else {
              this.Spinner = false;
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message ",
                detail: data[0].Msg
              });
            }
           
           
          });
      }
      else{
        console.error("error password")
      }
        
    }
 GetNumberOfdays(){
    if(this.ToDatevalue && this.FromDatevalue){
      const diffTime = Math.abs(Number(new Date(this.ToDatevalue.toLocaleString().split(',')[0])) - Number(new Date(this.FromDatevalue.toLocaleString().split(',')[0])));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
       this.minToDate = this.FromDatevalue;
       console.log("diffDays",diffDays + 1);
       this.ObjHrleave.No_Of_Days_Apply = undefined;
       this.ObjHrleave.No_Of_Days_Apply = diffDays + 1;
      //  this.ToDatevalue = new Date(this.ToDatevalue.setDate((this.FromDatevalue.getDate() + this.mndays) - 1 ))
       console.log("No_Of_Days_Apply",this.ObjHrleave.No_Of_Days_Apply);
    }
  }
  getShowBaln(){
    if(this.ObjHrleave.Leave_Type && this.ObjHrleave.HR_Year_ID && this.ObjHrleave.Emp_ID){
      const TempSendData = {
        Emp_ID : Number(this.ObjHrleave.Emp_ID),
        HR_Year_ID : Number(this.ObjHrleave.HR_Year_ID),
        LEAVE_TYPE : this.ObjHrleave.Leave_Type
      }
      const obj = {
        "SP_String": "SP_Leave_Application",
        "Report_Name_String": 'Show_Balance',
        "Json_Param_String": JSON.stringify([TempSendData])
       }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
         console.log("Show Blan",data)
         this.showBaln = data[0].Balance;
       // this.checkLeave();
       this.getminday();
       })
    }
  
  } 
  getminday(){
    this.mndays = undefined;
    this.applydays = undefined;
    this.minFromDate  = new Date();
  if(this.ObjHrleave.Leave_Type) {
    const ctrl = this;
    const mindayobj = $.grep(ctrl.leaveList,function(item:any) {return Number(item.Atten_Type_ID) == Number(ctrl.ObjHrleave.Leave_Type)})[0];
    console.log("mindayobj >>",mindayobj);
    
    // this.minFromDate = new Date(new Date().getDate() + Number(mindayobj.Min_day));
   // this.minFromDate.setDate(this.minFromDate.getDate() + Number(mindayobj.Min_day));
    //this.FromDatevalue = new Date(new Date().getDate() + Number(mindayobj.Min_day))
    this.mndays = mindayobj.Min_day;
    this.applydays = mindayobj.Apply_day;

    this.FromDatevalue =  new Date(this.minFromDate.setDate(new Date().getDate() + Number(mindayobj.Apply_day)));
    this.minToDate  = new Date(this.FromDatevalue);
    this.ToDatevalue = new Date(this.minToDate.setDate(new Date(this.FromDatevalue).getDate() + (Number(mindayobj.Min_day) - 1)))
    
    // this.To_Time = new Date(this.To_Time.setDate(this.From_Time.getDate() + 1 ))
    // 
    //this.getapplydayschange();
  }
}
 getMaxMindate(){
    if(this.ObjHrleave.HR_Year_ID){
      const HRFilterValue = this.hrYeatList.filter(el=> Number(el.HR_Year_ID) === Number(this.ObjHrleave.HR_Year_ID))[0];
      console.log("HRFilterValue",HRFilterValue)
      // this.maxDateFrom_Time = new Date(HRFilterValue.HR_Year_End);
      // this.maxDateTo_Time = new Date(HRFilterValue.HR_Year_End);
      // this.minDateFrom_Time = new Date(HRFilterValue.HR_Year_Start);
      // console.log("this.maxDateFrom_Time",this.maxDateFrom_Time )
      // console.log("this.maxDateTo_Time",this.maxDateTo_Time )
      // console.log("this.maxDateFrom_Time",this.minDateFrom_Time )
      this.initDate = [new Date(HRFilterValue.HR_Year_Start), new Date(HRFilterValue.HR_Year_End)];
      
    }
  }
CancleLeave(data){
  if(data.Emp_ID && data.Txn_App_ID){
  this.deleteError = false;
  this.empid = data.Emp_ID;
  this.TxnAppID = data.Txn_App_ID;
  this.compacctToast.clear();
  this.compacctToast.add({
  key: "c",
  sticky: true,
  severity: "warn",
  summary: "Are you sure?",
  detail: "Confirm to proceed"
  });
  }
}
onConfirm() {
  const Tempobj = {
    Emp_ID : this.empid,
    Txn_App_ID : this.TxnAppID,
  }
  const obj = {
    "SP_String" : "SP_Leave_Application",
    "Report_Name_String" : "UnApprove_Leave_Application",
    "Json_Param_String" : JSON.stringify([Tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   // console.log(data);
   var msg = data[0].Column1
    if(data[0].Column1 === "Can not Cancel, Because already Approved this leave") {
      this.onReject();
      this.deleteError = true;
      this.compacctToast.clear();
      this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: msg,
      // detail: "Confirm to proceed"
      });
      this.GetBrowseData(true);
    }
    else if (data[0].Column1 === "Successfully Cancel"){
      this.deleteError = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Emp_ID : " + this.empid,
        detail:  msg
      });
      this.GetBrowseData(true);
    }
    else{
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
onReject() {
  this.compacctToast.clear("c");
}
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