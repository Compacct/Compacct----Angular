import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FileUpload, OverlayPanel } from 'primeng/primeng';

import * as moment from "moment";
import * as XLSX from 'xlsx';
import { Console } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-tuto-crm-lead-field-sale',
  templateUrl: './tuto-crm-lead-field-sale.component.html',
  styleUrls: ['./tuto-crm-lead-field-sale.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoCrmLeadFieldSaleComponent implements OnInit {
  url = window["config"];
  leadFollowUpList = [];
  leadFollowUpListBackup = [];
  leadFollowUpList2 = [];
  leadFollowUpListBackup2 = [];
  leadFollowUpList3 = [];
  leadFollowUpListBackup3 = [];
  seachSpinner = false;
  seachSpinner2 = false;
  seachSpinner3 = false;
  SearchFormSubmitted = false;
  SearchFormSubmitted2 = false;
  SearchFormSubmitted3 = false;
  LeadTransferModalBtn = false;
  SelectAllLead = false;

  ObjSearch = new Search();
  ObjSearch2 = new Search();
  ObjSearch3 = new Search();
  PaginationObj = {
    first: 0,
    rows: 100
  }


  UserList = [];
  ActionList = [];
  ActionList2 = [];
  AllUserList = [];
  nextActionLists = [];
  SalesUserList = [];
  objFollowupDetails = new Followup();
  objFollowUpCreation = new Followup();
  FollowupModal = false;
  folloupFormSubmit = false;
  TutopiaDemoActionFlag = false;
  followUpLists = [];
  distinctDateArray = [];
  validcheck = false;
  forwardlead = true;

  NxtFollowupDate = new Date();
  TodayDate = new Date();

  transferLeadSubmitted = false;
  TransferLeadModal = false;

  CityList = [];
  Class_NameList = [];
  ViewedList = [];
  DealerList = [];

  SelectedDealerFilterList = [];
  SelectedCurrentActFilterList =[];
  SelectedViewdFilterList = [];
  SelectedClassFilterList = [];
  SelectedCityFilterList = [];

  PinList = [];
  Appointment_ForList = [];
  DaysList = [];
  RegisterList = [{ label: 'REGISTERED', value: '1' }, { label: 'UN REGSITERED', value: '0' }]
  ZonalSalesHeadList = [];
  DAppoSlotList = [];
  SchoolNameList = [];
  SchoolPinList = [];
  DistributorNameList = [];
  ASPConfirmList = [{ label: 'Confirmed', value: 'Y' }, { label: 'Not Confirmed', value: 'N' }]
  ASPJourneyStartedList = [{ label: 'Yes ', value: 'Y' }, { label: 'No', value: 'N' }]
  
  SelectedPinFilterList = [];
  SelectedAppointmentForFilterList = [];
  SelectedDaysFilterList = [];
  SelectedRegisterFilterList = [];
  SelectedZonalSalesFilterList = [];
  SelectedAppoSlotFilterList = [];
  SelectedSchoolNameFilterList = [];
  SelectedSchoolPinFilterList = [];
  SelectedDistributorNameList = [];
  SelectedASPConfirmList = [];
  SelectedASPJourneyStartedList = [];

  
  PinList2 = [];
  Appointment_ForList2 = [];
  DaysList2 = [];
  RegisterList2 = [{ label: 'REGISTERED', value: '1' }, { label: 'UN REGSITERED', value: '0' }]
  ZonalSalesHeadList2 = [];
  DAppoSlotList2 = [];
  SchoolNameList2 = [];
  SchoolPinList2 = [];
  DistributorNameList2 = [];
  ASPConfirmList2 = [{ label: 'Confirmed', value: 'Y' }, { label: 'Not Confirmed', value: 'N' }]
  ASPJourneyStartedList2 = [{ label: 'Yes ', value: 'Y' }, { label: 'No', value: 'N' }]
  
  SelectedPinFilterList2 = [];
  SelectedAppointmentForFilterList2 = [];
  SelectedDaysFilterList2 = [];
  SelectedRegisterFilterList2 = [];
  SelectedZonalSalesFilterList2 = [];
  SelectedAppoSlotFilterList2 = [];
  SelectedSchoolNameFilterList2 = [];
  SelectedSchoolPinFilterList2 = [];
  SelectedDistributorNameList2 = [];
  SelectedASPConfirmList2 = [];
  SelectedASPJourneyStartedList2 = [];


  ShowDetailsModal = false;
  Foot_Fall_ID = undefined;
  Lead_ID = undefined;
  Orderdetaillist = [];
  Billingdetaillist = [];
  FollowupList = [];
  Studentdetails:any;
  ObjStudetail = new Studetail();
  items = [];
  tabIndexToView = 0;
  tabIndexToViewMain = 0;
  SupportTicketDumplist = [];
  SupportQuestionDumplist = [];

  
  NextFollowupFilter: any;
  NextFollowupFilterSelected: any;
  
  NextFollowupFilter2: any;
  NextFollowupFilterSelected2: any;

  CallDetailsModalFlag = false;
  CallDetailsObj: any = {};
  
  from_date:any;
  to_date:any;
  from_date2:any;
  to_date2:any;
  from_date3:any;
  to_date3:any;

  ForwardFieldSalesObj = new ForwardFieldSales();
  ForwardFieldSalesDate = new Date().setDate(new Date().getDate() + 1);
  ForwardFieldSalesModal = false;
  ForwardFieldSalesSubmitted = false;
  ASPList = [];
  DistributorList = [];
  AppoSlotList = [];

  
  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  ProductPDFFile:any = {};
  saveSpinner1 = false;
  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  @ViewChild('panel',{static:true}) panel: OverlayPanel;
  @ViewChild('JourneyTimeOverlay', { static: false }) JourneyTime: ElementRef;
  
OverlayCreateModal = false;
CreateLightBoxSubmitted = false;
saveSpinner2 = false;
ObjAppoConfm = new AppoConfm ();

ConductionAppo_ID = undefined;

EnrolledModalflag = false;
EnrollededFormSubmiited = false;
ObjEnrolled = new enroll();
ProductList =[];
itemsMain = ['PENDING','ENROLLED','CANCELED'];

ShowDetailsOptionModal = false;
CurrentStudentDetails:any = {};
JourneyItems = [];
Appo_ID = undefined;
Reject_Reason = undefined;
RejectList = [];

ResceduleObj:any = {};
ResceduleModal = false;
ResceduleFormSubmit = false;
ResceduleDate = new Date();
Tomorrow = new Date();
TimeSlotList:any = [];
saveSpinner3 = true;

FollowAppoModal = false;
FollowAppoNextDate = new Date();
FollowAppoNextSubmitted = false;

FilterFlag = false;
SelectedStatusListFilterList = [];
CurrentStatusList  = [];

RescedulePDFFlag = false;
ResceduleMP3File:any = {};
CanceledPDFFlag = false;
CanceledMP3File:any = {};
RejectPDFFlag = false;
RejectMP3File:any = {};
  constructor(  private Header: CompacctHeader,
    private $http : HttpClient,
    private router : Router,
    private route: ActivatedRoute,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,) { 
      this.route.queryParams.subscribe(params => {
        console.log(params);
        if(params.User && params.Action) {
          this.ObjSearch.Current_Action = window.atob(params.Action);
          this.ObjSearch.User_ID = Number(window.atob(params.User));
          this.ObjSearch2.Current_Action = window.atob(params.Action);
          this.ObjSearch2.User_ID = Number(window.atob(params.User));
          console.log(window.atob(params.User))
          this.SaerchFollowup(true);
        }
       })
       const today = new Date()
       const tomorrow = new Date(today)
       tomorrow.setDate(tomorrow.getDate() + 1)
       this.Tomorrow = new Date(tomorrow)
    }

  ngOnInit() {
    console.log('working')
    this.Header.pushHeader({
      Header: "Appointment Management (Field Sales)",
      Link: "CRM -> Appointment Management (Field Sales)"
    });
    this.items = ["Student Detail","Followup Details", "Billing Details","Order Details ","Support Question Dump","Support Ticket Dump"];
    // this.GetUserList();
    this.GetActionList();
   // this.GetSalesUserList();
    this.GetAllUserList();
    this.GetActionListFollowupCreate();
    this.GetDistributor();
    this.GetASPName();
    this.GetAppoSlotList();
    this.GetProductList();
    this.GetTimeSlotList();
  }
// SHOW OPTION DETAILS
ShowOption(obj) {
  this.ObjStudetail = new Studetail();
    this.ShowDetailsOptionModal = false;
    this.Foot_Fall_ID = undefined;
    this.Lead_ID = undefined;
    this.Studentdetails = undefined;
    this.Orderdetaillist = [];
    this.FollowupList = [];
    this.Billingdetaillist = [];
    this.CurrentStudentDetails = {};
    if(obj.Lead_ID){
      this.CurrentStudentDetails = {...obj};
      this.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.Lead_ID = obj.Lead_ID;
      this.GetStudentdetails();
      this.GetFollowupList();
      setTimeout(()=>{
        this.ShowDetailsOptionModal = true;
      },900);
}
}

GetTimeSlotList() {
  this.$http.get('https://tutopiacallaz.azurewebsites.net/api/Mobile_Func_Adv?code=CLSiAdJbe7iil5hQ9n8aVAOmiFt3KPjk2AnARj3vaY7mjKSsHBxSmg==&Report_Name=Get_Appointment_Slot&Sp_Name=SP_Controller').subscribe((data:any)=>{
    
    this.TimeSlotList = data.message ? JSON.parse(data.message) : [];
    this.TimeSlotList.forEach((data)=>{
      data['label'] = data.Time_Slot_Name;
      data['value'] = data.Time_Slot_ID;
    })
  });
  
}
async GetRejectList(val) {
  const obj = {
    "SP_String": "Tutopia_Followup_SP",
    "Report_Name_String": "Reject_Reason",
    "Json_Param_String": JSON.stringify([{ 'Reason_Type' : val }])
  }
  return this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All?Report_Name=Reject_Reason').toPromise();
    // .subscribe((data: any) => {
    //   const tempActionTaken= data;

      // const tempActionTaken = $.grep(data, function (value) { return value.Request_Type !== "Visit Customer" && value.Request_Type !== "Direct Appointment"; });
      // tempActionTaken.forEach(item => {
      //   item.label = item.Product_Description;
      //   item.value = item.Product_ID;
      // })
      // this.RejectList = tempActionTaken;
    // });
}

  TabClickMain(e) { 
  }
  GetProductList() {
    const obj = {
      "SP_String": "Tutopia_Call_Appointment_Works_SP",
      "Report_Name_String": "Get_product_For_Enroled"
    }
    this.GlobalAPI.CommonPostData(obj,'/Tutopia_Call_Common_SP_For_All')
      .subscribe((data: any) => {
        const tempActionTaken= data;
        // const tempActionTaken = $.grep(data, function (value) { return value.Request_Type !== "Visit Customer" && value.Request_Type !== "Direct Appointment"; });
        tempActionTaken.forEach(item => {
          item.label = item.Product_Description;
          item.value = item.Product_ID;
        })
        this.ProductList = tempActionTaken;
      });
  }
  GetUserList() {
     this.$http
        .get('/BL_CRM_Master_SalesTeam/Get_Sales_Man_with_below_members')
        .subscribe((data: any) => {
            this.UserList = data.length ? data : [];
         this.ObjSearch.User_ID =  this.ObjSearch.User_ID ? this.ObjSearch.User_ID : this.$CompacctAPI.CompacctCookies.User_ID;
         this.ObjSearch2.User_ID =  this.ObjSearch2.User_ID ? this.ObjSearch2.User_ID : this.$CompacctAPI.CompacctCookies.User_ID;
         this.ObjSearch3.User_ID =  this.ObjSearch3.User_ID ? this.ObjSearch3.User_ID : this.$CompacctAPI.CompacctCookies.User_ID;
        });
  }
  GetActionList() {
    const obj = {
      "SP_String": "SP_Controller",
      "Report_Name_String": "GET_Action_Type_Channel_Search"
    }
    this.GlobalAPI.CommonPostData(obj,'/Tutopia_Call_Common_SP_For_All')
      .subscribe((data: any) => {
        const tempActionTaken= data;
        // const tempActionTaken = $.grep(data, function (value) { return value.Request_Type !== "Visit Customer" && value.Request_Type !== "Direct Appointment"; });
        tempActionTaken.forEach(item => {
          item.label = item.Request_Type;
          item.value = item.Request_Type;
        })
      //  this.ActionList = tempActionTaken;
        this.nextActionLists = tempActionTaken;
        tempActionTaken.push({
          Request_Sl_No: 0,
          Request_Status: null,
          Request_Type: "Fresh",
          Request_Type_id: 25,
          label : "Fresh",
          value : 25
        })
        this.ActionList2 = tempActionTaken;
        this.ObjSearch.Current_Action = 'Interested for Home Demo';
      });
  }
  GetActionListFollowupCreate() {
    const obj = {
      "SP_String": "SP_Controller",
      "Report_Name_String": "GET_Action_Type_Channel"
    }
    this.GlobalAPI.CommonPostData(obj,'/Tutopia_Call_Common_SP_For_All')
      .subscribe((data: any) => {
        const tempActionTaken= data;
        // const tempActionTaken = $.grep(data, function (value) { return value.Request_Type !== "Visit Customer" && value.Request_Type !== "Direct Appointment"; });
        tempActionTaken.forEach(item => {
          item.label = item.Request_Type;
          item.value = item.Request_Type;
        })
        this.ActionList = tempActionTaken;
      });
  }
  GetSalesUserList() {
    this.$http
        .get('/Common/Get_User_List_All_Sales')
        .subscribe((data: any) => {
            this.SalesUserList = data.length ? data : [];
        });
  }
  GetAllUserList() {
    const obj = {
      "Report_Name": "Get_Direct_Sale_Users ",
      "Json_Param_String" : JSON.stringify([{USER_ID :this.$CompacctAPI.CompacctCookies.User_ID}])
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          data.forEach(it=> {
            it['value'] = it.User_ID;
            it['label'] = it.Name;
          })
          this.AllUserList = data.length ? data : [];
          this.SalesUserList = data.length ? data : [];
          this.UserList = data.length ? data : [];
          this.ObjSearch.User_ID =  this.ObjSearch.User_ID ? this.ObjSearch.User_ID : this.$CompacctAPI.CompacctCookies.User_ID;
          this.ObjSearch2.User_ID =  this.ObjSearch.User_ID ? this.ObjSearch2.User_ID : this.$CompacctAPI.CompacctCookies.User_ID;
          this.ObjSearch3.User_ID =  this.ObjSearch3.User_ID ? this.ObjSearch3.User_ID : this.$CompacctAPI.CompacctCookies.User_ID;
        });
    // this.$http
    //     .get(this.url.apiGetUserListAll)
    //     .subscribe((data: any) => {
    //         this.AllUserList = data.length ? data : [];
    //     });
  }
  
  GetFilteredItems () {
    // this.SelectedDealerFilterList = [];
    // this.SelectedViewdFilterList = [];
    // this.SelectedClassFilterList = [];
    // this.SelectedCityFilterList = [];
    // this.SelectedPinFilterList = [];
    const FilterTypeArr = ['Pin','Appointment_For','Days'];
    for(let i =0; i < FilterTypeArr.length;i++) {
      const obj = {
        "Report_Name": "Browse Student Follow-up v3 Filter",
        "Json_Param_String" : JSON.stringify([{ 'User_ID' : this.ObjSearch.User_ID ,'Filter_Type' :  FilterTypeArr[i]}])
      }
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      this.$http
          .post("/Common/Create_Common_task_Tutopia_Call?Report_Name=Browse Student Follow-up v3 Filter",obj)
          .subscribe((res: any) => {
            const data = res ? JSON.parse(res) : [];
            this[FilterTypeArr[i]+'List'] = data.length ? data.map((item) => {
              return {label: item[Object.keys(item)[0]], value : item[Object.keys(item)[0]]}
            }) : [];
      });
    }
  }
  GetDistinct() {
    let PinFilter = [];
    let AppointmentForFilter = [];
    let DaysFilter = [];
    let ZonalSalesFilter = [];
    let SlotFilter = [];
    let SchoolNameFilter = [];
    let SchoolPinFilter = [];
    let DistributorNameFilter = [];
    let CurrentStatusFilter = [];

    this.PinList = [];
  this.Appointment_ForList = [];
  this.DaysList = [];
  this.ZonalSalesHeadList = [];
  this.DAppoSlotList = [];
  this.SchoolNameList = [];
  this.SchoolPinList = [];
  this.DistributorNameList =[];
  this.CurrentStatusList  = [];
    this.leadFollowUpListBackup.forEach((item) => {
      if (PinFilter.indexOf(item.Pin) === -1) {
        PinFilter.push(item.Pin);
        this.PinList.push({ label: item.Pin, value: item.Pin });
      }
      if (AppointmentForFilter.indexOf(item.Appointment_For) === -1) {
        AppointmentForFilter.push(item.Appointment_For);
        this.Appointment_ForList.push({ label: item.Appointment_For, value: item.Appointment_For });
      }
      if (DaysFilter.indexOf(item.Days) === -1) {
        DaysFilter.push(item.Days);
        this.DaysList.push({ label: item.Days, value: item.Days });
      }
      if (SlotFilter.indexOf(item.Appo_Time_Slot) === -1) {
        SlotFilter.push(item.Appo_Time_Slot);
        this.DAppoSlotList.push({ label: item.Appo_Time_Slot, value: item.Appo_Time_Slot });
      }
      if (ZonalSalesFilter.indexOf(item.Zonal_Sales_Head) === -1) {
        ZonalSalesFilter.push(item.Zonal_Sales_Head);
        this.ZonalSalesHeadList.push({ label: item.Zonal_Sales_Head, value: item.Zonal_Sales_Head });
      }
      if (SchoolNameFilter.indexOf(item.School_Name) === -1) {
        SchoolNameFilter.push(item.School_Name);
        this.SchoolNameList.push({ label: item.School_Name, value: item.School_Name });
      }
      if (SchoolPinFilter.indexOf(item.School_PIN) === -1) {
        SchoolPinFilter.push(item.School_PIN);
        this.SchoolPinList.push({ label: item.School_PIN, value: item.School_PIN });
      }
      if (DistributorNameFilter.indexOf(item.Distributor_Name) === -1) {
        DistributorNameFilter.push(item.Distributor_Name);
        this.DistributorNameList.push({ label: item.Distributor_Name, value: item.Distributor_Name });
      }
      if (CurrentStatusFilter.indexOf(item.Sub_Status) === -1) {
        CurrentStatusFilter.push(item.Sub_Status);
        this.CurrentStatusList.push({ label: item.Sub_Status, value: item.Sub_Status });
      }
    });
  }
  NextFollowDateFilterChange(e) {
    this.NextFollowupFilterSelected = undefined
    if (e) {
      this.NextFollowupFilterSelected =  moment(e, "YYYY-MM-DD")["_d"];
      console.log(this.NextFollowupFilterSelected)
      this.GlobalFilterChange();
    }
  }
  GlobalFilterChange () {
    let searchFields = [];

    let PinFilter = [];
    let AppointmentForFilter = [];
    let DaysFilter = [];
    let RegisterFilter = [];
    let ZonalSalesFilter = [];
    let SlotFilter = [];
    let SchoolNameFilter = [];
    let SchoolPinFilter = [];
    let DistributorNameFilter = [];
    let ASPConfirmFilter = [];
    let ASPJourneyStartedFilter = [];
    let CurrentStatusFilter = [];

    if (this.SelectedPinFilterList.length) {
      searchFields.push('Pin');
      PinFilter = this.SelectedPinFilterList;
    }
    if (this.SelectedAppointmentForFilterList.length) {
      searchFields.push('Appointment_For');
      AppointmentForFilter = this.SelectedAppointmentForFilterList;
    }
    if (this.SelectedDaysFilterList.length) {
      searchFields.push('Days');
      DaysFilter = this.SelectedDaysFilterList;
    }
    if(this.SelectedRegisterFilterList.length) {
      searchFields.push('Foot_Fall_ID');
      RegisterFilter = this.SelectedRegisterFilterList;
    }
    if (this.SelectedZonalSalesFilterList.length) {
      searchFields.push('Zonal_Sales_Head');
      ZonalSalesFilter = this.SelectedZonalSalesFilterList;
    }
    if (this.SelectedAppoSlotFilterList.length) {
      searchFields.push('Appo_Time_Slot');
      SlotFilter = this.SelectedAppoSlotFilterList;
    }
    if (this.SelectedSchoolNameFilterList.length) {
      searchFields.push('School_Name');
      SchoolNameFilter = this.SelectedSchoolNameFilterList;
    }
    if (this.SelectedSchoolPinFilterList.length) {
      searchFields.push('School_PIN');
      SchoolPinFilter = this.SelectedSchoolPinFilterList;
    }
    if (this.SelectedDistributorNameList.length) {
      searchFields.push('Distributor_Name');
      DistributorNameFilter = this.SelectedDistributorNameList;
    }
    if (this.SelectedASPConfirmList.length) {
      searchFields.push('ASP_Confirm');
      ASPConfirmFilter = this.SelectedASPConfirmList;
    }
    if (this.SelectedASPJourneyStartedList.length) {
      searchFields.push('ASP_Journey_Started');
      ASPJourneyStartedFilter = this.SelectedASPJourneyStartedList;
    }
    
    if (this.SelectedStatusListFilterList.length) {
      searchFields.push('Sub_Status');
      CurrentStatusFilter = this.SelectedStatusListFilterList;
    }
    const ctrl = this;
    this.leadFollowUpList = [];
    if (searchFields.length) {
      const ctrl = this;
      const LeadArr = this.leadFollowUpListBackup.filter(function (e) {
        return ((PinFilter.length ? PinFilter.includes(e['Pin']) : true)
          && (AppointmentForFilter.length ? AppointmentForFilter.includes(e['Appointment_For']) : true)
          && (DaysFilter.length ? DaysFilter.includes(e['Days']) : true)
          && (SlotFilter.length ? SlotFilter.includes(e['Appo_Time_Slot']) : true)
          && (ZonalSalesFilter.length ? ZonalSalesFilter.includes(e['Zonal_Sales_Head']) : true)
          && (RegisterFilter.length ? ctrl.RegisterFilterFunc(e['Foot_Fall_ID'],RegisterFilter) : true)
          && (SchoolNameFilter.length ? SchoolNameFilter.includes(e['School_Name']) : true)
          && (SchoolPinFilter.length ? SchoolPinFilter.includes(e['School_PIN']) : true)
          && (DistributorNameFilter.length ? DistributorNameFilter.includes(e['Distributor_Name']) : true)
          && (ASPConfirmFilter.length ? ASPConfirmFilter.includes(e['ASP_Confirm']) : true)
          && (ASPJourneyStartedFilter.length ? ASPJourneyStartedFilter.includes(e['ASP_Journey_Started']) : true)
          && (CurrentStatusFilter.length ? CurrentStatusFilter.includes(e['Sub_Status']) : true)
          );
      });
      this.leadFollowUpList = LeadArr.length ? LeadArr : [];
    } else {
      this.leadFollowUpList = this.leadFollowUpListBackup;
    }
  }
  RegisterFilterFunc (foot , arr){
    const footFallID = foot.toString();
  if(footFallID) {
    let returnBol = false;
    for (let index = 0; index < arr.length; index++) {
      const e= arr[index];
      if(e === '0' && footFallID === '0') {
        returnBol = true;
        break;
      } else if(e !== '0' && footFallID !== '0') { 
        returnBol = true;
        break;
      } else {
        returnBol = false;
        break;
      }
    }
    return returnBol;
  }
  }
  // FOR SEARCH PENDING TAB -1
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.from_date = dateRangeObj[0];
      this.to_date = dateRangeObj[1];
    }
  }
  SaerchFollowup(valid) {
    this.SearchFormSubmitted = true;
    this.leadFollowUpList = [];
    this.leadFollowUpListBackup = [];
    this.LeadTransferCheckBoxChanged();
    if (valid) {
      this.seachSpinner = true;
      this.ObjSearch.User_ID = this.ObjSearch.User_ID ? this.ObjSearch.User_ID : '0';
      this.ObjSearch.Current_Action = this.ObjSearch.Current_Action ? this.ObjSearch.Current_Action : '';
      const tempObj = {
        'Start_Date': this.from_date  ? this.DateService.dateConvert(new Date(this.from_date))
        : this.DateService.dateConvert(new Date()),
        'End_Date' : this.to_date  ? this.DateService.dateConvert(new Date(this.to_date))
        : this.DateService.dateConvert(new Date()),
        'User_ID' : this.ObjSearch.User_ID
      }
      const obj = {
        "Json_Param_String" : JSON.stringify([tempObj])
      }
     // this.GetFilteredItems();
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      this.$http
          .post("/Common/Create_Common_task_Tutopia_Call?Report_Name=Browse Channel sale Student Follow-up v4",obj)
          .subscribe((data: any) => {
            const SortData = data ? JSON.parse(data) : [];
            SortData.sort(function(a:any,b:any){
              return new Date(b.Next_Followup).valueOf() - new Date(a.Next_Followup).valueOf();
            });
            this.leadFollowUpList = [...SortData];
            this.leadFollowUpListBackup = [...SortData];
            this.leadFollowUpList.forEach(function (element) {
              if(!element.Lead_ID) {
                console.log(element)
              }
              element.Selected = false;
            });
            this.GetDistinct();
            this.GlobalFilterChange();
            this.seachSpinner = false;
      });
      // this.$http
      //     .post("/Common/Create_Common_task?Report_Name=Browse Student Follow-up v2",obj)
      //     .subscribe((data: any) => {
            
      // });
    }

  }
  getMyPagination(e) {
    this.PaginationObj = e;
    console.log(this.PaginationObj);
  }
  getStatusWiseColor (obj) {
    var currentDate = Date.parse(this.DateService.dateConvert(new Date()) + ' ' + this.DateService.getTime24Hours(new Date()) + ':00');
    var appoDate = Date.parse(this.DateService.dateConvert(new Date(obj.Appo_Date)) + ' ' + this.DateService.getTime24Hours(new Date(obj.Appo_Date)) + ':00');
    if (obj.Status == "Appointment" && currentDate > appoDate) {
        return 'red'
    }
    else {
        switch (obj.Status) {
            case 'Cancel':
                return 'red';
                break;
            case 'Reschedule':
                return 'purple';
                break;
            case 'Consultancy Done':
                return 'blue';
                break;
            case 'Consultancy Bill Done':
                return 'orange';
                break;
            case 'Package Booked':
                return 'orange';
                break;
            case 'Payment Done':
                return 'green';
                break;
            case 'Therapy Done':
                return 'green';
                break;
            case 'Billed':
                return 'orange';
                break;
            default:
        }
    }
  }
  // FOR SEARCH ENROLLED TAB -2 
  getDateRange2(dateRangeObj) {
    if (dateRangeObj.length) {
      this.from_date2 = dateRangeObj[0];
      this.to_date2 = dateRangeObj[1];
    }
  }
  SaerchFollowup2(valid) {
    this.SearchFormSubmitted2 = true;
    this.leadFollowUpList2 = [];
    this.leadFollowUpListBackup2 = [];
    this.LeadTransferCheckBoxChanged();
    if (valid) {
      this.seachSpinner2 = true;
      this.ObjSearch2.User_ID = this.ObjSearch2.User_ID ? this.ObjSearch2.User_ID : '0';
      this.ObjSearch2.Current_Action = this.ObjSearch2.Current_Action ? this.ObjSearch2.Current_Action : '';
      const tempObj = {
        'Start_Date': this.from_date2 ? this.DateService.dateConvert(new Date(this.from_date2))
        : this.DateService.dateConvert(new Date()),
        'End_Date' : this.to_date2  ? this.DateService.dateConvert(new Date(this.to_date2))
        : this.DateService.dateConvert(new Date()),
        'User_ID' : this.ObjSearch2.User_ID
      }
      const obj = {
        "Json_Param_String" : JSON.stringify([tempObj])
      }
     // this.GetFilteredItems();
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      this.$http
          .post("/Common/Create_Common_task_Tutopia_Call?Report_Name=Browse Channel sale Student Follow-up v4 Enroled",obj)
          .subscribe((data: any) => {
            const SortData = data ? JSON.parse(data) : [];
            SortData.sort(function(a:any,b:any){
              return new Date(b.Next_Followup).valueOf() - new Date(a.Next_Followup).valueOf();
            });
            this.leadFollowUpList2 = [...SortData];
            this.leadFollowUpListBackup2 = [...SortData];
            this.leadFollowUpList2.forEach(function (element) {
              element.Selected = false;
            });
            this.GetDistinct2();
            this.GlobalFilterChange2();
            this.seachSpinner2 = false;
      });
      // this.$http
      //     .post("/Common/Create_Common_task?Report_Name=Browse Student Follow-up v2",obj)
      //     .subscribe((data: any) => {
            
      // });
    }

  }
  
  GetDistinct2() {
    let PinFilter = [];
    let AppointmentForFilter = [];
    let DaysFilter = [];
    let ZonalSalesFilter = [];
    let SlotFilter = [];
    let SchoolNameFilter = [];
    let SchoolPinFilter = [];
    let DistributorNameFilter = [];

    this.PinList2 = [];
  this.Appointment_ForList2 = [];
  this.DaysList2 = [];
  this.ZonalSalesHeadList2 = [];
  this.DAppoSlotList2 = [];
  this.SchoolNameList2 = [];
  this.SchoolPinList2 = [];
  this.DistributorNameList2 =[];
    this.leadFollowUpListBackup2.forEach((item) => {
      if (PinFilter.indexOf(item.Pin) === -1) {
        PinFilter.push(item.Pin);
        this.PinList2.push({ label: item.Pin, value: item.Pin });
      }
      if (AppointmentForFilter.indexOf(item.Appointment_For) === -1) {
        AppointmentForFilter.push(item.Appointment_For);
        this.Appointment_ForList2.push({ label: item.Appointment_For, value: item.Appointment_For });
      }
      if (DaysFilter.indexOf(item.Days) === -1) {
        DaysFilter.push(item.Days);
        this.DaysList2.push({ label: item.Days, value: item.Days });
      }
      if (SlotFilter.indexOf(item.Appo_Time_Slot) === -1) {
        SlotFilter.push(item.Appo_Time_Slot);
        this.DAppoSlotList2.push({ label: item.Appo_Time_Slot, value: item.Appo_Time_Slot });
      }
      if (ZonalSalesFilter.indexOf(item.Zonal_Sales_Head) === -1) {
        ZonalSalesFilter.push(item.Zonal_Sales_Head);
        this.ZonalSalesHeadList2.push({ label: item.Zonal_Sales_Head, value: item.Zonal_Sales_Head });
      }
      if (SchoolNameFilter.indexOf(item.School_Name) === -1) {
        SchoolNameFilter.push(item.School_Name);
        this.SchoolNameList2.push({ label: item.School_Name, value: item.School_Name });
      }
      if (SchoolPinFilter.indexOf(item.School_PIN) === -1) {
        SchoolPinFilter.push(item.School_PIN);
        this.SchoolPinList2.push({ label: item.School_PIN, value: item.School_PIN });
      }
      if (DistributorNameFilter.indexOf(item.Distributor_Name) === -1) {
        DistributorNameFilter.push(item.Distributor_Name);
        this.DistributorNameList2.push({ label: item.Distributor_Name, value: item.Distributor_Name });
      }
    });
  }
  NextFollowDateFilterChange2(e) {
    this.NextFollowupFilterSelected2 = undefined
    if (e) {
      this.NextFollowupFilterSelected2 =  moment(e, "YYYY-MM-DD")["_d"];
      console.log(this.NextFollowupFilterSelected2)
      this.GlobalFilterChange();
    }
  }
  GlobalFilterChange2 () {
    let searchFields = [];

    let PinFilter = [];
    let AppointmentForFilter = [];
    let DaysFilter = [];
    let RegisterFilter = [];
    let ZonalSalesFilter = [];
    let SlotFilter = [];
    let SchoolNameFilter = [];
    let SchoolPinFilter = [];
    let DistributorNameFilter = [];
    let ASPConfirmFilter = [];
    let ASPJourneyStartedFilter = [];

    if (this.SelectedPinFilterList2.length) {
      searchFields.push('Pin');
      PinFilter = this.SelectedPinFilterList2;
    }
    if (this.SelectedAppointmentForFilterList2.length) {
      searchFields.push('Appointment_For');
      AppointmentForFilter = this.SelectedAppointmentForFilterList2;
    }
    if (this.SelectedDaysFilterList2.length) {
      searchFields.push('Days');
      DaysFilter = this.SelectedDaysFilterList2;
    }
    if(this.SelectedRegisterFilterList2.length) {
      searchFields.push('Foot_Fall_ID');
      RegisterFilter = this.SelectedRegisterFilterList2;
    }
    if (this.SelectedZonalSalesFilterList2.length) {
      searchFields.push('Zonal_Sales_Head');
      ZonalSalesFilter = this.SelectedZonalSalesFilterList2;
    }
    if (this.SelectedAppoSlotFilterList2.length) {
      searchFields.push('Appo_Time_Slot');
      SlotFilter = this.SelectedAppoSlotFilterList2;
    }
    if (this.SelectedSchoolNameFilterList2.length) {
      searchFields.push('School_Name');
      SchoolNameFilter = this.SelectedSchoolNameFilterList2;
    }
    if (this.SelectedSchoolPinFilterList2.length) {
      searchFields.push('School_PIN');
      SchoolPinFilter = this.SelectedSchoolPinFilterList2;
    }
    if (this.SelectedDistributorNameList2.length) {
      searchFields.push('Distributor_Name');
      DistributorNameFilter = this.SelectedDistributorNameList2;
    }
    if (this.SelectedASPConfirmList2.length) {
      searchFields.push('ASP_Confirm');
      ASPConfirmFilter = this.SelectedASPConfirmList2;
    }
    if (this.SelectedASPJourneyStartedList2.length) {
      searchFields.push('ASP_Journey_Started');
      ASPJourneyStartedFilter = this.SelectedASPJourneyStartedList2;
    }
    const ctrl = this;
    this.leadFollowUpList2 = [];
    if (searchFields.length) {
      const ctrl = this;
      const LeadArr = this.leadFollowUpListBackup2.filter(function (e) {
        return ((PinFilter.length ? PinFilter.includes(e['Pin']) : true)
          && (AppointmentForFilter.length ? AppointmentForFilter.includes(e['Appointment_For']) : true)
          && (DaysFilter.length ? DaysFilter.includes(e['Days']) : true)
          && (SlotFilter.length ? SlotFilter.includes(e['Appo_Time_Slot']) : true)
          && (ZonalSalesFilter.length ? ZonalSalesFilter.includes(e['Zonal_Sales_Head']) : true)
          && (RegisterFilter.length ? ctrl.RegisterFilterFunc(e['Foot_Fall_ID'],RegisterFilter) : true)
          && (SchoolNameFilter.length ? SchoolNameFilter.includes(e['School_Name']) : true)
          && (SchoolPinFilter.length ? SchoolPinFilter.includes(e['School_PIN']) : true)
          && (DistributorNameFilter.length ? DistributorNameFilter.includes(e['Distributor_Name']) : true)
          && (ASPConfirmFilter.length ? ASPConfirmFilter.includes(e['ASP_Confirm']) : true)
          && (ASPJourneyStartedFilter.length ? ASPJourneyStartedFilter.includes(e['ASP_Journey_Started']) : true)
          );
      });
      this.leadFollowUpList2 = LeadArr.length ? LeadArr : [];
    } else {
      this.leadFollowUpList2 = this.leadFollowUpListBackup2;
    }
  }
  RegisterFilterFunc2 (foot , arr){
    const footFallID = foot.toString();
  if(footFallID) {
    let returnBol = false;
    for (let index = 0; index < arr.length; index++) {
      const e= arr[index];
      if(e === '0' && footFallID === '0') {
        returnBol = true;
        break;
      } else if(e !== '0' && footFallID !== '0') { 
        returnBol = true;
        break;
      } else {
        returnBol = false;
        break;
      }
    }
    return returnBol;
  }
  }
  
  // FOR SEARCH ENROLLED TAB -2 
  getDateRange3(dateRangeObj) {
    if (dateRangeObj.length) {
      this.from_date3 = dateRangeObj[0];
      this.to_date3 = dateRangeObj[1];
    }
  }
  SaerchFollowup3(valid) {
    this.SearchFormSubmitted3 = true;
    this.leadFollowUpList3 = [];
    this.leadFollowUpListBackup3 = [];
    this.LeadTransferCheckBoxChanged();
    if (valid) {
      this.seachSpinner3 = true;
      this.ObjSearch3.User_ID = this.ObjSearch3.User_ID ? this.ObjSearch3.User_ID : '0';
      this.ObjSearch3.Current_Action = this.ObjSearch3.Current_Action ? this.ObjSearch3.Current_Action : '';
      const tempObj = {
        'Start_Date': this.from_date3 ? this.DateService.dateConvert(new Date(this.from_date3))
        : this.DateService.dateConvert(new Date()),
        'End_Date' : this.to_date3  ? this.DateService.dateConvert(new Date(this.to_date3))
        : this.DateService.dateConvert(new Date()),
        'User_ID' : this.ObjSearch3.User_ID
      }
      const obj = {
        "Json_Param_String" : JSON.stringify([tempObj])
      }
     // this.GetFilteredItems();
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      this.$http
          .post("/Common/Create_Common_task_Tutopia_Call?Report_Name=Browse Channel sale Student Follow-up v4 Cancled",obj)
          .subscribe((data: any) => {
            const SortData = data ? JSON.parse(data) : [];
            SortData.sort(function(a:any,b:any){
              return new Date(b.Next_Followup).valueOf() - new Date(a.Next_Followup).valueOf();
            });
            this.leadFollowUpList3 = [...SortData];
            this.leadFollowUpListBackup3 = [...SortData];
            this.leadFollowUpList3.forEach(function (element) {
              element.Selected = false;
            });
           // this.GetDistinct2();
           // this.GlobalFilterChange2();
            this.seachSpinner3 = false;
      });
      // this.$http
      //     .post("/Common/Create_Common_task?Report_Name=Browse Student Follow-up v2",obj)
      //     .subscribe((data: any) => {
            
      // });
    }

  }
  // CONFIRM APPO
  OpenConfirmAppo(obj){
    this.OnOverlayOpenConfirmAppo();
    if(obj.Appo_ID){
      this.ObjAppoConfm.Appo_ID = obj.Appo_ID;
      this.OverlayCreateModal = true;
    }
  }
  OnOverlayOpenConfirmAppo(){
    this.CreateLightBoxSubmitted = false;
    this.saveSpinner2 = false;
    this.ObjAppoConfm = new AppoConfm ();
  }
  ConfirmAppo(valid) {
    this.CreateLightBoxSubmitted = true;
    if(valid && this.ObjAppoConfm.Journey_Time) {
      this.saveSpinner2 = true;
      const TempObj = {
        Appo_ID: this.ObjAppoConfm.Appo_ID,
        Journey_Time: this.ObjAppoConfm.Journey_Time + ' Minutes'
    }
    const obja = {
      "SP_String":"SP_Appointment",
      "Report_Name_String": "Update_Appo_Confirm_ASP",
      "Json_Param_String" : JSON.stringify([TempObj])
    }
    this.GlobalAPI
        .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All').subscribe((data: any) => {
    if (data[0].Column1 === 'Success') {
        this.saveSpinner2 = false;
        this.SaerchFollowup(true);
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: 'Appo ID : ' + this.ObjAppoConfm.Appo_ID,
          detail: "Succesfully Updated."
        });
        this.OnOverlayOpenConfirmAppo();
    }
  })
    }
  }
  // JOURNEY START
  StartJourney(obj) {
    if(obj.Appo_ID) {
      const TempObj = {
        Appo_ID: obj.Appo_ID,
    }
  
    const obja = {
      "SP_String":"SP_Appointment",
      "Report_Name_String": "Update_Appo_Journey_ASP",
      "Json_Param_String" : JSON.stringify([TempObj])
    }
    this.GlobalAPI
        .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All').subscribe((data: any) => {
    if (data[0].Column1 === 'Success') {
        this.SaerchFollowup(true);
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: 'Appo ID : ' + this.ObjAppoConfm.Appo_ID,
          detail: "Succesfully Updated."
        });
    }
  })
    }
  }
  // CONDUCTION
  StartConduction(obj){
    this.ConductionAppo_ID = undefined;
  if(obj.Appo_ID) {
    this.ConductionAppo_ID = obj.Appo_ID; 
    this.compacctToast.clear();
    this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'}); 
  }
    
  }
  onConfirmConduction(){
    if(this.ConductionAppo_ID) {
      const TempObj = {
        Appo_ID: this.ConductionAppo_ID,
    }
  
    const obja = {
      "SP_String":"Tutopia_Call_Appointment_Works_SP",
      "Report_Name_String": "Update_Conduction_Done",
      "Json_1_String" : JSON.stringify([TempObj])
    }
    this.GlobalAPI
        .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All').subscribe((data: any) => {
    if (data[0].Column1) {
        this.SaerchFollowup(true);
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: 'Appo ID : ' + this.ObjAppoConfm.Appo_ID,
          detail: "Succesfully Updated."
        });
    }
  })
     }
  }
  onRejectConduction(){
    this.compacctToast.clear('c'); 
    this.ConductionAppo_ID = undefined;
  }
  // ENROLLED

  StartEnrolled(obj){
    this.ClearEnrolled()
    if(obj.Appo_ID) {
      this.ObjEnrolled.Appo_ID = obj.Appo_ID; 
      this.ObjEnrolled.Lead_ID = obj.Lead_ID; 
      this.ObjEnrolled.Foot_Fall_ID = obj.Foot_Fall_ID; 
      this.ObjEnrolled.User_ID = this.$CompacctAPI.CompacctCookies.User_ID; 
      this.EnrolledModalflag = true;
    }
  }
  // CHANGE
  LeadTransferCheckBoxChanged() {
    this.LeadTransferModalBtn = false;
    for (let i = 0; i < this.leadFollowUpList.length;i++) {
      if (this.leadFollowUpList[i].Selected) {
        this.LeadTransferModalBtn = true;
        break;
      }
    }
  }
  SelectAllLeadChanged() {
    const { first, rows } = this.PaginationObj;
    const PageIndex = (first / rows);
    console.log(PageIndex);
    if (this.SelectAllLead) {
      const FollowupLength = this.leadFollowUpList.length;
      if (FollowupLength < (rows + 1)) {
        for (let i = 0; i < FollowupLength; i++) {
          this.leadFollowUpList[i].Selected = true;
        }
      } else {
        if (PageIndex === 0) {
          for (let i = 0; i < FollowupLength; i++) {
            this.leadFollowUpList[i].Selected = i <= (rows - 1) ? true : false;
          }
        } else {
          const page = (PageIndex * rows) -  1;
          for (let i = 0; i < FollowupLength; i++) {
            if (page < i && ((PageIndex * rows) + (rows - 1) >= i)) {
              this.leadFollowUpList[i].Selected = true;
            }
          }
        }
      }
      this.LeadTransferModalBtn = true;
    } else {
      for (let i = 0; i < this.leadFollowUpList.length; i++) {
        this.leadFollowUpList[i].Selected = false;
      }
        this.LeadTransferModalBtn = false;
    }
  }
  FollowupActionChanged() {
    this.TutopiaDemoActionFlag = false;
    this.objFollowUpCreation.Fathers_Occupation = '';
    this.objFollowUpCreation.School = '';
    if (this.objFollowUpCreation.Current_Action === 'Interested for Web Demo' || this.objFollowUpCreation.Current_Action === 'Interested for Home Demo') {
        this.TutopiaDemoActionFlag = true;
      }
  }
  changeStatusForFollowupCreation(status) {
    this.objFollowUpCreation.Sent_To = undefined;
    this.forwardlead = true;
    this.validcheck = false;
    if (status) {
        if (status === "Forward Lead" || status === "Forward Lead With My Own Followup") {
            this.forwardlead = false;
            this.validcheck = true;
        }
    }
  }

  // ACTION
  FollowUpPopup(obj) {
    this.followUpLists = [];
    this.distinctDateArray = [];
    this.objFollowUpCreation = new Followup();
    this.objFollowupDetails = new Followup();
    this.NxtFollowupDate = new Date();
    this.folloupFormSubmit = false;
    this.CallDetailsObj = {};
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    this.fileInput.clear();
    if (obj.Lead_ID) {
      this.objFollowupDetails = obj;
      this.objFollowUpCreation.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.objFollowUpCreation.Lead_ID = obj.Lead_ID;
      this.objFollowUpCreation.School = obj.School;
      this.objFollowUpCreation.Appo_ID = obj.Appo_ID ? obj.Appo_ID : '0';
      this.objFollowUpCreation.Pin = obj.Pin;
      this.objFollowUpCreation.Current_Action = 'Tele Call';
      this.objFollowUpCreation.Followup_Action = 'Tele Call';
      this.objFollowUpCreation.Status = 'Keep it in My Own Followup';
      this.objFollowUpCreation.Sent_To = this.$CompacctAPI.CompacctCookies.User_ID;
      this.changeStatusForFollowupCreation(this.objFollowUpCreation.Status);
      this.TutopiaDemoActionFlag = false;
      this.GetFollowupDetails(obj.Lead_ID);
      this.FollowupModal = true;
    }

  }
  FetchPDFFile(event) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    if (event) {
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
    }
  }
  GetFollowupDetails(footFallID) {
    const ctrl = this;
          const distinctDateArrayTemp = [];
          const obj = {
            "SP_String": "Tutopia_Followup_SP",
            "Report_Name_String": "Browse Followup Tutopia",
            "Json_1_String": '[{"Lead_ID":' + footFallID+'}]'
          }
          this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All?Report_Name=Browse Followup Tutopia').subscribe(function (data) {
                ctrl.followUpLists = data.length ? data:[];
                for (let i = 0; i < ctrl.followUpLists.length; i++) {
                    distinctDateArrayTemp.push(ctrl.followUpLists[i].Posted_On_C);
                }
                const unique = distinctDateArrayTemp.filter(function(value, index, self){
                                return self.indexOf(value) === index;
                                })
            ctrl.distinctDateArray = unique;
            ctrl.FollowupModal = true;
            });
  }
  getFollowupByDate(dateStr) {
    return this.followUpLists.filter((item) => item.Posted_On_C === dateStr);
  }
  RedirectPendingSubscriptionTutopia(footFallID) {
    window.open('/Tutopia_Pending_Subscription?recordid=' + window.btoa(footFallID));
  }
  Billcreation(obj) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        Mobile : window.btoa(obj.Mobile),
        From : 'Y',
      },
    };
    this.router.navigate(['./Tutopia_DS_Billing'], navigationExtras);
  }
  CreatPaymentLink(obj){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        Mobile : window.btoa(obj.Mobile),
      },
    };
    this.router.navigate(['./Tutopia_DS_Payment_Link'], navigationExtras);
  }
  Showdetails(obj){
    this.ObjStudetail = new Studetail();
    this.ShowDetailsModal = false;
    this.Foot_Fall_ID = undefined;
    this.Lead_ID = undefined;
    this.Studentdetails = undefined;
    this.Orderdetaillist = [];
    this.FollowupList = [];
    this.Billingdetaillist = [];
    this.distinctDateArray = [];
    if(obj.Lead_ID){
      this.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.Lead_ID = obj.Lead_ID;
      this.GetStudentdetails(obj);
     // this.GetFollowupList();
        this.GetFollowupDetails1(obj.Lead_ID);
      if(obj.Foot_Fall_ID.toString() !== '0') {
      this.GetBillingdetaillist();
      this.GetOrderdetaillist();
      this.GetSupportQuestionDumplist();
      this.GetSupportTicketDumplist();
      }
      setTimeout(()=>{
        this.ShowDetailsModal = true;
      },900);
    }
  }
  
  GetFollowupDetails1(footFallID) {
    const ctrl = this;
          const distinctDateArrayTemp = [];
          const obj = {
            "SP_String": "Tutopia_Followup_SP",
            "Report_Name_String": "Browse Followup Tutopia",
            "Json_1_String": '[{"Lead_ID":' + footFallID+'}]'
          }
          this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All?Report_Name=Browse Followup Tutopia').subscribe(function (data) {
                ctrl.followUpLists = data.length ? data:[];
                for (let i = 0; i < ctrl.followUpLists.length; i++) {
                    distinctDateArrayTemp.push(ctrl.followUpLists[i].Posted_On_C);
                }
                const unique = distinctDateArrayTemp.filter(function(value, index, self){
                                return self.indexOf(value) === index;
                                })
            ctrl.distinctDateArray = unique;
            });
  }
  getFollowupByDate1(dateStr) {
    return this.followUpLists.filter((item) => item.Posted_On_C === dateStr);
  }
  // GET CALL DETAILS 
  GetCallDetails (objSub) {
    this.CallDetailsObj = {};
    if(objSub.Call_ID){
      this.$http.post("/Tutopia_CRM_Lead/Call_Audio_Check?Call_ID="+ objSub.Call_ID,{}).subscribe((res: any) => {
        console.log(res)
        if(res.data.length) {
          this.CallDetailsObj = res.data[0];
          this.CallDetailsModalFlag = true;
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "error",
            detail: "Error Occured In Tutopia Call Details API."
          });
        }
      });
    }
  }
   //  DETAILS
  TabClick(e){
    console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["Student Detail","Followup Details", "Billing Details","Order Details ","Support Question Dump","Support Ticket Dump"];

  }
  GetStudentdetails(tempData?){
    this.Studentdetails = undefined;
    const tempObj = {
      Lead_ID: this.Lead_ID
    };

    const obj = {
      "Json_Param_String" : JSON.stringify([tempObj])
    }
    this.GlobalAPI.CommonPostData(obj,'Create_Common_task_Tutopia_Call?Report_Name=Get_Student_Details').subscribe((data:any)=>{
      this.Studentdetails = data ? data[0] : [];
      if(tempData && tempData.Lead_ID) {
        this.Studentdetails['Contact_Name'] = tempData.Contact_Name || this.Studentdetails['Contact_Name'];
        this.Studentdetails['Mobile'] = tempData.Mobile || this.Studentdetails['Mobile'];
        this.Studentdetails['Address'] = tempData.Address || this.Studentdetails['Address'] ;
      }

     })
  }
  GetBillingdetaillist(){
    this.Billingdetaillist = [];
    const Objtemp = {
      Foot_Fall_ID : this.Foot_Fall_ID
    };
    const objj = {
      "SP_String": "Tutopia_Create_Common_SP",
      "Report_Name" : "Get_Student_Bill_Details",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonTaskData(objj).subscribe((data:any)=>{
      this.Billingdetaillist = data.length ? data : [];
      console.log(this.Billingdetaillist)

     })

  }
  GetOrderdetaillist(){
    this.Orderdetaillist = [];
    const Objtemp = {
      Foor_Fall_ID : this.Foot_Fall_ID
    };
    const objj = {
      "Report_Name" : "Get_Order_Details_Foot_Fall_ID_Wise",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonTaskData(objj).subscribe((data:any)=>{
      this.Orderdetaillist = data.length ? data : [];
      console.log(this.Orderdetaillist)

     })

  }
  GetFollowupList(){
    this.FollowupList = [];
    const Objtemp = {
      Lead_ID : this.Lead_ID
    };
    const objj = {
      "Report_Name" : "Get_Followup_Details_Foot_Fall_ID_Wise",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonPostData(objj,'Create_Common_task_Tutopia_Call?Report_Name=Get_Followup_Details_Foot_Fall_ID_Wise').subscribe((data:any)=>{
      this.FollowupList = data.length ? data : [];
      console.log(this.FollowupList)

     })

  }
  GetSupportQuestionDumplist(){
    this.SupportQuestionDumplist = [];
    const Objtemp = {
      Foot_Fall_ID : this.Foot_Fall_ID
    };
    const objj = {
      "Report_Name" : "Get_Support_Question_Foot_Fall_ID_Wise",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonTaskData(objj).subscribe((data:any)=>{
      this.SupportQuestionDumplist = data.length ? data : [];
      console.log(this.SupportQuestionDumplist)

     })

  }
  GetSupportTicketDumplist(){
    this.SupportTicketDumplist = [];
    const Objtemp = {
      Foot_Fall_ID : this.Foot_Fall_ID
    };
    const objj = {
      "Report_Name" : "Get_Support_Ticket_Foot_Fall_ID_Wise",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonTaskData(objj).subscribe((data:any)=>{
      this.SupportTicketDumplist = data.length ? data : [];
      console.log(this.SupportTicketDumplist)

     })

  }
  PrintBill(obj) {
    if (obj.Doc_No) {
      window.open("/Report/Crystal_Files/Finance/SaleBill/tutopia_final.aspx?Doc_No=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

      );
    }
  }

  // SAVE FOLLOWUP
  saveFollowup(valid) {
    this.folloupFormSubmit = true;
    if (valid) {
      this.saveSpinner1 = true;
      this.objFollowUpCreation.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      this.objFollowUpCreation.Next_Followup = this.DateService.dateTimeConvert(new Date(this.NxtFollowupDate));
      const arrAction = this.ActionList.filter(item=> item.Request_Type == this.objFollowUpCreation.Current_Action);
      if(arrAction.length){
         this.objFollowUpCreation.Request_Type_id = arrAction[0].Request_Type_id;
       this.objFollowUpCreation.Request_Type = arrAction[0].Request_Type;
       this.objFollowUpCreation.Call_Req = arrAction[0].Call_Req;
      }
      
      console.log(this.objFollowUpCreation)
      const obj = {
            "SP_String": "Tutopia_Followup_SP",
            "Report_Name_String": "Followup Save Field Sale",
            "Json_1_String": JSON.stringify([this.objFollowUpCreation])
          }
          this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All?Report_Name=Followup Save Field Sale').subscribe((data) => {
              if (data[0].Column1) {  
                if(this.ProductPDFFile['name']){
                  this.upload(this.objFollowUpCreation,data[0].Column1);
                } else {
                  this.saveTutopiaViewStatus(this.objFollowUpCreation);
                  this.compacctToast.clear();
                  this.compacctToast.add({
                    key: "compacct-toast",
                    severity: "success",
                    summary: 'Student ID : ' + this.objFollowUpCreation.Foot_Fall_ID,
                    detail: "Succesfully Saved."
                  });
                  this.GetFollowupDetails(this.objFollowUpCreation.Lead_ID);
                }        
            }
            else {
                this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "error",
                detail: "Error Occured"
              });
              this.saveSpinner1 = false;
            }
            });
    }
  }
  saveTutopiaViewStatus(obj) {
    if (obj.Foot_Fall_ID) {
        const TempObj = {
            Viewd: obj.Status === 'Keep it in My Own Followup' ? 'Y':'N',
            Foot_Fall_ID: obj.Foot_Fall_ID
        }
      this.$http.post('/Tutopia_CRM_Lead/Update_Viewed_Followup', TempObj).subscribe((data: any) => {
        if (data.success) {
            this.saveSpinner1 = false;
            this.SaerchFollowup(true);
        }
      })
    } else {      
      this.saveSpinner1 = false;
    }
  }
  async upload(obj,id){
    const formData: FormData = new FormData();
        formData.append("file", this.ProductPDFFile);
    let response = await fetch('https://tutopiafilestorage.azurewebsites.net/api/Filed_Sales_Voice_Upload?code=ksFjT6O7dt0AfyWsVNq80s2ln6W4RZD7xg/gDSN8cODXcEpMaYVuKQ==&ConTyp='+this.ProductPDFFile['type']+'&ext='+this.ProductPDFFile['name'].split('.').pop()+'&followup_id='+id,{ 
                  method: 'POST',
                  body: formData // This is your file object
                });
    let responseText = await response.text();
    console.log(responseText)
    if(responseText === 'Success') {
      this.saveTutopiaViewStatus(obj);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Student ID : ' + obj.Foot_Fall_ID,
        detail: "Succesfully Saved."
      });
      this.GetFollowupDetails(obj.Lead_ID);

    }
  };

