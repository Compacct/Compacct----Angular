import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-appraisal-form',
  templateUrl: './appraisal-form.component.html',
  styleUrls: ['./appraisal-form.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AppraisalFormComponent implements OnInit {

  tabIndexToView: number = 0;
  buttonname: string = "Save";
  items: any = [];
  Spinner: boolean = false;
  Edit_Emp: boolean = false;
  ObjAppraisal: Appraisal = new Appraisal();
  userFormSubmitted: boolean = false;
  allDataList: any = [];
  EmplyList: any = [];
  revYerList: any = [];
  ReviewerList: any = [];
  RepManagerList: any = [];
  AllData: any = [];
  FilterArey: any = [];
  BrowseSerchDym: any = [];
  file: boolean = false;
  upload: boolean = true;

  @ViewChild("UploadFile", { static: false }) UploadFile!: FileUpload;

  constructor(
    private compact: CompacctCommonApi,
    private header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.header.pushHeader({
      Header: "Appraisal Form",
      Link: "HR-> Appraisal Form"
    })
    this.getEMP();
    this.GetAllDataBrowswe();
    this.getReviewPeriod();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  GetAllDataBrowswe() {
    this.AllData = [];
    this.BrowseSerchDym = [];
    const obj = {
      "SP_String": "SP_HR_Txn_Appraisal",
      "Report_Name_String": "Browse_HR_Txn_Appraisal"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.AllData = data;
      if (data.length) {
        this.BrowseSerchDym = Object.keys(data[0]);
      }
      // console.log("all data==", data);
    });
  }

  getEMP() {
    this.EmplyList = []
    const obj = {
      "SP_String": "SP_HR_Txn_Appraisal",
      "Report_Name_String": "Get_Employee_List"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log("AllDropList  ===", data);
      if (data.length) {
        this.allDataList = data;
        data.forEach((ele: any) => {
          this.EmplyList.push({
            "label": ele.Emp_Name,
            "value": ele.Emp_ID
          });
          this.ReviewerList.push({
            "label": ele.Emp_Name,
            "value": ele.Emp_ID
          });
          this.RepManagerList.push({
            "label": ele.Emp_Name,
            "value": ele.Emp_ID
          });
        })
      }
    })
  }

  getReviewPeriod() {
    this.revYerList = [];
    const obj = {
      "SP_String": "SP_HR_Txn_Appraisal",
      "Report_Name_String": "Get_Review_Period"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('review period data', data);
      if (data.length) {
        data.forEach((ele: any) => {
          this.revYerList.push({
            "label": ele.Financial_Year_Name,
            "value": ele.Financial_Year_Name
          })
        })
      }
    })
  }

  getCodeAll() {
    this.ObjAppraisal.Emp_Code = undefined;
    this.ObjAppraisal.DOJ = undefined;
    this.ObjAppraisal.Designation = undefined;
    this.ObjAppraisal.Emp_Name = undefined;
    this.ObjAppraisal.Design_ID = undefined;
    this.ObjAppraisal.Reporting_Manager = undefined;
    this.ObjAppraisal.Last_Annual_CTC = undefined;
    this.ObjAppraisal.Last_In_hand_salary_Mothly = undefined;

    if (this.ObjAppraisal.Emp_ID) {
      this.FilterArey = this.allDataList.filter((elem: any) => elem.Emp_ID == this.ObjAppraisal.Emp_ID);
      this.ObjAppraisal.Emp_Code = this.FilterArey[0].Emp_Code;
      this.ObjAppraisal.DOJ = this.DateService.dateConvert(new Date(this.FilterArey[0].Emp_Joining_Dt));
      this.ObjAppraisal.Designation = this.FilterArey[0].Designation;
      this.ObjAppraisal.Emp_Name = this.FilterArey[0].Emp_Name;
      this.ObjAppraisal.Design_ID = this.FilterArey[0].Desig_ID;
      this.ObjAppraisal.Reporting_Manager = this.FilterArey[0].Report_Manager;
      this.ObjAppraisal.Last_Annual_CTC = this.FilterArey[0].Last_Annual_CTC;
      this.ObjAppraisal.Last_In_hand_salary_Mothly = this.FilterArey[0].Last_In_Hand;
    }
  }

  ClearUploadInpt(elem: any) {
    if (this.ObjAppraisal.File_Upload) {
      this.upload = true;
      this.ObjAppraisal.File_Upload = undefined;
    }
    else {
      this.UploadFile.clear();
      this.file = false;
    }
  }

  fileSelect() {
    this.file = true;
  }

  showDoc() {
    window.open(this.ObjAppraisal.File_Upload);
  }

  onBasicUpload(elem: any) {
    if (elem._files.length) {
      this.UploadDocApprove(elem);
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
          this.ObjAppraisal.File_Upload = data.file_url;
          this.ngxService.stop();
          this.upload = false;
        })
    }
  }

  saveData(valid: any) {
    this.userFormSubmitted = true;
    if (valid) {
      let repName: string = ""
      let msg: string = ""
      if (this.Edit_Emp) {
        repName = "Update_HR_Txn_Appraisal"
        msg = "Upadte"
      }
      else {
        repName = "Save_HR_Txn_Appraisal"
        msg = "Save"
      }
      this.userFormSubmitted = false;
      this.Spinner = true;
      this.ObjAppraisal.Created_By = this.compact.CompacctCookies.User_ID;
      // console.log('save obj', this, this.ObjAppraisal);
      const obj = {
        "SP_String": "SP_HR_Txn_Appraisal",
        "Report_Name_String": repName,
        "Json_Param_String": JSON.stringify([this.ObjAppraisal])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        // console.log('save res', data);

        if (data[0].Column1 == "Done") {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Appraisal Form ",
            detail: "Succesfully" + msg
          });
          this.Spinner = false;
          this.GetAllDataBrowswe();
          this.tabIndexToView = 0;
          this.clearData();
        }
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Somethig Went Wrong"
          });
        }
      });
    }
  }

  Edit(col: any) {
    if (col) {
      this.Edit_Emp = true;
      const obj = {
        "SP_String": "SP_HR_Txn_Appraisal",
        "Report_Name_String": 'Get_HR_Txn_Appraisal_Data',
        "Json_Param_String": JSON.stringify([{ "SL_No": col.SL_No, "Emp_ID": col.Emp_ID }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        // console.log('retrive data', data);
        this.ObjAppraisal = data[0];
        if (data[0].File_Upload) {
          this.file = true;
          this.upload = false;
        }
      });
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update"
    }
  }
  clearData() {
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.FilterArey = [];
    this.userFormSubmitted = false;
    this.Edit_Emp = false;
    this.file = false;
    this.upload = true;
    this.ObjAppraisal = new Appraisal();
    if (this.UploadFile) {
      this.UploadFile.clear();
    }

  }
}

class Appraisal {
  SL_No: any;
  Emp_ID: any;
  Emp_Code: any;
  Emp_Name: any;
  Design_ID: any;
  Designation: any;
  DOJ: any;
  Review_Period: any;
  Reviewer: any;
  Reporting_Manager: any;
  JOH_Values_Rating: any;
  Business_Goals_Rating: any;
  Final_Rating: any;
  Appraisee_Comments: any;
  Appraiser_Remarks: any;
  Reviewer_Remarks: any;
  Last_Annual_CTC: any;
  Revised_Annual_CTC: any;
  Last_In_hand_salary_Mothly: any;
  In_hand_salary_after_increment_Monthly: any;
  File_Upload: any;
  Created_By: any;
}
