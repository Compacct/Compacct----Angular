import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-hr-training',
  templateUrl: './hr-training.component.html',
  styleUrls: ['./hr-training.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HrTrainingComponent implements OnInit {
  tabIndexToView: number = 0;
  Items: any = ['BROWSE', 'CREATE'];
  Spinner: boolean = false;
  buttonname: string = 'Save';
  HR_Training_From_Submit: boolean = false;
  From_Date: Date = new Date();
  To_Date: Date = new Date();
  initDate: any = [];
  departmentList: any = [];
  locationList: any = [];
  TrainerList: any = [];
  AttandeesList: any = [];
  TableArray: any = [];
  Deferred_Or_Not: string = "";
  Deferred_Remarks: string = "";
  Created_By: number = 0;
  editMode: boolean = false;
  Save_From_Submit: boolean = false;
  Fin_Year_ID: any;
  browseTableData: any = [];
  browseTableFilterField: any = [];
  traningNo: string = '';
  selectedEmp_Attendees_ID: any = [];

  objTraining = new Training();
  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "HR Traning",
      Link: "JOH HR --> HR Traning"
    });
    this.Created_By = this.commonApi.CompacctCookies.User_ID;
    this.Fin_Year_ID = Number(this.commonApi.CompacctCookies.Fin_Year_ID);
    this.getDeptList();
    this.getLocationList();
    this.getBrowseData();
  }

  getBrowseData() {
    const obj = {
      "SP_String": "SP_HR_Txn_Training_Module",
      "Report_Name_String": "Browse_HR_Txn_Training_Module",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log('berowse data', data);
      this.browseTableData = data;
      if (data.length) {
        this.browseTableFilterField = Object.keys(data[0])
      }
    })
  }

  Edit(col: any) {
    console.log('edit data', col);
    if (col.Training_No) {
      this.traningNo = col.Training_No;
      this.tabIndexToView = 1;
      this.editMode = true;
      this.Items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      const obj = {
        "SP_String": "SP_HR_Txn_Training_Module",
        "Report_Name_String": "Get_HR_Txn_Training_Module_For_Edit",
        "Json_Param_String": JSON.stringify([{ "Training_No": col.Training_No }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log('edit res', data);
        if (data.length) {
          this.initDate = [new Date(data[0].Training_From_Date), new Date(data[0].Training_To_Date)];
          this.objTraining.Training_Mode = data[0].Training_Mode;
          this.objTraining.Training_Details = data[0].Training_Details;
          this.objTraining.Dept_ID = data[0].Dept_ID;
          this.objTraining.Location_ID = data[0].Location_ID;
          this.getTrainerList(data[0].Dept_ID, data[0].Location_ID);
          this.getAttandeesList(data[0].Dept_ID, data[0].Location_ID);
          this.objTraining.Learning_Object = data[0].Learning_Object;
          this.Deferred_Or_Not = data[0].Deferred_Or_Not;
          this.Deferred_Remarks = data[0].Deferred_Remarks;
          setTimeout(() => {
            this.objTraining.Emp_Trainer_ID = data[0].Emp_Trainer_ID;
          }, 500);
          data.forEach((ele: any) => {
            this.TableArray.push({
              "Training_No": ele.Training_No,
              "Training_From_Date": this.DateService.dateConvert(ele.Training_From_Date),
              "Training_To_Date": this.DateService.dateConvert(ele.Training_To_Date),
              "Training_Mode": ele.Training_Mode,
              "Training_Details": ele.Training_Details,
              "Dept_ID": ele.Dept_ID,
              "Dept_Name": ele.Dept_Name,
              "Location_ID": ele.Location_ID,
              "Location_Name": ele.Location_Name,
              "Emp_Trainer_ID": ele.Emp_Trainer_ID,
              "Emp_Trainer_Name": ele.Emp_Trainer_Name,
              "Emp_Attendees_ID": ele.Emp_Attendees_ID,
              "Emp_Attendees_Name": ele.Emp_Attendees_Name,
              "Learning_Object": ele.Learning_Object,
            });
          });
        }
      });
    }
  }

  getDateRange(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.From_Date = dateRangeObj[0];
      this.To_Date = dateRangeObj[1];
    }
  }

  getDeptList() {
    const obj = {
      "SP_String": "SP_HR_Txn_Training_Module",
      "Report_Name_String": "Get_Department",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log('Department List', data);
      data.forEach((ele: any) => {
        ele["label"] = ele.Dept_Name;
        ele["value"] = ele.Dept_ID;
      });
      this.departmentList = data;
    });
  }

  getLocationList() {
    const obj = {
      "SP_String": "SP_HR_Txn_Training_Module",
      "Report_Name_String": "Get_Location",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log('Location List', data);
      data.forEach((ele: any) => {
        ele["label"] = ele.Location;
        ele["value"] = ele.Location_ID;
      });
      this.locationList = data;
    });
  }

  callDropDowns(deptId: number, locId: number) {
    this.getTrainerList(deptId, locId);
    this.getAttandeesList(deptId, locId);
  }

  getTrainerList(deptId: number, locId: number) {
    this.objTraining.Emp_Trainer_ID = undefined;
    this.TrainerList = [];
    if (deptId && locId) {
      const obj = {
        "SP_String": "SP_HR_Txn_Training_Module",
        "Report_Name_String": "Get_Trainer",
        "Json_Param_String": JSON.stringify([{ "Dept_ID": deptId, "Location_ID": locId }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log('Trainer List', data);
        data.forEach((ele: any) => {
          ele["label"] = ele.Emp_Name;
          ele["value"] = ele.Emp_ID;
        });
        this.TrainerList = data;
      });
    }
  }

  getAttandeesList(deptId: number, locId: number) {
    this.selectedEmp_Attendees_ID = [];
    this.AttandeesList = [];
    if (deptId && locId) {
      const obj = {
        "SP_String": "SP_HR_Txn_Training_Module",
        "Report_Name_String": "Get_Attendees",
        "Json_Param_String": JSON.stringify([{ "Dept_ID": deptId, "Location_ID": locId }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log('Attandees List', data);
        data.forEach((ele: any) => {
          ele["label"] = ele.Emp_Name;
          ele["value"] = ele.Emp_ID;
        });
        this.AttandeesList = data;
      });
    }
  }

  AddRow(valid: any) {
    this.HR_Training_From_Submit = true;
    if (valid) {
      let duplicateCheck = this.TableArray.filter(element => this.selectedEmp_Attendees_ID.includes(element.Emp_Attendees_ID));
      if (!duplicateCheck.length) {
        // this.TableArray = [];
        this.HR_Training_From_Submit = false;
        let deptName = this.departmentList.find((ele: any) => ele.Dept_ID == this.objTraining.Dept_ID);
        let locName = this.locationList.find((ele: any) => ele.Location_ID == this.objTraining.Location_ID);
        let trainerName = this.TrainerList.find((ele: any) => ele.Emp_ID == this.objTraining.Emp_Trainer_ID);
        this.objTraining.Training_No = this.editMode ? this.traningNo : "A";
        this.objTraining.Training_From_Date = this.DateService.dateConvert(this.From_Date);
        this.objTraining.Training_To_Date = this.DateService.dateConvert(this.To_Date);
        this.objTraining.Dept_Name = deptName ? deptName.Dept_Name : undefined;
        this.objTraining.Location_Name = locName ? locName.Location : undefined;
        this.objTraining.Emp_Trainer_Name = trainerName ? trainerName.Emp_Name : undefined;
        this.selectedEmp_Attendees_ID.forEach((ele: any) => {
          let eleName = this.AttandeesList.find((element: any) => element.Emp_ID == ele);
          this.TableArray.push({
            "Training_No": this.objTraining.Training_No,
            "Training_From_Date": this.objTraining.Training_From_Date,
            "Training_To_Date": this.objTraining.Training_To_Date,
            "Training_Mode": this.objTraining.Training_Mode,
            "Training_Details": this.objTraining.Training_Details,
            "Dept_ID": this.objTraining.Dept_ID,
            "Dept_Name": this.objTraining.Dept_Name,
            "Location_ID": this.objTraining.Location_ID,
            "Location_Name": this.objTraining.Location_Name,
            "Emp_Trainer_ID": this.objTraining.Emp_Trainer_ID,
            "Emp_Trainer_Name": this.objTraining.Emp_Trainer_Name,
            "Emp_Attendees_ID": ele,
            "Emp_Attendees_Name": eleName.Emp_Name,
            "Learning_Object": this.objTraining.Learning_Object
          });
        });
        this.selectedEmp_Attendees_ID = [];
      }
      else {
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Duplicate Error"
        });
      }
      console.log('table Array', this.TableArray);
    }
  }

  deleteTableRow(i: any) {
    this.TableArray.splice(i, 1);
  }

  SaveFormData(valid: any) {
    this.Save_From_Submit = true;
    if (valid && this.TableArray.length) {
      this.Save_From_Submit = false;
      this.Spinner = true;
      let saveObj: any = [];
      this.TableArray.forEach((ele: any) => {
        saveObj.push({ ...ele, ...{ "Deferred_Or_Not": this.Deferred_Or_Not, "Deferred_Remarks": this.Deferred_Remarks, "Created_By": this.Created_By, "Fin_Year_ID": this.Fin_Year_ID } });
      });
      console.log('save obj', saveObj);
      const obj = {
        "SP_String": "SP_HR_Txn_Training_Module",
        "Report_Name_String": "Save_HR_Txn_Training_Module",
        "Json_Param_String": JSON.stringify(saveObj)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log('save res', data);
        this.Spinner = false;
        if (data[0].Column1) {
          this.tabIndexToView = 0;
          this.getBrowseData();
          this.clearData();
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Data Save successfully",
            detail: "Successfull"
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
    this.Items = ['BROWSE', 'CREATE'];
    this.initDate = [new Date(), new Date()];
    this.Spinner = false;
    this.buttonname = 'Save';
    this.HR_Training_From_Submit = false;
    this.From_Date = new Date();
    this.To_Date = new Date();
    this.TrainerList = [];
    this.AttandeesList = [];
    this.TableArray = [];
    this.selectedEmp_Attendees_ID = [];
    this.Deferred_Or_Not = "";
    this.Deferred_Remarks = "";
    this.editMode = false;
    this.Save_From_Submit = false;
    this.traningNo = '';
    this.objTraining = new Training();
  }


}
class Training {
  Training_No: any;
  Training_From_Date: any;
  Training_To_Date: any;
  Training_Mode: any;
  Training_Details: any;
  Dept_ID: any;
  Dept_Name: any;
  Location_ID: any;
  Location_Name: any;
  Emp_Trainer_ID: any;
  Emp_Trainer_Name: any;
  Emp_Attendees_Name: any;
  Learning_Object: any;
}


