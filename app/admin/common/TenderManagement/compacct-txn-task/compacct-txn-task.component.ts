import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGetDistinctService } from '../../../shared/compacct.services/compacct-get-distinct.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { Gantt } from '@syncfusion/ej2-gantt';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { ToolbarItem,GanttComponent, EditSettingsModel } from '@syncfusion/ej2-angular-gantt';

@Component({
  selector: 'app-compacct-txn-task',
  templateUrl: './compacct-txn-task.component.html',
  styleUrls: ['./compacct-txn-task.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctTxnTaskComponent implements OnInit {
  data:Object[];
  taskSettings = {
    id: 'TaskID',
    name: 'TaskName',
    startDate: 'StartDate',
    endDate: 'EndDate',
    duration: 'Duration',
    progress: 'Progress',
    dependency: 'Predecessor',
    child: 'subtasks'
};
public splitterSettings: object;
public toolbar: any[];



ProjectList = [];
SiteList =[];

ObjProjectTask = new ProjectTask();
ObjTask = new Task();
ProjectTaskSubmitted = false;

TaskModalFlag = false;
TaskSubmitted = false;
TaskList = [];
SubTaskList = [];
AssignToList = [];
TaskStartDate = new Date();
TaskEndtDate = new Date();

CreateLightBoxSubmitted = false;
LightBoxSpinner = false;
TaskNameModel = undefined;
TaskWaitageModel = undefined;
SubTaskNameModel = undefined;
SubTaskWaitageModel = undefined;

@ViewChild('gantt', {static: true})
public ganttObj: GanttComponent;
  constructor(private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems: CompacctGetDistinctService,
    private router : Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.data = [
      {
          TaskID: 1,
          TaskName: 'Project Initiation',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/21/2019'),
          subtasks: [
              {  TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
              { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50  },
              { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
          ]
      },
      {
          TaskID: 5,
          TaskName: 'Project Estimation',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/21/2019'),
          subtasks: [
              { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
              { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
              { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 }
          ]
      },
  ];
  this.splitterSettings = {
    columnIndex: 3
};
this.toolbar = [ 'ExpandAll', 'CollapseAll','ExcelExport',
{text: 'ADD', tooltipText: 'ADD TASK', id: 'createTask', prefixIcon: 'e-plussmall', align:'Right'}];
  this.GetProject();
  this.GetUserList();
  }
  GetUserList() {
    this.$http.get('/Master_User/Get_All_Data').subscribe((data:any)=>{
      this.AssignToList = JSON.parse(data);
    })
  }
  GetProject() {
    const obj = {
      "SP_String": "SP_Task_Management_Tender",
      "Report_Name_String": "Get_Project_All",
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        console.log("project", data)
        data.forEach(el => {
          el['label'] = el.Project_Description;
          el['value'] = el.Project_ID;
        });
        this.ObjProjectTask.Task_Type = 'Project';
        this.ProjectList = data;
      });
  }
  GetSiteList() {
    this.SiteList = [];
    this.ObjProjectTask.Site_ID = undefined;
    this.ObjProjectTask.Project_Name = undefined;
    if (this.ObjProjectTask.Project_ID) {
      this.ObjProjectTask.Project_Name = this.ProjectList.filter(i=> Number(i.Project_ID) === Number(this.ObjProjectTask.Project_ID))[0].label;
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get Site",
        "Json_Param_String": JSON.stringify([{ 'Project_ID': this.ObjProjectTask.Project_ID }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log("site", data)
          data.forEach(el => {
            el['label'] = el.Site_Description;
            el['value'] = el.Site_ID;
          });
          this.SiteList = data;
        });
    }
  }
  GetTask() {
    this.ObjProjectTask.Site_Name = undefined;
    this.TaskList = [];
    if(this.ObjProjectTask.Site_ID) {
      this.ObjProjectTask.Site_Name = this.SiteList.filter(i=> Number(i.Site_ID) === Number(this.ObjProjectTask.Site_ID))[0].label;
      const obj = {
        "SP_String": "SP_Task_Management_Tender",
        "Report_Name_String": "Get_Task_with_Site",
        "Json_Param_String": JSON.stringify([{ 'Site_ID': this.ObjProjectTask.Site_ID }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log("task", data)
          data.forEach(el => {
            el['label'] = el.Task_Name;
            el['value'] = el.Task_ID;
          });
          this.TaskList = data;
        });
    }
  }
  DynamicRedirectTo (){
    window.open("/Project_Estimate?from=tenderESTIMATE","_blank")
  }
// GANTT 
public toolbarClick(args: ClickEventArgs): void {
  if (args.item.id === 'ganttDefault_excelexport') {
      this.ganttObj.excelExport();
  } 
  if (args.item.id === 'createTask') {
    this.OpenTaskModal()
} 
};
OpenTaskModal() {
  if(this.ObjProjectTask.Project_ID && this.ObjProjectTask.Site_ID) {
    this.ObjTask = new Task();
    this.TaskStartDate = new Date();
    this.TaskEndtDate = new Date();
    this.TaskSubmitted = false;
    this.TaskModalFlag = true;
  } else {
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "warn",
      summary: "Validation",
      detail: "Please select Project and Site to create task."
    });
  }
}

  // Task
  GetSubTask() {
    this.SubTaskList = [];
    this.ObjTask.Sub_Task_ID = undefined;
    if (this.ObjTask.Task_ID) {
       const obj = {
        "SP_String": "SP_Task_Management_Tender",
        "Report_Name_String": "Get_Sub_Task_with_Task",
        "Json_Param_String": JSON.stringify([{ 'Task_ID': this.ObjTask.Task_ID }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log("sub task", data)
          data.forEach(el => {
            el['label'] = el.Sub_Task_Name;
            el['value'] = el.Sub_Task_ID;
          });
          this.SubTaskList = data;
        });
    }
  }
  SaveTask(valid) {
    this.ProjectTaskSubmitted = true;
    if(valid) {

    }
  }

  LightBoxSave(field) {
    if(field) {
      let JSONBody = {};
      let refreshFunction;
      if(field === 'Task_Create_Overlay') {
        if(this.TaskNameModel && this.TaskWaitageModel) {          
          JSONBody = {
            "SP_String": "SP_Task_Management_Tender",
            "Report_Name_String": "MST_TASK_Create",
            "Json_Param_String": JSON.stringify([{ Project_ID : this.ObjProjectTask.Project_ID  ,     	  
              Site_ID  :   this.ObjProjectTask.Site_ID, 
              Task_Name : this.TaskNameModel,  
              Waitage_Against_Site : this.TaskWaitageModel   }])
          }
          refreshFunction = 'GetTask';
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "warn",
            summary: "Validation",
            detail: "Task Name and Waitage Required."
          });
          return false;
        }
      }
      if(field === 'Sub_Task_Create_Overlay') {
        if(this.SubTaskNameModel && this.SubTaskWaitageModel && this.ObjTask.Task_ID) {  
        JSONBody = {
          "SP_String": "SP_Task_Management_Tender",
          "Report_Name_String": "MST_SUB_TASK_Create",
          "Json_Param_String": JSON.stringify([{ Project_ID : this.ObjProjectTask.Project_ID  ,     	  
            Site_ID  :   this.ObjProjectTask.Site_ID, 
            Task_ID : this.ObjTask.Task_ID,
            Sub_Task_Name : this.SubTaskNameModel,  
            Waitage_Against_Task : this.SubTaskWaitageModel   }])
        }
        refreshFunction = 'GetSubTask';
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "warn",
          summary: "Validation",
          detail: "Sub Task Name and Waitage Required."
        });
        return false;
      }
      }
      if(JSONBody && refreshFunction) {
        this.LightBoxSpinner = true;
        this.GlobalAPI.getData(JSONBody).subscribe((data: any) => {
          console.log(data)
          if (data[0].Column1) {
            this.LightBoxSpinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Created"
            });
          this[refreshFunction]();
          this.CreateLightBoxSubmitted = false;
          } else {
            this.LightBoxSpinner = false;
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

  }

}
class ProjectTask{
  Task_Txn_ID :string;
  Task_Type :string;
  Project_ID :string;
  Site_ID:string;
  Project_Name :string;
  Site_Name :string;
} 
class Task{
  Task_ID :string;
  Sub_Task_ID :string;
  User_ID :string;
  Task_Subject  :string;
  Remarks :string;
  Posted_ON :string;
  Posted_By :string;
  Task_Start_Date:string;
  Task_Target_Date:string;
  Waitage_Persentage_Against_Sub_Task:string;
  Task_Status :string;
  Actual_Start_Date:string;
  Actual_Complete_Date:string;
} 
