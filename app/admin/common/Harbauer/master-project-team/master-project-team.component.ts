import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-master-project-team',
  templateUrl: './master-project-team.component.html',
  styleUrls: ['./master-project-team.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MasterProjectTeamComponent implements OnInit {

  TableData: any = [];
  projectNameList: any = [];
  memberNameList: any = [];
  underNameList: any = [];
  Spinner: boolean = false;
  buttonname: string = 'Create';
  ProjectFormSubmitted: boolean = false;
  edit: boolean = false;
  deleteuserId: number = 0;

  objProject = new project();

  constructor(
    private http: HttpClient,
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Project Team",
      Link: "Project Management --> Old Project Master"
    });
    this.getProjectNameDrop();
    this.getMemberName();
  }

  getProjectNameDrop() {
    this.projectNameList = [];
    const obj = {
      "SP_String": "SP_Task_Management_Tender",
      "Report_Name_String": "Get_Project_All"
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log(data);
      data.forEach((ele: any) => {
        this.projectNameList.push({
          "label": ele.Project_Description,
          "value": ele.Tender_Doc_ID
        })
      })
    });
  }

  getMemberName() {
    this.http.get('/Master_User/Get_All_Data').pipe(map((data: any) => data ? JSON.parse(data) : [])).subscribe((data: any) => {
      // console.log('data member name', data);
      data.forEach((ele: any) => {
        this.underNameList.push({
          "label": ele.Name,
          "value": ele.User_ID
        });
        this.memberNameList.push({
          "label": ele.Name,
          "value": ele.User_ID
        });
      })
    })
  }

  SaveProjectName(valid) {
    this.ProjectFormSubmitted = true;
    if (valid) {
      this.ProjectFormSubmitted = false;
      this.Spinner = true;
      const obj = {
        "SP_String": "SP_Project_Team_Member",
        "Report_Name_String": "Add_Member_For_Project",
        "Json_Param_String": JSON.stringify([this.objProject])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('project Team save response', data);
        if (data[0].Column1 == "Done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Project Team",
            detail: this.edit ? "Succesfully Updated" : "Succesfully Created"
          });
          this.clearData();
          this.getProjectDeatils();
        }
        else {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something went Wrong"
          });
        }
      });
    }
  }

  getProjectDeatils() {
    this.TableData = [];
    // console.log('table data function works')
    if (this.objProject.Project_ID) {
      const obj = {
        "SP_String": "SP_Project_Team_Member",
        "Report_Name_String": "Get_Member_For_Project",
        "Json_Param_String": JSON.stringify([{ "Project_ID": this.objProject.Project_ID }])
      }

      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        // console.log('browse data', data);
        this.TableData = data;
      })
    }
  }

  editTableRow(col: any) {
    if (col) {
      this.edit = true;
      this.objProject.Intro_User_ID = col.Intro_User_ID;
      this.objProject.User_ID = col.User_ID;
      this.buttonname = "Update";
    }
  }

  backToCreate() {
    this.edit = false;
    this.buttonname = "Create";
    this.clearData();
  }

  deleteTableRow(col) {
    if (col && this.objProject.Project_ID) {
      // console.log('Delete obj', col);
      this.deleteuserId = col.User_ID;
      this.CompacctToast.clear();
      this.CompacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }

  clearData() {
    this.Spinner = false;
    this.ProjectFormSubmitted = false;
    this.objProject.Intro_User_ID = undefined;
    this.objProject.User_ID = undefined;
    this.edit = false;
    this.buttonname = "Create";
    this.deleteuserId = 0;
  }

  onConfirm() {
    if (this.objProject.Project_ID && this.deleteuserId) {
      const obj = {
        "SP_String": "SP_Project_Team_Member",
        "Report_Name_String": "Delete_Member_For_Project",
        "Json_Param_String": JSON.stringify([{ "Project_ID": this.objProject.Project_ID, "User_ID": this.deleteuserId }])
      }

      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('delete response', data);
        if (data[0].Column1 == "Done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Project Team",
            detail: "Succesfully Deleted"
          });
          this.deleteuserId = 0;
          this.getProjectDeatils();
        }
        else {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something went Wrong"
          });
        }
      });
    }
  }

  onReject() {
    this.CompacctToast.clear("c");
  }
}

class project {
  Project_ID: any;
  User_ID: any;
  Intro_User_ID: any;
}
