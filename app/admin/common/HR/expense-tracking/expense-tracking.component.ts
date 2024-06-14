import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
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
  // Tab Panel Properties
  tabIndexToView: number = 0;
  Items: any = ['CREATE EXPENSE', 'PENDING AUTHORIZATION', ' AUTHORIZED EXPENSE', ' UNAUTHORISED EXPENSE'];
  // Save Form Properties
  Spinner: boolean = false;
  buttonname: string = 'Create';
  employeeExpenseFormSubmit: boolean = false;
  expenseTrackingFormSubmit: boolean = false;
  // Array List
  EmployeeList: any = [];
  ExpTypeList: any = [];
  // Object Decalarations
  objExpenseTracking = new ExpenseTracking();
  // Other Proprties
  empId: any;
  txn_Date: Date = new Date()
  // File Upload Properties
  file: boolean = false;
  upload: boolean = true;
  // Pending Table List
  pendingExpList: any = [];
  pendingExpListHeader: any = [];
  // Auth Table List
  authExpList: any = [];
  authExpListHeader: any = [];
  // unauth Table List
  unAuthExpList: any = [];
  unAuthExpListHeader: any = [];
  // Delete Purpose Properties
  deleteData: any;
  // Authorize Releated Properties
  DisplayAuthorizePopup: boolean = false
  authData: any;
  authAmount: any;
  authNote: any;
  authFormSubmit: boolean = false;
  authSpinner: boolean = false;
  // Unauthorized Releated Properties
  DisplayUnAuthorizePopup: boolean = false
  unauthData: any;
  unauthNote: any;
  umauthFormSubmit: boolean = false;
  unauthSpinner: boolean = false;
  // Select Array for Approve
  selectedAuthorized: any = [];
  approveSpiner: boolean = false;
  // File upload property
  @ViewChild("UploadFile", { static: false }) UploadFile!: FileUpload;
  total_amt: number = 0;
  paymentDetailsPopup: boolean = false;
  payment_type: string = "";
  bank_name: string = "";
  bank_branch: string = "";
  chq_neft_no: string = "";
  chq_neft_date: Date = new Date();

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

  calTotal() {
    console.log(this.selectedAuthorized);
    this.total_amt = 0;
    if (this.selectedAuthorized.length) {
      this.selectedAuthorized.forEach(ele => {
        this.total_amt += Number(ele.Auth_Amount)
      });
    }
    return this.total_amt;
  }

  getEMP() {
    this.EmployeeList = [];
    const obj = {
      "SP_String": "SP_Expense_Tracking",
      "Report_Name_String": "Get_Employee",
      "Json_Param_String": JSON.stringify({ "User_ID": this.compact.CompacctCookies.User_ID })
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("Emp List  ===", data);
      if (data.length) {
        this.EmployeeList = data;
        this.empId = this.EmployeeList.length == 1 ? this.EmployeeList[0].Emp_ID : undefined;
        this.getPendingExp();
        this.getAuthExp();
        this.getUnAuthExp();
      }
    })
  }

  getExpType() {
    this.EmployeeList = []
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

  chnageEmp() {
    this.getPendingExp();
    this.getAuthExp();
    this.getUnAuthExp();
    this.clearData()
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
          console.log('upload response', data);
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
    this.employeeExpenseFormSubmit = true;
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
      this.employeeExpenseFormSubmit = false;
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
        if (data[0].Column1) {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Expense Tracking ",
            detail: "Succesfully" + msg
          });
          this.getPendingExp();
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
      this.tabIndexToView = 0;
      this.buttonname = "Update"
      if (col.Pic_File_Name) {
        this.file = true;
        this.upload = false;
      }
      // this.chnageEmp();
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

  Authorize(col: any) {
    if (col) {
      this.DisplayAuthorizePopup = true;
      this.authData = { ...col }
    }
  }

  cancelAuthorize() {
    this.DisplayAuthorizePopup = false;
    this.authData = {};
    this.authAmount = null;
    this.authNote = null;
    this.authFormSubmit = false;
    this.authSpinner = false;
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
      console.log("auth data", tempData);
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
          this.cancelAuthorize();
          this.getAuthExp();
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
    if (col) {
      this.DisplayUnAuthorizePopup = true;
      this.unauthData = { ...col }
    }
  }

  cancelUnAuthorize() {
    this.DisplayUnAuthorizePopup = false;
    this.unauthData = {};
    this.unauthNote = null;
    this.umauthFormSubmit = false;
    this.unauthSpinner = false;
  }

  confirmUnAuthorize(valid: any) {
    this.umauthFormSubmit = true;
    if (valid) {
      this.umauthFormSubmit = false;
      this.unauthSpinner = true;
      const tempData = {
        "Expence_ID": this.unauthData.Expence_ID,
        "Auth_Note": this.unauthNote,
        "Auth_Status": "Unauthorize"
      };
      console.log("auth data", tempData);
      const obj = {
        "SP_String": "SP_Expense_Tracking",
        "Report_Name_String": "Update_Authorize",
        "Json_Param_String": JSON.stringify(tempData)
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("auth res  ===", data);
        this.unauthSpinner = false;
        if (data[0].Column1 == "success") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Success",
            detail: "Succesfully UnAuthorized"
          });
          this.getPendingExp();
          this.cancelUnAuthorize();
          this.getUnAuthExp();
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

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  onReject() {
    this.CompacctToast.clear("c");
    this.deleteData = {};
  }

  clearData() {
    this.Spinner = false;
    this.buttonname = 'Create';
    this.employeeExpenseFormSubmit = false;
    this.expenseTrackingFormSubmit = false;
    this.objExpenseTracking = new ExpenseTracking();
    this.txn_Date = new Date()
    this.file = false;
    this.upload = true;
    this.deleteData = {};
    this.selectedAuthorized = [];
    this.total_amt = 0;
  }

  getAuthExp() {
    this.authExpList = []
    this.authExpListHeader = []
    const obj = {
      "SP_String": "SP_Expense_Tracking",
      "Report_Name_String": "Get_Expense_Tracking",
      "Json_Param_String": JSON.stringify({ "Status": "Authorized", "Emp_ID": this.empId })
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("auth Exp List  ===", data);
      if (data.length) {
        this.authExpList = data;
        this.authExpListHeader = Object.keys(data[0]);
      }
    })
  }
  getUnAuthExp() {
    this.unAuthExpList = []
    this.unAuthExpListHeader = []
    const obj = {
      "SP_String": "SP_Expense_Tracking",
      "Report_Name_String": "Get_Expense_Tracking",
      "Json_Param_String": JSON.stringify({ "Status": "UnAuthorized", "Emp_ID": this.empId })
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("unauth Exp List  ===", data);
      if (data.length) {
        this.unAuthExpList = data;
        this.unAuthExpListHeader = Object.keys(data[0]);
      }
    })
  }

  pay() {
    this.paymentDetailsPopup = true;
    this.payment_type = "";
    this.bank_name = "";
    this.bank_branch = "";
    this.chq_neft_no = "";
    this.chq_neft_date = new Date();
  }

  approveAuthorized() {
    if (this.selectedAuthorized.length) {
      this.approveSpiner = true;
      const tempData: any = []
      this.selectedAuthorized.forEach((ele: any) => {
        tempData.push({
          "Expence_ID": ele.Expence_ID,
          "Bank_Txn_Type": this.payment_type,
          "Bank_Name": this.bank_name,
          "Bank_Branch_Name": this.bank_branch,
          "Cheque_No": this.chq_neft_no,
          "Cheque_Date": this.DateService.dateConvert(new Date(this.chq_neft_date))
        })
      });
      console.log("pay data", tempData);
      const obj = {
        "SP_String": "SP_Expense_Tracking",
        "Report_Name_String": "Update_payment",
        "Json_Param_String": JSON.stringify(tempData)
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("appr res  ===", data);
        this.approveSpiner = false;
        this.total_amt = 0;
        this.selectedAuthorized = [];
        this.getAuthExp();
        this.cancelPay()
        if (data[0].pay_id) {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Success",
            detail: "Payment Succesfully"
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
      })
    }
  }

  cancelPay() {
    this.paymentDetailsPopup = false;
    this.payment_type = "";
    this.bank_name = "";
    this.bank_branch = "";
    this.chq_neft_no = "";
    this.chq_neft_date = new Date();
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
