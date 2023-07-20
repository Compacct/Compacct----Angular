import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-evaluate-for-training',
  templateUrl: './evaluate-for-training.component.html',
  styleUrls: ['./evaluate-for-training.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None

})
export class EvaluateForTrainingComponent implements OnInit {
  tabIndexToView: number = 0;
  Items: any = ['BROWSE', 'CREATE'];
  Spinner: boolean = false;
  buttonname: string = 'Create';
  evaluattion_Date: Date = new Date();
  departmentList: any = [];
  employeeList: any = [];
  skillList: any = [];
  gradeList: any = [];
  TableArray: any = [];

  evalutationFormSubmitted: boolean = false;
  objEvaluationForTraning = new EvaluationForTraning();
  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Evaluate For Training",
      Link: "JOH --> Evaluate For Training"
    });
    this.getDepartmentList();
    this.getEmployeeList();
    this.getSkillList();
    this.getGradeList();
  }

  getDepartmentList(){
    const obj = {
      "SP_String": "SP_HR_Evaluate_For_Training",
      "Report_Name_String": "Get_Department",
      }
      this.GlobalAPI.postData(obj).subscribe((data:any) => {
        console.log("department list",data);
        data.forEach((ele:any)=>{})
        
      });
  }

  getEmployeeList(){
    const obj = {
      "SP_String": "SP_HR_Evaluate_For_Training",
      "Report_Name_String": "Get_Employee",
      }
      this.GlobalAPI.postData(obj).subscribe((data:any) => {
        console.log("Employee list",data);
        data.forEach((ele:any)=>{})
        
      });
  }

  getSkillList(){
    const obj = {
      "SP_String": "SP_HR_Evaluate_For_Training",
      "Report_Name_String": "Get_Skill",
      }
      this.GlobalAPI.postData(obj).subscribe((data:any) => {
        console.log("Skill list",data);
        data.forEach((ele:any)=>{})
        
      });
  }

  getGradeList(){
    const obj = {
      "SP_String": "SP_HR_Evaluate_For_Training",
      "Report_Name_String": "Get_Skill_Grade",
      }
      this.GlobalAPI.postData(obj).subscribe((data:any) => {
        console.log("Grade list",data);
        data.forEach((ele:any)=>{})
        
      });
  }

  addEvaluation(valid: any) {
    this.evalutationFormSubmitted = true;
    if (valid) {
      this.evalutationFormSubmitted = false;
      let dept_Name = this.departmentList.find((ele: any) => ele.value == this.objEvaluationForTraning.Dept_ID);
      let emp_Name = this.employeeList.find((ele: any) => ele.value == this.objEvaluationForTraning.Emp_ID);
      let skill_Name = this.skillList.find((ele: any) => ele.value == this.objEvaluationForTraning.Skill_ID);
      let grade_Name = this.gradeList.find((ele: any) => ele.value == this.objEvaluationForTraning.Grade_ID);
    }
  }

  deleteEvaluation() {

  }

  SaveEvaluation() {

  }
  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  onConfirm() {
  }

  onReject() {
    this.CompacctToast.clear("c");
  }

  clearData() {

  }

}

class EvaluationForTraning {
  Evaluation_Date: any;
  Dept_ID: any;
  Dept_Name: any;
  Emp_ID: any;
  Emp_Name: any;
  Skill_ID: any;
  Skill_Name: any;
  Grade_ID: any;
  Grade: any;
  Remarks: any;
  Created_by: any;
}
