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
  selector: 'app-txn-enq-tender-harbauer',
  templateUrl: './txn-enq-tender-harbauer.component.html',
  styleUrls: ['./txn-enq-tender-harbauer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TxnEnqTenderHarbauerComponent implements OnInit {
  tabIndexToView = 0;
  // tabIndexToView2 = 0;
  // items2 =['General Information','EMD / Tender Fee','Document','Task'];
  items = ["CREATE"];
  url = window["config"];
  persons: [];
  buttonname = "Create";
  Spinner = false;
  SpinnerAg = false;
  ViewFlag = false;
  TenderSearchForm = false;
  TenderFormSubmitted = false;
  TenderList = [];
  BackupTenderList = [];
  wLocationSubmit = [];
  TenderOpenDate = new Date();
  TenderEndDate =  new Date();

  TenderPublishDate = new Date();
  TenderSearchDate = new Date();
  TFeeAmount = undefined;
  TFeeAmountupdate = undefined;
  TenderAmount = undefined;
  PeriodOfWork = undefined;
  EMDAmount = undefined;
  updateEMDAmount = undefined
  ObjTender = new Tender();
  //ObjtenerFee = new tenerFee();
  //ObjTask = new Task();
  ObjSearch = new Search();
  TenderOrganization = undefined;
  OrgSubmitted = false;
  OrganizationModal = false;
  catSubmitted = false;
  TenderCategoryName = undefined;
  CategoryModal = false;
  PerformanceFormSubmitted = false;
  TenderTypeName = undefined;
  TypeModal = false;
  TypeSubmitted = false;

  FormOfContract = undefined;
  ContactModal = false;
  ContractSubmitted = false;
  PerformanceSecurityAmount = undefined;
  UpdatePerformanceSecurityAmount = undefined;
  TenderPaymentMode = undefined;
  PaymentModal = false;
  PaymentSubmitted = false;
  testchips = [];

  EMDSubmitted = false;
  EMDModal = false;
  DivisionSubmitted = false;
  TenderFeeSubmitted = false;
  PerformanceSecuritySubmitted = false;
  TenderFeeModal = false;
  PerformanceSecurityModel = false;
  EMDDepositDate = new Date();
  TenderId = undefined;

  FeeDepositDate = new Date();
  FeeTransactionDate = new Date();
  //ObjFee = new Fee();


  tenderOrgList = [];
  tenderCategoryList = [];
  TypeList = [];
  ContractList = [];
  PaymentList = [];
  informList = [];
  IntimationList = [];
  IntimationSelect = [];
  CountryCodeList =[];
  FootfalID = undefined;
  DocumentList = [];
  TaskList = [];
  @ViewChild("location", { static: false }) locationInput: ElementRef;

  ISDAmount = undefined;
  APSDAmount = undefined;
  APSDFDAmount = undefined;
  APSDFDMaturityAmount =undefined;
  AgreementValue = undefined;
  CommencementDate = new Date();
  CompletionDate = new Date();
  PeriodOfCompletion = undefined;
  EstimatedRate = undefined;
  tenderValue = undefined;
  EstimateAllData = [];

  TenderDetails:any = {};
  BidderList = [];
  AuthorityList = [];

  TenderIssueDate = new Date();
  TenderExpiryDate = new Date();
  TenderIssueDateupdate = new Date();
  TenderExpiryDateupdate = new Date();
 // EMDIssueDate = new Date();
  InformedDate = new Date();
  BudgetRequidBy : Date;
  EMDExpiryDate = new Date();
CreateLightBoxSubmitted = false;
TenderCallingDiv = undefined;
TenderExecutionDiv = undefined;
TenderType = undefined;
TenderCategory = undefined;
TenderPaymentMode1 = undefined;
TenderCallingDivList = [];
TenderExecutionDivList = [];
TenderInfoEnqList = [];

SelectedDTAutority = [];
SelectedDTCallingDiv = [];
SelectedDTCategory = [];
SelectedDTState = [];
SelectedDTLocation = [];
TenderDocID = undefined;
StateList = [];

  InformationSubmitted = false;
  InformationName = undefined;
  InformationModal = false;
  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;

  WorkLocationModal = false;
  UserList: any;
  Tender_Doc_ID: any;
  BudgetrequidDate : any;

  ViewModal = false;
  vieworgList = [];
  Orgid = undefined;

  ViewcallModal = false;
  viewcallList = [];
  callid = undefined;

  ViewExecutionModal = false;
  viewExecutionList = [];
  executionid = undefined;

  ViewtendertypeModal = false;
  viewtendertypeList = [];
  tendertypeid = undefined;

  ViewtendercategoryModal = false;
  viewtendercategoryList = [];
  categoryid = undefined;
  
  ViewinformationModal = false;
  viewinformationList = [];
  informationid = undefined;
  
  cnfrm_popup = false;
  cnfrm2_popup = false;
  cnfrm3_popup = false;
  cnfrm4_popup = false;
  cnfrm5_popup = false;
  cnfrm6_popup = false;;

  constructor( private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService) {
      // this.route.queryParamMap.subscribe((val:any) => {
      //   console.log(val)
      //   if(val.params.from) {
      //     this.tabIndexToView = 1;
      //   }
      // });
     }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Tender",
      Link: " Tender Management -> Master -> Tender"
    });
    
     this.GetTenderOrgList();
     this.GetTenderCallingDiv();
     this.GetTenderExecutionDiv();
     this.GetTypeList();
     this.GetTenderCategoryList();
     this.GetStateList();
     this.GetTenderInfoEnqSRC();
     this.GetBudgetrequiredDate();
     this.getAssignforbudget();
  }
  
