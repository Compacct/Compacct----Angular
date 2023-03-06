import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-project-plan-approve',
  templateUrl: './project-plan-approve.component.html',
  styleUrls: ['./project-plan-approve.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ProjectPlanApproveComponent implements OnInit {
  items :any =[];
  tabIndexToView = 0;
  objProject : Project = new Project();
  objApprove : Approve = new Approve();
  objDisapprove : Disapprove = new Disapprove();
  AllProjectList : any = [];
  ProjectList : any= [];
  seachSpinner : any = false;
  Searchedlist : any = [];
  AllSiteList : any = [];
  SiteList : any = [];
  AllPendingSearchList : any = [];
  AllApproveSearchList : any = [];
  AllDisApproveSearchList : any = [];
  masterApproveId =undefined;
  Approved :boolean = false;
  DisApproved :boolean = false;
  MasterdisApproveId = undefined;

  Spinner = false;
  approve = "Approve";
  disapprove = "Disapprove";
  DisSpinner = false;

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private GlobalAPI : CompacctGlobalApiService,
    private Header : CompacctHeader,
    private DateService : DateTimeConvertService,
    private compacctToast : MessageService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.items = ["Pending Project", "Approved Project","Disapproved Project"];
    this.Header.pushHeader({
      Header: "Project Plan Approve",
      Link: "Harbauer -> Project Plan Approve"
    });
    this.getProjectDetails();
    // this.getListPandingAuth();
    // this.Finyear();
    //this.getCostCenter();
    //this.getCostCenterNotAuth();
}
TabClick(e){
  this.tabIndexToView = e.index;
  this.items = ["Pending Project", "Approved Project","Disapproved Project"];
  this.clearData(); 
    
}

getProjectDetails(){
  this.AllProjectList=[]; 
  this.ProjectList = [];
 
    const obj = {
      "SP_String": "SP_Task_Management_Tender",
      "Report_Name_String":"Get_Project_All",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.AllProjectList = data;
     console.log("this.AllProjectList",this.AllProjectList);
      this.AllProjectList.forEach((el:any) => {
        this.ProjectList.push({
          label: el.Project_Description,
          value: el.Project_ID
        });
      });
      
  
    })

}

getSiteDetails(Project_ID){
  if(Project_ID){
    this.AllSiteList = [];
    this.SiteList = [];
    const projectFilter = this.AllProjectList.filter((el:any) => Number(el.Project_ID) === Number(Project_ID))[0]
      
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String":"Get_Site_For_Project_Planning",
        "Json_Param_String": JSON.stringify([{Project_ID: Project_ID,Tender_Doc_ID:projectFilter.Tender_Doc_ID}])
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.AllSiteList = data;
       console.log("this.AllSiteList",this.AllSiteList);
        this.AllSiteList.forEach((el:any) => {
          this.SiteList.push({
            label: el.Site_Description,
            value: el.Site_ID
          });
        });
        
    
      })
    }
    else{
      this.objProject.Site_ID = undefined;
      this.objApprove.Site_ID = undefined;
      this.objDisapprove.Site_ID = undefined;
      this.AllSiteList = [];
      this.SiteList = [];
    }

}

GetPendingSearchedList(){
  if(this.objProject.Site_ID && this.objProject.Project_ID){
    let Tempobj = {
      PROJECT_ID : this.objProject.Project_ID,
      SITE_ID : this.objProject.Site_ID,
      User_ID : this.commonApi.CompacctCookies.User_ID
    }

    const obj = {
      "SP_String": "SP_Project_Plan_Approve",
      "Report_Name_String":"Get_Pending_Plan",
      "Json_Param_String": JSON.stringify([Tempobj])
     }
     this.GlobalAPI.getData(obj)
      .subscribe((data: any) => {
        this.AllPendingSearchList = data;
        
        //this.getPuschaseOrder();
        console.log("AllPendingSearchList=",this.AllPendingSearchList);
      });
  }


}

GetApproveSearchedList(){
  if(this.objApprove.Site_ID && this.objApprove.Project_ID){
    let Tempobj = {
      PROJECT_ID : this.objApprove.Project_ID,
      SITE_ID : this.objApprove.Site_ID,
      //User_ID : this.commonApi.CompacctCookies.User_ID
    }

    const obj = {
      "SP_String": "SP_Project_Plan_Approve",
      "Report_Name_String":"Get_Approve_Plan",
      "Json_Param_String": JSON.stringify([Tempobj])
     }
     this.GlobalAPI.getData(obj)
      .subscribe((data: any) => {
        this.AllApproveSearchList = data;
        
        //this.getPuschaseOrder();
        console.log("AllApproveSearchList=",this.AllApproveSearchList);
      });
  }

}
GetDisApproveSearchedList(){
  if(this.objDisapprove.Site_ID && this.objDisapprove.Project_ID){
    let Tempobj = {
      PROJECT_ID : this.objDisapprove.Project_ID,
      SITE_ID : this.objDisapprove.Site_ID,
      //User_ID : this.commonApi.CompacctCookies.User_ID
    }

    const obj = {
      "SP_String": "SP_Project_Plan_Approve",
      "Report_Name_String":"Get_Disapprove_Plan",
      "Json_Param_String": JSON.stringify([Tempobj])
     }
     this.GlobalAPI.getData(obj)
      .subscribe((data: any) => {
        this.AllDisApproveSearchList = data;
        
        //this.getPuschaseOrder();
        console.log("AllDisApproveSearchList=",this.AllDisApproveSearchList);
      });
  }

}
clearData(){
  this.objProject = new Project();
  this.objApprove = new Approve();
  this.objDisapprove = new Disapprove();
  this.AllSiteList = [];
  this.SiteList = [];
 
  
  this.AllPendingSearchList = [];
  this.AllDisApproveSearchList = [];
  this.AllApproveSearchList = [];


}
onReject() {
  this.compacctToast.clear('c');
}
Approve(col){
  //console.log("master==",master)
  this.Approved = false
  this.DisApproved = true
  this.masterApproveId =undefined;
  if(col.Task_Txn_ID){
    this.Approved = true
    this.DisApproved = false
    this.masterApproveId = col.Task_Txn_ID;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure To Approved This Project Plan",
      detail: "Confirm to proceed"
    });
}
}

