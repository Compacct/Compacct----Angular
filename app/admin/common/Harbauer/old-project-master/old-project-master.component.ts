import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-old-project-master',
  templateUrl: './old-project-master.component.html',
  styleUrls: ['./old-project-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class OldProjectMasterComponent implements OnInit {

  tabIndexToView: number = 0;
  Items: any = ['PROJECT', 'SITE', 'TENDER GROUP'];
  Spinner: boolean = false;
  Spinner2: boolean = false;
  Spinner3: boolean = false;
  buttonname: string = 'Create';
  projectNameTableData: any = [];
  projectNameFormSubmit: boolean = false;
  siteNameFormSubmit: boolean = false;
  tenderNameFormSubmit: boolean = false;
  siteNameTableData: any = [];
  deleteProjectId: number = 0;
  deleteSiteId: number = 0;
  tenderTableData: any = [];
  projectNameDropList: any = [];

  objProjectName = new projectName();
  objSiteName = new siteName();
  objTenderName = new tenderName();

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Old Project Master",
      Link: "Harbauer --> Old Project Master"
    });
    this.getProjectNames();
    this.getTenderNames();
  }

  getProjectNames() {
    this.projectNameDropList = [];
    const obj = {
      "SP_String": "SP_Old_Project_Master",
      "Report_Name_String": "Get_Old_Project_All"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('Project Name Browse Data', data);
      this.projectNameTableData = data;
      data.forEach((ele: any) => {
        this.projectNameDropList.push({
          'label': ele.Project_Description,
          'value': ele.Project_ID
        })
      })
    })

  }

  getSiteNames(id: number) {
    this.siteNameTableData = [];
    if (id) {

      const obj = {
        "SP_String": "SP_Old_Project_Master",
        "Report_Name_String": "Get_Old_Site",
        "Json_Param_String": JSON.stringify([{ Project_ID: id }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        // console.log('Site Name Browse Data', data);
        this.siteNameTableData = data;
      });
    }
  }

  SaveProjectName(valid) {
    // console.log('save works');
    this.projectNameFormSubmit = true;
    if (valid) {
      this.projectNameFormSubmit = false;
      this.Spinner = true;
      // console.log('project name save obj', this.objProjectName);
      const obj = {
        "SP_String": "SP_Old_Project_Master",
        "Report_Name_String": "Add_Old_Project",
        "Json_Param_String": JSON.stringify([this.objProjectName])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('project name save response', data);
        if (data.length) {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Project Name",
            detail: "Succesfully Created"
          });
          this.clearData();
          this.getProjectNames();
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

  SaveSiteName(valid) {
    // console.log('save works');
    this.siteNameFormSubmit = true;
    if (valid) {
      this.siteNameFormSubmit = false;
      this.Spinner2 = true;
      // console.log('site name save obj', this.objSiteName);
      const obj = {
        "SP_String": "SP_Old_Project_Master",
        "Report_Name_String": "Add_Old_Site",
        "Json_Param_String": JSON.stringify([this.objSiteName])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('site name save response', data);
        if (data.length) {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Site Name",
            detail: "Succesfully Created"
          });
          // this.clearData();
          this.getSiteNames(this.objSiteName.Project_ID);
          this.objSiteName.Site_Description = undefined;
          this.Spinner2 = false;
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

  deleteProject(col: any) {
    if (col.Project_ID) {
      this.deleteProjectId = col.Project_ID;
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

  deleteSite(col) {
    if (col.Site_ID) {
      this.deleteSiteId = col.Site_ID;
      this.CompacctToast.clear();
      this.CompacctToast.add({
        key: "d",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });

    }

  }

  SaveTendertName(valid) {
    // console.log('save works');
    this.tenderNameFormSubmit = true;
    if (valid) {
      this.tenderNameFormSubmit = false;
      this.Spinner3 = true;
      // console.log('tender name save obj', this.objTenderName);
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Budget_Group_Create",
        "Json_Param_String": JSON.stringify([this.objTenderName])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('tender name save response', data);
        if (data.length) {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Tender Group Name",
            detail: "Succesfully Created"
          });
          this.clearData();
          this.getTenderNames();
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

  deletetender() {
    this.CompacctToast.clear();
    this.CompacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Error",
      detail: "Delete Are Temporarily Off"
    });
  }

  getTenderNames() {
    this.tenderTableData = [];
    const obj = {
      "SP_String": "SP_Tender_Management_All",
      "Report_Name_String": "Get_Budget_Group_Name"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('tender Name Browse Data', data);
      this.tenderTableData = data;
    });
  }

  clearData() {
    this.Spinner = false;
    this.objProjectName = new projectName();
    this.Spinner2 = false;
    this.projectNameFormSubmit = false;
    this.objSiteName = new siteName();
    this.siteNameFormSubmit = false;
    this.siteNameTableData = [];
    this.Spinner3 = false;
    this.objTenderName = new tenderName();
    this.tenderNameFormSubmit = false;
  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  onConfirm() {
    if (this.deleteProjectId) {
      const obj = {
        "SP_String": "SP_Old_Project_Master",
        "Report_Name_String": "Delete_Old_Project",
        "Json_Param_String": JSON.stringify([{ Project_ID: this.deleteProjectId }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('delete res', data);
        if (data[0].Column1 == "Done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Project Name",
            detail: "Succesfully Deleted"
          });
          this.onReject();
          this.getProjectNames();
        }
        else if (data[0].Column1 == "Can Not Delete") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Can Not Delete"
          });
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

  onConfirmAgain() {
    if (this.deleteSiteId) {
      const obj = {
        "SP_String": "SP_Tender_Management_All_Delete_Dropdown",
        "Report_Name_String": "Delete_Site_FOR_Project_Planing",
        "Json_Param_String": JSON.stringify([{ Site_ID: this.deleteSiteId }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('delete res', data);
        if (data[0].Column1 == "Done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Site Name",
            detail: "Succesfully Deleted"
          });
          this.onReject();
          this.getSiteNames(this.objSiteName.Project_ID);

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
    this.CompacctToast.clear("d");
  }
}

class projectName {
  Project_Description: any;
}

class siteName {
  Project_ID: any;
  Site_Description: any;
}

class tenderName {
  Budget_Group_Name: any;
}