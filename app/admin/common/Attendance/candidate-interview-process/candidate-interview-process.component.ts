import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-candidate-interview-process',
  templateUrl: './candidate-interview-process.component.html',
  styleUrls: ['./candidate-interview-process.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None

})
export class CandidateInterviewProcessComponent implements OnInit {

  tabIndexToView: number = 0;
  Items = ["BROWSE", "CREATE"];
  tableData: any = [];
  tableSearch: any = [];
  interviewFormSubmit: boolean = false;
  Spinner: boolean = false;
  date_of_Birth: Date = new Date();
  applied_Date: Date = new Date();
  Interview_Date_1_Round: Date = new Date();
  Interview_Date_2_Round: Date = new Date();
  Interview_Date_3_Round: Date = new Date();
  Date_Offer_letter_sent: Date = new Date();
  Joining_date: Date = new Date();
  Date_of_apply: Date = new Date();
  Date_Offer_letter_sent_2: Date = new Date();
  Joining_date_2_time: Date = new Date();
  minDate: Date;
  maxDate: Date = new Date();


  objInterview = new Interview()

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Candidate Interview Process",
      Link: "Candidate Interview Process"
    });
    this.getBrowseData();
  }

  getBrowseData() {
    const obj = {
      "SP_String": "SP_HR_Candidate_Interview_Process",
      "Report_Name_String": "Browse_Candidate_Interview_Process"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log('browse data', data);
      this.tableData = data;
      this.tableSearch = Object.keys(data[0]);
    })
  }

  changeInterview() {
    this.objInterview.In_case_of_No = undefined;
    this.objInterview.In_Case_of_Yes = undefined;
  }

  changeFinalStatus() {
    this.objInterview.In_Case_of_Rejected = undefined;
    this.objInterview.In_Case_of_Selected = undefined;
  }

  offerAccepcted() {
    this.objInterview.In_case_of_yes_offer = undefined;
    this.objInterview.Reason_for_Offer = undefined;
    this.objInterview.In_case_of_no_offer = undefined;
  }

  changeJoined() {
    this.objInterview.In_case_of_yes_Remarks = undefined;
    this.objInterview.Remarks = undefined;
    this.objInterview.In_case_of_no_join = undefined;
  }

  changeOfferAccepcted() {
    this.objInterview.In_case_of_no_offer_2 = undefined;

  }

  changeJoined2() {
    this.objInterview.In_case_of_no_join_2 = undefined;
    this.objInterview.Remarks_2 = undefined;
    this.objInterview.In_case_of_yes_Remarks_2 = undefined;
  }

  changeBlacklist() {
    this.objInterview.If_Yes_Reason_blacklist = undefined;
  }

  SaveForm(valid: any) {
    this.interviewFormSubmit = true;
    if (valid) {
      this.interviewFormSubmit = false;
      this.Spinner = true;
      this.objInterview.Candidate_ID = 0;
      this.objInterview.DOB = this.DateService.dateConvert(this.date_of_Birth);
      this.objInterview.Applied_Date = this.DateService.dateConvert(this.applied_Date);
      this.objInterview.Interview_Date_1_Round = this.DateService.dateConvert(this.Interview_Date_1_Round);
      this.objInterview.Interview_Date_2_Round = this.DateService.dateConvert(this.Interview_Date_2_Round);
      this.objInterview.Interview_Date_3_Round = this.DateService.dateConvert(this.Interview_Date_3_Round);
      this.objInterview.Date_Offer_letter_sent = this.DateService.dateConvert(this.Date_Offer_letter_sent);
      this.objInterview.Joining_date = this.DateService.dateConvert(this.Joining_date);
      this.objInterview.Date_of_apply = this.DateService.dateConvert(this.Date_of_apply);
      this.objInterview.Date_Offer_letter_sent_2 = this.DateService.dateConvert(this.Date_Offer_letter_sent_2);
      this.objInterview.Joining_date_2_time = this.DateService.dateConvert(this.Joining_date_2_time);

      console.log('save object', this.objInterview);
      const obj = {
        "SP_String": "SP_HR_Candidate_Interview_Process",
        "Report_Name_String": "Save_Candidate_Interview_Process",
        "Json_Param_String": JSON.stringify([this.objInterview])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log('Create Response', data);
        if (data[0].Column1 == "done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Data Save Succesfully ",
            detail: "Succesfully Save"
          });
          this.Spinner = false;
          this.tabIndexToView = 0;
          this.clearData();
          this.getBrowseData();
        }
        else {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Wrong"
          });
          this.Spinner = false;
        }
      })
    }
  }
  clearData() {
    this.objInterview = new Interview();
    this.interviewFormSubmit = false;
    this.Spinner = false;
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.clearData();
  }
}

class Interview {
  Candidate_ID: any;
  Name: any;
  Gender: any;
  DOB: any;
  Marital_Status: any;
  Applied_Date: any;
  Referred_By: any;
  Reference_Name: any;
  State: any;
  City: any;
  Post_Applied: any;
  Location_Applied: any;
  Qualification: any;
  Experience: any;
  Last_Salary: any;
  Expected_Salary: any;
  Notice_Period: any;
  Contact_Number_1: any;
  Contact_Number_2: any;
  Whaspp_Number: any;
  Email: any;
  Feedback_by_Reference: any;
  Interview_Taken: any;
  In_case_of_No: any;
  In_Case_of_Yes: any;
  Interview_Date_1_Round: any;
  Mode_of_Interview_1: any;
  Inteviewer_Name: any;
  Rec_Next_Round_of_Interview_1: any;
  Feedback: any;
  Interview_Date_2_Round: any;
  Mode_of_Interview_2: any;
  Inteviewer_Name_2: any;
  Rec_Next_Round_of_Interview_2: any;
  Feedback_2: any;
  Interview_Date_3_Round: any;
  Mode_of_Interview_3: any;
  Inteviewer_Name_3: any;
  Rec_Next_Round_of_Interview_3: any;
  Feedback_3: any;
  Final_status: any;
  In_Case_of_Rejected: any;
  In_Case_of_Selected: any;
  Offer_letter_sent: any;
  Date_Offer_letter_sent: any;
  Expected_date_of_joining: any;
  Location_selected_for: any;
  Offer_accepted: any;
  In_case_of_no_offer: any;
  Reason_for_Offer: any;
  In_case_of_yes_offer: any;
  Joined: any;
  In_case_of_no_join: any;
  Remarks: any;
  In_case_of_yes_Remarks: any;
  Joining_date: any;
  Location: any;
  Remarks_if_any: any;
  In_case_of_applied_for_2nd_time: any;
  Date_of_apply: any;
  Referred_By_2nd_time: any;
  Reference_Name_2nd_time: any;
  Final_status_2nd_time: any;
  In_Case_of_Rejected_2: any;
  In_Case_of_Selected_2: any;
  Offer_letter_sent_2: any;
  Date_Offer_letter_sent_2: any;
  Expected_date_of_joining_2: any;
  Location_selected_for_2: any;
  Offer_accepted_2: any;
  In_case_of_no_offer_2: any;
  Reason_2nd_time: any;
  In_case_of_yes_2_time: any;
  Joined_2nd_time: any;
  In_case_of_no_join_2: any;
  Remarks_2: any;
  In_case_of_yes_Remarks_2: any;
  Joining_date_2_time: any;
  Location_2_time: any;
  Remarks_if_any_2_time: any;
  // Duplicate Fields


  Blacklisted: any;
  If_Yes_Reason_blacklist: any;
  Remarks_blacklist: any;
}
