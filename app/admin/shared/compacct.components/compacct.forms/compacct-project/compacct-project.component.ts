import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from "@angular/core";
import { CompacctCommonApi } from "../../../compacct.services/common.api.service";
import { HttpParams, HttpClient } from "@angular/common/http";
import { CompacctGlobalApiService } from "../../../compacct.services/compacct.global.api.service";
declare var $: any;

@Component({
  selector: 'app-compacct-project',
  templateUrl: './compacct-project.component.html',
  styleUrls: ['./compacct-project.component.css']
})
export class CompacctProjectComponent implements OnInit,OnChanges {
  objproject = new project();
  projectFromSubmit = false;
  ProjectList = [];
  requField = false;
  Spinner = false;
  buttonname = "Create"
  SiteList = [];
  groupList = [];
  subGorupList = [];
  workList = [];
  editData:any = [];
  fieldDis = false
  @Output() projectObj = new EventEmitter<project>()
  @Input()  requir:any 
  @Input() edit:any
  constructor(
    private $http: HttpClient,
    private $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
  ) { }

  ngOnInit() {
  
    this.getProject()
   }
  EmitOnDataInit() {
    this.projectObj.emit(this.objproject);
  }
  getProject(){
    this.ProjectList = [];
      const obj = {
        "SP_String": "SP_BL_CRM_TXN_Project_Doc",
        "Report_Name_String": "Get_Project",
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log(data);
        this.ProjectList = data;
        this.getGroup(this.objproject.Budget_Group_ID);
        this.getSubGroup(this.objproject.Budget_Sub_Group_ID)
        this.getWork(this.objproject.Work_Details_ID)
        console.log("ProjectList",this.ProjectList);
        this.EmitOnDataInit()
      })
    }
  getSite(projectID){
      if(projectID){
      this.SiteList = [];
      this.groupList = [];
      this.subGorupList = [];
      this.workList = [];
      const obj = {
        "SP_String": "SP_BL_CRM_TXN_Project_Doc",
        "Report_Name_String": "Get_Site",
        "Json_Param_String": JSON.stringify([{Project_ID : Number( projectID)}]) 
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.SiteList = data;
        this.getWork(this.objproject.Work_Details_ID)
        this.EmitOnDataInit()
        console.log("SiteList",this.SiteList);
      })
    }
  
  }
  getGroup(id?){
    
    if(this.objproject.PROJECT_ID && this.objproject.SITE_ID){
    this.groupList = [];
    this.subGorupList = [];
    this.workList = [];
       const obj = {
        "SP_String": "SP_BL_CRM_TXN_Project_Doc",
        "Report_Name_String": "Get_Budget_Group",
        "Json_Param_String": JSON.stringify([{Project_ID : Number(this.objproject.PROJECT_ID) , Site_ID : Number(this.objproject.SITE_ID)}]) 
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log(data);
        this.groupList = data;
        this.objproject.Budget_Group_ID = id ? id : undefined
        this.getSubGroup(this.objproject.Budget_Sub_Group_ID);
        this.getWork(this.objproject.Work_Details_ID)
        this.EmitOnDataInit()
        console.log("groupList",this.groupList);
      })
    }
   else {
    this.groupList = [];
    this.subGorupList = [];
    this.workList = [];
 
   }
  }
  getSubGroup(id?){
    if(this.objproject.PROJECT_ID && this.objproject.SITE_ID & this.objproject.Budget_Group_ID){
      this.subGorupList = [];
       const tampObj = {
        Project_ID : Number(this.objproject.PROJECT_ID),
        Site_ID : Number(this.objproject.SITE_ID),
        Budget_Group_ID : Number(this.objproject.Budget_Group_ID)
      }
      const obj = {
        "SP_String": "SP_BL_CRM_TXN_Project_Doc",
        "Report_Name_String": "Get_Budget_Sub_Group",
        "Json_Param_String": JSON.stringify([tampObj]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.subGorupList = data;
          this.objproject.Budget_Sub_Group_ID = id ? id : undefined
          this.EmitOnDataInit()
          console.log("subGorupList",this.subGorupList);
       })
    }
    else {
      this.subGorupList = [];
     
    }
  }
  getWork(id?){
    this.workList = []
    if(this.objproject.PROJECT_ID && this.objproject.SITE_ID){
     
      const obj = {
        "SP_String": "SP_BL_CRM_TXN_Project_Doc",
        "Report_Name_String": "Get_Work_Details",
        "Json_Param_String": JSON.stringify([{Project_ID : Number(this.objproject.PROJECT_ID) , Site_ID : Number(this.objproject.SITE_ID)}]) 
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        data.forEach(el => {
          el['label'] = el.Work_Details;
          el['value'] = el.Work_Details_ID;
        });
      this.workList = data
      this.objproject.Work_Details_ID = id ? id : undefined
       this.EmitOnDataInit()
       console.log("workList",this.workList);
      })
    }
  }
 
  clearData(){
    this.projectFromSubmit = false
    this.objproject = new project()
  }
  ngOnChanges(changes: SimpleChanges) {
    this.requField = changes.requir.currentValue.projectMand === "Y" ? true : false
    this.projectFromSubmit = changes.requir.currentValue.required
}

ProjectEdit(editData){
  console.log("edit",editData)
  if(editData){
    this.objproject =  editData[0]
    this.getProject()
   this.fieldDis = true
   this.getSite( editData[0].PROJECT_ID)
   this.getGroup( editData[0].Budget_Group_ID)
   this.objproject.Budget_Group_ID =  editData[0].Budget_Group_ID
   this.objproject.Budget_Sub_Group_ID =  editData[0].Budget_Sub_Group_ID
   this.objproject.Work_Details_ID = editData[0].Work_Details_ID
   this.getSubGroup( editData[0].Budget_Sub_Group_ID)
   this.getWork(editData[0].Work_Details_ID)
   console.log("objproject",this.objproject);

  }
  else {
    this.fieldDis = false
  }
}
}
class project{
    DOC_NO:any;
    DOC_DATE:any;
    DOC_TYPE:any;
    PROJECT_ID:any;
    SITE_ID:any;
    Budget_Group_ID:any;
    Budget_Sub_Group_ID:any;
    Work_Details_ID:any;
}