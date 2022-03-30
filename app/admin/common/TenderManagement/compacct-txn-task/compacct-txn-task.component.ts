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
import { SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-compacct-txn-task',
  templateUrl: './compacct-txn-task.component.html',
  styleUrls: ['./compacct-txn-task.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctTxnTaskComponent implements OnInit {
  data:Object[];
  BackupBrowseTask = [];
  taskSettings = {
    id: 'Task_ID',
    name: 'Task_Name',
    startDate: 'Task_Start_Date',
    endDate: 'Task_Target_Date',
    duration: 'Duration',
    progress: 'Progress',
    dependency: 'Predecessor',
    child: 'subtasks'
};
public selectionSettings2:SelectionSettingsModel;
public splitterSettings: object;
public toolbar: any[];
public gridLines: string;
public columns: object[];



ProjectList = [];
SiteList =[];

ObjProjectTask = new ProjectTask();
ObjTask = new Task();
ObjTaskRemarks = new TaskRemarks();
ProjectTaskSubmitted = false;

TaskModalFlag = false;
TaskSubmitted = false;
TaskSubmitSpinner = false;
TaskList = [];
SubTaskList = [];
AssignToList = [];
TaskStartDate = new Date();
TaskEndtDate = new Date();

TaskRemarksSubmitted = false;
TaskRemarksSubmitSpinner = false;
TaskRemarksList = [];

TaskDisabledFlag = false;
TaskRemarksDisabledFlag = false;
TaskEditFlag = false;

CreateLightBoxSubmitted = false;
LightBoxSpinner = false;
TaskNameModel = undefined;
TaskWaitageModel = undefined;
SubTaskNameModel = undefined;
SubTaskWaitageModel = undefined;
TaskModaLStyleObj = { width: '62%', minWidth: '200px' };


TaskCreateList = [];
TaskEditModalFlag = false;

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
     this.gridLines = 'Both';
     this.columns =  [
      { field: 'Task_ID', visible : false },
      { field: 'Task_Name', headerText: 'Name'},
      { field: 'Task_Start_Date', headerText: 'Start Date'}, 
      { field: 'Remarks', headerText: 'Remarks'},     
      { field: 'Duration', headerText: 'Duration'  },
  ];
     this.selectionSettings2 = {
      type: 'Single',
      mode: 'Row'
    };
    this.splitterSettings = {
      columnIndex: 3
    };
    this.toolbar = [ 'ExpandAll', 'CollapseAll','ExcelExport',
    {text: '', tooltipText: 'ADD TASK', id: 'createTask', prefixIcon: 'e-add', align:'Right'}];
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
      const tempArr = this.ProjectList.filter(i=> Number(i.Project_ID) === Number(this.ObjProjectTask.Project_ID))
      this.ObjProjectTask.Project_Name = tempArr.length ? tempArr[0].label : undefined;
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get_Site_For_Project_Planning",
        "Json_Param_String": JSON.stringify([{ 'Project_ID': this.ObjProjectTask.Project_ID, 'Tender_Doc_ID' : tempArr[0].Tender_Doc_ID }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
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
      this.GetGanttTaskList();
      this.ObjProjectTask.Site_Name = this.SiteList.filter(i=> Number(i.Site_ID) === Number(this.ObjProjectTask.Site_ID))[0].label;
      const obj = {
        "SP_String": "SP_Task_Management_Tender",
        "Report_Name_String": "Get_Task_with_Site",
        "Json_Param_String": JSON.stringify([{ 'Site_ID': this.ObjProjectTask.Site_ID }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
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
   // 
   AddTask(valid) {
    this.TaskSubmitted = true;
     if(valid && this.CheckTaskValid()) {
      this.ObjTask.Task_Start_Date = this.DateService.dateConvert(new Date(this.TaskStartDate));
      this.ObjTask.Task_Target_Date = this.DateService.dateConvert(new Date(this.TaskEndtDate));
      this.ObjTask.Posted_ON = this.DateService.dateConvert(new Date());
      this.ObjTask.Posted_By = this.commonApi.CompacctCookies.User_ID;
      this.ObjTask.Assign_To_Name = this.AssignToList.filter(e=> Number(e.User_ID) === Number(this.ObjTask.User_ID))[0].Name;
      this.ObjTask.Sub_Task_Name = this.SubTaskList.filter(e=> Number(e.Sub_Task_ID) === Number(this.ObjTask.Sub_Task_ID))[0].label;
      const taskID = this.ObjTask.Task_ID;
      const dOCID = this.ObjTask.Doc_ID;
      const JSONobj = {...this.ObjTask,...this.ObjProjectTask};
      this.TaskCreateList.push(JSONobj);
      this.ObjTask = new Task();
      this.ObjTask.Task_ID = taskID;
      this.ObjTask.Doc_ID = dOCID;
      this.TaskSubmitted = false;
      this.TaskStartDate = new Date();
      this.TaskEndtDate = new Date();
     }
   }
   DeleteTask(k) {
    this.TaskCreateList.splice(k,1);
  }
  CheckTaskValid(){
    let flag = true;
    for (let i = 0; i < this.TaskCreateList.length; i += 1) {
      if(Number(this.ObjTask.Sub_Task_ID) === Number(this.TaskCreateList[i].Sub_Task_ID) && Number(this.ObjTask.User_ID) === Number(this.TaskCreateList[i].User_ID)) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "warn",
          summary: "Validation",
          detail: "Sub Task already Assigned."
        });
        flag = false;
        break;
      }
    }
    return flag;
  }

  EditTask(obj) {
    if(obj.Doc_ID) {
      const TaskArr = this.BackupBrowseTask.filter(e => e.Doc_ID === obj.Doc_ID);
      const taskID = this.ObjTask.Task_ID;
      const dOCID = this.ObjTask.Doc_ID;
      this.ObjTask = new Task();
      this.ObjTask.Task_ID = taskID;
      this.ObjTask.Doc_ID = dOCID;
      this.TaskSubmitted = false;

      this.ObjTask = {...TaskArr[0]};
      this.TaskStartDate = new Date(TaskArr[0].Task_Start_Date);
      this.TaskEndtDate = new Date(TaskArr[0].Task_Target_Date);
      this.TaskEditModalFlag = true;
    }
  }
  CloseTaskEditModal(){
    const taskID = this.ObjTask.Task_ID;
      const dOCID = this.ObjTask.Doc_ID;
      this.ObjTask = new Task();
      this.ObjTask.Task_ID = taskID;
      this.ObjTask.Doc_ID = dOCID;
      this.TaskStartDate = new Date();
      this.TaskEndtDate = new Date();
    this.TaskEditModalFlag = false;
  }
  sss(e){
    console.log(e);
  }
  // GANTT 
  GetGanttTaskList(id?) {
    if(this.ObjProjectTask.Project_ID && this.ObjProjectTask.Site_ID) {
     const JSONobj = {
      Project_ID : this.ObjProjectTask.Project_ID,
      Site_ID : this.ObjProjectTask.Site_ID,
      User_ID : this.commonApi.CompacctCookies.User_ID
     }
     const obj = {
      "SP_String": "SP_Task_Management_Tender",
      "Report_Name_String": "Get_TASK_Browse",
      "Json_Param_String": JSON.stringify([JSONobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log(data)
      this.BackupBrowseTask = data;
      const tree = this.ListToTree(data);
      this.data = tree;
      if(id) {
        this.OpenTaskModalForEdit(id);
      }
      console.log(tree)
    })
    }
  }
  ListToTree(list) {
    var dup = [], childroot = [], roots = [], i;
    for (i = 0; i < list.length; i += 1) {
      list[i]['U_id'] = this.broofa();
      if(dup.indexOf(list[i].Doc_ID) === -1) {
        dup.push(list[i].Doc_ID);
        const obj = {
          Task_ID: list[i].Doc_ID,
          Task_Name: list[i].Task_Name,
          StartDate: new Date(list[i].Task_Start_Date),
          EndDate: new Date(list[i].Task_Target_Date),
          Task_Txn_ID : list[i].Task_Txn_ID,
          U_id : list[i].U_id,
          Remarks : list[i].Remarks,
          isSubTask : false,
          subtasks : []
        } 
        roots.push(obj);
      }
      
    }
    
    const options = list.map(function(row) {  
      return {isSubTask : true ,Remarks : row.Remarks ,Task_Name : row.Task_Subject ,U_id : row.U_id ,Task_ID : row.Doc_ID, Task_Start_Date : row.Task_Start_Date ,Task_Target_Date : row.Task_Target_Date , }
   })
    for (i = 0; i < roots.length; i += 1) {
      const taskId = roots[i]['Task_ID'];
      if(taskId) {
        roots[i]['subtasks'] = options.filter(e=> Number(e.Task_ID) === Number(taskId));
      }
     }
    return roots;
  }
  broofa() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  }
  public GetSelectedRow(args: any) {
    console.log(args)
    this.TaskCreateList = [];
    if (args.Task_ID) {
      const UId = args.Task_ID;
      this.OpenTaskModalForEdit(UId);
    }
  }
  public toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'ganttDefault_excelexport') {
        this.ganttObj.excelExport();
    } 
    if (args.item.id === 'createTask') {
      this.OpenTaskModal()
  } 
  };
  OpenTaskModal() {
    this.TaskCreateList =[];
    if(this.ObjProjectTask.Project_ID && this.ObjProjectTask.Site_ID) {
      this.TaskSubmitSpinner = false;
      this.ObjTask = new Task();
      this.TaskStartDate = new Date();
      this.TaskEndtDate = new Date();
      this.TaskRemarksDisabledFlag = true;
      this.TaskDisabledFlag = false;
      this.TaskSubmitted = false;
      this.TaskEditFlag = false;
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
  OpenTaskModalForEdit(DocID) {
    this.TaskSubmitSpinner = false;
    this.ObjTask = new Task();
    this.TaskStartDate = new Date();
    this.TaskEndtDate = new Date();
    this.TaskSubmitted = false;    
    this.TaskEditFlag = true;
    this.ObjTaskRemarks = new TaskRemarks();
    this.TaskRemarksSubmitted = false;
    this.TaskRemarksSubmitSpinner = false;
    this.TaskRemarksList = [];
    this.TaskCreateList = [];
    if(DocID) {
      const TaskArr = this.BackupBrowseTask.filter(e => e.Doc_ID === DocID);
      TaskArr.forEach(e=> {
        e.Task_Start_Date = this.DateService.dateConvert(new Date(e.Task_Start_Date)); 
        e.Task_Target_Date = this.DateService.dateConvert(new Date(e.Task_Target_Date)); 
        e.Posted_ON = this.DateService.dateConvert(new Date(e.Posted_ON)); 
      });
      this.ObjTask.Doc_ID  = TaskArr[0].Doc_ID;
      this.ObjTask.Task_ID  = TaskArr[0].Task_ID;
      this.GetSubTask();
      this.TaskCreateList = [...TaskArr];
      this.TaskModalFlag = true;
    }
  }
  // Task Edit
  GetRemarksTask() {
    this.TaskRemarksList = [];
    if(this.ObjTaskRemarks.Task_Txn_ID) {
      const JSONobj = {
        Task_Txn_ID : this.ObjTaskRemarks.Task_Txn_ID,
       }
       const obj = {
        "SP_String": "SP_Task_Management_Tender",
        "Report_Name_String": "Get_Remarks_Task",
        "Json_Param_String": JSON.stringify([JSONobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.TaskRemarksList = data;        
        console.log(data)
      })
    }
  }

  // Task
  GetSubTask(id?) {
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
          data.forEach(el => {
            el['label'] = el.Sub_Task_Name;
            el['value'] = el.Sub_Task_ID;
          });
          this.SubTaskList = data;
          this.ObjTask.Sub_Task_ID = id ? id : undefined;
        });
    }
  } 
  SaveTask() {
    if(this.TaskCreateList.length) {
      this.TaskSubmitSpinner = true;
      const obj = {
        "SP_String": "SP_Task_Management_Tender",
        "Report_Name_String": "New_Task_Create",
        "Json_Param_String": JSON.stringify(this.TaskCreateList)
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.ObjTask = new Task();
          this.TaskCreateList =[];
          this.TaskStartDate = new Date();
          this.TaskEndtDate = new Date();
          this.TaskSubmitted = false;
          this.TaskModalFlag = false;
          this.TaskSubmitSpinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Success",
            detail: "Succesfully Created"
          });
          this.GetGanttTaskList();
        } else {
          this.TaskSubmitSpinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      });
    } else{      
      this.TaskSubmitted = true;
    }
  }
  UpdateTask(valid) {
    this.TaskSubmitted = true;
    if(valid) {
      this.ObjTask.Task_Start_Date = this.DateService.dateConvert(new Date(this.TaskStartDate));
      this.ObjTask.Task_Target_Date = this.DateService.dateConvert(new Date(this.TaskEndtDate));
      this.ObjTask.Posted_ON = this.DateService.dateConvert(new Date());
      this.ObjTask.Posted_By = this.commonApi.CompacctCookies.User_ID;
      const obj = {
        "SP_String": "SP_Task_Management_Tender",
        "Report_Name_String": "Edit_Task",
        "Json_Param_String": JSON.stringify([this.ObjTask])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].message) {
          const taskID = this.ObjTask.Task_ID;
          const dOCID = this.ObjTask.Doc_ID;
          this.ObjTask = new Task();
          this.ObjTask.Task_ID = taskID;
          this.ObjTask.Doc_ID = dOCID;
          this.TaskCreateList =[];
          this.TaskStartDate = new Date();
          this.TaskEndtDate = new Date();
          this.TaskSubmitted = false;
          this.TaskEditModalFlag = false;
          this.TaskSubmitSpinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Success",
            detail: "Succesfully Created"
          });
          this.GetGanttTaskList(dOCID);
        } else {
          this.TaskSubmitSpinner = false;
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
  SaveTaskRemarks(valid) {
    this.TaskRemarksSubmitted = true;
    if(valid) {
      this.TaskRemarksSubmitSpinner = true;
      this.ObjTaskRemarks.User_ID = this.commonApi.CompacctCookies.User_ID;
      const obj = {
        "SP_String": "SP_Task_Management_Tender",
        "Report_Name_String": "Update_Remarks_Task",
        "Json_Param_String": JSON.stringify([this.ObjTaskRemarks])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].message) {
          this.ObjTaskRemarks = new TaskRemarks();
          this.TaskRemarksSubmitted = false;
          this.TaskModalFlag = false;
          this.TaskRemarksSubmitSpinner = false;
         // this.GetRemarksTask();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Success",
            detail: "Succesfully Created"
          });
        } else {
          this.TaskSubmitSpinner = false;
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
  Doc_ID = '0';
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
  Assign_To_Name:string;
  Sub_Task_Name:string;
} 
class TaskRemarks{
  Task_Txn_ID:string;      
  User_ID:string;     	  
  Status:string;  
  Remarks:string;
}