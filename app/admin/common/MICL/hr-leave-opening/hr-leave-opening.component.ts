import { data } from 'jquery';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';


@Component({
  selector: 'app-hr-leave-opening',
  templateUrl: './hr-leave-opening.component.html',
  styleUrls: ['./hr-leave-opening.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HrLeaveOpeningComponent  implements OnInit {
  items:any = [];
  menuList:any = [];
  AllData:any = [];
  empDataList:any = [];
  hrYeatList:any = [];
  leaveList:any = [];
  menuData:any = [];
  initDate:any =[];
  tabIndexToView= 0;
  buttonname = "Create";
  leaveFormSubmitted = false;
  Objleave: leave = new leave ();
  leaveId = undefined ;
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
  Save = false;
  del = true;

  ObjBrowse : Browse = new Browse ();
  HrLeaveAOpenSearchFormSubmitted = false;
  seachSpinner = false;
  BackupAllData:any = [];
  DistEmpName:any = [];
  SelectedDistEmpName:any = [];
  SearchFields:any = [];
  Transaction_Date = new Date();
  Opening : any;
  Availed : any;
  Balance : any;
  hryear : any;
  databaseName:any;

  ObjAutoUpdateleave: AutoUpdateleave = new AutoUpdateleave ();
  AUhrYeatList:any = [];
  AutoU_Transaction_Date = new Date();
  AutoUpdateModal:boolean = false;
  AutoUpdateempDataList:any = [];
  CheckStatusData:any;
  AutoUpdateleaveFormSubmitted:boolean = false;
  APCheckStatusData: any;
  SelectedEmployee:any = [];
  EmployeeAutoUpdateLeaveList:any = [];
  AddleaveopList:any = [];
  empid: any;
  formdate: any;
  todate: any;

  constructor(
    public $http: HttpClient,
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
    Header: "HR Leave Opening Balance",
    Link: " MICL -> HR-leave Opening"
  })
  this.getDatabase();
  this.employeeData();
  // this.GetAllData();
  this.hrYearList();
  this.leaveTypList();
  // this.Finyear();
}
TabClick(e) {
  this.tabIndexToView = e.index;
  this.items = ["BROWSE", "CREATE"];
  this.buttonname = "Create";
  this.clearData();
  this.Editdisable = false;
  this.hryear = undefined;
  this.AddleaveopList = [];
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
clearData(){
  this.leaveFormSubmitted = false;
  this.Objleave = new leave();
  if(this.databaseName === 'GN_JOH_HR') {
  this.Objleave.Emp_ID = 0;
  }
  this.leaveId = undefined;
  this.initDate =[];
  this.hrYearList();
}
getDateRange(dateRangeObj:any) {
  if (dateRangeObj.length) {
   this.Objleave.From_Date = dateRangeObj[0];
   this.Objleave.To_Date = dateRangeObj[1];
   if (this.buttonname === "Create") {
    this.getbalancedata();
  }
  }
}
GetAllData(valid){
  this.HrLeaveAOpenSearchFormSubmitted = true;
  const tempobj = {
    HR_Year_ID  : this.ObjBrowse.HR_Year_ID,
    Atten_Type_ID : this.ObjBrowse.Leave_Type
    }
    if(valid){
  const obj = {
    "SP_String":"SP_HR_Leave_Opening_Issue_Balance",
    "Report_Name_String":"Browse_HR_Leave_Opening_Issue_Balance",
    "Json_Param_String": JSON.stringify([tempobj])
  }

   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    this.AllData = data;
      this.BackupAllData = data;
      this.GetDistinct();
      this.HrLeaveAOpenSearchFormSubmitted = false;
    console.log("all data==",this.AllData);
    });
  }
}
  // DISTINCT & FILTER
