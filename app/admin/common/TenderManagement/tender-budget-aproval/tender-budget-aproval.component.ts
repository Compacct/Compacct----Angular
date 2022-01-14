import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGetDistinctService } from '../../../shared/compacct.services/compacct-get-distinct.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tender-budget-aproval',
  templateUrl: './tender-budget-aproval.component.html',
  styleUrls: ['./tender-budget-aproval.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TenderBudgetAprovalComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  menuList = [];
  Spinner = false;
  buttonname = "Create";

  PendinApvList = [];
  AprvBudgetList = [];
  NotAprvBudgetList = [];

  TenderDocID = undefined;
  Aspinner = false;
  Dspinner = false;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Budget Approval",
      Link: "Project Management -> Budget Approval"
    });
    this.items = ['Pending Approval','Approved Budget','Not Approved Budget'];
    this.GetPendinApvList();
    this.GetAprvBudgetList();
    this.GetNotAprvBudgetList();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items =  ['Pending Approval','Approved Budget','Not Approved Budget']
    this.clearData();
  }
  clearData(){

  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onReject1() {
    this.compacctToast.clear("c1");
  }


  GetPendinApvList(){
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Budget_Pending_Approval_Tab",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.PendinApvList = data;
    })
  }
  GetAprvBudgetList(){
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Approved_Budget_Tab",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.AprvBudgetList = data;
     console.log("SUB",data);
    })
  }
  GetNotAprvBudgetList(){
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Not_Approved_Budget_Tab",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.NotAprvBudgetList = data;
     console.log("SUB",data);
    })
  }

  ApproveBudget(obj) {
    this.TenderDocID = undefined;
    if(obj.Tender_Doc_ID) {
      this.TenderDocID = obj.Tender_Doc_ID;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure To Approve this Budget ?",
        detail: "Confirm to proceed"
      });
    }
  }
  Approve() {
    if(this.TenderDocID) {
      this.Aspinner = true;
      const saveObj = { Tender_Doc_ID: this.TenderDocID}
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "Update_Approve_Budget",
        "Json_Param_String": JSON.stringify(saveObj)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1 === "Update successfully"){  
          this.SavefollowUp('BUDGET APPROVED - TENDER NOT SUBMITTED');  
          
        }
      
      })
    }
  }
  DisApproveBudget(obj) {
    this.TenderDocID = undefined;
    if(obj.Tender_Doc_ID) {
      this.TenderDocID = obj.Tender_Doc_ID;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c1",
        sticky: true,
        severity: "warn",
        summary: "Are you sure To Disapprove this Budget ?",
        detail: "Confirm to proceed"
      });
    }
  }
  Disapprove(){
    if(this.TenderDocID) {
      this.Dspinner = true;
      const saveObj = { Tender_Doc_ID: this.TenderDocID}
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "Update_Disapprove_Budget",
        "Json_Param_String": JSON.stringify(saveObj)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1 === "Update successfully"){   
          this.SavefollowUp('BUDGET NOT APPROVED');
        }
      
      })
    }
  }

  
  SavefollowUp(falg){
    if(this.TenderDocID && falg){
      const saveObj = {
        Tender_Doc_ID: this.TenderDocID,									
				Posted_By: this.commonApi.CompacctCookies.User_ID,							 
				Send_To:	this.commonApi.CompacctCookies.User_ID,						       			
				Status:	falg,
				Remarks: falg
      }
      console.log("follow save",saveObj);
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "BL_CRM_Txn_Enq_Tender_Harbauer_Followup_Save",
        "Json_Param_String": JSON.stringify(saveObj)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("follow up save",data);
        if(data[0].Column1 === "SAVED SUCCESSFULLY"){         
          this.TenderDocID = undefined;
          if(falg ==='BUDGET NOT APPROVED'){
            this.Dspinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'Estimate Management ',
              detail: "Succesfully Disapproved."
            });
          }
          if(falg ==='BUDGET APPROVED - TENDER NOT SUBMITTED'){
          this.Aspinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Estimate Management ',
            detail: "Succesfully Approved."
          });
        }
          this.GetPendinApvList();
          this.GetAprvBudgetList();
          this.GetNotAprvBudgetList();
        }
      
      })
    }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error Occured ",
        detail: "Select Assing "
      });
    }
  }
}
