import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';
import { FileUpload } from 'primeng/primeng';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { log } from 'console';

@Component({
  selector: 'app-expense-tracking',
  templateUrl: './expense-tracking.component.html',
  styleUrls: ['./expense-tracking.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ExpenseTrackingComponent implements OnInit {
  tabIndexToView: number = 0;
  Items: any = ['Create Expense', 'Pending Authorization'];
  Spinner: boolean = false;
  buttonname: string = 'Create';
  employeeFormSubmit: boolean = false;
  expenseTrackingFormSubmit: boolean = false;
  objExpenseTracking = new ExpenseTracking();
  EmplyList: any = [];
  ExpTypeList: any = [];
  empId: any;
  txn_Date: Date = new Date()
  file: boolean = false;
  upload: boolean = true;
  pendingExpList: any = [];
  pendingExpListHeader: any = [];
  deleteData: any;

  DisplayAuthorizePopup: boolean = false
  authData: any;
  authAmount: any;
  authNote: any;
  authFormSubmit: boolean = false;
  authSpinner: boolean = false;
  @ViewChild("UploadFile", { static: false }) UploadFile!: FileUpload;

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService,
    private compact: CompacctCommonApi,

  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Expense Tracking",
      Link: "JOH_HR --> Expense Tracking"
    });
    this.getEMP();
    this.getExpType();
  }

  getEMP() {
    this.EmplyList = []
    const obj = {
      "SP_String": "SP_Expense_Tracking",
      "Report_Name_String": "Get_Employee",
      "Json_Param_String": JSON.stringify({ "User_ID": this.compact.CompacctCookies.User_ID })
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("Emp List  ===", data);
      if (data.length) {
        this.EmplyList = data;
        this.empId = this.EmplyList.length == 1 ? this.EmplyList[0].Emp_ID : undefined;
        this.getPendingExp()
      }
    })
  }
  getExpType() {
    this.EmplyList = []
    const obj = {
      "SP_String": "SP_Expense_Tracking",
      "Report_Name_String": "Get_Expence_Type"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("exp type List  ===", data);
      if (data.length) {
        this.ExpTypeList = data;
      }
    })
  }

  fileSelect() {
    this.file = true;
  }

  ClearUploadInpt(elem: any) {
    if (this.objExpenseTracking.Pic_File_Name) {
      this.upload = true;
      this.objExpenseTracking.Pic_File_Name = undefined;
    }
    else {
      this.UploadFile.clear();
      this.file = false;
    }
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
          this.objExpenseTracking.Pic_File_Name = data.file_url;
          this.ngxService.stop();
          this.upload = false;
        })
    }
  }

  showDoc(link: any) {
    window.open(link);
  }

  saveData(valid1: any, valid2: any) {
    this.employeeFormSubmit = true;
    this.expenseTrackingFormSubmit = true;
    console.log("valid", valid1, valid2);

    if (valid1 && valid2) {
      let repName: string = ""
      let msg: string = ""
      if (this.objExpenseTracking.Expence_ID) {
        repName = "Create_Expense_Tracking"
        msg = "Upadte"
      }
      else {
        repName = "Create_Expense_Tracking"
        msg = "Save"
      }
      this.employeeFormSubmit = false;
      this.expenseTrackingFormSubmit = false;
      this.Spinner = true;

      this.objExpenseTracking.Emp_ID = this.empId;
      this.objExpenseTracking.Exp_Amount = Number(this.objExpenseTracking.Exp_Amount);
      this.objExpenseTracking.Txn_Date = this.DateService.dateConvert(this.txn_Date);
      console.log('save obj', this.objExpenseTracking);
      const obj = {
        "SP_String": "SP_Expense_Tracking",
        "Report_Name_String": repName,
        "Json_Param_String": JSON.stringify(this.objExpenseTracking)
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log('save res', data);
        this.Spinner = false;
        if (data[0].Expence_ID) {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Expense Tracking ",
            detail: "Succesfully" + msg
          });
          this.getPendingExp();
          this.tabIndexToView = 0;
          this.clearData();
        }
        else {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Somethig Went Wrong"
          });
        }
      });
    }
  }

  getPendingExp() {
    // if (this.empId) {
    this.pendingExpList = []
    this.pendingExpListHeader = []
    const obj = {
      "SP_String": "SP_Expense_Tracking",
      "Report_Name_String": "Get_Expense_Tracking",
      "Json_Param_String": JSON.stringify({ "Status": "Pending", "Emp_ID": this.empId })
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("Pending Exp List  ===", data);
      if (data.length) {
        this.pendingExpList = data;
        this.pendingExpListHeader = Object.keys(data[0]);
      }
    })
    // }
  }

  edit(col: any) {
    if (col) {
      this.empId = col.Emp_ID
      this.objExpenseTracking.Emp_ID = col.Emp_ID;
      this.objExpenseTracking.Exp_Amount = col.Exp_Amount;
      this.objExpenseTracking.Exp_Note = col.Exp_Note;
      this.objExpenseTracking.Expence_ID = col.Expence_ID;
      this.objExpenseTracking.Expence_Type_ID = col.Expence_Type_ID;
      this.objExpenseTracking.Pic_File_Name = col.Pic_File_Name;
      this.txn_Date = new Date(col.Txn_Date);
      this.file = true;
      this.upload = false;
      this.tabIndexToView = 0;
      this.buttonname = "Update"
    }

  }

  delte(col: any) {
    this.CompacctToast.clear();
    this.CompacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
    });
    this.deleteData = { ...col }
  }

  Authorize(col: any) {
    if (col) {
      this.DisplayAuthorizePopup = true;
      this.authData = { ...col }
    }
  }

  confirmAuthorize(valid: any) {
    this.authFormSubmit = true;
    if (valid) {
      this.authFormSubmit = false;
      this.authSpinner = true;
      const tempData = { 
        "Expence_ID": this.authData.Expence_ID, 
        "Auth_Amount": Number(this.authAmount), 
        "Auth_Note": this.authNote, 
        "Auth_Status": "Authorize" 
      };
      console.log("auth data",tempData);
      
      const obj = {
        "SP_String": "SP_Expense_Tracking",
        "Report_Name_String": "Update_Authorize",
        "Json_Param_String": JSON.stringify(tempData)
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("auth res  ===", data);
        this.authSpinner = false;
        if (data[0].Column1 == "success") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Success",
            detail: "Succesfully Authorized"
          });
          this.getPendingExp();
          this.DisplayAuthorizePopup = false;
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


      })
    }

  }

  UnAuthorize(col: any) {

  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  onConfirm() {
    if (this.deleteData.Expence_ID) {
      this.pendingExpList = []
      this.pendingExpListHeader = []
      const obj = {
        "SP_String": "SP_Expense_Tracking",
        "Report_Name_String": "Delete_Expense_Tracking",
        "Json_Param_String": JSON.stringify({ "Expence_ID": this.deleteData.Expence_ID })
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("delete res  ===", data);
        if (data[0].Column1 == "success") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Success",
            detail: "Succesfully Deleted"
          });
          this.getPendingExp();
          this.onReject();
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


      })
    }
  }

  onReject() {
    this.CompacctToast.clear("c");
    this.deleteData = {};
  }

  clearData() {
    this.Spinner = false;
    this.buttonname = 'Create';
    this.employeeFormSubmit = false;
    this.expenseTrackingFormSubmit = false;
    this.objExpenseTracking = new ExpenseTracking();
    this.txn_Date = new Date()
    this.file = false;
    this.upload = true;
    this.deleteData = {};
  }

}

class ExpenseTracking {
  Expence_ID: any = 0;
  Emp_ID: any;
  Expence_Type_ID: any;
  Exp_Amount: any;
  Exp_Note: any;
  Pic_File_Name: any;
  Txn_Date: any;
  Status: any = "Pending";
}