GetDistinct() {
  let DEmpName:any = [];
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
    "SP_String":"SP_HR_Leave_Opening_Issue_Balance",
    "Report_Name_String":"Get_Employee_List"
  }

   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    // this.empDataList = data;
    if(data.length){
      data.forEach(element => {
        element['label'] = element.Emp_Name
        element['value'] = element.Emp_ID
      });
      this.empDataList = data;
      if(this.databaseName === 'GN_JOH_HR') {
      this.Objleave.Emp_ID = 0;
      }
      this.AutoUpdateempDataList = data;
     }
     else {
      this.empDataList = data;
      if(this.databaseName === 'GN_JOH_HR') {
      this.Objleave.Emp_ID = undefined;
      }
      this.AutoUpdateempDataList = [];
     }
    console.log("employee==",this.empDataList);
    });
}
hrYearList(){
  const obj = {
    "SP_String":"SP_HR_Leave_Opening_Issue_Balance",
    "Report_Name_String":"Get_HR_Year_List"
  }

   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    this.hrYeatList = data;
    this.AUhrYeatList = data;
    this.Objleave.HR_Year_ID = data[0].HR_Year_ID;
    this.ObjBrowse.HR_Year_ID = data[0].HR_Year_ID;
    this.ObjAutoUpdateleave.HR_Year_ID = data[0].HR_Year_ID;
    console.log("Hr Year==",this.hrYeatList);
    if (this.buttonname === "Create" || this.ObjAutoUpdateleave.HR_Year_ID) {
      this.leaveChange();
    }
    });
}
// Finyear() {
//   this.$http
//     .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
//     .subscribe((res: any) => {
//     let data = JSON.parse(res)
//     // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
//     // this.voucherminDate = new Date(data[0].Fin_Year_Start);
//     // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
//    this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
//   //   const obj = {
//   //     "SP_String":"SP_Leave_Application",
//   //     "Report_Name_String":"Get_HR_Year_List"
//   //  }
//   //  this.GlobalAPI.getData(obj)
//   //    .subscribe((data:any)=>{
//   //     this.hrYeatList = data;
//   //     console.log("Hr Year==",this.hrYeatList);
//   //     // this.ObjHrleave.HR_Year_ID =  this.hrYeatList.length ? this.hrYeatList[0].HR_Year_ID : undefined
//   //     this.initDate =  [new Date(data[0].HR_Year_Start) , new Date(data[0].HR_Year_End)]
//     });
// }
leaveTypList(){
  const obj = {
    "SP_String":"SP_HR_Leave_Opening_Issue_Balance",
    "Report_Name_String":"Get_Leave_Type_List"
  }
   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    this.leaveList = data;
    console.log("leave list==",this.leaveList);
    });
}
getbalancedata(){
  this.Opening = undefined;
  this.Availed = undefined;
  this.Balance = undefined;
  this.Objleave.From_Date = this.Objleave.From_Date ? this.DateService.dateConvert(new Date(this.Objleave.From_Date)): this.DateService.dateConvert(new Date());
  this.Objleave.To_Date = this.Objleave.To_Date ? this.DateService.dateConvert(new Date(this.Objleave.To_Date)): this.DateService.dateConvert(new Date());
  //  console.log(this.Objleave.From_Date , this.Objleave.To_Date)
    if(this.Objleave.HR_Year_ID && this.Objleave.From_Date && this.Objleave.To_Date && this.Objleave.Emp_ID && this.Objleave.LEAVE_TYPE){
      const TempSendData = {
        HR_Year_ID : Number(this.Objleave.HR_Year_ID),
        From_Date : this.Objleave.From_Date,
        To_Date : this.Objleave.To_Date,
        Emp_ID : Number(this.Objleave.Emp_ID),
        Atten_Type_ID : this.Objleave.LEAVE_TYPE,
      }
      const obj = {
        "SP_String": "SP_HR_Leave_Opening_Issue_Balance",
        "Report_Name_String": 'Show_Balance',
        "Json_Param_String": JSON.stringify([TempSendData])
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        //  console.log("Show Blan",data)
         this.Opening = data[0].Opening;
         this.Availed = data[0].Availed;
         this.Balance = data[0].Balance;
       })
    }
}
saveData(valid:any){
  this.leaveFormSubmitted = true
  if(valid){
    if(!this.Objleave.Emp_ID){
      this.Spinner =true
      this.Save = true
      this.del = false
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "c",
          sticky: true,
          severity: "error",
          detail: "Previous Opening Leave For All Employes will remove for this period ",
          summary: "Want to proceed",
         
        });
        this.Spinner =false

      }
      else{
       //console.log("this.Objleave.Emp_ID",this.Objleave.Emp_ID)
       if(this.Objleave.Emp_ID){
        this.Spinner =true;
        this.Save = false;
        this.del = false;
        this.onConfirm2();
       }
      }
    }
}
onConfirm2(){
  console.log("savedata==",this.Objleave);
  this.leaveFormSubmitted = true
    console.log("leaveId==",this.leaveId);
    // if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
    this.Objleave.From_Date = this.Objleave.From_Date ? this.DateService.dateConvert(new Date(this.Objleave.From_Date)): this.DateService.dateConvert(new Date());
    this.Objleave.To_Date = this.Objleave.To_Date ? this.DateService.dateConvert(new Date(this.Objleave.To_Date)): this.DateService.dateConvert(new Date());
   this.Objleave.Leave_Month = "NA"
   this.Objleave.Leave_Year = "NA"
   this.Objleave.Tran_Type = "Opening"
   this.Objleave.Emp_ID = this.Objleave.Emp_ID ? this.Objleave.Emp_ID : 0
   this.Objleave.LEAVE_TYPE = Number(this.Objleave.LEAVE_TYPE)
   this.Objleave.Transaction_Date = this.Objleave.Transaction_Date ? this.DateService.dateConvert(new Date(this.Transaction_Date)) : this.DateService.dateConvert(new Date());
    // }
    let msg = this.buttonname ;
      const obj = {
        "SP_String": "SP_HR_Leave_Opening_Issue_Balance",
        "Report_Name_String": 'Save_HR_Leave_Opening_Issue_Balance',
        "Json_Param_String": JSON.stringify([this.Objleave])
       }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        console.log("Final save data ==",data);
        if (data[0].Emp_ID || data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "User Succesfully " +msg,
            detail: "Succesfully " +msg
          });
          }
          this.Spinner = false;
          this.GetAllData(true);
          this.leaveId = undefined;
          this.txnId = undefined;
          this.Editdisable = false;
          this.tabIndexToView = 0;
          this.leaveFormSubmitted = false;
          this.Objleave = new leave();
          if(this.databaseName === 'GN_JOH_HR') {
          this.Objleave.Emp_ID = 0;
          }
          this.hryear = undefined;
        });
    
      
}
onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("joh");
    this.compacctToast.clear("johAU");
    this.SelectedEmployee = [];
    this.EmployeeAutoUpdateLeaveList = [];
}
EditLeave(leave:any){
    this.leaveId = undefined;
    this.txnId = undefined;
    this.Editdisable = false;
    this.hryear = undefined;
    if (leave.Emp_ID) {
      this.Editdisable = true;
      this.leaveId = undefined;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.leaveId = leave.Emp_ID
      this.txnId = leave.Txn_ID
     this.GetEditMasterleave(leave.Emp_ID)
     }    
}
GetEditMasterleave(Uid){
  const tempobj = {
    Emp_ID : this.leaveId,
    Txn_ID : this.txnId
  }
  const obj = {
    "SP_String": "SP_HR_Leave_Opening_Issue_Balance",
    "Report_Name_String":"Get_HR_Leave_Opening_Issue_Balance",
    "Json_Param_String": JSON.stringify([tempobj]) 
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("EditMasterdata===",data);
    this.Objleave = data[0];
    this.hryear = data[0].HR_Year_Name;
    this.initDate = [new Date(data[0].From_Date) , new Date(data[0].To_Date)]
    this.getbalancedata();
    this.Transaction_Date = new Date(data[0].Transaction_Date);
   })
}
DeleteLeave(masterLeave): void{
   this.del = true;
   this.Save = false
  this.masterLeaveId = undefined ;
  this.mastertxnId = undefined;
  this.HRYearID = undefined;
  this.LEAVETYPE = undefined;
  this.TranType = undefined;
  if(masterLeave.Emp_ID){
    this.del = true;
    this.Save = false;
    this.masterLeaveId = masterLeave.Emp_ID ;
    this.mastertxnId = masterLeave.Txn_ID;
    this.HRYearID = masterLeave.HR_Year_ID;
    this.LEAVETYPE = masterLeave.Atten_Type_ID;
    this.TranType = masterLeave.Tran_Type;
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
onConfirm(){ 
console.log("onconform==",this.Objleave)
  if(this.masterLeaveId){
    const tempobj = {
      Emp_ID : this.masterLeaveId,
      Txn_ID : this.mastertxnId,
      HR_Year_ID : this.HRYearID,
      LEAVE_TYPE : Number(this.LEAVETYPE),
      Tran_Type : this.TranType

    }
    const obj = {
      "SP_String": "SP_HR_Leave_Opening_Issue_Balance",
      "Report_Name_String": "Delete_HR_Leave_Opening_Issue_Balance",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("del Data===", data[0].Column1)
      if (data[0].Column1 === "Done"){

        this.onReject();
        this.GetAllData(true);
        this.masterLeaveId = undefined ;
        this.mastertxnId = undefined;
        this.HRYearID = undefined;
        this.LEAVETYPE = undefined;
        this.TranType = undefined;
      //  this.can_popup = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "User ",
          detail: "Succesfully Deleted"
        });
       }
    })
  }
}
leaveChange(){
  this.Objleave.From_Date = undefined;
  this.Objleave.To_Date = undefined;
  // if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
  if (this.Objleave.HR_Year_ID) {
  const arr:any = this.hrYeatList.filter((item:any) => Number(item.HR_Year_ID )== Number(this.Objleave.HR_Year_ID)); 
   this.Objleave.From_Date = arr.length? arr[0].HR_Year_Start : new Date();
   this.Objleave.To_Date = arr.length? arr[0].HR_Year_End : new Date();
   var mindate = arr[0].HR_Year_Start;
   var maxdate = arr[0].HR_Year_End;
   this.initDate =  [new Date(mindate) , new Date(maxdate)]
   console.log('arr===',arr)
   this.getbalancedata();
  }  
// }
// else {
//   this.Objleave.From_Date = undefined;
//    this.Objleave.To_Date = undefined;
// }
}

