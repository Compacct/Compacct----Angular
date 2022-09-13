import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import {CompacctGetDistinctService } from "../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";
declare var $:any;
import * as XLSX from 'xlsx';
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-harba-task-list',
  templateUrl: './harba-task-list.component.html',
  styleUrls: ['./harba-task-list.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HarbaTaskListComponent implements OnInit {
  Spinner = false;
  tabIndexToView = 0
  projectList:any = [];
  projectBackUp:any = [];
  ProjectID = undefined;
  SiteID = undefined;
  TaskListFormSubmitted = false;
  SiteList:any = [];
  taskData:any = [];
  taskUpdate = false;
  SpinnerTask = false;
  TaskStatus = undefined;
  TaskViewObj:any = {};
  Remark = ""
  taskListUpdateFormSubmitted = false
  updateDataList:any = [];
  DistStatus:any = [];
  SelectedStatus:any = [];
  BackUptaskData:any = [];
  SpinnerRefresh = false;
  req_date_B = undefined;
  req_date2 = undefined;
  initDate = [];
  constructor(
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Task List",
      Link: "Project Management -> Task List"
    });
    this.GetProject();
    this.initDate = [new Date(), new Date()];
  }
  GetProject(){
    this.projectList = [];
    const obj = {
        "SP_String": "SP_Task_Management_Tender",
        "Report_Name_String": "Get_Project_All",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.projectBackUp = data
       if(data.length) {
        data.forEach(element => {
          element['label'] = element.Project_Description,
          element['value'] = element.Project_ID
        });
        this.projectList = data;
      } else {
        this.projectList = [];
      }
      console.log("select projectList======",this.projectList);
    })

  }
  GetSite(projID:any){
    if(projID){
      const ProjectFilter = this.projectBackUp.filter(el=> Number(el.Project_ID) === Number(projID))[0];
      const tempData = {
        Project_ID : ProjectFilter.Project_ID,
        Tender_Doc_ID : ProjectFilter.Tender_Doc_ID
      }
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get_Site_For_Project_Planning",
        "Json_Param_String": JSON.stringify([tempData])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data.length) {
          data.forEach(element => {
            element['label'] = element.Site_Description,
            element['value'] = element.Site_ID
          });
          this.SiteList = data;
        } else {
          this.SiteList = [];
        }
        console.log("select projectList======",this.SiteList);
      })
    }
  }
  SearchTaskList(valid:any, btn?){
    console.log(valid);
   this.TaskListFormSubmitted = true;
   if(valid){
     if(btn === "Spinner"){
      this.Spinner = true
     }
     else if(btn === "SpinnerRefresh") {
       this.SpinnerRefresh = true
     }
     const start = this.req_date_B
     ? this.DateService.dateConvert(new Date(this.req_date_B))
     : this.DateService.dateConvert(new Date());
   const end = this.req_date2
     ? this.DateService.dateConvert(new Date(this.req_date2))
     : this.DateService.dateConvert(new Date());
     const tempData = {
      Project_ID : Number(this.ProjectID),
      Site_ID : Number(this.SiteID),
      User_ID : this.commonApi.CompacctCookies.User_ID,
      Start_Date : start,
      End_Date : end
     }
     const obj = {
      "SP_String": "SP_Task_GNATT",
      "Report_Name_String": "Get_GNATT_TASK_Browse_Datewise",
      "Json_Param_String": JSON.stringify([tempData])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Data",data);
      this.taskData = data;
      this.BackUptaskData = data;
      this.Spinner = false;
      this.SpinnerRefresh= false;
      this.GetDist();
      this.FilterDist();
    })
   }
  }
  getStatusWiseColor(data) {
    const status = data.Task_Status;
    const endDate = new Date(data.taskData.Planned_End_Date);
    var today = new Date();
    today.setHours(0,0,0,0);
    if(endDate < today) {
      if(status === 'In Progress'){
        return 'red';
      }
    }
    if(status === 'Not Started'){
      return 'Orange';
    }
    if(status === 'In Progress'){
      return 'blueviolet';
    }
    if(status === 'Completed'){
      return 'yellowgreen';
    }
  //  switch (Status) {
  //       case 'Not Started':
  //         return 'Orange';
  //         break;
  //       case 'In Progress':
  //         return 'blueviolet';
  //         break;
  //       case 'Completed':
  //         return 'yellowgreen';
  //         break;
  //       default:
  //     }
    
  }
  updateTask(obj:any){
    console.log(obj);
   if(obj){
    this.TaskViewObj = obj;
    this.getUpdatedataList(obj.Task_Txn_ID);
    this.SpinnerTask = false;
    this.Remark = undefined;
    this.TaskStatus = undefined;
    console.log(this.TaskViewObj);
    setTimeout(() => {
      this.taskUpdate = true
    }, 1000);
   }
  }
  getUpdatedataList(txn:any){
    if(txn){
      const obj = {
        "SP_String": "SP_Task_GNATT",
        "Report_Name_String": "Get_Remarks_Task",
        "Json_Param_String": JSON.stringify([{Task_Txn_ID : Number(txn)}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("Update data",data);
        this.updateDataList = data;
      })
    }
  }
 saveTaskStatus(valid:any){
    this.taskListUpdateFormSubmitted = true;
    console.log("valid",valid);
    if(valid){
      this.SpinnerTask = true;
      const tempSaveData = {
        Task_Txn_ID : this.TaskViewObj.Task_Txn_ID,
        Budget_Group_Name : this.TaskViewObj.Budget_Group_Name,
        Work_Type_Name : this.TaskViewObj.Work_Type_Name,
        Summary_Task : this.TaskViewObj.Summary_Task,
        Task_Name : this.TaskViewObj.Task_Name,
        Job_Name : this.TaskViewObj.Job_Name,
        Doc_ID : this.TaskViewObj.Doc_ID,
        User_ID : this.TaskViewObj.User_ID,
        Job_ID : this.TaskViewObj.Job_ID,
        Remarks : this.Remark,
        Status  : this.TaskStatus
      }
      const obj = {
        "SP_String": "SP_Task_GNATT",
        "Report_Name_String": "Update_Remarks_Task",
        "Json_Param_String": JSON.stringify([tempSaveData])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("Update Data",data);
        if(data[0].message === "Update done"){
          this.SpinnerTask = false;
          this.taskUpdate = false;
          this.SearchTaskList(true)
          this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Status",
              detail: "Succesfully Update"
            });
        }
        else {
          this.SpinnerTask = false;
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
  }
  GetDist() {
   let DDistStatus= [];
    this.DistStatus = [];
    this.SelectedStatus = [];
    this.BackUptaskData.forEach((item) => {
      if (DDistStatus.indexOf(item.Task_Status) === -1) {
        DDistStatus.push(item.Task_Status);
          this.DistStatus.push({label: item.Task_Status,value: item.Task_Status});
      }
    });
    this.taskData = [...this.BackUptaskData];
  }
  FilterDist() {
    let DDistStatus= [];
    let searchFields = [];
    if (this.SelectedStatus.length) {
      searchFields.push('Task_Status');
      DDistStatus = this.SelectedStatus;
    }
    
    this.taskData = [];
    if (searchFields.length) {
      let LeadArr = this.BackUptaskData.filter(function (e) {
        return (DDistStatus.length ? DDistStatus.includes(e['Task_Status']) : true)
      });
      this.taskData = LeadArr.length ? LeadArr : [];
    } else {
      this.taskData = this.BackUptaskData;
    }
  }
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.req_date_B = dateRangeObj[0];
      this.req_date2 = dateRangeObj[1];
    }
  }
}
