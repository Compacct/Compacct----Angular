import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-training-grade-module',
  templateUrl: './training-grade-module.component.html',
  styleUrls: ['./training-grade-module.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TrainingGradeModuleComponent implements OnInit {
  tabIndexToView: number = 0;
  Spinner: boolean = false;
  buttonname: string = 'Save';
  traningNoList: any = [];
  departmentList: any = [];
  TrainerList: any = [];
  traningTopic: any = {};
  TableData: any = [];
  traning_Status: string = '';
  Traning_Overall_Remarks: string = '';
  gradeFormSubmitted: boolean = false;
  objSearchData = new searchData();
  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Training Grade",
      Link: "JOH HR --> Training Grade"
    });
    this.getTraningNo();
  }

  getTraningNo() {
    const obj = {
      "SP_String": "SP_HR_Txn_Training_Marks",
      "Report_Name_String": "Get_Training_No",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('Traning no list', data);
      data.forEach((ele: any) => {
        ele["label"] = ele.Training_No;
        ele["value"] = ele.Training_No;
      });
      this.traningNoList = data;
    });
  }

  getTraningTopic(value: any) {
    this.traningTopic = {};
    this.departmentList = [];
    this.objSearchData.Dept_ID = undefined;
    this.TrainerList = [];
    this.objSearchData.Emp_Trainer_ID = undefined;
    this.TableData = [];
    this.gradeFormSubmitted = false;
    this.traning_Status = '';
    this.Traning_Overall_Remarks = '';
    if (value) {
      // console.log(value);
      this.traningTopic = this.traningNoList.find((ele: any) => ele.Training_No == value);
      // console.log('search value', this.traningTopic);
      this.getDepartment(value);
    }
  }

  getDepartment(traning_no: any) {
    const obj = {
      "SP_String": "SP_HR_Txn_Training_Marks",
      "Report_Name_String": "Get_Dept",
      "Json_Param_String": JSON.stringify([{ "Training_No": traning_no }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('Department list', data);
      data.forEach((ele: any) => {
        ele["label"] = ele.Dept_Name;
        ele["value"] = ele.Dept_ID;
      });
      this.departmentList = data;
    });
  }

  getTrainerName(traning_No: any, dept_Id: any) {
    this.TrainerList = [];
    this.objSearchData.Emp_Trainer_ID = undefined;
    this.TableData = [];
    this.gradeFormSubmitted = false;
    this.traning_Status = '';
    this.Traning_Overall_Remarks = '';
    if (traning_No && dept_Id) {
      const obj = {
        "SP_String": "SP_HR_Txn_Training_Marks",
        "Report_Name_String": "Get_Trainer",
        "Json_Param_String": JSON.stringify([{ "Training_No": traning_No, "Dept_ID": dept_Id }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('trainer list', data);
        data.forEach((ele: any) => {
          ele["label"] = ele.Trainer_Name;
          ele["value"] = ele.Emp_Trainer_ID;
        });
        this.TrainerList = data;
      })
    }
  }

  getTableData(traning_no: any, dept_id: any, trainer_id: any) {
    this.TableData = [];
    this.gradeFormSubmitted = false;
    this.traning_Status = '';
    this.Traning_Overall_Remarks = '';
    if (traning_no && dept_id && trainer_id) {
      const obj = {
        "SP_String": "SP_HR_Txn_Training_Marks",
        "Report_Name_String": "Get_Attendees",
        "Json_Param_String": JSON.stringify([{ "Training_No": traning_no }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('table data', data);
        this.TableData = data;
        this.Traning_Overall_Remarks = data[0].Overall_Remarks;
        this.traning_Status = data[0].Training_Status;
      })
    }
  }

  SaveGradeForm(valid: any) {
    this.gradeFormSubmitted = true;
    if (valid && this.TableData.length) {
      let checkArrayValid = this.TableData.every((ele: any) => { return (ele.Pre_Training_Marks >= 0) && (ele.Post_Training_Marks >= 0) && (ele.Remarks != '') });
      // console.log('validation check', checkArrayValid);
      if (checkArrayValid) {
        this.gradeFormSubmitted = false;
        this.Spinner = true;
        // console.log("save data", this.TableData);
        this.TableData.forEach((ele: any) => {
          ele["Dept_ID"] = this.objSearchData.Dept_ID;
          ele["Emp_Trainer_ID"] = this.objSearchData.Emp_Trainer_ID;
          ele["Training_Status"] = this.traning_Status;
          ele["Overall_Remarks"] = this.Traning_Overall_Remarks;
          ele["Training_From_Date"] = this.DateService.dateConvert(ele["Training_From_Date"]);
          ele["Training_To_Date"] = this.DateService.dateConvert(ele["Training_To_Date"]);
        });
        // console.log('save array', this.TableData);
        const obj = {
          "SP_String": "SP_HR_Txn_Training_Marks",
          "Report_Name_String": "Save_HR_Txn_Training_Marks",
          "Json_Param_String": JSON.stringify(this.TableData)
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          this.Spinner = false;
          // console.log('save res', data);
          if(data[0].Column1){
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Data Successfully Save",
              detail: "Succesfully Save"
            });
            this.clearData();
          }
          else{
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Something Went Wrong"
            });
          }
        })
      }
    }
  }

  clearData() {
    this.objSearchData = new searchData();
    this.traningTopic = {};
    this.getTraningNo();
    this.traning_Status = '';
    this.Traning_Overall_Remarks = '';
    this.TableData = [];
  }
}

class searchData {
  Training_No: any;
  Dept_ID: any;
  Emp_Trainer_ID: any;
}