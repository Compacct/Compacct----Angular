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
  constructor( private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.GetUser();
    this.GetSaleExcu();
  }
  GetUser() {
    this.UserList = [];
    this.$http.get(this.url.apiGetUserLists).subscribe((data: any) => {
      this.UserList = data.length ? data : [];
      this.SearchUserID = this.commonApi.CompacctCookies.User_ID;
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
  SaveTask(valid) {
    this.TaskSubmitted = true;
    if (valid ) {
      this.Spinner = true;
      // this.ObjLead.User_ID =   String(this.SearchUserID);
      // this.ObjLead.Posted_On = moment().format("DD/MMM/YYYY h:mm a");
      // this.ObjLead.Status_ID = this.ObjLead.Foot_Fall_ID ? 2:1;
      console.log(this.ObjTask)
      this.$http
        .post("/BL_CRM_Txn_Enq_Task/Insert_Enq_Task", { Enq_Task_String: JSON.stringify([this.ObjTask]) })
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
  RedirectTask(footfallid) {
    this.TaskModal = false;
    this.clearData();
    this.ObjTask = new Task();
    if(footfallid){
      this.TaskModal= true;
      this.ObjTask.Foot_Fall_ID = footfallid;
      this.ObjTask.Tagged_To_User_ID = this.commonApi.CompacctCookies.User_ID;
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
  Foot_Fall_ID : string;
  Sub_Ledger_ID : string;
  Last_Updated_On: string;
  Created_By: string;
  Created_On: string;

}
class SearchLead{
  Statrt_Date:any;
  End_Date:any;
  SalesManID:any;
  Status_ID:any;
}
