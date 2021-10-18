import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as moment from "moment";
declare var $: any;
@Component({
  selector: 'app-tuto-lead-followup',
  templateUrl: './tuto-lead-followup.component.html',
  styleUrls: ['./tuto-lead-followup.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoLeadFollowupComponent implements OnInit {
  url = window["config"];
  leadFollowUpList = [];
  leadFollowUpListBackup = [];
  seachSpinner = false;
  SearchFormSubmitted = false;
  LeadTransferModalBtn = false;
  SelectAllLead = false;

  ObjSearch = new Search();
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

  PinList = [];
  CityList = [];
  Class_NameList = [];
  ViewedList = [];
  DealerList = [];

  SelectedDealerFilterList = [];
  SelectedCurrentActFilterList =[];
  SelectedViewdFilterList = [];
  SelectedClassFilterList = [];
  SelectedCityFilterList = [];
  SelectedPinFilterList = [];

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
  SupportTicketDumplist = [];
  SupportQuestionDumplist = [];

  
  NextFollowupFilter: any;
  NextFollowupFilterSelected: any;

  CallDetailsModalFlag = false;
  CallDetailsObj: any = {};
  constructor(  private Header: CompacctHeader,
    private $http : HttpClient,
    private router : Router,
    private route: ActivatedRoute,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { 
      this.route.queryParams.subscribe(params => {
        console.log(params);
        if(params.User && params.Action) {
          this.ObjSearch.Current_Action = window.atob(params.Action);
          this.ObjSearch.User_ID = Number(window.atob(params.User));
          console.log(window.atob(params.User))
          this.SaerchFollowup(true);
        }
       })
    }

  ngOnInit() {
    console.log('working')
    this.Header.pushHeader({
      Header: "Followup Management",
      Link: "CRM -> Followup Management"
    });
    this.items = ["Student Detail","Followup Details", "Billing Details","Order Details ","Support Question Dump","Support Ticket Dump"];
    // this.GetUserList();
    this.GetActionList();
   // this.GetSalesUserList();
    this.GetAllUserList();
    this.GetActionListFollowupCreate();
  }
  GetUserList() {
     this.$http
        .get('/BL_CRM_Master_SalesTeam/Get_Sales_Man_with_below_members')
        .subscribe((data: any) => {
            this.UserList = data.length ? data : [];
         this.ObjSearch.User_ID =  this.ObjSearch.User_ID ? this.ObjSearch.User_ID : this.$CompacctAPI.CompacctCookies.User_ID;
        });
  }
  GetActionList() {
    const obj = {
      "SP_String": "SP_Controller",
      "Report_Name_String": "GET_Action_Type_Sales_Search"
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
      });
  }
  GetActionListFollowupCreate() {
    const obj = {
      "SP_String": "SP_Controller",
      "Report_Name_String": "GET_Action_Type"
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
    const FilterTypeArr = ['Pin','City','Class_Name','Viewed','Dealer'];
    for(let i =0; i < FilterTypeArr.length;i++) {
      const obj = {
        "Report_Name": "Browse Student Follow-up v2 Filter",
        "Json_Param_String" : JSON.stringify([{...this.ObjSearch,...{'Filter_Type' :  FilterTypeArr[i]}}])
      }
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      this.$http
          .post("/Common/Create_Common_task_Tutopia_Call?Report_Name=Browse Student Follow-up v2 Filter",obj)
          .subscribe((res: any) => {
            const data = res ? JSON.parse(res) : [];
            this[FilterTypeArr[i]+'List'] = data.length ? data.map((item) => {
              return {label: item[Object.keys(item)[0]], value : item[Object.keys(item)[0]]}
            }) : [];
      });
    }
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
    let CityFilter = [];
    let ClassFilter = [];
    let ViewedFilter = [];
    let DealerFilter = [];
    let CurrentActFilter = [];

    if (this.SelectedPinFilterList.length) {
      searchFields.push('Pin');
      PinFilter = this.SelectedPinFilterList;
    }
    if (this.SelectedCityFilterList.length) {
      searchFields.push('City');
      CityFilter = this.SelectedCityFilterList;
    }
    if (this.SelectedClassFilterList.length) {
      searchFields.push('Class_Name');
      ClassFilter = this.SelectedClassFilterList;
    }
    if (this.SelectedViewdFilterList.length) {
      searchFields.push('Viewed');
      ViewedFilter = this.SelectedViewdFilterList;
    }
    if (this.SelectedDealerFilterList.length) {
      searchFields.push('Dealer');
      DealerFilter = this.SelectedDealerFilterList;
    }
    if(this.SelectedCurrentActFilterList.length) {
      searchFields.push('Current_Action');
      CurrentActFilter = this.SelectedCurrentActFilterList;
    }
    if(this.NextFollowupFilterSelected){
      searchFields.push('Next_Followup');
    }
    const ctrl = this;
    this.leadFollowUpList = [];
    if (searchFields.length) {
      const LeadArr = this.leadFollowUpListBackup.filter(function (e) {
        return ((PinFilter.length ? PinFilter.includes(e['Pin']) : true)
          && (CityFilter.length ? CityFilter.includes(e['City']) : true)
          && (ClassFilter.length ? ClassFilter.includes(e['Class_Name']) : true)
          && (ViewedFilter.length ? ViewedFilter.includes(e['Viewed']) : true)
          && (DealerFilter.length ? DealerFilter.includes(e['Dealer']) : true)
          && (CurrentActFilter.length ? CurrentActFilter.includes(e['Current_Action']) : true)
          && (ctrl.NextFollowupFilterSelected ? ctrl.NextFollowupFilterSelected.toDateString() == new Date(e['Next_Followup']).toDateString() : true)
        );
      });
      this.leadFollowUpList = LeadArr.length ? LeadArr : [];
    } else {
      this.leadFollowUpList = this.leadFollowUpListBackup;
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
      const obj = {
        "Json_Param_String" : JSON.stringify([this.ObjSearch])
      }
      this.GetFilteredItems();
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      this.$http
          .post("/Common/Create_Common_task_Tutopia_Call?Report_Name=Browse Student Follow-up v2",obj)
          .subscribe((data: any) => {
            const SortData = data ? JSON.parse(data) : [];
            SortData.sort(function(a:any,b:any){
              return new Date(b.Next_Followup).valueOf() - new Date(a.Next_Followup).valueOf();
            });
            this.leadFollowUpList = [...SortData];
            this.leadFollowUpListBackup = [...SortData];
            this.leadFollowUpList.forEach(function (element) {
              element.Selected = false;
            });
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
 // MOBILE CALL 
  CallTutopiaApp (obj) {
    if(obj.Mobile) {
      const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

      this.$http.post("/Tutopia_Web_Demo_Followup/Call_Check_Message?Phone_No="+obj.Mobile+"&User_ID="+this.$CompacctAPI.CompacctCookies.User_ID,{},{ headers, responseType: 'text'}).subscribe((res: any) => {
        console.log(res)
       if(res.toUpperCase().includes('ERROR')) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "error",
            detail: "Error Occured In Tutopia Call API."
          });
       } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: obj.Mobile,
          detail: "Check the call in Call center software."
        });

       }
      });
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
    if (obj.Lead_ID) {
      this.objFollowupDetails = obj;
      this.objFollowUpCreation.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.objFollowUpCreation.Lead_ID = obj.Lead_ID;
      this.objFollowUpCreation.School = obj.School;
      this.objFollowUpCreation.Pin = obj.Pin;
      this.objFollowUpCreation.Current_Action = 'Tele Call';
      this.objFollowUpCreation.Followup_Action = 'Tele Call';
      this.TutopiaDemoActionFlag = false;
      this.GetFollowupDetails(obj.Lead_ID);
      this.FollowupModal = true;
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
        Mobile : window.btoa(obj.Mobile)
      },
    };
    this.router.navigate(['./Tutopia_Direct_Order_Booking'], navigationExtras);
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
    if(obj.Lead_ID){
      this.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.Lead_ID = obj.Lead_ID;
      this.GetStudentdetails();
      this.GetFollowupList();
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
  // GET CALL DETAILS 
  GetCallDetails (objSub) {
    this.CallDetailsObj = {};
    if(objSub.Call_ID){
      this.$http.post("/Tutopia_CRM_Lead/Call_Audio_Check?Call_ID="+ objSub.Call_ID,{}).subscribe((res: any) => {
        console.log(res);
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
  GetStudentdetails(){
    this.Studentdetails = undefined;
    const tempObj = {
      Lead_ID: this.Lead_ID
    };

    const obj = {
      "Json_Param_String" : JSON.stringify([tempObj])
    }
    this.GlobalAPI.CommonPostData(obj,'Create_Common_task_Tutopia_Call?Report_Name=Get_Student_Details').subscribe((data:any)=>{
      this.Studentdetails = data ? data[0] : [];

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
            "Report_Name_String": "Save Followup Tutopia",
            "Json_1_String": JSON.stringify([this.objFollowUpCreation])
          }
          this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All?Report_Name=Save Followup Tutopia').subscribe((data) => {
              if (data[0].Column1) {
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
            else {
                this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "error",
                detail: "Error Occured"
              });
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
            this.SaerchFollowup(true);
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
}
class Search {
  User_ID: any;
  Current_Action: String;
}
class Followup {
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
