import { Component, OnInit } from '@angular/core';
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import * as moment from "moment";
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctCommonApi } from '../../../compacct.services/common.api.service';
import { CompacctHeader } from '../../../compacct.services/common.header.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-royale-task',
  templateUrl: './royale-task.component.html',
  styleUrls: ['./royale-task.component.css'],
  providers: [MessageService],
})
export class RoyaleTaskComponent implements OnInit {
  url = window["config"];
  buttonname = "Create";
  Spinner = false;
  seachSpinner = false;
  SearcTaskSubmitted = false;
  TaskModal= false;
  TaskSubmitted = false;
  ObjTask = new Task();
  TaskDueDate = new Date();
  TaskCustomerRadioFlag = 'NewCustomer';
  ObjLeadSearch = new SearchLead();
  SearchUserID: number;
  MemberList = [];
  UserList = [];
  FollowupList = [];
  SubledgerList = [];
  ExistingContactList = [];
  userSelect =[];
  constructor( private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.GetUser();
    this.GetSaleExcu();
    this.GetLead();
    this.GetSubLedger();
  }
  GetUser() {
    this.UserList = [];
    this.$http.get(this.url.apiGetUserLists).subscribe((data: any) => {
      const SerialNoList = data.length ? data : [];
      SerialNoList.forEach(el => {
        this.UserList.push({
          label: el.User_Name,
          value: el.User_ID
        });
      });
      this.SearchUserID = this.commonApi.CompacctCookies.User_ID;
      this.userSelect.push(this.commonApi.CompacctCookies.User_ID);
     // this.ObjLead.User_ID = this.commonApi.CompacctCookies.User_ID;
    });
  }
  GetSaleExcu() {
    this.MemberList = [];
    const params = new HttpParams()
    .set("User_ID",  this.commonApi.CompacctCookies.User_ID)
    this.$http.get('/BL_CRM_Lead_Management_V2/Get_Salesman_with_hierarchy',{ params }).subscribe((data: any) => {
      this.MemberList = data ? JSON.parse(data) : [];
    });
  }
  GetLead() {
    this.$http.get("/BL_CRM_Lead_Management_V2/Get_Existing_Contact").subscribe((data: any) => {
      this.ExistingContactList = data ? JSON.parse(data) : [];
    });
  }
  GetSubLedger() {
    this.$http.get("/Common/Get_SubLedger_All").subscribe((data: any) => {
      this.SubledgerList = data ? JSON.parse(data) : [];
    });
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjLeadSearch.Statrt_Date = dateRangeObj[0];
      this.ObjLeadSearch.End_Date = dateRangeObj[1];
    }
  }
  GetTaskDueDate(date) {
    if (date) {
      this.ObjTask.Due_On = this.DateService.dateConvert(
        moment(date, "YYYY-MM-DD")["_d"]
      );
    }
  }
  TaskRadioChange(){
    if(this.ObjTask.Linked_To === 'Subledger') {
      this.ObjTask.Foot_Fall_ID = 0;
    } else if (this.ObjTask.Linked_To === 'Lead'){
      this.ObjTask.Sub_Ledger_ID = 0;
    } else {
      this.ObjTask.Sub_Ledger_ID = 0;
      this.ObjTask.Foot_Fall_ID = 0;
    }
  }

  Searchfollowup(valid) {
    this.FollowupList = [];
    this.SearcTaskSubmitted = true;
    if (valid) {
      this.seachSpinner = true;

      // .set("Statrt_Date",  this.ObjLeadSearch.Statrt_Date ? this.DateService.dateConvert(new Date(this.ObjLeadSearch.Statrt_Date ))
      // : this.DateService.dateConvert(new Date()))
      // .set("End_Date",  this.ObjLeadSearch.End_Date ? this.DateService.dateConvert(new Date(this.ObjLeadSearch.End_Date))
      // : this.DateService.dateConvert(new Date()))
      const params = new HttpParams()
        .set("User_ID",  this.ObjLeadSearch.User_ID)
        .set("Task",  this.ObjLeadSearch.Task ? this.ObjLeadSearch.Status_ID : 0);
      this.$http
        .get("/BL_CRM_Txn_Enq_Task/Get_My_Task_Browse", { params })
        .subscribe((data: any) => {
          console.log(data)
          this.FollowupList = data ? JSON.parse(data) : [];
          this.seachSpinner = false;
          this.SearcTaskSubmitted = false;
        });
    }
  }

  mergeObj () {
    let  Arr =[];
    this.ObjTask.Created_By = this.commonApi.CompacctCookies.User_ID;
    const Obj = this.ObjTask;
    for(let k = 0;k < this.userSelect.length;k++){
      this.ObjTask = Obj;
      this.ObjTask.Tagged_To_User_ID = this.userSelect[k];
      Arr.push( this.ObjTask);
      this.ObjTask = new Task();
    }
    return JSON.stringify(Arr);
  }

  SaveTask(valid) {
    this.TaskSubmitted = true;
    if (valid ) {
      this.Spinner = true;
      // this.ObjLead.User_ID =   String(this.SearchUserID);
      // this.ObjLead.Posted_On = moment().format("DD/MMM/YYYY h:mm a");
      // this.ObjLead.Status_ID = this.ObjLead.Foot_Fall_ID ? 2:1;
      console.log(this.ObjTask)
      const obj = this.mergeObj()
      this.$http
        .post("/BL_CRM_Txn_Enq_Task/Insert_Enq_Task", { Enq_Task_String: obj })
        .subscribe((data: any) => {
          if (data.success === true) {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Succesfully Added Task"
              });
              this.clearData();
            console.group("Compacct V2");
            console.log("%c  Task Sucess:", "color:green;");
            console.log("/BL_CRM_Txn_Enq_Task/Insert_Enq_Task");
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
    }
  }
  AddTask() {
    this.clearData();
    this.ObjTask = new Task();
    this.TaskModal= true;
    this.ObjTask.Tagged_To_User_ID = this.commonApi.CompacctCookies.User_ID;
  }
  EditTask(Task_ID) {
    this.clearData();
    if(Task_ID){
      const obj = new HttpParams().set("Task_ID", Task_ID);
      this.$http
        .get("/BL_CRM_Txn_Enq_Task/Get_My_Task_Edit", { params: obj })
        .subscribe((data: any) => {
          console.log(data)
        //  this.AddressListView = data.length ? data : [];
        // this.ObjTask.Tagged_To_User_ID = this.commonApi.CompacctCookies.User_ID;
          this.TaskModal = true;
        });
    }
  }
  RedirectStatus(Task_ID) {
    if(Task_ID){
      const obj = new HttpParams().set("Task_ID", Task_ID);
      this.$http
        .get("/BL_CRM_Txn_Enq_Task/Get_My_Task_Edit", { params: obj })
        .subscribe((data: any) => {
          console.log(data)
        //  this.AddressListView = data.length ? data : [];
        // this.ObjTask.Tagged_To_User_ID = this.commonApi.CompacctCookies.User_ID;
         //  this.TaskModal = true;
        });
    }
  }
  clearData() {
    this.seachSpinner = false;
    this.SearcTaskSubmitted = false;
    this.TaskModal= false;
    this.TaskSubmitted = false;
    this.ObjTask = new Task();
    this.TaskDueDate = new Date();
    this.TaskCustomerRadioFlag = 'NewCustomer';
  }
}
class Task {
  Task_ID: string;
  Priority: string;
  Task_Status_ID: string;
  Task_Subject: string;
  Due_On: string;
  Tagged_To_User_ID : string;
  Linked_To : string;
  Foot_Fall_ID : number;
  Sub_Ledger_ID : number;
  Last_Updated_On: string;
  Created_By: string;
  Created_On: string;

}
class SearchLead{
  Statrt_Date:any;
  End_Date:any;
  User_ID:any;
  Task:any;
}
