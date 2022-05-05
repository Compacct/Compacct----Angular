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
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  TenderType = undefined;
  TenderCategory = undefined; 
  TenderExecutionDiv = undefined;
  PSSpinner = false;
  getAllTenderData = [];
  cols =[];
  BidEditFlag = false;
  PaymentList = [];
  TenderCallingDiv = undefined;
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
  DivisionSubmitted = false;
  // Bid Openning & AOC
   BidOpenningModel = false;
   ObjBidOpeningList = new BidOpeningList(); 
   BidOpeningListFormSubmitted = false;
   tenderValue = undefined;
   BidOpenListView = [];
   BidTenderId = undefined;
   BidOpenListViewByRate = [];
    BidOpenListViewByRateFlag = false;
   BidOpenListViewByLotteryFlag = false;
   TenderDetails:any = {};
   BidOpenListViewByLottery: Array<RankBidOpeningList> = [];
   ObjAgreement = new Agreement();
   ReasonSelect = [];
   AgreementSubmitted = false;
   ReasonList =[];
  ReasonSubmitted = false;
  ReasonName = undefined;
  ReasonModal = false;
  ObjBidOpening = new BidOpening();
  SpinnerAg = false;
  CompletionDate = new Date();
  CommencementDate = new Date();

  AgreementList =[];
  TenderWorkName = undefined;

  
  ViewTenderID = undefined;
  TenderviewModel = false;

  EstimateProductChangeModal = false;
  ShowAddedEstimateProductList = [];
  rowGroupMetadata: any;
  SpinnerProd = false;
  colsForProduct = [{
      field: 'SL_No',
      header: 'SL No.'
    },
    {
      field: 'Budget_Group_Name',
      header: 'Group Name'
    },
    {
      field: 'Budget_Sub_Group_Name',
      header: 'Sub Group Name'
    },
    {
      field: 'Work_Details',
      header: 'Work Details'
    },
    {
      field: 'Site_Description',
      header: 'Site'
    },
    {
      field: 'Product_Description',
      header: 'Product'
    },
    {
      field: 'unit',
      header: 'Unit'
    },
    {
      field: 'Qty',
      header: 'Qty'
    },
    {
      field: 'Nos',
      header: 'Nos'
    },
    {
      field: 'TQty',
      header: 'Total Qty'
    },
    {
      field: 'UOM',
      header: 'UOM'
    },
    {
      field: 'saleRate',
      header: 'Sale Rate'
    },
    {
      field: 'Sale_Amount',
      header: 'Sale Amount'
    },
    {
      field: 'Rate',
      header: 'Purchase Rate'
    },
    {
      field: 'Amount',
      header: 'Purchase Amount'
    },
    {
      field: 'Changed_Sale_Rate',
      header: 'Changed Sale Rate'
    },
    {
      field: 'Changed_Sale_Amount',
      header: 'Changed Sale Amount'
    },
    {
      field: 'Changed_Rate',
      header: 'Changed Purchase Rate'
    },
    {
      field: 'Changed_Amount',
      header: 'Changed Purchase Amount'
    }
  ];
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService,
    private ngxService: NgxUiLoaderService
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
    
    this.GetReasonList();
    this.privGovt = ["Private","GOVT"]
    this.cols = [
      { field: 'Tender_ID', header: 'Tender ID' },
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

  
  viewTender(col:any){
    this.ViewTenderID = undefined;
    if(col.Tender_Doc_ID){
      this.ngxService.start();
     this.ViewTenderID = col.Tender_Doc_ID; 
     setTimeout(()=>{
      this.TenderviewModel = true;
      this.ngxService.stop();
    },1200)
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
    this.psSubmitted = true;
    if(valid){
      this.psSubmitted = false;
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
    "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_step2",
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
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_step2",
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
     const tempSaveData = {
      Bidder_ID : BidderId
     }
     const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_step2",
      "Report_Name_String": "Delete_BL_CRM_Txn_Enq_Tender_Bidder",
      "Json_Param_String": JSON.stringify([tempSaveData])
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
       if(data[0].Column1){
        this.getBidderList(this.TenderDocID);
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Bidder Name Succesfully Deleted"
        });
       }
      })
 }
 checkChange(){
   this.saveButton = this.saveCheck ? false : true;
 }

