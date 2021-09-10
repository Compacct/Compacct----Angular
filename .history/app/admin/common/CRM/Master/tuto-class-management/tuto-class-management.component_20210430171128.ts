import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
declare var $:any;
@Component({
  selector: 'app-tuto-class-management',
  templateUrl: './tuto-class-management.component.html',
  styleUrls: ['./tuto-class-management.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoClassManagementComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  seachSpinner = false;
  ClassList = [];
  SubjectList = [];
  ChapterList = [];
  TutorialList = [];

  SubjectClassID = undefined;
  SubjectFormSubmit = false;
  ChapterClassID = undefined;
  ChapterSubjectID = undefined;
  ChapterFormSubmit = false;
  TutorialClassID = undefined;
  TutorialSubjectID = undefined;
  TutorialChapterID = undefined;
  TutorialFormSubmit = false;

  ClassList1 = [];
  SubjectList1 = [];
  SubjectList2 = [];
  ChapterList2 = [];

  constructor( private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.items = ["Class", "Subject", "Chapter", "Tutorial"];
    this.Header.pushHeader({
      Header: "Class Management",
      Link: "CRM --> Master -> General -> Class Management"
    });
    this.GetClassList();
  }
  TabClick(e){}
  GetClassList(){
    const obj = {
      "Report_Name": "List_Class "
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          this.ClassList = data.length ? data : [];
          this.ClassList1 = data.length ? data : [];
    });
  }
  GetSubjectList(valid) {
    this.SubjectFormSubmit = true;
    if(valid) {
      this.SubjectFormSubmit = false;
      const obj = {
        "Report_Name": "List_Subject",
        "Json_Param_String" : JSON.stringify([{'Class_ID' : this.SubjectClassID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            this.SubjectList = data.length ? data : [];
      });
    }

  }
  ChangedChapterClass() {
    this.SubjectList1 = [];
    this.ChapterSubjectID = undefined;
    if(this.ChapterClassID) {
      const obj = {
        "Report_Name": "List_Subject",
        "Json_Param_String" : JSON.stringify([{'Class_ID' : this.ChapterClassID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            this.SubjectList1 = data.length ? data : [];
      });
    }
  }
  GetChapterList(valid) {
    this.ChapterFormSubmit = true;
    if(valid) {
      this.ChapterFormSubmit = false;
      const obj = {
        "Report_Name": "List_Chapter",
        "Json_Param_String" : JSON.stringify([{'Subject_ID' : this.ChapterSubjectID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            this.ChapterList = data.length ? data : [];
      });
    }

  }
  ChangedTutorialClass() {
    this.SubjectList2 = [];
    this.TutorialSubjectID = undefined;
    if(this.TutorialClassID) {
      const obj = {
        "Report_Name": "List_Subject",
        "Json_Param_String" : JSON.stringify([{'Class_ID' : this.TutorialClassID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            this.SubjectList2 = data.length ? data : [];
      });
    }
  }
  ChangedTutorialSubject() {
    this.ChapterList2 = [];
    this.TutorialChapterID = undefined;
    if(this.TutorialSubjectID) {
      const obj = {
        "Report_Name": "List_Chapter",
        "Json_Param_String" : JSON.stringify([{'Subject_ID' : this.TutorialSubjectID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            this.ChapterList2 = data.length ? data : [];
      });
    }
  }
  GetTutorialList(valid) {
    this.TutorialFormSubmit = true;
    if(valid) {
      this.TutorialFormSubmit = false;
      const obj = {
        "Report_Name": "List_Tutorial",
        "Json_Param_String" : JSON.stringify([{'Chapter_ID' : this.TutorialChapterID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            this.TutorialList = data.length ? data : [];
      });
    }

  }
  UpdateDATA (obj,type){
    const valid = this.GetValidData(obj,type);
    console.log(valid)
    console.log((valid))
    if(valid) {
      const className = (type === 'class') ? '#RowIDClass'+obj.Class_ID : '#RowIDSubject'+obj.Subject_ID;
      $(className).button('loading');
      // const Tempobj = {
      //   "Report_Name": "Update_Product_Name",
      //   "Json_Param_String" : JSON.stringify([{'Product_ID' : obj.Product_ID ,'Product_Description' : obj.Product_Description}])
      // }
      // this.GlobalAPI
      //     .CommonTaskData(Tempobj)
      //     .subscribe((data: any) => {
      //       if(data[0].Remarks === 'success') {
      //         this.compacctToast.clear();
      //         this.compacctToast.add({
      //           key: "compacct-toast",
      //           severity: "success",
      //           summary: 'SKU ID : ' + obj.Product_ID,
      //           detail: "Succesfully Updated."
      //         });
      //        // this.GetSKUlist();
      //         $(className).button('reset');
      //       }else{
      //         this.compacctToast.clear();
      //         this.compacctToast.add({
      //           key: "compacct-toast",
      //           severity: "error",
      //           summary: "Error",
      //           detail: "Error Occured"
      //         });
      //         $(className).button('reset');
      //       }
      // });
    }
    if(!valid){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Validation Error",
        detail: "Cant save blank value."
      });
    }
  }
  GetValidData(obj,type) {
    if(type === 'class') {
      return obj.Class_ID && obj.Class_Name ? {Class_ID : obj.Class_ID, Class_Name : obj.Class_Name } : false;
    }
    if(type === 'subject') {
      return obj.Subject_ID && obj.Subject_Name_Eng ? {Subject_ID : obj.Subject_ID, Subject_Name : obj.Subject_Name_Eng } : false;
    }
  }
}
