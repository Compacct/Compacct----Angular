import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalUrlService } from '../../../../shared/compacct.global/global.service.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from "primeng/api";
import { Console } from 'console';

@Component({
  selector: 'app-tuto-loam-emi-transfer',
  templateUrl: './tuto-loam-emi-transfer.component.html',
  styleUrls: ['./tuto-loam-emi-transfer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoLoamEmiTransferComponent implements OnInit {
  tabIndexToView = 0;
  seachSpinner = false;
  items = [];
  bankName = true;
  bankbranchName = true;
  bankNameRequire = false;
  bankBranchNameRequire = false;
  lblNo = "Bank Transfer No";
  lblDate = 'Bank Transfer Date';
  ChequeOption = false;
  ChequeOptionRequire = true;

  ObjLoanSearch = new VoucherSearch();
  ObjVoucherSearch = new VoucherSearch();
  ObjLedger = new Ledger();
  ObjCommonUseObj = new Commonuse ();
  PendingLoanSearchhFormSubmitted = false;
  VoucherSubmitted = false;
  LoanCompanyList = [];
  BankLedgerList = [];
  BankTrnTypeList = [];
  PendingLoanBillList = [];
  TransferedLoanBillList = [];

  UpdateLoanTotalAmt:any;
  TutopiaAppApiFlag = false;
  TutopiaAppObj:any;
  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
     this.Header.pushHeader({
      Header: "Loan EMI Transfer",
      Link: " Financial Management -> Transaction -> Loan EMI Transfer"
     });
     this.GetLoanCompany();
     this.GetBankLedger();
     this.GetBankTrnType();
  }
  TabClick(e){
    console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.clearData();

  }
  clearData() {
    this.ObjLoanSearch = new VoucherSearch();
    this.ObjVoucherSearch = new VoucherSearch();
    this.ObjLedger = new Ledger();
    this.ObjCommonUseObj = new Commonuse ();
    this.PendingLoanSearchhFormSubmitted = false;
    this.VoucherSubmitted = false;
    this.PendingLoanBillList = [];
    this.UpdateLoanTotalAmt = 0;
    this.ObjLedger.Voucher_Date = new Date();
  }

  // GET DATA
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjLoanSearch.st_dt_time = dateRangeObj[0];
      this.ObjLoanSearch.end_dt_time = dateRangeObj[1];
    }
  }
  getDateRange2(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjVoucherSearch.st_dt_time = dateRangeObj[0];
      this.ObjVoucherSearch.end_dt_time = dateRangeObj[1];
    }
  }
  GetLoanCompany() {
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts_Voucher",
      "Report_Name_String": "GET_LOAN_LEDGERS"
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          this.LoanCompanyList = data.length ? data : [];
    });
  }
  GetBankLedger() {
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts_Voucher",
      "Report_Name_String": "GET_LOAN_TRF_LEDGERS"
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          this.BankLedgerList = data.length ? data : [];
    });
  }
  GetBankTrnType() {
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "Get_Bank_Tran_Type"
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          this.BankTrnTypeList = data.length ? data : [];
    });
  }

  // CHANGE
  BankTRNTypeChange () {
        this.ObjLedger.Bank_Name = undefined;
        this.ObjLedger.Bank_Branch_Name = undefined;
        this.ObjLedger.Cheque_No = undefined;
        this.ObjLedger.Cheque_Date = undefined;
        this.bankName = true;
        this.bankbranchName = true;
        this.bankNameRequire = false;
        this.bankBranchNameRequire = false;
        if (this.ObjLedger.Bank_Txn_Type) {
            if (this.ObjLedger.Bank_Txn_Type === "NEFT/RTGS") {
                this.bankName = true;
                this.bankbranchName = true;
                this.bankNameRequire = false;
                this.bankBranchNameRequire = false;

                this.lblNo = "NEFT No"
                this.lblDate = "NEFT Date"
                this.ChequeOption = false;
                this.ChequeOptionRequire = true;

                this.bankName = true;
                this.bankbranchName = true;
                this.bankNameRequire = false;
                this.bankBranchNameRequire = false;
            }
            else if (this.ObjLedger.Bank_Txn_Type === "CHEQUE") {
                this.bankName = true;
                this.bankbranchName = true;
                this.bankNameRequire = false;
                this.bankBranchNameRequire = false;
                this.lblNo = "Cheque No"
                this.lblDate = "Cheque Date"
                this.ChequeOption = false;
                this.ChequeOptionRequire = true;

                this.bankName = false;
                this.bankbranchName = false;
                this.bankNameRequire = true;
                this.bankBranchNameRequire = true;
            }
            else if (this.ObjLedger.Bank_Txn_Type === "BANK-TRANSFER") {
                this.bankName = true;
                this.bankbranchName = true;
                this.bankNameRequire = false;
                this.bankBranchNameRequire = false;

                this.lblNo = "Bank Transfer No"
                this.lblDate = "Bank Transfer Date"
                this.ChequeOption = false;
                this.ChequeOptionRequire = true;

                this.bankName = false;
                this.bankbranchName = false;
                this.bankNameRequire = true;
                this.bankBranchNameRequire = true;
            }
            else {
                this.bankName = false;
                this.bankbranchName = false;
                this.bankNameRequire = true;
                this.bankBranchNameRequire = true;
                this.ChequeOption = true;
                this.ChequeOptionRequire = false;
            }
        }
  }
  LoanBillCheckBoxChanged () {
    let count = 0;
    this.PendingLoanBillList.forEach(el=> {
      if(el['Selected']) {
        count = count + el.Emi_To_Be_Tran
      }
    });
    this.UpdateLoanTotalAmt = count;
  }

  // SEARCH
  SearchTransferedLoan(valid) {
    this.TransferedLoanBillList = [];
    if (valid) {
     // this.seachSpinner = true;
      const start = this.ObjLoanSearch.st_dt_time
        ? this.DateService.dateConvert(new Date(this.ObjLoanSearch.st_dt_time))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjLoanSearch.end_dt_time
        ? this.DateService.dateConvert(new Date(this.ObjLoanSearch.end_dt_time))
        : this.DateService.dateConvert(new Date());
        const obj = {
          "SP_String": "Tutopia_Subscription_Accounts_Voucher",
          "Report_Name_String": "BROWSE_EMI_TRANSFER_VOUCHER",
          "Json_Param_String": JSON.stringify([{'Start_Date': start,'End_Date':end}])
        }
        this.GlobalAPI
            .getData(obj)
            .subscribe((data: any) => {
              this.TransferedLoanBillList = data.length ? data : [];
              this.seachSpinner = false;
        });
    }
  }
  SearchPendingLoan(valid) {
    this.PendingLoanSearchhFormSubmitted = true;
    this.UpdateLoanTotalAmt = 0;
    this.ObjLedger = new Ledger();
    this.ObjLedger.Voucher_Date = new Date();
    this.PendingLoanBillList = [];
    if (valid) {
      this.seachSpinner = true;
      const start = this.ObjLoanSearch.st_dt_time
        ? this.DateService.dateConvert(new Date(this.ObjLoanSearch.st_dt_time))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjLoanSearch.end_dt_time
        ? this.DateService.dateConvert(new Date(this.ObjLoanSearch.end_dt_time))
        : this.DateService.dateConvert(new Date());
        const obj = {
          "SP_String": "Tutopia_Subscription_Accounts_Voucher",
          "Report_Name_String": "GET_LOAN_EMI_PENDING_TXN",
          "Json_Param_String": JSON.stringify([{'Start_Date': start,'End_Date':end,'Ledger_ID' : this.ObjLoanSearch.Loan_Company_Ledger}])
        }
        this.GlobalAPI
            .getData(obj)
            .subscribe((data: any) => {
              this.PendingLoanBillList = data.length ? data : [];
              this.PendingLoanBillList.forEach(el=> el['Selected'] = false);
              this.seachSpinner = false;
              this.PendingLoanSearchhFormSubmitted = false;
        });
    }
  }

  // SAVE
  SaveLoanTransfer(valid) {
    this.VoucherSubmitted = true;
    if(valid && this.PendingLoanBillList.length && this.UpdateLoanTotalAmt) {
     const TempArr = this.FetchJSONdataForSave();
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts_Voucher",
        "Report_Name_String": "CREATE_EMI_TRANSFER_VOUCHER",
        "Json_Param_String": JSON.stringify(TempArr)
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
            console.log(data)
      });
    }
  }
  FetchJSONdataForSave() {
    let TempArr = [];
    let IsTopperYbill =  {
        TXN_ID : 0,
        Voucher_Date : this.DateService.dateConvert(new Date(this.ObjLedger.Voucher_Date)),
        Ledger_ID : this.ObjCommonUseObj.Bank_Ledger,
        Fin_Year_ID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
        Cheque_No :this.ObjLedger.Cheque_No,
        Cheque_Date :this.ObjLedger.Cheque_Date ?  this.DateService.dateConvert(new Date(this.ObjLedger.Cheque_Date)) : '"01/Jan/1900"',
        Bank_Name : this.ObjLedger.Bank_Name,
        Bank_Txn_Type : this.ObjLedger.Bank_Txn_Type,
        Bank_Branch_Name : this.ObjLedger.Bank_Branch_Name,
        Naration: this.ObjLedger.Naration,
        DR_Amt: 0,
        CR_Amt: this.UpdateLoanTotalAmt,
        Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        Cost_Cen_ID_Trn: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
        Is_Topper: 'Y',
    }
    TempArr.push(IsTopperYbill);
    let IsTopperNbill = this.PendingLoanBillList.filter(item=> item.Selected);
    IsTopperNbill.forEach(el=> {
       const obj = {
        TXN_ID : el.Txn_ID,
        Voucher_Date : this.DateService.dateConvert(new Date(this.ObjLedger.Voucher_Date)),
        Ledger_ID : el.Loan_Ledger_ID,
        Fin_Year_ID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
        Cheque_No :this.ObjLedger.Cheque_No,
        Cheque_Date :this.ObjLedger.Cheque_Date ?  this.DateService.dateConvert(new Date(this.ObjLedger.Cheque_Date)) : '"01/Jan/1900"',
        Bank_Name : this.ObjLedger.Bank_Name,
        Bank_Txn_Type : this.ObjLedger.Bank_Txn_Type,
        Bank_Branch_Name : this.ObjLedger.Bank_Branch_Name,
        Naration: this.ObjLedger.Naration,
        DR_Amt: el.Emi_To_Be_Tran,
        CR_Amt: 0,
        Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        Cost_Cen_ID_Trn: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
        Is_Topper: 'N',
       }
       TempArr.push(obj);
    });
    console.log(TempArr)
    return TempArr;
  }

  PrintOrderAspx(obj){
    if(obj.Order_No) {
      window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + obj.Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }
}
class VoucherSearch {
  st_dt_time: string;
  end_dt_time: string;
  Cost_Cen_ID: string;
  Loan_Company_Ledger: string;
}
class Ledger {
  TXN_ID : string;
  Voucher_Date : Date;
  Ledger_ID : string;
  Fin_Year_ID : string;
  Cheque_No : string;
  Cheque_Date : string;
  Bank_Name : string;
  Bank_Txn_Type : string;
  Bank_Branch_Name : string;
  Naration: string;
  DR_Amt: string;
  CR_Amt: string;
  Cost_Cen_ID: string;
  Cost_Cen_ID_Trn: string;
  User_ID: string;
  Is_Topper: string;
}
class Commonuse {
  Bank_Ledger :string;
}
