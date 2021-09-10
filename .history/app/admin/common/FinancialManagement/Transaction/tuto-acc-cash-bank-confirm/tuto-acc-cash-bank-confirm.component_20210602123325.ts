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
  CashConfirmedList = [];
  BankConfirmedList = [];
  CashConfirmSearchObj = new Search();
  BankConfirmSearchObj = new Search();
  CashConfirmedSearchObj = new Search();
  BankConfirmedSearchObj = new Search();
  TutopiaAppObj:any = {};
  ConfirmInfoSubmitted = false;
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
              this.seachSpinner = false;
        });
  }
  // CONFIRM
  ConfirmPayment(obj) {
    this.TutopiaAppObj = {};
    if (obj.Order_No) {
      this.TutopiaAppObj = obj;
      this.TutopiaAppObj['Approval_Date'] = new Date();
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
    this.TutopiaAppObj['Commission_Amout'] = 0;
    this.TutopiaAppObj['Amount_Recieved'] = 0;
    if(this.TutopiaAppObj.Commission_Per !== undefined && this.TutopiaAppObj.Commission_Per !== '') {
      this.TutopiaAppObj['Commission_Amout'] = ((parseFloat(this.TutopiaAppObj.Amount) * parseFloat(this.TutopiaAppObj.Commission_Per)) / 100 ).toFixed(2);
      this.TutopiaAppObj['Amount_Recieved'] = (parseFloat(this.TutopiaAppObj.Amount) - parseFloat(this.TutopiaAppObj.Commission_Amout)).toFixed(2);
    }
  }
  SaveConfirmPayment() {
    if (this.TutopiaAppObj.Txn_ID) {
      const obj = {
        "Report_Name": "",
        "Json_Param_String" : JSON.stringify([{'Txn_ID': this.TutopiaAppObj.Txn_ID}])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
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
    if (this.TutopiaAppObj.Txn_ID) {
      const obj = {
        "Report_Name": "",
        "Json_Param_String" : JSON.stringify([{'Txn_ID': this.TutopiaAppObj.Txn_ID ,'Subscription_Txn_ID': this.TutopiaAppObj.Subscription_Txn_ID }])
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
}
class Search{
  Start_Date : string;
  End_Date : string;
}
