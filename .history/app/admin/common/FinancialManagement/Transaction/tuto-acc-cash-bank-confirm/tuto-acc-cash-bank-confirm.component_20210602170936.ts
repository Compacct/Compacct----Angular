import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CompacctGlobalUrlService } from "../../../../shared/compacct.global/global.service.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { MessageService } from "primeng/api";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tuto-acc-cash-bank-confirm',
  templateUrl: './tuto-acc-cash-bank-confirm.component.html',
  styleUrls: ['./tuto-acc-cash-bank-confirm.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoAccCashBankConfirmComponent implements OnInit {
  tabIndexToView = 0;
  seachSpinner = false;
  items = [];
  CashConfirmList = [];
  BankConfirmList = [];
  BackupBankConfirmList = [];
  CashConfirmedList = [];
  BankConfirmedList = [];
  BackupBankConfirmedList = [];
  CashConfirmSearchObj = new Search();
  BankConfirmSearchObj = new Search();
  CashConfirmedSearchObj = new Search();
  BankConfirmedSearchObj = new Search();
  TutopiaAppObj:any = {};
  ConfirmInfoSubmitted = false;

  // FILTER
  DistLedger1 = [];
  SelectedDistLedger1 = [];
  DistTxnType1 = [];
  SelectedDistTxnType1 = [];
  DistLedger2 = [];
  SelectedDistLedger2 = [];
  DistTxnType2 = [];
  SelectedDistTxnType2 = [];

  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.items = ["CASH CONFIRMATION", "BANK CONFIRMATION" , "CONFIRMED CASH" , "CONFIRMED BANK"];
     this.Header.pushHeader({
      Header: "Cash Bank Confirm",
      Link: " Financial Management -> Transaction -> Cash Bank Confirm"
     });
  }
  getDateRange1(dateRangeObj) {
    if (dateRangeObj.length) {
      this.CashConfirmSearchObj.Start_Date = dateRangeObj[0];
      this.CashConfirmSearchObj.End_Date = dateRangeObj[1];
    }
  }
  getDateRange2(dateRangeObj) {
    if (dateRangeObj.length) {
      this.BankConfirmSearchObj.Start_Date = dateRangeObj[0];
      this.BankConfirmSearchObj.End_Date = dateRangeObj[1];
    }
  }
  getDateRange3(dateRangeObj) {
    if (dateRangeObj.length) {
      this.CashConfirmedSearchObj.Start_Date = dateRangeObj[0];
      this.CashConfirmedSearchObj.End_Date = dateRangeObj[1];
    }
  }
  getDateRange4(dateRangeObj) {
    if (dateRangeObj.length) {
      this.BankConfirmedSearchObj.Start_Date = dateRangeObj[0];
      this.BankConfirmedSearchObj.End_Date = dateRangeObj[1];
    }
  }


  TabClick(e){
    console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["CASH CONFIRMATION", "BANK CONFIRMATION" , "CONFIRMED CASH" , "CONFIRMED BANK"];
    this.ClearData();

  }
  ClearData() {
    this.TutopiaAppObj = {};
    this.ConfirmInfoSubmitted = false;
  }
  // SEARCH
  SearchCashConfirm() {
    // this.seachSpinner = true;
      const start = this.CashConfirmSearchObj.Start_Date
        ? this.DateService.dateConvert(new Date(this.CashConfirmSearchObj.Start_Date))
        : this.DateService.dateConvert(new Date());
      const end = this.CashConfirmSearchObj.End_Date
        ? this.DateService.dateConvert(new Date(this.CashConfirmSearchObj.End_Date))
        : this.DateService.dateConvert(new Date());
        const obj = {
          "SP_String": "Tutopia_Subscription_Accounts",
          "Report_Name_String": "GET_ACC_CASH_PENDING",
          "Json_Param_String": JSON.stringify([{'Start_Date': start,'End_Date':end}])
        }
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        this.GlobalAPI
            .getData(obj)
            .subscribe((data: any) => {
                this.CashConfirmList = data.length ? data : [];
              this.seachSpinner = false;
        });
  }
  SearchBankConfirm() {
    // this.seachSpinner = true;
      const start = this.BankConfirmSearchObj.Start_Date
        ? this.DateService.dateConvert(new Date(this.BankConfirmSearchObj.Start_Date))
        : this.DateService.dateConvert(new Date());
      const end = this.BankConfirmSearchObj.End_Date
        ? this.DateService.dateConvert(new Date(this.BankConfirmSearchObj.End_Date))
        : this.DateService.dateConvert(new Date());
        const obj = {
          "SP_String": "Tutopia_Subscription_Accounts",
          "Report_Name_String": "GET_ACC_BANK_PENDING",
          "Json_Param_String": JSON.stringify([{'Start_Date': start,'End_Date':end}])
        }
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        this.GlobalAPI
            .getData(obj)
            .subscribe((data: any) => {
                this.BankConfirmList = data.length ? data : [];
                this.BackupBankConfirmList  = data.length ? data : [];
                this.GetDist1()
              this.seachSpinner = false;
        });
  }
  SearchCashConfirmed() {
    // this.seachSpinner = true;
      const start = this.CashConfirmedSearchObj.Start_Date
        ? this.DateService.dateConvert(new Date(this.CashConfirmedSearchObj.Start_Date))
        : this.DateService.dateConvert(new Date());
      const end = this.CashConfirmedSearchObj.End_Date
        ? this.DateService.dateConvert(new Date(this.CashConfirmedSearchObj.End_Date))
        : this.DateService.dateConvert(new Date());
        const obj = {
          "SP_String": "Tutopia_Subscription_Accounts",
          "Report_Name_String": "GET_ACC_CASH_CONFRIMED",
          "Json_Param_String": JSON.stringify([{'Start_Date': start,'End_Date':end}])
        }
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        this.GlobalAPI
            .getData(obj)
            .subscribe((data: any) => {
                this.CashConfirmedList = data.length ? data : [];
              this.seachSpinner = false;
        });
  }
  SearchBankConfirmed() {
    // this.seachSpinner = true;
      const start = this.BankConfirmedSearchObj.Start_Date
        ? this.DateService.dateConvert(new Date(this.BankConfirmedSearchObj.Start_Date))
        : this.DateService.dateConvert(new Date());
      const end = this.BankConfirmedSearchObj.End_Date
        ? this.DateService.dateConvert(new Date(this.BankConfirmedSearchObj.End_Date))
        : this.DateService.dateConvert(new Date());
        const obj = {
          "SP_String": "Tutopia_Subscription_Accounts",
          "Report_Name_String": "GET_ACC_BANK_CONFRIMED",
          "Json_Param_String": JSON.stringify([{'Start_Date': start,'End_Date':end}])
        }
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        this.GlobalAPI
            .getData(obj)
            .subscribe((data: any) => {
                this.BankConfirmedList = data.length ? data : [];
                this.BackupBankConfirmedList  = data.length ? data : [];
                this.GetDist2()
              this.seachSpinner = false;
        });
  }
  // DISTINCT & FILTER
  GetDist1() {
    let Dledger = [];
    let Dtxn = [];
    this.DistLedger1 = [];
    this.SelectedDistLedger1 = [];
    this.DistTxnType1 = [];
    this.SelectedDistTxnType1 = [];
    this.BankConfirmList.forEach((item) => {
      if (Dledger.indexOf(item.Ledger_Name) === -1) {
        Dledger.push(item.Ledger_Name);
        this.DistLedger1.push({ label: item.Ledger_Name, value: item.Ledger_Name });
      }
      if (Dtxn.indexOf(item.Txn_Type_Name) === -1) {
        Dtxn.push(item.Txn_Type_Name);
        this.DistTxnType1.push({ label: item.Txn_Type_Name, value: item.Txn_Type_Name });
      }
    });
  }
  FilterDist1() {
    let Dledger = [];
    let Dtxn = [];
    if (this.SelectedDistLedger1.length) {
      Dledger = this.SelectedDistLedger1;
    }
    if (this.SelectedDistTxnType1.length) {
      Dtxn = this.SelectedDistTxnType1;
    }
    this.BankConfirmList = [];
    if (this.SelectedDistLedger1.length || this.SelectedDistTxnType1.length) {
      let LeadArr = this.BackupBankConfirmList.filter(function (e) {
        return (Dledger.length ? Dledger.includes(e['Ledger_Name']) : true)
        && (Dtxn.length ? Dtxn.includes(e['Txn_Type_Name']) : true)
      });
      this.BankConfirmList = LeadArr.length ? LeadArr : [];
    } else {
      this.BankConfirmList = this.BackupBankConfirmList;
    }
  }
  GetDist2() {
    let Dledger = [];
    let Dtxn = [];
    this.DistLedger2 = [];
    this.SelectedDistLedger2 = [];
    this.DistTxnType2 = [];
    this.SelectedDistTxnType2 = [];
    this.BankConfirmedList.forEach((item) => {
      if (Dledger.indexOf(item.Ledger_Name) === -1) {
        Dledger.push(item.Ledger_Name);
        this.DistLedger2.push({ label: item.Ledger_Name, value: item.Ledger_Name });
      }
      if (Dtxn.indexOf(item.Txn_Type_Name) === -1) {
        Dtxn.push(item.Txn_Type_Name);
        this.DistTxnType2.push({ label: item.Txn_Type_Name, value: item.Txn_Type_Name });
      }
    });
  }
  FilterDist2() {
    let Dledger = [];
    let Dtxn = [];
    if (this.SelectedDistLedger2.length) {
      Dledger = this.SelectedDistLedger2;
    }
    if (this.SelectedDistTxnType2.length) {
      Dtxn = this.SelectedDistTxnType2;
    }
    this.BankConfirmedList = [];
    if (this.SelectedDistLedger2.length || this.SelectedDistTxnType2.length) {
      let LeadArr = this.BackupBankConfirmedList.filter(function (e) {
        return (Dledger.length ? Dledger.includes(e['Ledger_Name']) : true)
        && (Dtxn.length ? Dtxn.includes(e['Txn_Type_Name']) : true)
      });
      this.BankConfirmedList = LeadArr.length ? LeadArr : [];
    } else {
      this.BankConfirmedList = this.BackupBankConfirmedList;
    }
  }
  // CONFIRM
  ConfirmPayment(obj) {
    this.TutopiaAppObj = {};
    if (obj.Order_No) {
      this.TutopiaAppObj = obj;
      this.TutopiaAppObj['Approval_Date'] = new Date();
      this.TutopiaAppObj['Approved_By'] = this.$CompacctAPI.CompacctCookies.User_ID;
      console.log(this.TutopiaAppObj)
      this.CommissionPerChange();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "ConfirmPayment",
        sticky: true,
        severity: "info",
        summary: "Confirm Payment",
        detail: "Confirm to proceed"
      });
    }
  }
  CommissionPerChange () {
    this.TutopiaAppObj['Commission_Amount'] = 0;
    this.TutopiaAppObj['Amount_Recieved'] = 0;
    if(this.TutopiaAppObj.Commision_Persentage !== undefined && this.TutopiaAppObj.Commision_Persentage !== '') {
      this.TutopiaAppObj['Commission_Amount'] = ((parseFloat(this.TutopiaAppObj.Amount) * parseFloat(this.TutopiaAppObj.Commision_Persentage)) / 100 ).toFixed(2);
      this.TutopiaAppObj['Amount_Recieved'] = (parseFloat(this.TutopiaAppObj.Amount) - parseFloat(this.TutopiaAppObj.Commission_Amount)).toFixed(2);
    }
  }
  SaveConfirmPayment() {
    if (this.TutopiaAppObj.Txn_ID) {
      const tempObj = {
        "Txn_ID": this.TutopiaAppObj.Txn_ID,
        "Approved_By": this.TutopiaAppObj.Approved_By,
        "Approval_Date": this.DateService.dateConvert(new Date(this.TutopiaAppObj.Approval_Date)),
        "Approval_Remarks": this.TutopiaAppObj.Approval_Remarks,
        "Commisstion_Persentage": this.TutopiaAppObj.Commision_Persentage,
        "Commission_Amount": this.TutopiaAppObj.Commission_Amount,
        "Amount_Recieved": this.TutopiaAppObj.Amount_Recieved
      }
      console.log(tempObj);
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts",
        "Report_Name_String": "PAYMENT_CONFRIM_BANK_CASH",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
            console.log(data)
            if (data[0].Remarks === "success") {
              if(this.TutopiaAppObj.App_Confirm === 'N') {
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "ConfirmSuscription",
                  sticky: true,
                  severity: "info",
                  summary: "Start Subscription",
                  detail: "Confirm to proceed"
                });
              } else {
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: this.TutopiaAppObj.Order_No,
                  detail: "Succesfully Confirmed."
                });
                this.onReject();
                this.TutopiaAppObj = {};
              }

            }
      });

    }
  }
  SaveConfirmSuscription() {
    if (this.TutopiaAppObj.Subscription_Txn_ID) {
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts",
        "Report_Name_String": "UPDATE_APP_CONFIRM",
        "Json_Param_String" : JSON.stringify([{'Subscription_Txn_ID': this.TutopiaAppObj.Subscription_Txn_ID }])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            console.log(data)
            if (data[0].Remarks === "success") {
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: this.TutopiaAppObj.Order_No,
                  detail: "Succesfully Confirmed."
                });
                this.onReject();
                this.TutopiaAppObj = {};
            }
      });

    }
  }

  ConfirmApp(obj) {
    this.TutopiaAppObj = {};
    if (obj.Order_No) {
      this.TutopiaAppObj = obj;
      if(this.TutopiaAppObj.App_Confirm === 'N') {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "ConfirmSuscription",
          sticky: true,
          severity: "info",
          summary: "Start Subscription",
          detail: "Confirm to proceed"
        });
      }
    }
  }
  // Notify Tutopia App
  CallTutopiaAppApi() {
    if (this.TutopiaAppObj.Order_No) {
      const httpOptions = {
        headers: new HttpHeaders()
          .set('Authorization', 'Bearer aZyAs0ynGvmOSNyyAOkJauiV')
      }
      const TempObj = {
        "order_id": this.TutopiaAppObj.Subscription_Txn_ID,
        "payment_detail": "Paid",
        "payment_txn_id": this.TutopiaAppObj.Order_No
      };
      this.$http
        .post("https://api.tutopia.in/api/crm/v1/subscription/confirm", TempObj, httpOptions)
        .subscribe((data: any) => {
          console.log(data)
          if (data.status) {
            this.SaveConfirmSuscription();
          } else {
            this.onReject();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Subscription ID :" + this.TutopiaAppObj.Subscription_Txn_ID,
              detail: "Subscription not actived in app."
            });
          }
        });
    }
  }

  onReject() {
    this.TutopiaAppObj = {};
    this.compacctToast.clear();
  }
  PrintOrderAspx(obj){
    if(obj.Order_No) {
      window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + obj.Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }
}
class Search{
  Start_Date : string;
  End_Date : string;
}