// 
GetAppoSlotList() {
  const obj = {
    "SP_String":"SP_Appointment",
    "Report_Name_String": "GET_Time_Slot"
  }
  this.GlobalAPI
      .CommonPostData(obj,'Tutopia_Call_Common_SP_For_All')
      .subscribe((data: any) => {
        this.AppoSlotList = data.length ? data : [];
      });
}
GetDistributor(){
  const obj = {
    "SP_String": "Tutopia_Field_Sales_School",
    "Report_Name_String": "GET_Distributor_List",

 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  data.forEach(i=>{
    i['value'] = i.Distributor_ID;
    i['label'] = i.Distributor_Name;
  });
     this.DistributorList = data;
 });
}
GetASPName(){
  this.ForwardFieldSalesObj.Appo_To_User_ID = undefined;
  if(this.ForwardFieldSalesObj.Member_ID) {
    const TempObj = {
      Intro_Member_ID : this.ForwardFieldSalesObj.Member_ID
    }
    const obj = {
      "SP_String": "Tutopia_Field_Sales_School",
      "Report_Name_String": "GET_ASP_List",
      "Json_1_String": JSON.stringify([TempObj])
  
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    data.forEach(i=>{
      i['value'] = i.Distributor_ID;
      i['label'] = i.Distributor_Name;
    });
       this.ASPList = data;
   });
  }
  
}
ChnageASPName() {
  this.ForwardFieldSalesObj.Appo_To_User_ID = undefined;
  if(this.ForwardFieldSalesObj.Intro_Member_ID) {
    const arr = this.ASPList.filter(i=> i.Distributor_ID.toString() === this.ForwardFieldSalesObj.Intro_Member_ID.toString());
    if(arr.length && arr[0].Distributor_Name === 'TBA_ASP') {
      this.ForwardFieldSalesObj.Appo_To_User_ID = this.ForwardFieldSalesObj.Member_ID;
    } else {
      this.ForwardFieldSalesObj.Appo_To_User_ID = arr[0].Distributor_ID;
    }
  }
}
ShowForwardFieldSales(obj) {
  this.ForwardFieldSalesObj = new ForwardFieldSales();
  this.ForwardFieldSalesDate = new Date().setDate(new Date().getDate());
  this.ForwardFieldSalesSubmitted = false;
  if(obj.Lead_ID) {
     this.ForwardFieldSalesObj.Appo_ID = obj.Appo_ID;
    this.ForwardFieldSalesModal = true;
  }

}
SaveForwardFieldSales(valid) {
  this.ForwardFieldSalesSubmitted = true;
  if(valid) {
    this.ForwardFieldSalesObj.Appo_Date = this.DateService.dateConvert(new Date(this.ForwardFieldSalesDate));
    console.log(this.ForwardFieldSalesObj)
    const obj = {
      "SP_String":"SP_Appointment",
      "Report_Name_String": "Followup_Field_Appointment_Forward",
      "Json_Param_String" : JSON.stringify([this.ForwardFieldSalesObj])
    }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    this.GlobalAPI
        .CommonPostData(obj,'Tutopia_Call_Common_SP_For_All')
        .subscribe((data: any) => { 
          console.log(data);
    if (data[0].Remarks.includes('Already Engaged')) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "error",
        detail: data[0].Remarks
      });
    } else {
      this.SaerchFollowup(true);
      this.ForwardFieldSalesModal = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'APPO ID : ' +this.ForwardFieldSalesObj.Appo_ID ,
        detail: "Succesfully Forward."
      });
      this.ForwardFieldSalesObj = new ForwardFieldSales();
      this.ForwardFieldSalesDate = new Date().setDate(new Date().getDate());
      this.ForwardFieldSalesSubmitted = false;
    }
  })
  }
  
}

  // FORWARD LEAD
  OpenForwardModal() {
    this.NxtFollowupDate = new Date();
    this.transferLeadSubmitted = false;
    this.TransferLeadModal = true;
    this.objFollowupDetails.frd_viewd = 'Fresh';
  }
  SaveForwardTo(valid) {
     this.transferLeadSubmitted = true;
    if (valid) {
       const obj = this.FetchSelectedLead();
      this.$http.post('/Tutopia_CRM_Lead/Insert_Followup_Branch', obj).subscribe((data: any) => {
        if (data.success) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'success',
            detail: "Succesfully Forwarded."
          });
          this.SaerchFollowup(true);
          this.TransferLeadModal = false;
        }
      })
    }
  }
  FetchSelectedLead () {
    let tempArr = [];
    for (let i = 0; i < this.leadFollowUpList.length; i++) {
      if (this.leadFollowUpList[i].Selected) {
          const obj = {
            Foot_Fall_ID: this.leadFollowUpList[i].Foot_Fall_ID,
            Lead_ID :  this.leadFollowUpList[i].Lead_ID,
            User_ID:  this.$CompacctAPI.CompacctCookies.User_ID,
            Current_Action: "Tele Call",
            Followup_Details: "Forward From" + " " +  this.$CompacctAPI.CompacctCookies.User_Name,
            Followup_Action: "Tele Call",
            Status: "Forward Lead",
            Used: 'N',
            frd_viewd : this.objFollowupDetails.frd_viewd,
            Sent_To: this.objFollowupDetails.Sent_To,
            Posted_On: this.DateService.dateTimeConvert(new Date()),
            Next_Followup: this.DateService.dateTimeConvert(new Date(this.NxtFollowupDate)),
          };
          tempArr.push(obj);
        }
    }
    console.log(tempArr)
    return { Followup_Branch_String: JSON.stringify(tempArr) };
  }
  // EXPORT TO EXCEL
