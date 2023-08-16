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
  selector: 'app-service-support-ticket',
  templateUrl: './service-support-ticket.component.html',
  styleUrls: ['./service-support-ticket.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ServiceSupportTicketComponent implements OnInit {
  items :any =[];
  tabIndexToView = 0;
  Spinner = false; 
  buttonname = "Create";
  objsupportTicket:supportTicket = new supportTicket()
  supportTicketFormSubmit:boolean = false
  ProblemTypeList:any = []
  SelectedProblemType:any = []
  AttendingEngineerList:any = []
  SelectedAttendingEngineer:any = []
  ReportTime:Date = new Date()
  getAllTicket:any = []
  projectList:any = []
  siteList:any = []
  EngineerList:any = []
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
    this.Header.pushHeader({
      Header: "Support Ticket",
      Link: "Support Ticket"
    });
    this.items = ["BROWSE", "CREATE"];
    this.getProject()
    this.getProblemType()
  }
  onReject() {
    this.compacctToast.clear('c');
  }
  onConfirm(){}
  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.clearData(); 
      
  }
  clearData(){

  }
  SaveTicket(valid:any){
    this.supportTicketFormSubmit = true
    if(valid){
      this.supportTicketFormSubmit = false
    }
  }
  getProject(){
    this.projectList = []
    const obj = {
      "SP_String": "SP_BL_Txn_Service_Support_Ticket",
      "Report_Name_String": "Get_Project_dropdown",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.projectList = data
      console.log('projectList',this.projectList)
     
    })
  }

  changeProject(id){
    this.getSite(id)
    this.getEngineer(id)
  }

  getSite(id:any){
    this.siteList = []
    this.objsupportTicket.Site_ID = undefined
    if(id){
     const obj = {
        "SP_String": "SP_BL_Txn_Service_Support_Ticket",
        "Report_Name_String": "Get_Site_dropdown",
        "Json_Param_String": JSON.stringify([{Project_ID : id}]) 
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.siteList = data
        console.log('siteList',this.siteList)
        
      })
    }
   
  }
  getEngineer(id:any){
    this.AttendingEngineerList = []
    this.SelectedAttendingEngineer = []
    if(id){
      const obj = {
         "SP_String": "SP_BL_Txn_Service_Support_Ticket",
         "Report_Name_String": "Get_Engineering_dropdown",
         "Json_Param_String": JSON.stringify([{Project_ID : id}]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        data.forEach(el => { el.label = el.Member_Name, el.value =el.Eng_ID });
        this.AttendingEngineerList = data
        console.log('AttendingEngineerList',this.AttendingEngineerList)
        
       })
     }
  }
  getProblemType(){
    this.ProblemTypeList = []
    const obj = {
      "SP_String": "SP_BL_Txn_Service_Support_Ticket",
      "Report_Name_String": "Get_Problem_Type_dropdown",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => { el.label = el.Problem_Type, el.value =el.Problem_Type_ID });
      this.ProblemTypeList = data
      console.log('ProblemTypeList',this.ProblemTypeList)
    })
  }
}


class supportTicket{
  Docket_No:any
  Project_ID:any
  Site_ID:any
  Report_Time:any
  Status_ID:any
  Remarks:any
}