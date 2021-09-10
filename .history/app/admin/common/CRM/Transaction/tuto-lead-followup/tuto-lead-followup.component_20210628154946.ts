import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { NavigationExtras, Router } from '@angular/router';
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
  SelectedViewdFilterList = [];
  SelectedClassFilterList = [];
  SelectedCityFilterList = [];
  SelectedPinFilterList = [];

  ShowDetailsModal = false;
  Foot_Fall_ID = undefined;
  Orderdetaillist = [];
  Billingdetaillist = [];
  FollowupList = [];
  Studentdetails:any;
  ObjStudetail = new Studetail();
  items = [];
  tabIndexToView = 0;
  SupportTicketDumplist = [];
  SupportQuestionDumplist = [];

  constructor(  private Header: CompacctHeader,
    private $http : HttpClient,
    private router : Router,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

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
  }
  GetUserList() {
     this.$http
        .get('/BL_CRM_Master_SalesTeam/Get_Sales_Man_with_below_members')
        .subscribe((data: any) => {
            this.UserList = data.length ? data : [];
         this.ObjSearch.User_ID =  this.$CompacctAPI.CompacctCookies.User_ID;
        });
  }
  GetActionList() {
    this.$http
      .get(this.url.apiGetActionTaken)
      .subscribe((data: any) => {
        const tempActionTaken = $.grep(data, function (value) { return value.Request_Type !== "Visit Customer" && value.Request_Type !== "Direct Appointment"; });
        this.ActionList = tempActionTaken;
        this.nextActionLists = tempActionTaken;
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
          this.AllUserList = data.length ? data : [];
          this.SalesUserList = data.length ? data : [];
          this.UserList = data.length ? data : [];
          this.ObjSearch.User_ID =  this.$CompacctAPI.CompacctCookies.User_ID;
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
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            this[FilterTypeArr[i]+'List'] = data.length ? data.map((item) => {
              return {label: item[Object.keys(item)[0]], value : item[Object.keys(item)[0]]}
            }) : [];
      });
    }
  }
  GlobalFilterChange () {
    let searchFields = [];
    let PinFilter = [];
    let CityFilter = [];
    let ClassFilter = [];
    let ViewedFilter = [];
    let DealerFilter = [];

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

    this.leadFollowUpList = [];
    if (searchFields.length) {
      const LeadArr = this.leadFollowUpListBackup.filter(function (e) {
        return ((PinFilter.length ? PinFilter.includes(e['Pin']) : true)
          && (CityFilter.length ? CityFilter.includes(e['City']) : true)
          && (ClassFilter.length ? ClassFilter.includes(e['Class_Name']) : true)
          && (ViewedFilter.length ? ViewedFilter.includes(e['Viewed']) : true)
          && (DealerFilter.length ? DealerFilter.includes(e['Dealer']) : true)
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
      const obj = {
        "Json_Param_String" : JSON.stringify([this.ObjSearch])
      }
      this.GetFilteredItems();
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      this.$http
          .post("/Common/Create_Common_task?Report_Name=Browse Student Follow-up v2",obj)
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
    }

  }
  getMyPagination(e) {
    this.PaginationObj = e;
    console.log(this.PaginationObj);
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
    if (obj.Foot_Fall_ID) {
      this.objFollowupDetails = obj;
      this.objFollowUpCreation.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.objFollowUpCreation.School = obj.School;
      this.objFollowUpCreation.Pin = obj.Pin;
      this.objFollowUpCreation.Current_Action = 'Tele Call';
      this.objFollowUpCreation.Followup_Action = 'Tele Call';
      this.TutopiaDemoActionFlag = false;
      this.GetFollowupDetails(obj.Foot_Fall_ID);
      this.FollowupModal = true;
    }

  }
  GetFollowupDetails(footFallID) {
    const ctrl = this;
          const distinctDateArrayTemp = [];
          const obj = {
            "SP_String": "Tutopia_Followup_SP",
            "Report_Name_String": "Browse Followup Tutopia",
            "Json_1_String": '[{"Foot_Fall_ID":' + footFallID+'}]'
          }
          this.GlobalAPI.postData(obj).subscribe(function (data) {
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
    this.Studentdetails = undefined;
    this.Orderdetaillist = [];
    this.FollowupList = [];
    this.Billingdetaillist = [];
    if(obj.Foot_Fall_ID){
      this.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.GetStudentdetails();
      this.GetBillingdetaillist();
      this.GetOrderdetaillist();
      this.GetFollowupList();
      this.GetSupportQuestionDumplist();
      this.GetSupportTicketDumplist();
      setTimeout(()=>{
        this.ShowDetailsModal = true;
      },900);
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
      Foot_Fall_ID: this.Foot_Fall_ID
    };

    const obj = {
      "Report_Name" : "Get_Student_Details",
      "Json_Param_String" : JSON.stringify([tempObj])
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      this.Studentdetails = data ? data[0] : [];

     })
  }
  GetBillingdetaillist(){
    this.Billingdetaillist = [];
    const Objtemp = {
      Foot_Fall_ID : this.Foot_Fall_ID
    };
    const objj = {
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
      Foor_Fall_ID : this.Foot_Fall_ID
    };
    const objj = {
      "Report_Name" : "Get_Followup_Details_Foot_Fall_ID_Wise",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonTaskData(objj).subscribe((data:any)=>{
      this.FollowupList = data.length ? data : [];
      console.log(this.FollowupList)

     })

  }
  GetSupportQuestionDumplist(){
    this.SupportQuestionDumplist = [];
    const Objtemp = {
      Foot_Fall_ID : this.ObjStusearchForm.Foot_Fall_ID
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
      Foot_Fall_ID : this.ObjStusearchForm.Foot_Fall_ID
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
      console.log(this.objFollowUpCreation)
      const obj = {
            "SP_String": "Tutopia_Followup_SP",
            "Report_Name_String": "Save Followup Tutopia",
            "Json_1_String": JSON.stringify([this.objFollowUpCreation])
          }
          this.GlobalAPI.postData(obj).subscribe((data) => {
              if (data[0].Column1) {
                this.saveTutopiaViewStatus(this.objFollowUpCreation);
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: 'Student ID : ' + this.objFollowUpCreation.Foot_Fall_ID,
                  detail: "Succesfully Saved."
                });
                this.GetFollowupDetails(this.objFollowUpCreation.Foot_Fall_ID);
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
            User_ID:  this.$CompacctAPI.CompacctCookies.User_ID,
            Current_Action: "Tele Call",
            Followup_Details: "Forward From" + " " +  this.$CompacctAPI.CompacctCookies.User_Name,
            Followup_Action: "Tele Call",
            Status: "Forward Lead",
            Used: 'N',
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
  User_ID: String;
  Current_Action: String;
}
class Followup {
Foot_Fall_ID: String;
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
}
class Studetail{
  Foot_Fall_ID : number;
  Contact_Name : string;
  Class_Name : string;
  Mobile : string;
  Pin : string;
  City : string;

}