exportexcel(Arr,fileName): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, fileName+'.xlsx');
}

// DETAIL OPTIONS 
// ACCEPT
AcceptAppo(obj){
  if(obj.Appo_ID){
    this.ObjAppoConfm.Appo_ID = obj.Appo_ID;
    this.OverlayCreateModal = true;
  }
}
SaveAcceptAppo(valid) {
  this.CreateLightBoxSubmitted = true;
  if(valid && this.ObjAppoConfm.Journey_Time) {
    this.saveSpinner2 = true;
    const TempObj = {
      Appo_ID: this.ObjAppoConfm.Appo_ID,
      Sub_Status : 'ACCEPT',
      ASP_Journey_Time: this.ObjAppoConfm.Journey_Time 
  }
  const obja = {
    "SP_String":"Tutopia_Followup_SP",
    "Report_Name_String": "ASP New Followup",
    "Json_Param_String" : JSON.stringify([TempObj])
  }
  this.GlobalAPI
      .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All?Report_Name=ASP New Followup').subscribe((data: any) => {
  if (data[0].Followup_ID) {
      this.saveSpinner2 = false;
      this.SaerchFollowup(true);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Appo ID : ' + this.ObjAppoConfm.Appo_ID,
        detail: "Succesfully Updated."
      });      
    this.OverlayCreateModal = false;
  }
})
  }
}
// REJECT
async OpenRejectAppo(obj) {
  this.Appo_ID = undefined;
  this.Reject_Reason = undefined;
  this.RejectList = [];
  
  this.RejectPDFFlag = false;
  this.RejectMP3File = {};
  if(obj.Appo_ID) {
    this.Appo_ID = obj.Appo_ID; 

    this.RejectList = await this.GetRejectList('REJECT');
    this.RejectList.forEach(obj=>{
      obj['label'] = obj.Reason_Details;
      obj['value'] = obj.Reason_Details;
    })
    
    this.compacctToast.clear();
    this.compacctToast.add({key: 'c2', sticky: true, severity: 'warn', summary: 'Are you sure to reject ?', detail: 'Confirm to proceed'}); 
  }
}
onConfirmRejectAppo(){
  if(this.Appo_ID && this.Reject_Reason) {    
    this.ngxService.start();
    const TempObj = {
      Appo_ID: this.Appo_ID,
      Sub_Status : 'REJECT',
      ASP_Reject_Reason : this.Reject_Reason
  }

  const obja = {
    "SP_String":"Tutopia_Followup_SP",
    "Report_Name_String": "ASP New Followup",
    "Json_Param_String" : JSON.stringify([TempObj])
  }
  this.GlobalAPI
      .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All').subscribe((data: any) => {
  if (data[0].Followup_ID) {       
    if(this.RejectMP3File && this.RejectMP3File['size']) {
      this.uploadRejectMP3(data[0].Followup_ID);    
    } else {
      this.SaerchFollowup(true);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Appo ID : ' + this.Appo_ID,
        detail: "Succesfully Updated."
      });
      this.Appo_ID = undefined;
      this.Reject_Reason = undefined;
      this.RejectPDFFlag = false;
      this.ResceduleMP3File = {};
      this.ngxService.stop();
    }  
  }
})
   } else {
     if(!this.Reject_Reason) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "No Reason Choosed. "
      });
     }
   }
}
onRejectAppo(){
  this.compacctToast.clear('c2'); 
  this.Appo_ID = undefined;
  this.Reject_Reason = undefined;
  this.RejectPDFFlag = false;
  this.RejectMP3File = {};
}
FetchRejectFile(event) {
  this.RejectPDFFlag = false;
  this.RejectMP3File = {};
  if (event) {
    this.RejectMP3File = event.files[0];
    this.RejectPDFFlag = true;
  }
}
async uploadRejectMP3(id){
  const formData: FormData = new FormData();
      formData.append("file", this.RejectMP3File);
      let response = await fetch('https://tutopiafilestorage.azurewebsites.net/api/Filed_Sales_Voice_Upload?code=ksFjT6O7dt0AfyWsVNq80s2ln6W4RZD7xg/gDSN8cODXcEpMaYVuKQ==&ConTyp='+this.RejectMP3File['type']+'&ext='+this.RejectMP3File['name'].split('.').pop()+'&followup_id='+id,{ 
                method: 'POST',
                body: formData // This is your file object
              });
  let responseText = await response.text();
  console.log(responseText)
  if(responseText === 'Success') {
      this.SaerchFollowup(true);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Appo ID : ' + this.Appo_ID,
        detail: "Succesfully Updated."
      });
      this.Appo_ID = undefined;
      this.Reject_Reason = undefined;
      this.RejectPDFFlag = false;
      this.ResceduleMP3File = {};
      this.ngxService.stop();

  }
};

