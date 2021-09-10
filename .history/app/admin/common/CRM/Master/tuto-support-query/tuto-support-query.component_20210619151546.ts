import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import * as moment from "moment";
import { FileUpload } from 'primeng/primeng';
import * as XLSX from 'xlsx';
declare var $:any;
@Component({
  selector: 'app-tuto-support-query',
  templateUrl: './tuto-support-query.component.html',
  styleUrls: ['./tuto-support-query.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoSupportQueryComponent implements OnInit {
  tabIndexToView = 0;
  items = [];

  SupportQuerylist = [];
  BackUpSupportTicketList = [];
  BackUpSupportQuerylist = [];
  SAnswerUpdateModal = false;
  SAnswerUpdateSubmitted = false;
  DistStatus = [];
  DistClass = [];
  SelectedDistStatus = [];
  SelectedDistClass = [];
  ObjAnswer = new answer();
  Subject : any;
  Question : any;

  Classlist = [];
  StatusList = [];
  SubDeptList = [];
  UserWithSubDeptList = [];
  SourceList = [];
  ObjSearchContactMgs = new SearchContactMgs();
  ContactSearchStatusList = [];
  ContactSearchUserList = [];
  ObjFolowup = new Followup();
  ObjSearch = new Search();
  NextFollowupDate = new Date();
  NextFollowupDateData: any;
  QuerySearchFormSubmitted = false;
  ResolvedQueryList = [];
  seachSpinner1 = false;
  seachSpinner = false;
  SubDepartmentModel = undefined;
  ForwardModalFlag = false;
  ForwardModalFormSubmited = false;
  ForwardModalTitle = '';

  TicketModalFlag = false;
  SourceModel = undefined;
  TicketModalFormSubmited = false;

  ReplyModalFlag = false;
  ReplyStatusModel = undefined;
  ReplyModalFormSubmited = false;

  InformModalFlag = false;
  InformModalFormSubmited = false;
  // CRATE TICKET
  seachSpinnersave = false;
  PrevTicketList = [];
  PrevTicketListBackup = [];
  PrevPendingTicketList = [];
  PrevTicketModal = false;
  SalesDetailsList  = [];
  ObjTicket = new Ticket ();
  CreateTicketFormSubmitted = false;
  UnIdentifyStudent = false;
  ClassList = [];
  SupportCatList = [];
  SupportStatusList = [];
  AndroidVerList = [];
  FmcList = [];
  EnqSrcList = [];
  // BROWSE TICKET
  SearchTicketFormSubmitted = false;
  DateRangeChanger = '';
  DefaultEnableChanger = '';
  ObjSearchTicket = new SearchTicket();
  AssignedToList = [];
  SupportTicketList = [];
  //
  TicketWithContactID = false;
  followUpLists = [];
  distinctDateArray =[];
  UpdateStatusModalFlag = false;
  UpdateStatusFormSubmit = false;
  ObjUpdateStatus:any = {};
  MultipleFile:any[] = [];
  TicketDetailsModalFlag = false;
  // forward ticket
  AssignToModal = false;
  AssignToBtnFlag = false;
  AssignToFormSubmit = false;
  AssignToObj = {};
  SelectAllFlag = false;
  // forward tik contact
  AssignToCntMgsBtnFlag = false;
  AssignToCntMgsModal = false;
  // prv ticket aggsin filter
  DistAssignTo = [];
  searchFields = [];
  SelectedDistAssignTo =[];
  // ticket aggsin filter
  DistAssignTo2 = [];
  searchFields2 = [];
  SelectedDistAssignTo2 =[];
  // contact aggsin filter
  DistAssignTo3 = [];
  searchFields3 = [];
  SelectedDistAssignTo3 =[];
  @ViewChild("fileInput", { static: false }) fileUpload: FileUpload;
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Support Query & Reply",
      Link: "Support ->  Support Query & Reply"
    });
    this.items = ["BROWSE TICKET","CREATE MANUAL TICKET","CONTACT MESSAGE"];
    this.Getquerylist(true);
    this.getClasslist();
    this.GetStatuslist();
    this.GetSubDeptList();
    this.GetSourceList();
    this.GetClassList();
    this.GetSupportCatList();
    this.GetSupportStatusList();
    this.GetAndroidVerList();
    this.GetFmcList();
    this.GetEnqSrcList();
    this.GetAssignedToList();
    this.GetContactStatuslist();
    this.GetContactSearchAssignedToList();
  }
  TabClick(e) {
    this.ClearSupportTicket();
    this.ObjFolowup = new Followup();
    this.tabIndexToView = e.index;
   }
   getTatClass(val) {
    let className = '';
    if (val >= 6) {
      className = 'six-or-above';
      return className;
    }else if (val < 6 && val > 4) {
      className = 'four-to-six';
      return className;
    } else if  (val <= 4) {
      className = 'zero-to-four';
      return className;
    }
    return className;
  }
  // INIT
  GetClassList(){
    const obj = {
      "Report_Name": "List_Class "
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          this.ClassList = data.length ? data : [];
    });
  }
  GetSupportCatList(){
    const obj = {
      "Report_Name": "Get_Support_Category "
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          this.SupportCatList = data.length ? data : [];
    });
  }
  GetSupportStatusList(){
    const obj = {
      "Report_Name": "GET_Status"
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          this.SupportStatusList = data.length ? data : [];
          this.ObjSearchTicket.Status = '1';
          this.BrowseTikStatusChanged();
    });
  }
  GetAndroidVerList(){
    const obj = {
      "Report_Name": "GET_Android_Version "
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          this.AndroidVerList = data.length ? data : [];
    });
  }
  GetFmcList(){
    const obj = {
      "Report_Name": "GET_FMC "
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          this.FmcList = data.length ? data : [];
    });
  }
  GetEnqSrcList(){
    const obj = {
      "Report_Name": "GET_ENQ_Source "
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          this.EnqSrcList = data.length ? data : [];
    });
  }
  GetAssignedToList(){
    const obj = {
      "Report_Name": "Get_Asigned_To "
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
           const AssignedToListNative = data.length ? data : [];
          if(this.$CompacctAPI.CompacctCookies.User_Type === 'A') {
            this.AssignedToList = AssignedToListNative;
          } else {
            this.AssignedToList = AssignedToListNative.filter((item) => item.User_ID == this.$CompacctAPI.CompacctCookies.User_ID);
          }
          this.ObjSearchTicket.Asigned_To = this.$CompacctAPI.CompacctCookies.User_ID;
    });
  }
  getClasslist() {
    this.$http
      .get("Tutopia_Walk_in_Lead_Creation/Get_Class_details")
      .subscribe((data: any) => {
        this.Classlist = data ? JSON.parse(data) : [];
      });
  }
  GetStatuslist() {
    const obj = {
      "Report_Name" : "Get_Support_Ques_Followup_Status",
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      this.StatusList = data ? data : [];
      console.log(this.StatusList)
    })
  }
  GetSubDeptList() {
    const obj = {
      "Report_Name" : "Get_Support_Ques_Sub_Department",
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      this.SubDeptList = data ? data : [];
      console.log(this.SubDeptList)
    })
  }
  GetSourceList() {
    const obj = {
      "Report_Name" : "Get_Support_Ques_Source",
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      this.SourceList = data ? data : [];
      console.log(this.SourceList)
    })
  }
  GetContactStatuslist() {
    const obj = {
      "Report_Name" : "Get_Support_Query_Status_List",
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      const StatusToListNative = data.length ? data : [];
      if(this.$CompacctAPI.CompacctCookies.User_Type === 'A') {
            this.ContactSearchStatusList = StatusToListNative;
            this.ObjSearchContactMgs.Status_ID = "1";
          } else {
            this.ContactSearchStatusList = StatusToListNative.filter((item) => item.Status_ID == '2');
            this.ObjSearchContactMgs.Status_ID = "2";
          }
    })
  }
  GetContactSearchAssignedToList(){
    const obj = {
      "Report_Name": "Get_Support_Query_User_List "
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
           const AssignedToListNative = data.length ? data : [];
          if(this.$CompacctAPI.CompacctCookies.User_Type === 'A') {
            this.ContactSearchUserList = AssignedToListNative;
          } else {
            this.ContactSearchUserList = AssignedToListNative.filter((item) => item.To_User == this.$CompacctAPI.CompacctCookies.User_ID);
          }
          this.ObjSearchContactMgs.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    });
  }

  // CHANGE EVENT
  getDateRangeTickSearch(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearchTicket.From_Date = dateRangeObj[0];
      this.ObjSearchTicket.To_Date = dateRangeObj[1];
    }
    }
  GetStudentsDetails() {
    this.ObjTicket.Foot_Fall_ID = undefined;
    this.ObjTicket.Name = undefined;
    this.ObjTicket.PIN_Code = undefined;
    this.ObjTicket.Registration_Date = undefined;
    this.ObjTicket.District = undefined;
    this.ObjTicket.Class_ID = undefined;
    this.ObjTicket.Asigned_To = undefined;
    this.ObjTicket.Student_ID = undefined;
    this.ObjTicket.Paid = undefined;
    this.UnIdentifyStudent = false;
    this.TicketWithContactID = false;
    this.PrevTicketList = [];
    this.PrevTicketListBackup = [];
    this.PrevPendingTicketList = [];
    if(this.ObjTicket.Mobile_No && this.ObjTicket.Mobile_No.length === 10) {
      const obj = {
        "Report_Name": "Fetch_Student_Details ",
        "Json_Param_String" : JSON.stringify([{'Mobile_No' : this.ObjTicket.Mobile_No}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
           console.log(data);
           const ReturnObj = data.length ? data[0] : {};
           if(ReturnObj.Foot_Fall_ID) {
            this.ObjTicket.Foot_Fall_ID = ReturnObj.Foot_Fall_ID;
            this.GetPrevPendingTickets();
            this.GetSaleDetails();
            this.ObjTicket.Name = ReturnObj.Name;
            this.ObjTicket.PIN_Code = ReturnObj.PIN_Code;
            this.ObjTicket.Registration_Date = ReturnObj.Registration_Date;
            this.ObjTicket.District = ReturnObj.District;
            this.ObjTicket.Class_ID = ReturnObj.Class_ID;
            this.ObjTicket.Student_ID = ReturnObj.Student_ID;
            this.ObjTicket.Asigned_To = this.$CompacctAPI.CompacctCookies.User_ID;
            this.ObjTicket.Paid = ReturnObj.Paid === 'Y' ? 'YES' : 'NO';
            this.TicketWithContactID = true;
            if(this.ObjFolowup.Query_Question_ID) {
              this.TicketWithContactID = false;
              this.tabIndexToView = 1;
            }
           } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "warn",
              summary: "No Student Found",
              detail: "Please Enter Correct Registered Mobile No. or Enter Student Name and Class. "
            });
            this.UnIdentifyStudent = true;
            this.ObjTicket.Foot_Fall_ID = '0';
            this.ObjTicket.Name = undefined;
            this.ObjTicket.PIN_Code = undefined;
            this.ObjTicket.Registration_Date = undefined;
            this.ObjTicket.District = undefined;
            this.ObjTicket.Class_ID = undefined;
            this.ObjTicket.Asigned_To = this.$CompacctAPI.CompacctCookies.User_ID;
            this.ObjTicket.Paid = undefined;
            this.ObjTicket.Student_ID = undefined;
            this.TicketWithContactID = false;
           }
      });
    }
  }
  GetSaleDetails(){
    this.SalesDetailsList = [];
    if(this.ObjTicket.Foot_Fall_ID) {
      const obj = {
        "Report_Name": "GET_Customer_Sale_Details ",
        "Json_Param_String" : JSON.stringify([{'Foot_Fall_ID' : this.ObjTicket.Foot_Fall_ID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
           console.log(data);
           this.SalesDetailsList = data.length ? data : [];
          });
    }
  }
  GetPrevTickets(){
    this.PrevTicketList = [];
    this.DistAssignTo = [];
    this.PrevTicketListBackup = [];
    if(this.ObjTicket.Foot_Fall_ID) {
      const obj = {
        "Report_Name": "GET_Previous_Support ",
        "Json_Param_String" : JSON.stringify([{'Foot_Fall_ID' : this.ObjTicket.Foot_Fall_ID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
           console.log(data);
           this.PrevTicketList = data.length ? data : [];
           this.PrevTicketModal = this.PrevTicketList.length ? true : false;
           this.PrevTicketListBackup = data.length ? data : [];
           this.GetPrevAssignedDist();
           if(!this.PrevTicketModal) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "No Data Found"
            });
           }
          });
    }
  }
  GetPrevAssignedDist() {

    let DAssignTo= [];
    this.DistAssignTo = [];
    this.PrevTicketList.forEach((item) => {
      if (DAssignTo.indexOf(item.Assigned_To) === -1) {
          DAssignTo.push(item.Assigned_To);
          this.DistAssignTo.push({label: item.Assigned_To,value: item.Assigned_To});
      }
    });
    this.PrevTicketList = [...this.PrevTicketListBackup];
  }
  FilterPrevAssignedDist() {

    let AssignToFilter = [];
    this.searchFields = [];
    if (this.SelectedDistAssignTo.length) {
      this.searchFields.push('Assigned_To');
      AssignToFilter = this.SelectedDistAssignTo;
    }
    this.PrevTicketList = [];
    if (this.searchFields.length) {
      let LeadArr = this.PrevTicketListBackup.filter(function (e) {
        return (AssignToFilter.length ? AssignToFilter.includes(e['Assigned_To']) : true)
      });
      this.PrevTicketList = LeadArr.length ? LeadArr : [];
    } else {
      this.PrevTicketList = this.PrevTicketListBackup;
    }
  }
  GetPrevPendingTickets(){
    this.PrevPendingTicketList = [];
    if(this.ObjTicket.Foot_Fall_ID) {
      const obj = {
        "Report_Name": "GET_Previous_Support ",
        "Json_Param_String" : JSON.stringify([{'Foot_Fall_ID' : this.ObjTicket.Foot_Fall_ID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
           console.log(data);
           const tempData = data.length ? data : [];
           this.PrevPendingTicketList  = data.filter(item => item.Status == 'PENDING');
           this.PrevPendingTicketList.forEach(function(item){
            item.From_Create = true;
           });
          });
    }
  }
  BrowseTikStatusChanged() {
    if(this.ObjSearchTicket.Status) {
      this.DateRangeChanger = this.ObjSearchTicket.Status == '1' ? 'TutopiaPendigTick' : 'weekwise';
      if(this.$CompacctAPI.CompacctCookies.User_Type === 'U') {
        const tempObj = this.SupportStatusList.filter(e => e.Support_Status_ID == this.ObjSearchTicket.Status)[0];
        this.DefaultEnableChanger = this.ObjSearchTicket.Status == '2' && tempObj.Is_Closed !== 'Y' ? '' : 'true';
      }
      if(this.$CompacctAPI.CompacctCookies.User_Type === 'A') {
        this.DefaultEnableChanger = '';

      }
    }
  }
  getNxtFollowupDate(FollowupDate) {
    this.NextFollowupDateData = undefined;
    if (FollowupDate) {
      this.NextFollowupDateData = this.DateService.dateConvert( moment(FollowupDate, "YYYY-MM-DD")["_d"] );
    }

  }
  getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjSearch.Start_Date = dateRangeObj[0];
    this.ObjSearch.End_Date = dateRangeObj[1];
  }
  }
  GetUserWithSubDeptList() {
    if(this.SubDepartmentModel) {
      const obj = {
        "Report_Name" : "Get_User_With_Sub_Department",
        "Json_Param_String" : JSON.stringify([{'Sub_Dept_ID' : this.SubDepartmentModel }])
      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        this.UserWithSubDeptList = data ? data : [];
        console.log(this.UserWithSubDeptList)
      })
    }

  }
  GetReply(){
    if(this.ObjFolowup.Query_Question_ID) {
      const obj = {
        "Report_Name" : "Get_Support_Ques_Reply",
        "Json_Param_String" : JSON.stringify([{'Query_Question_ID' : this.ObjFolowup.Query_Question_ID }])
      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        this.ObjFolowup.Followup_Remarks = data.length ? data[0].Reply : '';
        console.log(this.ObjFolowup.Followup_Remarks)
      })
    }
  }
  ReplyStatusModelChange() {
    this.SubDepartmentModel = undefined;
    this.ObjFolowup.To_User = undefined;
  }
  GlobalFilterChangenUpdate() {
    let ClassFilter = [];
    let SatusFilter = [];
    if (this.SelectedDistClass.length) {
      ClassFilter = this.SelectedDistClass;
    }
    if (this.SelectedDistStatus.length) {
      SatusFilter = this.SelectedDistStatus;
    }
     this.SupportQuerylist = [];
    if (ClassFilter.length || SatusFilter.length) {
      let LeadArr = this.BackUpSupportQuerylist.filter(function (e) {
        return ((ClassFilter.length ? ClassFilter.includes(e['Class_ID']) : true)
          && (SatusFilter.length ? SatusFilter.includes(e['Status_ID']) : true)
        );
      });
      this.SupportQuerylist = LeadArr.length ? LeadArr : [];
    } else {
      this.SupportQuerylist = this.BackUpSupportQuerylist;
    }
  }
  // GLOBAL FORWARD CONTACT
  ForwardModalGlobal(obj,StatusID) {
    this.ClearDataForModal();
    this.ObjFolowup.From_User = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjFolowup.Status_ID = '2';
    this.ForwardModalTitle = 'ASSIGN';
    this.AssignToCntMgsModal = true;
  }
  GlobalAssignToFlag2() {
    this.AssignToCntMgsBtnFlag = this.SupportQuerylist.some((item) =>  item['Select_Flag']);
  }
  SelectAll2() {
    if (this.SelectAllFlag) {
      this.SupportQuerylist.forEach((item) => {
        item['Select_Flag'] = true;
      });
      this.GlobalAssignToFlag2();
    } else {
      this.SupportQuerylist.forEach((item) => {
        item['Select_Flag'] = false;
      });
      this.GlobalAssignToFlag2();
    }
  }
  SaveGlobalAssignCntMgs(valid) {
    this.ForwardModalFormSubmited = true;
    if(valid){
      let arrTemp = [];
      this.SupportQuerylist.forEach((item) => {
        if (item['Select_Flag']) {
          arrTemp.push({Query_Question_ID : item['Query_Question_ID'] });
        }
      });
      if(arrTemp.length) {
        const obj = {
          "Report_Name" : "Update_Support_Ques_Assign_Popup",
          "Json_Param_String" : JSON.stringify(arrTemp)
        }
        this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
          console.log(data);
          if(data[0].Remarks === 'success') {
            this.SaveCommonFollowup2();
          } else{
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
  SaveCommonFollowup2(){
    const DataObj = this.GetAssignToJSON2();
    const obj = {
      "Report_Name" : "Support_Ques_Followup",
      "Json_Param_String" : DataObj
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      console.log(data);
      if(data[0].Column1) {
          this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Question ID : " + this.ObjFolowup.Query_Question_ID,
          detail:  "Succesfully Updated"
        });
        this.Getquerylist(true);
        this.ClearDataForModal();
        this.AssignToCntMgsModal = false;
      } else{
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
  GetAssignToJSON2() {
      let arrTemp = [];
      this.SupportQuerylist.forEach((item) => {
        if (item['Select_Flag']) {
          arrTemp.push({
            Query_Question_ID: item['Query_Question_ID'],
            To_User: this.ObjFolowup.To_User,
            From_User: this.$CompacctAPI.CompacctCookies.User_ID,
            Followup_Remarks: this.ObjFolowup.Followup_Remarks,
            Status_ID:"2"
        });
        }
      });
      console.log(arrTemp)
      return JSON.stringify(arrTemp);
  }
  // MODAL
  ClearDataForModal(){
    this.ObjFolowup = new Followup();
    this.SubDepartmentModel = undefined;
    this.ForwardModalFlag = false;
    this.ForwardModalFormSubmited = false;
    this.ForwardModalTitle = '';

    this.TicketModalFlag = false;
    this.SourceModel = undefined;
    this.TicketModalFormSubmited = false;

    this.ReplyModalFlag = false;
    this.ReplyStatusModel = undefined;
    this.ReplyModalFormSubmited = false;

    this.InformModalFlag = false;
    this.InformModalFormSubmited = false;

    this.UserWithSubDeptList = [];
  }

  TicketModal(obj) {
    this.ClearDataForModal();
    if(obj.Query_Question_ID) {
      this.ObjFolowup.Query_Question_ID = obj.Query_Question_ID;
      this.ObjFolowup.From_User = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjFolowup.To_User = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjFolowup.Status_ID = "3";
      this.ObjTicket.Contact_ID = obj.Query_Question_ID;
      this.ObjTicket.Mobile_No = obj.Mobile;
      this.ObjTicket.Short_Description = obj.Question;
      this.ObjFolowup.Followup_Remarks = 'Support Ticket Created';
      this.GetStudentsDetails();
      // this.TicketModalFlag = true;
    }
  }
  ForwardModal(obj,StatusID) {
    this.ClearDataForModal();
    if(obj.Query_Question_ID) {
      this.ObjFolowup.Query_Question_ID = obj.Query_Question_ID;
      this.ObjFolowup.From_User = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjFolowup.Status_ID = StatusID;
      this.ForwardModalTitle = StatusID === '2' ? 'ASSIGN' : 'FORWARD';
      this.ForwardModalFlag = true;
    }
  }
  ReplyModal(obj) {
    this.ClearDataForModal();
    if(obj.Query_Question_ID) {
      this.ObjFolowup.Query_Question_ID = obj.Query_Question_ID;
      this.ObjFolowup.From_User = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ReplyModalFlag = true;
    }
  }
  InformModal(obj) {
    this.ClearDataForModal();
    if(obj.Query_Question_ID) {
      this.ObjFolowup.Query_Question_ID = obj.Query_Question_ID;
      this.ObjFolowup.From_User = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjFolowup.To_User = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjFolowup.Status_ID = "7";
      this.GetReply();
      this.InformModalFlag = true;
    }
  }
  ShowTicketDetails(obj) {
    this.ObjUpdateStatus = {};
    this.followUpLists = [];
    this.distinctDateArray =[];
    if(obj.Support_ID) {
      this.ObjUpdateStatus = obj;
      this.ObjUpdateStatus.Paid = obj.Paid === 'Y' ? 'YES' : 'NO';
      this.GetTicketFollowupDetails(this.ObjUpdateStatus.Support_ID,'TicketDetailsModalFlag');
    }
  }

  // COMMON FOLLOWUP
  SaveForwarCommon(valid){
    this.ForwardModalFormSubmited = true;
    if(valid){
      const reportName = this.ObjFolowup.Status_ID === '2' ? 'Update_Support_Ques_Assign_Popup' :  this.ObjFolowup.Status_ID === '5' ? 'Update_Support_Ques_Foroward_Popup' : undefined;
      if(reportName) {
        const obj = {
          "Report_Name" : reportName,
          "Json_Param_String" : JSON.stringify([{'Query_Question_ID' : this.ObjFolowup.Query_Question_ID}])
        }
        this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
          console.log(data);
          if(data[0].Remarks === 'success') {
            this.SaveCommonFollowup();
          } else{
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        })
      } else {
        this.SaveCommonFollowup();
      }
    }
  }
  SaveTicket(valid) {
    this.TicketModalFormSubmited = true;
    if(valid) {
      const obj = {
        "Report_Name" : "Update_Support_Ques_Create_Ticket_Popup",
        "Json_Param_String" : JSON.stringify([{'Query_Question_ID' : this.ObjFolowup.Query_Question_ID,'Source':this.ObjTicket.ENQ_Source_ID}])
      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Remarks === 'success') {
          this.SaveCommonFollowup();
        } else{
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
  SaveReply(valid) {
    this.ReplyModalFormSubmited = true;
    if(valid) {
      const reportName = this.ReplyStatusModel === 6 ? 'Update_Support_Ques_Reply_Done_Pending_Popup' :  this.ReplyStatusModel === 7 ? 'Update_Support_Ques_RESOLVED_INFORMED_TO_STUDENT_Popup' : undefined;
      if(reportName) {
        this.ObjFolowup.Status_ID = String(this.ReplyStatusModel);
        this.ObjFolowup.To_User =  this.ObjFolowup.Status_ID === '7' ? this.$CompacctAPI.CompacctCookies.User_ID : this.ObjFolowup.To_User;
        const obj = {
          "Report_Name" : "Update_Support_Ques_Reply_Done_Pending_Popup",
          "Json_Param_String" : JSON.stringify([{'Query_Question_ID' : this.ObjFolowup.Query_Question_ID,'Reply':this.ObjFolowup.Followup_Remarks}])
        }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Remarks === 'success') {
          this.SaveCommonFollowup();
        } else{
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
  SaveInform(valid) {
    this.InformModalFormSubmited = true;
    if(valid) {
      const obj = {
        "Report_Name" : "Update_Support_Ques_RESOLVED_INFORMED_TO_STUDENT_Popup",
        "Json_Param_String" : JSON.stringify([{'Query_Question_ID' : this.ObjFolowup.Query_Question_ID,'Reply':this.ObjFolowup.Followup_Remarks}])
      }
      this.ObjFolowup.Status_ID = '7';
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Remarks === 'success') {
          this.SaveCommonFollowup();
        } else{
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
  SaveCommonFollowup(){
      const obj = {
        "Report_Name" : "Support_Ques_Followup",
        "Json_Param_String" : JSON.stringify([this.ObjFolowup])
      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1) {
          if(this.ObjTicket.Foot_Fall_ID) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Ticket",
              detail:  "Succesfully Created"
            });
            this.ClearSupportTicket();
            this.Getquerylist(true);
            this.ClearDataForModal();
          }else {
            this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Question ID : " + this.ObjFolowup.Query_Question_ID,
            detail:  "Succesfully Updated"
          });
          this.Getquerylist(true);
          this.ClearDataForModal();
          }
        } else{
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

  //
  getDateRange2(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearchContactMgs.start_date = dateRangeObj[0];
      this.ObjSearchContactMgs.end_date = dateRangeObj[1];
    }
  }
  Getquerylist(valid){
    this.SupportQuerylist = [];
    this.DistStatus = [];
    this.DistClass = [];
    this.SelectedDistStatus = [];
    this.SelectedDistClass = [];
    this.DistAssignTo3 = [];
    this.SelectedDistAssignTo3 = [];
    this.QuerySearchFormSubmitted = true;
    if (valid) {
      this.seachSpinner = true;
      this.AssignToCntMgsBtnFlag = false;
      const start = this.ObjSearchContactMgs.start_date
          ? this.DateService.dateConvert(new Date(this.ObjSearchContactMgs.start_date))
          : this.DateService.dateConvert(new Date());
        const end = this.ObjSearchContactMgs.end_date
          ? this.DateService.dateConvert(new Date(this.ObjSearchContactMgs.end_date))
          : this.DateService.dateConvert(new Date());
          const tempObj = {
            start_date : start,
            end_date : end,
            Status_ID : this.ObjSearchContactMgs.Status_ID,
            User_ID : this.ObjSearchContactMgs.User_ID ? this.ObjSearchContactMgs.User_ID : '0'
          }
      const obj = {
        "Report_Name": "Support_Query_Browse",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data: any) => {
        this.SupportQuerylist = data ? data : [];
        this.SupportQuerylist.forEach((item) => {
          item['Select_Flag'] = false;
        });
        this.QuerySearchFormSubmitted = false;
        this.GetDistinct();
        console.log(this.SupportQuerylist)
      });
    }

  }
  GetDistinct() {
    let DStatus = [];
    let DClass = [];
    let DAssign = [];
    this.DistStatus = [];
    this.DistClass = [];
    this.DistAssignTo3 = [];
    this.SelectedDistAssignTo3 = [];
    this.SelectedDistStatus = [];
    this.SelectedDistClass = [];
    this.SupportQuerylist.forEach((item) => {
      if (DStatus.indexOf(item.Status_Name) === -1) {
        DStatus.push(item.Status_Name);
        this.DistStatus.push({ label: item.Status_Name, value: item.Status_ID });
      }
      if (DAssign.indexOf(item.Asigned_To) === -1) {
        DAssign.push(item.Asigned_To);
        this.DistAssignTo3.push({ label: item.Asigned_To_Name, value: item.Asigned_To });
      }
      if (DClass.indexOf(item.Class_Name) === -1) {
        DClass.push(item.Class_Name);
        this.DistClass.push({ label: item.Class_Name, value: item.Class_ID });
      }
    });
    this.BackUpSupportQuerylist = [...this.SupportQuerylist];
    this.seachSpinner = false;
  }
  FilterCntctMgsAssignedDist() {

    let AssignToFilter = [];
    this.searchFields3 = [];
    if (this.SelectedDistAssignTo3.length) {
      this.searchFields3.push('Asigned_To');
      AssignToFilter = this.SelectedDistAssignTo3;
    }
    this.SupportQuerylist = [];
    if (this.searchFields2.length) {
      let LeadArr = this.BackUpSupportQuerylist.filter(function (e) {
        return (AssignToFilter.length ? AssignToFilter.includes(e['Asigned_To']) : true)
      });
      this.SupportQuerylist = LeadArr.length ? LeadArr : [];
    } else {
      this.SupportQuerylist = this.BackUpSupportQuerylist;
    }
  }
  GetResolvedQueryList(){
    this.ResolvedQueryList = [];
    this.seachSpinner1 = true;
    const start = this.ObjSearch.Start_Date
        ? this.DateService.dateConvert(new Date(this.ObjSearch.Start_Date))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjSearch.End_Date
        ? this.DateService.dateConvert(new Date(this.ObjSearch.End_Date))
        : this.DateService.dateConvert(new Date());
    const Tempobj = {
      start_date: start,
      end_date : end
    };

    const obj = {
      "Report_Name" : "Support_Query_Browse_Resolved",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      this.ResolvedQueryList = data ? data : [];
      this.seachSpinner1 = false;
    })
  }

  Reply(obj){
    this.ObjAnswer = new answer();
    this.Subject = undefined;
    this.Question = undefined;
    this.SAnswerUpdateSubmitted = false;
    if(obj.Query_Question_ID) {
      this.Subject = obj.Subject;
      this.Question = obj.Question;
      this.ObjAnswer.Query_Question_ID = obj.Query_Question_ID;
      this.SAnswerUpdateModal = true;
    }
  }
  // TICKET FORWARD
  GlobalAssignToFlag() {
    this.AssignToBtnFlag = this.SupportTicketList.some((item) =>  item['Select_Flag']);
  }
  SelectAll() {
    if (this.SelectAllFlag) {
      this.SupportTicketList.forEach((item) => {
        item['Select_Flag'] = true;
      });
      this.GlobalAssignToFlag();
    } else {
      this.SupportTicketList.forEach((item) => {
        item['Select_Flag'] = false;
      });
      this.GlobalAssignToFlag();
    }
  }
  //  SAVE ASSIGN TO
  GlobalAssign() {
    this.AssignToObj = {};
    this.AssignToFormSubmit = false;
    this.AssignToObj['User_ID'] = undefined;
    this.AssignToModal = true;
  }
  SaveAssignTo(valid) {
    this.AssignToFormSubmit = true;
    if (valid) {
      const obj = {
        "Report_Name" : "Forward Ticket",
        "Json_Param_String" : this.GetAssignToJSON()
      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        if(data[0].Remarks === 'success') {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "USER ID : " + this.AssignToObj['User_ID'],
            detail:  "Succesfully Assigned."
          });
          this.GetSupportTicketList(true);
          this.AssignToObj = {};
          this.AssignToFormSubmit = false;
          this.AssignToModal = false;
        } else{
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
  GetAssignToJSON() {
    let arrTemp = [];
    const assignToName = this.AssignedToList.filter(e => e.User_ID == this.AssignToObj['User_ID'])[0].Column1;
    this.SupportTicketList.forEach((item) => {
      if (item['Select_Flag']) {
        arrTemp.push({
          Support_ID : item['Support_ID'],
          Asigned_To: this.AssignToObj['User_ID'],
          Support_Status_ID  : item['Support_Status_ID'],
          Remarks  : "Assigned to " +  assignToName
      });
      }
    });
    return JSON.stringify(arrTemp);
  }
  // Notify Tutopia App
  CallTutopiaAppApi(valid) {
    this.SAnswerUpdateSubmitted = true;
    if (valid) {
      const httpOptions = {
        headers: new HttpHeaders()
          .set('Authorization', 'Bearer aZyAs0ynGvmOSNyyAOkJauiV')
      }
      const TempObj = {
        "contact_id": this.ObjAnswer.Query_Question_ID,
        "status": 'Closed',
        "response": this.ObjAnswer.Reply,
        "associate_name": this.$CompacctAPI.CompacctCookies.Name ,
        "associate_id": this.$CompacctAPI.CompacctCookies.User_Name
      };
      this.$http
        .post("https://api.tutopia.in/api/crm/v1/contact/response", TempObj, httpOptions)
        .subscribe((data: any) => {
          console.log(data)
          if (data.status) {
            this.updateanswer(valid);
          } else {
            // this.onReject();
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
  updateanswer(valid){
    this.SAnswerUpdateSubmitted = true;
    if(valid){
      const obj = {
        "Report_Name" : "Support_Query_Update",
        "Json_Param_String" : JSON.stringify([this.ObjAnswer])
      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        //console.log(data);
        if(data[0].Remarks === 'success') {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Question ID : " + this.ObjAnswer.Query_Question_ID,
            detail:  "Succesfully Created"
          });
          this.Getquerylist(true);
          this.SAnswerUpdateModal = false;
        } else{
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
    //console.log(this.ObjAnswer);
  }
  // SEARCH TICKET
  GetSupportTicketList(valid) {
    this.SearchTicketFormSubmitted = true;
    this.BackUpSupportTicketList = [];
    this.DistAssignTo2 = [];
    if(valid) {
      this.AssignToBtnFlag = false;
      this.SearchTicketFormSubmitted = false;
      this.SupportTicketList = [];
      this.seachSpinner1 = true;
      const start = this.ObjSearchTicket.From_Date
          ? this.DateService.dateConvert(new Date(this.ObjSearchTicket.From_Date))
          : this.DateService.dateConvert(new Date());
        const end = this.ObjSearchTicket.To_Date
          ? this.DateService.dateConvert(new Date(this.ObjSearchTicket.To_Date))
          : this.DateService.dateConvert(new Date());
      const Tempobj = {
        Start_Date : start,
        End_Date : end,
        Support_Status_ID : this.ObjSearchTicket.Status,
        Asigned_To : this.ObjSearchTicket.Asigned_To ? this.ObjSearchTicket.Asigned_To : '0'
      };

      const obj = {
        "Report_Name" : "Browse_Support_Ticket",
        "Json_Param_String" : JSON.stringify([Tempobj])
      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        this.SupportTicketList = data ? data : [];
        this.SupportTicketList.forEach((item) => {
          item['Select_Flag'] = false;
        })

        this.BackUpSupportTicketList = data ? data : [];
        this.GetSupportTicketAssignedDist();
        this.seachSpinner1 = false;
      })
    }
  }
  GetSupportTicketAssignedDist() {

    let DAssignTo= [];
    this.DistAssignTo2 = [];
    this.BackUpSupportTicketList.forEach((item) => {
      if (DAssignTo.indexOf(item.Asigned_To) === -1) {
          DAssignTo.push(item.Asigned_To);
          this.DistAssignTo2.push({label: item.Asigned_To_Name,value: item.Asigned_To});
      }
    });
    this.SupportTicketList = [...this.BackUpSupportTicketList];
  }
  FilterSupportTicketAssignedDist() {

    let AssignToFilter = [];
    this.searchFields2 = [];
    if (this.SelectedDistAssignTo2.length) {
      this.searchFields2.push('Asigned_To');
      AssignToFilter = this.SelectedDistAssignTo2;
    }
    this.SupportTicketList = [];
    if (this.searchFields2.length) {
      let LeadArr = this.BackUpSupportTicketList.filter(function (e) {
        return (AssignToFilter.length ? AssignToFilter.includes(e['Asigned_To']) : true)
      });
      this.SupportTicketList = LeadArr.length ? LeadArr : [];
    } else {
      this.SupportTicketList = this.BackUpSupportTicketList;
    }
  }
  // SAVE TICKET
  async SaveSupportTicket(valid) {
    this.CreateTicketFormSubmitted = true;
    console.log(this.fileUpload)
    if(valid) {
      this.seachSpinnersave = true;
      this.ObjTicket.Support_Date = '';
      let ErrFlagIfTutoApiCall = true;
      if(this.TicketWithContactID) {
        try {
          const apiObj = {
            "student_id": this.ObjTicket.Student_ID,
            "subject":this.ObjTicket.Short_Description,
            "message": this.ObjTicket.Description
          }
        const apiRes:any = await this.CallTutopiaApiForTicket('contact/message',apiObj);
        console.log(apiRes)
        this.ObjTicket.Contact_ID = apiRes.data.contact_message.contact_id;
        } catch(error){
          ErrFlagIfTutoApiCall = false;
        }

      }
      console.log(this.ObjTicket)
      if(ErrFlagIfTutoApiCall) {
        const obj = {
          "Report_Name" : "Save_Support_Ticket",
          "Json_Param_String" : JSON.stringify([this.ObjTicket])
        }
        this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
          console.log(data);
          if(data[0].Support_ID) {
            if(this.ObjFolowup.Query_Question_ID) {
              this.SaveTicket(true);
            } else {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Ticket ID : " + data[0].Support_ID,
                detail:  "Succesfully Created"
              });
            this.ClearSupportTicket();
            }

          } else{
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
        if(this.ObjTicket.Contact_ID && this.ObjTicket.Support_Status_ID) {
          const SupportStatusObj = this.SupportStatusList.filter(e => e.Support_Status_ID == this.ObjTicket.Support_Status_ID)[0];
          if(SupportStatusObj.Is_Closed === 'Y') {
            try {
              const apiObj = {
                "contact_id": this.ObjTicket.Contact_ID,
                "response":this.ObjTicket.Short_Description,
                "status": "Closed",
                "associate_name": this.$CompacctAPI.CompacctCookies.Name,
                "associate_id": this.$CompacctAPI.CompacctCookies.User_Name
              }
              const apiRes:any = await this.CallTutopiaApiForTicket('contact/response',apiObj);
            } catch(error) {
              console.log(error)
            }

          }
        }

      } else {
        this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error From TUTOPIA App API. "
          });
          this.seachSpinnersave = false;
      }

    }
  }
  async CallTutopiaApiForTicket(url , obj) {
    const httpOptions = {headers: new HttpHeaders().set('Authorization', 'Bearer aZyAs0ynGvmOSNyyAOkJauiV')}
    const response = await this.$http.post('https://api.tutopia.in/api/crm/v1/'+url,obj,httpOptions).toPromise();
  return response;
  }
  //  UPDATE TICKET STATUS
  UpdateTicketStatusModal (obj) {
    this.UpdateStatusFormSubmit = false;
    this.ObjUpdateStatus = {};
    this.followUpLists = [];
    this.distinctDateArray =[];
    if(obj.Support_ID) {
      this.ObjUpdateStatus = obj;
      this.ObjUpdateStatus.Support_Status_ID = undefined;
      this.GetTicketFollowupDetails(this.ObjUpdateStatus.Support_ID,'UpdateStatusModalFlag');

    }
  }
  GetTicketFollowupDetails(SupportID,modal) {
    const distinctDateArrayTemp = [];
    const obj = {
      "Report_Name": "GET_Support_Details",
      "Json_Param_String" : JSON.stringify([{"Support_ID": + SupportID}])
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=> {
      this.followUpLists = data.length ? data:[];
      for (let i = 0; i < this.followUpLists.length; i++) {
          distinctDateArrayTemp.push(this.followUpLists[i].Follouwp_Date);
      }
      const unique = distinctDateArrayTemp.filter(function(value, index, self){
                      return self.indexOf(value) === index;
                    });
      this.distinctDateArray = unique;
      this[modal] = true;
      });
  }
  getFollowupByDate(dateStr) {
    return this.followUpLists.filter((item) => item.Follouwp_Date === dateStr);
  }
  async UpdateTicketStatus(valid) {
    this.UpdateStatusFormSubmit = true;
    if(valid) {
      const SupportStatusObj = this.SupportStatusList.filter(e => e.Support_Status_ID == this.ObjUpdateStatus.Support_Status_ID)[0];
      let ErrFlagIfTutoApiCall = true;
      if(SupportStatusObj.Is_Closed === 'Y') {
        try {
          const apiObj = {
            "contact_id": this.ObjUpdateStatus.Contact_ID,
            "response":this.ObjUpdateStatus.Followup_Remarks,
            "status": "Closed",
            "associate_name": this.$CompacctAPI.CompacctCookies.Name,
            "associate_id": this.$CompacctAPI.CompacctCookies.User_Name
          }
          const apiRes:any = await this.CallTutopiaApiForTicket('contact/response',apiObj);
        } catch(error) {
          ErrFlagIfTutoApiCall = false;
        }

      }
      if(ErrFlagIfTutoApiCall) {
        const TempObj = {
          Support_ID : this.ObjUpdateStatus.Support_ID,
          Support_Status_ID : this.ObjUpdateStatus.Support_Status_ID,
          Asigned_To :this.ObjUpdateStatus.From_Create ? this.$CompacctAPI.CompacctCookies.User_ID : this.ObjUpdateStatus.Asigned_To,
          Followup_Remarks : this.ObjUpdateStatus.Followup_Remarks
        }
        console.log(TempObj)
        const obj = {
          "Report_Name" : "Update_Support_Ticket",
          "Json_Param_String" : JSON.stringify([TempObj])
        }
        this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
          console.log(data);
          if(data[0].Remarks) {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Ticket ID : " + this.ObjUpdateStatus.Support_ID,
                detail:  "Succesfully Status Updated"
              });
              this.UpdateStatusFormSubmit = false;
              this.ObjUpdateStatus = {};
              this.UpdateStatusModalFlag = false;
              this.GetSupportTicketList(true);
              if(this.PrevPendingTicketList.length) {
                this.GetPrevPendingTickets();
              }
          } else{
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        })
      } else {
        this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error From TUTOPIA App API. "
          });
      }

    }
  }
  // UPLOAD FILE
  FetchPDFFile(event) {
    // this.PDFFlag = false;
    for(let file of event.files) {
      this.MultipleFile.push(file);
  }

  }

  // EXPORT TO EXCEL
  exportexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
// CLEAR SUPPORT
ClearSupportTicket() {
  this.seachSpinnersave = false;
  this.ObjTicket = new Ticket ();
  this.CreateTicketFormSubmitted = false;
  this.UnIdentifyStudent = false;
  this.TicketWithContactID = false;
  this.SalesDetailsList  = [];
  this.PrevTicketList = [];
  this.PrevPendingTicketList = [];
}
}
class answer{
  Query_Question_ID:string;
  Reply:string;


}
class Search {
  Start_Date: string;
  End_Date: string;
}
class Followup {
  Query_Question_ID:string;
  Status_ID:string;
	Followup_Remarks:string;
	From_User:string;
	To_User:string;
}
class SearchTicket{
  From_Date:string;
  To_Date:string;
  Status:string;
  Asigned_To:string;
}
class Ticket {
  File_Url:string;
  Foot_Fall_ID:string;
  Support_Date:string;
  Name:string;
  PIN_Code:String;
  Class:string;
  Registration_Date:string;
  District:string;
  Mobile_No:string;
  Short_Description:string;
  Description:string;
  Support_Category_ID:string;
  Asigned_To:string;
  Support_Status_ID:string;
  Class_ID:string;
  Anndroid_Ver_ID:string;
  FMC_ID:string;
  ENQ_Source_ID:string;
  Contact_ID = 0;
  Student_ID:string;
  Paid:string;
  Device_Model:string;
}
class SearchContactMgs {
  start_date:string;
end_date:string;
Status_ID:string;
User_ID:string;
}
