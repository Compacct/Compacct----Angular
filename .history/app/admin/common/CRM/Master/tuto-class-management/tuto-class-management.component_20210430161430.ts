import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tuto-class-management',
  templateUrl: './tuto-class-management.component.html',
  styleUrls: ['./tuto-class-management.component.css'],
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


  SubjectList1 = [];
  SubjectList2 = [];
  ChapterList2 = [];

  constructor( private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,) { }

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
    });
  }
  GetSubjectList(valid) {
    this.SubjectFormSubmit = true;
    if(valid) {
      const obj = {
        "Report_Name": "List_Subject",
        "Json_Param_String" : JSON.stringify([{'Class_ID' : this.SubjectClassID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            this.SubjectList = data.length ? data : [];
            this.SubjectFormSubmit = false;
      });
    }

  }
  ChangedChapterClass() {
    this.SubjectList1 = [];
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
      const obj = {
        "Report_Name": "List_Chapter",
        "Json_Param_String" : JSON.stringify([{'Subject_ID' : this.ChapterSubjectID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            this.ChapterList = data.length ? data : [];
            this.ChapterFormSubmit = false;
      });
    }

  }
  ChangedTutorialClass() {
    this.SubjectList2 = [];
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
      const obj = {
        "Report_Name": "List_Tutorial",
        "Json_Param_String" : JSON.stringify([{'Chapter_ID' : this.TutorialChapterID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            this.TutorialList = data.length ? data : [];
            this.TutorialFormSubmit = false;
      });
    }

  }
  UpdateDescription(obj){}
}
