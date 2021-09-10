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
  seachSpinner = false;
  CashConfirmList = [];
  CashConfirmSearchObj = new Search();
  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService) { }

  ngOnInit() {
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.CashConfirmSearchObj.Start_Date = dateRangeObj[0];
      this.CashConfirmSearchObj.End_Date = dateRangeObj[1];
    }
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
        "Json_Param_String": JSON.stringify([{'Start_Date': start,'End_Date':end,'Confirmed_Status':status}])
      }
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
              this.CashConfirmList = data.length ? data : [];
            this.seachSpinner = false;
      });
}
}
class Search{
  Start_Date : string;
  End_Date : string;
}
