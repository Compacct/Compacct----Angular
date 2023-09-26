import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import {TreeNode} from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-service-problem-type',
  templateUrl: './service-problem-type.component.html',
  styleUrls: ['./service-problem-type.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ServiceProblemTypeComponent implements OnInit {
  ServiceProblemList:any[] = []
  ServiceProblemListHeader:any[] = []
  ObjserviceProblem:serviceProblem = new serviceProblem()
  serviceProblemFormSubmit:boolean = false
  loading:boolean = false
  Spinner:boolean = false
  buttonname:string = "Create"
  ProblemTypeID:any
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
      Header: "Service Problem ",
      Link: "Service Problem"

    });
    this.getProductTypeList()
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  getProductTypeList(){
    this.loading = true;
    const obj = {
     "SP_String": "SP_Service_Engineering_Team",
     "Report_Name_String": "Get_Problem_Type",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.loading = false
    this.ServiceProblemList = data
    this.ServiceProblemListHeader = data.length ? Object.keys(data[0]) : []
   })
  }
  CreateProblemType(valid:any){
    this.serviceProblemFormSubmit =true
    if(valid){
      console.log(this.ObjserviceProblem)
      this.serviceProblemFormSubmit =false
     const obj = {
        "SP_String": "SP_Service_Engineering_Team",
        "Report_Name_String" :this.ObjserviceProblem.Problem_Type_ID ? "Update_Problem_Type" : "Create_Problem_Type",
        "Json_Param_String": JSON.stringify(this.ObjserviceProblem),
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
        if (data[0].Column1) {
        
          this.serviceProblemFormSubmit = false
          this.ObjserviceProblem = new serviceProblem()
          this.getProductTypeList()
          this.compacctToast.clear();
           this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Service Succesfully "+this.buttonname
          });
          this.buttonname = "Create"
          }
      })
    }
  }
  Delete(col){
    this.ProblemTypeID = undefined ;
    if(col.Problem_Type_ID){
        this.ProblemTypeID = col.Problem_Type_ID;
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
    if(this.ProblemTypeID){
       const obj = {
         "SP_String": "SP_Service_Engineering_Team",
         "Report_Name_String":"Delete_Problem_Type",
         "Json_Param_String": JSON.stringify([{Problem_Type_ID : this.ProblemTypeID}]) 
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("data ==",data[0].Column1);
         if (data[0].Column1 === "done"){
           this.ProblemTypeID = undefined
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Problem Type Delete Succesfully",
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
           this.getProductTypeList();
          });
     }
  
 
  }
  Edit(col){
    if (col.Problem_Type_ID) {
     this.buttonname = "Update";
     this.ObjserviceProblem = new serviceProblem()
     this.serviceProblemFormSubmit = false
    this.ObjserviceProblem = {...col}
    }
   }
}
class serviceProblem {
  Problem_Type_ID:any 
	Problem_Type:any
}