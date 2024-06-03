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

  showDoc() {
    window.open(this.objExpenseTracking.Pic_File_Name);
  }

  saveData(valid1: any, valid2: any) {
    this.employeeFormSubmit = true;
    this.expenseTrackingFormSubmit = true;
    console.log("valid",valid1 , valid2);
    
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
        if (data[0].Column1 == "Done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Expense Tracking ",
            detail: "Succesfully" + msg
          });
          
          // this.GetAllDataBrowswe();
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