// CANCEL
async OpenCANCELAppo(obj) {
  this.Appo_ID = undefined;
  this.Reject_Reason = undefined;
  this.RejectList = [];
  
  this.CanceledPDFFlag = false;
  this.CanceledMP3File = {};
  if(obj.Appo_ID) {
    this.Appo_ID = obj.Appo_ID; 
    this.RejectList = await this.GetRejectList('CANCLED');
    this.RejectList.forEach(obj=>{
      obj['label'] = obj.Reason_Details;
      obj['value'] = obj.Reason_Details;
    })
    this.compacctToast.clear();
    this.compacctToast.add({key: 'c3', sticky: true, severity: 'warn', summary: 'Are you sure to cancel ?', detail: 'Confirm to proceed'}); 
  }
}
onCANCELAppo(){
  if(this.Appo_ID && this.Reject_Reason) {  
    this.ngxService.start();
    const TempObj = {
      Appo_ID: this.Appo_ID,
      Sub_Status : 'CANCLED',
      ASP_Cancel_Reason : this.Reject_Reason
  }

  const obja = {
    "SP_String":"Tutopia_Followup_SP",
    "Report_Name_String": "ASP New Followup",
    "Json_Param_String" : JSON.stringify([TempObj])
  }
  this.GlobalAPI
      .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All').subscribe((data: any) => {
  if (data[0].Followup_ID) {
    
    if(this.CanceledMP3File && this.CanceledMP3File['size']) {
      this.uploadCANCELMP3(data[0].Followup_ID);  
    } else {
      this.SaerchFollowup(true);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Appo ID : ' + this.Appo_ID,
        detail: "Succesfully Updated."
      });
      this.Appo_ID = undefined;
      this.Reject_Reason = undefined;
      this.CanceledPDFFlag = false;
      this.CanceledMP3File = {};
      this.ngxService.stop();
      this.ngxService.stop();
    }       
  }
})
   } else {
    if(!this.Reject_Reason) {
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "compacct-toast",
       severity: "error",
       summary: "Warn Message",
       detail: "No Reason Choosed. "
     });
    }
  }
}
onCloseCANCELAppo(){
  this.compacctToast.clear('c3'); 
  this.Appo_ID = undefined;
  this.Reject_Reason = undefined;
  this.CanceledPDFFlag = false;
  this.CanceledMP3File = {};
}
FetchCANCELFile(event) {
  this.CanceledPDFFlag = false;
  this.CanceledMP3File = {};
  if (event) {
    this.CanceledMP3File = event.files[0];
    this.CanceledPDFFlag = true;
  }
}
async uploadCANCELMP3(id){
  const formData: FormData = new FormData();
      formData.append("file", this.CanceledMP3File);
      let response = await fetch('https://tutopiafilestorage.azurewebsites.net/api/Filed_Sales_Voice_Upload?code=ksFjT6O7dt0AfyWsVNq80s2ln6W4RZD7xg/gDSN8cODXcEpMaYVuKQ==&ConTyp='+this.CanceledMP3File['type']+'&ext='+this.CanceledMP3File['name'].split('.').pop()+'&followup_id='+id,{ 
                method: 'POST',
                body: formData // This is your file object
              });
  let responseText = await response.text();
  console.log(responseText)
  if(responseText === 'Success') {
    this.SaerchFollowup(true);
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: 'Appo ID : ' + this.Appo_ID,
      detail: "Succesfully Updated."
    });
    this.Appo_ID = undefined;
    this.Reject_Reason = undefined;
      this.CanceledPDFFlag = false;
      this.CanceledMP3File = {};
      this.ngxService.stop();

  }
};

