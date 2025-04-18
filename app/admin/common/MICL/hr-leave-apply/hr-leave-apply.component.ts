import { data } from 'jquery';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import * as moment from "moment";
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
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
  showBaln : any;
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

  ObjHrleaveSummary : HrleaveSummary = new HrleaveSummary();
  HrLeaveSummarySearchFormSubmitted = false;
  seachSpinnerForLS = false;
  LeaveSummarydataList:any = [];
  DynamicHeaderforLS:any = [];

  ObjHrleaveLedger : HrleaveLedger = new HrleaveLedger();
  HrLeaveLedgerSearchFormSubmitted = false;
  seachSpinnerForLL = false;
  LeaveLedgerdataList:any = [];
  DynamicHeaderforLL:any = [];

  Param_Flag:string
  HalfDayFlag:boolean = false;
  checkboxdisabled:boolean = false;
  backupnoofapplydays:any;
  databaseName:any;
  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
  ) { 
    this.route.queryParams.subscribe(params => {
      console.log(params);
     this.Param_Flag = params['show_create'];
     })
  }
  ngOnInit() {
    this.items = ["LEAVE SUMMARY", "LEAVE LEDGER", "BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
   
    this.header.pushHeader({
      Header: "Leave Application",
      Link: " HR -> Leave Application"
    })
  // this.minDateTo_Time = this.From_Time
    this.FromDatevalue = new Date(this.currentdate);
    this.ToDatevalue = new Date();
    this.getDatabase();
    this.employeeData();
    // this.GetBrowseData();
    this.hrYearList();
    this.leaveTypList();
    this.GetNumberOfdays();
    this.GetNoOfDays();
    this.compareDate();
    this.ToDatevalue = new Date();
    // this.initDate = [new Date(),new Date()]
  }
  getDatabase(){
    this.http
        .get("/Common/Get_Database_Name",
        {responseType: 'text'})
        .subscribe((data: any) => {
          this.databaseName = data;
          console.log(data)
        });
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["LEAVE SUMMARY", "LEAVE LEDGER", "BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    this.Editdisable = false;
    this.HrLeaveSummarySearchFormSubmitted = false;
    this.HrLeaveLedgerSearchFormSubmitted = false;
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
    this.applydays = undefined;
    this.showErrorMsg = false
    this.GetNumberOfdays();
    this.GetNoOfDays();
    this.ObjHrleave.HR_Year_ID =  this.hrYeatList.length ? this.hrYeatList[0].HR_Year_ID : undefined;
    this.employeeData();
    this.FromDatevalue = new Date();
    this.minFromDate = new Date();
    this.ToDatevalue = new Date();
    }
  GetLeaveSummaryData(valid){
      this.HrLeaveSummarySearchFormSubmitted = true;
      this.seachSpinnerForLS = true;
         const tempobj = {
            HR_Year_ID : this.ObjHrleaveSummary.HR_Year_ID,
            Emp_ID : this.ObjHrleaveSummary.Emp_ID
           }
      if(valid){
      const obj = {
        "SP_String":"SP_Leave_Application",
        "Report_Name_String":"Leave_Summary",
        "Json_Param_String": JSON.stringify([tempobj])
      }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        this.seachSpinnerForLS = false;
      
        // this.BackupSearchedlist = data;
        // this.GetDistinct();
        if(data.length){
          this.LeaveSummarydataList = data;
          this.DynamicHeaderforLS = Object.keys(data[0]);
        }
        else {
          this.DynamicHeaderforLS = [];
        }
        this.seachSpinnerForLS = false;
        this.HrLeaveSummarySearchFormSubmitted = false;
        console.log("LeaveSummarydataList",this.LeaveSummarydataList);
        }); 
      }
      else {
        this.seachSpinnerForLS = false;
      }
  }
  GetLeaveLedgerData(valid){
      this.HrLeaveLedgerSearchFormSubmitted = true;
      this.seachSpinnerForLL = true;
         const tempobj = {
            HR_Year_ID : this.ObjHrleaveLedger.HR_Year_ID,
            Emp_ID : this.ObjHrleaveLedger.Emp_ID,
            Atten_Type_ID : this.ObjHrleaveLedger.Leave_Type
           }
      if(valid){
      const obj = {
        "SP_String":"SP_Leave_Application",
        "Report_Name_String":"Leave_Ledger",
        "Json_Param_String": JSON.stringify([tempobj])
      }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        this.LeaveLedgerdataList = data;
        // this.BackupSearchedlist = data;
        // this.GetDistinct();
        if(this.LeaveLedgerdataList.length){
          this.DynamicHeaderforLL = Object.keys(data[0]);
        }
        else {
          this.DynamicHeaderforLL = [];
        }
        this.seachSpinnerForLL = false;
        this.HrLeaveLedgerSearchFormSubmitted = false;
        console.log("LeaveLedgerdataList",this.LeaveLedgerdataList);
        }); 
      }
      else {
        this.seachSpinnerForLL = false;
      }
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
         Atten_Type_ID : this.ObjBrowse.Leave_Type ? this.ObjBrowse.Leave_Type : 0,
         User_ID : this.$CompacctAPI.CompacctCookies.User_ID
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
    this.empDataList = []
     const obj = {
       "SP_String":"SP_Leave_Application",
       "Report_Name_String": "Get_Employee_List",
       "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
     }
      this.GlobalAPI.getData(obj)
      .subscribe((data:any)=>{
        if(data.length){
          data.forEach((ele:any) => {
            ele['label'] = ele.Emp_Name,
            ele['value'] = ele.Emp_ID
          });
        this.empDataList = data;
       var empname = this.empDataList.filter(el=> Number(el.User_ID) === Number(this.$CompacctAPI.CompacctCookies.User_ID))
       console.log(empname)
       this.ObjHrleave.Emp_ID = empname.length ? empname[0].Emp_ID : undefined;
       console.log("employee==",this.empDataList);
        }
       
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
   CheckNoOFdays(){
    if(this.databaseName === "GN_JOH_HR"){
      if(this.ObjHrleave.No_Of_Days_Apply > this.showBaln){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message ",
          detail: "Taken leave is greater than left leave."
        });
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
   }
  saveData(valid:any){
    console.log("savedata==",this.ObjHrleave);
    this.leaveHrFormSubmitted = true;
    if(valid && this.CheckNoOFdays()){
      this.leaveHrFormSubmitted = false;
      console.log("HrleaveId==",this.HrleaveId);
      this.Spinner = true
      // if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
     this.ObjHrleave.Apply_From_Date = this.DateService.dateConvert(new Date(this.FromDatevalue));
     this.ObjHrleave.Apply_To_Date = this.DateService.dateConvert(new Date(this.ToDatevalue));
     this.ObjHrleave.Issued_From_Date = this.ObjHrleave.Apply_From_Date;
     this.ObjHrleave.Issued_To_Date =  this.ObjHrleave.Apply_To_Date;
     this.ObjHrleave.No_Of_Days_Issued = this.ObjHrleave.No_Of_Days_Apply;
     this.ObjHrleave.Approval_ID = this.$CompacctAPI.CompacctCookies.User_ID;
     this.ObjHrleave.HR_Remarks = this.ObjHrleave.Remarks
     //this.ObjHrleave.Leave_Month = "NA"
    // this.ObjHrleave.Leave_Year = "NA"
      // }
      
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
            this.tabIndexToView = 2;
            this.ObjHrleave =new Hrleave();
            this.FromDatevalue = new Date()
            this.ToDatevalue = new Date()
            this.GetNumberOfdays();
            this.GetNoOfDays();
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
        this.Spinner = false;
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
       this.getShowBaln();
    }
  }
  GetNoOfDays(){
    this.ObjHrleave.Apply_From_Date = this.DateService.dateConvert(new Date(this.FromDatevalue));
     this.ObjHrleave.Apply_To_Date = this.DateService.dateConvert(new Date(this.ToDatevalue));
    //  this.backupnoofapplydays = undefined;
       const tempobj = {
         Emp_ID : this.ObjHrleave.Emp_ID,
         Atten_Type_ID : this.ObjHrleave.Leave_Type,
         Issued_From_Date : this.ObjHrleave.Apply_From_Date,
         Issued_To_Date : this.ObjHrleave.Apply_To_Date
         }
    if(this.ObjHrleave.Emp_ID && this.ObjHrleave.Apply_From_Date && this.ObjHrleave.Apply_To_Date){
    const obj = {
      "SP_String":"SP_Leave_Application",
      "Report_Name_String":"Show_No_Of_Days",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      console.log("no of days ===",data)
      this.ObjHrleave.No_Of_Days_Apply = data[0].Column1;
      this.backupnoofapplydays = data[0].Column1;
      this.getShowBaln();
      this.compareDate();
      }); 
    }
    this.compareDate();
  }
  getShowBaln(){
    this.showBaln = undefined;
     this.ObjHrleave.Apply_From_Date = this.DateService.dateConvert(new Date(this.FromDatevalue));
     this.ObjHrleave.Apply_To_Date = this.DateService.dateConvert(new Date(this.ToDatevalue));
    if(this.ObjHrleave.Leave_Type && this.ObjHrleave.HR_Year_ID && this.ObjHrleave.Emp_ID && this.ObjHrleave.Apply_From_Date && this.ObjHrleave.Apply_To_Date){
      const TempSendData = {
        Emp_ID : Number(this.ObjHrleave.Emp_ID),
        HR_Year_ID : Number(this.ObjHrleave.HR_Year_ID),
        LEAVE_TYPE : this.ObjHrleave.Leave_Type,
        Issued_From_Date : this.ObjHrleave.Apply_From_Date,
        Issued_To_Date : this.ObjHrleave.Apply_To_Date
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
      //  this.getminday();
       })
    }
  
  } 
  compareDate(){
    const ApplyFromDate = new Date(this.FromDatevalue).toISOString();
    const ApplyToDate = new Date(this.ToDatevalue).toISOString();
    const Apply_From_Date = ApplyFromDate.split('T');
    const Apply_To_Date = ApplyToDate.split('T');
    if(Apply_From_Date && Apply_To_Date) {
    // console.log("Apply_From_Date====",Apply_From_Date[0])
    // console.log("Apply_To_Date====",Apply_To_Date[0])
    if(Apply_From_Date[0] == Apply_To_Date[0]) {
      this.checkboxdisabled = true;
      this.HalfDayFlag = false;
    }
    else {
      this.checkboxdisabled = false;
    }
    }
  }
  HalfDayChange(){
    if(this.HalfDayFlag){
      this.ObjHrleave.No_Of_Days_Apply = 0.5;
    } else {
      this.ObjHrleave.No_Of_Days_Apply = this.backupnoofapplydays;
    }
  }
  getminday(){
    this.mndays = undefined;
    this.applydays = undefined;
    this.HalfDayFlag = false;
    // this.minFromDate  = new Date();
  if(this.ObjHrleave.Leave_Type) {
    const ctrl = this;
    const mindayobj = $.grep(ctrl.leaveList,function(item:any) {return Number(item.Atten_Type_ID) == Number(ctrl.ObjHrleave.Leave_Type)})[0];
    console.log("mindayobj >>",mindayobj);
    
    // this.minFromDate = new Date(new Date().getDate() + Number(mindayobj.Min_day));
   // this.minFromDate.setDate(this.minFromDate.getDate() + Number(mindayobj.Min_day));
    //this.FromDatevalue = new Date(new Date().getDate() + Number(mindayobj.Min_day))
    this.mndays = mindayobj.Min_day;
    this.applydays = mindayobj.Apply_day;
    if(this.mndays != 0) {
    this.minFromDate  = new Date(new Date().setDate(new Date().getDate() + Number(mindayobj.Apply_day)));
    this.FromDatevalue =  new Date(new Date().setDate(new Date().getDate() + Number(mindayobj.Apply_day)));
    this.minToDate  = new Date(this.FromDatevalue);
    this.ToDatevalue = new Date(this.minToDate.setDate(new Date(this.FromDatevalue).getDate() + (Number(mindayobj.Min_day) - 1)))
    }
    else if (this.mndays == 0) {
      this.minFromDate  = new Date(new Date().setDate(new Date().getDate() - Number(1000)));
      this.FromDatevalue =  new Date();
      this.minToDate  = new Date(new Date().setDate(new Date().getDate() - Number(1000)));
      this.maxToDate = new Date(new Date().setDate(new Date().getDate() + Number(1000)));
      this.ToDatevalue = new Date();
    }
    // this.To_Time = new Date(this.To_Time.setDate(this.From_Time.getDate() + 1 ))
    // 
    //this.getapplydayschange();
    this.getShowBaln();
  }
  }
  getMaxMindate(){
    this.minFromDate = new Date();
    this.maxFromDate = new Date();
    this.minToDate = new Date();
    this.maxToDate = new Date();
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
        var currentdate = new Date();
        var hryear = new Date(HRFilterValue.HR_Year_Start);
        console.log("currentdate year==",currentdate.getFullYear().toString())
        console.log("hr year==",hryear.getFullYear().toString())
        if (currentdate.getFullYear().toString() === hryear.getFullYear().toString()){
          this.FromDatevalue = new Date();
          this.ToDatevalue = new Date();
        }
        else {
          this.FromDatevalue = new Date(HRFilterValue.HR_Year_Start);
          this.ToDatevalue = new Date(HRFilterValue.HR_Year_Start);
        }
        this.minFromDate = new Date(HRFilterValue.HR_Year_Start);
        this.maxFromDate = new Date(HRFilterValue.HR_Year_End);
        this.minToDate = new Date(HRFilterValue.HR_Year_Start);
        this.maxToDate = new Date(HRFilterValue.HR_Year_End);
        
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
  // EXPORT TO EXCEL
exportexcel(Arr,fileName): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, fileName+'.xlsx');
}
}

class HrleaveSummary {
  Emp_ID:any;
  HR_Year_ID:any;				
}
class HrleaveLedger {
  Emp_ID:any;
  HR_Year_ID:any;
  Leave_Type:any;
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