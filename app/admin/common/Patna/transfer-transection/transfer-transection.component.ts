import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transfer-transection',
  templateUrl: './transfer-transection.component.html',
  styleUrls: ['./transfer-transection.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None

})
export class TransferTransectionComponent implements OnInit {

  Spinner: boolean = false;
  buttonname: string = 'Create Voucher';
  receiveAcList: any = [];
  giveEffectList: any = [];
  startDate: Date;
  endDate: Date;
  initDate: any = [];
  transferTransectionFormSubmit: boolean = false;
  objTransferTransection = new transferTransection();

  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Transfer Transection",
      Link: "SHCPL --> Transfer Transection"
    });
    this.getRcvAcList();
    this.getGiveEffectList();
    this.Finyear();
  }

  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.commonApi.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
        // console.log(res);
        let data = JSON.parse(res)
        this.initDate = [new Date(data[0].Fin_Year_Start), new Date(data[0].Fin_Year_End)];
      });
  }

  getRcvAcList() {
    const obj = {
      "SP_String": "BL_Txn_Hearing_Transfer_Trn",
      "Report_Name_String": "Get_Rcv_Ac"
    }

    this.GlobalAPI.getData(obj).subscribe((data) => {
      // console.log('Receive Account List', data);
      if (data.length) {
        data.forEach((ele: any) => {
          this.receiveAcList.push({
            'value': ele.Ledger_ID,
            'label': ele.Ledger_Name
          });
        });
        // console.log(this.receiveAcList);
      }
    });
  }

  getGiveEffectList() {
    const obj = {
      "SP_String": "BL_Txn_Hearing_Transfer_Trn",
      "Report_Name_String": "Get_Effect_IN"
    }

    this.GlobalAPI.getData(obj).subscribe((data) => {
      // console.log('Get Effect List', data);
      if (data.length) {
        data.forEach((ele: any) => {
          this.giveEffectList.push({
            'value': ele.Sub_Ledger_ID,
            'label': ele.Sub_Ledger_Name
          });
        });
        // console.log(this.giveEffectList);
      }

    });
  }

  getDateRangeClosingReport(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.startDate = dateRangeObj[0];
      this.endDate = dateRangeObj[1];
    }
  }

  SaveTransferTransection(valid) {
    this.transferTransectionFormSubmit = true;
    if (valid) {
      this.transferTransectionFormSubmit = false;
      this.objTransferTransection.Start_Date = this.DateService.dateConvert(this.startDate);
      this.objTransferTransection.End_Date = this.DateService.dateConvert(this.endDate);
      // console.log(this.objTransferTransection);
      this.Spinner = true;
      const obj = {
        "SP_String": "BL_Txn_Hearing_Transfer_Trn",
        "Report_Name_String": "Create_Transaction",
        "Json_Param_String": JSON.stringify([this.objTransferTransection])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('save response', data);
        if (data[0].Column1 == "done") {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Transfer Transection",
            detail: "Succesfully Created"
          });
          this.Spinner = false;
          this.objTransferTransection = new transferTransection();
        }
        else {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Wrong"
          });
          this.Spinner = false;
        }
      });
    }
  }
}

class transferTransection {
  Ledger_ID: any;
  Sub_Ledger_ID: any;
  Start_Date: any;
  End_Date: any;
}