// CANCEL cond
async OpenCANCELAppo2(obj) {
  this.Appo_ID = undefined;
  this.Reject_Reason = undefined;
  this.RejectList = [];

  this.CanceledPDFFlag = false;
  this.CanceledMP3File = {};
  if(obj.Appo_ID) {
    this.Appo_ID = obj.Appo_ID; 
    this.RejectList = await this.GetRejectList('CANCLED');
    this.RejectList.forEach(obj=>{
      obj['label'] = obj.Reason_Details;
      obj['value'] = obj.Reason_Details;
    })
    this.compacctToast.clear();
    this.compacctToast.add({key: 'c6', sticky: true, severity: 'warn', summary: 'Are you sure to cancel ?', detail: 'Confirm to proceed'}); 
  }
}
onCANCELAppo2(){
  if(this.Appo_ID && this.Reject_Reason) { 
    this.ngxService.start();
    const TempObj = {
      Appo_ID: this.Appo_ID,
      Sub_Status : 'CANCLED',
      ASP_Cancel_Reason : this.Reject_Reason
  }

  const obja = {
    "SP_String":"Tutopia_Followup_SP",
    "Report_Name_String": "ASP New Followup",
    "Json_Param_String" : JSON.stringify([TempObj])
  }
  this.GlobalAPI
      .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All').subscribe((data: any) => {
  if (data[0].Followup_ID) {
    
    if(this.CanceledMP3File && this.CanceledMP3File['size']) {
      this.uploadCANCELMP3(data[0].Followup_ID); 
    } else {
      this.SaerchFollowup(true);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Appo ID : ' + this.Appo_ID,
        detail: "Succesfully Updated."
      });
      this.Appo_ID = undefined;
      this.Reject_Reason = undefined;
      this.CanceledPDFFlag = false;
      this.CanceledMP3File = {};
      this.ngxService.stop();
    } 
  }
})
   } else {
    if(!this.Reject_Reason) {
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "compacct-toast",
       severity: "error",
       summary: "Warn Message",
       detail: "No Reason Choosed. "
     });
    }
  }
}
onCloseCANCELAppo2(){
  this.compacctToast.clear('c6'); 
  this.Appo_ID = undefined;
  this.Reject_Reason = undefined;
  this.CanceledPDFFlag = false;
  this.CanceledMP3File = {};
}