// For Joh
Getsavestatus(valid){
  this.CheckStatusData = undefined;
  this.leaveFormSubmitted = this.buttonname === "Create" ? true : false;
  if(this.buttonname === "Create" ? valid : true){
  const johobj = {
    HR_Year_ID : this.Objleave.HR_Year_ID,
    Transaction_Date : this.DateService.dateConvert(new Date(this.Transaction_Date)),
    Atten_Type_ID : Number(this.Objleave.LEAVE_TYPE),
    From_Date : this.Objleave.From_Date ? this.DateService.dateConvert(new Date(this.Objleave.From_Date)): this.DateService.dateConvert(new Date()),
    To_Date : this.Objleave.To_Date ? this.DateService.dateConvert(new Date(this.Objleave.To_Date)): this.DateService.dateConvert(new Date())
  }
  const obj = {
    "SP_String":"SP_HR_Leave_Opening_Issue_Balance",
    "Report_Name_String":"Check_Balance_Already_Exists_Or_Not",
    "Json_Param_String": JSON.stringify(johobj)
  }

   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    this.CheckStatusData = data[0].Column1;
    // console.log("CheckStatusData==",this.CheckStatusData);
      if(this.CheckStatusData === "OK"){
       //console.log("this.Objleave.Emp_ID",this.Objleave.Emp_ID)
        this.Spinner =true;
        this.onConfirmjoh();
      } 
      else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "joh",
          sticky: true,
          severity: "error",
          detail: this.CheckStatusData,
          summary: "Want to proceed",
         
        });
        this.Spinner = false
      }
    });
  }
}
onConfirmjoh(){
  console.log("savedata==",this.Objleave);
  this.leaveFormSubmitted = this.buttonname === "Create" ? true : false;
    console.log("leaveId==",this.leaveId);
    // if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
   this.Objleave.From_Date = this.Objleave.From_Date ? this.DateService.dateConvert(new Date(this.Objleave.From_Date)): this.DateService.dateConvert(new Date());
   this.Objleave.To_Date = this.Objleave.To_Date ? this.DateService.dateConvert(new Date(this.Objleave.To_Date)): this.DateService.dateConvert(new Date());
   this.Objleave.Leave_Month = "NA"
   this.Objleave.Leave_Year = "NA"
   this.Objleave.Tran_Type = "Opening"
   this.Objleave.Emp_ID = this.Objleave.Emp_ID ? this.Objleave.Emp_ID : 0
   this.Objleave.Atten_Type_ID = Number(this.Objleave.LEAVE_TYPE),
   this.Objleave.LEAVE_TYPE = Number(this.Objleave.LEAVE_TYPE)
   this.Objleave.Transaction_Date = this.Transaction_Date ? this.DateService.dateConvert(new Date(this.Transaction_Date)) : this.DateService.dateConvert(new Date());
   this.Objleave.trn_type = "Save";
    // }
    let msg = this.buttonname ;
      const obj = {
        "SP_String": "SP_HR_Leave_Opening_Issue_Balance",
        "Report_Name_String": 'Save_HR_Leave_Opening_Issue_Balance',
        "Json_Param_String": this.buttonname === "Update" ? JSON.stringify(this.AddleaveopList) : JSON.stringify([this.Objleave])
       }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        console.log("Final save data ==",data);
        if (data[0].Emp_ID || data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "User Succesfully " +msg,
            detail: "Succesfully " +msg
          });
          this.Spinner = false;
          this.AddleaveopList = [];
          this.GetAllData(true);
          this.leaveId = undefined;
          this.txnId = undefined;
          this.Editdisable = false;
          this.tabIndexToView = 0;
          this.leaveFormSubmitted = false;
          this.Objleave = new leave();
          this.hryear = undefined;
          this.Transaction_Date = new Date();
        }
        });
    
      
}
AutoUpdatePopup(){
  this.AutoUpdateleaveFormSubmitted = false;
  this.SelectedEmployee = [];
  this.EmployeeAutoUpdateLeaveList = [];
  this.ObjAutoUpdateleave = new AutoUpdateleave();
  this.AutoU_Transaction_Date = new Date;
  this.leaveId = undefined;
  this.initDate =[];
  this.hrYearList();
 this.AutoUpdateModal = true;
}
getAutoUDateRange(dateRangeObj:any) {
  if (dateRangeObj.length) {
   this.ObjAutoUpdateleave.From_Date = dateRangeObj[0];
   this.ObjAutoUpdateleave.To_Date = dateRangeObj[1];
  }
}
GetAutoUpsavestatus(valid){
  this.APCheckStatusData = undefined;
  this.AutoUpdateleaveFormSubmitted = true
  if(valid){
  const johobj = {
    HR_Year_ID : this.ObjAutoUpdateleave.HR_Year_ID,
    Transaction_Date : this.DateService.dateConvert(new Date(this.Transaction_Date)),
    Atten_Type_ID : Number(this.ObjAutoUpdateleave.LEAVE_TYPE),
    From_Date : this.ObjAutoUpdateleave.From_Date ? this.DateService.dateConvert(new Date(this.ObjAutoUpdateleave.From_Date)): this.DateService.dateConvert(new Date()),
    To_Date : this.ObjAutoUpdateleave.To_Date ? this.DateService.dateConvert(new Date(this.ObjAutoUpdateleave.To_Date)): this.DateService.dateConvert(new Date())
  }
  const obj = {
    "SP_String":"SP_HR_Leave_Opening_Issue_Balance",
    "Report_Name_String":"Check_Balance_Already_Exists_Or_Not",
    "Json_Param_String": JSON.stringify(johobj)
  }

   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    this.APCheckStatusData = data[0].Column1;
    // console.log("CheckStatusData==",this.CheckStatusData);
      if(this.APCheckStatusData === "OK"){
       //console.log("this.Objleave.Emp_ID",this.Objleave.Emp_ID)
        this.Spinner =true;
        this.onConfirmjohAutoUp();
      } 
      else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "johAU",
          sticky: true,
          severity: "error",
          detail: this.APCheckStatusData,
          summary: "Want to proceed",
         
        });
        this.Spinner =false
      }
    });
  }
}
onConfirmjohAutoUp(){
  console.log("savedata==",this.Objleave);
  this.AutoUpdateleaveFormSubmitted = true
    console.log("leaveId==",this.leaveId);
    // if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
    this.ObjAutoUpdateleave.From_Date = this.Objleave.From_Date ? this.DateService.dateConvert(new Date(this.Objleave.From_Date)): this.DateService.dateConvert(new Date());
    this.ObjAutoUpdateleave.To_Date = this.Objleave.To_Date ? this.DateService.dateConvert(new Date(this.Objleave.To_Date)): this.DateService.dateConvert(new Date());
  //  this.ObjAutoUpdateleave.Emp_ID = this.Objleave.Emp_ID ? this.Objleave.Emp_ID : 0
   this.ObjAutoUpdateleave.Transaction_Date = this.AutoU_Transaction_Date ? this.DateService.dateConvert(new Date(this.AutoU_Transaction_Date)) : this.DateService.dateConvert(new Date());
    // }
    if(this.SelectedEmployee.length) {
    this.SelectedEmployee.forEach(el => {
      const employeeidFilter = this.AutoUpdateempDataList.filter((ele:any)=>Number(ele.Emp_ID) === Number(el));
    this.EmployeeAutoUpdateLeaveList.push({
      HR_Year_ID : this.ObjAutoUpdateleave.HR_Year_ID,
      From_Date : this.ObjAutoUpdateleave.From_Date,
      To_Date : this.ObjAutoUpdateleave.To_Date,
      Emp_ID : employeeidFilter.length ? employeeidFilter[0].Emp_ID : undefined,
      Transaction_Date : this.ObjAutoUpdateleave.Transaction_Date
    });
    
  });
  
      const obj = {
        "SP_String": "SP_HR_Leave_Opening_Issue_Balance",
        "Report_Name_String": 'Auto_Update_HR_Leave_Opening_Issue_Balance',
        "Json_Param_String": JSON.stringify(this.EmployeeAutoUpdateLeaveList)
       }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        console.log("Final save data ==",data);
        if (data[0].Column1 === "Done"){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "User Succesfully Updated",
            detail: "Succesfully Updated"
          });
          this.Spinner = false;
          this.GetAllData(true);
          this.leaveId = undefined;
          this.AutoUpdateleaveFormSubmitted = false;
          this.ObjAutoUpdateleave = new AutoUpdateleave();
          this.AutoU_Transaction_Date = new Date();
          this.hryear = undefined;
          this.AutoUpdateModal = false;
          this.SelectedEmployee = [];
          this.EmployeeAutoUpdateLeaveList = [];
          this.AddleaveopList = [];
        } 
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error Message",
            detail: data[0].Column1
          });
        }
        });
    
      
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error Message",
        detail: "Select Employee"
      });
    }
}

