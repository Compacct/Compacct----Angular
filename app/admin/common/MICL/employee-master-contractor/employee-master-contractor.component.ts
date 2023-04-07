import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-master-contractor',
  templateUrl: './employee-master-contractor.component.html',
  styleUrls: ['./employee-master-contractor.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeMasterContractorComponent implements OnInit {
  tabIndexToView = 0;
  contractorList: any = [];
  employeeList: any = [];
  allEmployeeData: any = [];
  employeeDisabled: boolean = false;
  Spinner: boolean = false;
  is_Biometric: boolean = false;
  emp_creation: boolean = false;
  buttonname: string = 'Update';
  employeeMasterFormSubmit: boolean = false;
  Employee_Id: any;
  Sub_Ledger_ID: any;
  User_Type: any;
  Del_Right: any;

  objEmployee = new Employee();

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Employee Master Contractor",
      Link: "MICL --> Employee_Master_Contractor"
    });
    this.User_Type = this.commonApi.CompacctCookies.User_Type;
    this.Del_Right = this.commonApi.CompacctCookies.Del_Right;
    console.log(this.User_Type, this.Del_Right);
    this.getContractorList();
  }

  getContractorList() {
    const obj = {
      "SP_String": "Sp_HR_Employee_Master_Contractor",
      "Report_Name_String": "Get_Contractor_List"

    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log('Contractor List>>', data);
      if (data.length) {
        data.forEach((ele) => {
          this.contractorList.push({
            'label': ele.Sub_Ledger_Name,
            'value': ele.Sub_Ledger_ID
          })
        });
      }
    });
  }

  getEmpList(contractorID) {
    this.objEmployee = new Employee();
    this.is_Biometric = false;
    this.employeeList = [];
    this.allEmployeeData = [];
    if (contractorID) {
      console.log('Sub ledger Id', contractorID);
      const obj = {
        "SP_String": "Sp_HR_Employee_Master_Contractor",
        "Report_Name_String": "Get_Employee_List",
        "Json_Param_String": JSON.stringify([{ Sub_Ledger_ID: contractorID }])
      };
      this.GlobalAPI.getData(obj).subscribe((data) => {
        console.log('Employee List', data);
        this.allEmployeeData = data;
        data.forEach((ele: any) => {
          this.employeeList.push({
            'label': ele.Emp_Name,
            'value': ele.Emp_ID
          })
        })
      });
    }
    else {
      this.employeeList = [];
      this.objEmployee = new Employee();
      this.is_Biometric = false;
      this.Employee_Id = undefined;
    }
  }

  getEmpData(Employee_Id) {
    if (Employee_Id) {
      console.log('Employee Id>>', Employee_Id)
      let EmpData = this.allEmployeeData.find((data: any) => {
        return Number(data.Emp_ID) == Number(Employee_Id)
      })
      console.log('particular employee data', EmpData);
      this.objEmployee = EmpData;
      if (this.objEmployee.Is_Biometric == 'Y') {
        this.is_Biometric = true
      }
      else {
        this.is_Biometric = false;
      }
    }
    else {
      this.objEmployee = new Employee();
      this.is_Biometric = false;
    }
  }

  createEmp() {
    this.emp_creation = true;
    this.employeeList = [];
    this.allEmployeeData = [];
    this.objEmployee = new Employee();
    this.is_Biometric = false;
    this.buttonname = 'Create';
    this.employeeMasterFormSubmit = false;
    this.Sub_Ledger_ID = undefined;
    this.Employee_Id = undefined;
  }

  SaveEmployee(valid) {
    this.employeeMasterFormSubmit = true;
    if (valid) {
      console.log('form valid');
      this.employeeMasterFormSubmit = false;
      this.Spinner = true;
      // Craeting New Employee
      if (this.emp_creation) {
        this.objEmployee.Sub_Ledger_ID = this.Sub_Ledger_ID;
        this.objEmployee.Emp_ID = 0;
        if (this.is_Biometric) {
          this.objEmployee.Is_Biometric = 'Y';
        }
        else {
          this.objEmployee.Is_Biometric = 'N';
        }
        console.log('create employee data>>>', this.objEmployee);
        const obj = {
          "SP_String": "Sp_HR_Employee_Master_Contractor",
          "Report_Name_String": "Save_Employee",
          "Json_Param_String": JSON.stringify([this.objEmployee])
        }
        this.GlobalAPI.postData(obj).subscribe((data) => {
          console.log('Create Response>>', data);
          if (data[0].Column1 == 'Done') {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Employee Created Succesfully ",
              detail: "Succesfully Created"
            });
            this.Spinner = false;
            this.clearData();
          }

          else if (data[0].Column1 == 'Already Exists This Emp Code') {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Already Exists This Emp Code"
            });
            this.Spinner = false;
          }
          else {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Something Wrong"
            });
            this.Spinner = false;
          }
        });
      }

      // Updating Employee
      else {
        this.objEmployee.Sub_Ledger_ID = this.Sub_Ledger_ID;
        if (this.is_Biometric) {
          this.objEmployee.Is_Biometric = 'Y';
        }
        else {
          this.objEmployee.Is_Biometric = 'N';
        }
        console.log('update employee data>>', this.objEmployee);
        const obj = {
          "SP_String": "Sp_HR_Employee_Master_Contractor",
          "Report_Name_String": "Update_Employee",
          "Json_Param_String": JSON.stringify([this.objEmployee])
        }
        this.GlobalAPI.postData(obj).subscribe((data) => {
          console.log('Update Response>>', data);

          if (data[0].Column1 == 'Done') {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Employee Updated Succesfully",
              detail: "Succesfully Updated"
            });
            this.Spinner = false;
            // this.clearData();
          }

          else if (data[0].Column1 == 'Already Exists This Emp Code') {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Already Exists This Emp Code"
            });
            this.Spinner = false;
          }

          else {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Something Wrong"
            });
            this.Spinner = false;
          }
        });
      }
    }
  }

  clearData() {
    this.emp_creation = false;
    this.objEmployee = new Employee();
    this.is_Biometric = false;
    this.employeeMasterFormSubmit = false;
    this.employeeList = [];
    this.allEmployeeData = [];
    this.buttonname = 'Update';
    this.Sub_Ledger_ID = undefined;
    this.Employee_Id = undefined;
  }

  exportexcel(): void {
    console.log('export excel works');
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.allEmployeeData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Employee_Report.xlsx');
  }

  TabClick(e: any) {
  }

  onConfirm() {
  }

  onReject() {
  }

}

class Employee {
  Sub_Ledger_ID: any;
  Emp_ID: any;
  Emp_Code: any;
  Emp_Name: any;
  Adhar_No: any;
  PAN_No: any;
  Mobile: any;
  Emergency_Contact_Person: any;
  Emergency_Contact_Mobile: any;
  Is_Biometric: any;
}
