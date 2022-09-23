import {
  HttpClient
} from '@angular/common/http';
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  MessageService
} from 'primeng/api';
import {
  DateTimeConvertService
} from '../../../shared/compacct.global/dateTime.service';
import {
  CompacctCommonApi
} from '../../../shared/compacct.services/common.api.service';
import {
  CompacctHeader
} from '../../../shared/compacct.services/common.header.service';
import {
  CompacctGetDistinctService
} from '../../../shared/compacct.services/compacct-get-distinct.service';
import {
  CompacctGlobalApiService
} from '../../../shared/compacct.services/compacct.global.api.service';
import {
  Gantt
} from '@syncfusion/ej2-gantt';
import {
  ClickEventArgs
} from '@syncfusion/ej2-navigations';
import {
  ToolbarItem,
  GanttComponent,
  EditSettingsModel
} from '@syncfusion/ej2-angular-gantt';
import {
  PdfExportProperties,
  SelectionSettingsModel
} from '@syncfusion/ej2-angular-grids';

import { NgxUiLoaderService } from "ngx-ui-loader";
import { Console } from 'console';
@Component({
  selector: 'app-compacct-txn-task-gantt',
  templateUrl: './compacct-txn-task-gantt.component.html',
  styleUrls: ['./compacct-txn-task-gantt.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctTxnTaskGanttComponent implements OnInit {

  data: Object[];
  BackupBrowseTask = [];
  taskSettings = {
    id: 'Task_ID',
    name: 'Task_Name',
    startDate: 'Task_Start_Date',
    endDate: 'Task_Target_Date',
    duration: 'Duration',
    dependency: 'dependency',
    child: 'subtasks'
  };
  public selectionSettings2: SelectionSettingsModel;
  public splitterSettings: object;
  public toolbar: any[];
  public gridLines: string;
  public columns: object[];



  ProjectList = [];
  SiteList = [];

  ObjProjectTask = new ProjectTask();
  ObjTask = new Task();
  ObjTaskRemarks = new TaskRemarks();
  ProjectTaskSubmitted = false;

  TaskModalFlag = false;
  TaskSubmitted = false;
  TaskSubmitSpinner = false;

  GroupNameList = [];
  TypeofWorkList = [];
  SummaryList = [];
  DependencyList = [];
  TaskList = [];
  SubTaskList = [];
  AssignToList = [];
  ExpectBillType = [];
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
  TypeOfWorkModel = undefined;
  SummaryTaskModel = undefined;
  TaskModaLStyleObj = {
    width: '72%',
    minWidth: '200px'
  };


  TaskCreateList = [];
  TaskEditModalFlag = false;

  ObjProdPlan = new ProdPlan();
  PlanedProductList = [];

  AddedPlanedProductList = [];
  PlanedProductFormSubmit = true;
  PlanedProductSpinner = false;
  ProductList = [];

  
  siteSubmitted = false;
  siteCreate = undefined;
  siteModal = false;
  Spinnersite = false;
  labelSettings:any;
  dayWorkingTime:any;

  ViewSiteModal = false;
  Siteid = undefined;
  
  public selectionSettings: SelectionSettingsModel;
  TaskViewObj:any = {};
  taskUpdate = false;
  updateDataList = [];
  EditTaskDateModal = false;
  TaskDateEditObj = new tasskDate();
  TaskEditFormSubmit = false;
  SpinnerEditDate = false;
  EditTaskPlannedStartDate = new Date();
  EditTaskPlannedEndtDate = new Date();
  @ViewChild('gantt', {
    static: true
  })
  public ganttObj: GanttComponent;
  constructor(private $http: HttpClient,
    public commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems: CompacctGetDistinctService,
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService) {
    this.ExpectBillType = [{
        label: 'YES',
        value: 'Y',
        icon: 'fa fa-fw fa-check'
      },
      {
        label: 'NO',
        value: 'N',
        icon: 'fa fa-fw fa-remove'
      },
    ];
  }
  
  ngOnInit() {
    
    this.dayWorkingTime = [{ from: 0, to: 24 }]; 
    this.gridLines = 'Both';
    this.columns = [{
        field: 'Task_ID',
        visible: false
      },
      {
        field: 'Task_Name',
        headerText: 'Name'
      },
      {
        field: 'Task_Start_Date',
        headerText: 'Start Date'
      },
      {
        field: 'Remarks',
        headerText: 'Remarks'
      },
      {
        field: 'Duration',
        headerText: 'Duration'
      },
    ];
    this.selectionSettings2 = {
      type: 'Single',
      mode: 'Row'
    };
    this.splitterSettings = {
      columnIndex: 3
    };
    this.toolbar = ['ExpandAll', 'CollapseAll', 'ExcelExport',
      {
        text: '',
        tooltipText: 'ADD TASK',
        id: 'createTask',
        prefixIcon: 'e-add',
        align: 'Right'
      }
    ];
    this.labelSettings = {
      taskLabel: 'Job_Name',
  };
  this.selectionSettings = {
    mode: 'Row',
    type: 'Single',
};
  this.Header.pushHeader({
    Header: "Project Planing",
    Link: "Project Management -> Project Planing"
  });
    this.ganttObj.timelineSettings.bottomTier.format = 'dd';
    this.GetProject();
    this.GetUserList();

    this.GetTask();
    this.GetSubTask();
    this.GetTypeofWorkList();
    this.GetSummaryList();
  }
  disableCreateBtn(): void {
    if(this.commonApi.CompacctCookies.User_Type == 'U'){
      this.ganttObj.toolbarModule.enableItems(['createTask'], false);
    }
  }
  rowSelected(e){
    console.log(e)
    this.ViewTaskStatus(e.data.taskData)
  }
  ViewTaskStatus(obj:any){
    console.log(obj);
    this.updateDataList = [];
    this.TaskViewObj = {};
   if(obj.isSubTask){
    this.ngxService.start();
    this.TaskViewObj = obj;
    this.getUpdatedataList(obj.Task_Txn_ID);
    console.log(this.TaskViewObj);
    setTimeout(() => {
      this.taskUpdate = true;
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
        this.ngxService.stop();
      })
    }
  }
  public queryTaskbarInfo(args: any) { 
    const color = this.GetClassName(args.data);
    args.taskbarBgColor = color; 
    args.progressBarBgColor = color;
    this.ganttObj.scrollToDate(new Date().toLocaleDateString());
    this.disableCreateBtn();
  } 
  GetClassName(data) {
    const status = data.taskData.Task_Status;
    const endDate = new Date(data.taskData.EndDate);
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
  }
  
  GetUserList() {
    this.$http.get('/Master_User/Get_All_Data').subscribe((data: any) => {
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
  OnProjectChange() {
    this.ObjProjectTask.Site_Name = undefined;
    if (this.ObjProjectTask.Site_ID) {
      this.GetBOM();
      this.GetGanttTaskList();
      this.ObjProjectTask.Site_Name = this.SiteList.filter(i => Number(i.Site_ID) === Number(this.ObjProjectTask.Site_ID))[0].label;
     
    }
  
  }

  GetGroupNameList() {
    this.GroupNameList = [];
    if (this.ObjProjectTask.Tender_Doc_ID) {
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_Bill_Planning",
        "Report_Name_String": "Get_Group_with_Tender_Doc_ID",
        "Json_Param_String": JSON.stringify([{
          'Tender_Doc_ID': this.ObjProjectTask.Tender_Doc_ID
        }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          data.forEach(el => {
            el['label'] = el.Budget_Group_Name;
            el['value'] = el.Budget_Group_ID;
          });
          this.GroupNameList = data;

        });
    }
  }
  GetSiteList() {
    this.SiteList = [];
    this.ObjProjectTask.Site_ID = undefined;
    this.ObjProjectTask.Project_Name = undefined;
    this.ObjProjectTask.Tender_Doc_ID = undefined;
    if (this.ObjProjectTask.Project_ID) {
      const tempArr = this.ProjectList.filter(i => Number(i.Project_ID) === Number(this.ObjProjectTask.Project_ID))
      this.ObjProjectTask.Project_Name = tempArr.length ? tempArr[0].label : undefined;
      this.ObjProjectTask.Tender_Doc_ID = tempArr.length ? tempArr[0].Tender_Doc_ID : undefined;
      this.GetGroupNameList();
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get_Site_For_Project_Planning",
        "Json_Param_String": JSON.stringify([{
          'Project_ID': this.ObjProjectTask.Project_ID,
          'Tender_Doc_ID': this.ObjProjectTask.Tender_Doc_ID
        }])
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
  // View Site
  ViewSite(){
    this.SiteList = [];
    this.GetSiteList();
    setTimeout(() => {
      this.ViewSiteModal = true;
    }, 300);
  }
  deleteSite(siteid){
    this.Siteid = undefined;
    if(siteid.Site_ID){
      this.Siteid = siteid.Site_ID;
     // this.cnfrm2_popup = true;
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
      const obj = {
        "SP_String": "SP_Tender_Management_All_Delete_Dropdown",
        "Report_Name_String" : "Delete_Site_FOR_Project_Planing",
        "Json_Param_String": JSON.stringify([{Site_ID: this.Siteid}]),
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        var msg = data[0].Column1;
        if (data[0].Column1) {
        // this.onReject();
        //this.GetTenderOrgList();
        this.GetSiteList();
         this.compacctToast.clear();
         this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: msg
          });
            //this.SearchTender(true);
        }
      });
    //}
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  DynamicRedirectTo() {
    window.open("/Project_Estimate?from=tenderESTIMATE", "_blank")
  }
  AddDaysToDate(date, numberOfDaysToAdd) {
    const someDate = new Date(date);
    let result = someDate.setDate(someDate.getDate() + Number(numberOfDaysToAdd - 1));
    return new Date(result);
  }
  

  EditTask(obj) {
    if (obj.Doc_ID) {
      const TaskArr = this.BackupBrowseTask.filter(e => e.U_id === obj.U_id);
      const dOCID = TaskArr[0].Doc_ID;
      this.ObjTask = new Task();
      this.ObjTask.Doc_ID = dOCID;
      this.TaskSubmitted = false;
      this.ObjTask = {
        ...TaskArr[0]
      };
      console.log(this.ObjTask)
      if(TaskArr[0].Dependency_Job_ID && TaskArr[0].Dependency_Relationship){
        this.ObjTask.Dependency_Required = 'Y';
        this.ObjTask.Dependency_Job_ID = TaskArr[0].Dependency_Job_ID.toString();
      }
      if(TaskArr[0].Waitage_Field && TaskArr[0].Waitage_Value){
        this.ObjTask.Expect_Billing = 'Y';
      }
    //  this.ObjTask.Work_Type_ID = TaskArr[0].Work_Type_ID.toString();
      this.TaskStartDate = new Date(this.ObjTask.Planned_Start_Date);
      this.ObjTask.Assign_To_Name = this.AssignToList.filter(e => Number(e.User_ID) === Number(this.ObjTask.User_ID))[0].Name;
      this.ObjTask.Job_Name = this.SubTaskList.filter(e => Number(e.Job_ID) === Number(this.ObjTask.Job_ID))[0].label;
     
      console.log(this.ObjTask)
      this.TaskEditModalFlag = true;
    }
  }
  CloseTaskEditModal() {
    
    const dOCID = this.ObjTask.Doc_ID;
    this.ObjTask = new Task();
    this.ObjTask.Doc_ID = dOCID;
    this.TaskStartDate = new Date();
    this.TaskEndtDate = new Date();
    this.TaskEditModalFlag = false;
  }
  sss(e) {
    console.log(e);
  }

  // EDIT TASK PLANNED DATE 
  EditTaskDate(obj) {
    this.TaskDateEditObj = new tasskDate();
    this.TaskEditFormSubmit = false;
    this.SpinnerEditDate = false;
    this.EditTaskPlannedStartDate = new Date();
    this.EditTaskPlannedEndtDate = new Date();
    if(obj.Task_Txn_ID) {
      this.EditTaskPlannedStartDate = new Date(obj.Planned_Start_Date);
      this.EditTaskPlannedEndtDate =new Date(obj.Planned_End_Date);
      this.TaskDateEditObj.Task_Txn_ID = obj.Task_Txn_ID;
      this.TaskDateEditObj.Planned_Start_Date = obj.Planned_Start_Date;
      this.TaskDateEditObj.Planned_End_Date =obj.Planned_End_Date;
      this.EditTaskDateModal= true;
    }
  }
  UpdateEditTaskDate(valid) {
    this.TaskEditFormSubmit = true;
    if (valid && this.TaskDateEditObj.Task_Txn_ID) {
      this.SpinnerEditDate = true;
      this.TaskDateEditObj.Planned_Start_Date = this.DateService.dateConvert(new Date(this.EditTaskPlannedStartDate));
      this.TaskDateEditObj.Planned_End_Date = this.DateService.dateConvert(new Date(this.EditTaskPlannedEndtDate));
      console.log("Site Save Data", this.TaskDateEditObj);
      const obj = {
        "SP_String": "SP_Task_GNATT",
        "Report_Name_String": "Edit_Task_GNATT_Plan_Date_Only",
        "Json_Param_String": JSON.stringify([this.TaskDateEditObj])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log(data)
          if (data[0].message) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Date Updated"
            });
            this.TaskDateEditObj = new tasskDate();
            this.TaskEditFormSubmit = false;
            this.EditTaskDateModal= false;
            this.TaskModalFlag = false;
            this.EditTaskPlannedStartDate = new Date();
            this.EditTaskPlannedEndtDate = new Date();     
            this.GetGanttTaskList();
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
            this.SpinnerEditDate = false;
          }
        });
    }
  }

  // SITE CREATE 
  ToggleSite() {
    this.siteSubmitted = false;
    this.siteCreate = undefined;
    this.siteModal = true;
    this.Spinnersite = false;
  }
  CreateSite(valid) {
    this.siteSubmitted = true;
    if (valid && this.ObjProjectTask.Project_Name) {
      this.Spinnersite = true;
      const temp = {
        Tender_Doc_ID: this.ObjProjectTask.Tender_Doc_ID,
        Site_Description: this.siteCreate,
        Budget_Short_Description: this.ObjProjectTask.Project_Name
      }
      console.log("Site Save Data", temp);
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Add Site For Project Planning",
        "Json_Param_String": JSON.stringify([temp])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log(data)
          if (data[0].Site_ID) {
            this.GetSiteList();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Site Created"
            });
            this.siteSubmitted = false;
            this.siteCreate = undefined;
            this.siteModal = false;
            this.Spinnersite = false;
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
            this.Spinnersite = false;
          }
        });
    }
  }

  // GANTT 
  GetGanttTaskList(id ? ) {
    if (this.ObjProjectTask.Project_ID && this.ObjProjectTask.Site_ID) {
      const JSONobj = {
        Project_ID: this.ObjProjectTask.Project_ID,
        Site_ID: this.ObjProjectTask.Site_ID,
        User_ID: this.commonApi.CompacctCookies.User_ID
      }
      const obj = {
        "SP_String": "SP_Task_GNATT",
        "Report_Name_String": "Get_GNATT_TASK_Browse",
        "Json_Param_String": JSON.stringify([JSONobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log('Full Raw',data)
        this.BackupBrowseTask = data;
        const tree = this.ListToTree(data);
        this.data = tree;
        if (id) {
          this.OpenTaskModalForEdit(id);
        }
      })
    }
  }
  ListToTree(list) {
    var dup = [],
      childroot = [],
      roots = [],
      i,
      slno = 0;
      this.DependencyList = [];
    for (i = 0; i < list.length; i += 1) {
      list[i]['U_id'] = this.broofa();
      this.DependencyList.push({
        value : list[i].SL_ID,
        label : `${list[i].Work_Type_Name} - 
        ${list[i].Budget_Group_Name} -
        ${list[i].Summary_Task} -
        ${list[i].Task_Name} -
        ${list[i].Job_Name}`,
      })
      if (dup.indexOf(list[i].Doc_ID) === -1) {
        slno = slno + 1;
        dup.push(list[i].Doc_ID);
        const obj = {
          Sl_No : slno,
          Task_ID: list[i]['U_id'],
          Doc_ID: list[i].Doc_ID,
          Task_Name: list[i].Task_Name,
          Work_Type_Name: list[i].Work_Type_Name,
          No_Of_Days: list[i].No_Of_Days,
          Budget_Group_Name: list[i].Budget_Group_Name,
          Summary_Task: list[i].Summary_Task,
          Job_Name: list[i].Job_Name,
          Task_Start_Date: new Date(list[i].Planned_Start_Date),
          Task_Target_Date: new Date(list[i].Planned_End_Date),
          StartDate: new Date(list[i].Planned_Start_Date),
          EndDate: new Date(list[i].Planned_End_Date),
          Task_Txn_ID: list[i].Task_Txn_ID,
          U_id: list[i].U_id,
          Remarks: list[i].Latest_Task_Remarks,
          Task_Status: list[i].Task_Status,
          isSubTask: false,
          subtasks: []
        }
        roots.push(obj);
      }

    }
    const options = list.map(function (row) {
      return {
        isSubTask: true,
        Remarks: row.Latest_Task_Remarks,
        Task_Name: row.Task_Name,
        U_id: row.U_id,
        Task_ID: row.SL_ID,
        Doc_ID: row.Doc_ID,
        Task_Start_Date:  new Date(row.Planned_Start_Date),
        Task_Target_Date:  new Date(row.Planned_End_Date),
        StartDate: new Date(row.Planned_Start_Date),
        EndDate: new Date(row.Planned_End_Date),
        Work_Type_Name: row.Work_Type_Name,
        No_Of_Days: row.No_Of_Days,
        Budget_Group_Name: row.Budget_Group_Name,
        Summary_Task: row.Summary_Task,
        Job_Name: row.Job_Name,
        Sl_No: undefined,
        SL_ID: row.SL_ID,
        Task_Status: row.Task_Status,
        Dependency_Job_ID:row.Dependency_Job_ID,
        Dependency_Relationship: row.Dependency_Relationship,
        Task_Txn_ID: row.Task_Txn_ID,
        Latest_Task_Remarks : row.Latest_Task_Remarks
      }
    })
    for (i = 0; i < roots.length; i += 1) {
      const taskId = roots[i]['Doc_ID'];
      if (taskId) {
        const subtask = options.filter(e => Number(e.Doc_ID) === Number(taskId));
        subtask.forEach((obj,i2)=>{
          obj.Sl_No = undefined;
          if(obj.Dependency_Job_ID && obj.Dependency_Relationship){
            obj['dependency'] = obj.Dependency_Job_ID.toString()+obj.Dependency_Relationship;
          }
          obj.Sl_No = roots[i].Sl_No.toString() +'.'+ (i2+1).toString();
        })
        roots[i]['subtasks'] = subtask;
      }
    }
    console.log('tree',roots)
    return roots;
  }
  broofa() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
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
    this.TaskCreateList = [];
    if (this.ObjProjectTask.Project_ID && this.ObjProjectTask.Site_ID) {
      this.TaskSubmitSpinner = false;
      this.ObjTask = new Task();
      this.ObjProdPlan = new ProdPlan();
      this.ObjProdPlan.Project_ID = this.ObjProjectTask.Project_ID;
      this.ObjProdPlan.Site_ID = this.ObjProjectTask.Site_ID;
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
  OpenTaskModalForEdit(U_id) {
    this.TaskSubmitSpinner = false;
    this.ObjTask = new Task();
    this.ObjProdPlan = new ProdPlan();
    this.TaskStartDate = new Date();
    this.TaskEndtDate = new Date();
    this.TaskSubmitted = false;
    this.TaskEditFlag = true;
    this.ObjTaskRemarks = new TaskRemarks();
    this.TaskRemarksSubmitted = false;
    this.TaskRemarksSubmitSpinner = false;
    this.TaskRemarksList = [];
    this.TaskCreateList = [];
    if (U_id) {
      const task = this.BackupBrowseTask.filter(e => e.U_id === U_id);
      const TaskArr = this.BackupBrowseTask.filter(e => e.Doc_ID === task[0].Doc_ID);
      TaskArr.forEach(e => {
        // e.Task_Start_Date = this.DateService.dateConvert(new Date(e.Task_Start_Date));
        // e.Task_Target_Date = this.DateService.dateConvert(new Date(e.Task_Target_Date));
        e.Posted_ON = this.DateService.dateConvert(new Date(e.Posted_ON));
        e.Assign_To_Name = this.AssignToList.filter(o => Number(o.User_ID) === Number(e.User_ID))[0].Name;
        e.Job_Name = this.SubTaskList.filter(o => Number(o.Job_ID) === Number(e.Job_ID))[0].label;
        e.Task_Name = this.TaskList.filter(o => Number(o.Task_ID) === Number(e.Task_ID))[0].label;
        e.Planned_Start_Date = this.DateService.dateConvert(new Date(e.Planned_Start_Date));
        e.Planned_End_Date = this.DateService.dateConvert(new Date(e.Planned_End_Date));
      });
      this.ObjTask.Doc_ID = TaskArr[0].Doc_ID;
      this.ObjProdPlan.Project_ID = this.ObjProjectTask.Project_ID;
      this.ObjProdPlan.Site_ID = this.ObjProjectTask.Site_ID;
     // this.GetSubTask();
     console.log(TaskArr)
      this.TaskCreateList = [...TaskArr];
      this.TaskModalFlag = true;
    }
  }
  // Task Edit
  GetRemarksTask() {
    this.TaskRemarksList = [];
    if (this.ObjTaskRemarks.Task_Txn_ID) {
      const JSONobj = {
        Task_Txn_ID: this.ObjTaskRemarks.Task_Txn_ID,
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

  GetTask() {
  this.TaskList = [];
    const obj = {
      "SP_String": "SP_Task_GNATT",
      "Report_Name_String": "Get_MST_TASK_MAIN",
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
  GetSubTask( ) {
    this.SubTaskList = [];
      const obj = {
        "SP_String": "SP_Task_GNATT",
        "Report_Name_String": "Get_MST_TASK_JOB",
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          data.forEach(el => {
            el['label'] = el.Job_Name;
            el['value'] = el.Job_ID;
          });
          this.SubTaskList = data;
        });
  }
  GetTypeofWorkList() {
    this.TypeofWorkList = [];
    const obj = {
      "SP_String": "SP_Task_GNATT",
      "Report_Name_String": "Get_MST_WORK_TYPE",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      data.forEach(o=> {
        o['label'] = o['Work_Type_Name'];
        o['value'] = o['Work_Type_ID']
      })
      this.TypeofWorkList = data;
      console.log(data)
    })
    
  }
  GetSummaryList() {
    this.SummaryList = [];
    const obj = {
        "SP_String": "SP_Task_GNATT",
        "Report_Name_String": "Get_MST_WORK_SUMMARY_TASK",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      data.forEach(o=> {
        o['label'] = o['Summary_Task'];
        o['value'] = o['Summary_Task_ID']
      })
      this.SummaryList = data;
      console.log(data)
    })
    
  }
  GetDependencyList() {
    this.DependencyList = [];
    if (this.ObjTaskRemarks.Task_Txn_ID) {
      const JSONobj = {
        Task_Txn_ID: this.ObjTaskRemarks.Task_Txn_ID,
      }
      const obj = {
        "SP_String": "SP_Task_Management_Tender",
        "Report_Name_String": "Get_Remarks_Task",
        "Json_Param_String": JSON.stringify([JSONobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.DependencyList = data;
        console.log(data)
      })
    }
  }
  ChangeGroupName() {
    this.ObjTask.Budget_Group_Name = undefined;
    this.ObjProdPlan.Budget_Group_ID = undefined;
    this.ObjProdPlan.Budget_Group_Name = undefined;
    if (this.ObjTask.Budget_Group_ID) {
      const arr = this.GroupNameList.filter(o => o.Budget_Group_ID == this.ObjTask.Budget_Group_ID);
      this.ObjTask.Budget_Group_Name = arr.length ? arr[0].Budget_Group_Name : undefined;
      this.ObjProdPlan.Budget_Group_Name = arr.length ? arr[0].Budget_Group_Name : undefined;
      this.ObjProdPlan.Budget_Group_ID = this.ObjTask.Budget_Group_ID;
    }
  }
  ExpectBillTypeChange(){
    this.ObjTask.Waitage_Field = undefined;
    this.ObjTask.Waitage_Value = undefined;
  }
  DependencyRequiredChange(){
    this.PlanedProductFormSubmit = false;
    this.ObjTask.Dependency_Job_ID = undefined;
    this.ObjTask.Dependency_Relationship = undefined;
  }

  LightBoxSave(field) {
    if (field) {
      let JSONBody = {};
      let refreshFunction;
      if (field === 'Task_Create_Overlay') {
        if (this.TaskNameModel) {
          JSONBody = {
            "SP_String": "SP_Task_GNATT",
            "Report_Name_String": "MST_TASK_MAIN_Create",
            "Json_Param_String": JSON.stringify([{
              Task_Name: this.TaskNameModel,
            }])
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
      if (field === 'Type_Of_Work') {
        if (this.TypeOfWorkModel) {
          JSONBody = {
            "SP_String": "SP_Task_GNATT",
            "Report_Name_String": "MST_WORK_TYPE_Create",
            "Json_Param_String": JSON.stringify([{
              'Work_Type_Name': this.TypeOfWorkModel
            }])
          }
          refreshFunction = 'GetTypeofWorkList';
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "warn",
            summary: "Validation",
            detail: "Type Of Work Required."
          });
          return false;
        }
      }
      if (field === 'Summary_Task') {
        if (this.SummaryTaskModel) {
          JSONBody = {
            "SP_String": "SP_Task_GNATT",
            "Report_Name_String": "MST_WORK_SUMMARY_TASK_Create",
            "Json_Param_String": JSON.stringify([{
              'Summary_Task': this.SummaryTaskModel
            }])
          }
          refreshFunction = 'GetSummaryList';
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "warn",
            summary: "Validation",
            detail: "Summary Task Required."
          });
          return false;
        }
      }
      if (field === 'Sub_Task_Create_Overlay') {
        if (this.SubTaskNameModel) {
          JSONBody = {
            "SP_String": "SP_Task_GNATT",
            "Report_Name_String": "MST_TASK_JOB_Create",
            "Json_Param_String": JSON.stringify([{
              Job_Name: this.SubTaskNameModel,
            }])
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
      if (JSONBody && refreshFunction) {
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
  LightBoxDelete(col,field) {
    if (col && field) {
      let JSONBody = {};
      let refreshFunction;
      if (field === 'Task_Create_Overlay') {
        JSONBody = {
          "SP_String": "SP_Task_GNATT",
          "Report_Name_String": "Delete_MST_TASK_MAIN",
          "Json_Param_String": JSON.stringify([{
            Task_ID: col.Task_ID,
          }])
        }
        refreshFunction = 'GetTask';
      }
      if (field === 'Type_Of_Work') {
          JSONBody = {
            "SP_String": "SP_Task_GNATT",
            "Report_Name_String": "Delete_MST_WORK_TYPE",
            "Json_Param_String": JSON.stringify([{
              'Work_Type_ID': col.Work_Type_ID
            }])
          }
          refreshFunction = 'GetTypeofWorkList';
      }
      if (field === 'Summary_Task') {
          JSONBody = {
            "SP_String": "SP_Task_GNATT",
            "Report_Name_String": "Delete_MST_WORK_SUMMARY_TASK",
            "Json_Param_String": JSON.stringify([{
              'Summary_Task_ID': col.Summary_Task_ID
            }])
          }
          refreshFunction = 'GetSummaryList';
        
      }
      if (field === 'Sub_Task_Create_Overlay') {
          JSONBody = {
            "SP_String": "SP_Task_GNATT",
            "Report_Name_String": "Delete_MST_TASK_JOB",
            "Json_Param_String": JSON.stringify([{
              Job_ID: col.Job_ID,
            }])
          }
          refreshFunction = 'GetSubTask';
      }
      if (JSONBody && refreshFunction) {
        this.LightBoxSpinner = true;
        this.GlobalAPI.getData(JSONBody).subscribe((data: any) => {
          if (data[0].Column1) {
            this.LightBoxSpinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Deleted"
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
              detail: "Error Occured"
            });
          }
        });
      }
    }

  }

  //  ADD TASK
  AddTask(valid) {
    this.TaskSubmitted = true;
    const checkBOM = this.ObjTask.BOM === 'Y' ? (this.AddedPlanedProductList.length) : true;
    if (valid && this.CheckTaskValid() && checkBOM) {
      this.TaskSubmitSpinner = true;
      this.ObjTask.Planned_Start_Date = this.DateService.dateConvert(new Date(this.TaskStartDate));
      const endDate = this.AddDaysToDate(this.TaskStartDate, this.ObjTask.No_Of_Days)
      this.ObjTask.Planned_End_Date = this.DateService.dateConvert(new Date(endDate));
      this.ObjTask.Posted_ON = this.DateService.dateConvert(new Date());
      this.ObjTask.Posted_By = this.commonApi.CompacctCookies.User_ID;
      this.ObjTask.Assign_To_Name = this.AssignToList.filter(e => Number(e.User_ID) === Number(this.ObjTask.User_ID))[0].Name;
      this.ObjTask.Work_Type_Name = this.TypeofWorkList.filter(e => Number(e.Work_Type_ID) === Number(this.ObjTask.Work_Type_ID))[0].label;
      this.ObjTask.Summary_Task = this.SummaryList.filter(e => Number(e.Summary_Task_ID) === Number(this.ObjTask.Summary_Task_ID))[0].label;
      this.ObjTask.Task_Name = this.TaskList.filter(e => Number(e.Task_ID) === Number(this.ObjTask.Task_ID))[0].label;
      this.ObjTask.Job_Name = this.SubTaskList.filter(e => Number(e.Job_ID) === Number(this.ObjTask.Job_ID))[0].label;
     
      const dOCID = this.ObjTask.Doc_ID;
      const JSONobj = {
        ...this.ObjTask,
        ...this.ObjProjectTask
      };
      this.TaskCreateList.push(JSONobj);
      // this.ObjTask = new Task();
      // this.ObjTask.Doc_ID = dOCID;
      // this.TaskSubmitted = false;
      // this.TaskStartDate = new Date();
      // this.TaskEndtDate = new Date();
      this.SaveTask(JSONobj);
      
    }
    if(!checkBOM){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "warn",
        summary: "Validation",
        detail: "BOM Required."
      });
    }
  }
  DeleteTask(k) {
    if(this.TaskCreateList[k]['Task_Txn_ID']){
      if (confirm("Are you sure to Delete?") == true) {
      this.ngxService.start();
      const temp = { "Task_Txn_ID" : this.TaskCreateList[k]['Task_Txn_ID']}
      const obj = {
        "SP_String": "SP_Task_GNATT",
        "Report_Name_String": "Delete_GNATT_TASK",
        "Json_Param_String": JSON.stringify([temp])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].message) {
          this.TaskCreateList.splice(k, 1);        
          this.GetGanttTaskList();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Success",
            detail: "Succesfully Deleted"
          });
          this.ngxService.stop();
        } else {
          this.ngxService.stop();
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
  CheckTaskValid() {
    let flag = true;
    for (let i = 0; i < this.TaskCreateList.length; i += 1) {
      if (Number(this.ObjTask.Job_ID) === Number(this.TaskCreateList[i].Job_ID) && Number(this.ObjTask.User_ID) === Number(this.TaskCreateList[i].User_ID)) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "warn",
          summary: "Validation",
          detail: "Job already Assigned."
        });
        flag = false;
        break;
      }
    }
    return flag;
  }
  // SAVE TASK
  SaveTask(SaveObj) {
    if (SaveObj && SaveObj.Job_Name) {
      const obj = {
        "SP_String": "SP_Task_GNATT",
        "Report_Name_String": "New_Task_GNATT_Create",
        "Json_Param_String": JSON.stringify([SaveObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.ObjTask = new Task();
          this.ObjTask.Doc_ID = data[0].Column1;
         // this.TaskCreateList = [];
          this.TaskStartDate = new Date();
          this.TaskEndtDate = new Date();
          this.TaskSubmitted = false;
        //  this.TaskModalFlag = false;
           this.TaskSubmitted = false;
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
    } else {
      this.TaskSubmitted = true;
    }
  }
  UpdateTask(valid) {
    this.TaskSubmitted = true;
    if (valid) {
      this.ObjTask.Planned_Start_Date = this.DateService.dateConvert(new Date(this.TaskStartDate));
      const endDate = this.AddDaysToDate(this.TaskStartDate, this.ObjTask.No_Of_Days)
      this.ObjTask.Planned_End_Date = this.DateService.dateConvert(new Date(endDate));
      this.ObjTask.Posted_ON = this.DateService.dateConvert(new Date());
      this.ObjTask.Posted_By = this.commonApi.CompacctCookies.User_ID;
      const obj = {
        "SP_String": "SP_Task_GNATT",
        "Report_Name_String": "Edit_Task_GNATT",
        "Json_Param_String": JSON.stringify([this.ObjTask])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].message) {
          
          const dOCID = this.ObjTask.Doc_ID;
          this.ObjTask = new Task();
          this.ObjTask.Doc_ID = dOCID;
          this.TaskCreateList = [];
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
    if (valid) {
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
  // BOM
  
  GetBOM() {
    this.AddedPlanedProductList = [];
    if (this.ObjProjectTask.Project_ID && this.ObjProjectTask.Site_ID && this.ObjTask.Job_ID) {
      const tempObj = {
        'Project_ID': this.ObjProjectTask.Project_ID,
        'Site_ID': this.ObjProjectTask.Site_ID,
        'Job_ID': this.ObjTask.Job_ID
      }
      const obj1 = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_Bill_Planning",
        "Report_Name_String": "Project_Planning_Retrieve_BOM",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj1).subscribe((data: any) => {
        console.log(data)
        if(data.length) {
          this.AddedPlanedProductList = [...data];
        }
      })
    }
  }
  GetProductList() {
    this.ProductList = [];
    this.ObjProdPlan.Product_ID = undefined;
    this.ObjProdPlan.Product_Description = undefined;
    this.ObjProdPlan.Qty = undefined;
    if (this.ObjProdPlan.Type_Of_Product) {
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_Bill_Planning",
        "Report_Name_String": "Get_Product_With_Material_Type_BOM",
        "Json_Param_String": JSON.stringify([this.ObjProdPlan])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          data.forEach(el => {
            el['label'] = el.Product_Description;
            el['value'] = el.Product_ID;
          });
          this.ProductList = data;

        });
    }
  }
  ChangeProduct() {
    this.ObjProdPlan.Product_Description = undefined;
    this.ObjProdPlan.Qty = undefined;
    if (this.ObjProdPlan.Product_ID) {
      const arr = this.ProductList.filter(o => o.Product_ID == this.ObjProdPlan.Product_ID);
      this.ObjProdPlan.Product_Description = arr.length ? arr[0].Product_Description : undefined;
    }
  }
  SaveProductPlanForm() {
    this.PlanedProductFormSubmit = true;
    if (this.ObjTask.Job_ID && this.ObjProdPlan.Product_ID && this.ObjProdPlan.Qty && this.ObjProdPlan.Type_Of_Product) {
      this.PlanedProductSpinner = true;
      this.ObjProdPlan.Job_ID = this.ObjTask.Job_ID;
      const obj2 = {
        ...this.ObjProdPlan
      };
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_Bill_Planning",
        "Report_Name_String":  "Project_Planning_Insert_BOM",
        "Json_Param_String": JSON.stringify(this.ObjProdPlan)
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.PlanedProductFormSubmit = false;
          this.GetBOM();
          this.ObjProdPlan = new ProdPlan();
          this.ObjProdPlan.Project_ID = obj2.Project_ID;
          this.ObjProdPlan.work_name = obj2.work_name;
          this.ObjProdPlan.Site_ID = obj2.Site_ID;
          this.ObjProdPlan.Site_Description = obj2.Site_Description;
          this.ObjProdPlan.Budget_Group_ID = obj2.Budget_Group_ID;
          this.ObjProdPlan.Budget_Group_Name = obj2.Budget_Group_Name;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Tender Doc ID:" + this.ObjProdPlan.Project_ID.toString(),
            detail: "Succesfully Created"
          });
        }
        this.PlanedProductSpinner = false;
      })
    }
  }

}
class ProjectTask {
  Task_Txn_ID: string;
  Task_Type: string;
  Project_ID: string;
  Site_ID: string;
  Project_Name: string;
  Site_Name: string;
  Tender_Doc_ID: string;
}
class Task {
  Doc_ID = '0';
  User_ID: string;
  Remarks: string;
  Planned_End_Date: string;
  Posted_ON: string;
  Posted_By: string;

  Assign_To_Name: string;
  Job_Name: string;

  Budget_Group_Name:string;
  Work_Type_Name: string;
  Summary_Task: string;
  Task_Name: string;

  Task_Txn_ID: string;
  Tender_Doc_ID: string;
  Project_ID: string;
  Site_ID: string;
  Work_Type_ID: string;
  Budget_Group_ID: string;
  Summary_Task_ID: string;
  Task_ID: string;
  Job_ID: string;
  No_Of_Days: string;
  Dependency_Job_ID: string;
  Planned_Start_Date: string;
  Actual_Start_Date: string;
  Expect_Billing = 'N';
  Waitage_Field: string;
  Waitage_Value: string;
  Task_Status: string;
  Actual_Complete_Date: string;
  Dependency_Required = 'N';
  Dependency_Relationship:string;
  BOM = 'N';
}
class TaskRemarks {
  Task_Txn_ID: string;
  User_ID: string;
  Status: string;
  Remarks: string;
}

class ProdPlan {
  Project_ID: String;
  work_name: string;
  Site_ID: string;
  Site_Description: string;
  Budget_Group_ID: string;
  Budget_Group_Name: string;
  Type_Of_Product: string;
  Product_ID: String;
  Product_Description: string;
  Qty: string;
  Job_ID: string;
}
class tasskDate {
  Task_Txn_ID:string;
  Planned_Start_Date:any;
  Planned_End_Date:any;
}