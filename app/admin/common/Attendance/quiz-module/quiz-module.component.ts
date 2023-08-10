import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';

@Component({
  selector: 'app-quiz-module',
  templateUrl: './quiz-module.component.html',
  styleUrls: ['./quiz-module.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class QuizModuleComponent implements OnInit {
  tabIndexToView = 0;
  items: any = [];
  USERID: any=undefined;
  seachSpinner: boolean = false;
  QuizID: any = undefined;
  allDetalis: any = [];
  allDetalisHeader: any = [];
  Spinner: boolean = false;
  displayPopup: boolean = false;
  QuizFormSubmitted: boolean = false;
  buttonname = "Create";
  updateDisabled:boolean = false; 

  Quiz_date: Date = new Date();
  DepartmentList:any=[];
  EmployeeList:any=[];
  TopicList:any=[];
  QuizzerList: any=[];
  ValidPercentage:boolean=false;

  Topic: any=undefined;
  TopicFormSubmitted: boolean=false;
  TopicSpinner: boolean=false;

  objSearch = new Search();
  objQuiz = new Quiz();
  constructor(
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Quiz Module",
      Link: " HR -> Training -> Quiz"
    });
    this.items = ["BROWSE", "CREATE"];
    this.USERID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.GetAllDataQuiz();
    this.getQuizzerList();
    this.getDepartmentList();
    this.getTopicList();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create"
    this.clearData();
  }

  clearData() {
    this.objQuiz = new Quiz();
    this.buttonname = "Create";
    this.QuizID=undefined;
    this.seachSpinner=false;
    this.Spinner=false;
    this.displayPopup=false;
    this.QuizFormSubmitted=false;
    this.Quiz_date=new Date();
    this.ValidPercentage=false;
    this.EmployeeList=[];
    this.updateDisabled=false;
  }

  getQuizzerList() {
    this.QuizzerList = [];
    const obj = {
      "SP_String": "SP_HR_Quiz_Module",
      "Report_Name_String": "Get_Quizzer"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
       //console.log("getQuizzerList",data);
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Emp_Name,
          element['value'] = element.Emp_ID
        });
        this.QuizzerList = data;
      }
      else {
        this.QuizzerList = [];
      }
    });
  }

  getDepartmentList() {
    this.DepartmentList = [];
    const obj = {
      "SP_String": "SP_HR_Quiz_Module",
      "Report_Name_String": "Get_Department"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
       //console.log("getDepartmentList",data);
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Dept_Name,
          element['value'] = element.Dept_ID
        });
        this.DepartmentList = data;
      }
      else {
        this.DepartmentList = [];
      }
    });
  }

  getEmployeeList(DeptID:any){
    this.EmployeeList = []; 
    this.objQuiz.Emp_ID=undefined;
    //console.log('DeptID',DeptID);
    const obj = {
      "SP_String": "SP_HR_Quiz_Module",
      "Report_Name_String": "Get_Employee",
      "Json_Param_String": JSON.stringify([{ Dept_ID : DeptID }])
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //console.log('getEmployeeList', data);
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Emp_Name,
          element['value'] = element.Emp_ID
        });
        this.EmployeeList = data;
      }
      else {
        this.EmployeeList = [];
      }
    })
  }

  getTopicList() {
    this.TopicList = [];
    const obj = {
      "SP_String": "SP_HR_Quiz_Module",
      "Report_Name_String": "Get_HR_Quiz_Topic_Master"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
       //console.log("getTopicList",data);
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Topic_Name,
          element['value'] = element.Topic_ID
        });
        this.TopicList = data;
      }
      else {
        this.TopicList = [];
      }
    });
  }

  openTopicCreate(){
    this.displayPopup=true;
  }

  CreateTopic(valid: any){
    this.TopicFormSubmitted = true;
    //console.log('TopicFormSubmitted',valid);
    if (valid) {
      this.TopicSpinner = true;
      const obj = {
        "SP_String": "SP_HR_Quiz_Module",
        "Report_Name_String": "Create_HR_Quiz_Topic_Master",
        "Json_Param_String": JSON.stringify([{"Topic_Name":this.Topic}])
        }
        this.GlobalAPI.postData(obj).subscribe((data:any) => {
          //console.log('CreateTopic res', data);
          if(data[0].Column1){
            this.TopicFormSubmitted=false;
            this.TopicSpinner=false;
            this.Topic=undefined;
            this.getTopicList();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Topic",
              detail: "Succesfully Created"
            });
            this.displayPopup=false;
          }
          else {
            this.TopicSpinner=false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Something Went Wrong"
            });
          }
        });
    }
  }

  closeTopic(){
    this.displayPopup=false;

    this.TopicFormSubmitted=false;
    this.TopicSpinner=false;
    this.Topic=undefined;
  }

  CalCulatePercentage(){
    if((Number(this.objQuiz.Mark_Obtain)==0) && (Number(this.objQuiz.Total_Marks_Of_Quiz)==0)){
      this.objQuiz.Percentage=undefined;
    }
    else if(Number(this.objQuiz.Mark_Obtain) && Number(this.objQuiz.Total_Marks_Of_Quiz)){
      if(!(Number(this.objQuiz.Mark_Obtain)>Number(this.objQuiz.Total_Marks_Of_Quiz))){
        this.ValidPercentage=false;
        this.objQuiz.Percentage=Number((Number(this.objQuiz.Mark_Obtain)/Number(this.objQuiz.Total_Marks_Of_Quiz))*100).toFixed(2);
        //console.log('this.objQuiz.Percentage',this.objQuiz.Percentage);
      }
      else{
        this.ValidPercentage=true;
        this.objQuiz.Percentage=undefined;
      }
    }
    else{
      this.objQuiz.Percentage=undefined;
    }
  }

  CreateQuiz(valid:any){
    this.QuizFormSubmitted = true;
    //console.log('QuizFormSubmitted',valid);
    if (valid) {
      //console.log('objQuiz',this.objQuiz);
      if(Number(this.objQuiz.Mark_Obtain)>Number(this.objQuiz.Total_Marks_Of_Quiz)){
        this.QuizFormSubmitted=false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Obtained marks exceed",
          detail: "Obtained marks can not be greater than total marks"
        });
        return ;
      }
      this.Spinner = true;
      //console.log('this.QuizID',this.QuizID);
      const SaveObj={
        Dated: this.DateService.dateConvert(this.Quiz_date),
        Quizzer_ID: Number(this.objQuiz.Quizzer_ID),
        Emp_ID: Number(this.objQuiz.Emp_ID),
        Topic_ID: Number(this.objQuiz.Topic_ID),
        Total_Marks_Of_Quiz: Number(this.objQuiz.Total_Marks_Of_Quiz),
        Mark_Obtain: Number(this.objQuiz.Mark_Obtain),
        Percentage: Number(this.objQuiz.Percentage).toFixed(2),
        Feedback: this.objQuiz.Feedback,
        Created_By: Number(this.USERID)
      }
      //console.log('SaveObj',SaveObj);
      const UpdateObj={
        Quiz_ID: Number(this.QuizID),
        Dated: this.DateService.dateConvert(this.Quiz_date),
        Quizzer_ID: Number(this.objQuiz.Quizzer_ID),
        Emp_ID: Number(this.objQuiz.Emp_ID),
        Topic_ID: Number(this.objQuiz.Topic_ID),
        Total_Marks_Of_Quiz: Number(this.objQuiz.Total_Marks_Of_Quiz),
        Mark_Obtain: Number(this.objQuiz.Mark_Obtain),
        Percentage: Number(this.objQuiz.Percentage).toFixed(2),
        Feedback: this.objQuiz.Feedback
      }
      //console.log('UpdateObj',UpdateObj);
      const obj = {
        "SP_String": "SP_HR_Quiz_Module",
        "Report_Name_String": this.QuizID ? "Update_Data" : "Save_Data",
        "Json_Param_String": this.QuizID ? JSON.stringify([UpdateObj]) : JSON.stringify([SaveObj])
      }
      //console.log('obj',obj);
      this.GlobalAPI.postData(obj).subscribe((data:any) => {
        //console.log('Create/update Quiz res', data);
        let msg:any = this.QuizID ? "Updated" : "Created"
        if(data[0].Column1=='Done'){
          this.QuizFormSubmitted=false;
          this.Spinner=false;
          this.clearData();
          this.GetAllDataQuiz();
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Quiz Module",
            detail: "Succesfully "+msg
          });
        }
        else if(data[0].Column1=='Go to browse and update !'){
          this.Spinner=false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Duplicate Data",
            detail: "Go to browse and update !"
          });
        }
        else {
          this.Spinner=false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Went Wrong"
          });
        }
      });
    }
  }

  getDateRange(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.objSearch.From_Date = dateRangeObj[0];
      this.objSearch.To_Date = dateRangeObj[1];
    }
  }

  GetAllDataQuiz(){
    this.allDetalis = [];
    this.allDetalisHeader = [];
    this.seachSpinner = true;

    const start = this.objSearch.From_Date
      ? this.DateService.dateConvert(new Date(this.objSearch.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.objSearch.To_Date
      ? this.DateService.dateConvert(new Date(this.objSearch.To_Date))
      : this.DateService.dateConvert(new Date());

    const tempobj = {
      From_Date : start,
      To_Date : end
    }  
    //console.log('tempobj',tempobj);
    const obj = {
      "SP_String": "SP_HR_Quiz_Module",
      "Report_Name_String": "Browse_Data",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
       //console.log("GetAllDataQuiz",data);
        this.seachSpinner = false;

        this.allDetalis = data;
        //console.log('allDetalis=====',this.allDetalis);
        if (this.allDetalis.length) {
          this.allDetalisHeader = Object.keys(data[0]);
          //console.log('allDetalisHeader=====',this.allDetalisHeader);
        }
    });
  }

  EditQuiz(col:any){
    this.QuizFormSubmitted = false;
    this.objQuiz = new Quiz();
    this.Quiz_date = new Date();
    this.QuizID=undefined;
    if(col.Quiz_ID){
      this.QuizID=col.Quiz_ID;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.EditQuizData(col);
    }
  }

  EditQuizData(col:any){
    const EditObj={
      "Quiz_ID": col.Quiz_ID,
      "Dated": this.DateService.dateConvert(new Date(col.Dated)),
      "Emp_ID": col.Emp_ID,
      "Topic_ID": col.Topic_ID,
    }
    //console.log('EditObj',EditObj);
    const obj = {
      "SP_String": "SP_HR_Quiz_Module",
      "Report_Name_String":"Get_Data_For_Edit",
      "Json_Param_String": JSON.stringify([EditObj]) 
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log("EditQuiz",data);
      let EditData:any= data[0];
      this.getEmployeeList(Number(EditData.Dept_ID));
      this.updateDisabled=true;
      setTimeout(() => {
        this.Quiz_date=new Date(EditData.Dated);
        this.objQuiz.Dept_ID=Number(EditData.Dept_ID);
        this.objQuiz.Topic_ID=Number(EditData.Topic_ID);
        this.objQuiz.Total_Marks_Of_Quiz=Number(EditData.Total_Marks_Of_Quiz);
        this.objQuiz.Mark_Obtain=Number(EditData.Mark_Obtain);
        this.objQuiz.Percentage=Number(EditData.Percentage).toFixed(2);
        this.objQuiz.Feedback=EditData.Feedback;
        this.objQuiz.Emp_ID=Number(EditData.Emp_ID);
        this.objQuiz.Quizzer_ID=Number(EditData.Quizzer_ID);
      }, 300);

    });
  }

  DeleteQuiz(col:any){

  }
  
  onConfirm() {

  }

  onReject() {
    this.compacctToast.clear("c");
  }

}

class Quiz{
  Quizzer_ID: any;
  Dept_ID: any;
  Emp_ID: any;
  Topic_ID: any;
  Total_Marks_Of_Quiz: any;
  Mark_Obtain: any;
  Percentage: any;
  Feedback: any;
  Created_By: any;
}

class Search{
  From_Date : any;
  To_Date : any;
}