// JOURNEY 
OpenJourneyStartedAppo(obj) {
  this.Appo_ID = undefined;
  if(obj.Appo_ID) {
    this.Appo_ID = obj.Appo_ID; 
    this.compacctToast.clear();
    this.compacctToast.add({key: 'c4', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'}); 
  }
}
onJourneyStarted(){
  if(this.Appo_ID) {
    const TempObj = {
      Appo_ID: this.Appo_ID,
      Sub_Status : 'JOURNEY STARTED',
      ASP_Reject_Reason : this.Reject_Reason
  }

  const obja = {
    "SP_String":"Tutopia_Followup_SP",
    "Report_Name_String": "ASP New Followup",
    "Json_Param_String" : JSON.stringify([TempObj])
  }
  this.GlobalAPI
      .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All').subscribe((data: any) => {
  if (data[0].Followup_ID) {
      this.SaerchFollowup(true);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Appo ID : ' + this.Appo_ID,
        detail: "Succesfully Updated."
      });
      this.Appo_ID = undefined;
      this.Reject_Reason = undefined;
  }
})
   }
}
onCloseJourneyStarted(){
  this.compacctToast.clear('c4'); 
  this.Appo_ID = undefined;
  this.Reject_Reason = undefined;
}
// RESCEDULE
async OpenRescedAppo(obj){
  this.ResceduleObj = {};
  this.ResceduleModal = false;
  this.ResceduleDate = new Date();
  this.ResceduleFormSubmit = false;
  this.RejectList = [];

  
  this.RescedulePDFFlag = false;
  this.ResceduleMP3File = {};
  if(obj.Appo_ID){
    
    this.RejectList = await this.GetRejectList('RECHEDULE');
    
    this.RejectList.forEach(obj=>{
      obj['label'] = obj.Reason_Details;
      obj['value'] = obj.Reason_Details;
    })
    this.ResceduleObj.Appo_ID = obj.Appo_ID;
    this.ResceduleModal = true;

  }
}
GetAvailMessage(e?){
  if(e) {
    this.ResceduleDate = e;
  }
  if(this.ResceduleObj.Appo_Time_Slot_ID && this.ResceduleDate) {
    this.ngxService.start();
    const TempObj = {
      User_ID: this.ObjSearch.User_ID,
      Slot_ID : this.ResceduleObj.Appo_Time_Slot_ID,
      App_Date :this.DateService.dateConvert(new Date(this.ResceduleDate))
  }

  const obja = {
    "SP_String":"SP_Appointment",
    "Report_Name_String": "Check_Available_Slot",
    "Json_Param_String" : JSON.stringify([TempObj])
  }
  this.GlobalAPI
      .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All').subscribe((data: any) => {
        console.log(data);
      if (data[0].remarks !== 'Available') {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "warn",
            summary: 'UnAvailable',
            detail: data[0].remarks
          });
          this.ResceduleObj.Appo_Time_Slot_ID = undefined;
          this.ResceduleDate = new Date();
      }
      this.ngxService.stop();
})
   }
  console.log(this.ResceduleDate)
}
SaveRescedAppo(valid){
  this.ResceduleFormSubmit = true;
  if(valid) {  
    this.ngxService.start();
    this.saveSpinner3 = true;
    this.ResceduleObj.Appo_Date = this.DateService.dateConvert(new Date(this.ResceduleDate));
      this.ResceduleObj.Sub_Status = 'RECHEDULE';
      const temparr = $.grep(this.TimeSlotList, (value:any) => value.Time_Slot_ID !== this.ResceduleObj.Appo_Time_Slot_ID );
      this.ResceduleObj.Appo_Time_Slot = temparr.length ? temparr[0].Time_Slot_Name : undefined;
  const obja = {
    "SP_String":"Tutopia_Followup_SP",
    "Report_Name_String": "ASP New Followup",
    "Json_Param_String" : JSON.stringify([this.ResceduleObj])
  }
  this.GlobalAPI
      .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All?Report_Name=ASP New Followup').subscribe((data: any) => {
        if (data[0].Followup_ID ) {
          if(this.ResceduleMP3File && this.ResceduleMP3File['size']) {
            this.uploadResceduleMP3(data[0].Followup_ID);
          } else {
            this.saveSpinner2 = false;
            this.SaerchFollowup(true);
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'Appo ID : ' + this.ResceduleObj.Appo_ID,
              detail: "Succesfully Updated."
            });      
            this.ResceduleObj = {};
            this.ResceduleDate = new Date();
            this.ResceduleFormSubmit = false;
            this.ResceduleModal = false;
            this.RescedulePDFFlag = false;
            this.ResceduleMP3File = {};
            this.ngxService.stop();
          }
        }
      })
  }
}
FetchResceduleFile(event) {
  this.RescedulePDFFlag = false;
  this.ResceduleMP3File = {};
  if (event) {
    this.ResceduleMP3File = event.files[0];
    this.RescedulePDFFlag = true;
  }
}
async uploadResceduleMP3(id){
  const formData: FormData = new FormData();
      formData.append("file", this.ResceduleMP3File);
      let response = await fetch('https://tutopiafilestorage.azurewebsites.net/api/Filed_Sales_Voice_Upload?code=ksFjT6O7dt0AfyWsVNq80s2ln6W4RZD7xg/gDSN8cODXcEpMaYVuKQ==&ConTyp='+this.ResceduleMP3File['type']+'&ext='+this.ResceduleMP3File['name'].split('.').pop()+'&followup_id='+id,{ 
                method: 'POST',
                body: formData // This is your file object
              });
  let responseText = await response.text();
  console.log(responseText)
  if(responseText === 'Success') {
    this.saveSpinner2 = false;
      this.SaerchFollowup(true);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Appo ID : ' + this.ResceduleObj.Appo_ID,
        detail: "Succesfully Updated."
      });      
      this.ResceduleObj = {};
      this.ResceduleDate = new Date();
      this.ResceduleFormSubmit = false;
      this.ResceduleModal = false;
      this.RescedulePDFFlag = false;
      this.ResceduleMP3File = {};
      this.ngxService.stop();
  }
};
// CONDUCTION 
onCONDUCTION(valid ,Flag){
  if(Flag && Flag === 'Enrolled') {
    this.EnrollededFormSubmiited = true;
  }
  if(Flag && Flag === 'followup') {
    this.FollowAppoNextSubmitted = true;
  }
  if(valid && this.Appo_ID) {
    const TempObj = {
      Appo_ID: this.Appo_ID,
      Sub_Status : 'CONDUCTION DONE',
  }

  const obja = {    
    "SP_String":"Tutopia_Followup_SP",
    "Report_Name_String": "ASP New Followup",
    "Json_Param_String" : JSON.stringify([TempObj])
  }
  this.GlobalAPI
      .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All').subscribe((data: any) => {
        console.log(data)
  if (data[0].Followup_ID) {
      if(Flag && Flag === 'Enrolled') {
        this.SaveEnrolled(valid);
      }
      if(Flag && Flag === 'bill'){
        this.onIntrBillAppo();
      }
      if(Flag && Flag === 'CANCEL') {
        this.onCANCELAppo2()
      }
      if(Flag && Flag === 'followup'){
        this.SaveFollowAppo(valid);
      }
  }
})
   }
}
// ENROLLED

