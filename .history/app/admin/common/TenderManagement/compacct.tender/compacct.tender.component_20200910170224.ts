import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import * as moment from "moment";
declare var $:any;
import * as XLSX from 'xlsx';
import { FileUpload } from "primeng/primeng";

@Component({
  selector: 'app-compacct.tender',
  templateUrl: './compacct.tender.component.html',
  styleUrls: ['./compacct.tender.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctTenderComponent implements OnInit {
  tabIndexToView = 0;
  tabIndexToView2 = 0;
  items2 =['General Information','EMD / Tender Fee','Document','Task'];
  items = ["BROWSE", "CREATE" ,"BID OPENING"];
  url = window["config"];
  persons: [];
  buttonname = "Create";
  Spinner = false;
  ViewFlag = false;
  TenderSearchForm = false;
  TenderFormSubmitted = false;
  TenderList = [];
  TenderOpenDate = new Date();
  TenderEndDate =  new Date();;
  TenderPublishDate = new Date();
  TenderSearchDate = new Date();
  TFeeAmount = undefined;
  TenderAmount = undefined;
  PeriodOfWork = undefined;
  EMDAmount = undefined;
  ObjTender = new Tender();
  ObjTask = new Task();
  ObjSearch = new Search();
  TenderOrganization = undefined;
  OrgSubmitted = false;
  OrganizationModal = false;
  catSubmitted = false;
  TenderCategoryName = undefined;
  CategoryModal = false;

  TenderTypeName = undefined;
  TypeModal = false;
  TypeSubmitted = false;

  FormOfContract = undefined;
  ContactModal = false;
  ContractSubmitted = false;

  TenderPaymentMode = undefined;
  PaymentModal = false;
  PaymentSubmitted = false;


  EMDSubmitted = false;
  EMDModal = false;
  TenderFeeSubmitted = false;
  TenderFeeModal = false;

  EMDDepositDate = new Date();
  EMDBGDate = new Date();
  EMDBGExpDate = new Date();
  EMDMatureDate = new Date();
  EMDNEFTDate = new Date();
  FDAmount = undefined;
  FDMaturityAmount =undefined;
  ObjEMD = new EMD();

  TenderId = undefined;

  FeeDepositDate = new Date();
  FeeTransactionDate = new Date();
  ObjFee = new Fee();

  SubmissionSubmitted = false;
  SubmissionModal = false;
  SubmissionDate = new Date();;
  ObjSubmission = new Submission();

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
  // BID OPENING TAB
  BidOpeningFlag = false;
  BidOpeningFormSubmitted = false;
  BidOpeningListFormSubmitted = false;
  BidOpenListViewByRateFlag = false;
  BidOpenListViewByLotteryFlag = true;
  BidOpenListView =[];
  BidOpenListViewByRate = [];
  BidOpenListViewByLottery: Array<RankBidOpeningList> = [];

  ISDAmount = undefined;
  ISDMaturityAmount = undefined;
  ISDReleaseDate = new Date();
  ISDDepositDate = new Date();
  ISDBGDate = new Date();
  ISDBGExpDate = new Date();
  ISDMatureDate = new Date();
  ISDNEFTDate = new Date();
  ISDFDAmount = undefined;
  ISDFDMaturityAmount =undefined;
  APSDAmount = undefined;
  APSDMaturityAmount = undefined;
  APSDReleaseDate = new Date();
  APSDDepositDate = new Date();
  APSDBGDate = new Date();
  APSDBGExpDate = new Date();
  APSDMatureDate = new Date();
  APSDNEFTDate = new Date();
  APSDFDAmount = undefined;
  APSDFDMaturityAmount =undefined;
  AgreementValue = undefined;
  CommencementDate = new Date();
  CompletionDate = new Date();
  PeriodOfCompletion = undefined;
  EstimatedRate = undefined;


  ObjBidOpening = new BidOpening();
  ObjBidOpeningList = new BidOpeningList();
  AuthoritySubmitted = false;
  AuthorityName = undefined;
  AuthorityModal = false;
  BidderModal = false;
  BidderName = undefined;
  BidderSubmitted = false;
  CircleSubmitted = false;
  CircleName = undefined;
  CircleModal = false;
  DivisionSubmitted = false;
  DivisionName = undefined;
  DivisionModal = false;
  ReasonSubmitted = false;
  ReasonName = undefined;
  ReasonModal = false;
  FinalcialYearSubmitted = false;
  FinalcialYearName = undefined;
  FinalcialYearModal = false;

  TenderDetails:any;
  BidderList = [];
  AuthorityList = [];
  DivisionList = [];
  CircleList = [];
  ReasonList =[];
  ReasonSelect = [];
  FinancialYearList = [];

  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  BOQPDFFile:any = {};
  BOQdataString:any = [];
  BOQExcelList = [];
  ExcelModalFlag = false;
  BidEditFlag = false;
  BoqDocFormSubmitted = false;
  BOQExcelTotal = undefined;
  BOQExcelLess = undefined;
  BOQExcelGrandTotal = undefined;
  BOQExcelLessTotal = undefined;
  BOQExcelQuote = undefined;
  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  constructor( private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Tender",
      Link: " Tender Management -> Master -> Tender"
    });
    console.log('tt')
    this.GerCode();
    this.GetTenderOrgList();
    this.GetTenderCategoryList();
    this.GetInformList();
    this.GetIntimationList();
    this.GetTypeList();
    this.GetContractList();
    this.GetPaymentList();
    this.GetBidderList();
    this.GetAuthorityList();
    this.GetReasonList();
    this.GetFinancialYearList();
  }

   // INIT DATA
   GetTenderOrgList() {
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Organization_Json")
      .subscribe((data: any) => {
        this.tenderOrgList = data ? JSON.parse(data) : [];
      });
  }
  GetTenderCategoryList() {
    this.$http.get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Category_Json").subscribe((data: any) => {
      this.tenderCategoryList = data ? JSON.parse(data) : [];
    });
  }
  GetInformList() {
    this.$http
      .get("/Hearing_CRM_Lead/Get_Enq_Source")
      .subscribe((data: any) => {
        this.informList = data.length ? data : [];
      });
  }
  GetIntimationList() {
    this.IntimationList = [];
      this.$http
        .get(this.url.apiGetUserLists)
        .subscribe((data: any) => {
          const List = data ? data : [];
          List.forEach(el => {
            this.IntimationList.push({
              label: el.Name,
              value: el.User_ID
            });
          });
        });
  }
  GetTypeList() {
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Type_Json")
      .subscribe((data: any) => {
        this.TypeList = data ? JSON.parse(data) : [];
      });
  }
  GetContractList() {
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Form_Of_Contract_Json")
      .subscribe((data: any) => {
        this.ContractList = data ? JSON.parse(data) : [];
      });
  }
  GetPaymentList() {
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Payment_Type_Json")
      .subscribe((data: any) => {
        this.PaymentList = data ? JSON.parse(data) : [];
      });
  }
  GerCode() {
    this.$http
      .get("/Scripts/Common/CountryCodes.json")
      .subscribe((data: any) => {
        this.CountryCodeList = data ? data : [];
        this.ObjTender.dial_code = '+91';
      });
  }

  // CHANGE
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearch.From_Date = dateRangeObj[0];
      this.ObjSearch.To_Date = dateRangeObj[1];
    }
  }
  getAddressOnChange(e) {
     this.ObjTender.Location = undefined;
    if (e) {
       this.ObjTender.Location = e;
    }
  }
  GetTenderOpenDate(date) {
    if (date) {
      this.ObjTender.Tender_Opening_Date =  this.DateService.dateTimeConvert(new Date(date));
    }
  }
  GetTenderEndDate(date) {
    if (date) {
      this.ObjTender.Tender_Closing_Date = this.DateService.dateTimeConvert(new Date(date));
    }
  }
  GetTenderPublishDate(date) {
    if (date) {
      this.ObjTender.Tender_Publish_Date = this.DateService.dateTimeConvert(new Date(date));
    }
  }
  GetSubmissionDate(date){
    if (date) {
      this.ObjSubmission.Tender_Submission_Date = this.DateService.dateTimeConvert(new Date(date));
    }
  }
  GetTenderSearchDate(date) {
    if (date) {
      this.ObjSearch.Tender_Closing_Date = this.DateService.dateConvert(
        moment(date, "YYYY-MM-DD")["_d"]
      );
    }
  }
  TenderAmountChange(e){
    this.ObjTender.Tender_Amount = undefined;
    this.ObjTender.EMD_Amount = undefined;
    this.ObjEMD.EMD_Amount = undefined;
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
  TenderFeeChange(e){
    console.log(e);
    this.ObjTender.T_Fee_Amount = undefined;
    if(e) {
      const x= e.toString();
      const number = Number(e);
     const k =  number.toLocaleString('en-IN', {
         maximumFractionDigits: 2,
         style: 'currency',
         currency: 'INR'
     });
     this.ObjTender.T_Fee_Amount = Number(e);
     this.TFeeAmount = k;
    }
  }
  TenderEMDChange(e){
    console.log(e);
    this.ObjTender.EMD_Amount = undefined;
    this.ObjEMD.EMD_Amount = undefined;
    if(e) {
      const x= e.toString();
      const number = Number(e);
     const k =  number.toLocaleString('en-IN', {
         maximumFractionDigits: 2,
         style: 'currency',
         currency: 'INR'
     });
     this.ObjTender.EMD_Amount = Number(e);
     this.ObjEMD.EMD_Amount = Number(e);
     this.EMDAmount = k;
    }
  }
  TenderFDChange(e){
    console.log(e);
    this.ObjEMD.EMD_FD_Amount = undefined;
    if(e) {
      const x= e.toString();
      const number = Number(e);
     const k =  number.toLocaleString('en-IN', {
         maximumFractionDigits: 2,
         style: 'currency',
         currency: 'INR'
     });
     this.ObjEMD.EMD_FD_Amount = Number(e);
     this.FDAmount = k;
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
  TenderFDMaturityChange(e){
    console.log(e);
    this.ObjEMD.EMD_FD_Mature_Amount = undefined;
    if(e) {
      const x= e.toString();
      const number = Number(e);
     const k =  number.toLocaleString('en-IN', {
         maximumFractionDigits: 2,
         style: 'currency',
         currency: 'INR'
     });
     this.ObjEMD.EMD_FD_Mature_Amount = Number(e);
     this.FDMaturityAmount = k;
    }
  }
  TenderAmountView(e){
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

  // ACTION FUNCTIONS
  GetEMDDepositDate (date) {
    if (date) {
      this.ObjEMD.EMD_Amount_Deposit_Date = this.DateService.dateConvert(
        moment(date, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetEMDBGDate (date) {
    if (date) {
      this.ObjEMD.EMD_BG_Creation_Date= this.DateService.dateConvert(
        moment(date, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetEMDBGExptDate (date) {
    if (date) {
      this.ObjEMD.EMD_BG_Exp_Date = this.DateService.dateConvert(
        moment(date, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetEMDMatureDateDate (date) {
    if (date) {
      this.ObjEMD.EMD_FD_Mature_Date = this.DateService.dateConvert(
        moment(date, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetEMDNEFTDate (date) {
    if (date) {
      this.ObjEMD.EMD_NEFT_Txn_Date = this.DateService.dateConvert(
        moment(date, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetFeeDepositDate (date) {
    if (date) {
      this.ObjFee.T_Fee_Amount_Deposit_Date = this.DateService.dateConvert(
        moment(date, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetFeeTransactionDate (date) {
    if (date) {
      this.ObjFee.T_Fee_NEFT_Txn_Date = this.DateService.dateConvert(
        moment(date, "YYYY-MM-DD")["_d"]
      );
    }
  }

  // View
  View(obj) {
    this.clearData();
    this.DocumentList =[];
    this.TaskList = [];
    this.ObjTask = new Task();
    this.ObjFee = new Fee();
    this.ObjEMD = new EMD();
    if(obj.Foot_Fall_ID){
      this.ObjTender = obj;
      this.TenderAmountChange(obj.Tender_Amount);
      this.TenderFeeChange(obj.T_Fee_Amount);
      this.TenderEMDChange(obj.EMD_Amount);
      this.TenderPeriodOfWorkChange(obj.Period_Of_Work);
      this.GetTask(obj.Foot_Fall_ID,false);
      this.GetDocument(obj.Foot_Fall_ID);
      this.viewBooth(obj.Foot_Fall_ID)
    }
  }
  CloseViewModal(){
    this.clearData();
    this.DocumentList =[];
    this.ObjTask = new Task();
    this.ObjFee = new Fee();
    this.ObjEMD = new EMD();

  }
  viewBooth(footfallID) {
    if(footfallID) {
      const obj = new HttpParams()
      .set("Foot_Fall_ID",footfallID);
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_EMD_Tender_Json", { params: obj })
      .subscribe((data: any) => {
        console.log(data);
        const obj = data ? JSON.parse(data)[0] : {};
        this.ObjFee = obj;
        this.ObjEMD = obj;
      });
    }
  }
  GetDocument(foofFall) {
    if(foofFall) {
      const params = new HttpParams().set("Foot_Fall_ID", foofFall);
      this.$http
        .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Document_Json", { params })
        .subscribe((data: any) => {
          this.DocumentList = data ? JSON.parse(data) : [];
          this.ViewFlag = true;
        });

    }
  }
  GetTask(foofFall ,flag) {
    if(foofFall){
      const obj = new HttpParams().set("Foot_Fall_ID", foofFall);
      this.$http
        .get("/BL_CRM_Txn_Enq_Task/Get_My_Task_Retrieve_FootFall", { params: obj })
        .subscribe((data: any) => {
          this.TaskList = data ? JSON.parse(data) : [];
          if(flag) {
            this.IntimationSelect = [];
            for(let k=0;k < this.TaskList.length;k++){
              this.IntimationSelect.push(this.TaskList[k].Tagged_To_User_ID);

            }
          }
        });
    }
  }

  getTaggedByID(ID) {
    let taggedname = undefined;

    for(let k = 0;k < this.IntimationList.length;k++) {
      if(this.IntimationList[k].value === ID) {
        taggedname = this.IntimationList[k].label;
      }
    }
    return taggedname;
  }
  GetOrgName(id) {
    const name = $.grep(this.tenderOrgList ,function(obj) {return obj.Tender_Org_ID === id})[0].Tender_Organization;
    return name ? name : '-';
  }
  GetCatName(id) {
    const name = $.grep(this.tenderCategoryList ,function(obj) {return obj.Tender_Category_ID === id})[0].Tender_Category_Name;
    return name ? name : '-';
  }
  GetInformName(id) {
    const name = $.grep(this.informList ,function(obj) {return obj.Enq_Source_ID === id})[0].Enq_Source_Name;
    return name ? name : '-';
  }
  GetTypeName(id) {
    const name = $.grep(this.TypeList ,function(obj) {return obj.Tender_Type_ID === id})[0].Tender_Type_Name;
    return name ? name : '-';
  }
  GetContaractName(id) {
    const name = $.grep(this.ContractList ,function(obj) {return obj.Form_Of_Contract_ID === id})[0].Form_Of_Contract;
    return name ? name : '-';
  }
  GetPaymentName(id) {
    const name = $.grep(this.PaymentList ,function(obj) {return obj.Tender_Payment_Mode_ID === id})[0].Tender_Payment_Mode;
    return name ? name : '-';
  }

  // CREATE
 ToggleOrganization(){
  this.TenderOrganization = undefined;
  this.OrgSubmitted = false;
  this.OrganizationModal = true;
  this.Spinner = false;
 }
 ToggleCategory(){
  this.catSubmitted = false;
  this.TenderCategoryName = undefined;
  this.CategoryModal = true;
  this.Spinner = false;
 }
 ToggleType(){
  this.TenderTypeName = undefined;
  this.TypeSubmitted = false;
  this.TypeModal = true;
  this.Spinner = false;
 }
 ToggleContact(){
  this.ContractSubmitted = false;
  this.FormOfContract = undefined;
  this.ContactModal = true;
  this.Spinner = false;
 }
 TogglePayment(){
  this.PaymentSubmitted = false;
  this.TenderPaymentMode = undefined;
  this.PaymentModal = true;
  this.Spinner = false;
 }
 CreateOrganization(valid){
  this.OrgSubmitted = true;
  if(valid) {
      this.Spinner = true;
      const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Tender_Organization";
      const obj = { Tender_Organization: this.TenderOrganization };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        console.log(data)
      if (data.success) {
        this.Spinner = false;
        // if (this.ObjTender.Foot_Fall_ID) {
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
 CreateCategory(valid){
  this.catSubmitted = true;
   if(valid) {
      this.Spinner = true;
      const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Tender_Category";
      const obj = { Tender_Category_Name: this.TenderCategoryName };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        console.log(data)
      if (data.success) {
        // if (this.ObjTender.Foot_Fall_ID) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Category Created"
          });
        // } else {
        //   this.compacctToast.clear();
        //   this.compacctToast.add({
        //     key: "compacct-toast",
        //     severity: "success",
        //     summary: "",
        //     detail: "Category Already Exits"
        //   });
        // }
        this.GetTenderCategoryList();
        this.catSubmitted = false;
        this.TenderCategoryName = undefined;
        this.CategoryModal = false;
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
 CreateType(valid){
  this.TypeSubmitted = true;
  if(valid) {
      this.Spinner = true;
      const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Tender_Type";
      const obj = {  Tender_Type_Name: this.TenderTypeName };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        console.log(data)
      if (data.success) {
        this.Spinner = false;
        // if (this.ObjTender.Foot_Fall_ID) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Tender Type Created"
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
        this.GetTypeList();
        this.TenderTypeName = undefined;
        this.TypeSubmitted = false;
        this.TypeModal = false;
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
 CreateContact(valid){
  this.ContractSubmitted = true;
   if(valid) {
      this.Spinner = true;
      const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Tender_Form_Of_Contract";
      const obj = { Form_Of_Contract : this.FormOfContract  };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        console.log(data)
      if (data.success) {
        this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Form of Contact Created"
          });
        // } else {
        //   this.compacctToast.clear();
        //   this.compacctToast.add({
        //     key: "compacct-toast",
        //     severity: "success",
        //     summary: "",
        //     detail: "Contact Already Exits"
        //   });
        // }
        this.GetContractList();
        this.ContractSubmitted = false;
        this.FormOfContract = undefined;
        this.ContactModal = false;
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
 CreatePayment(valid){
  this.PaymentSubmitted = true;
   if(valid) {
      this.Spinner = true;
      const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Tender_Payment_Type";
      const obj = { Tender_Payment_Mode: this.TenderPaymentMode };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        console.log(data)
      if (data.success) {
        this.Spinner = false;
        // if (this.ObjTender.Foot_Fall_ID) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Payment Type Created"
          });
        // } else {
        //   this.compacctToast.clear();
        //   this.compacctToast.add({
        //     key: "compacct-toast",
        //     severity: "success",
        //     summary: "",
        //     detail: "Payment Type Already Exits"
        //   });
        //}
        this.GetPaymentList();
        this.PaymentSubmitted = false;
        this.TenderPaymentMode = undefined;
        this.PaymentModal = false;
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

 // data
 FecthTask(footfallID) {
   let arr = [];
   for(let i=0; i < this.IntimationSelect.length;i++){
     this.ObjTask.Foot_Fall_ID = Number(footfallID);
     this.ObjTask.Tagged_To_User_ID = this.IntimationSelect[i];
     this.ObjTask.Created_By =  this.commonApi.CompacctCookies.User_ID;
     this.ObjTask.Last_Updated_On =  this.DateService.dateConvert(new Date());
     this.ObjTask.Created_On =  this.DateService.dateConvert(new Date());
     const tt = moment(new Date(this.ObjTender.Tender_Opening_Date)).subtract( 1,'days')['_d'];
     this.ObjTask.Due_On = this.DateService.dateConvert(tt);
     this.ObjTask.Task_Subject = 'Review Tender ('+this.ObjTender.Tender_Name+' - '+this.GetOrgName(this.ObjTender.Tender_Org_ID)+' - '+this.ObjTender.Tender_Amount+')';
     arr.push(this.ObjTask);
     this.ObjTask = new Task();
   }
   console.log(arr)
   this.SaveTask(JSON.stringify(arr));
 }
 FetchEMDdata() {
  const today = this.DateService.dateConvert(new Date());
  this.ObjEMD.EMD_Amount_Deposit_Date =   this.ObjEMD.EMD_Amount_Deposit_Date  ?   this.ObjEMD.EMD_Amount_Deposit_Date : today;
   if(this.ObjEMD.EMD_Amount_Deposit_Type === 'BG') {
    this.ObjEMD.EMD_BG_Creation_Date =   this.EMDBGDate  ?  this.DateService.dateConvert(new Date(this.EMDBGDate)) : today;
    this.ObjEMD.EMD_BG_Exp_Date =   this.EMDBGExpDate  ?   this.DateService.dateConvert(new Date(this.EMDBGExpDate)) : today;
    this.ObjEMD.EMD_FD_Mature_Date = '';
    this.ObjEMD.EMD_NEFT_Txn_Date = '';
    this.ObjEMD.EMD_NEFT_TXN_No = '';
    this.ObjEMD.EMD_FD_Mature_Amount = 0;
    this.ObjEMD.EMD_FD_Amount = 0;
   }
    if (this.ObjEMD.EMD_Amount_Deposit_Type === 'FD') {
    this.ObjEMD.EMD_FD_Mature_Date =   this.EMDMatureDate ?  this.DateService.dateConvert(new Date(this.EMDMatureDate)) : today;
    this.ObjEMD.EMD_BG_Creation_Date = '';
    this.ObjEMD.EMD_BG_Exp_Date = '';
    this.ObjEMD.EMD_NEFT_Txn_Date = '';
    this.ObjEMD.EMD_NEFT_TXN_No = '';
   }
    if ((this.ObjEMD.EMD_Amount_Deposit_Type ==='NEFT' || this.ObjEMD.EMD_Amount_Deposit_Type ==='RTGS')) {
    this.ObjEMD.EMD_NEFT_Txn_Date =   this.EMDNEFTDate  ?    this.DateService.dateConvert(new Date(this.EMDNEFTDate)) : today;
    this.ObjEMD.EMD_BG_Creation_Date = '';
    this.ObjEMD.EMD_BG_Exp_Date = '';
    this.ObjEMD.EMD_FD_Mature_Date = '';
    this.ObjEMD.EMD_FD_Mature_Amount = 0;
    this.ObjEMD.EMD_FD_Amount = 0;
   }
 }

 // Search
 SearchTender(valid) {
  this.TenderSearchForm = true;
  this.TenderList = [];
  this.TenderId = undefined;
  if (valid) {
    this.Spinner = true;
    const obj = new HttpParams()
    .set("Date_Type", this.ObjSearch.Date_Type)
    .set("From_Date", this.ObjSearch.From_Date ?  this.DateService.dateConvert(new Date(this.ObjSearch.From_Date)) : this.DateService.dateConvert(new Date()))
    .set("To_Date", this.ObjSearch.To_Date ?  this.DateService.dateConvert(new Date(this.ObjSearch.To_Date)) : this.DateService.dateConvert(new Date()))
    .set("Tender_Org_ID",this.ObjSearch.Tender_Org_ID ? this.ObjSearch.Tender_Org_ID : '0');
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_All_Tender_Browse", { params: obj })
      .subscribe((data: any) => {
        this.TenderList = data.length ? JSON.parse(data) : [];
        this.Spinner = false;
        this.TenderSearchForm = false;
      });
  }
  }
// Save
  SaveTenderMaster(valid) {
  this.TenderFormSubmitted = true;
  if (valid && this.IntimationSelect.length) {
  this.Spinner = true;
  this.ObjTender.Tender_Opening_Date = this.ObjTender.Tender_Opening_Date ? this.ObjTender.Tender_Opening_Date : this.DateService.dateTimeConvert(new Date(this.TenderOpenDate));
  this.ObjTender.Tender_Closing_Date = this.ObjTender.Tender_Closing_Date ? this.ObjTender.Tender_Closing_Date : this.DateService.dateTimeConvert(new Date(this.TenderEndDate));
  this.ObjTender.Tender_Publish_Date = this.ObjTender.Tender_Publish_Date ? this.ObjTender.Tender_Publish_Date : this.DateService.dateTimeConvert(new Date(this.TenderPublishDate));
  this.ObjTender.Posted_On = this.DateService.dateTimeConvert(new Date());
  this.ObjTender.User_ID =  this.commonApi.CompacctCookies.User_ID;
  this.ObjTender.Cost_Cen_ID =  this.commonApi.CompacctCookies.Cost_Cen_ID;
  const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Insert_Enq_Tender";
  const obj = { Enq_Tender_String: JSON.stringify([this.ObjTender]) };
  this.$http.post(UrlAddress, obj).subscribe((data: any) => {
    if (data.success) {
      this.FootfalID = data.Foot_Fall_ID;
      this.FecthTask(data.Foot_Fall_ID);
      console.group("Compacct V2");
      console.log("%c  Tender Sucess:", "color:green;");
      console.log("/BL_CRM_Txn_Enq_Tender/Insert_Enq_Tender");
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
  } else {
    if(!this.IntimationSelect.length){
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "No Intimation Found, Please Choose a Intimation "
        });
    }
  }
  }
  SaveTask(obj){
    this.$http
    .post("/BL_CRM_Txn_Enq_Task/Insert_Enq_Task", { Enq_Task_String: obj })
    .subscribe((data: any) => {
      if (data.success === true) {
       // this.SendEmail(this.FootfalID);
       const foot =  this.FootfalID;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Lead ID  :" +  this.FootfalID,
          detail: "Tender for "+this.ObjTender.Tender_Name+" of " + this.GetOrgName(this.ObjTender.Tender_Org_ID)+" Saved Successfully"
        });
         // this.clearData();
          this.FootfalID = foot;
          this.ObjTender.Foot_Fall_ID = foot;
          this.Spinner = false;
          this.buttonname = "Update";
        console.group("Compacct V2");
        console.log("%c  Task Sucess:", "color:green;");
        console.log("/BL_CRM_Txn_Enq_Task/Insert_Enq_Task");
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

  SaveEMD(valid){
    this.EMDSubmitted = true;
    console.log(this.EMDBGExpDate)
    if (valid) {
      this.FetchEMDdata();
      console.log( this.ObjEMD)
      this.Spinner = true;
      const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Update_EMD";
      this.$http.post(UrlAddress, this.ObjEMD).subscribe((data: any) => {
        if (data.success) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Lead ID  :" +  this.ObjEMD.Foot_Fall_ID,
            detail: "Succesfully EMD Updated"
          });
          this.SearchTender(true);
          this.EMDSubmitted = false;
          this.ObjEMD = new EMD();
          this.EMDModal = false;
          this.Spinner = false;
          console.group("Compacct V2");
          console.log("%c  EMD Sucess:", "color:green;");
          console.log("/BL_CRM_Txn_Enq_Tender/Update_EMD");
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
  SaveFee(valid){
    this.TenderFeeSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const today = this.DateService.dateConvert(new Date());
      this.ObjFee.T_Fee_Amount_Deposit_Date =   this.FeeDepositDate  ?  this.DateService.dateConvert( this.FeeDepositDate ) : today;
      this.ObjFee.T_Fee_NEFT_Txn_Date =   this.ObjFee.T_Fee_NEFT_Txn_Date  ?   this.ObjFee.T_Fee_NEFT_Txn_Date : today;
      console.log( this.ObjFee)
      const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Update_Tender_Fee";
      this.$http.post(UrlAddress, this.ObjFee).subscribe((data: any) => {
        if (data.success) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Lead ID  :" +  this.ObjFee.Foot_Fall_ID,
            detail: "Succesfully Tender Fee Updated"
          });
          this.SearchTender(true);
          this.TenderFeeSubmitted = false;
          this.ObjFee = new Fee();
          this.TenderFeeModal = false;
          this.Spinner = false;
          console.group("Compacct V2");
          console.log("%c  Tender Free Sucess:", "color:green;");
          console.log("/BL_CRM_Txn_Enq_Tender/Update_Tender_Fee");
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
  SaveSubmissionDate(valid) {
    this.SubmissionSubmitted = false;
    if(valid) {
      this.Spinner = true;
      this.ObjSubmission.Tender_Submission_Date = this.DateService.dateTimeConvert(new Date(this.SubmissionDate))
      this.$http
        .post("BL_CRM_Txn_Enq_Tender/Update_Submission_Date",this.ObjSubmission)
        .subscribe((data: any) => {
          if (data.success === true) {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Succesfully Submission Date Updated"
              });
              this.SearchTender(true);
              this.SubmissionSubmitted = false;
              this.SubmissionModal = false;
              this.SubmissionDate = new Date();
              this.Spinner = false;
              this.ObjSubmission = new Submission();
            console.group("Compacct V2");
            console.log("%c  Submission Date Updated:", "color:green;");
            console.log("BL_CRM_Txn_Enq_Tender/Update_Submission_Date");
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

  // Edit & UPDATES
  EditTender(obj) {
    this.clearData();
    if (obj.Foot_Fall_ID) {
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.ObjTender = obj;
    this.locationInput.nativeElement.value = obj.Location ? obj.Location : '';
    this.TenderAmountChange(obj.Tender_Amount);
    this.TenderFeeChange(obj.T_Fee_Amount);
    this.TenderEMDChange(obj.EMD_Amount);
    this.TenderPeriodOfWorkChange(obj.Period_Of_Work);
    this.FootfalID = obj.Foot_Fall_ID;
    this.GetTask(this.FootfalID , true);
    this.TenderPublishDate = new Date(obj.Tender_Publish_Date);
    this.ObjTender.Tender_Publish_Date =  this.DateService.dateTimeConvert(new Date(obj.Tender_Publish_Date));
    this.TenderEndDate =  new Date(obj.Tender_Closing_Date);
    this.ObjTender.Tender_Closing_Date =  this.DateService.dateTimeConvert(new Date(obj.Tender_Closing_Date));
    this.TenderOpenDate = new Date(obj.Tender_Opening_Date);
    this.ObjTender.Tender_Opening_Date =  this.DateService.dateTimeConvert(new Date(obj.Tender_Opening_Date));
    //this.GetEditMasterTender(obj);
    }
  }
  GetEditMasterTender(obj) {
  }
  UpdateEMD(obj) {
    this.EMDSubmitted = false;
    this.ObjEMD = new EMD();
    this.EMDModal = false;
    this.EMDDepositDate = new Date();
    this.EMDBGDate = new Date();
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    this.EMDBGExpDate = new Date(date);
    this.EMDMatureDate = new Date();
    this.EMDNEFTDate = new Date();
    this.EMDAmount = undefined;
    this.FDAmount = undefined;
    this.FDMaturityAmount =undefined;
    this.Spinner = false;
    if(obj.Foot_Fall_ID) {
      this.GetUpdatedEMD(obj.Foot_Fall_ID);
      this.ObjEMD.Foot_Fall_ID = obj.Foot_Fall_ID;
    }
  }
  UpdateTenderFee(obj) {
    this.TenderFeeSubmitted = false;
    this.ObjFee = new Fee();
    this.FeeDepositDate = new Date();
    this.FeeTransactionDate = new Date();
    this.Spinner = false;
    if(obj.Foot_Fall_ID) {
      this.ObjFee.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.GetUpdatedFee(obj.Foot_Fall_ID);
    }
  }
  UpdateSubmissionDate(obj){
    this.SubmissionSubmitted = false;
    this.SubmissionModal = false;
    this.SubmissionDate =  new Date();
    this.ObjSubmission = new Submission();
    this.Spinner = false;
    if(obj.Foot_Fall_ID){
      this.ObjSubmission.Foot_Fall_ID =obj.Foot_Fall_ID;
      if(obj.Tender_Submission_Date) {
       // this.SubmissionDate = moment(new Date(obj.Tender_Submission_Date))format("YYYY-MM-DDTHH:mm");
       this.SubmissionDate =  new Date(obj.Tender_Submission_Date);
        this.ObjSubmission.Tender_Submission_Date =  this.DateService.dateTimeConvert(new Date(obj.Tender_Submission_Date));
      }
      this.SubmissionModal = true;
    }
  }

  GetUpdatedEMD(footfallID) {
    if(footfallID) {
      const obj = new HttpParams()
      .set("Foot_Fall_ID",footfallID);
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_EMD_Tender_Json", { params: obj })
      .subscribe((data: any) => {
        console.log(data);
        const obj = data ? JSON.parse(data)[0] : {};
        this.TenderEMDChange(obj.EMD_Amount);
        if (obj.EMD_Amount_Deposit_Type) {
          this.ObjEMD.EMD_Amount_Deposit_Type = obj.EMD_Amount_Deposit_Type;
          this.EMDDepositDate = new Date(obj.EMD_Amount_Deposit_Date);
          this.ObjEMD.EMD_Amount_Deposit_Date = this.DateService.dateConvert(obj.EMD_Amount_Deposit_Date);
          if(this.ObjEMD.EMD_Amount_Deposit_Type === 'BG') {
           this.ObjEMD.EMD_BG_Creation_Date = this.DateService.dateConvert(obj.EMD_BG_Creation_Date);
           this.EMDBGDate = new Date(obj.EMD_BG_Creation_Date);
           this.ObjEMD.EMD_BG_Exp_Date =   this.DateService.dateConvert(obj.EMD_BG_Exp_Date);
           this.EMDBGExpDate = new Date(obj.EMD_BG_Exp_Date);
          } else if (this.ObjEMD.EMD_Amount_Deposit_Type === 'FD') {
           this.ObjEMD.EMD_FD_Mature_Date =   this.DateService.dateConvert(obj.EMD_FD_Mature_Date);
           this.EMDMatureDate = new Date(obj.EMD_FD_Mature_Date);
           this.TenderFDMaturityChange(obj.EMD_FD_Mature_Amount);
           this.TenderFDChange(obj.EMD_FD_Amount);
          }else if ((this.ObjEMD.EMD_Amount_Deposit_Type ==='NEFT' || this.ObjEMD.EMD_Amount_Deposit_Type ==='RTGS')) {
           this.ObjEMD.EMD_NEFT_Txn_Date =   this.DateService.dateConvert(obj.EMD_NEFT_Txn_Date);
           this.EMDNEFTDate = new Date(obj.EMD_NEFT_Txn_Date);
           this.ObjEMD.EMD_NEFT_TXN_No = obj.EMD_NEFT_TXN_No;
          }
        }
        this.EMDModal = true;
      });
    }
  }
  GetUpdatedFee(footfallID) {
    if(footfallID) {
      const obj = new HttpParams()
      .set("Foot_Fall_ID",footfallID);
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_EMD_Tender_Json", { params: obj })
      .subscribe((data: any) => {
        console.log(data);
        const obj = data ? JSON.parse(data)[0] : {};
        if (obj.T_Fee_NEFT_TXN_No) {
          this.ObjFee.T_Fee_NEFT_TXN_No = obj.T_Fee_NEFT_TXN_No;
          this.FeeDepositDate = new Date(obj.T_Fee_Amount_Deposit_Date);
          this.FeeTransactionDate = new Date(obj.T_Fee_NEFT_Txn_Date);
          this.ObjFee.T_Fee_Amount_Deposit_Date = this.DateService.dateConvert(obj.T_Fee_Amount_Deposit_Date);
          this.ObjFee.T_Fee_NEFT_Txn_Date = this.DateService.dateConvert(obj.T_Fee_NEFT_Txn_Date);
        }
        this.TenderFeeModal = true;
      });
    }
  }

  // Delete
  onConfirm() {
    if ( this.TenderId) {
      this.$http
        .post("/BL_CRM_Txn_Enq_Tender/Delete_Tender", { Foot_Fall_ID:  this.TenderId })
        .subscribe((data: any) => {
          if (data.success === true) {
            this.onReject();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "LEAD ID: " + this.TenderId,
              detail: "Succesfully Deleted"
            });
            this.SearchTender(true);
          }
        });
    }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  DeleteTender(obj) {
    this.TenderId = undefined;
    if (obj.Foot_Fall_ID) {
      this.TenderId = obj.Foot_Fall_ID;
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
  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE" ,"BID OPENING"];
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
    this.TenderAmount = undefined;
    this.EMDAmount = undefined;
    this.PeriodOfWork = undefined;
    this.locationInput.nativeElement.value = '';
    this.TenderId = undefined;
  }
  GetFlagFromDocument(e) {
    console.log(e);
    this.clearData();
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
  }
  onNavigate(site){
    window.open('//'+site, "_blank");
  }

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
  CheckIfTenderRefNoExist(){
    if( this.ObjTender.Tender_Ref_No) {
      const params = new HttpParams().set("Tender_Ref_No", this.ObjTender.Tender_Ref_No);
      this.$http
        .get("/BL_CRM_Txn_Enq_Tender/Check_Tender_Ref_No_Exist", { params })
        .subscribe((data: any) => {
          console.log(data);
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
    if(Amt){
      if(field === 'TenderAmount') {
        this.TenderAmount = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'TFeeAmount') {
        this.TFeeAmount = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'EMDAmount') {
        this.EMDAmount = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'FDAmount') {
        this.FDAmount = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'FDMaturityAmount') {
        this.FDMaturityAmount = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'ISDAmount') {
        this.ISDAmount = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'APSDAmount') {
        this.APSDAmount = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'ISDFDAmount') {
        this.ISDFDAmount = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'AgreementValue') {
        this.AgreementValue = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'ISDFDMaturityAmount') {
        this.ISDFDMaturityAmount = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'APSDFDAmount') {
        this.APSDFDAmount = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'APSDFDMaturityAmount') {
        this.APSDFDMaturityAmount = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'ISDMaturityAmount') {
        this.ISDMaturityAmount = Amt.split("₹").join("").split(",").join("");
      }
      if(field === 'APSDMaturityAmount') {
        this.APSDMaturityAmount = Amt.split("₹").join("").split(",").join("");
      }
    }
  }
  onFocusOutEvent(field,Amt){
    if(Amt){
      const filterAmt = Amt.split("₹").join("").split(",").join("");
      if(field === 'TenderAmount') {
        this.TenderAmountChange(filterAmt);
      }
      if(field === 'TFeeAmount') {
        this.TenderFeeChange(filterAmt);
      }
      if(field === 'EMDAmount') {
        this.TenderEMDChange(filterAmt);
      }
      if(field === 'FDAmount') {
        this.TenderFDChange(filterAmt);
      }
      if(field === 'FDMaturityAmount') {
        this.TenderFDMaturityChange(filterAmt);
      }
      if(field === 'ISDAmount') {
        this.ISDAmountChange(filterAmt);
      }
      if(field === 'APSDAmount') {
          this.APSDAmountChange(filterAmt);
      }
      if(field === 'ISDFDAmount') {
          this.ISDFDAmountChange(filterAmt);
      }
      if(field === 'AgreementValue') {
          this.AgreementValueAmountChange(filterAmt);
      }
      if(field === 'ISDFDMaturityAmount') {
          this.ISDFDMaturityAmountChange(filterAmt);
      }
      if(field === 'APSDFDAmount') {
          this.APSDFDAmountChange(filterAmt);
      }
      if(field === 'APSDFDMaturityAmount') {
          this.APSDFDMaturityAmountChange(filterAmt);
      }
      if(field === 'ISDMaturityAmount') {
        this.ISDMaturityAmountChange(filterAmt);
      }
      if(field === 'APSDMaturityAmount') {
        this.APSDMaturityAmountChange(filterAmt);
      }
    }
  }

// BID OPEN
GetBidderList() {
  this.$http
    .get("/BL_CRM_Txn_Enq_Tender/Get_Bidder_Json")
    .subscribe((data: any) => {
      this.BidderList = data ? JSON.parse(data) : [];
    });
}
GetAuthorityList() {
  this.$http
    .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Inviting_Authority_Json")
    .subscribe((data: any) => {
      this.AuthorityList = data ? JSON.parse(data) : [];
    });
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
GetFinancialYearList() {
  this.$http
    .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Fin_Year_Name_Json")
    .subscribe((data: any) => {
      this.FinancialYearList = data ? JSON.parse(data) : [];
    });
}
GetIFBidExist(footfallId) {
  if (this.PDFFlag) {
    this.fileInput.clear();
    this.BOQdataString =  [];
  }
  if(footfallId) {
    const params = new HttpParams().set("Foot_Fall_ID", footfallId);
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Bidding_Common_Json", { params })
      .subscribe((data: any) => {
       const TempArr = data ? JSON.parse(data) : [];
       if(TempArr[0].Tender_Inviting_Authority) {
         this.BidEditFlag = true;
         const obj = TempArr[0];
          this.ObjBidOpening = obj;
          if(this.ObjBidOpening['BOQ_File_Name']) {
            this.GetBOQExcelList(footfallId);
          } else {
            this.BOQExcelList = [];
          }
          this.GetBidOpenList(footfallId);
          this.GetRankBidOpenList(footfallId);
          if(obj.Financial_Bid_Status === 'AWARDING THE TENDER') {
          this.ISDAmountChange(obj.ISD_Amount);
          this.APSDAmountChange(obj.APSD_Amount);
          this.ISDMaturityAmountChange(obj.ISD_Maturity_Amount);
          this.APSDMaturityAmountChange(obj.APSD_Maturity_Amount);
          this.GetDivision(obj.Circle)
          if(obj.ISD_FD_Amount){
            this.ISDFDAmountChange(obj.ISD_FD_Amount);
          }
          if(obj.ISD_FD_Mature_Amount){
            this.ISDFDMaturityAmountChange(obj.ISD_FD_Mature_Amount);
          }
          if(obj.APSD_FD_Amount){
            this.APSDFDAmountChange(obj.APSD_FD_Amount);
          }
          if(obj.APSD_FD_Mature_Amount){
            this.APSDFDMaturityAmountChange(obj.APSD_FD_Mature_Amount);
          }
          this.AgreementValueAmountChange(obj.Agreement_Value);
          this.ISDReleaseDate = new Date(obj.ISD_Release_Date);
          this.APSDReleaseDate = new Date(obj.APSD_Release_Date);
          this.ISDDepositDate = new Date(obj.ISD_Deposit_date);
          this.ISDBGDate = obj.ISD_BG_Creation_Date ?  new Date(obj.ISD_BG_Creation_Date) : new Date();
          this.ISDBGExpDate =  obj.ISD_BG_Exp_Date ?  new Date(obj.ISD_BG_Exp_Date) : new Date();
          this.ISDMatureDate =  obj.ISD_FD_Mature_Date ?  new Date(obj.ISD_FD_Mature_Date) : new Date();
          this.ISDNEFTDate =  obj.ISD_NEFT_Txn_Date ?  new Date(obj.ISD_NEFT_Txn_Date) : new Date();
          this.APSDDepositDate = new Date(obj.APSD_Deposit_date);
          this.APSDBGDate =  obj.APSD_BG_Creation_Date ?  new Date(obj.APSD_BG_Creation_Date) : new Date();
          this.APSDBGExpDate =  obj.APSD_BG_Exp_Date ?  new Date(obj.APSD_BG_Exp_Date) : new Date();
          this.APSDMatureDate =  obj.APSD_FD_Mature_Date ?  new Date(obj.APSD_FD_Mature_Date) : new Date();
          this.APSDNEFTDate =  obj.APSD_NEFT_Txn_Date ?  new Date(obj.APSD_NEFT_Txn_Date) : new Date();
          this.CommencementDate = new Date(obj.Date_of_Commencement);
          this.CompletionDate = new Date(obj.Date_of_Completion);
          this.PeriodOfCompletion = obj.Periods_of_Completion;
          }
          if(obj.Financial_Bid_Status === 'NOT- AWARDING THE TENDER') {
            const arrTemp =  this.ObjBidOpening.Not_Awarding_Reason ?  this.ObjBidOpening.Not_Awarding_Reason.split(",") : [];
            this.ReasonSelect = arrTemp;
          }

       } else {
        this.BidEditFlag = false;
       }
      });

  }
}
getFileName(url) {
  if(url) {
    const name = url.match(/.*\/(.*)$/)[1];
    return name;
  }
}
GetBidOpenList(footfallId) {
  if(footfallId) {
    const params = new HttpParams().set("Foot_Fall_ID", footfallId);
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Bidding_First_Table_Json", { params })
      .subscribe((data: any) => {
        const Arr = data ? JSON.parse(data) : [];
        this.BidOpenListView = Arr;
      });
  }
}
GetRankBidOpenList(footfallId) {
  this.BidOpenListViewByRate = [];
  this.BidOpenListViewByLottery = [];
  this.BidOpenListViewByRateFlag = false;
  this.BidOpenListViewByLotteryFlag = false;
  if(footfallId) {
    const params = new HttpParams().set("Foot_Fall_ID", footfallId);
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Bidding_Rank_Json", { params })
      .subscribe((data: any) => {
        const Arr = data ? JSON.parse(data) : [];
        console.log(Arr)
        if(this.ObjBidOpening.Rank_Type === 'Normal'){
          this.BidOpenListViewByRate = Arr;
          this.BidOpenListViewByRateFlag = true;
        }else {
          this.BidOpenListViewByLottery = [];
          this.BidOpenListViewByLotteryFlag = true;
          this.RetriveRankBidding(Arr);
        }
      });
  }
}
GetBOQExcelList(footfallId) {
  this.BOQExcelList = [];
  if(footfallId) {
    const params = new HttpParams().set("Foot_Fall_ID", footfallId);
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Bidding_BOQ_Json", { params })
      .subscribe((data: any) => {
        this.BOQExcelList = data ? JSON.parse(data) : [];
        console.log(this.BOQExcelList)

      });
  }
}
clearBid() {
  this.ISDAmount = undefined;
  this.ISDDepositDate = new Date();
  this.ISDBGDate = new Date();
  this.ISDBGExpDate = new Date();
  this.ISDMatureDate = new Date();
  this.ISDNEFTDate = new Date();
  this.ISDFDAmount = undefined;
  this.ISDFDMaturityAmount =undefined;
  this.APSDAmount = undefined;
  this.APSDDepositDate = new Date();
  this.APSDBGDate = new Date();
  this.APSDBGExpDate = new Date();
  this.APSDMatureDate = new Date();
  this.APSDNEFTDate = new Date();
  this.APSDFDAmount = undefined;
  this.APSDFDMaturityAmount =undefined;
  this.CommencementDate = new Date();
  this.CompletionDate = new Date();
  this.PeriodOfCompletion = undefined;
  this.EstimatedRate = undefined;
  this.BidOpeningFormSubmitted = false;
  this.AgreementValue = undefined;
  this.BoqDocFormSubmitted = false;
  this.BidOpeningFlag = true;
  this.BidOpenListViewByRateFlag = false;
  this.BidOpenListViewByLotteryFlag = false;
  this.BidOpenListView = [];
  this.BidOpenListView =[];
  this.BidOpenListViewByLottery = [];
  this.DivisionList = [];
  this.CircleList = [];
  this.ReasonSelect = [];
  this.ObjBidOpening.Foot_Fall_ID =  undefined;
  this.ObjBidOpening = new BidOpening();
}
ViewBidOpening(obj) {
  this.TenderDetails = undefined;
  this.clearBid();
  this.BidEditFlag = false;
  if(obj.Foot_Fall_ID){
    this.GetCircle(obj.Tender_Org_ID);
    this.TenderDetails = obj;
    this.ObjBidOpening.Foot_Fall_ID = obj.Foot_Fall_ID;
    this.EstimatedRateChange(obj.Tender_Amount);
    this.GetIFBidExist(obj. Foot_Fall_ID);
     const ctrl = this;
    setTimeout(() => {
      ctrl.tabIndexToView = 2;
    }, 200);
  }

}
RefreshTenderData() {
  if (this.ObjBidOpening.Foot_Fall_ID) {
    const params = new HttpParams().set("Foot_Fall_ID", this.ObjBidOpening.Foot_Fall_ID);
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Amount_For_Refresh", { params })
      .subscribe((data: any) => {
        const obj =  data ? JSON.parse(data)[0] : undefined;
        if(obj.Tender_Amount){
          this.TenderDetails['Tender_Amount'] = obj.Tender_Name;
          this.EstimatedRateChange(obj.Tender_Amount);
          if (this.BidOpenListView.length) {
            for(let i = 0; i < this.BidOpenListView.length; i++) {
              this.BidOpenListView[i].Estimated_Rate = obj.Tender_Amount;
              const n = String(this.BidOpenListView[i].Quoted_Percentage).includes("-");
              const percentage = n ? String(this.BidOpenListView[i].Quoted_Percentage).replace("-", "") : this.BidOpenListView[i].Quoted_Percentage;
              const PercentageVal = (( Number(percentage) / 100) * Number(this.BidOpenListView[i].Estimated_Rate));
              const Rate = n ?  Number(this.BidOpenListView[i].Estimated_Rate) - PercentageVal :  Number(this.BidOpenListView[i].Estimated_Rate) + PercentageVal;
              const EstimatedRate = this.BidOpenListView[i].Estimated_Rate;
              this.BidOpenListView[i].Rate = Rate;
              this.BidOpenListView[i].Rate_In_Words = this.convertNumberToWords(Rate);
              this.BidOpenListView[i].Less_Excess = (n && !(Number(percentage) === 0)) ? 'Less' : Number(this.BidOpenListView[i].Quoted_Percentage) ? 'Excess' : 'Scheduled Rate';

            }
          }
          if (this.BidOpenListViewByRate.length) {
            for(let i = 0; i < this.BidOpenListViewByRate.length; i++) {
              this.BidOpenListViewByRate[i].Estimated_Rate = obj.Tender_Amount;
              const n = String(this.BidOpenListViewByRate[i].Quoted_Percentage).includes("-");
              const percentage = n ? String(this.BidOpenListViewByRate[i].Quoted_Percentage).replace("-", "") : this.BidOpenListViewByRate[i].Quoted_Percentage;
              const PercentageVal = (( Number(percentage) / 100) * Number(this.BidOpenListViewByRate[i].Estimated_Rate));
              const Rate = n ?  Number(this.BidOpenListViewByRate[i].Estimated_Rate) - PercentageVal :  Number(this.BidOpenListViewByRate[i].Estimated_Rate) + PercentageVal;
              const EstimatedRate = this.BidOpenListViewByRate[i].Estimated_Rate;
              this.BidOpenListViewByRate[i].Rate = Rate;
              this.BidOpenListViewByRate[i].Rate_In_Words = this.convertNumberToWords(Rate);
              this.BidOpenListViewByRate[i].Less_Excess = (n && !(Number(percentage) === 0)) ? 'Less' : Number(this.BidOpenListViewByRate[i].Quoted_Percentage) ? 'Excess' : 'Scheduled Rate';

            }
          //  this.RankBiddingCompanies();
          }
          if (this.BidOpenListViewByLottery.length) {
            for(let i = 0; i < this.BidOpenListViewByLottery.length; i++) {
              this.BidOpenListViewByLottery[i].Estimated_Rate = obj.Tender_Amount;
              const n = String(this.BidOpenListViewByLottery[i].Quoted_Percentage).includes("-");
              const percentage = n ? String(this.BidOpenListViewByLottery[i].Quoted_Percentage).replace("-", "") : this.BidOpenListViewByLottery[i].Quoted_Percentage;
              const PercentageVal = (( Number(percentage) / 100) * Number(this.BidOpenListViewByLottery[i].Estimated_Rate));
              const Rate = n ?  Number(this.BidOpenListViewByLottery[i].Estimated_Rate) - PercentageVal :  Number(this.BidOpenListViewByLottery[i].Estimated_Rate) + PercentageVal;
              const EstimatedRate = this.BidOpenListViewByLottery[i].Estimated_Rate;
              this.BidOpenListViewByLottery[i].Rate = Rate;
              this.BidOpenListViewByLottery[i].Rate_In_Words = this.convertNumberToWords(Rate);
              this.BidOpenListViewByLottery[i].Less_Excess = (n && !(Number(percentage) === 0)) ? 'Less' : Number(this.BidOpenListViewByLottery[i].Quoted_Percentage) ? 'Excess' : 'Scheduled Rate';

            }
           // this.RankBiddingCompanies();
          }
          if(this.BidOpenListView.length && (this.BidOpenListViewByRate.length || this.BidOpenListViewByLottery.length)) {
           // this.UpdateStatus()
          }
          this.TenderDetails['Tender_Org_ID'] = obj.Tender_Org_ID;
          this.GetCircle(obj.Tender_Org_ID);
          this.TenderDetails['Tender_Name'] = obj.Tender_Name;
          this.TenderDetails['Tender_ID'] = obj.Tender_ID;
        }
      });

  }
}
EstimatedRateChange(e){
  console.log(e);
  this.ObjBidOpeningList.Estimated_Rate = undefined;
  if(e) {
    const x= e.toString();
    const number = Number(e);
   const k =  number.toLocaleString('en-IN', {
       maximumFractionDigits: 2,
       style: 'currency',
       currency: 'INR'
   });
   this.ObjBidOpeningList.Estimated_Rate = Number(e);
   this.EstimatedRate = k;
  }
}
ISDAmountChange(e){
  console.log(e);
  this.ObjBidOpening.ISD_Amount = undefined;
  if(e) {
    const x= e.toString();
    const number = Number(e);
   const k =  number.toLocaleString('en-IN', {
       maximumFractionDigits: 2,
       style: 'currency',
       currency: 'INR'
   });
   this.ObjBidOpening.ISD_Amount = Number(e);
   this.ISDAmount = k;
  }
}
ISDMaturityAmountChange(e){
  console.log(e);
  this.ObjBidOpening.ISD_Maturity_Amount = undefined;
  if(e) {
    const x= e.toString();
    const number = Number(e);
   const k =  number.toLocaleString('en-IN', {
       maximumFractionDigits: 2,
       style: 'currency',
       currency: 'INR'
   });
   this.ObjBidOpening.ISD_Maturity_Amount = Number(e);
   this.ISDMaturityAmount = k;
  }
}
APSDAmountChange(e){
  console.log(e);
  console.log(this.EMDBGDate)
  this.ObjBidOpening.APSD_Amount = undefined;
  if(e) {
    const x= e.toString();
    const number = Number(e);
   const k =  number.toLocaleString('en-IN', {
       maximumFractionDigits: 2,
       style: 'currency',
       currency: 'INR'
   });
   this.ObjBidOpening.APSD_Amount = Number(e);
   this.APSDAmount = k;
  }
}
APSDMaturityAmountChange(e){
  console.log(e);
  this.ObjBidOpening.APSD_Maturity_Amount = undefined;
  if(e) {
    const x= e.toString();
    const number = Number(e);
   const k =  number.toLocaleString('en-IN', {
       maximumFractionDigits: 2,
       style: 'currency',
       currency: 'INR'
   });
   this.ObjBidOpening.APSD_Maturity_Amount = Number(e);
   this.APSDMaturityAmount = k;
  }
}
ISDFDAmountChange(e){
  console.log(e);
  this.ObjBidOpening.ISD_FD_Amount = undefined;
  if(e) {
    const x= e.toString();
    const number = Number(e);
   const k =  number.toLocaleString('en-IN', {
       maximumFractionDigits: 2,
       style: 'currency',
       currency: 'INR'
   });
   this.ObjBidOpening.ISD_FD_Amount = Number(e);
   this.ISDFDAmount = k;
  }
}

AgreementValueAmountChange(e){
  console.log(e);
  this.ObjBidOpening.Agreement_Value = undefined;
  if(e) {
    const x= e.toString();
    const number = Number(Number(e).toFixed());
   const k =  number.toLocaleString('en-IN', {
       maximumFractionDigits: 2,
       style: 'currency',
       currency: 'INR'
   });
   this.ObjBidOpening.Agreement_Value = Number(e);
   this.AgreementValue = k;
  }
}
ISDFDMaturityAmountChange(e){
  console.log(e);
  this.ObjBidOpening.ISD_FD_Mature_Amount = undefined;
  if(e) {
    const x= e.toString();
    const number = Number(e);
   const k =  number.toLocaleString('en-IN', {
       maximumFractionDigits: 2,
       style: 'currency',
       currency: 'INR'
   });
   this.ObjBidOpening.ISD_FD_Mature_Amount = Number(e);
   this.ISDFDMaturityAmount = k;
  }
}
APSDFDAmountChange(e){
  console.log(e);
  this.ObjBidOpening.APSD_FD_Amount = undefined;
  if(e) {
    const x= e.toString();
    const number = Number(e);
   const k =  number.toLocaleString('en-IN', {
       maximumFractionDigits: 2,
       style: 'currency',
       currency: 'INR'
   });
   this.ObjBidOpening.APSD_FD_Amount = Number(e);
   this.APSDFDAmount = k;
  }
}
APSDFDMaturityAmountChange(e){
  console.log(e);
  this.ObjBidOpening.APSD_FD_Mature_Amount = undefined;
  if(e) {
    const x= e.toString();
    const number = Number(e);
   const k =  number.toLocaleString('en-IN', {
       maximumFractionDigits: 2,
       style: 'currency',
       currency: 'INR'
   });
   this.ObjBidOpening.APSD_FD_Mature_Amount = Number(e);
   this.APSDFDMaturityAmount = k;
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
GetDetailsTender(obj) {
  if(obj.Foot_Fall_ID) {
    const obj1 = new HttpParams()
    .set("Foot_Fall_ID",obj.Foot_Fall_ID);
  this.$http
    .get("/BL_CRM_Txn_Enq_Tender/Get_EMD_Tender_Json", { params: obj1 })
    .subscribe((data: any) => {
      console.log(data);
      const obj2 = data ? JSON.parse(data)[0] : {};
      this.TenderDetails = obj.Foot_Fall_ID;
      this.tabIndexToView = 2;
    });
  }
}
AddBidOpen() {
  this.BidOpeningListFormSubmitted = true;
  const bid = this.ObjBidOpeningList.Bidder_Name;
  const exitsFlag =this.ObjBidOpeningList.Bidder_Name ? $.grep(this.BidOpenListView,function(val){ return val.Bidder_Name === bid}) : [];
  if(!exitsFlag.length && this.ObjBidOpeningList.Estimated_Rate && this.ObjBidOpeningList.Quoted_Percentage){
    const n = this.ObjBidOpeningList.Quoted_Percentage.includes("-");
    const percentage = n ? this.ObjBidOpeningList.Quoted_Percentage.replace("-", "") : this.ObjBidOpeningList.Quoted_Percentage;
    const PercentageVal = (( Number(percentage) / 100) * Number(this.ObjBidOpeningList.Estimated_Rate));
    const Rate = n ?  Number(this.ObjBidOpeningList.Estimated_Rate) - PercentageVal :  Number(this.ObjBidOpeningList.Estimated_Rate) + PercentageVal;
    const EstimatedRate = this.ObjBidOpeningList.Estimated_Rate;
    const footfall = this.ObjBidOpening.Foot_Fall_ID;
    this.ObjBidOpeningList.Quoted_Percentage = (Number(percentage) === 0) ? '0' : this.ObjBidOpeningList.Quoted_Percentage;
    this.ObjBidOpeningList.Foot_Fall_ID = footfall;
    this.ObjBidOpeningList.Rate = Rate;
    this.ObjBidOpeningList.Rate_In_Words = this.convertNumberToWords(Rate);
    this.ObjBidOpeningList.Less_Excess = (n && !(Number(percentage) === 0)) ? 'Less' : Number(this.ObjBidOpeningList.Quoted_Percentage) ? 'Excess' : 'Scheduled Rate';
    this.ObjBidOpeningList.Sl_No = Number(this.BidOpenListView.length) + 1;
    this.BidOpenListView.push(this.ObjBidOpeningList);
    this.BidOpeningListFormSubmitted = false;
    this.ObjBidOpeningList = new BidOpeningList();
    this.ObjBidOpeningList.Estimated_Rate = EstimatedRate;
    this.ObjBidOpeningList.Foot_Fall_ID = footfall;
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
DeleteBidOpenList(index){
  this.BidOpenListView.splice(index, 1);
  for(let i = 0; i < this.BidOpenListView.length; i++) {
    this.BidOpenListView[i].Sl_No = i + 1;
  }
  this.RankBiddingCompanies();
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
trackByfn = (index) => index;
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
  console.log( this.BidOpenListViewByLottery)
}
RankBiddingCompanies() {
  let found = false;
  this.BidOpenListViewByRateFlag = false;
  this.BidOpenListViewByLotteryFlag = false;
  this.BidOpenListViewByLottery = [];
  this.BidOpenListViewByRate  = [];

  for(let i = 0; i < this.BidOpenListView.length; i++) {
      if (this.BidOpenListView[i].Quoted_Percentage) {
        if(this.BidOpenListView[i].Quoted_Percentage === this.BidOpenListView[0].Quoted_Percentage) {
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
      objTemp.Foot_Fall_ID =  this.TenderDetails.Foot_Fall_ID;
      for(let r = 0; r < valueArr.length; r++){
        if(arr[i].Rate === valueArr[r]) {
          k++;
        }
      }
      if (k === 1) {
        objTemp.Lottery_Flag = 'FIXED';
        objTemp.Sl_No = arr[i].Sl_No;
        objTemp.Estimated_Rate = arr[i].Estimated_Rate;
        objTemp.Bidder_Name = arr[i].Bidder_Name;
        objTemp.Quoted_Percentage = arr[i].Quoted_Percentage;
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
}
checkBidderSelectLottery(bidderName) {
  const arr = [...this.BidOpenListViewByLottery]
  const exitsFlag = bidderName ? $.grep(arr,function(val){ return val.Bidder_Name === bidderName}) : [];
  return exitsFlag.length > 1 ? true : false;
}
DeleteRankBidOpenList(index){
  this.BidOpenListViewByRate.splice(index, 1);
 // this.RankBiddingCompanies();
}
LotteryBidderNameChange(i,obj) {
  if(obj.Bidder_Name) {
    const arr =  [...this.BidOpenListView];
    const bidObj = $.grep(arr,function(elem){ return elem.Bidder_Name === obj.Bidder_Name})[0];
    const flag = this.checkBidderSelectLottery(obj.Bidder_Name)
    if(!flag) {
      this.BidOpenListViewByLottery[i].Estimated_Rate = bidObj.Estimated_Rate;
      this.BidOpenListViewByLottery[i].Quoted_Percentage = bidObj.Quoted_Percentage;
      this.BidOpenListViewByLottery[i].Rate = bidObj.Rate;
      this.BidOpenListViewByLottery[i].Rate_In_Words = this.convertNumberToWords(bidObj.Rate);
    } else {
      this.BidOpenListViewByLottery[i].Estimated_Rate = undefined;
      this.BidOpenListViewByLottery[i].Quoted_Percentage = undefined;
      this.BidOpenListViewByLottery[i].Rate = undefined;
      this.BidOpenListViewByLottery[i].Rate_In_Words = undefined;
      this.BidOpenListViewByLottery[i].Temp_Bidder_Array = [];
      const arrTemp = $.grep(arr,function(val){return val.Rate === bidObj.Rate});
      this.BidOpenListViewByLottery[i].Temp_Bidder_Array = [...arrTemp];
    }

}


}

StatusChange(data){
  if(data === 'AWARDING THE TENDER') {
    this.ObjBidOpening.Date_of_Commencement = this.DateService.dateConvert(moment(new Date(), "YYYY-MM-DD")["_d"]);
    this.ObjBidOpening.Date_of_Completion = this.DateService.dateConvert(moment(new Date(), "YYYY-MM-DD")["_d"]);
  }
}
UpdateStatus() {
  const check = this.BidOpenListViewByLottery.length ? this.BidOpenListViewByLottery : this.BidOpenListViewByRate;
  const flag = $.grep(check,function(elem){ return elem.Rank === 'L1' && elem.Bidder_Name === 'ORIENT CONSTRUCTIONS PVT. LTD.'});
  this.ObjBidOpening.Agreement_Value = undefined;
  this.AgreementValue = undefined;
  if(flag.length) {
    this.ObjBidOpening.Financial_Bid_Status = 'AWARDING THE TENDER';
    this.AgreementValueAmountChange(flag[0].Rate);
    this.ObjBidOpening.Date_of_Commencement = this.DateService.dateConvert(moment(new Date(), "YYYY-MM-DD")["_d"]);
    this.ObjBidOpening.Date_of_Completion = this.DateService.dateConvert(moment(new Date(), "YYYY-MM-DD")["_d"]);
  } else {
    this.ObjBidOpening.Financial_Bid_Status = 'NOT- AWARDING THE TENDER';
  }
}
monthDiff(a, b) {
  a.setHours(0,0,0,0);
  b.setHours(0,0,0,0);
  let date1 = moment(new Date(b));
  let date2 = moment(new Date(a));
  let years = date1.diff(date2, 'year');
  date2.add(years, 'years');

  let months = date1.diff(date2, 'months');
  date2.add(months, 'months');

  let days = date1.diff(date2, 'days');
  date2.add(days, 'days');
  if(years) {
    const j = 12 * years;
    months = months + j;
  }

  let message = months + " months "
  message += days + " days " ;
  return message
}
GetCommencementDate (date) {
  this.PeriodOfCompletion = undefined;
    this.ObjBidOpening.Periods_of_Completion = undefined;
    if (date) {
      this.ObjBidOpening.Date_of_Commencement = this.DateService.dateConvert(moment(date, "YYYY-MM-DD")["_d"]);
      if(this.ObjBidOpening.Date_of_Completion){
        this.PeriodOfCompletion = this.monthDiff(new Date(date),new Date(this.ObjBidOpening.Date_of_Completion));
        this.ObjBidOpening.Periods_of_Completion = this.PeriodOfCompletion;
      }
    }
}
GetCompletionDate (date) {
  this.PeriodOfCompletion = undefined;
  this.ObjBidOpening.Periods_of_Completion = undefined;
  if (date) {
    this.ObjBidOpening.Date_of_Completion = this.DateService.dateConvert(moment(date, "YYYY-MM-DD")["_d"]);
    if(this.ObjBidOpening.Date_of_Completion){
      this.PeriodOfCompletion = this.monthDiff(new Date(this.ObjBidOpening.Date_of_Commencement),new Date(date));
      this.ObjBidOpening.Periods_of_Completion = this.PeriodOfCompletion;
    }
  }
}
TenderPeriodOfCompletionChange(data) {
  if(data){
    this.ObjBidOpening.Periods_of_Completion =  data;
  }
}
GetISDDepositDate(date){
  if (date) {
    this.ObjBidOpening.ISD_Deposit_date = this.DateService.dateConvert(moment(date, "YYYY-MM-DD")["_d"]);
  }
}
GetAPSDDepositDate(date){
  if (date) {
    this.ObjBidOpening.APSD_Deposit_date = this.DateService.dateConvert(moment(date, "YYYY-MM-DD")["_d"]);
  }
}
GetISDReleaseDate (date) {
  if (date) {
    this.ObjBidOpening.ISD_Release_Date = this.DateService.dateConvert(
      moment(date, "YYYY-MM-DD")["_d"]
    );
  }
}
GetAPSDReleaseDate (date) {
  if (date) {
    this.ObjBidOpening.APSD_Release_Date = this.DateService.dateConvert(
      moment(date, "YYYY-MM-DD")["_d"]
    );
  }
}
GetCircle(orgID) {
  this.CircleList = [];
  if(orgID) {
    const params = new HttpParams().set("Tender_Org_ID", orgID);
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Circle_Json", { params })
      .subscribe((data: any) => {
        this.CircleList = data ? JSON.parse(data) : [];
      });

  }
}
GetDivision(circle) {
  this.DivisionList = [];
  const circleID = $.grep(this.CircleList,function(arr){ return arr.Circle === circle})[0].Tender_Circle_ID;
  if(circleID && this.TenderDetails['Tender_Org_ID']) {
    const params = new HttpParams().set("Tender_Circle_ID", circleID);
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Division_Json", { params })
      .subscribe((data: any) => {
        this.DivisionList = data ? JSON.parse(data) : [];
        if(this.ObjBidOpening.Division) {
          this.ObjBidOpening.Division = this.ObjBidOpening.Division;
        }
      });

  }
}
ToggleAuthority(){
  this.AuthoritySubmitted = false;
  this.AuthorityName = undefined;
  this.AuthorityModal = true;
  this.Spinner = false;
 }
CreateAuthority(valid){
this.AuthoritySubmitted = true;
if(valid) {
    this.Spinner = true;
    const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Tender_Inviting_Authority";
    const obj = {  Tender_Inviting_Authority: this.AuthorityName };
    this.$http.post(UrlAddress, obj).subscribe((data: any) => {
      console.log(data)
    if (data.success) {
      this.Spinner = false;
      // if (this.ObjTender.Foot_Fall_ID) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully Authority Created"
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
      this.GetAuthorityList();
      this.AuthoritySubmitted = false;
      this.AuthorityName = undefined;
      this.AuthorityModal = false;
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
ToggleBidder(){
  this.BidderSubmitted = false;
  this.BidderName = undefined;
  this.BidderModal = true;
  this.Spinner = false;
 }
CreateBidder(valid){
this.BidderSubmitted = true;
if(valid) {
    this.Spinner = true;
    const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Bidder";
    const obj = {  Bidder_Name: this.BidderName };
    this.$http.post(UrlAddress, obj).subscribe((data: any) => {
      console.log(data)
    if (data.success) {
      this.Spinner = false;
      // if (this.ObjTender.Foot_Fall_ID) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully Bidder Created"
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
      this.GetBidderList();
      this.BidderSubmitted = false;
      this.BidderName = undefined;
      this.BidderModal = false;
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
ToggleCircle(){
  this.CircleSubmitted = false;
  this.CircleName = undefined;
  this.CircleModal = true;
  this.Spinner = false;
 }
CreateCircle(valid){
this.CircleSubmitted = true;
if(valid) {
    this.Spinner = true;
    const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Tender_Circle";
    const obj = {
      Circle : this.CircleName,
      Tender_Org_ID : this.TenderDetails['Tender_Org_ID']
     };
    this.$http.post(UrlAddress, obj).subscribe((data: any) => {
      console.log(data)
    if (data.success) {
      this.Spinner = false;
      // if (this.ObjTender.Foot_Fall_ID) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully Circle Created"
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
      this.GetCircle(this.TenderDetails['Tender_Org_ID']);
      this.CircleSubmitted = false;
      this.CircleName = undefined;
      this.CircleModal = false;
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
ToggleDivision(){
  this.DivisionSubmitted = false;
  this.DivisionName = undefined;
  this.DivisionModal = true;
  this.Spinner = false;
 }
CreateDivision(valid){
this.DivisionSubmitted = true;
if(valid) {
    this.Spinner = true;
    const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Tender_Division";
    const obj = {
      Division: this.DivisionName,
      Tender_Circle_ID: this.ObjBidOpening.Circle
     };
    this.$http.post(UrlAddress, obj).subscribe((data: any) => {
      console.log(data)
    if (data.success) {
        this.Spinner = false;
      // if (this.ObjTender.Foot_Fall_ID) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully Division Created"
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
      this.GetDivision(this.ObjBidOpening.Circle);
      this.DivisionSubmitted = false;
      this.DivisionName = undefined;
      this.DivisionModal = false;
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
      // if (this.ObjTender.Foot_Fall_ID) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully Reason Created"
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
ToggleFinalcialYear(){
  this.FinalcialYearSubmitted = false;
  this.FinalcialYearName = undefined;
  this.FinalcialYearModal = true;
  this.Spinner = false;
 }
CreateFinalcialYear(valid){
this.FinalcialYearSubmitted = true;
if(valid) {
    this.Spinner = true;
    const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Tender_Fin_Year_Name";
    const obj = {
      Fin_Year_Name : this.FinalcialYearName
     };
    this.$http.post(UrlAddress, obj).subscribe((data: any) => {
      console.log(data)
    if (data.success) {
      this.Spinner = false;
      // if (this.ObjTender.Foot_Fall_ID) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully Finalcial Year Created"
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
      this.GetFinancialYearList();
      this.FinalcialYearSubmitted = false;
      this.FinalcialYearName = undefined;
      this.FinalcialYearModal = false;
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
GetFlagFromDocumentBid(e) {
  console.log(e);
}
ViewExcel() {
  this.BOQExcelTotal = undefined;
  this.BOQExcelLess = undefined;
  this.BOQExcelLessTotal = undefined;
  this.BOQExcelGrandTotal = undefined;
  this.BOQExcelQuote = undefined;
  if(this.BOQExcelList.length) {
    this.ExcelModalFlag = !this.ExcelModalFlag;
    this.getQuote()
  }
}
getQuote() {
  if(this.ObjBidOpening.Foot_Fall_ID) {
    this.$http
    .get("/BL_CRM_Txn_Enq_Tender/Get_BOQ_Quoted_Percentage_Excel?Foot_Fall_ID="+this.ObjBidOpening.Foot_Fall_ID)
      .subscribe((data: any) => {
       console.log(data)
       const per = data ? JSON.parse(data)[0].Quoted_Percentage_Excel: 0;
       this.BOQExcelQuote = per ? per.toString() : undefined;
       this.getTotalExcelData();

      });
  }
}
saveQuote(){
  if(this.BOQExcelQuote) {
    const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Update_BOQ_Quoted_Percentage_Excel";
    const obj = {
       Foot_Fall_ID:this.ObjBidOpening.Foot_Fall_ID,
       Quoted_Percentage_Excel : this.BOQExcelQuote
     };
    this.$http.post(UrlAddress, obj).subscribe((data: any) => {
      if (data.success) {
        console.group("Compacct V2");
        console.log("%c  Bid Quoted_Percentage Sucess:", "color:green;");
        console.log("/BL_CRM_Txn_Enq_Tender/Update_BOQ_Quoted_Percentage_Excel");
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully BOQ Quoted Percentage Updated"
        });
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
  }else{
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Fill Up Quoted Percentage "
        });
  }

}
PrintExcel() {
  const printContents = document.getElementById('boqExelID').innerHTML
  const WindowObject = window.open('','PrintWindow','width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes'
  );
  const htmlData = `<html><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> <body style='padding: 1em;'>${printContents}</body></html>`;

  WindowObject.document.writeln(htmlData);
  WindowObject.document.close();
  WindowObject.focus();
  setTimeout(() => {
    WindowObject.print();
  }, 0.5);
}
getTotalExcelData() {
  let qunt = 0;
  let percentage1 = undefined;
  let lexxEcess = undefined;
  if(!this.BOQExcelQuote){
    if(this.BidOpenListViewByLottery.length) {
      const objTemp = $.grep(this.BidOpenListViewByLottery,function(obj){ return obj.Bidder_Name === 'ORIENT CONSTRUCTIONS PVT. LTD.'})[0];
      percentage1 = objTemp.Quoted_Percentage.toString();
      lexxEcess = objTemp.Less_Excess;
    }
    if(this.BidOpenListViewByRate.length) {
      const objTemp = $.grep(this.BidOpenListViewByRate,function(obj){ return obj.Bidder_Name === 'ORIENT CONSTRUCTIONS PVT. LTD.'})[0];
      percentage1 = objTemp.Quoted_Percentage.toString();
      lexxEcess = objTemp.Less_Excess;
    }
  } else {
    percentage1 = this.BOQExcelQuote;
    lexxEcess = (this.BOQExcelQuote.includes("-") && !(Number(percentage1) === 0)) ? 'Less' : Number(this.BOQExcelQuote) ? 'Excess' : 'Scheduled Rate'
  }

  const n = percentage1.includes("-");
  const percentage = n ? percentage1.replace("-", "") : percentage1;

  for(let i =0; i < this.BOQExcelList.length;i++){
    if(this.BOQExcelList[i].Amount) {
      qunt += Number(this.BOQExcelList[i].Amount);
    }
  }
  const e = qunt.toFixed();
  const PercentageVal = (( Number(percentage) / 100) * Number(e));
  const Rate = n ?  Number(e) - PercentageVal :  Number(e) + PercentageVal;
  const f = PercentageVal.toFixed();
  const g = Rate.toFixed();
  if(e) {
    const x= e.toString();
    const number = Number(e);
    const k =  number.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });
    this.BOQExcelTotal =  k;
  }
  if(f) {
    const x= f.toString();
    const number = Number(f);
    const k =  number.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });
    this.BOQExcelLessTotal = k;
  }
  if(g) {
    const x= e.toString();
    const number = Number(g);
    const k =  number.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });
    this.BOQExcelGrandTotal = k;
  }

  this.BOQExcelQuote = percentage1;
  this.BOQExcelLess = lexxEcess;
}

simpleStringify (arr){
  let ff= [];
  for(let i = 0; i < arr.length; i++) {
    let simpleObject = {};
    for (let prop in arr[i] ){
        if (!arr[i].hasOwnProperty(prop)){
            continue;
        }
        if (typeof(arr[i][prop]) === 'object'){
            continue;
        }
        if (typeof(arr[i][prop]) === 'function'){
            continue;
        }
        simpleObject[prop] = arr[i][prop];
    }
    ff.push(simpleObject)
  }
  return JSON.stringify(ff); // returns cleaned up JSON
}
FetchBiddata() {
  if(this.ObjBidOpening.Financial_Bid_Status === 'AWARDING THE TENDER') {
    this.ObjBidOpening.Not_Awarding_Reason = undefined;
    const today = this.DateService.dateConvert(new Date());
    this.ObjBidOpening.ISD_Deposit_date =   this.ObjBidOpening.ISD_Deposit_date  ?   this.ObjBidOpening.ISD_Deposit_date : today;
    this.ObjBidOpening.APSD_Deposit_date =   this.ObjBidOpening.APSD_Deposit_date  ?   this.ObjBidOpening.APSD_Deposit_date : today;
    if(this.ObjBidOpening.ISD_Deposit_Type === 'BG') {
      this.ObjBidOpening.ISD_BG_Creation_Date =   this.ISDBGDate  ?  this.DateService.dateConvert(new Date(this.ISDBGDate)) : today;
      this.ObjBidOpening.ISD_BG_Exp_Date =   this.ISDBGExpDate  ?   this.DateService.dateConvert(new Date(this.ISDBGExpDate)) : today;
      this.ObjBidOpening.ISD_FD_Mature_Date = '';
      this.ObjBidOpening.ISD_NEFT_Txn_Date = '';
      this.ObjBidOpening.ISD_NEFT_TXN_No = '';
      this.ObjBidOpening.ISD_FD_Mature_Amount = 0;
      this.ObjBidOpening.ISD_FD_Amount = 0;
    }
      if (this.ObjBidOpening.ISD_Deposit_Type === 'FD') {
      this.ObjBidOpening.ISD_FD_Mature_Date =   this.ISDMatureDate ?  this.DateService.dateConvert(new Date(this.ISDMatureDate)) : today;
      this.ObjBidOpening.ISD_BG_Creation_Date = '';
      this.ObjBidOpening.ISD_BG_Exp_Date = '';
      this.ObjBidOpening.ISD_NEFT_Txn_Date = '';
      this.ObjBidOpening.ISD_NEFT_TXN_No = '';
    }
      if ((this.ObjBidOpening.ISD_Deposit_Type ==='NEFT' || this.ObjBidOpening.ISD_Deposit_Type ==='RTGS')) {
      this.ObjBidOpening.ISD_NEFT_Txn_Date =   this.ISDNEFTDate  ?    this.DateService.dateConvert(new Date(this.ISDNEFTDate)) : today;
      this.ObjBidOpening.ISD_BG_Creation_Date = '';
      this.ObjBidOpening.ISD_BG_Exp_Date = '';
      this.ObjBidOpening.ISD_FD_Mature_Date = '';
      this.ObjBidOpening.ISD_FD_Mature_Amount = 0;
      this.ObjBidOpening.ISD_FD_Amount = 0;
    }
    if(this.ObjBidOpening.APSD_Deposit_Type === 'BG') {
      this.ObjBidOpening.APSD_BG_Creation_Date =   this.APSDBGDate  ?  this.DateService.dateConvert(new Date(this.APSDBGDate)) : today;
      this.ObjBidOpening.APSD_BG_Exp_Date =   this.APSDBGExpDate  ?   this.DateService.dateConvert(new Date(this.APSDBGExpDate)) : today;
      this.ObjBidOpening.APSD_FD_Mature_Date = '';
      this.ObjBidOpening.APSD_NEFT_Txn_Date = '';
      this.ObjBidOpening.APSD_NEFT_TXN_No = '';
      this.ObjBidOpening.APSD_FD_Mature_Amount = 0;
      this.ObjBidOpening.APSD_FD_Amount = 0;
    }
      if (this.ObjBidOpening.APSD_Deposit_Type === 'FD') {
      this.ObjBidOpening.APSD_FD_Mature_Date =   this.APSDMatureDate ?  this.DateService.dateConvert(new Date(this.APSDMatureDate)) : today;
      this.ObjBidOpening.APSD_BG_Creation_Date = '';
      this.ObjBidOpening.APSD_BG_Exp_Date = '';
      this.ObjBidOpening.APSD_NEFT_Txn_Date = '';
      this.ObjBidOpening.APSD_NEFT_TXN_No = '';
    }
      if ((this.ObjBidOpening.APSD_Deposit_Type ==='NEFT' || this.ObjBidOpening.APSD_Deposit_Type ==='RTGS')) {
      this.ObjBidOpening.APSD_NEFT_Txn_Date =   this.APSDNEFTDate  ?    this.DateService.dateConvert(new Date(this.APSDNEFTDate)) : today;
      this.ObjBidOpening.APSD_BG_Creation_Date = '';
      this.ObjBidOpening.APSD_BG_Exp_Date = '';
      this.ObjBidOpening.APSD_FD_Mature_Date = '';
      this.ObjBidOpening.APSD_FD_Mature_Amount = 0;
      this.ObjBidOpening.APSD_FD_Amount = 0;
    }
  }
  if(this.ObjBidOpening.Financial_Bid_Status === 'NOT- AWARDING THE TENDER') {
    this.ObjBidOpening.ISD_Deposit_date = '';
    this.ObjBidOpening.APSD_Deposit_date = '';
    this.ObjBidOpening.APSD_BG_Creation_Date =  '';
    this.ObjBidOpening.APSD_BG_Exp_Date = '';
    this.ObjBidOpening.APSD_FD_Mature_Date = '';
    this.ObjBidOpening.APSD_NEFT_Txn_Date = '';
    this.ObjBidOpening.APSD_NEFT_TXN_No = '';
    this.ObjBidOpening.APSD_FD_Mature_Amount = 0;
    this.ObjBidOpening.APSD_FD_Amount = 0;
    this.ObjBidOpening.ISD_BG_Creation_Date = '';
    this.ObjBidOpening.ISD_BG_Exp_Date =  '';
    this.ObjBidOpening.ISD_FD_Mature_Date = '';
    this.ObjBidOpening.ISD_NEFT_Txn_Date = '';
    this.ObjBidOpening.ISD_NEFT_TXN_No = '';
    this.ObjBidOpening.ISD_FD_Mature_Amount = 0;
    this.ObjBidOpening.ISD_FD_Amount = 0;
    this.ObjBidOpening.Circle = undefined;
    this.ObjBidOpening.Division = undefined;
    this.ObjBidOpening.Agreement_Number = undefined;
    this.ObjBidOpening.Periods_of_Completion = undefined;
    this.ObjBidOpening.Date_of_Completion = undefined;
    this.ObjBidOpening.Date_of_Commencement = undefined;
    this.ObjBidOpening.ISD_Release_Date = undefined;
    this.ObjBidOpening.APSD_Release_Date = undefined;
    this.ObjBidOpening.Agreement_Value = undefined;
    this.ObjBidOpening.ISD_Amount = undefined;
    this.ObjBidOpening.APSD_Amount = undefined;
    this.ObjBidOpening.ISD_Bank = undefined;
    this.ObjBidOpening.ISD_Deposit_Type = undefined;
    this.ObjBidOpening.ISD_Deposit_Number = undefined;
    this.ObjBidOpening.APSD_Bank = undefined;
    this.ObjBidOpening.APSD_Deposit_Type = undefined;
    this.ObjBidOpening.APSD_Deposit_Number = undefined;
    this.ObjBidOpening.ISD_Maturity_Amount = undefined;
    this.ObjBidOpening.APSD_Maturity_Amount = undefined;
    this.ObjBidOpening.Not_Awarding_Reason = this.ReasonSelect.toString();

   }

}
FetchBOQData(BOQurl) {
  const obj = {
    Project_ID : 0  ,
    Foot_Fall_ID : this.ObjBidOpening.Foot_Fall_ID ,
    Cost_Cen_ID : this.commonApi.CompacctCookies.Cost_Cen_ID,
    Project_Name : this.TenderDetails['Tender_Name']	,
    Bid_Identification_No: this.TenderDetails['Tender_ID'] ,
    Is_Visiable: 'Y',
    Tender_Inviting_Authority : this.ObjBidOpening.Tender_Inviting_Authority ,
    Tender_Organization : this.GetOrgName(this.TenderDetails['Tender_Org_ID']) ,
    Circle  : this.ObjBidOpening.Circle ,
    Division: this.ObjBidOpening.Division ,
    BOQ_File_Name : BOQurl ,
    Agreement_Number: this.ObjBidOpening.Agreement_Number ,
    Agreement_Value : this.ObjBidOpening.Agreement_Value ,
    Date_of_Commencement: this.ObjBidOpening.Date_of_Commencement ,
    Date_of_Completion: this.ObjBidOpening.Date_of_Completion,
    Project_Short_Name: this.ObjBidOpening.Project_Short_Name
  }
  const arrTemp1 = [];
  if (this.BOQdataString.length) {
    for(let h =0; h < this.BOQdataString.length;h++) {
      if(h !== 0 && this.BOQdataString[h].BOQ) {
      const obj1 ={
        Project_ID : 0,
        BOQ_Type: 'Original',
        Sl_No: this.BOQdataString[h].BOQ,
        Description_of_work:this.BOQdataString[h].__EMPTY,
        Item_Code: this.BOQdataString[h].__EMPTY_1,
        Qty:  this.BOQdataString[h].__EMPTY_2,
        Unit: this.BOQdataString[h].__EMPTY_3 ,
        Estimated_Rate:Number((Math.round(this.BOQdataString[h].__EMPTY_4 * 100) / 100).toFixed(2)),
        Amount : Number((Math.round(this.BOQdataString[h].__EMPTY_5 * 100) / 100).toFixed(2))
      }
      arrTemp1.push(obj1)
    }
    }
  }
  console.log(arrTemp1);
  const WholeData =   {
    Enq_Project_Master_String : JSON.stringify([obj]),
    Enq_BOQ_Excel_String :  JSON.stringify(arrTemp1)
  }
  console.log(WholeData);
  return WholeData;
}

SaveBidOpening(valid) {
  this.BidOpeningFormSubmitted = true;
  const resonFlag = (this.ObjBidOpening.Financial_Bid_Status === 'NOT- AWARDING THE TENDER' &&  this.ReasonSelect.length ) ? true : (this.ObjBidOpening.Financial_Bid_Status === 'AWARDING THE TENDER') ?  true : false;
  if (valid && this.BidOpenListView.length && resonFlag && (this.BidOpenListViewByRate.length || this.BidOpenListViewByLottery.length)) {
    this.Spinner = true;
    this.ObjBidOpening.Rank_Type =  this.BidOpenListViewByRate.length ? 'Normal' : 'Lottery';
    this.FetchBiddata();
    const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Update_Enq_Tender_Bidding";
    const obj = { Enq_Bidding_String: JSON.stringify([this.ObjBidOpening]) };
    this.$http.post(UrlAddress, obj).subscribe((data: any) => {
      if (data.success) {
        console.group("Compacct V2");
        console.log("%c  Bid Sucess:", "color:green;");
        console.log("/BL_CRM_Txn_Enq_Tender/Update_Enq_Tender_Bidding");
        this.SaveBidList();
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
    } else {
        if(!this.BidOpenListView.length) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "No List Found"
          });
        }
        const arr = this.BidOpenListViewByRate.length ? this.BidOpenListViewByRate : this.BidOpenListViewByLottery;
        if(!arr.length) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "No Rank or Lottery Bid Found"
          });
        }
        if(!resonFlag){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "No Reason Found"
          });
        }
    }
}
SaveBidList() {
  const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Insert_BL_CRM_Txn_Enq_Bidding_Table";
    const obj = { Enq_Bidding_table_String: JSON.stringify(this.BidOpenListView) };
    this.$http.post(UrlAddress, obj).subscribe((data: any) => {
      if (data.success) {
        console.group("Compacct V2");
        console.log("%c  Bid List Sucess:", "color:green;");
        console.log("/BL_CRM_Txn_Enq_Tender/Insert_BL_CRM_Txn_Enq_Bidding_Table");
        this.SaveRankBidList();
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
SaveRankBidList(){
  const arr = this.BidOpenListViewByRate.length ? this.BidOpenListViewByRate : this.BidOpenListViewByLottery;
  const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Insert_BL_CRM_Txn_Enq_Bidding_Rank";
    const obj = { Enq_Bidding_Rank_String: this.simpleStringify(arr) };
    this.$http.post(UrlAddress, obj).subscribe((data: any) => {
      if (data.success) {
        console.group("Compacct V2");
        console.log("%c  Rank Bid List Sucess:", "color:green;");
        console.log("/BL_CRM_Txn_Enq_Tender/Insert_BL_CRM_Txn_Enq_Bidding_Rank");
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Lead ID  : " +  this.ObjBidOpening.Foot_Fall_ID,
          detail: "Succesfully Bid Updated"
        });
        this.clearBid();
        this.tabIndexToView = 0;
        this.BidOpeningFlag = false;
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
SaveBOQ(valid) {
  this.BoqDocFormSubmitted = true;
  if (this.PDFFlag && valid) {
    this.Spinner = true;
    const endpoint = "/BL_CRM_Txn_Enq_Tender/Upload_BOQ_Document?Foot_Fall_ID=" + this.ObjBidOpening.Foot_Fall_ID;
    const formData: FormData = new FormData();
    formData.append("aFile", this.BOQPDFFile);
    this.$http.post(endpoint, formData).subscribe((data:any) => {
      console.log(data);
      if(data.success) {
        const BOQurl = data.URL;
       const projectData =  this.FetchBOQData(BOQurl);
       this.SaveProject(projectData);
      }
    });
  } else {

  }

}
SaveProject(projectData){
  const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Insert_BL_CRM_Enq_Master_Project";
  this.$http.post(UrlAddress, projectData).subscribe((data: any) => {
    if (data.success) {
      console.group("Compacct V2");
      console.log("%c  Project Sucess:", "color:green;");
      console.log("/BL_CRM_Txn_Enq_Tender/Insert_BL_CRM_Enq_Master_Project");
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Lead ID  : " +  this.ObjBidOpening.Foot_Fall_ID,
        detail: "Succesfully BOQ Updated"
      });
      this.GetBOQExcelList(this.ObjBidOpening.Foot_Fall_ID)
      this.Spinner = false;
      this.BoqDocFormSubmitted = false;
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

onboqExcel(){
  this.compacctToast.clear();
}
onFileChange(ev) {
  this.PDFFlag = false;
  this.BOQPDFFile = {};
  let workBook = null;
  let jsonData = null;
  const reader = new FileReader();
  const file = ev.files[0];

  reader.onload = (event) => {
    const data = reader.result;
    workBook = XLSX.read(data, { type: 'binary' });
    jsonData = workBook.SheetNames.reduce((initial, name) => {
      const sheet = workBook.Sheets[name];
      initial[name] = XLSX.utils.sheet_to_json(sheet);
      return initial;
    }, {});
    this.BOQdataString = jsonData.BOQ;
    const firstkey = Object.keys(this.BOQdataString[0])[0];
    const columCheck =
     this.BOQdataString[0][firstkey] === "SL NO." && this.BOQdataString[0].__EMPTY === "DESCRIPTION OF ITEMS"  &&
     this.BOQdataString[0].__EMPTY_1 === "ITEM CODE" && this.BOQdataString[0].__EMPTY_2 === "QNTY./NOS." &&
     this.BOQdataString[0].__EMPTY_3 === "UNIT" && this.BOQdataString[0].__EMPTY_4 === "ESTIMATED RATE" &&
     this.BOQdataString[0].__EMPTY_5 === "AMOUNT" ? true:false;
     if(columCheck){
        if (file && this.BOQdataString.length) {
        this.BOQPDFFile = file;
        this.PDFFlag = true;
        } else {
          this.PDFFlag = false;
        }
      }else{
        this.PDFFlag = false;
        this.compacctToast.clear();
        const errorMgs = `<table class="table table-bordered table-striped"><thead><tr><td>Choosed File Format</td><td>System Format</td><td>Match Flag</td><tr></thead><tr><tbody><tr><td>` + this.BOQdataString[0][firstkey] +`</td>
        <td>SL NO.</td>
        <td class='text-center'>`+this.compare(this.BOQdataString[0][firstkey],"SL NO.")+ `</td> <tr>
        <td>`+ this.BOQdataString[0].__EMPTY +`</td>
        <td>DESCRIPTION OF ITEMS</td>
        <td class='text-center'>` +this.compare(this.BOQdataString[0].__EMPTY,"DESCRIPTION OF ITEMS")+`</td></tr><tr>
        <td>` + this.BOQdataString[0].__EMPTY_1 +`</td>
        <td>ITEM CODE</td>
        <td class='text-center'>` +this.compare(this.BOQdataString[0].__EMPTY_1,"ITEM CODE")+`</td></tr><tr>
        <td>`+ this.BOQdataString[0].__EMPTY_2 +`</td>
        <td>QNTY./NOS.</td>
        <td class='text-center'>` +this.compare(this.BOQdataString[0].__EMPTY_2,"QNTY./NOS.")+`</td></tr><tr>
        <td>`+ this.BOQdataString[0].__EMPTY_3 +`</td>
        <td>UNIT</td>
        <td class='text-center'>` +this.compare(this.BOQdataString[0].__EMPTY_3,"UNIT")+`</td></tr><tr>
        <td>`+ this.BOQdataString[0].__EMPTY_4 +`</td>
        <td>ESTIMATED RATE</td>
        <td class='text-center'>` +this.compare(this.BOQdataString[0].__EMPTY_4,"ESTIMATED RATE")+`</td></tr><tr>
        <td>`+ this.BOQdataString[0].__EMPTY_5 +`</td>
        <td>AMOUNT</td>
        <td class='text-center'>` +this.compare(this.BOQdataString[0].__EMPTY_5,"AMOUNT")+`</td></tr><tr></tbody></table>`
        // + = "SL NO." `+this.compare(this.BOQdataString[0][firstkey],"SL NO.")+` </div>
        // <div>` + this.BOQdataString[0].__EMPTY +` = "DESCRIPTION OF WORK" `+this.compare(this.BOQdataString[0].__EMPTY,"DESCRIPTION OF WORK")+` </div>
        // <div>` + this.BOQdataString[0].__EMPTY_1 +` = "ITEM CODE" `+this.compare(this.BOQdataString[0].__EMPTY_1,"ITEM CODE")+` </div>
        // <div>` + this.BOQdataString[0].__EMPTY_2 +` = "QNTY./NOS." `+this.compare(this.BOQdataString[0].__EMPTY_2,"QNTY./NOS.")+` </div>
        // <div>` + this.BOQdataString[0].__EMPTY_3 +` = "UNIT" `+this.compare(this.BOQdataString[0].__EMPTY_3,"UNIT")+` </div>
        // <div>` + this.BOQdataString[0].__EMPTY_4 +` = "ESTIMATED RATE" `+this.compare(this.BOQdataString[0].__EMPTY_4,"ESTIMATED RATE")+` </div>
        // <div>` + this.BOQdataString[0].__EMPTY_5 +` = "AMOUNT IN RS." `+this.compare(this.BOQdataString[0].__EMPTY_5,"AMOUNT IN RS.")+` </div>`

        this.fileInput.clear();
        this.compacctToast.add({
          key: "boqExcel",
          sticky: true,
          severity: "warn",
          summary: "Coloum Name Invalid",
          detail: errorMgs
        });
      }
  }
  reader.readAsBinaryString(file);
}
FetchPDFFile(event) {
  this.PDFFlag = false;
  this.BOQPDFFile = {};
  if (event) {
    this.BOQPDFFile = event.files[0];
    this.PDFFlag = true;
  }
}
compare(a,b) {
  const returnCode = a === b ? '<i class="fa fa-fw fa-check" style="color:#34A835" aria-hidden="true"></i>' : '<i class="fa fa-fw fa-times"  style="color:#f03a17" aria-hidden="true"></i>';
  return returnCode;
}
BOQUploader(fileData) {
  // const endpoint = "/Master_Product_V2/Upload_Doc";
  // const formData: FormData = new FormData();
  // formData.append("aFile", fileData);
  // this.$http.post(endpoint, formData).subscribe(data => {
  //   console.log(data);
  // });
}
}
class Tender{
  Foot_Fall_ID = 0;
  Tender_ID:string;
  Cost_Cen_ID:string;
  User_ID:string;
  Posted_On:string;
  Enq_Source_ID:number;
  Tender_Org_ID	:string;
  Tender_Category_ID:string;
  Tender_Amount	:number;
  Tender_Name:string;
  Elegibility:string;
  Tender_Opening_Date:string;
  Tender_Closing_Date:string;
  Corrigendum	:string;
  Remarks	:string;
  Lead_Status = 'Tender Created';
  EMD_Amount:number;
  T_Fee_Amount:number;

  Enq_Source_Detail:string;
  Tender_Ref_No:string;
  Tender_Type_ID: string;
  Form_Of_Contract_ID:string;
  Location:string;
  Pin_Code:string;
  Tender_Payment_Mode_ID:string;
  Tender_Publish_Date:string;
  Period_Of_Work:string;
  EMD_Through_BG_SD:string;
  EMD_fee_Type :string;
  EMD_Persentage:string;
  EMD_Payable_To:string;
  EMD_Payable_At:string;
  T_Fee_Payable_At:string;
  T_Fee_Payable_To:string;
  T_Fee_exm_Allowed :string;
  dial_code = '+91';
  Enq_Source_Mobile:string;
}
class Task{
  Task_ID= 0;
  Priority = 'Normal';
  Task_Status_ID	= 1;
  Task_Subject:string;
  Due_On:string;
  Tagged_To_User_ID:string;
  Linked_To= 'Lead'
  Foot_Fall_ID:number;
  Sub_Ledger_ID =0;
  Last_Updated_On:string;
  Created_By:string;
  Created_On:string;
}
class Search{
  From_Date:string;
  To_Date:string;
  Date_Type:string;
  Tender_Closing_Date:string;
  Tender_Org_ID: string;
}

class EMD{
  Foot_Fall_ID: string;
  EMD_Amount:number;
  EMD_Amount_Deposit_Date:string;
  EMD_Amount_Deposit_Type:string;
  EMD_BG_Creation_Date= '';
  EMD_BG_Exp_Date= '';
  EMD_FD_Amount:number;
  EMD_FD_Mature_Amount:number;
  EMD_FD_Mature_Date= '';
  EMD_NEFT_Txn_Date= '';
  EMD_NEFT_TXN_No= '';
}
class Fee{
  Foot_Fall_ID:string;
  T_Fee_Amount_Deposit_Date:string;
  T_Fee_NEFT_Txn_Date:string;
  T_Fee_NEFT_TXN_No:string;
}
class Submission{
  Foot_Fall_ID:string;
  Tender_Submission_Date:string;
}
class BidOpening{
  Foot_Fall_ID:string;
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
Agreement_Value:number;
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
}
class BidOpeningList {
Schedule_ID:string;
Sl_No	:number;
Bidder_Name:string;
Estimated_Rate:number;
Quoted_Percentage:string;
Less_Excess:string;
Rate:number;
Rate_In_Words:string;
Foot_Fall_ID:string;
}
class RankBidOpeningList {
  Rank_ID:string;
  Rank:string;
  Sl_No	:number;
  Bidder_Name:string;
  Estimated_Rate:number;
  Quoted_Percentage:string;
  Less_Excess:string;
  Rate:number;
  Rate_In_Words:string;
  Foot_Fall_ID:string;
  Lottery_Flag:string;
  Temp_Bidder_Array:any = [];
}
