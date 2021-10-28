import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService, SelectItem } from "primeng/api";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctGetDistinctService } from '../../../../shared/compacct.services/compacct-get-distinct.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-crm-lead-task-details',
  templateUrl: './crm-lead-task-details.component.html',
  styleUrls: ['./crm-lead-task-details.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CrmLeadTaskDetailsComponent implements OnInit {
  url = window["config"];
  leadtransation = new Lead();
  snipper = false;
  leadtransactionSubmit = false;
  ExistingLead = undefined;

  LeadStatusList = [];
  LeadList = [];
  EnqSourceModel = [];
  customertype = [];
  ReferencebyCustomer = [];
  user=[];

  SelectedLead = undefined;
  TaaskDetailsModalFlag = false;
  TaskSubmit = false;
  SubjectList = [];
  
  TaskToDate = new Date();  
  TaskFromDate = new Date();
  TaskObj = new task();
  QueryStringFootfall = undefined;
  QueryStringUserID = undefined;
  docdate:any;
  LeadDateNepal = '';
  autocomplete:any;
  ProductTypeLists = [];
  SelectedProductTypeList = [];
  followUpLists = [];
  distinctDateArray =[];
  TaskCount = 0;
  TaskDetailsFollowupObj = new TaskDetails();
TaskDetailsFollowupModal = false;
TaskDetailsFollowupFormSubmited = false;
TaskDetailsFollowupList = [];
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private router : Router,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    public $CompacctAPI: CompacctCommonApi,
    private distService : CompacctGetDistinctService) { 
        this.route.queryParams.subscribe((val:any) => {
          this.QueryStringFootfall = undefined;
          this.QueryStringUserID = undefined;
          if(val.FootFallID) {
            this.QueryStringFootfall = val.FootFallID;
            this.QueryStringUserID = val.UserID;
            this.GetFollowupDetails(this.QueryStringFootfall);
            this.GetAllLead();
            this.GetTaskCount();
          }
        } );
    }
  ngOnInit() {
    this.Header.pushHeader({
      Header: "Lead Details",
      Link: " CRM -> Transaction -> Lead Details"
    });
    this.GetProductTypeLists();
    this.GetUser();
    this.GetStatuslist();
    this.GetEnqSrc();
    this.Getcustomertype();
    this.GetReferencebyCustomer();
    this.GetAllLead();
    this.GetSubject();
    this.GetTaskCount();
  }
  // GET
  GetSubject() {
    const objj = {
      "SP_String": "SP_New_Lead_Registration",
      "Report_Name_String" : "Get_Lead_Task_Subjects"
    }
    this.GlobalAPI.postData(objj)
        .subscribe((data: any) => {
          this.SubjectList = data;
        });
  }
  GetUser() {
    this.$http
       .get('/BL_CRM_Master_SalesTeam/Get_Sales_Man_for_napal')
       .subscribe((data: any) => {
           this.user = data.length ? data : [];
      
       });
  }
  GetEnqSrc() {
    this.$http
       .get(this.url.apiGetEnquerySource)
       .subscribe((data: any) => {
           this.EnqSourceModel = data.length ? data : [];
      
       });
  }
 Getcustomertype() {
  this.$http
       .get(this.url.apiGetCustomerType)
       .subscribe((data: any) => {
           this.customertype = data.length ? data : [];
      
       });
 }
 GetReferencebyCustomer() {
  this.$http
       .get("/Common/Get_Master_Accounting_Sub_Ledger_Report?User_ID=" + this.$CompacctAPI.CompacctCookies.User_ID)
       .subscribe((res: any) => {
         const data = res ? JSON.parse(res) : [];
        data.forEach(it=> {
          it['value'] = it.Sub_Ledger_ID;
          it['label'] = it.Sub_Ledger_Name;
        })
           this.ReferencebyCustomer = data.length ? data : [];
      
       });
 }
  GetAllLead(){    
    const obj = {
      "SP_String": "SP_New_Lead_Registration",
      "Report_Name_String": "Get_Leads_with_Assign_To",
      "Json_Param_String": '[{"Assign_To":'+this.QueryStringUserID+'}]'
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log(data);
      data.forEach(it=> {
        it['value'] = it.Org_Name;
        it['label'] = it.Org_Name;
      })
      this.LeadList = data;
      if(this.QueryStringFootfall) {
        const arer= this.LeadList.filter(i=> i.Foot_Fall_ID == this.QueryStringFootfall)[0];
        this.SelectedLead = arer.Org_Name;
        this.LeadChange(arer.Org_Name);
      }
    })

  } 
  GetStatuslist() {
    const objj = {
    "SP_String": "SP_New_Lead_Registration",
    "Report_Name_String" : "Get_Lead_Status"
  }
  this.GlobalAPI.postData(objj)
      .subscribe((data: any) => {
        this.LeadStatusList = data;
      });
  }
  GetProductTypeLists() {
    this.$http.get('/Master_Product_Type/Master_Product_Type_Browse')
        .subscribe((res: any) => {
          const data =  res ? JSON.parse(res) : [];
          data.forEach(it=> {
            it['value'] = it.Product_Type_ID;
            it['label'] = it.Product_Type;
          })
          this.ProductTypeLists = data;
        });
  }
  // CHANGE
  LeadChange(obj){
    console.log(obj)
    this.leadtransation = new Lead();
    this.SelectedProductTypeList = [];
    this.ExistingLead = undefined;
    if(obj) {
      this.leadtransation = this.LeadList.filter(i=> i.Org_Name === obj)[0];
      this.SelectedProductTypeList  = this.leadtransation.Product_Type_IDs ? this.leadtransation.Product_Type_IDs.split(',').filter(n=>n).map((i) => Number(i)) : [];
      
      this.ExistingLead = this.leadtransation.Existing ? this.leadtransation.Existing : undefined;
      this.autocomplete = this.leadtransation.Address;
    }
  }
  ChnageReferencebyCustomer = function (subledgerID) {
    this.leadtransation.Sub_Ledger_ID_Ref = undefined;
    if (subledgerID) {
      this.leadtransation.Sub_Ledger_ID_Ref = subledgerID;
    }
    else {
      this.leadtransation.Sub_Ledger_ID_Ref = 0;
    }
}
getAddressOnChange(e) {
  this.leadtransation.Address = undefined;
 if (e) {
    this.leadtransation.Address = e;
 }
}
  Cleardata3 () {
    this.leadtransation.Existing_Name = undefined;
  }

  // LEAD EDIT
  GlobalFilterChange() {
    console.log(this.SelectedProductTypeList);
  }
  UpdateLead(valid) {
    this.leadtransactionSubmit = true;
    if(valid) {
     // this.snipper = true;
      let custTypeList = this.SelectedProductTypeList;
      this.leadtransation.Existing = this.ExistingLead;
      this.leadtransation.Next_Followup = this.DateService.dateTimeConvert(new Date());
      this.leadtransation.Product_Type_IDs = custTypeList.length ? "," + custTypeList.toString() + "," : '';
      this.leadtransation.Followup_Remarks = 'NA';
      this.leadtransation.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.leadtransation.User_ID = this.QueryStringUserID;
      this.leadtransation.Foot_Fall_ID = this.QueryStringFootfall;
      const obj = {
        "SP_String": "SP_New_Lead_Registration",
        "Report_Name_String": "New Lead Create",
        "Json_Param_String": JSON.stringify([this.leadtransation])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1) {
          this.leadtransactionSubmit = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'success',
            detail: "Succesfully Updated."
          });
          this.snipper = false;
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "error",
            detail: "Error Occured"
          });
          this.snipper = false;
          
        }
    }); 
  }
  }