// Clear & Tab
TabClick(e) {
  this.tabIndexToView = e.index;
  this.items = ["CREATE"];
  this.buttonname = "Create";
  this.clearData();
}
clearData() {
  this.Spinner = false;
  this.TenderSearchForm = false;
  this.TenderFormSubmitted = false;
  this.ObjTender = new Tender();
   this.TenderOpenDate = new Date();
  this.TenderEndDate =  new Date();
  this.TenderPublishDate = new Date();
  this.ViewFlag = false;
  this.FootfalID = undefined;
  this.IntimationSelect = [];
  this.TFeeAmount = undefined;
  this.TFeeAmountupdate = undefined;
  this.TenderAmount = undefined;
  this.EMDAmount = undefined;
  this.updateEMDAmount = undefined;
  this.UpdatePerformanceSecurityAmount = undefined;
  this.PerformanceSecurityAmount = undefined;
  this.PeriodOfWork = undefined;
  this.locationInput.nativeElement.value = '';
  this.TenderId = undefined;
  this.InformedDate = new Date();
  this.GetBudgetrequiredDate();

}
// Tender Autority
  GetTenderOrgList() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String" : "Get_Tender_Organization",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.tenderOrgList = data;
    // this.$http
    //   .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Organization_Json")
    //   .subscribe((data: any) => {
    //    this.tenderOrgList = data ? JSON.parse(data) : [];
      });
  }
  ViewOrganization(){
    this.vieworgList = [];
    this.ViewModal = true;
    this.GetTenderOrgList();
    // const obj = {
    //   "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
    //   "Report_Name_String" : "Get_Tender_Organization",
    // }
    // this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //   this.vieworgList = data;
    //   });
    //this.ViewModal = true;
  }
  deleteorg(orgid){
    this.Orgid = undefined;
    // this.cnfrm2_popup = false;
    // this.cnfrm3_popup = false;
    // this.cnfrm4_popup = false;
    // this.cnfrm5_popup = false;
    // this.cnfrm6_popup = false;
    if(orgid.Tender_Org_ID){
      //this.cnfrm_popup = true;
      this.Orgid = orgid.Tender_Org_ID;
      // const obj = {
      //   "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      //   "Report_Name_String" : "Delete_Tender_Organization",
      //   "Json_Param_String": JSON.stringify({Tender_Org_ID: this.Orgid}),
      // }
      // this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //   var msg = data[0].Column1;
      //   if (data[0].Column1) {
      //    this.compacctToast.clear();
      //    this.compacctToast.add({
      //       key: "compacct-toast",
      //       severity: "success",
      //       summary: "Tender Org ID: " + this.Orgid,
      //       detail: msg
      //     });
      //       this.ViewOrganization();
      //       this.GetTenderOrgList();
      //   } 
      //   else {
      //     this.compacctToast.clear();
      //     this.compacctToast.add({
      //       key: "compacct-toast",
      //       severity: "error",
      //       summary: "Warn Message",
      //       detail: "Error Occured "
      //     });
      //   }
      // });
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
  onConfirm() {
    let ReportName = '';
    let ObjTemp;
    let FunctionRefresh;
    if (this.Orgid) {
      ReportName = "Delete_Tender_Organization"
      ObjTemp = {
        Tender_Org_ID: this.Orgid
      }
      FunctionRefresh = 'GetTenderOrgList'
    }
    if (this.callid) {
      ReportName = "Delete_BL_CRM_Mst_Enq_Tender_Calling_Div"
      ObjTemp = {
        Tender_Calling_Div_ID: this.callid
      }
      FunctionRefresh = 'GetTenderCallingDiv';
    }
    if (this.executionid) {
      ReportName = "Delete_BL_CRM_Mst_Enq_Tender_Execution_Div"
      ObjTemp = {
        Tender_Execution_Div_ID: this.executionid
      }
      FunctionRefresh = 'GetTenderExecutionDiv';
    }
    if (this.tendertypeid) {
      ReportName = "Delete_BL_CRM_Mst_Enq_Tender_Type"
      ObjTemp = {
        Tender_Type_ID: this.tendertypeid
      }
      FunctionRefresh = 'GetTypeList'
    }
    if (this.categoryid) {
      ReportName = "Delete_BL_CRM_Mst_Enq_Tender_Category"
      ObjTemp = {
        Tender_Category_ID: this.categoryid
      }
      FunctionRefresh = 'GetTenderCategoryList';
    }
    if (this.informationid) {
      ReportName = "Delete_BL_Enq_Source_Master"
      ObjTemp = {
        Enq_Source_ID: this.informationid
      }
      FunctionRefresh = 'GetTenderInfoEnqSRC';
    }
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String" : ReportName,
        "Json_Param_String": JSON.stringify(ObjTemp),
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        var msg = data[0].Column1;
        if (data[0].Column1) {
        // this.onReject();
        //this.GetTenderOrgList();
        this[FunctionRefresh]();
         this.compacctToast.clear();
         this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: msg
          });
            //this.SearchTender(true);
        }
      });
    //}
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  // Tender Calling Div
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
  deleteCallingdiv(callid){
    console.log("this.cnfrm2_popup")
    this.callid = undefined;
    // this.cnfrm_popup = false;
    // this.cnfrm3_popup = false;
    // this.cnfrm4_popup = false;
    // this.cnfrm5_popup = false;
    // this.cnfrm6_popup = false;
    if(callid.Tender_Calling_Div_ID){
      this.callid = callid.Tender_Calling_Div_ID;
     // this.cnfrm2_popup = true;
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
  // onConfirm2() {
  //   console.log("this.callid",this.callid)
  //   if (this.callid) {
  //     const obj = {
  //       "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
  //       "Report_Name_String" : "Delete_BL_CRM_Mst_Enq_Tender_Calling_Div",
  //       "Json_Param_String": JSON.stringify({Tender_Calling_Div_ID: this.callid}),
  //     }
  //     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //       var msg = data[0].Column1;
  //       if (data[0].Column1) {
  //         this.GetTenderCallingDiv();
  //        this.compacctToast.clear();
  //        this.compacctToast.add({
  //           key: "compacct-toast",
  //           severity: "success",
  //           summary: "Tender Calling Div ID: " + this.callid,
  //           detail: msg
  //         });
  //           //this.SearchTender(true);
  //       }
  //     });
  //   }
  // }
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
  deleteExecutiondiv(executionid){
    this.executionid = undefined;
    if(executionid.Tender_Execution_Div_ID){
      this.executionid = executionid.Tender_Execution_Div_ID;
      // const obj = {
      //   "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      //   "Report_Name_String" : "Delete_BL_CRM_Mst_Enq_Tender_Execution_Div",
      //   "Json_Param_String": JSON.stringify({Tender_Execution_Div_ID: this.executionid}),
      // }
      // this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //   var msg = data[0].Column1;
      //   if (data[0].Column1) {
      //    this.compacctToast.clear();
      //    this.compacctToast.add({
      //       key: "compacct-toast",
      //       severity: "success",
      //       summary: "Tender Execution Div ID: " + this.executionid,
      //       detail: msg
      //     });
      //       this.ViewExecutionDiv();
      //       this.GetTenderExecutionDiv();
      //   } 
      //   else {
      //     this.compacctToast.clear();
      //     this.compacctToast.add({
      //       key: "compacct-toast",
      //       severity: "error",
      //       summary: "Warn Message",
      //       detail: "Error Occured "
      //     });
      //   }
      // });
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
  // Tender Type
  GetTypeList() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String" : "Get_BL_CRM_Mst_Enq_Tender_Type",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.TypeList = data;
      });
  }
  ViewTenderType(){
    this.viewtendertypeList = [];
    this.ViewtendertypeModal = true;
    this.GetTypeList();
  }
  deleteTenderType(ttypeid){
    this.tendertypeid = undefined;
    if(ttypeid.Tender_Type_ID){
      this.tendertypeid = ttypeid.Tender_Type_ID;
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
  deletecategory(tcategoryid){
    this.categoryid = undefined;
    if(tcategoryid.Tender_Category_ID){
      this.categoryid = tcategoryid.Tender_Category_ID;
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
  // INIT DATA
  GetStateList() {
    this.$http
    .get("/Common/Get_State_List")
    .subscribe((data: any) => {
      this.StateList = data.length ? data : [];
    });
   }
  // Information From
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
    //  const UrlAddress = "BL_CRM_Txn_Enq_Tender/Create_Tender_Enq_Source";
    //   const obj = {
    //     Enq_Source_Name: this.InformationName,
    //     };
    //   this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        console.log(data)
      if (data[0].Column1) {
          this.Spinner = false;
        // if (this.ObjTender.Tender_Doc_ID) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Information Created"
          });
        // } else {
        //   this.compacctToast.clear();
        //   this.compacctToast.add({
        //     key: "compacct-toast",
        //     severity: "success",
        //     summary: "",
        //     detail: "Organization Already Exits"
        //   });
        // }
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
  Viewinformation(){
    this.viewinformationList = [];
    this.ViewinformationModal = true;
    this.GetTenderInfoEnqSRC();
  }
  deleteinformation(tinfoid){
    this.informationid = undefined;
    if(tinfoid.Enq_Source_ID){
      this.informationid = tinfoid.Enq_Source_ID;
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
  TenderPeriodOfWorkChange(e){
    this.ObjTender.Period_Of_Work = undefined;
    if(e) {
      const k = Number(e) === 1 ? 'Day' : 'Days';
     this.ObjTender.Period_Of_Work = e;
     this.PeriodOfWork  = e+' '+ k;
    }
  }
  

  // CHANGE
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearch.From_Date = dateRangeObj[0];
      this.ObjSearch.To_Date = dateRangeObj[1];
    }
  }
  TenderAmountChange(e){
    this.ObjTender.Tender_Amount = undefined;
    this.ObjTender.EMD_Amount = undefined;
    //this.ObjEMD.EMD_Amount = undefined;
    if(e) {
   const x= e.toString();
   const number = Number(e);
   const onePercen = (number * 0.01).toFixed();
   this.TenderEMDChange(onePercen);
  const k =  number.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'INR'
  });
  this.ObjTender.Tender_Amount = Number(e);
  this.TenderAmount = k;
 }
  }
  TenderEMDChange(e){
    console.log(e);
    this.ObjTender.EMD_Amount = undefined;
    //this.ObjEMD.EMD_Amount = undefined;
    if(e) {
      const x= e.toString();
      const number = Number(e);
     const k =  number.toLocaleString('en-IN', {
         maximumFractionDigits: 2,
         style: 'currency',
         currency: 'INR'
     });
     this.ObjTender.EMD_Amount = Number(e);
     //this.ObjEMD.EMD_Amount = Number(e);
     this.EMDAmount = k;
     this.updateEMDAmount = k;
    }
  }


  CloseViewModal(){
    this.clearData();
    this.DocumentList =[];
    // this.ObjTask = new Task();
    // this.ObjFee = new Fee();
    // this.ObjEMD = new EMD();

  }
  GetOrgName(id) {
   const name = $.grep(this.tenderOrgList ,function(obj) {return obj.Tender_Org_ID === id})[0].Tender_Organization;
    return name ? name : '-';
  }
  GetCatName(id) {
    const name = $.grep(this.tenderCategoryList ,function(obj) {return obj.Tender_Category_ID === id})[0].Tender_Category_Name;
    return name ? name : '-';
  }

  GetTypeName(id) {
    const name = $.grep(this.TypeList ,function(obj) {return obj.Tender_Type_ID === id})[0].Tender_Type_Name;
    return name ? name : '-';
  }

  // CREATE
 ToggleOrganization(){
  this.TenderOrganization = undefined;
  this.OrgSubmitted = false;
  this.OrganizationModal = true;
  this.Spinner = false;
 }

 CreateOrganization(valid){
  this.OrgSubmitted = true;
  if(valid) {
      this.Spinner = true;
      // const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Tender_Organization";
      // const obj = { Tender_Organization: this.TenderOrganization };
      // this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        const obj = {
          "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
          "Report_Name_String" : "Create_Tender_Organization",
          "Json_Param_String": JSON.stringify({Tender_Organization: this.TenderOrganization}),
        }
        this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        console.log(data)
      if (data[0].Column1) {
        this.Spinner = false;
        // if (this.ObjTender.Tender_Doc_ID) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Organization Created"
          });
        // } else {
        //   this.compacctToast.clear();
        //   this.compacctToast.add({
        //     key: "compacct-toast",
        //     severity: "success",
        //     summary: "",
        //     detail: "Organization Already Exits"
        //   });
        // }
        this.GetTenderOrgList();
        this.TenderOrganization = undefined;
        this.OrgSubmitted = false;
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


//   // Delete
  
   
//   DeleteTender(obj) {
//     this.TenderId = undefined;
//     if (obj.Tender_Doc_ID) {
//       this.TenderId = obj.Tender_Doc_ID;
//       this.compacctToast.clear();
//       this.compacctToast.add({
//         key: "c",
//         sticky: true,
//         severity: "warn",
//         summary: "Are you sure?",
//         detail: "Confirm to proceed"
//       });
//     }
//   }
  

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
  CheckIfTenderNameExist(){
    if(this.ObjTender.Tender_Name) {
      const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
      const params = new HttpParams().set("Tender_Name", this.ObjTender.Tender_Name);
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Check_Tender_Name_Exist?Tender_Name="+ this.ObjTender.Tender_Name, {headers: headers, responseType: 'text'})
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
  // COMMON FOCUS
   onFocusInEvent(field,Amt){
   }
  onFocusOutEvent(field,Amt){
  
  }
  GetBudgetrequiredDate() {
    
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender_Harbauer/Get_Budget_Required_By")
      .subscribe((data: any) => {
        //this.BudgetrequidDate = data ? JSON.parse(data) : [];
        this.BudgetrequidDate = data;
        console.log("this.BudgetrequidDate ==",this.BudgetrequidDate)
        this.BudgetRequidBy = new Date(data[0].Budget_Required_By);
        console.log("this.BudgetRequidBy ==",this.BudgetRequidBy)
      });
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
SaveTenderMaster(valid){
 console.log(this.testchips);
 this.TenderFormSubmitted = true;
 if (valid){
 let tempArr =[]
 const TempObj = {
   Cost_Cen_ID : this.commonApi.CompacctCookies.Cost_Cen_ID,
   User_ID : this.commonApi.CompacctCookies.User_ID,
   Work_Name : this.ObjTender.Tender_Name,
   Work_Details : this.ObjTender.Work_Details,
   Tender_Org_ID : this.ObjTender.Tender_Org_ID,
   Tender_Calling_Div_ID : this.ObjTender.Tender_Calling_Div_ID,
   Tender_Execution_Div_ID : this.ObjTender.Tender_Execution_Div_ID,
   Tender_Ref_No : this.ObjTender.Tender_Ref_No,
   Tender_ID : this.ObjTender.Tender_ID,
   Tender_Type_ID : this.ObjTender.Tender_Type_ID,
   Tender_Category_ID : this.ObjTender.Tender_Category_ID,
   State : this.ObjTender.State,
   Tender_Value : this.ObjTender.Tender_Amount,
   Tender_Publish_Date : this.DateService.dateTimeConvert(new Date(this.TenderPublishDate)),
   Tender_Last_Sub_Date : this.DateService.dateTimeConvert(new Date(this.TenderEndDate)),
   Tender_Bid_Opening_Date : this.DateService.dateTimeConvert(new Date(this.TenderOpenDate)),
   EMD_Amount : this.ObjTender.EMD_Amount,
   T_Fee_Amount : Number(this.ObjTender.T_Fee_Amount),
   Enq_Source_ID : this.ObjTender.Tender_Publishing_Info_From,
   Tender_Informed_Date : this.DateService.dateConvert(new Date(this.InformedDate)),
   Period_Of_Working : this.PeriodOfWork,
   Budget_Required_By : this.DateService.dateConvert(new Date(this.BudgetRequidBy)),
   Govt_Proposal : "Govt",
   Remarks : this.ObjTender.Remarks
 }
  tempArr.push(TempObj)
// console.log(tempArr)
 // return JSON.stringify(tempArr);
 let wLarr =[]
    if(this.testchips.length) {
      this.testchips.forEach(el => {
        if(el){
          const Dobj = {
            Work_Location : el
            }
            wLarr.push(Dobj)
        }

    });
      // console.log("Table Data ===", Rarr)
      // return Rarr.length ? JSON.stringify(Rarr) : '';
   } 
    // else {
    //   const Dobj = {
    //     Req_No : 'NA'
    //     }
    //     wLarr.push(Dobj)
    // }
    //console.log("Table Data ===", Rarr)
    //return Rarr.length ? JSON.stringify(Rarr) : '';
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String" : "Tender_Govt_Create",
      "Json_Param_String": JSON.stringify(tempArr),
      "Json_1_String" : JSON.stringify(wLarr)
     // "Json_1_String" : JSON.stringify({Work_Location : this.testchips})
  
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log(data);
      var tempID = data[0].Column1;
      this.Tender_Doc_ID = data[0].Column1;
      if(data[0].Column1){
       this.FollowUpSave();
       this.testchips =[];
       this.InformedDate = new Date();
       this.GetBudgetrequiredDate();
        this.TenderFormSubmitted = false;
      } else{
       // this.ngxService.stop();
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
 FollowUpSave(){
  console.log(this.testchips);
  if (this.Tender_Doc_ID){
  const Obj = {
    Tender_Doc_ID : this.Tender_Doc_ID,
    Posted_By : this.commonApi.CompacctCookies.User_ID,
    Send_To : this.ObjTender.Assign_For_Budget,
    Status :  "BUDGET REQUIRED",
    Remarks : "Tender Created ( Govt. )"
  }
     const obj = {
       "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
       "Report_Name_String" : "BL_CRM_Txn_Enq_Tender_Harbauer_Followup_Save",
       "Json_Param_String": JSON.stringify([Obj])
   
     }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
       console.log(data);
       var tempID = data[0].Column1;
       if(data[0].Column1){
        // this.ngxService.stop();
        this.compacctToast.clear();
        //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Return_ID  " + tempID,
         detail: "Succesfully Created" //+ mgs
       });
        this.clearData();
        // this.testchips =[];
   
       } else{
        // this.ngxService.stop();
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
}
class Tender{
 // Tender_Doc_ID = 0;
  Tender_ID:string;
  Cost_Cen_ID:string;
  User_ID:string;
  //Posted_On:string;
  Enq_Source_ID:number;
  Tender_Org_ID	:string;
  Tender_Category_ID:string;
  Tender_Amount	:number;
  //Tender_Value : number;
  Tender_Name:string;
  //Work_Name :string;
  Work_Details:string;
  Work_Location:string;
  Tender_Opening_Date:string;
  Tender_Closing_Date:string;
  Remarks	:string;
  EMD_Amount:number;
  T_Fee_Amount:number;
  Enq_Source_Detail:string;
  Tender_Ref_No:string;
  Tender_Type_ID: string;
  Location:string;
  //Pin_Code:string;
  Period_Of_Work:string;
  EMD_Payable_At:string;
  T_Fee_Payable_At:string;
  T_Fee_Payable_To:string;
  Tender_Calling_Div_ID  :string;            
  Tender_Execution_Div_ID :string;                  
  State :string;        
  T_Fee_Payment_Mode:string;       
  T_Fee_Transaction_Ref_No:string; 
  Tender_Publishing_Info_From:string;
  Assign_For_Budget:string;
  
}

class Search{
  From_Date:string;
  To_Date:string;
  Date_Type:string;
  Tender_Closing_Date:string;
  Tender_Org_ID: string;
  Search_Type:string;
  Search_Text:string;
}




