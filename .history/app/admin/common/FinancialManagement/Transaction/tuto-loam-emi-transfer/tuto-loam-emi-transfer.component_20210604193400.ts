import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalUrlService } from '../../../../shared/compacct.global/global.service.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from "primeng/api";

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
  ObjLoanSearch = new VoucherSearch();
  PendingLoanSearchhFormSubmitted = false;
  LoanCompanyList = [];
  BankLedgerList = [];
  BankTrnTypeList = [];
  PendingLoanBillList = [];
  VoucherNo = undefined;
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
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjLoanSearch.st_dt_time = dateRangeObj[0];
      this.ObjLoanSearch.end_dt_time = dateRangeObj[1];
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
  // SEARCH
  SearchPendingLoan(valid) {
    this.PendingLoanSearchhFormSubmitted = true;
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
          "Report_Name_String": "GET_LOAN_EMI_PENDING_TXN",
          "Json_Param_String": JSON.stringify([{'Start_Date': start,'End_Date':end}])
        }
        this.GlobalAPI
            .getData(obj)
            .subscribe((data: any) => {
              this.PendingLoanBillList = data.length ? data : [];
              this.seachSpinner = false;
              this.PendingLoanSearchhFormSubmitted = false;
        });
    }
  }

}
class VoucherSearch {
  st_dt_time: string;
  end_dt_time: string;
  Cost_Cen_ID: string;
  Voucher_Type_ID: string;
}