// TASK
  OpenTask() {
  this.TaskToDate = new Date();  
  this.TaskFromDate = new Date();
  this.TaskObj = new task();
  this.TaskSubmit = false;
  this.TaaskDetailsModalFlag = true;
  }
  GetFollowupDetails(footFallID) {
    const ctrl = this;
          const distinctDateArrayTemp = [];
          const obj = {
            "SP_String": "SP_New_Lead_Registration",
            "Report_Name_String": "Get_Task_with_Foot_Fall_ID",
            "Json_Param_String": '[{"Foot_Fall_ID":' + footFallID+'}]'
          }
          this.GlobalAPI.postData(obj).subscribe(function (data) {
                ctrl.followUpLists = data.length ? data:[];
                for (let i = 0; i < ctrl.followUpLists.length; i++) {
                    distinctDateArrayTemp.push(ctrl.followUpLists[i].Start_Date);
                }
                const unique = distinctDateArrayTemp.filter(function(value, index, self){
                                return self.indexOf(value) === index;
                                })
            ctrl.distinctDateArray = unique;
            });
           // this.GetTaskDetails();
  }
  GetStatusWiseColor(obj){
    if(obj.Status === 'Lead_Pending') {
      return 'btn-soundcloud';
    }
    if(obj.Status === 'Working') {
      return 'btn-openid';
    }
    if(obj.Status === 'Done') {
      return 'btn-danger';
    }
  }
  getFollowupByDate(dateStr) {
    return this.followUpLists.filter((item) => item.Start_Date === dateStr);
  }
  saveTask(valid) {
    this.TaskSubmit = true;
    console.log(this.TaskObj)
    if (valid) {
      this.TaskObj.End_Date = this.DateService.dateConvert(new Date(this.TaskToDate));
      this.TaskObj.Start_Date = this.DateService.dateConvert(new Date(this.TaskFromDate));
      this.TaskObj.Agent_Name = this.user.filter(i=> i.User_ID == this.TaskObj.Agent_User_ID)[0].Member_Name;
      this.TaskObj.User_ID = this.QueryStringUserID;
      this.TaskObj.Foot_Fall_ID = this.QueryStringFootfall;
      const obj = {
        "SP_String": "SP_New_Lead_Registration",
        "Report_Name_String": "New Task Create",
        "Json_Param_String": JSON.stringify([this.TaskObj])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1) {
          this.GetTaskCount();
          this.TaskToDate = new Date();  
          this.TaskFromDate = new Date();
          this.TaskObj = new task();
          this.TaskSubmit = false;
          this.TaaskDetailsModalFlag = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'success',
            detail: "Succesfully Created."
          });
        }
       
      })
      // this.objFollowUpCreation.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      // this.objFollowUpCreation.Next_Followup = this.DateService.dateTimeConvert(new Date(this.NxtFollowupDate));
    }
  }
  GetTaskCount() {
    const tempObjh = {
      Assign_To : this.QueryStringUserID,
      Foot_Fall_ID : this.QueryStringFootfall
    }
    const objj = {
      "SP_String": "SP_New_Lead_Registration",
      "Report_Name_String" : "Get_Count_Task_with_Assign_To",
      "Json_Param_String": JSON.stringify([tempObjh])
    }
    this.GlobalAPI.postData(objj)
        .subscribe((data: any) => {
          console.log(data)
          this.TaskCount = data[0].Column1;
        });
  }
  RedirectOpportunities (){
    const obj = {
      UserID :  this.QueryStringUserID,
    }
    const navigationExtras: NavigationExtras = {
      queryParams: obj,
    };
    this.router.navigate(['./BL_CRM_Lead_Interaction_Nepal'], navigationExtras);
  }
  // TASK DETAILS
  ShowTaskDetail(obj) {
    this.TaskDetailsFollowupObj = new TaskDetails();
    this.TaskDetailsFollowupFormSubmited = false;
    this.TaskDetailsFollowupList = [];
    if(obj.scheduled_ID) {
      this.TaskDetailsFollowupObj.Agent_Name = obj.Agent_Name;
      this.TaskDetailsFollowupObj.scheduled_ID = obj.scheduled_ID;
      this.TaskDetailsFollowupObj.Subject = obj.Subject;
      this.TaskDetailsFollowupObj.Status = obj.Status;
      this.TaskDetailsFollowupObj.Agent_User_ID = obj.Agent_User_ID;
      this.TaskDetailsFollowupObj.Remarks = undefined;
      this.GetTaskDetails()
    }
  }
  GetTaskDetails() {
    const obj = {
      "SP_String": "SP_New_Lead_Registration",
      "Report_Name_String": "Get_Remarks_Status_with_Schedule_ID",
      "Json_Param_String": '[{"Schedule_ID":'+this.TaskDetailsFollowupObj.scheduled_ID+'}]'
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
          console.log(data);
          this.TaskDetailsFollowupList = data;
          this.TaskDetailsFollowupModal = true;
      });
  }
  saveTaskFollowup(valid){
    this.TaskDetailsFollowupFormSubmited = true;
    console.log(this.TaskDetailsFollowupObj)
    if (valid) {
      const obj = {
        "SP_String": "SP_New_Lead_Registration",
        "Report_Name_String": "Add Task Remarks Create",
        "Json_Param_String": JSON.stringify([this.TaskDetailsFollowupObj])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1) {
          this.GetTaskCount();
          this.GetFollowupDetails(this.QueryStringFootfall);
          this.TaskDetailsFollowupFormSubmited = false;
          this.TaskDetailsFollowupModal = false;
          this.TaskDetailsFollowupObj = new TaskDetails();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'success',
            detail: "Succesfully Created."
          });
        }
       
      })
      // this.objFollowUpCreation.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      // this.objFollowUpCreation.Next_Followup = this.DateService.dateTimeConvert(new Date(this.NxtFollowupDate));
    }
  }
}
class Lead{
  Foot_Fall_ID: 0;
  Cost_Cen_ID: 0;
  Sub_Ledger_ID: 0;
  Mobile:String;
  Phone:String;
  Email:String;
  Contact_Name:String;
  Org_Name:String;
  Dept:String;
  Desig:String;
  Address:String;
  Landmark:String;
  District:String;
  State:String;
  PIN:String;
  Country:String;
  Enq_Source_ID :String;
  User_ID =  0;
  Sub_Ledger_ID_Ref = 0;
  Enq_Chance:String;
  Next_Followup:String;
  Sub_Ledger_Cat_ID:String;
  Recd_Media:String;
  Followup_Remarks:String;
  Status:String;
  Sub_Dept_ID:String;
  Sent_To:String;
  Location:String;
  Landline_Extension:String;
  Chef_Name:String;
  Competitor_Activity:String;
  Customer_Remarks:String;
  Social_Media_Details:String;
Product_Type_IDs:String;
Lead_Date:String;
Lead_Priority :String;
Website:String;
Social_FaceBook_Link:String;
Social_Instagram_Link:String;
Social_Linkedin_Link:String;
Existing :String;
Existing_Name:String;
Existing_ID:String;
Competition_Activity:String;
Assign_To:String;
Is_Visiable =  'Y';
}
class task {
  User_ID:String;         	          
  Remarks= "Lead Task"; 
  Start_Date:String; 
End_Date   :String;
Foot_Fall_ID :String;         
Sub_Ledger_ID = 0;      
Status = 'Lead_Pending' ;    
Type =  'CRM' ;   
Lead_Status = 'Lead_Pending';    
Visit_Type ='Pending';      
Contact_Txn_ID= 0;        
  Contact_Name='';   
Contact_No= '';    
Contact_Email='';     
Subject_ID :String;       
Priority  :String; 
Agent_Name:String;
Agent_User_ID:String;

}
class TaskDetails{
  scheduled_ID:String;
  Remarks:String;
  Status:String;
  Subject:String;
  Agent_Name:String;
  Agent_User_ID:String;
}