TrasnsactionDateCheck(){
  if(this.Transaction_Date) {
    var transdate = this.DateService.dateConvert(new Date(this.Transaction_Date));
    console.log('Transaction_Date==',new Date(transdate).toISOString())
    const sametransdate = this.AddleaveopList.filter(item=> new Date(item.Transaction_Date).toISOString() == new Date(transdate).toISOString());
    if(sametransdate.length) {
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Same transaction date found."
          });
          console.log(false)
      return false;
    }
    else {
      console.log(true)
      return true;
    }
  }
}
Leavetypecheck(){
  const sameleavetype = this.AddleaveopList.filter(item=> Number(item.Atten_Type_ID) === Number(this.Objleave.LEAVE_TYPE));
    if(sameleavetype.length) {
        return true;
    }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Add same leave type. "
      });
      return false;
    }
}
Addleaveop(valid) {
  this.leaveFormSubmitted = true;
  if (valid && this.TrasnsactionDateCheck() && this.Leavetypecheck()) {
    const hryear: any = this.hrYeatList.filter((el: any) => Number(el.HR_Year_ID) === Number(this.Objleave.HR_Year_ID));
    const empname: any = this.empDataList.filter((el: any) => Number(el.Emp_ID) === Number(this.Objleave.Emp_ID));
    const leavetype: any = this.leaveList.filter((el: any) => Number(el.Atten_Type_ID) === Number(this.Objleave.LEAVE_TYPE));
    const TemopArry = {
      HR_Year_ID:this.Objleave.HR_Year_ID,
      HR_Year_Name: hryear.length ? hryear[0].HR_Year_Name : undefined,
      Transaction_Date: this.DateService.dateConvert(new Date(this.Transaction_Date)),
      From_Date: this.DateService.dateConvert(new Date(this.Objleave.From_Date)),
      To_Date: this.DateService.dateConvert(new Date(this.Objleave.To_Date)),
      Emp_ID: this.Objleave.Emp_ID,
      Emp_Name: empname.length ? empname[0].Emp_Name : undefined,
      Atten_Type_ID: Number(this.Objleave.LEAVE_TYPE),
      LEAVE_TYPE : Number(this.Objleave.LEAVE_TYPE),
      LEAVE_TYPE_Name : leavetype.length ? leavetype[0].Leave_Type : undefined,
      DR_Leave: Number(this.Objleave.DR_Leave),
      Remarks: this.Objleave.Remarks,
      trn_type : "Update"
    };
    this.AddleaveopList.push(TemopArry)
    console.log("this.AddleaveopList", this.AddleaveopList)
    this.leaveFormSubmitted = false;
    this.Objleave.DR_Leave = undefined;
    this.Objleave.Remarks = undefined;
    this.hrYearList();
  }
}
Deleteaddlist(index){
  this.AddleaveopList.splice(index,1);
}
Editleaveop(leave:any){
  this.empid = undefined;
  this.formdate = undefined;
  this.todate = undefined;
  this.hryear = undefined;
  this.Editdisable = false;
  this.AddleaveopList = [];
  if (leave.Emp_ID) {
    this.Editdisable = true;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.clearData();
    this.empid = leave.Emp_ID
    this.formdate = new Date(leave.From_Date);
    this.todate = new Date(leave.To_Date);
   this.GetEditMasterleaveop()
   }    
}
GetEditMasterleaveop(){
const tempobj = {
  Emp_ID : this.empid,
  From_Date : this.DateService.dateConvert(new Date(this.formdate)),
  To_Date : this.DateService.dateConvert(new Date(this.todate))
}
const obj = {
  "SP_String": "SP_HR_Leave_Opening_Issue_Balance",
  "Report_Name_String":"Get_HR_Leave_Opening_Issue_Balance",
  "Json_Param_String": JSON.stringify([tempobj]) 
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   console.log("EditMasterdata===",data);
   this.Objleave.HR_Year_ID = data[0].HR_Year_ID;
   this.Objleave.Emp_ID = data[0].Emp_ID;
   this.Objleave.LEAVE_TYPE = data[0].LEAVE_TYPE;
   this.getbalancedata();
  if(data.length){
    data.forEach(element => {
      const leavetype: any = this.leaveList.filter((el: any) => Number(el.Atten_Type_ID) === Number(element.LEAVE_TYPE));
      const editobj = {
        HR_Year_ID : element.HR_Year_ID,
        HR_Year_Name: element.HR_Year_Name,
        Transaction_Date: this.DateService.dateConvert(new Date(element.Transaction_Date)),
        From_Date: this.DateService.dateConvert(new Date(element.From_Date)),
        To_Date: this.DateService.dateConvert(new Date(element.To_Date)),
        Emp_ID: element.Emp_ID,
        Emp_Name: element.Emp_Name,
        Atten_Type_ID: Number(element.LEAVE_TYPE),
        LEAVE_TYPE : Number(element.LEAVE_TYPE),
        LEAVE_TYPE_Name : leavetype.length ? leavetype[0].Leave_Type : undefined,
        DR_Leave : Number(element.DR_Leave),
        Remarks: element.Remarks, 
        trn_type : "Update"
      }
      this.AddleaveopList.push(editobj);
    });
  }
 })
}
} 
class leave{
  HR_Year_ID:any
  Leave_Month:any
  Leave_Year:any
  Leave_Type:any
  Atten_Type_ID:any
  LEAVE_TYPE:any
  Tran_Type = "Opening"
  DR_Leave:any
  CR_Leave:any
  Remarks:any
  From_Date:any
  To_Date:any
  Emp_ID:any
  Emp_Name:any
  Transaction_Date:any;
  trn_type:any;
}
class Browse {
  HR_Year_ID : any;
  Leave_Type : any;
  From_date : Date;
  To_date : Date;
 }
 class AutoUpdateleave{
  HR_Year_ID:any
  Leave_Month:any
  Leave_Year:any
  Leave_Type:any
  LEAVE_TYPE:any
  Tran_Type = "Opening"
  DR_Leave:any
  CR_Leave:any
  Remarks:any
  From_Date:any
  To_Date:any
  Emp_ID:any
  Emp_Name:any
  Transaction_Date:any;
}