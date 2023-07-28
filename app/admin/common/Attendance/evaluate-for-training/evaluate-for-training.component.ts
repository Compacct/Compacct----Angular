import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

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
  searchSpinner: boolean = false;
  buttonname: string = 'Save';
  From_Date: Date = new Date();
  To_Date: Date = new Date();
  initDate: any = [];
  tableHeader: any = [];
  tableData: any = [];
  evaluattion_Date: Date = new Date();
  departmentList: any = [];
  employeeList: any = [];
  skillList: any = [];
  gradeList: any = [];
  trainerLists: any = [];
  TableArray: any = [];
  Remarks: string = "";
  skill_Name: string = "";
  Created_by: number = 0;
  skillSpinner: boolean = false;
  addSkillFormSubmit: boolean = false;
  evalutationFormSubmitted: boolean = false;
  DisplayAddSkillModel: boolean = false;
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
      Link: "JOH HR--> Evaluate For Training"
    });
    this.Created_by = this.commonApi.CompacctCookies.User_ID;
    this.getBrowseData();
    this.getDepartmentList();
    this.getSkillList();
    this.getGradeList();
    this.getTrainerList();
  }

  getDateRange(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.From_Date = dateRangeObj[0];
      this.To_Date = dateRangeObj[1];
    }
  }

  getBrowseData() {
    this.tableData = [];
    this.searchSpinner = true;
    const obj = {
      "SP_String": "SP_HR_Evaluate_For_Training",
      "Report_Name_String": "Browse_Data",
      "Json_Param_String": JSON.stringify([{ "From_Date": this.DateService.dateConvert(this.From_Date), "To_Date": this.DateService.dateConvert(this.To_Date) }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("Browse Data", data);
      this.searchSpinner = false;
      if (data.length) {
        this.tableHeader = Object.keys(data[0]);
        this.tableData = data;
        this.tableHeader.splice(0, 1);
      }
    });
  }

  Edit(col: any) {
    if (col.Dept_ID && col.Evaluation_Date) {
      this.tabIndexToView = 1;
      this.Items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      const obj = {
        "SP_String": "SP_HR_Evaluate_For_Training",
        "Report_Name_String": "Get_Data_For_Edit",
        "Json_Param_String": JSON.stringify([{ "Dept_ID": col.Dept_ID, "Evaluation_Date": this.DateService.dateConvert(col.Evaluation_Date) }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log("edit res", data);
        this.evaluattion_Date = new Date(data[0].Evaluation_Date);
        this.objEvaluationForTraning.Dept_ID = data[0].Dept_ID;
        this.Remarks = data[0].Remarks;
        data.forEach((ele: any) => {
          this.TableArray.push({
            "Evaluation_Date": this.DateService.dateConvert(ele.Evaluation_Date),
            "Dept_ID": ele.Dept_ID,
            "Dept_Name": ele.Dept_Name,
            "Emp_ID": ele.Emp_ID,
            "Emp_Name": ele.Emp_Name,
            "Skill_ID": ele.Skill_ID,
            "Skill_Name": ele.Skill_Name,
            "Grade_ID": ele.Grade_ID,
            "Grade": ele.Grade,
            "Trainer_ID": ele.Trainer_ID,
            "Trainer_Name": ele.Trainer_Name
          });
        })
        console.log("table Array", this.TableArray);
      });
    }
  }

  getDepartmentList() {
    const obj = {
      "SP_String": "SP_HR_Evaluate_For_Training",
      "Report_Name_String": "Get_Department",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("department list", data);
      data.forEach((ele: any) => {
        ele["label"] = ele.Dept_Name,
          ele["value"] = ele.Dept_ID
      })
      this.departmentList = data;
    });
  }

  getEmployeeList(id: any) {
    this.objEvaluationForTraning.Emp_ID = undefined;
    this.objEvaluationForTraning.Date_of_Joining = undefined;
    this.objEvaluationForTraning.Present_Status = undefined;
    this.employeeList = [];
    if (id) {
      const obj = {
        "SP_String": "SP_HR_Evaluate_For_Training",
        "Report_Name_String": "Get_Employee",
        "Json_Param_String": JSON.stringify([{ "Dept_ID": id }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log("Employee list", data);
        data.forEach((ele: any) => {
          ele["label"] = ele.Emp_Name,
            ele["value"] = ele.Emp_ID
        })
        this.employeeList = data;
      });
    }
  }

  getSkillList() {
    const obj = {
      "SP_String": "SP_HR_Evaluate_For_Training",
      "Report_Name_String": "Get_Skill",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("Skill list", data);
      data.forEach((ele: any) => {
        ele["label"] = ele.Skill_Name,
          ele["value"] = ele.Skill_ID
      })
      this.skillList = data;
    });
  }

  getGradeList() {
    const obj = {
      "SP_String": "SP_HR_Evaluate_For_Training",
      "Report_Name_String": "Get_Skill_Grade",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("Grade list", data);
      data.forEach((ele: any) => {
        ele["label"] = ele.Grade,
          ele["value"] = ele.Grade_ID
      })
      this.gradeList = data;
    });
  }

  getTrainerList() {
    const obj = {
      "SP_String": "SP_HR_Evaluate_For_Training",
      "Report_Name_String": "Get_Trainer",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("Trainer list", data);
      data.forEach((ele: any) => {
        ele["label"] = ele.Emp_Name,
          ele["value"] = ele.Emp_ID
      })
      this.trainerLists = data;
    });
  }

  changeEmployee(id: any) {
    this.objEvaluationForTraning.Date_of_Joining = undefined;
    this.objEvaluationForTraning.Present_Status = undefined;
    if (id) {
      let tempEmp = this.employeeList.find((ele: any) => ele.Emp_ID == id);
      this.objEvaluationForTraning.Date_of_Joining = tempEmp ? tempEmp.Emp_Joining_Dt : undefined;
      this.objEvaluationForTraning.Present_Status = tempEmp ? tempEmp.Present_Status : undefined;
    }
  }

  addEvaluation(valid: any) {
    this.evalutationFormSubmitted = true;
    if (valid) {
      this.evalutationFormSubmitted = false;
      const duplicateEmp = this.TableArray.find((ele: any) => {
        return ele.Emp_ID == this.objEvaluationForTraning.Emp_ID && ele.Skill_ID == this.objEvaluationForTraning.Skill_ID;
      });
      console.log("duplicate Key", duplicateEmp);
      if (!duplicateEmp) {
        let dept_Name = this.departmentList.find((ele: any) => ele.value == this.objEvaluationForTraning.Dept_ID);
        let emp_Name = this.employeeList.find((ele: any) => ele.value == this.objEvaluationForTraning.Emp_ID);
        let skill_Name = this.skillList.find((ele: any) => ele.value == this.objEvaluationForTraning.Skill_ID);
        let grade_Name = this.gradeList.find((ele: any) => ele.value == this.objEvaluationForTraning.Grade_ID);
        let trainer_Name = this.trainerLists.find((ele: any) => ele.value == this.objEvaluationForTraning.Trainer_ID);
        this.TableArray.push({
          "Evaluation_Date": this.DateService.dateConvert(this.evaluattion_Date),
          "Dept_ID": this.objEvaluationForTraning.Dept_ID,
          "Dept_Name": dept_Name ? dept_Name.label : undefined,
          "Emp_ID": this.objEvaluationForTraning.Emp_ID,
          "Emp_Name": emp_Name ? emp_Name.label : undefined,
          "Skill_ID": this.objEvaluationForTraning.Skill_ID,
          "Skill_Name": skill_Name ? skill_Name.label : undefined,
          "Grade_ID": this.objEvaluationForTraning.Grade_ID,
          "Grade": grade_Name ? grade_Name.label : undefined,
          "Trainer_ID": this.objEvaluationForTraning.Trainer_ID,
          "Trainer_Name": trainer_Name ? trainer_Name.label : undefined
        });
        console.log("Table Array", this.TableArray);
        this.objEvaluationForTraning.Emp_ID = undefined;
        this.objEvaluationForTraning.Date_of_Joining = undefined;
        this.objEvaluationForTraning.Present_Status = undefined;
        this.objEvaluationForTraning.Skill_ID = undefined;
        this.objEvaluationForTraning.Grade_ID = undefined;
        this.objEvaluationForTraning.Trainer_ID = undefined;
        this.evalutationFormSubmitted = false;
      }
      else {
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Duplication Error"
        });
      }
    }
  }

  deleteEvaluation(i: any) {
    this.TableArray.splice(i, 1)
  }

  SaveEvaluation() {
    this.Spinner = true;
    let saveObj: any = [];
    this.TableArray.forEach((ele: any) => {
      saveObj.push({ ...ele, ...{ "Remarks": this.Remarks, "Created_by": this.Created_by } })
    })
    console.log("save Obj", saveObj);
    const obj = {
      "SP_String": "SP_HR_Evaluate_For_Training",
      "Report_Name_String": "Save_Data",
      "Json_Param_String": JSON.stringify(saveObj)
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("save response", data);
      this.Spinner = false;
      if (data[0].Column1 == "Done") {
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Data Save Succesfully",
          detail: "Succesfully Save"
        });
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
          detail: "Something Went Wrong"
        });
      }
    });

  }

  openSkillModel() {
    this.DisplayAddSkillModel = true;
  }

  addSkill(valid: any) {
    this.addSkillFormSubmit = true;
    if (valid) {
      this.addSkillFormSubmit = false;
      this.skillSpinner = true;
      const obj = {
        "SP_String": "SP_HR_Evaluate_For_Training",
        "Report_Name_String": "Create_Skill",
        "Json_Param_String": JSON.stringify([{"Skill_Name":this.skill_Name}])
        }
        this.GlobalAPI.postData(obj).subscribe((data:any) => {
          console.log('add skill res', data);
          this.skillSpinner = false;
          if(data[0].Column1){
            this.DisplayAddSkillModel = false;
            this.getSkillList();
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Skill",
              detail: "Succesfully Added"
            });
          }
          else {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Something Went Wrong"
            });
          }
        });
    }
  }

  closeSkillModel() {
    this.DisplayAddSkillModel = false;
    this.skill_Name = '';
    this.addSkillFormSubmit = false;
  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }


  clearData() {
    this.Items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.TableArray = [];
    this.objEvaluationForTraning = new EvaluationForTraning();
    this.evaluattion_Date = new Date();
    this.Remarks = "";
    this.Spinner = false;
    this.searchSpinner = false;
    this.evalutationFormSubmitted = false;
  }
}

class EvaluationForTraning {
  Evaluation_Date: any;
  Dept_ID: any;
  Dept_Name: any;
  Emp_ID: any;
  Emp_Name: any;
  Date_of_Joining: any;
  Present_Status: any;
  Skill_ID: any;
  Skill_Name: any;
  Grade_ID: any;
  Grade: any;
  Trainer_ID: any;
  Trainer_Name: any;
}
