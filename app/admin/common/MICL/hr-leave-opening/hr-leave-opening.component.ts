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
  items = [];
  menuList=[];
  AllData = [];
  empDataList=[];
  hrYeatList=[];
  leaveList=[];
  menuData=[];
  tabIndexToView= 0;
  buttonname = "Create";
  leaveFormSubmitted = false;
  Objleave: leave = new leave ();
  leaveId = undefined ;
  Spinner = false;
  can_popup = false;
  act_popup = false;
  masterLeaveId : number;
  GlobalApi=[];
  txnId = undefined;
  mastertxnId = undefined;
  HRYearID = undefined;
  LEAVETYPE = undefined;
  TranType = undefined;
  Editdisable = false;
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
    Header: "HR Leave Opening Issue Balance",
    Link: " MICL -> HR-leave Opening"
  })
  this.employeeData();
  this.GetAllData();
  this.hrYearList();
  this.leaveTypList();
}
TabClick(e) {
  this.tabIndexToView = e.index;
  this.items = ["BROWSE", "CREATE"];
  this.buttonname = "Save";
  this.clearData();
  this.Editdisable = false;
}
clearData(){
  this.leaveFormSubmitted = false;
  this.Objleave = new leave();
  this.leaveId = undefined;
 }
 GetAllData(){
  const obj = {
    "SP_String":"SP_HR_Leave_Opening_Issue_Balance",
    "Report_Name_String":"Browse_HR_Leave_Opening_Issue_Balance"
  }

   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    this.AllData = data;
    console.log("all data==",this.AllData);
    });
   
 }
employeeData(){
  const obj = {
    "SP_String":"SP_HR_Leave_Opening_Issue_Balance",
    "Report_Name_String":"Get_Employee_List"
  }

   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    this.empDataList = data;
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
    console.log("Hr Year==",this.hrYeatList);
    });
}
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
saveData(valid:any){
  console.log("savedata==",this.Objleave);
  this.leaveFormSubmitted = true;
  if(valid){
    console.log("leaveId==",this.leaveId);
    if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
   this.Objleave.From_Date = this.DateService.dateConvert(new Date(this.Objleave.From_Date))
   this.Objleave.To_Date = this.DateService.dateConvert(new Date(this.Objleave.To_Date))
   this.Objleave.Leave_Month = "NA"
   this.Objleave.Leave_Year = "NA"
    }
    let msg = this.Objleave ? "Update" : "Create"
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
          this.GetAllData();
          this.leaveId = undefined;
          this.txnId = undefined;
          this.Editdisable = false;
          this.tabIndexToView = 0;
          this.leaveFormSubmitted = false;
          this.Objleave = new leave();
        });
    }
    else{
      console.error("error password")
    }
      
  }
  onReject(){
    this.compacctToast.clear("c");
  }
  EditLeave(leave:any){
    this.leaveId = undefined;
    this.txnId = undefined;
    this.Editdisable = false;
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
    
   })
}
DeleteLeave(masterLeave): void{
  // this.act_popup = false;
  this.masterLeaveId = undefined ;
  this.mastertxnId = undefined;
  this.HRYearID = undefined;
  this.LEAVETYPE = undefined;
  this.TranType = undefined;
  if(masterLeave.Emp_ID){
    // this.can_popup = true;
    this.masterLeaveId = masterLeave.Emp_ID ;
    this.mastertxnId = masterLeave.Txn_ID;
    this.HRYearID = masterLeave.HR_Year_ID;
    this.LEAVETYPE = masterLeave.LEAVE_TYPE;
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
      LEAVE_TYPE : this.LEAVETYPE,
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
        this.GetAllData();
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
          summary: "User Id: " + this.masterLeaveId.toString(),
          detail: "Succesfully Deleted"
        });
       }
    })
  }
}
leaveChange(){
  this.Objleave.From_Date = undefined;
  this.Objleave.To_Date = undefined;
  if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
  if (this.Objleave.HR_Year_ID) {
  const arr = this.hrYeatList.filter(item=> item.HR_Year_ID == this.Objleave.HR_Year_ID); 
   this.Objleave.From_Date = arr[0].HR_Year_Start;
   this.Objleave.To_Date = arr[0].HR_Year_End;
   console.log('arr===',arr)
  }  
}
else {
  this.Objleave.From_Date = undefined;
   this.Objleave.To_Date = undefined;
}
}
} 
class leave{
  HR_Year_ID:any
  Leave_Month:any
  Leave_Year:any
  Leave_Type:any
  LEAVE_TYPE:any
  Tran_Type:any
  DR_Leave:any
  CR_Leave:any
  Remarks:any
  From_Date:any
  To_Date:any
  Emp_ID:any
  Emp_Name:any
}