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
import { kill } from 'process';

@Component({
  selector: 'app-tender-harbauer-view',
  templateUrl: './tender-harbauer-view.component.html',
  styleUrls: ['./tender-harbauer-view.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TenderHarbauerViewComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = "Create";
  filterByList = [];
  filteroptionList = [];
  Objsearch = new search();
  TenderSerachFormSubmit = false;
  financalList = [];
  tenderOrgList = [];
  TypeList = [];
  privGovt = [];
 
  PSSpinner = false;
  getAllTenderData = [];
  cols =[];
  PaymentList = [];
  // Update Submission date
    // Last Submission Data
      updateSubmissionmoduleStatus = undefined;
      updateSubmissionmodule = false;
      lastSubmissionDate = new Date();
      bidopenningDate = new Date();
      ActualSubmissionDate = new Date();
      TenderDocID = undefined;
      saveCheck:boolean = false;
      saveButton:boolean = true;
  // Update Finance
  updateFinanceModel = false;
  Spinner = false;
  EMDSpinner = false;
  TenderSpinner = false;
  viewModel = false;
  viewTenderDelete = undefined;
    //EMD Detalis
    ObjEMD = new EMD();
    EMDIssueDate = new Date();
    EMDIssueExpiry = new Date();
    EMDmodeModel = false;
    EMDmodeselect = undefined;
    EMDFormSubmitted = false;
    EMDSubmitted = false;
    // Tender Fees
    ObjTenderFees= new TenderFees();
    TenderFeesIssueDate = new Date();
    TenderFeesIssueExpiry = new Date();
    TenderfeesmodeModel = false;
    Tenderfeesselete = undefined;
    TenderFormSubmitted = false;
    TenderSubmit = false;
    // Performance Security
    ObjPerformanceSecurity= new PerformanceSecurity();
    PerformanceSecurityIssueDate = new Date();
    PerformanceSecurityIssueExpiry = new Date();
    PerformanceSecuritymodeModel = false;
    PerformanceSecurityselete = undefined;
    performanceSubmitted = false;
    psSubmitted = false;
    getAllPSdata:any = [];
    // Add Bider List
      addBiderListModel = false;
      GetBidderList = [];
      bidderName = undefined;
      BidderSubmition = false;
      BidderSpinner = false;
    // Edit
    GetEditdata = [];
    ObjTender:Tender = new Tender()
    editModel = false;
    StateList = [];
    TenderPublishDate = new Date();
    TenderEndDate =  new Date();
    TenderOpenDate = new Date();
    testchips = [];
    editTenderId = undefined;
    TendermasterFormSubmitted = false;
     // Tender Authority
      vieworgList = [];
      ViewModal = false;
      tenderOrg = [];
     tenderAuthFormSummitted = false;

    // Tender Calling Div
    viewcallList = [];
    ViewcallModal = false;
    TenderCallingDivList = [];
    // Tender Execution Div
    viewExecutionList = [];
    ViewExecutionModal = false;
    TenderExecutionDivList = [];
    // Tender Type
    TypeData = [];
    viewtendertypeList = [];
    ViewtendertypeModal = false;
    // Tender Category
    tenderCategoryList = [];
    viewtendercategoryList = [];
    ViewtendercategoryModal = false;
    // Information From
   viewinformationList = [];
   ViewinformationModal = false;
   TenderInfoEnqList = [];
  InformationSubmitted = false;
  InformationName = undefined;
  InformationModal = false;
  InformedDate = new Date();
  PeriodOfWork = undefined;
  TenderOrganization = undefined;
  OrgSubmitted = false;
  OrganizationModal = false;
  BudgetRequidBy = new Date();
  UserList = [];
  CreateLightBoxSubmitted = false;
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
    this.Header.pushHeader({
      Header: "Tender View (GOVT.)",
      Link: "Tender Management -> Update"
    });
    this.filterByList = ['FINANCIAL YEAR','DEPARTMENT',"PRIVATE OR GOVT","TENDER TYPE"];
    this.filteroptionList = ['NOT RECEIVED TENDER','L1 TENDER','NOT SUBMITTED TENDER','PENDING TENDER']
    this.getFinancial();
    this.GetTenderOrgList();
    this.GetTypeList();
    this.privGovt = ["Private","GOVT"]
    this.cols = [
      { field: 'Work_Name', header: 'Name of Work' },
      { field: 'Tender_Authority', header: 'Tender Authority' },
      { field: 'Tender_Value', header: 'Tender Value' },
      { field: 'Tender_Last_Sub_Date', header: 'Tender Last Sub Date' },
      { field: 'State', header: 'State' },
      { field: 'EMD_Amount', header: 'EMD Amount' },
      { field: 'Tender_Publish_Date', header: 'Tender Publish Date' },
      { field: 'Status', header: 'Status' }
  ];
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){

  }
  onReject() {
    this.compacctToast.clear("c");
  }
  changefilterType(){
  this.Objsearch.Filter1_Data_Value = undefined;
  }
  getFinancial(){
    this.$http
    .get("Common/Get_Fin_Year")
    .subscribe((data: any) => {
      this.financalList = data ? JSON.parse(data) : [];
    });
  }
  GetTenderOrgList() {
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Organization_Json")
      .subscribe((data: any) => {
        this.tenderOrgList = data ? JSON.parse(data) : [];
      });
  }
  GetTypeList() {
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Type_Json")
      .subscribe((data: any) => {
        this.TypeList = data ? JSON.parse(data) : [];
      });
  }
  
  SearchTender(valid){
   console.log("valid",valid);
   let searchData:any = []
   this.TenderSerachFormSubmit = true;
   if(valid){
    this.TenderSerachFormSubmit = false
     this.Spinner = true;
    if(this.Objsearch.Filter1_Text === "FINANCIAL YEAR"){
      const filterdata = this.financalList.filter(ob => Number(ob.Fin_Year_ID) === Number(this.Objsearch.Filter1_Data_Value))[0];
      console.log("filterdata",filterdata);
      searchData = {
        Filter1_Text: this.Objsearch.Filter1_Text,
        Filter1_Data_Value:filterdata.Fin_Year_ID,
        Filter1_Data_Text:filterdata.Fin_Year_Name,
        Filter2_Text:this.Objsearch.Filter2_Text ? this.Objsearch.Filter2_Text : "NA"
      }
    }
    else if(this.Objsearch.Filter1_Text === "DEPARTMENT"){
      const filterdata = this.tenderOrgList.filter(ob => Number(ob.Tender_Org_ID) === Number(this.Objsearch.Filter1_Data_Value))[0];
      console.log("filterdata",filterdata);
      searchData = {
        Filter1_Text: this.Objsearch.Filter1_Text,
        Filter1_Data_Value:filterdata.Tender_Org_ID,
        Filter1_Data_Text:filterdata.Tender_Organization,
        Filter2_Text:this.Objsearch.Filter2_Text ? this.Objsearch.Filter2_Text : "NA"
      }
    }
    else if(this.Objsearch.Filter1_Text === "TENDER TYPE"){
      const filterdata = this.TypeList.filter(ob => Number(ob.Tender_Type_ID) === Number(this.Objsearch.Filter1_Data_Value))[0];
      console.log("filterdata",filterdata);
      searchData = {
        Filter1_Text: this.Objsearch.Filter1_Text,
        Filter1_Data_Value:filterdata.Tender_Type_ID,
        Filter1_Data_Text:filterdata.Tender_Type_Name,
        Filter2_Text:this.Objsearch.Filter2_Text ? this.Objsearch.Filter2_Text : "NA"
      }
    }
    else {
      searchData = {
        Filter1_Text: this.Objsearch.Filter1_Text,
        Filter1_Data_Value:this.Objsearch.Filter1_Data_Value,
        Filter1_Data_Text:this.Objsearch.Filter1_Data_Value,
        Filter2_Text:this.Objsearch.Filter2_Text ? this.Objsearch.Filter2_Text : "NA"
      }
    }
  console.log("search data",searchData);
  const obj = {
    "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
    "Report_Name_String": "Get_All_Tender_Browse_V2",
    "Json_Param_String" : JSON.stringify(searchData)
  }
  this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        console.log(data);
        this.getAllTenderData = data;
        this.Spinner = false;
        
      })

   }
  }
  // Update Submission Date
  updateSubmission(obj){
    this.updateSubmissionmoduleStatus = undefined;
  if(obj.Tender_Doc_ID){
    this.TenderDocID = obj.Tender_Doc_ID;
    this.updateSubmissionmoduleStatus = obj.Status;
   this.updateSubmissionmodule = true;
   this.getSubmissionData(obj.Tender_Doc_ID);
  }
  }
  saveSubmissionDate(value){
    console.log("value",value);
    let tempSavedata:any = [];
    let reportName = undefined;
    if(this.TenderDocID){
      // tempSavedata = {
      //   Tender_Doc_ID	: this.TenderDocID,      
      //   Tender_Last_Sub_Date : this.DateService.dateTimeConvert(new Date(this.lastSubmissionDate)),
      //   Tender_Bid_Opening_Date : this.DateService.dateTimeConvert(new Date(this.bidopenningDate))
      // }
      if(value==="Last Submission Date"){
        tempSavedata = {
          Tender_Doc_ID	: this.TenderDocID,      
          Tender_Last_Sub_Date : this.DateService.dateTimeConvert(new Date(this.lastSubmissionDate))
         }
         reportName="Update_Last_Submission_Date";
       }
       else if(value==="Bid Openning Date"){
        tempSavedata = {
          Tender_Doc_ID	: this.TenderDocID,      
          Tender_Bid_Opening_Date : this.DateService.dateTimeConvert(new Date(this.bidopenningDate))
         }
         reportName="Update_Bid_Opening_Date";
       }
       else if(value="Actual Submission Date"){
        tempSavedata = {
          Tender_Doc_ID	: this.TenderDocID,      
          Tender_Publish_Date : this.DateService.dateTimeConvert(new Date(this.ActualSubmissionDate))
         }
         reportName="Update_Tender_Publish_Date";
         this.updateSubmissionmoduleStatus = "TENDER SUBMITTED"
       }
       else{
         console.log("other");
       }
      console.log("Submission Date Save",tempSavedata);
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": reportName,
        "Json_Param_String" : JSON.stringify([tempSavedata])
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
            console.log("date",data);
            if(data[0].message === 'Update done'){
             this.SavefollowUp(this.TenderDocID,this.updateSubmissionmoduleStatus,value);
            }
          })
    }
    
  }
  SavefollowUp(TenderDocID,status,value){
    if(TenderDocID){
      const saveObj = {
        Tender_Doc_ID: TenderDocID,									
				Posted_By: this.commonApi.CompacctCookies.User_ID,							 
				Send_To:	this.commonApi.CompacctCookies.User_ID,						       			
				Status:	status,
				Remarks: "Update done"
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
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Update "+value+" Succesfully"
          });
          this.SearchTender(true);
          this.getSubmissionData(TenderDocID);
        }
      
      })
    }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error Occured ",
        detail: "Try again"
      });
    }
  }
  
  getSubmissionData(TenderDocID){
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Submission_Date",
      "Json_Param_String" : JSON.stringify([{Tender_Doc_ID : TenderDocID}])
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log("date[0]",data[0].Tender_Last_Sub_Date);
          console.log("date",data.Tender_Last_Sub_Date);
          console.log("date",data);

          this.lastSubmissionDate = data[0].Tender_Last_Sub_Date ? new Date(data[0].Tender_Last_Sub_Date) : new Date();
          this.bidopenningDate = data[0].Tender_Bid_Opening_Date ? new Date(data[0].Tender_Bid_Opening_Date) : new Date();
          this.ActualSubmissionDate = data[0].Tender_Publish_Date ? new Date(data[0].Tender_Publish_Date) : new Date();
          console.log("this.lastSubmissionDate",this.lastSubmissionDate);
        })
  }
  // Update Finance

  updateFinance(obj){
    this.TenderDocID = undefined;
    if(obj.Tender_Doc_ID){
      this.updateFinanceModel = true;
      this.TenderDocID = obj.Tender_Doc_ID;
      this.ObjEMD = new EMD();
      this.ObjTenderFees = new TenderFees();
      this.ObjPerformanceSecurity = new PerformanceSecurity()
      this.PerformanceSecurityIssueDate = new Date();
      this.PerformanceSecurityIssueExpiry = new Date();
      this.EMDSubmitted = false;
      this.TenderSubmit = false;
      this.psSubmitted = false;
      this.getAllPSdata = [];
      this.GetPaymentList();
      this.ifHaveEMDdata(obj.Tender_Doc_ID);
      this.ifHaveTenderdata(obj.Tender_Doc_ID);
      this.ifHavePSdata(obj.Tender_Doc_ID);

    }
  }
  EmdmodeCreate(){
    this.EMDmodeModel = true;
    this.EMDmodeselect = undefined;
    this.EMDFormSubmitted = false;
  }
  TenderFeesModeCreate(){
    this.TenderfeesmodeModel = true;
    this.Tenderfeesselete = undefined;
  }
  AddPS(valid){
    console.log(valid)
    if(valid){
       let adddata = {
        Date_Of_Exp : this.DateService.dateTimeConvert(new Date(this.PerformanceSecurityIssueExpiry)),
        Date_Of_Issue : this.DateService.dateTimeConvert(new Date(this.PerformanceSecurityIssueDate)),
        Mode :this.ObjPerformanceSecurity.Mode,
        Reference_No: this.ObjPerformanceSecurity.Reference_No,
        Voucher_No : this.ObjPerformanceSecurity.Voucher_No,
        Amount: this.ObjPerformanceSecurity.Amount,
        Tender_Doc_ID : this.TenderDocID,         
        Fees_Type:"Performance Security"
       }
      this.getAllPSdata.push(adddata);
      this.ObjPerformanceSecurity = new EMD();
      this.PerformanceSecurityIssueDate = new Date();
      this.PerformanceSecurityIssueExpiry = new Date();
    }
    
  }
  PerformanceSecurityModeCreate(){
    this.PerformanceSecuritymodeModel = true;
    this.PerformanceSecurityselete = undefined;
  }
  SaveFinance(valid,FeesType){
    console.log("valid",valid);
    console.log("FeesType",FeesType);
    let saveData:any = []
    FeesType === 'EMD Details' ? this.EMDSubmitted = true: FeesType === 'Tender Fees' ? this.TenderSubmit = true : this.psSubmitted = true;
    if(valid){
      
       if(FeesType === 'EMD Details'){
         this.EMDSubmitted = false;
         this.EMDSpinner = true;
        this.ObjEMD.Tender_Doc_ID = this.TenderDocID;
        this.ObjEMD.Fees_Type = FeesType;
        this.ObjEMD.Date_Of_Issue = this.DateService.dateTimeConvert(new Date(this.EMDIssueDate));
        this.ObjEMD.Date_Of_Exp = this.DateService.dateTimeConvert(new Date(this.EMDIssueExpiry));
        console.log(this.ObjEMD);
        saveData = this.ObjEMD
       }
       else if(FeesType === 'Tender Fees'){
         this.TenderSubmit = false;
         this.TenderSpinner = true;
        this.ObjTenderFees.Tender_Doc_ID = this.TenderDocID;
        this.ObjTenderFees.Fees_Type = FeesType;
        this.ObjTenderFees.Date_Of_Issue = this.DateService.dateTimeConvert(new Date(this.TenderFeesIssueDate));
        this.ObjTenderFees.Date_Of_Exp = this.DateService.dateTimeConvert(new Date(this.TenderFeesIssueExpiry))
        console.log(this.ObjTenderFees);
        saveData = this.ObjTenderFees
      }
       else if(FeesType === 'Performance Security'){
        this.psSubmitted = false;
         this.PSSpinner = true;
         saveData = this.getAllPSdata;
      }
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "Update_Tender_Harbaur_Fee",
        "Json_Param_String": JSON.stringify(saveData)
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
         console.log(data);
         if(data[0].Column1 === "SAVED SUCCESSFULLY"){
          this.SavefollowUpFinance(this.TenderDocID,FeesType);
        }
        
        })
    
    }
  }
  SavefollowUpFinance(TenderDocID,FeesType){
    if(TenderDocID){
      const saveObj = {
        Tender_Doc_ID: TenderDocID,									
				Posted_By: this.commonApi.CompacctCookies.User_ID,							 
				Send_To:	this.commonApi.CompacctCookies.User_ID,						       			
				Status:	FeesType,
				Remarks: FeesType+" Update done"
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
           this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: FeesType+" Succesfully save"
          });
          FeesType === 'EMD Details' ? this.ObjEMD = new EMD(): FeesType === 'Tender Fees' ? this.ObjTenderFees = new TenderFees() : this.ObjPerformanceSecurity = new PerformanceSecurity()
          this.SearchTender(true)
        }
      
      })
    }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error Occured ",
        detail: "Try again"
      });
    }
    this.EMDSpinner = false;
    this.TenderSpinner = false;
    this.PSSpinner = false;
  }
  CreateEMDmode(valid){
    this.EMDFormSubmitted = true;
   if(valid){
    this.EMDFormSubmitted = false;
    const obj = {
      Tender_Payment_Mode : this.EMDmodeselect
    }
    this.$http.post("/BL_CRM_Txn_Enq_Tender/Create_Tender_Payment_Type", obj).subscribe((data: any) => {
      if (data.success) {
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully Tender Payment Mode Created"
        });
      this.GetPaymentList();
      this.EMDFormSubmitted = false;
      this.EMDmodeselect = undefined;
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
    }
    })
   }
  }
  CreateTenderfeesmode(valid){
    console.log("valid",valid)
    this.TenderFormSubmitted = true;
    if(valid){
      this.TenderFormSubmitted = false;
      const obj = {
        Tender_Payment_Mode : this.Tenderfeesselete
      }
      this.$http.post("/BL_CRM_Txn_Enq_Tender/Create_Tender_Payment_Type", obj).subscribe((data: any) => {
        if (data.success) {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Tender Payment Mode Created"
          });
          this.GetPaymentList();
        this.TenderFormSubmitted = false;
        this.Tenderfeesselete = undefined;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
      })
     }
  }
  CreatePerformanceSecuritymode(valid){
   console.log("valid",valid);
   this.performanceSubmitted = true;
   if(valid){
    this.performanceSubmitted = false;
    const obj = {
      Tender_Payment_Mode : this.PerformanceSecurityselete
    }
    this.$http.post("/BL_CRM_Txn_Enq_Tender/Create_Tender_Payment_Type", obj).subscribe((data: any) => {
      if (data.success) {
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully Tender Payment Mode Created"
        });
        this.GetPaymentList();
      this.performanceSubmitted = false;
      this.PerformanceSecurityselete = undefined;
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
    }
    })
   }
  }
  GetPaymentList() {
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Payment_Type_Json")
      .subscribe((data: any) => {
        this.PaymentList = data ? JSON.parse(data) : [];
        console.log("PaymentList",this.PaymentList);
      });
  }
  commView(){
   this.GetPaymentList();
   this.viewModel = true;
  }
  Deleteview(k) {
    this.viewTenderDelete = undefined;
   if(k){
    this.viewTenderDelete = k;
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
    if(this.viewTenderDelete){
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "Delete_Payment_Mode",
        "Json_Param_String": JSON.stringify([{Tender_Payment_Mode_ID : this.viewTenderDelete}])
      }
      this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        console.log("data",data)
        if(data[0].Column1 === "Deleted Successfully"){
          this.GetPaymentList();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Tender Payment Mode ID "+this.viewTenderDelete,
            detail: "Succesfully Delete"
          });
        }
      })
    }
  }
  ifHaveEMDdata(DocID){
   if(DocID){
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_EMD_Details",
      "Json_Param_String": JSON.stringify([{Tender_Doc_ID : DocID}])
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
       if(data[0]){
        this.ObjEMD = data[0]
        this.EMDIssueDate = new Date(data[0].Date_Of_Issue);
        this.EMDIssueExpiry = new Date(data[0].Date_Of_Exp);
        console.log("EMD",this.ObjEMD);
       }
        
      })
   }
  }
  ifHaveTenderdata(DocID){
    if(DocID){
     const obj = {
       "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
       "Report_Name_String": "Get_Tender_Fees",
       "Json_Param_String": JSON.stringify([{Tender_Doc_ID : DocID}])
     }
     this.GlobalAPI
       .getData(obj)
       .subscribe((data: any) => {
         if(data[0]){
          this.ObjTenderFees = data[0]
          this.TenderFeesIssueDate = new Date(data[0].Date_Of_Issue);
          this.TenderFeesIssueExpiry = new Date(data[0].Date_Of_Exp);
          console.log("Tender",this.ObjTenderFees);
         }
        
       })
    }
   }
   ifHavePSdata(DocID){
    if(DocID){
     const obj = {
       "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
       "Report_Name_String": "Get_Performance_Security",
       "Json_Param_String": JSON.stringify([{Tender_Doc_ID : DocID}])
     }
     this.GlobalAPI
       .getData(obj)
       .subscribe((data: any) => {
         if(data[0]){
           console.log("PS Data", data[0]);
          this.getAllPSdata = data;
         }
         
       })
    }
   }
 // Add Bider List
 addBidderList(obj){
  this.TenderDocID = undefined;
  if(obj.Tender_Doc_ID){
     this.addBiderListModel = true;
      this.GetBidderList = [];
      this.bidderName = undefined;
      this.BidderSubmition = false;
      this.BidderSpinner = false;
      this.TenderDocID = obj.Tender_Doc_ID;
     this.getBidderList(obj.Tender_Doc_ID);
  }
 }
 getBidderList(DocID){
  const obj = {
    "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
    "Report_Name_String": "Get_BL_CRM_Txn_Enq_Tender_Bidder",
    "Json_Param_String": JSON.stringify([{Tender_Doc_ID : DocID}])
  }
  this.GlobalAPI
    .getData(obj)
    .subscribe((data: any) => {
     this.GetBidderList = data;
     console.log("Bidder List",this.GetBidderList);
    })
 }
 SaveBidder(valid){
   this.BidderSubmition = true;
  if(valid){
    this.BidderSpinner = true;
     const tempSaveData = {
      Bidder_Name : this.bidderName,
      Tender_Doc_ID : this.TenderDocID
     }
     const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "BL_CRM_Txn_Enq_Tender_Create_Bidder",
      "Json_Param_String": JSON.stringify([tempSaveData])
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
       console.log("save Data", data);
       if(data[0].Column1 === "SAVED SUCCESSFULLY"){
        this.BidderSubmition = false;
        this.getBidderList(this.TenderDocID);
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Bidder Name Succesfully Save"
        });
        this.BidderSubmition = false;
        this.BidderSpinner = false;
        this.bidderName = undefined;
       }
      })
  }
 }
 DeleteBidderName(BidderId){
  console.log("Bidder Id",BidderId)
 }
 checkChange(){
   this.saveButton = this.saveCheck ? false : true;
 }

