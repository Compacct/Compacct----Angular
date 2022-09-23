import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ProjectDashboardComponent implements OnInit {
  items:any=[]
  tabIndexToView:number = 0
  ProjectList:any = []
  selectedProject:any = {}
  OverdueList:any = []
  bckupOverdueList:any = []
  cols:any = []
  distSite:any = []
  distAssing:any = []
  seleteSite:any = []
  seleteAssing:any = []
  PlanedDaysFilter:any = undefined
  ActualList:any = []
  ActualListheader:any = []
  distSiteActual:any = []
  seleteSiteActual:any = []
  PlanedDaysFilterActual:any =  undefined
  distAssingActual:any = []
  seleteAssingActual:any = []
  distcurrent:any = []
  seleteAssingCurrent:any = []
  distPlanActual:any = []
  seletePlanActual:any = []
  bckUpActualList:any = []
  InflowList:any = []
  Inflowheader:any = []
  costList:any = []
  costListHeader:any = []
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private route: ActivatedRoute,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.items = ["PLANING", "COSTING","BILLING"];
  
    this.Header.pushHeader({
      Header: "Project Dashboard",
      Link: "Harbauer -> Project Dashboard"
    });
    this.getProject()
  }
  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["PLANING", "COSTING","BILLING"];
  }
  PlaningTabClick(e){

  }
  getProject(){
    const obj = {
      "SP_String": "SP_Task_Management_Tender",
      "Report_Name_String": "Get_Project_All",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.ProjectList = data
      console.log("data",data)
    })
  }
  projectChange(){
    if(this.selectedProject){
      const objInflow = {
        "SP_String": "Sp_Project_MIS",
        "Report_Name_String":"Inflow Planing",
        "Json_Param_String": JSON.stringify([{Project_ID : Number(this.selectedProject.Project_ID)}])
       }
       const objOverdue = {
        "SP_String": "Sp_Project_MIS",
        "Report_Name_String":"Overdue Targets",
        "Json_Param_String": JSON.stringify([{Project_ID : Number(this.selectedProject.Project_ID)}])
       }
       const objActual  = {
        "SP_String": "Sp_Project_MIS",
        "Report_Name_String":"Actual vs Planning",
        "Json_Param_String": JSON.stringify([{Project_ID : Number(this.selectedProject.Project_ID)}])
       }
       const objCost  = {
        "SP_String": "Sp_Project_MIS",
        "Report_Name_String":"Costing",
        "Json_Param_String": JSON.stringify([{Project_ID : Number(this.selectedProject.Project_ID)}])
       }
      forkJoin([
        this.GlobalAPI.getData(objInflow),
        this.GlobalAPI.getData(objOverdue),
        this.GlobalAPI.getData(objActual),
        this.GlobalAPI.getData(objCost),
      ]).subscribe(([Inflow,Overdue,Actual,cost])=>{
        console.log("Inflow",Inflow)
        console.log("Overdue",Overdue)
        console.log("Actual",Actual)
        console.log("cost",cost)
        this.preparedInflow(Inflow)
        this.preparedOverdue(Overdue)
        this.preparedActual(Actual)

      })
    }
  
  }
  preparedOverdue(Overdue){
   if(Overdue.length){
     this.OverdueList = Overdue
     this.bckupOverdueList = Overdue
     this.cols = 
     this.GetDistinct()
    
   }
  }
  GetDistinct() {
   
    let Site:any = [];
    let Assing:any = [];
    this.distSite =[];
    this.distAssing =[];
    this.OverdueList.forEach((item) => {
   if (Site.indexOf(item.Site) === -1) {
    Site.push(item.Site);
   this.distSite.push({ label: item.Site, value: item.Site });
   }
  if (Assing.indexOf(item.Assigned_To) === -1) {
    Assing.push(item.Assigned_To);
    this.distAssing.push({ label: item.Assigned_To, value: item.Assigned_To });
    }
    
  });
  this.bckupOverdueList = [...this.OverdueList];
  }
  FilterDist() {
    let Site:any = [];
    let Assing:any = [];
    let SearchFields:any =[];
  if (this.seleteSite.length) {
    SearchFields.push('Site');
    Site = this.seleteSite;
  }
  if (this.seleteAssing.length) {
    SearchFields.push('Assigned_To');
    Assing = this.seleteAssing;
  }

  this.OverdueList = [];
  if (SearchFields.length) {
    let LeadArr = this.bckupOverdueList.filter(function (e) {
      return (Site.length ? Site.includes(e['Site']) : true)
      && (Assing.length ? Assing.includes(e['Assigned_To']) : true)
    
    });
  this.OverdueList = LeadArr.length ? LeadArr : [];
  } else {
  this.OverdueList = [...this.bckupOverdueList] ;
  }
  }
  onYearChange(event, dt) {
 
}
preparedActual(Actual:any){
 if(Actual.length){
  this.ActualList = Actual
  this.bckUpActualList = Actual
  this.ActualListheader = Object.keys(Actual[0])
  this.GetDistinctActual()
 }
}
GetDistinctActual() {
   
  let Site:any = [];
  let Assing:any = [];
  let plan:any = [];
  let current:any = [];
  this.distSiteActual =[];
  this.distAssingActual =[];
  this.distPlanActual = []
  this.ActualList.forEach((item) => {
 if (Site.indexOf(item.Site) === -1) {
  Site.push(item.Site);
 this.distSiteActual.push({ label: item.Site, value: item.Site });
 }
if (Assing.indexOf(item.Assigned_To) === -1) {
  Assing.push(item.Assigned_To);
  this.distAssingActual.push({ label: item.Assigned_To, value: item.Assigned_To });
  }
if (plan.indexOf(item.Planned_vs_Actual) === -1) {
  plan.push(item.Planned_vs_Actual);
  this.distPlanActual.push({ label: item.Planned_vs_Actual, value: item.Planned_vs_Actual });
  }

});
this.bckUpActualList = [...this.ActualList];
}
FilterDistActual(){
  let Site:any = [];
  let Assing:any = [];
  let plan:any = [];
  let current:any = [];
  let SearchFields:any =[];
if (this.seleteSiteActual.length) {
  SearchFields.push('Site');
  Site = this.seleteSiteActual;
}
if (this.seleteAssingActual.length) {
  SearchFields.push('Assigned_To');
  Assing = this.seleteAssingActual;
}
if (this.seletePlanActual.length) {
  SearchFields.push('Planned_vs_Actual');
  plan = this.seletePlanActual;
}
this.ActualList = [];
if (SearchFields.length) {
  let LeadArr = this.bckUpActualList.filter(function (e) {
    return (Site.length ? Site.includes(e['Site']) : true)
    && (Assing.length ? Assing.includes(e['Assigned_To']) : true)
    && (plan.length ? plan.includes(e['Planned_vs_Actual']) : true)
  
  });
this.ActualList = LeadArr.length ? LeadArr : [];
} else {
this.ActualList = [...this.bckUpActualList] ;
}
}

preparedInflow(Inflow:any){
 if(Inflow.length){
  this.InflowList = Inflow
  this.Inflowheader = Object.keys(Inflow[0])
 }
}
preparedCost(cost:any){
if(cost.length){
 this.costList = cost
 this.costListHeader = Object.keys([0])
}
}
getTofix(n:any){
if(n){
  return Number(Number(n).toFixed(2))
}
}
}