onConfirm(){
  if(this.masterApproveId){
    const tempobj = {
     Task_Txn_ID : this.masterApproveId,
     User_ID :this.commonApi.CompacctCookies.User_ID,
     Status : "Approved"
    }
    const obj = {
      "SP_String": "SP_Project_Plan_Approve",
      "Report_Name_String": "Update_Plan_Approve",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("del Data===", data[0].Column1)
      if (data[0].Column1){
        this.onReject();
        this.GetPendingSearchedList();
        this.Approved = false;
        this.DisApproved = true;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: " Task Txn ID " + this.masterApproveId ,
          detail: "Succesfully Approved "
        });
        this.masterApproveId = undefined ;
        
       }
    })
  }

}

DisApprove(col){
  this.Approved = true;
  this.DisApproved = false;
  this.MasterdisApproveId =undefined;
  if(col.Task_Txn_ID){
    this.Approved = false;
    this.DisApproved = true;
    this.MasterdisApproveId = col.Task_Txn_ID ;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure To Dis-Approved This Project Plan",
      detail: "Confirm to proceed"
    });
}
}

onConfirm2(){
  if(this.MasterdisApproveId){
    const tempobj = {
     Task_Txn_ID : this.MasterdisApproveId,
     User_ID :this.commonApi.CompacctCookies.User_ID,
     Status : "Disapproved"
    }
    const obj = {
      "SP_String": "SP_Project_Plan_Approve",
      "Report_Name_String": "Update_Plan_Approve",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("del Data===", data[0].Column1)
      if (data[0].Column1){
        this.onReject();
        this.GetPendingSearchedList();
        this.Approved = false;
        this.DisApproved = true;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: " Task Txn ID " + this.MasterdisApproveId ,
          detail: "Succesfully DisApproved "
        });
        this.MasterdisApproveId = undefined ;
        
       }
    })
  }

}
DataForSave(){
  if(this.AllPendingSearchList.length) {
    let tempArr:any =[]
    this.AllPendingSearchList.forEach(item => {
      if(item.Select_Flag) {
      const obj = {
          Task_Txn_ID : item.Task_Txn_ID,
          User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
          Status : "Approved"
      }
      tempArr.push(obj);
    }
    });
    console.log(tempArr)
    return JSON.stringify(tempArr);

  }
 }
SaveApproved(){
  this.Spinner = true;
  const obj = {
    "SP_String": "SP_Project_Plan_Approve",
    "Report_Name_String":"Update_Plan_Approve",
   "Json_Param_String": this.DataForSave()

  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    console.log(data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      this.compacctToast.clear();
      //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Success",
       detail: "Succesfully Approved" //+ mgs
     });
     this.Spinner = false;
     this.GetPendingSearchedList();
    } 
    else{
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Something Wrong"
      });
    }
  })
 }
 DataForSaveDis(){
  if(this.AllPendingSearchList.length) {
    let tempArr:any =[]
    this.AllPendingSearchList.forEach(item => {
      if(item.Select_Flag) {
      const obj = {
          Task_Txn_ID : item.Task_Txn_ID,
          User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
          Status : "Disapproved",
          Select_Flag : item.Select_Flag
      }
      tempArr.push(obj);
    }
    });
    console.log(tempArr)
    return JSON.stringify(tempArr);

  }
 }
SaveDisApproved(){
  this.DisSpinner = true;
  const obj = {
    "SP_String": "SP_Project_Plan_Approve",
    "Report_Name_String":"Update_Plan_Approve",
   "Json_Param_String": this.DataForSaveDis() 

  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    console.log(data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      this.compacctToast.clear();
      //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Success",
       detail: "Succesfully Disapproved" //+ mgs
     });
     this.DisSpinner = false;
     this.GetPendingSearchedList();
    } 
    else{
      this.DisSpinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Something Wrong"
      });
    }
  })
 }
}

class Project{
  Project_ID : any;
  Site_ID : any
}
class Approve{
  Project_ID : any;
  Site_ID : any
}
class Disapprove{
  Project_ID : any;
  Site_ID : any
}