//  Edit
async Edit(col:any){
  console.log("col",col);
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
  // Bid Opeing & AOC
  ViewBidOpening(col){
   console.log("col",col);
   this.BidOpenListViewByRateFlag = false;
   this.BidOpenListViewByLotteryFlag = false;
   this.BidTenderId = undefined;
   this.ObjAgreement = new Agreement();
   this.BidOpeningListFormSubmitted = false;
   this.ObjBidOpeningList = new BidOpeningList();
   this.BidOpenListView = [];
   this.BidOpenListViewByRate = [];
   this.BidOpenListViewByLottery = [];
   this.AgreementList = [];
   this.TenderWorkName = undefined;
   this.ObjBidOpening = new BidOpening();
   this.ReasonSelect = [];
   if(col.Tender_Doc_ID){
    this.ngxService.start();
    this.TenderWorkName = col.Work_Name;
    this.BidTenderId = col.Tender_Doc_ID;
    this.getBidderList(col.Tender_Doc_ID);
    this.GetIFBidExist(col.Tender_Doc_ID);
    this.GetAgreementList(col.Tender_Doc_ID);
   }
  }
  GetAgreementList(TenderDocID) {
    if(TenderDocID) {
      const obj = {
        "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
        "Report_Name_String" : "Get_Tender_Agreement_And_Final_Value_Harbour",
        "Json_Param_String": JSON.stringify({Tender_Doc_ID:TenderDocID}),
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{ 
        if(data.length && data[0].Status) {
          if(data[0].Status === 'AWARDING THE TENDER' && data[0].Agreement_Number){
            this.ObjBidOpening.Financial_Bid_Status = data[0].Status;
            this.AgreementList = data;
            this.ObjAgreement.Tender_Negotiated_Value = data[0].Agreement_Number;
            this.ObjAgreement.Tender_Doc_ID = TenderDocID;
          }
          if(data[0].Status === 'NOT- AWARDING THE TENDER' && data[0].Not_Awarding_Reason){    
            this.ObjBidOpening.Financial_Bid_Status = data[0].Status; 
            this.ReasonSelect = data[0].Not_Awarding_Reason.split(',');
            console.log(this.ReasonSelect)
          }
        }
        
        });
    }
  }
  GetIFBidExist(TenderDocID) {
    if(TenderDocID) {
       this.GetBidOpenList(TenderDocID);
            // if(obj.Financial_Bid_Status === 'AWARDING THE TENDER') {
            // this.ISDAmountChange(obj.ISD_Amount);
            // this.APSDAmountChange(obj.APSD_Amount);
            // this.ISDMaturityAmountChange(obj.ISD_Maturity_Amount);
            // this.APSDMaturityAmountChange(obj.APSD_Maturity_Amount);
            // this.GetDivision(obj.Circle)
            // if(obj.ISD_FD_Amount){
            //   this.ISDFDAmountChange(obj.ISD_FD_Amount);
            // }
            // if(obj.ISD_FD_Mature_Amount){
            //   this.ISDFDMaturityAmountChange(obj.ISD_FD_Mature_Amount);
            // }
            // if(obj.APSD_FD_Amount){
            //   this.APSDFDAmountChange(obj.APSD_FD_Amount);
            // }
            // if(obj.APSD_FD_Mature_Amount){
            //   this.APSDFDMaturityAmountChange(obj.APSD_FD_Mature_Amount);
            // }
            // this.AgreementValueAmountChange(obj.Agreement_Value);
            // this.ISDReleaseDate = new Date(obj.ISD_Release_Date);
            // this.APSDReleaseDate = new Date(obj.APSD_Release_Date);
            // this.ISDDepositDate = new Date(obj.ISD_Deposit_date);
            // this.ISDBGDate = obj.ISD_BG_Creation_Date ?  new Date(obj.ISD_BG_Creation_Date) : new Date();
            // this.ISDBGExpDate =  obj.ISD_BG_Exp_Date ?  new Date(obj.ISD_BG_Exp_Date) : new Date();
            // this.ISDMatureDate =  obj.ISD_FD_Mature_Date ?  new Date(obj.ISD_FD_Mature_Date) : new Date();
            // this.ISDNEFTDate =  obj.ISD_NEFT_Txn_Date ?  new Date(obj.ISD_NEFT_Txn_Date) : new Date();
            // this.APSDDepositDate = new Date(obj.APSD_Deposit_date);
            // this.APSDBGDate =  obj.APSD_BG_Creation_Date ?  new Date(obj.APSD_BG_Creation_Date) : new Date();
            // this.APSDBGExpDate =  obj.APSD_BG_Exp_Date ?  new Date(obj.APSD_BG_Exp_Date) : new Date();
            // this.APSDMatureDate =  obj.APSD_FD_Mature_Date ?  new Date(obj.APSD_FD_Mature_Date) : new Date();
            // this.APSDNEFTDate =  obj.APSD_NEFT_Txn_Date ?  new Date(obj.APSD_NEFT_Txn_Date) : new Date();
            // this.CommencementDate = new Date(obj.Date_of_Commencement);
            // this.CompletionDate = new Date(obj.Date_of_Completion);
            // this.PeriodOfCompletion = obj.Periods_of_Completion;
            // }
            // if(obj.Financial_Bid_Status === 'NOT- AWARDING THE TENDER') {
            //   const arrTemp =  this.ObjBidOpening.Not_Awarding_Reason ?  this.ObjBidOpening.Not_Awarding_Reason.split(",") : [];
            //   this.ReasonSelect = arrTemp;
            // }
       }
  }
  GetBidOpenList(TenderDocID) {
    if(TenderDocID) {
      const obj = {
        "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
        "Report_Name_String" : "Get_Tender_Govt_Bidding_First_Table_harbour",
        "Json_Param_String": JSON.stringify({Tender_Doc_ID:TenderDocID}),
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{ 
          this.BidOpenListView = data;
          // this.BidOpenListView.forEach(el=>{
          //   this.BidOpenListView['Quoted_Rate'] = el.Rate
          // })
          for(let i = 0; i<this.BidOpenListView.length; i++){
            if(!this.BidOpenListView[i]['Quoted_Percentage']){
              this.BidOpenListView[i]['Quoted_Rate'] = this.BidOpenListView[i]['Rate']
            }
           
          }
          this.GetRankBidOpenList(TenderDocID);
          console.log("Get BidOpenListView",this.BidOpenListView);
        });
    }
  }
  GetRankBidOpenList(TenderDocID) {
    this.BidOpenListViewByRate = [];
    this.BidOpenListViewByLottery = [];
    this.BidOpenListViewByRateFlag = false;
    this.BidOpenListViewByLotteryFlag = false;
    if(TenderDocID) {
      const obj = {
        "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
        "Report_Name_String" : "Get_Tender_Govt_Bidding_Rank_harbour",
        "Json_Param_String": JSON.stringify({Tender_Doc_ID:TenderDocID}),
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=> {
          const Arr = data;
          for(let i = 0; i<Arr.length; i++){
            if(!Arr[i]['Quoted_Percentage']){
              Arr[i]['Quoted_Rate'] = Arr[i]['Rate']
            }
           
          }
            
            this.BidOpenListViewByLotteryFlag = true;
            this.RetriveRankBidding(Arr);
            this.ngxService.stop();
            this.BidOpenningModel = true;
          
        });
    }
  }
  RetriveRankBidding(RankArr) {
    const valueArr = RankArr.map(function(item){ return item.Rate });
    const arr =  [...RankArr];
    for(let i = 0; i < arr.length; i++) {
      let k = 0 ;
      for(let r = 0; r < valueArr.length; r++){
        if(arr[i].Rate === valueArr[r]) {
          k++;
        }
      }
      if (k === 1) {
        arr[i].Lottery_Flag = 'FIXED';
      }
      if (k > 1) {
        arr[i].Lottery_Flag = 'DUPLICATE';
        arr[i].Temp_Bidder_Array = [];
        const arrTemp = $.grep(arr,function(val){return val.Rate === arr[i].Rate});
        arr[i].Temp_Bidder_Array = [...arrTemp];
      }
      this.BidOpenListViewByLottery.push(arr[i]);
    }
    console.log( "BidOpenListViewByLottery",this.BidOpenListViewByLottery)
  }
  AddBidOpen() {
    this.BidOpeningListFormSubmitted = true;
    const bid = this.ObjBidOpeningList.Bidder_Name;
    const exitsFlag =this.ObjBidOpeningList.Bidder_Name ? $.grep(this.BidOpenListView,function(val){ return val.Bidder_Name === bid}) : [];
    if(!exitsFlag.length && this.tenderValue && this.ObjBidOpeningList.Bidder_Name){
      if(this.ObjBidOpeningList.Quoted_Percentage){
       const n = this.ObjBidOpeningList.Quoted_Percentage.includes("-");
      const percentage = n ? this.ObjBidOpeningList.Quoted_Percentage.replace("-", "") : this.ObjBidOpeningList.Quoted_Percentage;
      const PercentageVal = (( Number(percentage) / 100) * Number(this.tenderValue));
      const Rate = n ?  Number(this.tenderValue) - PercentageVal :  Number(this.tenderValue) + PercentageVal;
      const EstimatedRate = this.tenderValue;
      const footfall = this.BidTenderId;
      this.ObjBidOpeningList.Quoted_Percentage = (Number(percentage) === 0) ? '0' : this.ObjBidOpeningList.Quoted_Percentage;
      this.ObjBidOpeningList.Tender_Doc_ID = footfall;
      this.ObjBidOpeningList.Rate = Rate;
      this.ObjBidOpeningList.Rate_In_Words = this.convertNumberToWords(Rate);
      // this.ObjBidOpeningList.Less_Excess = (n && !(Number(percentage) === 0)) ? 'Less' : Number(this.ObjBidOpeningList.Quoted_Percentage) ? 'Excess' : 'Scheduled Rate';
      this.ObjBidOpeningList.Sl_No = Number(this.BidOpenListView.length) + 1;
      this.ObjBidOpeningList.Tender_Value = this.tenderValue;
      this.BidOpenListView.push(this.ObjBidOpeningList);
      this.BidOpeningListFormSubmitted = false;
      this.ObjBidOpeningList = new BidOpeningList();
      this.tenderValue = undefined
      this.ObjBidOpeningList.Tender_Value = this.tenderValue;
      this.ObjBidOpeningList.Tender_Doc_ID = footfall;
      }
      else {
        const Rate = Number(this.ObjBidOpeningList.Quoted_Rate)
        this.ObjBidOpeningList.Rate = Rate;
        this.ObjBidOpeningList.Rate_In_Words = this.convertNumberToWords(Rate);
        // this.ObjBidOpeningList.Less_Excess = (n && !(Number(percentage) === 0)) ? 'Less' : Number(this.ObjBidOpeningList.Quoted_Percentage) ? 'Excess' : 'Scheduled Rate';
        this.ObjBidOpeningList.Sl_No = Number(this.BidOpenListView.length) + 1;
        this.ObjBidOpeningList.Tender_Value = this.tenderValue;
        this.ObjBidOpeningList.Tender_Doc_ID = this.BidTenderId;
        this.BidOpenListView.push(this.ObjBidOpeningList);
        this.BidOpeningListFormSubmitted = false;
        this.ObjBidOpeningList = new BidOpeningList();
        this.tenderValue = undefined
        this.ObjBidOpeningList.Tender_Value = this.tenderValue;
        
        
      }
      console.log("ObjBidOpeningList",this.BidOpenListView);
    }
    if (exitsFlag.length) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Bidder already exists."
      });
    }
  }
  
  
  SaveDraftBidOpening(){
    if (this.BidOpenListView.length) {
       const obj = {
      "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
      "Report_Name_String" : "Tender_Govt_Bidding_Add_harbour",
      "Json_Param_String": JSON.stringify(this.BidOpenListView),
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("data",data);
       if(data[0].Column1){
        this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: 'Draft ' ,
          detail: "Succesfully Saved"
        });
       }
       else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error"
        });
       }
       
    })
  }
  }
  convertNumberToWords(amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        let n_array:any = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + Number(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        let value:any = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
  }
  RankBiddingCompanies() {
    let found = false;
    this.BidOpenListViewByRateFlag = false;
    this.BidOpenListViewByLotteryFlag = false;
    this.BidOpenListViewByLottery = [];
    this.BidOpenListViewByRate  = [];
     console.log("BidOpenListView",this.BidOpenListView);
    for(let i = 0; i < this.BidOpenListView.length; i++) {
        if (this.BidOpenListView[i].Rate) {
          if(this.BidOpenListView[i].Rate === this.BidOpenListView[0].Rate) {
            found = false;
          } else {
            found = true;
            break;
          }
        } else{
          found = false;
        }
    }
    const valueArr = this.BidOpenListView.map(function(item){ return item.Rate });
  
    const isDuplicate = valueArr.some(function(item, idx){
        return valueArr.indexOf(item) !== idx
    });
    if (found && !isDuplicate) {
      const arr =  [...this.BidOpenListView];
      arr.sort(function(a, b){
        return parseFloat(a.Rate) - parseFloat(b.Rate);
      });
      this.BidOpenListViewByRate = arr;
      for(let i = 0; i < this.BidOpenListViewByRate.length; i++) {
        const rank = 'L' + (i+1);
        this.BidOpenListViewByRate[i].Rank =  rank;
        this.BidOpenListViewByRate[i].Rank =  rank;
    }
      this.BidOpenListViewByRateFlag = true;
  
    } else {
      this.BidOpenListViewByRateFlag = false;
      const Unique = [];
      const Duplicate = [];
      const arr =  [...this.BidOpenListView];
      arr.sort(function(a, b){
        return parseFloat(a.Rate) - parseFloat(b.Rate);
      });
      for(let i = 0; i < arr.length; i++) {
        let k = 0 ;
        const rank = 'L' + (i+1);
        const objTemp = new RankBidOpeningList ();
        objTemp.Tender_Doc_ID =  this.BidTenderId;
        objTemp.Tender_Doc_ID =  this.BidTenderId;
        for(let r = 0; r < valueArr.length; r++){
          if(arr[i].Rate === valueArr[r]) {
            k++;
          }
        }
        if (k === 1) {
          objTemp.Lottery_Flag = 'FIXED';
          objTemp.Sl_No = arr[i].Sl_No;
          objTemp.Tender_Value = arr[i].Tender_Value;
          objTemp.Bidder_Name = arr[i].Bidder_Name;
          objTemp.Quoted_Percentage = arr[i].Quoted_Percentage;
          objTemp.Quoted_Rate = arr[i].Quoted_Rate;
          objTemp.Rate = arr[i].Rate;
          objTemp.Rate_In_Words = this.convertNumberToWords(arr[i].Rate);
        }
        if (k > 1) {
          objTemp.Lottery_Flag = 'DUPLICATE';
          objTemp.Temp_Bidder_Array = [];
          const arrTemp = $.grep(arr,function(val){return val.Rate === arr[i].Rate});
          objTemp.Temp_Bidder_Array = [...arrTemp];
  
        }
        objTemp.Rank = rank;
        this.BidOpenListViewByLottery.push(objTemp);
      }
    this.BidOpenListViewByLotteryFlag = true;
    }
    console.log("BidOpenListViewByLottery",this.BidOpenListViewByLottery);
  }
  checkBidderSelectLottery(bidderName) {
    const arr = [...this.BidOpenListViewByLottery]
    const exitsFlag = bidderName ? $.grep(arr,function(val){ return val.Bidder_Name === bidderName}) : [];
    return exitsFlag.length > 1 ? true : false;
  }
  LotteryBidderNameChange(i,obj) {
    this.BidOpenListViewByLottery[i].Tender_Value = undefined;
    this.BidOpenListViewByLottery[i].Quoted_Percentage = undefined;
    this.BidOpenListViewByLottery[i].Rate = undefined;
    this.BidOpenListViewByLottery[i].Quoted_Rate = undefined;
    this.BidOpenListViewByLottery[i].Rate_In_Words = undefined;
if(obj.Bidder_Name) {
  const arr =  [...this.BidOpenListView];
  const bidObj = $.grep(arr,function(elem){ return elem.Bidder_Name === obj.Bidder_Name})[0];
  const flag = this.checkBidderSelectLottery(obj.Bidder_Name)
  if(!flag) {
    this.BidOpenListViewByLottery[i].Tender_Value = bidObj.Tender_Value;
    this.BidOpenListViewByLottery[i].Quoted_Percentage = bidObj.Quoted_Percentage;
    this.BidOpenListViewByLottery[i].Quoted_Rate = bidObj.Quoted_Rate;
    this.BidOpenListViewByLottery[i].Tender_Doc_ID = bidObj.Tender_Doc_ID;
    this.BidOpenListViewByLottery[i].Rate = bidObj.Rate;
    this.BidOpenListViewByLottery[i].Rate_In_Words = this.convertNumberToWords(bidObj.Rate);
  } else {
    this.BidOpenListViewByLottery[i].Tender_Value = undefined;
    this.BidOpenListViewByLottery[i].Quoted_Percentage = undefined;
    this.BidOpenListViewByLottery[i].Rate = undefined;
    this.BidOpenListViewByLottery[i].Quoted_Rate = bidObj.Quoted_Rate;
    this.BidOpenListViewByLottery[i].Tender_Doc_ID = this.BidTenderId;
    this.BidOpenListViewByLottery[i].Rate_In_Words = undefined;
    this.BidOpenListViewByLottery[i].Temp_Bidder_Array = [];
    const arrTemp = $.grep(arr,function(val){return val.Rate === bidObj.Rate});
    this.BidOpenListViewByLottery[i].Temp_Bidder_Array = [...arrTemp];
  }

}


}
inputBoxClr(n){
  if(!n || Number(n) === 0){
   this.ObjBidOpeningList.Quoted_Rate = undefined;
  }
  else {
    this.ObjBidOpeningList.Quoted_Percentage = undefined;
  }
 }
 BidAmountView(e){
  if(e) {
    const x= e.toString();
    const number = Number(e);
   const k =  number.toLocaleString('en-IN', {
       maximumFractionDigits: 2,
       style: 'currency',
       currency: 'INR'
   });
   return  k;
  }
}
DeleteBidOpenList(index){
  this.BidOpenListView.splice(index, 1);
  for(let i = 0; i < this.BidOpenListView.length; i++) {
    this.BidOpenListView[i].Sl_No = i + 1;
  }
  this.RankBiddingCompanies();
}
StatusChange(data){
  this.ReasonSelect = [];
  this.ObjAgreement.Date_of_Commencement = this.DateService.dateConvert(moment(new Date(), "YYYY-MM-DD")["_d"]);
  this.ObjAgreement.Date_of_Completion = this.DateService.dateConvert(moment(new Date(), "YYYY-MM-DD")["_d"]);
  if(data === 'AWARDING THE TENDER') {
    this.AgreementSubmitted = false; 
   }
  else if (data === 'NOT- AWARDING THE TENDER'){    
    this.ReasonSelect = [];
  }
}
GetReasonList() {
  this.$http
    .get("/BL_CRM_Txn_Enq_Tender/Get_Not_Awarding_Reason_Json")
    .subscribe((data: any) => {
      const List = data ? JSON.parse(data) : [];
      List.forEach(el => {
        this.ReasonList.push({
          label: el.Reason,
          value: el.Reason
        });
      });

    });
}
ToggleReason(){
  this.ReasonSubmitted = false;
  this.ReasonName = undefined;
  this.ReasonModal = true;
  this.Spinner = false;
 }
 CreateReason(valid){
  this.ReasonSubmitted = true;
  if(valid) {
      this.Spinner = true;
      const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Not_Awarding_Reason";
      const obj = {
        Reason : this.ReasonName
       };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        console.log(data)
      if (data.success) {
        this.Spinner = false;
        // if (this.ObjTender.Tender_Doc_ID) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Reason Created"
          });
        
        this.GetReasonList();
        this.ReasonSubmitted = false;
        this.ReasonName = undefined;
        this.ReasonModal = false;
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
  SaveBidOpening(valid){
   console.log("valid",valid);
   console.log("BidOpenListView",this.BidOpenListView);
   this.BidOpeningListFormSubmitted = true;
   const resonFlag = (this.ObjBidOpening.Financial_Bid_Status === 'NOT- AWARDING THE TENDER' &&  this.ReasonSelect.length ) ? true : (this.ObjBidOpening.Financial_Bid_Status === 'AWARDING THE TENDER') ?  true : false;
   if (valid && this.BidOpenListView.length && resonFlag && (this.BidOpenListViewByRate.length || this.BidOpenListViewByLottery.length)) {
    const obj = {
      "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
      "Report_Name_String" : "Tender_Govt_Bidding_Add_harbour",
      "Json_Param_String": JSON.stringify(this.BidOpenListView),
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("data",data);
       if(data[0].Column1){
        this.saveLottery()
       }
       else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error"
        });
       }
       
    })
  }
  }
  saveLottery(){
    let saveData = [];
    if(this.BidOpenListViewByRateFlag){
     console.log("BidOpenListViewByRateFlag",this.BidOpenListViewByRate);
     saveData = this.BidOpenListViewByRate;
    }
    else if(this.BidOpenListViewByLotteryFlag){
     console.log("BidOpenListViewByLotteryFlag",this.BidOpenListViewByLottery)
     saveData = this.BidOpenListViewByLottery;
    }
    saveData.forEach(ele => {
      ele.Temp_Bidder_Array = undefined;
    });
    const obj = {
      "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
      "Report_Name_String" : "Tender_Govt_Bidding_Rank_Add_harbour",
      "Json_Param_String": JSON.stringify(saveData),
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("data",data);
     if(data[0].Column1){
      this.BidOpeningListFormSubmitted = false;
      this.ObjBidOpeningList = new BidOpeningList();
      this.saveStatus();
     }
    })
  }
  saveStatus(){
    console.log("ReasonList",this.ReasonSelect);
    let saveDate = []
    saveDate.push({
      Tender_Doc_ID : this.BidTenderId,
      Status : this.ObjBidOpening.Financial_Bid_Status,
      Not_Awarding_Reason : this.ReasonSelect.length ? this.ReasonSelect.toString() : ''
    })
    const obj = {
      "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
      "Report_Name_String" : "Tender_Govt_Bidding_Award_Status",
      "Json_Param_String": JSON.stringify(saveDate),
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data[0].message){
        this.SavefollowUpCommon(this.ObjBidOpening.Financial_Bid_Status);
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully Created"
        });
      }
    })
  }
  saveAgreement(valid){
 this.AgreementSubmitted = true;
    console.log("valid",valid);
   if(valid){
     this.SpinnerAg = true;     
     this.ObjAgreement.Tender_Doc_ID = this.BidTenderId;
     this.ObjAgreement.Tender_Negotiated_Value = this.getHarbaurValRankTop();
     this.ObjAgreement.Tender_Final_Value = this.getHarbaurValRankTop();
    this.ObjAgreement.Date_of_Commencement = this.ObjAgreement.Date_of_Commencement ? this.ObjAgreement.Date_of_Commencement : this.DateService.dateTimeConvert(new Date(this.CommencementDate));
    this.ObjAgreement.Date_of_Completion = this.ObjAgreement.Date_of_Completion ? this.ObjAgreement.Date_of_Completion : this.DateService.dateTimeConvert(new Date(this.CompletionDate));
    const obj = {
      "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
      "Report_Name_String" : "Tender_Agreement_And_Final_Value_Harbour",
      "Json_Param_String": JSON.stringify([this.ObjAgreement]),
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("data",data);
        if (data[0].Column1) {
          this.SavefollowUpCommon(this.ObjBidOpening.Financial_Bid_Status);
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: 'Agreement ' ,
          detail: "Succesfully Saved"
        });
        this.GetAgreementList(this.BidTenderId);
         this.SpinnerAg = false;
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
          this.SpinnerAg = false;
        }
      })
   }
  }

  SavefollowUpCommon(Status){
    if(this.BidTenderId && Status){
      const saveObj = {
        Tender_Doc_ID: this.BidTenderId,									
				Posted_By: this.commonApi.CompacctCookies.User_ID,							 
				Send_To:	this.commonApi.CompacctCookies.User_ID,						       			
				Status:	Status,
				Remarks: Status
      }
      console.log("follow save",saveObj);
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "BL_CRM_Txn_Enq_Tender_Harbauer_Followup_Save",
        "Json_Param_String": JSON.stringify(saveObj)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("follow up save",data);      
      })
    }
  }


  getHarbaurValRankTop() {
    let Val = 0;
    if(this.BidOpenListViewByRate.length){
    if(this.BidOpenListViewByRate[0].Bidder_Name ==='HARBAUER India [P] Ltd'){
if(this.BidOpenListViewByRate[0].Bidder_Name ==='HARBAUER India [P] Ltd') {
  Val = this.BidOpenListViewByRate[0].Rate;
}
}
    }
    if(this.BidOpenListViewByLottery.length){
if( this.BidOpenListViewByLottery[0].Bidder_Name ==='HARBAUER India [P] Ltd'){
  if(this.BidOpenListViewByLottery[0].Bidder_Name ==='HARBAUER India [P] Ltd') {
    Val = this.BidOpenListViewByLottery[0].Rate;
    
  }
}

    }
    return Val;
  }
  saveAgreementNegotiateValue(valid){
 this.AgreementSubmitted = true;
    console.log("valid",valid);
   if(valid){
     this.SpinnerAg = true;  
     const tempobj = {
      Tender_Doc_ID : this.ObjAgreement.Tender_Doc_ID,
      Tender_Negotiated_Value : this.ObjAgreement.Tender_Negotiated_Value
     } 
    const obj = {
      "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
      "Report_Name_String" : "Update_Tender_Negotiated_Value_Harbour",
      "Json_Param_String": JSON.stringify([tempobj]),
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("data",data);
        if (data.success) {
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: 'Estimate Management ' ,
          detail: "Succesfully Save."
        });
         this.SpinnerAg = false;
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
          this.SpinnerAg = false;
        }
      })
   }
  }
  
  
  //Budget Details
  onSort() {
    this.updateRowGroupMetaData();
  }
  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.ShowAddedEstimateProductList) {
      for (let i = 0; i < this.ShowAddedEstimateProductList.length; i++) {
        let rowData = this.ShowAddedEstimateProductList[i];
        let brand = rowData.Budget_Group_Name;
        if (i == 0) {
          this.rowGroupMetadata[brand] = {
            index: 0,
            size: 1
          };
        } else {
          let previousRowData = this.ShowAddedEstimateProductList[i - 1];
          let previousRowGroup = previousRowData.Budget_Group_Name;
          if (brand === previousRowGroup)
            this.rowGroupMetadata[brand].size++;
          else
            this.rowGroupMetadata[brand] = {
              index: i,
              size: 1
            };
        }
      }
    }
  }
  GetEstimateProductScheme(_TenderId) {
    this.ShowAddedEstimateProductList = [];
    if (_TenderId) {
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get Data Tender Estimate_With_Changed_Amount",
        "Json_Param_String": JSON.stringify([{
          'Tender_Doc_ID': _TenderId
        }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          if (data.length) {
            this.ShowAddedEstimateProductList = data;
            this.EstimateProductChangeModal = true;
            console.log(data)
          }
        });
    }
  }
  getPurchaseAmt() {
    return this.ShowAddedEstimateProductList.reduce((n, {
      Amount
    }) => n + Number(Amount), 0)
  }
  getSaleAmt() {
    return this.ShowAddedEstimateProductList.reduce((n, {
      Sale_Amount
    }) => n + Number(Sale_Amount), 0)
  }
  getTotalPurchaseAmt() {
    return this.ShowAddedEstimateProductList.length ? Number(this.ShowAddedEstimateProductList[0].No_of_Site) * this.getPurchaseAmt() : '-';
  }
  SaveChangeEstimateProduct(){
    if(this.ShowAddedEstimateProductList.length) {
        this.SpinnerProd = true;
        const obj = {
          "SP_String": "SP_Tender_Management_All",
          "Report_Name_String": "Update_Data_Tender_Estimate_With_Changed_Amount",
          "Json_Param_String": JSON.stringify(this.ShowAddedEstimateProductList)
        }
        this.GlobalAPI.getData(obj).subscribe((data: any) => {
          console.log(data)
        if (data[0].message) {
          // if (this.ObjTender.Tender_Doc_ID) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Updated"
            });
          this.EstimateProductChangeModal= false;
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
        this.SpinnerProd = false;
        });
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
class BidOpeningList {
  Schedule_ID:string;
  Sl_No	:number;
  Bidder_Name:string;
  Tender_Value:number;
  Quoted_Percentage:any = 0;
  Quoted_Rate:number = 0;
  Less_Excess:string;
  Rate:number;
  Rate_In_Words:string;
  Tender_Doc_ID:string;
  
}
class RankBidOpeningList {
  Rank_ID:string;
  Rank:string;
  Sl_No	:number;
  Bidder_Name:string;
  Tender_Value:number;
  Quoted_Percentage:string;
  Less_Excess:string;
  Rate:number;
  Rate_In_Words:string;
  Tender_Doc_ID:string;
  Lottery_Flag:string;
  Quoted_Rate:string;
  Temp_Bidder_Array:any = [];
  
}
class BidOpening{
  Tender_Doc_ID:string;
  Tender_Inviting_Authority:string;
  Financial_Bid_Status:string;
  Fin_Year_Name:string;
  ISD_Amount:number;
  ISD_Maturity_Amount:number;
  ISD_Bank:string;
  ISD_Deposit_date:string;
  ISD_Release_Date: string;
  ISD_Deposit_Type:string;
  ISD_Deposit_Number:string;
  ISD_Through_BG_FD:string;
  ISD_BG_Creation_Date:string;
  ISD_BG_Exp_Date:string;
  ISD_FD_Amount:number;
  ISD_FD_Mature_Amount:number;
  ISD_FD_Mature_Date:string;
  ISD_NEFT_Txn_Date:string;
  ISD_NEFT_TXN_No:string;
  APSD_Amount:number;
  APSD_Maturity_Amount:number;
  APSD_Bank:string;
  APSD_Deposit_date:string;
  APSD_Release_Date: string;
  APSD_Deposit_Type:string;
  APSD_Deposit_Number:string;
  APSD_Through_BG_FD:string;
  APSD_BG_Creation_Date:string;
  APSD_BG_Exp_Date:string;
  APSD_FD_Amount:number;
  APSD_FD_Mature_Amount:number;
  APSD_FD_Mature_Date:string;
  APSD_NEFT_Txn_Date:string;
  APSD_NEFT_TXN_No:string;
  Agreement_Number:string;
  Agreement_Value:any;
  Date_of_Commencement:string;
  Date_of_Completion:string;
  Periods_of_Completion:string;
  Circle:string;
  Division:string;
  Not_Awarding_Reason:string;
  Disqualify:string;
  EOT_Applied:string;
  Rank_Type: string;
  BOQ_File_Name:string;
  Project_Short_Name:string;
  Agreement_value : string;
 
}
class Agreement{
  Tender_Doc_ID : number;
  Agreement_Number :any;
  Agreement_Value :any;
  Date_of_Commencement :any;
  Date_of_Completion :any;
  Tender_Final_Value:any;
  Tender_Negotiated_Value:any;
 }