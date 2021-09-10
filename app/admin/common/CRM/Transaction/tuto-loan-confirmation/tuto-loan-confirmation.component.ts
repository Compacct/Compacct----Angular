import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Data } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import {TreeNode} from 'primeng/api';
@Component({
  selector: 'app-tuto-loan-confirmation',
  templateUrl: './tuto-loan-confirmation.component.html',
  styleUrls: ['./tuto-loan-confirmation.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoLoanConfirmationComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  Approvepopup = false;
  Rejectopop = false;
  Approve_Date = new Date();
  Reject_Date = new Date();
  lone_no:any = undefined;
  start_date :any;
  end_date : any;
  start_date_con :any;
  end_date_con : any;
  start_date_rej :any;
  end_date_rej : any;
  seachSpinner = false;
  ApproveFormSubmitted = false;
  pendintList = [];
  backuppendintList = [];
  confirmList = [];
  backupconfirmList = [];
  rejectList = [];
  backuprejectList = [];
  Txn_ID_app = undefined;
  Txn_ID_rej = undefined;
  REMARKS_APP:any = "LOAN APPROVED";
  REMARKS_REJ:any = "LOAN REJECTED";
  productListFilter = [];
  SelectedProductType: any;
  ConfimListFilter = [];
  selectconfim:any;
  rejectListFilter = [];
  selectreject:any;
  loneComapnyList = [];
  Loan_Ledger_ID = undefined;

  DistSource1 = [];
  SelectedDistSource1 = [];
  DistSource2 = [];
  SelectedDistSource2 = [];
  DistSource3 = [];
  SelectedDistSource3 = [];

  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  ProductPDFFile:any = {};
  LoanListRerturned = [];
 constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["Pending Loan", "Confirmed Loan", "Rejected Loan","Upload Disbursement"];
    this.Header.pushHeader({
      Header: "Loan Confirmation",
      Link: " Channel Sale -> Loan Confirmation"

    });
    this.GetLoneCom()
  }


   GetLoneCom(){
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "GET_LOAN_LEDGERS",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
           this.loneComapnyList = data;
           console.log("this.loneComapnyList",this.loneComapnyList);
           //this.Loan_Ledger_ID = this.loneComapnyList.Loan_Ledger_ID;
      })
   }



  onConfirm(){}
  onReject() {
    this.compacctToast.clear("c");
  }
  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["Pending Loan", "Confirmed Loan", "Rejected Loan","Upload Disbursement"];
    this.PDFFlag = false;
    this.PDFViewFlag = false;
    this.ProductPDFLink = undefined;
    this.ProductPDFFile = {};
    this.LoanListRerturned = [];
  }

  clearData(){
  this.lone_no = undefined;
  this.Txn_ID_app = undefined;
  this.Txn_ID_rej = undefined;
  this.REMARKS_APP= "LOAN APPROVED";
  this.REMARKS_REJ= "LOAN REJECTED";
  this.Loan_Ledger_ID = undefined;
  }
  getPendingDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.start_date = dateRangeObj[0];
      this.end_date = dateRangeObj[1];
    }
  }
  getConfirmDateRange(dateRangeObj){
    if (dateRangeObj.length) {
      this.start_date_con = dateRangeObj[0];
      this.end_date_con = dateRangeObj[1];
    }
  }
  getREJECTDateRange(dateRangeObj){
    if (dateRangeObj.length){
      this.start_date_rej = dateRangeObj[0];
      this.end_date_rej = dateRangeObj[1];
    }
  }
  GetSearchFormData(){
    this.seachSpinner = true;
    const start = this.start_date
          ? this.DateService.dateConvert(new Date(this.start_date))
          : this.DateService.dateConvert(new Date());
        const end = this.end_date
          ? this.DateService.dateConvert(new Date(this.end_date))
          : this.DateService.dateConvert(new Date());
    const tempObj ={
      Start_Date : start,
      End_Date : end
     }
     console.log("formData",tempObj);
     const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "PENDING_LOAN",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("SearchForm",data);
      //this.pendintList = data;
      //this.backuppendintList = data;
      this.pendintList = data.length ? data : [];
      this.backuppendintList = data.length ? data : [];
      this.seachSpinner = false;
      this.GetDist1();
     })

   }
   GetDist1() {
      let DOrderBy = [];
      this.productListFilter = [];
    let DistSource = [];
    this.DistSource1 = [];
      //this.SelectedDistOrderBy1 = [];
      this.backuppendintList.forEach((item) => {
      if (DOrderBy.indexOf(item.Order_Created_By) === -1) {
      DOrderBy.push(item.Order_Created_By);
      this.productListFilter.push({ label: item.Order_Created_By, value: item.Order_Created_By });
      console.log("this.productListFilter",this.productListFilter);
      }
      if (DistSource.indexOf(item.Order_Channel) === -1) {
        DistSource.push(item.Order_Channel);
        this.DistSource1.push({ label: item.Order_Channel, value: item.Order_Channel });
      }
});
}
   GetconfirmData(){
    const start = this.start_date_con
    ? this.DateService.dateConvert(new Date(this.start_date_con))
    : this.DateService.dateConvert(new Date());
  const end = this.end_date_con
    ? this.DateService.dateConvert(new Date(this.end_date_con))
    : this.DateService.dateConvert(new Date());
    const tempObj ={
      Start_Date : start,
      End_Date : end
     }
     console.log("formData",tempObj);
     const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "CONFIRMED_LOAN",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("confirm",data);
      //this.confirmList = data;
      this.confirmList = data.length ? data : [];
      this.backupconfirmList = data.length ? data : [];
      this.seachSpinner = false;
      this.GetDist2()
     })
   }
   GetDist2() {
    let DOrderBy = [];
    this.ConfimListFilter = [];
    //this.SelectedDistOrderBy1 = [];
    let DistSource = [];
    this.DistSource2 = [];
    this.backupconfirmList.forEach((item) => {
      if (DOrderBy.indexOf(item.Order_Created_By) === -1) {
      DOrderBy.push(item.Order_Created_By);
      this.ConfimListFilter.push({ label: item.Order_Created_By, value: item.Order_Created_By });
      console.log("this.productListFilter",this.productListFilter);
      }
      if (DistSource.indexOf(item.Order_Channel) === -1) {
        DistSource.push(item.Order_Channel);
        this.DistSource2.push({ label: item.Order_Channel, value: item.Order_Channel });
      }
    });
}
   GetRejectData(){
    const start = this.start_date_rej
    ? this.DateService.dateConvert(new Date(this.start_date_rej))
    : this.DateService.dateConvert(new Date());
  const end = this.end_date_rej
    ? this.DateService.dateConvert(new Date(this.end_date_rej))
    : this.DateService.dateConvert(new Date());
    const tempObj ={
      Start_Date : start,
      End_Date : end
     }
     const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "REJECTED_LOAN",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Reject",data);
      //this.rejectList = data;
      this.rejectList = data.length ? data : [];
      this.backuprejectList = data.length ? data : [];
      this.GetDist3();
    })
   }
   GetDist3() {
    let DOrderBy = [];
    this.rejectListFilter = [];
    let DistSource = [];
    this.DistSource3 = [];
    //this.SelectedDistOrderBy1 = [];
    this.backuprejectList.forEach((item) => {
      if (DOrderBy.indexOf(item.Order_Created_By) === -1) {
      DOrderBy.push(item.Order_Created_By);
      this.rejectListFilter.push({ label: item.Order_Created_By, value: item.Order_Created_By });
      console.log("this.productListFilter",this.productListFilter);
      }
      if (DistSource.indexOf(item.Order_Channel) === -1) {
        DistSource.push(item.Order_Channel);
        this.DistSource3.push({ label: item.Order_Channel, value: item.Order_Channel });
      }
    });
  }
   GetApprove(col){
     this.Loan_Ledger_ID = this.loneComapnyList[0].Loan_Ledger_ID;
    this.Txn_ID_app = undefined;
    this.lone_no = undefined;
    console.log("col",col);
    this.lone_no = col.Loan_AC_No;
    this.Txn_ID_app = col.Txn_ID;
    this.Approvepopup = true;
   }
   GetReject(col){
    this.Txn_ID_rej = undefined;
    console.log("col",col);
    this.Txn_ID_rej = col.Txn_ID;
    this.Rejectopop = true;
   }
   saveApproveData(valid){

    this.ApproveFormSubmitted = true;
     console.log("valid",valid);
     if(valid){
      const tempObj = {
      Txn_ID : this.Txn_ID_app,
      Loan_Confirm_Date : this.DateService.dateConvert(new Date (this.Approve_Date)),
      Loan_Confirm_By : this.$CompacctAPI.CompacctCookies.User_ID,
      Loan_Ac_No : this.lone_no,
      Loan_Confirm_Remarks : this.REMARKS_APP ? this.REMARKS_APP : "LOAN APPROVED",
      Loan_Ledger_ID : this.Loan_Ledger_ID,
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID
     }
     console.log("sendData",tempObj);
     const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "LOAN_CONFIRM",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      const tempData = data[0].Remarks;
      console.log("tempData",tempData);
      if(tempData == "success"){
        this.GetSearchFormData();
        this.Approvepopup = false;
        this.clearData();
      }
    })
     }
     this.ApproveFormSubmitted = true;
   }
   saveRejectData(valid){
    if(valid){
      const tempObj = {
      Txn_ID : this.Txn_ID_rej,
      Loan_Confirm_Date : this.DateService.dateConvert(new Date (this.Reject_Date)),
      Loan_Confirm_By : this.$CompacctAPI.CompacctCookies.User_ID,
      Loan_Ac_No : "NA",
      Loan_Remarks : this.REMARKS_REJ ? this.REMARKS_REJ : "LOAN REJECTED",
      Loan_Ledger_ID : 0,
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID
     }
     console.log("rejectData",tempObj);
     const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "LOAN_REJECT",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("rejectSaveData",data);

      const tempData = data[0].Remarks;
      console.log("tempData",tempData);
      if(tempData == "success"){
         this.GetSearchFormData();
         this.Rejectopop = false;
         this.clearData();
      }
    })
    }
   }
   printOut(order_no){
    console.log("Print");
   window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + order_no, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }
  FilterDist1() {
    console.log("this.SelectedProductType",this.SelectedProductType);
    let DOrderBy = [];
    let DistSource = [];
    if (this.SelectedDistSource1.length) {
      DistSource = this.SelectedDistSource1;
    }
    if (this.SelectedProductType.length) {
    DOrderBy = this.SelectedProductType;
    }
    this.pendintList = [];
    if (this.SelectedProductType.length) {
    let LeadArr = this.backuppendintList.filter(function (e) {
    return (DOrderBy.length ? DOrderBy.includes(e['Order_Created_By']) : true)
    && (DistSource.length ? DistSource.includes(e['Order_Channel']) : true)
    });
    this.pendintList = LeadArr.length ? LeadArr : [];
    console.log("if pendintList",this.pendintList)
    } else {
    this.pendintList = this.backuppendintList;
    console.log("else pendintList",this.pendintList)
    }
    }
  FilterDist2() {
        console.log("this.selectconfim",this.selectconfim);
        let DOrderBy = [];
        let DistSource = [];
        if (this.SelectedDistSource2.length) {
          DistSource = this.SelectedDistSource2;
        }
        if (this.selectconfim.length) {
        DOrderBy = this.selectconfim;
        }
        this.confirmList = [];
        if (this.selectconfim.length) {
        let LeadArr = this.backupconfirmList.filter(function (e) {
        return (DOrderBy.length ? DOrderBy.includes(e['Order_Created_By']) : true)
        && (DistSource.length ? DistSource.includes(e['Order_Channel']) : true)
        });
        this.confirmList = LeadArr.length ? LeadArr : [];
        console.log("if pendintList",this.confirmList)
        } else {
        this.confirmList = this.backupconfirmList;
        console.log("else pendintList",this.confirmList)
        }
  }
  FilterDist3() {
    console.log("this.selectreject",this.selectreject);
    let DOrderBy = [];
    let DistSource = [];
    if (this.SelectedDistSource3.length) {
      DistSource = this.SelectedDistSource3;
    }
    if (this.selectreject.length) {
    DOrderBy = this.selectreject;
    }
    this.rejectList = [];
    if (this.selectreject.length) {
    let LeadArr = this.backuprejectList.filter(function (e) {
    return (DOrderBy.length ? DOrderBy.includes(e['Order_Created_By']) : true)
    && (DistSource.length ? DistSource.includes(e['Order_Channel']) : true)
    });
    this.rejectList = LeadArr.length ? LeadArr : [];
    console.log("if pendintList",this.rejectList)
    } else {
    this.rejectList = this.backuprejectList;
    console.log("else pendintList",this.rejectList)
    }
    }

    // CSV
  handleFileSelect(event) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    this.LoanListRerturned = [];
    if (event) {
      console.log(event)
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
      var reader : any = new FileReader();
      console.log(reader)
      const ctrl = this;
      reader.onload = function(e){
        console.log(e)
          var fileData = reader.result;
          var wb = XLSX.read(fileData, {type : 'binary'});

          wb.SheetNames.forEach(function(sheetName){
          var rowObj =XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
          var jsonObj = JSON.stringify(rowObj);
          console.log(rowObj);
          ctrl.SaveLoanJSON(rowObj)
          })
      };
      reader.readAsBinaryString(event.files[0]);
  }
}
  SaveLoanJSON(Data) {
    this.LoanListRerturned = [];
    if(Data.length && this.ProductPDFFile['size']) {
      Data.forEach(el=>{
        el.Loan_ID = String(el.Loan_ID);
        el.URN_NO = String(el.URN_NO);
      });
      const obj = {
        "SP_String":"Tutopia_Subscription_Loan_Disburse_SP",
        "Report_Name_String":"Save_Loan_Disburse",
        "Json_Param_String": "NA",
        "Json_1_String": JSON.stringify(Data),
        "Json_2_String":"NA",
        "Json_3_String":"NA",
        "Json_4_String":"NA"
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        this.LoanListRerturned = data;
        console.log(this.LoanListRerturned)
        if (this.LoanListRerturned.length === 0) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Upload',
            detail: "Succesfully Uploaded."
          });
          }
        });
    }
    if(!this.ProductPDFFile['size']) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Validation",
        detail: "No Docs Selected"
      });
    }
  }
  // EXPORT TO EXCEL
  exportexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
}