//  Edit
async Edit(col:any){
  if(col.Tender_Doc_ID){
    this.editTenderId = undefined;
    this.editTenderId = col.Tender_Doc_ID;
    this.editModel = true;
    this.testchips = [];
    this.ObjTender = new Tender();
    this.TendermasterFormSubmitted = false;
   await this.GetTenderOrg();
   await this.GetTenderCallingDiv();
   await this.GetTenderExecutionDiv();
   await this.GetType();
   await this.GetTenderCategoryList();
   await this.GetStateList();
   await this.getAssignforbudget();
   await this.GetTenderInfoEnqSRC();
   await this.GetAllEditData(col.Tender_Doc_ID);
   await this.getThenderWorkLocation(col.Tender_Doc_ID);
   
  }
}
GetAllEditData(DocID){
  const obj = {
    "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
    "Report_Name_String": "Get_BL_CRM_Txn_Enq_Tender_Harbauer_Data",
    "Json_Param_String": JSON.stringify([{Tender_Doc_ID : DocID}])
  }
  this.GlobalAPI
    .getData(obj)
    .subscribe((data: any) => {
      if(data[0]){
        this.ObjTender = data[0];
        this.InformedDate = new Date(data[0].Tender_Informed_Date);
        this.BudgetRequidBy = new Date(data[0].Budget_Required_By);
        this.TenderOpenDate = new Date(data[0].Tender_Bid_Opening_Date);
        this.TenderEndDate = new Date(data[0].Tender_Last_Sub_Date);
        this.TenderPublishDate = new Date(data[0].Tender_Publish_Date)
      }
      console.log("ObjTender",this.ObjTender);
      
    })
}
getThenderWorkLocation(DocID){
  const obj = {
    "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
    "Report_Name_String": "Get_BL_CRM_Txn_Enq_Tender_Work_Location_Data",
    "Json_Param_String": JSON.stringify([{Tender_Doc_ID : DocID}])
  }
  this.GlobalAPI
    .getData(obj)
    .subscribe((data: any) => {
       if(data){
        this.testchips = data;
        // data.forEach(ele => {
        //   this.testchips.push(ele.Work_Location)
        // });
      }
      console.log("testchips",this.testchips);

    })
}
checkChip(e) { 
 const val =  this.testchips.indexOf(e.value);
 this.testchips.splice(val,1);
  this.testchips.push({"Tender_Doc_ID":this.editTenderId,"Work_Location":e.value});
}
// Check Tender Name
CheckIfTenderNameExist(){
  if(this.ObjTender.Tender_Name) {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    const params = new HttpParams().set("Tender_Name", this.ObjTender.Work_Name);
  this.$http
    .get("/BL_CRM_Txn_Enq_Tender/Check_Tender_Name_Exist?Tender_Name="+ this.ObjTender.Work_Name, {headers: headers, responseType: 'text'})
    .subscribe((data: any) => {
      if(data === 'True') {
        this.ObjTender.Tender_Name = undefined;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          life: 5000,
          summary: "Tender Name Error Message",
          detail: "Work Title Already Exist."
        });
      }
    });
  }
}
// Tender Authority create View
    CreateOrganization(valid){
      this.tenderAuthFormSummitted = true;
      console.log("valid",valid);
      if(valid) {
          this.Spinner = true;
          const obj = {
              "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
              "Report_Name_String" : "Create_Tender_Organization",
              "Json_Param_String": JSON.stringify({Tender_Organization: this.TenderOrganization}),
            }
            this.GlobalAPI.postData(obj).subscribe((data:any)=>{
            console.log(data)
          if (data[0].Column1) {
            this.Spinner = false;
            this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "",
                detail: "Succesfully Tender Authority Created"
              });
            this.GetTenderOrg();
            this.TenderOrganization = undefined;
            this.tenderAuthFormSummitted = false;
            this.OrganizationModal = false;
            this.Spinner = false;
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
          });
      }
    }
    ViewOrganization(){
      this.vieworgList = [];
      this.ViewModal = true;
      this.GetTenderOrg();
    }
    GetTenderOrg() {
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String" : "Get_Tender_Organization",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.tenderOrg = data;
        console.log("tenderOrg",this.tenderOrg);
    });
    }
    ToggleOrganization(){
      this.TenderOrganization = undefined;
      this.OrgSubmitted = false;
      this.OrganizationModal = true;
      this.Spinner = false;
    }