OpenENROLLEDAppo(obj){
  this.ClearEnrolled()
  if(obj.Appo_ID) {
    this.Appo_ID = obj.Appo_ID;
    this.ObjEnrolled.Appo_ID = obj.Appo_ID; 
    this.ObjEnrolled.Lead_ID = obj.Lead_ID; 
    this.ObjEnrolled.Foot_Fall_ID = obj.Foot_Fall_ID; 
    this.ObjEnrolled.User_ID = this.$CompacctAPI.CompacctCookies.User_ID; 
    this.ObjEnrolled.Sub_Status = 'ENROLLED'; 
    this.EnrolledModalflag = true;
  }
}
ClearEnrolled(){
  this.EnrolledModalflag = false;
  this.EnrollededFormSubmiited = false;
  this.ObjEnrolled = new enroll();
}
SaveEnrolled(valid) {
    if (valid) {
      const obja = {
        "SP_String":"Tutopia_Followup_SP",
        "Report_Name_String": "ASP New Followup",
        "Json_Param_String" : JSON.stringify([this.ObjEnrolled])
      }
      this.GlobalAPI
          .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All').subscribe((data: any) => {
          if (data[0].Followup_ID) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'success',
              detail: "Succesfully Enrolled."
            });
            this.SaerchFollowup(true);
            this.ClearEnrolled();
          }
        })
    }
}

