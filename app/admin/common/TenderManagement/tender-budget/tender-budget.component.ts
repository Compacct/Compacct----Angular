import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import {CompacctGetDistinctService } from "../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";
declare var $:any;
import * as XLSX from 'xlsx';
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';

@Component({
  selector: 'app-tender-budget',
  templateUrl: './tender-budget.component.html',
  styleUrls: ['./tender-budget.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TenderBudgetComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  menuList = [];
  Spinner = false;
  buttonname = "Create";

  budGetreqList = [];
  budGetsubList = [];
  createBudgetmodel = false;
  tenderDocID = undefined;

  createBudgetFormSubmitted = false;

  createBudgetbox = undefined
  assingList = [];
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService,
    
  ) { }

  ngOnInit() {
    this.items = ["Budget REQ", "Budget SUB"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Budget",
      Link: "Project Management -> Budget"
    });
    this.budGetreqList = [];
    this.budGetsubList = [];
    this.GetBudgetreq();
    this.GetBudgetSub();
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){}
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["Budget REQ", "Budget SUB"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){
    this.createBudgetmodel = false;
  }
  GetBudgetreq(){
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Budget_Required_Tab",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.budGetreqList = data;
     console.log("REQ",this.budGetreqList);
    })
  }
  GetBudgetSub(){
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Budget_Sub_Tab",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.budGetsubList = data;
     console.log("SUB",data);
    })
  }
  createBudget(obj){
   if(obj.Tender_Doc_ID){
    this.createBudgetmodel = true;
    this.createBudgetbox = undefined;
    this.Spinner = false;
    this.tenderDocID = obj.Tender_Doc_ID;
    this.GetAssing();
   }
  }
  GetAssing(){
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_User"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.assingList = data;
     console.log("assing ",this.assingList);
    })
  }
  saveBudget(valid){
    console.log("valid",valid);
    this.createBudgetFormSubmitted = true;
    if(valid){
      this.createBudgetFormSubmitted = false;
      this.Spinner = true;
   const tempObj = {
    Tender_Doc_ID : this.tenderDocID
  }
  const obj = {
    "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
    "Report_Name_String": "Update_Budget_Created",
    "Json_Param_String": JSON.stringify(tempObj)
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("create",data);
    if(data[0].Column1){
     this.SavefollowUp();
    }
    else {
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error Occured ",
          detail: "try again"
        });
    }
   
  })
    }
  
  }
  SavefollowUp(){
    if(this.createBudgetbox){
      const saveObj = {
        Tender_Doc_ID: this.tenderDocID,									
				Posted_By: this.commonApi.CompacctCookies.User_ID,							 
				Send_To:	this.createBudgetbox,						       			
				Status:	"BUDGET CREATED",
				Remarks: "BUDGET CREATED"
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
          this.Spinner = false;
          this.createBudgetmodel = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Budget Created Succesfully"
          });
          this.GetBudgetreq();
          this.GetBudgetSub();
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
