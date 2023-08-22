import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import {TreeNode} from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-service-engineering-team',
  templateUrl: './service-engineering-team.component.html',
  styleUrls: ['./service-engineering-team.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ServiceEngineeringTeamComponent implements OnInit {
  TreeDataList:any = [];
  loading = false;
  layoutString = 'vertical'
  CreateSalesExceModal:boolean = false
  CurrentNode:any;
  objserviceEngineering:serviceEngineering = new serviceEngineering()
  serviceEngineeringFormSubmit:boolean = false
  UnderTeamList:any = []
  SpecilizationList:any = []
  UserList:any = [] 
  ViewModal:boolean = false
  SpecializationModal:boolean = false
  SpecializationModalCreate:any = ""
  SpecializationSubmitted:boolean = false
  Spinner:boolean = false
  SpinnerCreate:boolean = false
  TreeDataListHeader:any = []
  buttonname:string = "Create"
  Eng_ID:any = ""
  clonedSpecilizationList:any = []
  rowIndexNumber:any
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Service Engineering Team",
      Link: "Service Engineering Team"

    });
    this.GetTreeData()
    this.GetUnderTeamList()
    this.GetSpecilizationList()
    this.GetUserList()
  }
 
  SaleExcModal(){
    this.buttonname = "Create"
    this.CreateSalesExceModal =true
    this.objserviceEngineering = new serviceEngineering()
    this.serviceEngineeringFormSubmit = false
  }
 
    
  GetTreeData(){
    this.loading = true;
    const obj = {
     "SP_String": "SP_Service_Engineering_Team",
     "Report_Name_String": "Get_service_Engineering_Team",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("tree",data);
     this.TreeDataList = data
     this.TreeDataListHeader = data.length ? Object.keys(data[0]) : []
     this.loading = false
    })

  }
  GetUnderTeamList(){
    const obj = {
     "SP_String": "SP_Service_Engineering_Team",
     "Report_Name_String": "Get_Under_Name_Dropdown",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.UnderTeamList = data
     console.log("UnderTeamList",this.UnderTeamList)
    })

  }
  GetSpecilizationList(){
   const obj = {
     "SP_String": "SP_Service_Engineering_Team",
     "Report_Name_String": "Get_Specilization_Dropdown",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.SpecilizationList = data
     this.clonedSpecilizationList = JSON.parse(JSON.stringify(data))
    })

  }
  GetUserList(){
    this.loading = true;
    const obj = {
     "SP_String": "SP_Service_Engineering_Team",
     "Report_Name_String": "Get_User_Dropdown",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.UserList = data
    })

  }
  viewSpeci(){
    this.ViewModal = true
  }
  createSpeci(){
    this.SpecializationModal = true
    this.SpecializationModalCreate = undefined
    this.SpecializationSubmitted = false
  }
  CreateSpecialization(valid:any){
    console.log(valid)
    this.SpecializationSubmitted = true
    if(valid){
      this.Spinner = true
      const obj = {
        "SP_String": "SP_Service_Engineering_Team",
        "Report_Name_String" : "Create_Specilization",
        "Json_Param_String": JSON.stringify({Specialization : this.SpecializationModalCreate}),
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.Spinner = false
        if (data[0].Column1) {
          this.SpecializationSubmitted = false
          this.Spinner = false
          this.SpecializationModal = false
          this.SpecializationModalCreate = undefined
          this.GetSpecilizationList()
           this.compacctToast.clear();
           this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Specialization Succesfully Created"
          });
              //this.SearchTender(true);
          }
      })

    }

  }
  Createteam(valid:any){
    this.serviceEngineeringFormSubmit = true
    if(valid){
      this.SpinnerCreate = true
      this.objserviceEngineering.Under_Eng_ID = this.objserviceEngineering.Under_Eng_ID ? Number(this.objserviceEngineering.Under_Eng_ID) : undefined
      this.objserviceEngineering.Eng_ID = this.objserviceEngineering.Eng_ID ? Number(this.objserviceEngineering.Eng_ID) : undefined
      this.objserviceEngineering.Under_Eng_ID = this.objserviceEngineering.Under_Eng_ID ? Number(this.objserviceEngineering.Under_Eng_ID) : undefined
      this.objserviceEngineering.User_ID = this.objserviceEngineering.User_ID ? Number(this.objserviceEngineering.User_ID) : undefined
      const obj = {
        "SP_String": "SP_Service_Engineering_Team",
        "Report_Name_String" : !this.objserviceEngineering.Eng_ID ?  "Create_service_Engineering_Team" : "Update_service_Engineering_Team",
        "Json_Param_String": JSON.stringify(this.objserviceEngineering),
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.SpinnerCreate = false
        if (data[0].Column1) {
        
          this.serviceEngineeringFormSubmit = false
          this.SpinnerCreate = false
          this.CreateSalesExceModal = false
          this.objserviceEngineering = new serviceEngineering()
          this.GetTreeData()
          this.GetUnderTeamList()
          this.compacctToast.clear();
           this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Engineering Team Succesfully "+this.buttonname
          });
          this.buttonname = "Create"
          }
      })
    }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  Edit(col){
    if (col.Eng_ID) {
     this.buttonname = "Update";
     this.CreateSalesExceModal =true
     this.objserviceEngineering = new serviceEngineering()
     this.serviceEngineeringFormSubmit = false
    this.objserviceEngineering = {...col}
    this.objserviceEngineering.Is_Problem_Resolver = this.objserviceEngineering.Is_Problem_Resolver ? this.objserviceEngineering.Is_Problem_Resolver : undefined
    console.log(this.objserviceEngineering)
    }
   }
  
   Delete(col){
    this.Eng_ID = undefined ;
    if(col.Eng_ID){
        this.Eng_ID = col.Eng_ID;
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
  onConfirm(){
   if(this.Eng_ID){
      const obj = {
        "SP_String": "SP_Service_Engineering_Team",
        "Report_Name_String":"Delete_service_Engineering_Team",
        "Json_Param_String": JSON.stringify([{Eng_ID : this.Eng_ID}]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("data ==",data[0].Column1);
        if (data[0].Column1 === "done"){
          this.Eng_ID = undefined
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Engineering Team Delete Succesfully",
            detail: "Succesfully Delete"
          });
          }
          else if(data[0].Column1 != "done"){
            this.compacctToast.clear();
            this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: data[0].Column1
          });
          }
          else{
            this.compacctToast.clear();
            this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Wrong"
          });
          }
          this.GetTreeData();
         });
    }
 

 }
 pencil(rowIndexNumber:number){
  if(this.rowIndexNumber == undefined){
    return true
  }
  else {
    return this.rowIndexNumber != rowIndexNumber ? true : false
  }
  
}
onRowEditInit(row: any ,rowIndexNumber:number ) {
  this.SpecilizationList = JSON.parse(JSON.stringify(this.clonedSpecilizationList))
  console.log(this.clonedSpecilizationList)
  this.rowIndexNumber = rowIndexNumber
}
onRowSave(col:any){
 
  const obj = {
    "SP_String": "SP_Service_Engineering_Team",
    "Report_Name_String" : "Edit_Specialization",
    "Json_Param_String": JSON.stringify([col]),
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if (data[0].Column1) {
      this.rowIndexNumber = undefined
      this.GetSpecilizationList()
      this.onRowcencleInit()
       this.compacctToast.clear();
       this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "",
        detail: "Specialization Succesfully Update"
      });
      }
  })
}
onRowcencleInit(){
  this.SpecilizationList = JSON.parse(JSON.stringify(this.clonedSpecilizationList))
  this.rowIndexNumber = undefined
}
onRowDelete(col){
  if(col.Eng_Specialization_ID){
    const obj = {
      "SP_String": "SP_Service_Engineering_Team",
      "Report_Name_String":"Delete_Specialization",
      "Json_Param_String": JSON.stringify([{ Eng_Specialization_ID : col.Eng_Specialization_ID}]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("data ==",data[0].Column1);
      if (data[0].Column1 === "done"){
         this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Specialization Delete Succesfully",
          // detail: "Succesfully Cancel"
        });
        }
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: data[0].Column1,
            // detail: "Succesfully Cancel"
          });
        }
        this.GetSpecilizationList()
        this.onRowcencleInit()
       });
  }
  
}
close(){
  this.CreateSalesExceModal = false
  this.SpecializationModal = false
  this.ViewModal = false
}
}

class serviceEngineering{
  Eng_ID:any = undefined
  Member_Name :any  = undefined               
  Under_Eng_ID  :any  = undefined               
  Eng_Specialization_ID  :any  = undefined  
  User_ID :any  = undefined                     
  Is_Supervisor :any  = undefined  
  Is_Problem_Resolver:any = undefined
}