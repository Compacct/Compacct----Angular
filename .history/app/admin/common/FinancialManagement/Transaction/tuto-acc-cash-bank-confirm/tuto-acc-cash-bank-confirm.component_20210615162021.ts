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
  BackupCashConfirmList = [];
  BankConfirmList = [];
  BackupBankConfirmList = [];
  CashConfirmedList = [];
  BackupCashConfirmedList = [];
  BankConfirmedList = [];
  BackupBankConfirmedList = [];
  CashConfirmSearchObj = new Search();
  BankConfirmSearchObj = new Search();
  CashConfirmedSearchObj = new Search();
  BankConfirmedSearchObj = new Search();
  TutopiaAppObj:any = {};
  ConfirmInfoSubmitted = false;

  // FILTER
  DistOrderBy1 = [];
  SelectedDistOrderBy1 = [];
  DistOrderBy2 = [];
  SelectedDistOrderBy2 = [];
  DistOrderBy3 = [];
  SelectedDistOrderBy3 = [];
  DistOrderBy4 = [];
  SelectedDistOrderBy4 = [];
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
    this.seachSpinner = false;
    this.ConfirmInfoSubmitted = false;
  }
  // SEARCH
  SearchCashConfirm() {
    // this.seachSpinner = true;
    this.DistOrderBy1 = [];
    this.SelectedDistOrderBy1 = [];
    this.CashConfirmList =  [];
    this.BackupCashConfirmList = [];
    this.seachSpinner = true;
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
                this.BackupCashConfirmList = data.length ? data : [];
                this.GetDist1();
                this.FilterDist1();
              this.seachSpinner = false;
        });
  }
  SearchBankConfirm() {
    // this.seachSpinner = true;
    this.DistLedger1 = [];
   // this.SelectedDistLedger1 = [];
    this.DistTxnType1 = [];
   // this.SelectedDistTxnType1 = [];
    this.DistOrderBy2 = [];
  //  this.SelectedDistOrderBy2 = [];
    this.BankConfirmList =  [];
    this.BackupBankConfirmList = [];
    this.seachSpinner = true;
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
                this.GetDist2();
                this.FilterDist2();
              this.seachSpinner = false;
        });
  }
  SearchCashConfirmed() {
    // this.seachSpinner = true;
    this.DistOrderBy3 = [];
   // this.SelectedDistOrderBy3 = [];
    this.CashConfirmedList =  [];
    this.BackupCashConfirmedList = [];
    this.seachSpinner = true;
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
                this.BackupCashConfirmedList = data.length ? data : [];
                this.GetDist3();
                this.FilterDist3();
              this.seachSpinner = false;
        });
  }
  SearchBankConfirmed() {
    // this.seachSpinner = true;
    this.SelectedDistLedger2 = [];
    this.DistTxnType2 = [];
  //  this.SelectedDistTxnType2 = [];
    this.DistOrderBy4 = [];
   // this.SelectedDistOrderBy4 = [];
    this.BankConfirmedList =  [];
    this.BackupBankConfirmedList = [];
    this.seachSpinner = true;
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
                this.GetDist4();
                this.FilterDist4();
              this.seachSpinner = false;
        });
  }
  // DISTINCT & FILTER
  GetDist1() {
    let DOrderBy = [];
    this.DistOrderBy1 = [];
    // this.SelectedDistOrderBy1 = [];
    this.CashConfirmList.forEach((item) => {
      if (DOrderBy.indexOf(item.Order_Created_By) === -1) {
        DOrderBy.push(item.Order_Created_By);
        this.DistOrderBy1.push({ label: item.Order_Created_By, value: item.Order_Created_By });
      }
    });
  }
  FilterDist1() {
    let DOrderBy = [];
    if (this.SelectedDistOrderBy1.length) {
      DOrderBy = this.SelectedDistOrderBy1;
    }
    this.CashConfirmList = [];
    if (this.SelectedDistOrderBy1.length) {
      let LeadArr = this.BackupCashConfirmList.filter(function (e) {
        return (DOrderBy.length ? DOrderBy.includes(e['Order_Created_By']) : true)
      });
      this.CashConfirmList = LeadArr.length ? LeadArr : [];
    } else {
      this.CashConfirmList = this.BackupCashConfirmList;
    }
  }
  GetDist2() {
    let Dledger = [];
    let Dtxn = [];
    let DOrderBy = [];
    this.DistLedger1 = [];
   // this.SelectedDistLedger1 = [];
    this.DistTxnType1 = [];
  //  this.SelectedDistTxnType1 = [];
    this.DistOrderBy2 = [];
  //  this.SelectedDistOrderBy2 = [];
    this.BankConfirmList.forEach((item) => {
      if (Dledger.indexOf(item.Ledger_Name) === -1) {
        Dledger.push(item.Ledger_Name);
        this.DistLedger1.push({ label: item.Ledger_Name, value: item.Ledger_Name });
      }
      if (Dtxn.indexOf(item.Txn_Type_Name) === -1) {
        Dtxn.push(item.Txn_Type_Name);
        this.DistTxnType1.push({ label: item.Txn_Type_Name, value: item.Txn_Type_Name });
      }
      if (DOrderBy.indexOf(item.Order_Created_By) === -1) {
        DOrderBy.push(item.Order_Created_By);
        this.DistOrderBy2.push({ label: item.Order_Created_By, value: item.Order_Created_By });
      }
    });
  }
  FilterDist2() {
    let Dledger = [];
    let Dtxn = [];
    let DOrderBy = [];
    if (this.SelectedDistLedger1.length) {
      Dledger = this.SelectedDistLedger1;
    }
    if (this.SelectedDistTxnType1.length) {
      Dtxn = this.SelectedDistTxnType1;
    }
    if (this.SelectedDistOrderBy2.length) {
      DOrderBy = this.SelectedDistOrderBy2;
    }
    this.BankConfirmList = [];
    if (this.SelectedDistLedger1.length || this.SelectedDistTxnType1.length || this.SelectedDistOrderBy2.length) {
      let LeadArr = this.BackupBankConfirmList.filter(function (e) {
        return (Dledger.length ? Dledger.includes(e['Ledger_Name']) : true)
        && (Dtxn.length ? Dtxn.includes(e['Txn_Type_Name']) : true)
        && (DOrderBy.length ? DOrderBy.includes(e['Order_Created_By']) : true)
      });
      this.BankConfirmList = LeadArr.length ? LeadArr : [];
    } else {
      this.BankConfirmList = this.BackupBankConfirmList;
    }
  }
  GetDist3() {
    let DOrderBy = [];
    this.DistOrderBy3 = [];
  //  this.SelectedDistOrderBy3 = [];
    this.BankConfirmList.forEach((item) => {
      if (DOrderBy.indexOf(item.Order_Created_By) === -1) {
        DOrderBy.push(item.Order_Created_By);
        this.DistOrderBy3.push({ label: item.Order_Created_By, value: item.Order_Created_By });
      }
    });
  }
  FilterDist3() {
    let DOrderBy = [];
    if (this.SelectedDistOrderBy3.length) {
      DOrderBy = this.SelectedDistOrderBy3;
    }
    this.CashConfirmedList = [];
    if (this.SelectedDistOrderBy3.length) {
      let LeadArr = this.BackupCashConfirmedList.filter(function (e) {
        return (DOrderBy.length ? DOrderBy.includes(e['Order_Created_By']) : true)
      });
      this.CashConfirmedList = LeadArr.length ? LeadArr : [];
    } else {
      this.CashConfirmedList = this.BackupCashConfirmedList;
    }
  }
  GetDist4() {
    let Dledger = [];
    let Dtxn = [];
    let DOrderBy = [];
    this.DistLedger2 = [];
   // this.SelectedDistLedger2 = [];
    this.DistTxnType2 = [];
  //  this.SelectedDistTxnType2 = [];
    this.DistOrderBy4 = [];
 //   this.SelectedDistOrderBy4 = [];
    this.BankConfirmedList.forEach((item) => {
      if (Dledger.indexOf(item.Ledger_Name) === -1) {
        Dledger.push(item.Ledger_Name);
        this.DistLedger2.push({ label: item.Ledger_Name, value: item.Ledger_Name });
      }
      if (Dtxn.indexOf(item.Txn_Type_Name) === -1) {
        Dtxn.push(item.Txn_Type_Name);
        this.DistTxnType2.push({ label: item.Txn_Type_Name, value: item.Txn_Type_Name });
      }
      if (DOrderBy.indexOf(item.Order_Created_By) === -1) {
        DOrderBy.push(item.Order_Created_By);
        this.DistOrderBy4.push({ label: item.Order_Created_By, value: item.Order_Created_By });
      }
    });
  }
  FilterDist4() {
    let Dledger = [];
    let Dtxn = [];
    let DOrderBy = [];
    if (this.SelectedDistLedger2.length) {
      Dledger = this.SelectedDistLedger2;
    }
    if (this.SelectedDistTxnType2.length) {
      Dtxn = this.SelectedDistTxnType2;
    }
    if (this.SelectedDistOrderBy4.length) {
      DOrderBy = this.SelectedDistOrderBy4;
    }
    this.BankConfirmedList = [];
    if (this.SelectedDistLedger2.length || this.SelectedDistTxnType2.length  || this.SelectedDistOrderBy4.length) {
      let LeadArr = this.BackupBankConfirmedList.filter(function (e) {
        return (Dledger.length ? Dledger.includes(e['Ledger_Name']) : true)
        && (Dtxn.length ? Dtxn.includes(e['Txn_Type_Name']) : true)
        && (DOrderBy.length ? DOrderBy.includes(e['Order_Created_By']) : true)
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
      this.TutopiaAppObj['Amount_Recieved_Fixed'] = this.TutopiaAppObj['Amount_Recieved'];
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
  CommissionAmtChange () {
    this.TutopiaAppObj['Commision_Persentage'] = 0;
    this.TutopiaAppObj['Amount_Recieved'] = 0;
    if(this.TutopiaAppObj.Commission_Amount !== undefined && this.TutopiaAppObj.Commission_Amount !== '') {
      this.TutopiaAppObj['Commision_Persentage'] = ((parseFloat(this.TutopiaAppObj.Commission_Amount) / parseFloat(this.TutopiaAppObj.Amount)) * 100 ).toFixed(2);
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
              this.SaveConfirmSuscription();

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
          .getData(obj)
          .subscribe((data: any) => {
            console.log(data)
            if (data[0].Remarks === "success") {
              this.SearchCashConfirm();
              this.SearchBankConfirm();
              this.SearchCashConfirmed();
              this.SearchBankConfirmed();
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
  CallTutopiaAppApi(flag) {
    if (this.TutopiaAppObj.Order_No) {
           if (flag === 'pay') {this.SaveConfirmPayment();}
           if (flag === 'app') {this.SaveConfirmSuscription();}
      // const httpOptions = {
      //   headers: new HttpHeaders()
      //     .set('Authorization', 'Bearer aZyAs0ynGvmOSNyyAOkJauiV')
      // }
      // const TempObj = {
      //   "order_id": this.TutopiaAppObj.Subscription_Txn_ID,
      //   "payment_detail": "Paid",
      //   "payment_txn_id": this.TutopiaAppObj.Order_No
      // };
      // this.$http
      //   .post("https://api.tutopia.in/api/crm/v1/subscription/confirm", TempObj, httpOptions)
      //   .subscribe((data: any) => {
      //     console.log(data)
      //     if (data.status) {
      //       if (flag === 'pay') {this.SaveConfirmPayment();}
      //       if (flag === 'app') {this.SaveConfirmSuscription();}
      //     } else {
      //       this.onReject();
      //       this.compacctToast.clear();
      //       this.compacctToast.add({
      //         key: "compacct-toast",
      //         severity: "error",
      //         summary: "Subscription ID :" + this.TutopiaAppObj.Subscription_Txn_ID,
      //         detail: "Subscription not actived in app."
      //       });
      //     }
      //   });
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
