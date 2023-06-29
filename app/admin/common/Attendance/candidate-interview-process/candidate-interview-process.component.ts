import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { FileUpload } from 'primeng/fileupload';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  buttonName: string = "Save"
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
  Expected_date_of_joining: Date = new Date();
  Joining_date: Date = new Date();
  Date_of_apply: Date = new Date();
  Date_Offer_letter_sent_2: Date = new Date();
  Expected_date_of_joining_2: Date = new Date();
  Joining_date_2_time: Date = new Date();
  minDate: Date;
  maxDate: Date = new Date();
  updateCandidate_Id = 0;
  file: boolean = false;
  upload: boolean = true;
  file2: boolean = false;
  upload2: boolean = true;
  objInterview = new Interview();

  @ViewChild("UploadFile", { static: false }) UploadFile!: FileUpload;
  @ViewChild("UploadFile2", { static: false }) UploadFile2!: FileUpload;

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService
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
      // console.log('browse data', data);
      this.tableData = data;
      this.tableSearch = Object.keys(data[0]);
    })
  }

  changeInterview() {
    this.objInterview.In_case_of_No = undefined;
    this.Interview_Date_1_Round = new Date();
    this.objInterview.Mode_of_Interview_1 = undefined;
    this.objInterview.Inteviewer_Name = undefined;
    this.objInterview.Rec_Next_Round_of_Interview_1 = undefined;
    this.objInterview.Feedback = undefined;
    this.changeInterview1stRound();
  }

  changeInterview1stRound() {
    this.Interview_Date_2_Round = new Date();
    this.objInterview.Mode_of_Interview_2 = undefined;
    this.objInterview.Inteviewer_Name_2 = undefined;
    this.objInterview.Rec_Next_Round_of_Interview_2 = undefined;
    this.objInterview.Feedback_2 = undefined;
    this.changeInterview2ndRound();
  }

  changeInterview2ndRound() {
    this.Interview_Date_3_Round = new Date();
    this.objInterview.Mode_of_Interview_3 = undefined;
    this.objInterview.Inteviewer_Name_3 = undefined;
    this.objInterview.Feedback_3 = undefined;
    this.objInterview.Final_status = undefined;
    this.changeFinalStatus();
  }

  changeFinalStatus() {
    this.objInterview.In_Case_of_Rejected = undefined;

    this.objInterview.Offer_letter_sent = undefined;
    this.offerLetterSent();
  }

  offerLetterSent() {
    this.Date_Offer_letter_sent = new Date();
    this.Expected_date_of_joining = new Date();
    this.objInterview.Location_selected_for = undefined;
    this.objInterview.Offer_accepted = undefined;
    this.changeOfferAccepcted();
  }

  changeOfferAccepcted() {
    this.objInterview.Reason_for_Offer = undefined;
    this.objInterview.Joined = undefined;
    this.changeJoined();
  }

  changeJoined() {
    this.Joining_date = new Date();
    this.objInterview.Remarks = undefined;
    this.objInterview.Location = undefined;
    this.objInterview.Remarks_if_any = undefined;
  }


  changeApplied2ndTime() {
    this.Date_of_apply = new Date();
    this.objInterview.Referred_By_2nd_time = undefined;
    this.objInterview.Reference_Name_2nd_time = undefined;
    this.objInterview.Final_status_2nd_time = undefined;
    this.changeFinalStatus2nd();
  }

  changeFinalStatus2nd() {
    this.objInterview.In_Case_of_Rejected_2 = undefined;
    this.objInterview.Offer_letter_sent_2 = undefined;
    this.changeOfferLatterSent2nd();
  }

  changeOfferLatterSent2nd() {
    this.Date_Offer_letter_sent_2 = new Date();
    this.objInterview.Offer_accepted_2 = undefined;
    this.Expected_date_of_joining_2 = new Date();
    this.objInterview.Location_selected_for_2 = undefined;

    this.offerAccepcted2nd();
  }

  offerAccepcted2nd() {
    this.objInterview.Reason_2nd_time = undefined;
    this.objInterview.Joined_2nd_time = undefined;
    this.chnageJoind2nd();
  }

  chnageJoind2nd() {
    this.Joining_date_2_time = new Date();
    this.objInterview.Remarks_2 = undefined;
    this.objInterview.Location_2_time = undefined;
    this.objInterview.Remarks_if_any_2_time = undefined;
  }

  changeBlacklist() {
    this.objInterview.If_Yes_Reason_blacklist = undefined;
  }

  editData(col: any) {
    if (col.Candidate_ID) {
      // console.log('edit col', col);
      this.Items = ["BROWSE", "UPDATE"];
      this.buttonName = "Update";
      this.tabIndexToView = 1;
      this.updateCandidate_Id = col.Candidate_ID;
      const obj = {
        "SP_String": "SP_HR_Candidate_Interview_Process",
        "Report_Name_String": "Get_Candidate_Interview_Process",
        "Json_Param_String": JSON.stringify([{ "Candidate_ID": this.updateCandidate_Id }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('edit response', data);
        this.objInterview = data[0];
        this.date_of_Birth = new Date(data[0].DOB);
        this.applied_Date = new Date(data[0].Applied_Date);
        this.Interview_Date_1_Round = new Date(data[0].Interview_Date_1_Round);
        this.Interview_Date_2_Round = new Date(data[0].Interview_Date_2_Round);
        this.Interview_Date_3_Round = new Date(data[0].Interview_Date_3_Round);
        this.Date_Offer_letter_sent = new Date(data[0].Date_Offer_letter_sent);
        this.Expected_date_of_joining = new Date(data[0].Expected_date_of_joining);
        this.Joining_date = new Date(data[0].Joining_date);
        this.Date_of_apply = new Date(data[0].Date_of_apply);
        this.Date_Offer_letter_sent_2 = new Date(data[0].Date_Offer_letter_sent_2);
        this.Expected_date_of_joining_2 = new Date(data[0].Expected_date_of_joining_2);
        this.Joining_date_2_time = new Date(data[0].Joining_date_2_time);

        this.objInterview.Gender = data[0].Gender ? data[0].Gender : undefined;
        this.objInterview.Marital_Status = data[0].Marital_Status ? data[0].Marital_Status : undefined;
        this.objInterview.Referred_By = data[0].Referred_By ? data[0].Referred_By : undefined;
        this.objInterview.Interview_Taken = data[0].Interview_Taken ? data[0].Interview_Taken : undefined;
        this.objInterview.In_case_of_No = data[0].In_case_of_No ? data[0].In_case_of_No : undefined;
        this.objInterview.Mode_of_Interview_1 = data[0].Mode_of_Interview_1 ? data[0].Mode_of_Interview_1 : undefined;
        this.objInterview.Rec_Next_Round_of_Interview_1 = data[0].Rec_Next_Round_of_Interview_1 ? data[0].Rec_Next_Round_of_Interview_1 : undefined;
        this.objInterview.Mode_of_Interview_2 = data[0].Mode_of_Interview_2 ? data[0].Mode_of_Interview_2 : undefined;
        this.objInterview.Rec_Next_Round_of_Interview_2 = data[0].Rec_Next_Round_of_Interview_2 ? data[0].Rec_Next_Round_of_Interview_2 : undefined;
        this.objInterview.Mode_of_Interview_3 = data[0].Mode_of_Interview_3 ? data[0].Mode_of_Interview_3 : undefined;
        this.objInterview.Final_status = data[0].Final_status ? data[0].Final_status : undefined;
        this.objInterview.In_Case_of_Rejected = data[0].In_Case_of_Rejected ? data[0].In_Case_of_Rejected : undefined;
        this.objInterview.Offer_letter_sent = data[0].Offer_letter_sent ? data[0].Offer_letter_sent : undefined;
        this.objInterview.Offer_accepted = data[0].Offer_accepted ? data[0].Offer_accepted : undefined;
        this.objInterview.Joined = data[0].Joined ? data[0].Joined : undefined;
        this.objInterview.In_case_of_applied_for_2nd_time = data[0].In_case_of_applied_for_2nd_time ? data[0].In_case_of_applied_for_2nd_time : undefined;
        this.objInterview.Final_status_2nd_time = data[0].Final_status_2nd_time ? data[0].Final_status_2nd_time : undefined;
        this.objInterview.In_Case_of_Rejected_2 = data[0].In_Case_of_Rejected_2 ? data[0].In_Case_of_Rejected_2 : undefined;
        this.objInterview.Offer_letter_sent_2 = data[0].Offer_letter_sent_2 ? data[0].Offer_letter_sent_2 : undefined;
        this.objInterview.Offer_accepted_2 = data[0].Offer_accepted_2 ? data[0].Offer_accepted_2 : undefined;
        this.objInterview.Joined_2nd_time = data[0].Joined_2nd_time ? data[0].Joined_2nd_time : undefined;
        this.objInterview.Blacklisted = data[0].Blacklisted ? data[0].Blacklisted : undefined;
        this.objInterview.If_Yes_Reason_blacklist = data[0].If_Yes_Reason_blacklist ? data[0].If_Yes_Reason_blacklist : undefined;

        if (data[0].File_Upload) {
          this.file = true;
          this.upload = false;
        }
      });
    }
  }

  SaveForm(valid: any) {
    this.interviewFormSubmit = true;
    if (valid) {
      let msg = "";
      let repName = "";
      if (this.updateCandidate_Id) {
        msg = "Upadate";
        repName = "Update_Candidate_Interview_Process";
        this.objInterview.Candidate_ID = this.updateCandidate_Id;
      }
      else {
        msg = "Save";
        repName = "Save_Candidate_Interview_Process";
        this.objInterview.Candidate_ID = 0;
      }

      this.interviewFormSubmit = false;
      this.Spinner = true;
      this.objInterview.DOB = this.DateService.dateConvert(this.date_of_Birth);
      this.objInterview.Applied_Date = this.DateService.dateConvert(this.applied_Date);
      this.objInterview.Interview_Date_1_Round = this.DateService.dateConvert(this.Interview_Date_1_Round);
      this.objInterview.Interview_Date_2_Round = this.DateService.dateConvert(this.Interview_Date_2_Round);
      this.objInterview.Interview_Date_3_Round = this.DateService.dateConvert(this.Interview_Date_3_Round);
      this.objInterview.Date_Offer_letter_sent = this.DateService.dateConvert(this.Date_Offer_letter_sent);
      this.objInterview.Expected_date_of_joining = this.DateService.dateConvert(this.Expected_date_of_joining);
      this.objInterview.Joining_date = this.DateService.dateConvert(this.Joining_date);
      this.objInterview.Date_of_apply = this.DateService.dateConvert(this.Date_of_apply);
      this.objInterview.Date_Offer_letter_sent_2 = this.DateService.dateConvert(this.Date_Offer_letter_sent_2);
      this.objInterview.Expected_date_of_joining_2 = this.DateService.dateConvert(this.Expected_date_of_joining_2);
      this.objInterview.Joining_date_2_time = this.DateService.dateConvert(this.Joining_date_2_time);

      // console.log('save object', this.objInterview);
      const obj = {
        "SP_String": "SP_HR_Candidate_Interview_Process",
        "Report_Name_String": repName,
        "Json_Param_String": JSON.stringify([this.objInterview])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('Create Response', data);
        if (data[0].Column1 == "done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Data Save Succesfully ",
            detail: "Succesfully" + msg
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
      });
    }
  }
  clearData() {
    this.updateCandidate_Id = 0;
    this.Items = ["BROWSE", "CREATE"];
    this.buttonName = "Save"
    this.objInterview = new Interview();
    this.interviewFormSubmit = false;
    this.Spinner = false;
    this.date_of_Birth = new Date();
    this.applied_Date = new Date();
    this.Interview_Date_1_Round = new Date();
    this.Interview_Date_2_Round = new Date();
    this.Interview_Date_3_Round = new Date();
    this.Date_Offer_letter_sent = new Date();
    this.Expected_date_of_joining = new Date();
    this.Joining_date = new Date();
    this.Date_of_apply = new Date();
    this.Date_Offer_letter_sent_2 = new Date();
    this.Expected_date_of_joining_2 = new Date();
    this.Joining_date_2_time = new Date();
    this.file = false;
    this.upload = true;
    this.file2 = false;
    this.upload2 = true;
    if (this.UploadFile) {
      this.UploadFile.clear();
    }
    if (this.UploadFile2) {
      this.UploadFile2.clear();
    }
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.updateCandidate_Id = 0;
    this.clearData();
  }
  // File upload Related Function

  ClearUploadInpt(elem: any) {
    if (this.objInterview.File_Upload) {
      this.upload = true;
      this.file = false;
      this.objInterview.File_Upload = undefined;
    }
    else {
      this.UploadFile.clear();
      this.file = false;
    }
  }

  ClearUploadInpt2(elem: any) {
    if (this.objInterview.File_Upload2) {
      this.upload2 = true;
      this.file2 = false;
      this.objInterview.File_Upload2 = undefined;
    }
    else {
      this.UploadFile2.clear();
      this.file2 = false;
    }
  }

  fileSelect() {
    this.file = true;
  }

  fileSelect2() {
    this.file2 = true;
  }

  showDoc(file) {
    window.open(file);
  }

  onBasicUpload(elem: any) {
    if (elem._files.length) {
      this.UploadDocApprove(elem);
    }
  }

  onBasicUpload2(elem: any) {
    if (elem._files.length) {
      this.UploadDocApprove2(elem);
    }
  }

  UploadDocApprove(elem: any) {
    const upfile = elem._files[0];
    // console.log('file elem', upfile);
    if (upfile['size']) {
      this.ngxService.start();
      this.GlobalAPI.CommonFileUpload(upfile)
        .subscribe((data: any) => {
          // console.log('upload response', data);
          this.objInterview.File_Upload = data.file_url;
          this.ngxService.stop();
          this.upload = false;
          if (data.file_url) {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "File Uploaded Succesfully",
              detail: "Succesfully Uploaded"
            });
          }
        })
    }
  }

  UploadDocApprove2(elem: any) {
    const upfile = elem._files[0];
    // console.log('file elem', upfile);
    if (upfile['size']) {
      this.ngxService.start();
      this.GlobalAPI.CommonFileUpload(upfile)
        .subscribe((data: any) => {
          // console.log('upload response', data);
          this.objInterview.File_Upload2 = data.file_url;
          this.ngxService.stop();
          this.upload2 = false;
          if (data.file_url) {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "File Uploaded Succesfully",
              detail: "Succesfully Uploaded"
            });
          }
        })
    }
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
  // end basic fields
  In_Case_of_Yes: any; // field to remove
  // Interview Panel Start 1st round
  Interview_Date_1_Round: any;
  Mode_of_Interview_1: any;
  Inteviewer_Name: any;
  Rec_Next_Round_of_Interview_1: any;
  Feedback: any;
  // Interview Panel Start 2nd round
  Interview_Date_2_Round: any;
  Mode_of_Interview_2: any;
  Inteviewer_Name_2: any;
  Rec_Next_Round_of_Interview_2: any;
  Feedback_2: any;
  // Interview Panel Start 3rd round
  Interview_Date_3_Round: any;
  Mode_of_Interview_3: any;
  Inteviewer_Name_3: any;
  Rec_Next_Round_of_Interview_3: any;
  Feedback_3: any;
  Final_status: any;
  In_Case_of_Rejected: any;
  In_Case_of_Selected: any;  // field to remove
  Offer_letter_sent: any;
  // Offer Letter Details panel
  Date_Offer_letter_sent: any;
  Expected_date_of_joining: any; // change from varchar to date
  Location_selected_for: any;
  Offer_accepted: any;
  In_case_of_no_offer: any;
  Reason_for_Offer: any;
  In_case_of_yes_offer: any; // remove
  Joined: any;
  In_case_of_no_join: any; // remove
  Remarks: any;
  In_case_of_yes_Remarks: any;
  // Joining Details Panel
  Joining_date: any;
  Location: any;
  Remarks_if_any: any;
  // Incase Of applid For 2nd time Panel
  In_case_of_applied_for_2nd_time: any;
  // 2nd Time Application Details panel
  Date_of_apply: any;
  Referred_By_2nd_time: any;
  Reference_Name_2nd_time: any;
  Final_status_2nd_time: any;
  In_Case_of_Rejected_2: any;
  In_Case_of_Selected_2: any;
  Offer_letter_sent_2: any;
  // Offer Letter Details 2nd time
  Date_Offer_letter_sent_2: any;
  Expected_date_of_joining_2: any; // change from varchar to date
  Location_selected_for_2: any;
  Offer_accepted_2: any;
  In_case_of_no_offer_2: any;
  Reason_2nd_time: any;
  In_case_of_yes_2_time: any;
  Joined_2nd_time: any;
  In_case_of_no_join_2: any;
  Remarks_2: any;
  In_case_of_yes_Remarks_2: any;
  // Joing Details 2nd time panel
  Joining_date_2_time: any;
  Location_2_time: any;
  Remarks_if_any_2_time: any;

  Blacklisted: any;
  If_Yes_Reason_blacklist: any;
  Remarks_blacklist: any;
  // file upload
  File_Upload: any;
  File_Upload2: any;
}
