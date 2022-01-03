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
Edit(obj){
  
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