// INTREST TO BILL 
async OpenIntrBillAppo(obj) {
  this.Appo_ID = undefined;
  if(obj.Appo_ID) {
    this.Appo_ID = obj.Appo_ID; 
    this.compacctToast.clear();
    this.compacctToast.add({key: 'c5', sticky: true, severity: 'warn', summary: 'Are you sure ?', detail: 'Confirm to proceed'}); 
  }
}
onIntrBillAppo(){
  if(this.Appo_ID) {
    const TempObj = {
      Appo_ID: this.Appo_ID,
      Sub_Status : 'INTERESTED TO BILL',
  }

  const obja = {
    "SP_String":"Tutopia_Followup_SP",
    "Report_Name_String": "ASP New Followup",
    "Json_Param_String" : JSON.stringify([TempObj])
  }
  this.GlobalAPI
      .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All').subscribe((data: any) => {
  if (data[0].Followup_ID) {
      this.SaerchFollowup(true);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Appo ID : ' + this.Appo_ID,
        detail: "Succesfully Updated."
      });
      this.Appo_ID = undefined;
      this.Reject_Reason = undefined;
  }
})
   }
}
onCloseIntrBillAppo(){
  this.compacctToast.clear('c5'); 
  this.Appo_ID = undefined;
}

// followup
OpenFollowAppo(obj) {
  this.Appo_ID = undefined;
  this.FollowAppoModal = false;
  this.FollowAppoNextDate = new Date();
  this.FollowAppoNextSubmitted = false;
  if(obj.Appo_ID){
    this.Appo_ID = obj.Appo_ID;
    this.FollowAppoModal = true;

  }

}
SaveFollowAppo(valid) {
   this.FollowAppoNextSubmitted = true;
    if (valid) {
      const Appo_Date = this.DateService.dateConvert(new Date(this.FollowAppoNextDate));
      const TempObj = {
      Appo_ID: this.Appo_ID,
      Sub_Status : 'FOLLOWUP',
      ASP_Follwup_Next_Date  : Appo_Date
  }
      const obja = {
        "SP_String":"Tutopia_Followup_SP",
        "Report_Name_String": "ASP New Followup",
        "Json_Param_String" : JSON.stringify([TempObj])
      }
      this.GlobalAPI
          .CommonPostData(obja,'Tutopia_Call_Common_SP_For_All').subscribe((data: any) => {
          if (data[0].Followup_ID) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'success',
              detail: "Succesfully Forwarded."
            });
            this.SaerchFollowup(true);
            this.Appo_ID = undefined;
            this.FollowAppoModal = false;
            this.FollowAppoNextDate = new Date();
            this.FollowAppoNextSubmitted = false;
          }
        })
    }
}



}
class Search {
  User_ID: any;
  Current_Action: String;
}
class Followup {
  Appo_ID:String;
Foot_Fall_ID: String;
Lead_ID: String;
Contact_Name:string;
User_ID: String;
Current_Action: String;
Followup_Details: String;
Followup_Action: String;
Status: String;
Sent_To: String;
Next_Followup: String;
Fathers_Occupation: String;
Pin: String;
School: String;
frd_viewd: String;
Request_Type_id:String;
Request_Type:String;
Call_Req:string;
}
class Studetail{
  Foot_Fall_ID : number;
  Contact_Name : string;
  Class_Name : string;
  Mobile : string;
  Pin : string;
  City : string;

}
class ForwardFieldSales{
  Member_ID :string;
  Intro_Member_ID:string;
  Appo_Time_Slot_ID:string;
  Appo_ID:String;
  Appo_Date:String;
  Appo_To_User_ID:String;
}
class AppoConfm{
  Appo_ID:any;
  Journey_Time:any;
}
class enroll{
  Product_ID:string;
  Registered_No:string;
  Coupon_Code:string;
  Appo_ID:string;
  Lead_ID:String;
  Foot_Fall_ID :String;
  User_ID:string;
  Sub_Status:String;
}