//Tender Calling Div
    GetTenderCallingDiv() {
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String" : "Get_BL_CRM_Mst_Enq_Tender_Calling_Div",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.TenderCallingDivList = data;
        });
    }
    ViewCallingDiv(){
      this.viewcallList = [];
      this.ViewcallModal = true;
      this.GetTenderCallingDiv();
    }
 // Tender Execution Div
    GetTenderExecutionDiv() {
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String" : "Get_BL_CRM_Mst_Enq_Tender_Execution_Div",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.TenderExecutionDivList = data;
        });
    }
    ViewExecutionDiv(){
      this.viewExecutionList = [];
      this.ViewExecutionModal = true;
      this.GetTenderExecutionDiv();
    }
    // Light Box Save
    LightBoxSave(val,field) {
  console.log(val)
  if(this[val]) {
    const obj = {};obj[field] = this[val];
    let reportname;
    let refreshFunction;
    if(field === 'Tender_Calling_Div_Name') {
      reportname = 'Create_BL_CRM_Mst_Enq_Tender_Calling_Div'
      refreshFunction = 'GetTenderCallingDiv';
     // this.GetTenderCallingDiv();
    }
    if(field === 'Tender_Execution_Div_Name') {
      reportname = 'Create_BL_CRM_Mst_Enq_Tender_Execution_Div'
      refreshFunction = 'GetTenderExecutionDiv';
      //this.GetTenderExecutionDiv();
    }
    if(field === 'Tender_Type_Name') {
      reportname = 'Create_BL_CRM_Mst_Enq_Tender_Type'
      refreshFunction = 'GetTypeList';
      //GetTypeList();
    }
    if(field === 'Tender_Category_Name') {
      reportname = 'Create_BL_CRM_Mst_Enq_Tender_Category'
      refreshFunction = 'GetTenderCategoryList';
      //this.GetTenderCategoryList();
    }
    // if(field === 'Enq_Source_Name') {
    //   UrlAddress = '/BL_CRM_Txn_Enq_Tender/Create_Tender_Enq_Source'
    //   refreshFunction = 'GetTenderCallingDiv';
    // }
    this.Spinner = true;
    const Obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String" : reportname,
      "Json_Param_String": JSON.stringify(obj),
    }
    this.GlobalAPI.getData(Obj).subscribe((data:any)=>{
    //   this.tenderOrgList = data;
    // this.$http.post(UrlAddress, obj).subscribe((data: any) => {
      console.log(data)
    if (data[0].Column1) {
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully "+field+" Created"
        });
      this[refreshFunction]();
      this.CreateLightBoxSubmitted = false;
      this[val] = undefined;
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
    }
    });

  }
}
// Tender Id Check
CheckIfTenderIDExist(){
  if(this.ObjTender.Tender_ID) {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    // const params = new HttpParams().set("Tender_ID", this.ObjTender.Tender_ID);
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Check_Tender_ID_Exist?Tender_ID="+this.ObjTender.Tender_ID , {headers: headers, responseType: 'text'})
      .subscribe((data: any) => {
        console.log(data);
        if(data === 'True') {
          this.ObjTender.Tender_ID = undefined;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            life: 5000,
            summary: "Tender ID Error Message",
            detail: "Tender ID Already Exist."
          });
        }
      });
  }
}

   // Tender Type
   GetType() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String" : "Get_BL_CRM_Mst_Enq_Tender_Type",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.TypeData = data;
      });
  }
  ViewTenderType(){
    this.viewtendertypeList = [];
    this.ViewtendertypeModal = true;
    this.GetTypeList();
  }
  // Tender Category
  GetTenderCategoryList() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String" : "Get_BL_CRM_Mst_Enq_Tender_Category",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.tenderCategoryList = data;
    });
  }
  Viewcategory(){
    this.viewtendercategoryList = [];
    this.ViewtendercategoryModal = true;
    this.GetTenderCategoryList();
  }
  // Get State List
  GetStateList() {
    this.$http
    .get("/Common/Get_State_List")
    .subscribe((data: any) => {
      this.StateList = data.length ? data : [];
    });
   }
  // Information From

  Viewinformation(){
    this.viewinformationList = [];
    this.ViewinformationModal = true;
    this.GetTenderInfoEnqSRC();
  }
  GetTenderInfoEnqSRC() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String" : "Get_BL_Enq_Source_Master",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.TenderInfoEnqList = data;
        console.log("TenderInfoEnqList",this.TenderInfoEnqList);
      });
  }
  ToggleInformation(){
    this.InformationSubmitted = false;
    this.InformationName = undefined;
    this.InformationModal = true;
    this.Spinner = false;
   }
   getAssignforbudget(){
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_User"
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.UserList = data;
       console.log('UserList =',this.UserList)
     })
  }
  CreateInformation(valid){
    this.InformationSubmitted = true;
    if(valid) {
        this.Spinner = true;
        const obj = {
          "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
          "Report_Name_String" : "Create_BL_Enq_Source_Master",
          "Json_Param_String": JSON.stringify({Enq_Source_Name: this.InformationName}),
        }
        this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      
          console.log(data)
        if (data[0].Column1) {
            this.Spinner = false;
           this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Information Created"
            });
        
          this.GetTenderInfoEnqSRC();
          this.InformationSubmitted = false;
          this.InformationName = undefined;
          this.InformationModal = false;
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
        });
    }
    }
  SaveTenderMaster(valid){
    this.TendermasterFormSubmitted = true;
    if(valid){
    console.log("save Data",this.ObjTender);
    this.ObjTender.Tender_Publish_Date = this.DateService.dateTimeConvert(new Date(this.TenderPublishDate));
    this.ObjTender.Tender_Last_Sub_Date = this.DateService.dateTimeConvert(new Date(this.TenderEndDate));
    this.ObjTender.Tender_Bid_Opening_Date = this.DateService.dateTimeConvert(new Date(this.TenderOpenDate));
    this.ObjTender.Tender_Informed_Date = this.DateService.dateTimeConvert(new Date(this.InformedDate));
    this.ObjTender.Budget_Required_By = this.DateService.dateTimeConvert(new Date(this.BudgetRequidBy));
    const infoName = this.TenderInfoEnqList.filter(el=>Number(el.Enq_Source_ID) ===Number(this.ObjTender.Enq_Source_ID));
    console.log("InfoName",infoName[0]);
    this.ObjTender.Tender_Publishing_Info_From = infoName[0].Enq_Source_Name;
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Tender_Govt_Update",
      "Json_Param_String": JSON.stringify([this.ObjTender]),
      "Json_1_String": JSON.stringify(this.testchips)
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        if(data[0].Column1){
          this.TendermasterFormSubmitted = false;
          this.ObjTender = new Tender();
          this.testchips =[];
          this.editModel = false;
          this.SearchTender(true);
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         //summary: "Return_ID  " + tempID,
         detail: "Succesfully Update" 
       });
        }
       else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
       }
        console.log("After Save",data);
      })
    
   }
  }
}
class search{
  Filter1_Text:string;
  Filter1_Data_Value:string;
  Filter2_Text :string;
}
class EMD{
  Tender_Doc_ID:any;         
  Fees_Type:any;	
  Mode:any;      
  Voucher_No :any;  
  Reference_No :any; 
  Date_Of_Issue :any;  
  Date_Of_Exp:any;
  Amount:number= 0;
}
class TenderFees{
  Tender_Doc_ID:any;         
  Fees_Type:any;	
  Mode:any;      
  Voucher_No :any;  
  Reference_No :any; 
  Date_Of_Issue :any;  
  Date_Of_Exp:any;
  Amount:number = 0
}
class PerformanceSecurity{
  Tender_Doc_ID:any;         
  Fees_Type:any;	
  Mode:any;      
  Voucher_No :any;  
  Reference_No :any; 
  Date_Of_Issue :any;  
  Date_Of_Exp:any;
  Amount:number
}
class Tender{
        Tender_Doc_ID :number;
				Cost_Cen_ID : number;
				User_ID : number;	
				Work_Name : string;							
				Work_Details : string;
        Tender_Name:string;				
				Tender_Org_ID:number;
				Tender_Calling_Div_ID:number;
				Tender_Execution_Div_ID:number;
				Tender_Ref_No:string;
				Tender_ID:number;
				Tender_Type_ID:number;
				Tender_Category_ID:number;
        Tender_Amount : number;
				State:string;				
        Tender_Value:any;
				Tender_Publish_Date:string;
				Tender_Last_Sub_Date:string;
				Tender_Bid_Opening_Date:string;
				EMD_Amount:string;
				T_Fee_Amount:string;
				Enq_Source_ID:number;
				Tender_Informed_Date:string;
				Period_Of_Working:string;
				Budget_Required_By:string;
				Govt_Proposal:string;
        Tender_Publishing_Info_From:any
}