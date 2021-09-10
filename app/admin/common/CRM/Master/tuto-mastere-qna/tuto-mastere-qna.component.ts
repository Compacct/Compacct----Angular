import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-tuto-mastere-qna',
  templateUrl: './tuto-mastere-qna.component.html',
  styleUrls: ['./tuto-mastere-qna.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoMastereQNAComponent implements OnInit {
  tabIndexToView = 0;

  items = [];
  BackupQuestionlist = [];
  Questionlist = [];
  Bucketlist = [];
  Userlist = [];
  AnswerUpdateModal = false;
  AnswerShowModal = false;
  AnswerUpdateSubmitted = false;
  ObjAnswer = new answer();
  Question: any;

  seachSpinner1 = false;
  QuestionlistAnswered = [];
  BackupQuestionlistAnswered = [];
  ObjSearch1 = new Search();

  seachSpinner2 = false;
  QuestionlistOthers = [];
  BackupQuestionlistOthers = [];
  ObjSearch2 = new Search();

  AssignToModal = false;
  AssignToBtnFlag = false;
  AssignToFormSubmit = false;
  AssignToObj = {};

  SelectAllFlag = false;
  DistClass = [];
  DistTutorial = [];
  DistAssignTo = [];
  DistSubject = [];
  SelectedDistClass = [];
  SelectedDistTutorial = [];
  SelectedDistAssignTo = [];
  SelectedDistPaid = [];
  SelectedDistSubject = [];
  searchFields = [];

  DistClass1 = [];
  DistTutorial1 = [];
  DistAssignTo1 = [];
  DistSubject1 = [];
  SelectedDistClass1 = [];
  SelectedDistTutorial1 = [];
  SelectedDistAssignTo1 = [];
  SelectedDistPaid1 = [];
  SelectedDistSubject1 = [];
  searchFields1 = [];

  DistClass2 = [];
  DistTutorial2 = [];
  DistAssignTo2 = [];
  DistSubject2 = [];
  DistFeedback2 =[];
  SelectedDistClass2 = [];
  SelectedDistTutorial2 = [];
  SelectedDistAssignTo2 = [];
  SelectedDistPaid2 = [];
  SelectedDistSubject2 = [];
  SelectedDistFeedback2 = [];
  searchFields2 = [];

  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.items = ["PENDING", "ANSWERED","OTHERS"];
    this.Header.pushHeader({
      Header: "Support Question & Answer",
      Link: "Support -> Q & A -> Support Question & Answer"
    });
    this.GetUserList();
    this.GetBucketlist();
    this.GetQuestionlist();
  }
  TabClick(e) { }

  GetBucketlist(){
    const obj = {
      "Report_Name" : "Get - Support Bucket"
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        this.Bucketlist = data ? data : [];
    })
  }
  GetUserList() {
    const obj = {
      "Report_Name" : "Browse User Master Support"
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        this.Userlist = data ? data : [];
    })
  }
  GetQuestionlist(){
    this.Questionlist = [];
    const Tempobj = {user_id:this.$CompacctAPI.CompacctCookies.User_ID};

    const obj = {
      "Report_Name" : "Get_Question_Support",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      this.Questionlist = data ? data : [];
      this.GetDistinctArr();
     })
  }
  GetQuestionlistAnswered(){
    this.QuestionlistAnswered = [];
    this.seachSpinner1 = true;
    const start = this.ObjSearch1.Start_Date
        ? this.DateService.dateConvert(new Date(this.ObjSearch1.Start_Date))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjSearch1.End_Date
        ? this.DateService.dateConvert(new Date(this.ObjSearch1.End_Date))
        : this.DateService.dateConvert(new Date());
    const Tempobj = {
      user_id: this.$CompacctAPI.CompacctCookies.User_ID,
      Start_Date: start,
      End_Date : end
    };

    const obj = {
      "Report_Name" : "Get_Question_Support_Answered",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      this.QuestionlistAnswered = data ? data : [];
      this.seachSpinner1 = false;
      this.GetDistinctArr1();
     })
  }
  GetQuestionlistOther(){
    this.QuestionlistOthers = [];
    this.seachSpinner2 = true;
     const start = this.ObjSearch2.Start_Date
        ? this.DateService.dateConvert(new Date(this.ObjSearch2.Start_Date))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjSearch2.End_Date
        ? this.DateService.dateConvert(new Date(this.ObjSearch2.End_Date))
        : this.DateService.dateConvert(new Date());
    const Tempobj = {
      user_id: this.$CompacctAPI.CompacctCookies.User_ID,
      Start_Date: start,
      End_Date : end
    };

    const obj = {
      "Report_Name" : "Get_Question_Support_Others",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      this.QuestionlistOthers = data ? data : [];
      this.seachSpinner2 = false;
      this.GetDistinctArr2();
     })
  }
  GetDistinctArr() {
    let DClass = [];
    let DTutorial= [];
    let DAssignTo= [];
    let DSubject= [];
    this.DistClass = [];
    this.DistTutorial = [];
    this.DistAssignTo = [];
    this.DistSubject = [];
    this.SelectedDistClass = [];
    this.SelectedDistTutorial = [];
    this.SelectedDistAssignTo = [];
    this.SelectedDistSubject = [];
    this.Questionlist.forEach((item) => {
      item['Select_Flag'] = false;
      if (DClass.indexOf(item.Class_Name) === -1) {
          DClass.push(item.Class_Name);
          this.DistClass.push({label: item.Class_Name,value: item.Class_Name});
      }
      if (DTutorial.indexOf(item.Tutorial_Name) === -1) {
          DTutorial.push(item.Tutorial_Name);
          this.DistTutorial.push({label: item.Tutorial_Name,value: item.Tutorial_Name});
      }
      if (DAssignTo.indexOf(item.Assigned_To) === -1) {
          DAssignTo.push(item.Assigned_To);
          this.DistAssignTo.push({label: item.Assigned_To,value: item.Assigned_To});
      }
      if (DSubject.indexOf(item.Subject_Name) === -1) {
          DSubject.push(item.Subject_Name);
          this.DistSubject.push({label: item.Subject_Name,value: item.Subject_Name});
      }
    });
    this.BackupQuestionlist = [...this.Questionlist];

  }
  GetDistinctArr1() {
    let DClass = [];
    let DTutorial= [];
    let DAssignTo = [];
    let DSubject = [];
    this.DistClass1 = [];
    this.DistTutorial1 = [];
    this.DistAssignTo1 = [];
    this.DistSubject1 = [];
    this.SelectedDistClass1 = [];
    this.SelectedDistTutorial1 = [];
    this.SelectedDistAssignTo1 = [];
    this.SelectedDistSubject1 = [];
    this.QuestionlistAnswered.forEach((item) => {
      item['Select_Flag'] = false;
      if (DClass.indexOf(item.Class_Name) === -1) {
          DClass.push(item.Class_Name);
          this.DistClass1.push({label: item.Class_Name,value: item.Class_Name});
      }
      if (DTutorial.indexOf(item.Tutorial_Name) === -1) {
          DTutorial.push(item.Tutorial_Name);
          this.DistTutorial1.push({label: item.Tutorial_Name,value: item.Tutorial_Name});
      }
      if (DAssignTo.indexOf(item.Assigned_To) === -1) {
          DAssignTo.push(item.Assigned_To);
          this.DistAssignTo1.push({label: item.Assigned_To,value: item.Assigned_To});
      }
      if (DSubject.indexOf(item.Subject_Name) === -1) {
          DSubject.push(item.Subject_Name);
          this.DistSubject1.push({label: item.Subject_Name,value: item.Subject_Name});
      }
    });
    this.BackupQuestionlistAnswered = [...this.QuestionlistAnswered];

  }
  GetDistinctArr2() {
    let DClass = [];
    let DTutorial= [];
    let DAssignTo = [];
    let DSubject = [];
    let DFeedback = [];
    this.DistClass2 = [];
    this.DistTutorial2 = [];
    this.DistAssignTo2 = [];
    this.DistSubject2 = [];
    this.DistFeedback2 = [];
    this.SelectedDistClass2 = [];
    this.SelectedDistTutorial2 = [];
    this.SelectedDistAssignTo2 = [];
    this.SelectedDistSubject2 = [];
    this.SelectedDistFeedback2 = [];
    this.QuestionlistOthers.forEach((item) => {
      item['Select_Flag'] = false;
      if (DClass.indexOf(item.Class_Name) === -1) {
          DClass.push(item.Class_Name);
          this.DistClass2.push({label: item.Class_Name,value: item.Class_Name});
      }
      if (DTutorial.indexOf(item.Tutorial_Name) === -1) {
          DTutorial.push(item.Tutorial_Name);
          this.DistTutorial2.push({label: item.Tutorial_Name,value: item.Tutorial_Name});
      }
      if (DAssignTo.indexOf(item.Assigned_To) === -1) {
          DAssignTo.push(item.Assigned_To);
          this.DistAssignTo2.push({label: item.Assigned_To,value: item.Assigned_To});
      }
      if (DSubject.indexOf(item.Subject_Name) === -1) {
          DSubject.push(item.Subject_Name);
          this.DistSubject2.push({label: item.Subject_Name,value: item.Subject_Name});
      }
      if (DFeedback.indexOf(item.Status) === -1) {
        DFeedback.push(item.Status);
          this.DistFeedback2.push({label: item.Status,value: item.Status});
      }
    });
    this.BackupQuestionlistOthers = [...this.QuestionlistOthers];

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

  // CHANGE EVENT
  getDateRange1(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjSearch1.Start_Date = dateRangeObj[0];
    this.ObjSearch1.End_Date = dateRangeObj[1];
  }
  }
  getDateRange2(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearch2.Start_Date = dateRangeObj[0];
      this.ObjSearch2.End_Date = dateRangeObj[1];
    }
  }
  SelectAll() {
    if (this.SelectAllFlag) {
      this.Questionlist.forEach((item) => {
        item['Select_Flag'] = true;
      });
      this.GlobalAssignToFlag();
    } else {
      this.Questionlist.forEach((item) => {
        item['Select_Flag'] = false;
      });
      this.GlobalAssignToFlag();
    }
  }
  GlobalAssignToFlag() {
    this.AssignToBtnFlag = this.Questionlist.some((item) =>  item['Select_Flag']);
  }
  GlobalFilterChangenUpdate() {
    this.searchFields = [];
    let ClassFilter = [];
    let TutorialFilter = [];
    let AssignToFilter = [];
    let PaidFilter = [];
    let SubjectFilter = [];

    if (this.SelectedDistClass.length) {
      this.searchFields.push('Class_Name');
      ClassFilter = this.SelectedDistClass;
    }
    if (this.SelectedDistTutorial.length) {
      this.searchFields.push('Tutorial_Name');
      TutorialFilter = this.SelectedDistTutorial;
    }
    if (this.SelectedDistAssignTo.length) {
      this.searchFields.push('Assigned_To');
      AssignToFilter = this.SelectedDistAssignTo;
    }
    if (this.SelectedDistPaid.length) {
      this.searchFields.push('Paid');
      PaidFilter = this.SelectedDistPaid;
    }
    if (this.SelectedDistSubject.length) {
      this.searchFields.push('Subject_Name');
      SubjectFilter = this.SelectedDistSubject;
    }
    this.Questionlist = [];
    if (this.searchFields.length) {
      let LeadArr = this.BackupQuestionlist.filter(function (e) {
        return ((ClassFilter.length ? ClassFilter.includes(e['Class_Name']) : true)
          && (TutorialFilter.length ? TutorialFilter.includes(e['Tutorial_Name']) : true)
          && (AssignToFilter.length ? AssignToFilter.includes(e['Assigned_To']) : true)
          && (PaidFilter.length ? PaidFilter.includes(e['Paid']) : true)
          && (SubjectFilter.length ? SubjectFilter.includes(e['Subject_Name']) : true)
        );
      });
      this.Questionlist = LeadArr.length ? LeadArr : [];
    } else {
      this.Questionlist = this.BackupQuestionlist;
    }
  }
  GlobalFilterChangenUpdate1() {
    this.searchFields1 = [];
    let ClassFilter = [];
    let TutorialFilter = [];
    let AssignToFilter = [];
    let PaidFilter = [];
    let SubjectFilter = [];

    if (this.SelectedDistClass1.length) {
      this.searchFields1.push('Class_Name');
      ClassFilter = this.SelectedDistClass1;
    }
    if (this.SelectedDistTutorial1.length) {
      this.searchFields1.push('Tutorial_Name');
      TutorialFilter = this.SelectedDistTutorial1;
    }
    if (this.SelectedDistAssignTo1.length) {
      this.searchFields1.push('Assigned_To');
      AssignToFilter = this.SelectedDistAssignTo1;
    }
    if (this.SelectedDistPaid1.length) {
      this.searchFields1.push('Paid');
      PaidFilter = this.SelectedDistPaid1;
    }
    if (this.SelectedDistSubject1.length) {
      this.searchFields1.push('Subject_Name');
      SubjectFilter = this.SelectedDistSubject1;
    }
    this.QuestionlistAnswered = [];
    if (this.searchFields1.length) {
      let LeadArr = this.BackupQuestionlistAnswered.filter(function (e) {
        return ((ClassFilter.length ? ClassFilter.includes(e['Class_Name']) : true)
          && (TutorialFilter.length ? TutorialFilter.includes(e['Tutorial_Name']) : true)
          && (AssignToFilter.length ? AssignToFilter.includes(e['Assigned_To']) : true)
          && (PaidFilter.length ? PaidFilter.includes(e['Paid']) : true)
          && (SubjectFilter.length ? SubjectFilter.includes(e['Subject_Name']) : true)
        );
      });
      this.QuestionlistAnswered = LeadArr.length ? LeadArr : [];
    } else {
      this.QuestionlistAnswered = this.BackupQuestionlistAnswered;
    }
  }
  GlobalFilterChangenUpdate2() {
    this.searchFields2 = [];
    let ClassFilter = [];
    let TutorialFilter = [];
    let AssignToFilter = [];
    let PaidFilter = [];
    let SubjectFilter = [];
    let FeedbackFilter = [];

    if (this.SelectedDistClass2.length) {
      this.searchFields2.push('Class_Name');
      ClassFilter = this.SelectedDistClass2;
    }
    if (this.SelectedDistTutorial2.length) {
      this.searchFields2.push('Tutorial_Name');
      TutorialFilter = this.SelectedDistTutorial2;
    }
    if (this.SelectedDistAssignTo2.length) {
      this.searchFields2.push('Assigned_To');
      AssignToFilter = this.SelectedDistAssignTo2;
    }
    if (this.SelectedDistPaid2.length) {
      this.searchFields2.push('Paid');
      PaidFilter = this.SelectedDistPaid2;
    }
    if (this.SelectedDistSubject2.length) {
      this.searchFields2.push('Subject_Name');
      SubjectFilter = this.SelectedDistSubject2;
    }
    if (this.SelectedDistFeedback2.length) {
      this.searchFields2.push('Status');
      FeedbackFilter = this.SelectedDistFeedback2;
    }
    this.QuestionlistOthers = [];
    if (this.searchFields2.length) {
      let LeadArr = this.BackupQuestionlistOthers.filter(function (e) {
        return ((ClassFilter.length ? ClassFilter.includes(e['Class_Name']) : true)
          && (TutorialFilter.length ? TutorialFilter.includes(e['Tutorial_Name']) : true)
          && (AssignToFilter.length ? AssignToFilter.includes(e['Assigned_To']) : true)
          && (PaidFilter.length ? PaidFilter.includes(e['Paid']) : true)
          && (SubjectFilter.length ? SubjectFilter.includes(e['Subject_Name']) : true)
          && (FeedbackFilter.length ? FeedbackFilter.includes(e['Status']) : true)
        );
      });
      this.QuestionlistOthers = LeadArr.length ? LeadArr : [];
    } else {
      this.QuestionlistOthers = this.BackupQuestionlistOthers;
    }
  }
  // MODAL OPEN
  GiveAnswer(obj){
    this.ObjAnswer = new answer();
    this.Question = undefined;
    this.AnswerUpdateSubmitted = false;
    if(obj.Tutorial_Question_ID) {
      this.Question = obj.Question;
      this.ObjAnswer.Tutorial_Question_ID = obj.Tutorial_Question_ID;
      this.AnswerUpdateModal = true;
    }
  }
  GlobalAssign() {
    this.AssignToObj = {};
    this.AssignToFormSubmit = false;
    this.AssignToObj['User_ID'] = undefined;
    this.AssignToModal = true;
  }
  AssignTo(obj) {
    this.AssignToObj = {};
    this.AssignToFormSubmit = false;
    this.Questionlist.forEach((item) => {
      item['Select_Flag'] = false;
    });
    if (obj.Tutorial_Question_ID) {
      this.AssignToObj = obj;
      obj.Select_Flag = true;
      this.AssignToObj['User_ID'] = undefined;
      this.AssignToModal = true;
    }
  }
  showAnswer(obj){
    this.ObjAnswer = new answer();
    this.Question = undefined;
    if(obj.Tutorial_Question_ID) {
      this.Question = obj.Question;
      this.ObjAnswer.Reply_Details = obj.Reply_Details;
      this.AnswerShowModal = true;
    }
  }
  // NOTIFY TUTOPIA APP & SAVE
  CallTutopiaAppApi(valid) {
    this.AnswerUpdateSubmitted = true;
    if (valid) {
      const httpOptions = {
        headers: new HttpHeaders()
          .set('Authorization', 'Bearer aZyAs0ynGvmOSNyyAOkJauiV')
      }
      const TempObj = {
        "question_id": this.ObjAnswer.Tutorial_Question_ID,
        "answer": this.ObjAnswer.Reply_Details,
        "is_public": this.ObjAnswer.is_public
      };
      this.$http
        .post("https://api.tutopia.in/api/crm/v1/questionandanswer", TempObj, httpOptions)
        .subscribe(
          (data: any) => {
            console.log(data)
            if (data.status) {
              this.saveanswer(valid);
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
          },
          error => {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                life : 6000,
                summary: "Warn Message (App API)",
                detail: "Error Occured, When Saving Data in App API."
              });
        }
        );
    }
  }
  saveanswer(valid){
  // console.log(this.ObjAnswer)
  this.AnswerUpdateSubmitted = true;
  if(valid){

    const newObj = {
      Tutorial_Question_ID:this.ObjAnswer.Tutorial_Question_ID,
      Reply_Details:this.ObjAnswer.Reply_Details,
      is_public: this.ObjAnswer.is_public
    }
    const EditJSon  = JSON.stringify([newObj]).replace(/[\u007F-\uFFFF]/g, function(chr) {
      return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
    });
    const obj = {
      "Report_Name" : 'Update_Answer_Support',
      "Json_Param_String" : EditJSon
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      //console.log(data);
      if(data[0].Column1 === 'success') {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Question ID : " + this.ObjAnswer.Tutorial_Question_ID,
          detail:  "Succesfully Created"
        });
        this.GetQuestionlist();
        this.AnswerUpdateModal = false;
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

  // BUCKET SAVE
  SaveBucket(QuesObj, BucketObj) {
    let tempArr = [];
    if (QuesObj === 0) {
      tempArr = this.GetMoveToJSON(BucketObj);
    } else {
     const tempObj = {
        Tutorial_Question_ID: QuesObj.Tutorial_Question_ID,
        Bucket_ID: BucketObj.Bucket_ID,
        Bucket_Name: BucketObj.Bucket_Name
      };
      tempArr.push(tempObj)
    }
    const obj = {
      "Report_Name" : "Update_Support_Not_Valid_Question",
      "Json_Param_String" : JSON.stringify(tempArr)
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      if(data[0].Column1 === 'success') {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary:  QuesObj ? "Question ID : " +  QuesObj.Tutorial_Question_ID : "Question",
          detail:  "Succesfully Moved."
        });
        this.GetQuestionlist();
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
  //  SAVE ASSIGN TO
  SaveAssignTo(valid) {
    if (valid) {
      const obj = {
        "Report_Name" : "Support_Forward_User",
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
          this.GetQuestionlist();
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
     this.Questionlist.forEach((item) => {
      if (item['Select_Flag']) {
        arrTemp.push({
        Tutorial_Question_ID: item['Tutorial_Question_ID'],
        User_ID: this.AssignToObj['User_ID'],
      });
      }
    });
    return JSON.stringify(arrTemp);
  }
  GetMoveToJSON(BucketObj) {
    let arrTemp = [];
     this.Questionlist.forEach((item) => {
      if (item['Select_Flag']) {
        arrTemp.push({
        Tutorial_Question_ID: item['Tutorial_Question_ID'],
        Bucket_ID: BucketObj.Bucket_ID,
        Bucket_Name: BucketObj.Bucket_Name
      });
      }
    });
    return arrTemp;
  }
  // EXPORT TO EXCEL
  exportexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }

}
class answer{
  Tutorial_Question_ID:string;
  Reply_Details:string;
  is_public:string;
}
class Search {
  Start_Date: string;
  End_Date: string;
}
