import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-project-master',
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ProjectMasterComponent implements OnInit {
  items:any = []
  tabIndexToView = 0;
  buttonname = "Create";
  Spinner = false;
  siteList:any[]=[]
  EngineerList:any = []
  ProjectList:any[] = []
  Objproject:project = new project()
  projectFormSubmit:boolean = false
  SitesupervisorList:any[] = []
  engineerList:any[] = []
  Objsite:site = new site()
  SiteFormSubmit:boolean = false
  engineerForm:boolean = false
  ObjEngineer:Engineer = new Engineer()
  engineerFormSubmit:boolean = false
  seletcProject:any = undefined
  SiteSpinner:boolean = false
  @ViewChild('projectSeletcForm',{static:false}) projectSeletcForm:NgForm
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Master Project",
      Link: "Master Project"
    });
    this.getProject()
    this.getSiteSupervisor()
    this.getEngineer()
  }
 
  clearData(){
    this.Spinner = false
    this.Objproject = new project()
    this.projectFormSubmit = false
    this.buttonname = "Create";
    this.SiteSpinner = false
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  getProject(){
    this.ProjectList = []
    const obj = {
      "SP_String": "SP_Service_Project_Team",
      "Report_Name_String":"Get_Project_Team",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProjectList = data
      console.log(data)
     })
  }
  getSiteSupervisor(){
    this.SitesupervisorList = []
    const obj = {
      "SP_String": "SP_Service_Project_Team",
      "Report_Name_String":'Get_Under_Name_Dropdown',
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.SitesupervisorList = data
      console.log(data)
     })
  }
  getEngineer(){
    this.engineerList = []
    const obj = {
      "SP_String": "SP_Service_Project_Team",
      "Report_Name_String":'Get_Engineer_Name_Dropdown',
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.engineerList = data
      console.log(data)
     })
  }
  onConfirm() {}
  createProject(valid:any){
    this.projectFormSubmit = true
    if(valid){
      this.Spinner = true
      const obj = {
        "SP_String": "SP_Service_Project_Team",
        "Report_Name_String": this.Objproject.Project_ID ? 'Update_Service_Project_Master' : 'Create_Service_Project_Master',
        "Json_Param_String": JSON.stringify(this.Objproject) 
      }
      this.GlobalAPI.getData(obj)
      .subscribe((data : any)=>
      {
        if(data[0].Column1){
        
          this.getProject()
          this.projectSeletcForm.form.setValue(
            {
              Project : data[0].Column1
            }
            )
          this.changeProject()
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Project Master "+ this.Objproject.Project_ID ? 'Update' : 'Create' +" Succesfully",
            detail: "Succesfully "+ this.Objproject.Project_ID ? 'Update' : 'Create'
          });
          this.clearData()
          this.buttonname = "Update";
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Something Wrong"
        });
        }
      })
    }
  }
  changeProject(){
    this.Objproject = new project()
    this.buttonname = "Create";
    this.EngineerList = []
    this.siteList = []
    if(this.seletcProject ){

      this.buttonname = "Update";
    const obj = {
        "SP_String": "SP_Service_Project_Team",
        "Report_Name_String":'Retrieve_Service_Project_Master',
        "Json_Param_String": JSON.stringify({Project_ID : Number( this.seletcProject)}) 
      }
      this.GlobalAPI.getData(obj)
      .subscribe((data : any)=>
      {
        let project = JSON.parse(data[0].Project_team_details)[0]
        console.log(project)
        this.Objproject.Project_Name = project.Project_Name
        this.Objproject.Project_ID = project.Project_ID
        this.Objproject.Tender_No = project.Tender_No
        this.Objproject.Project_Remarks = project.Project_Remarks
        this.Objproject.Project_Description = project.Project_Description
        this.Objproject.Supervisor_ID = project.Supervisor_ID
        this.siteList =project.hasOwnProperty('site_details')? project.site_details : []
        this.EngineerList =project.hasOwnProperty('engineer_details')? project.engineer_details : []
      })
    }
  }
  addSite(valid:any){
    this.SiteFormSubmit = true
    if(valid && this.seletcProject){
      let obj ={
        Site_Name: this.Objsite.Site_Name,
        Contact_Person:this.Objsite.Contact_Person,
        Contact_No:this.Objsite.Contact_No,
        Contact_Address:this.Objsite.Contact_Address,
        Site_Remarks:this.Objsite.Site_Remarks,
        Project_ID:this.seletcProject
      }
      this.siteList.push(obj)
      this.SiteFormSubmit = false
      this.Objsite = new site()
    }
    else {
      if(!this.seletcProject){
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "No Project was selected",
      });
      }
   
    }
  }
  GetSiteSupervisorNameFromId(id:any){
    const finData =  this.SitesupervisorList.find( (el:any) => Number(el.Eng_ID) == Number(id) )
    return finData ? finData.Member_Name : "NA"
  }
  addEngineer(valid:any){ 
    this.engineerFormSubmit = true
    if(valid && this.seletcProject){
      this.EngineerList.push(
        {
          Engineer_ID : this.ObjEngineer.Engineer_ID,
           Project_ID:this.seletcProject
        }
        )
        this.engineerFormSubmit = false
        this.ObjEngineer = new Engineer()
    }
    else {
      if(!this.seletcProject){
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "No Project was selected",
      });
      }
   
    }
  }
  GetEngineerNameFromId(id:any){
    const finData =  this.engineerList.find( (el:any) => Number(el.Eng_ID) == Number(id) )
    return finData ? finData.Member_Name : "NA"
  }
  commonDelete(type,i){
    console.log(i)
    if(type == "site"){
      this.siteList.splice(i,1)
    }
    if( type= "enginner" ){
      this.EngineerList.splice(i,1)
    }
  }
  updateSite(){
    console.log("Click")
    if(this.seletcProject ){
      const obj = {
        "SP_String": "SP_Service_Project_Team",
        "Report_Name_String": 'Update_Service_Site_Master',
        "Json_Param_String": JSON.stringify(this.siteList.length ? this.siteList : {Project_ID : this.seletcProject , Site_Name : null}) 
      }
      this.GlobalAPI.getData(obj)
      .subscribe((data : any)=>
      {
        if(data[0].Column1){
          this.siteList = []
          this.getProject()
          this.projectSeletcForm.form.setValue(
            {
              Project : data[0].Column1
            }
            )
          this.changeProject()
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Site Update Succesfully",
            detail: "Succesfully Update"
          });
          this.clearData()
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Something Wrong"
        });
        }
      })  
    }
  }
  updateEngineer(){
    if(this.seletcProject){
      const obj = {
        "SP_String": "SP_Service_Project_Team",
        "Report_Name_String": 'Update_Service_Engineer_Relation',
        "Json_Param_String": JSON.stringify(this.EngineerList.length ? this.EngineerList : { Project_ID: this.seletcProject , Engineer_ID : 0 }) 
      }
      this.GlobalAPI.getData(obj)
      .subscribe((data : any)=>
      {
        if(data[0].Column1){
          this.EngineerList = []
          this.getProject()
          this.projectSeletcForm.form.setValue(
            {
              Project : data[0].Column1
            }
            )
          this.changeProject()
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Engineer Update Succesfully",
            detail: "Succesfully Update"
          });
          this.clearData()
        }
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Something Wrong"
        });
        }
      })  
    }
  }
}


class project {
Project_ID:any
Project_Name:any                
Project_Description:any
Tender_No :any                    
Project_Remarks:any
Supervisor_ID:any
}

class site{
Project_ID:any
Site_Name:any   
Contact_Person:any
Contact_No:any
Contact_Address:any
Site_Remarks:any

}

class Engineer {
  Engineer_ID :any     
}