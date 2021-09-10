import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CompacctGlobalUrlService } from "../../../../shared/compacct.global/global.service.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { MessageService } from "primeng/api";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
declare var $: any;
@Component({
  selector: 'app-tuto-receive-voucher',
  templateUrl: './tuto-receive-voucher.component.html',
  styleUrls: ['./tuto-receive-voucher.component.css'],
  providers: [MessageService],
})
export class TutoReceiveVoucherComponent implements OnInit {
tabIndexToView = 0;
  seachSpinner = false;
  items = [];
  CostCenterList = [];
  ObjVoucherSearch = new VoucherSearch();
  VoucherSearchhFormSubmitted = false;
  VoucherBillList = [];
  PendingVoucherBillList = [];
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
    this.items = ["CONFIRM", "CONFIRMED"];
     this.Header.pushHeader({
      Header: "Confirm Voucher",
      Link: " Financial Management -> Transaction -> Confirm Voucher"
     });
    this.GetCostCenter();
  }
  GetCostCenter() {
      this.$CompacctAPI.getCostCenter().subscribe((data: any) => {
        this.CostCenterList = data ? JSON.parse(data) : [];
        const cookiesCostCenter = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
        this.ObjVoucherSearch.Cost_Cen_ID = cookiesCostCenter;
      });
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjVoucherSearch.st_dt_time = dateRangeObj[0];
      this.ObjVoucherSearch.end_dt_time = dateRangeObj[1];
    }
  }
  getCostCentreName(costCentreID) {
          return costCentreID ? $.grep(this.CostCenterList, function (value) { return value.Cost_Cen_ID === Number(costCentreID) })[0].Cost_Cen_Name : '-';
    }
  // SEARCH
  SearchVoucher(valid,status) {
    this.VoucherSearchhFormSubmitted = true;
    if (status === 'VERIFIED') {
    this.VoucherBillList = [];
    } else {
      this.PendingVoucherBillList = [];
    }
    if (valid) {
      this.seachSpinner = true;
      const start = this.ObjVoucherSearch.st_dt_time
        ? this.DateService.dateConvert(new Date(this.ObjVoucherSearch.st_dt_time))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjVoucherSearch.end_dt_time
        ? this.DateService.dateConvert(new Date(this.ObjVoucherSearch.end_dt_time))
        : this.DateService.dateConvert(new Date());
        const obj = {
          "Report_Name": "Get_Tutopia_Bill",
          "Json_Param_String" : JSON.stringify([{'Start_Date': start,'End_Date':end,'Confirmed_Status':status}])
        }
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        this.GlobalAPI
            .CommonTaskData(obj)
            .subscribe((data: any) => {
              console.log(data)
        });
      // const obj = new HttpParams()
      //   .set("st_dt_time", start)
      //   .set("end_dt_time", end)
      //   .set(
      //     "Cost_Cen_ID",
      //     this.ObjVoucherSearch.Cost_Cen_ID ? this.ObjVoucherSearch.Cost_Cen_ID : "0"
      //   )
      //   .set("Voucher_Type_ID", '1')
      //   .set("Status", status);
      // this.$http
      //   .get("/Tutopia_Receive_Voucher/Get_Voucher_Data", { params: obj })
      //   .subscribe((data: any) => {
      //     if (status === 'CONFIRM') {
      //       this.VoucherBillList = data ? JSON.parse(data) : [];
      //     } else {
      //       this.PendingVoucherBillList = data ? JSON.parse(data) : [];
      //     }
      //     this.seachSpinner = false;
      //     this.VoucherSearchhFormSubmitted = false;
      //   });
    }
  }

  // Notify Tutopia App
  CallTutopiaAppApi() {
    if (this.TutopiaAppObj.Adj_with_Doc_No) {
      const httpOptions = {
        headers: new HttpHeaders()
          .set('Authorization', 'Bearer aZyAs0ynGvmOSNyyAOkJauiV')
      }
      const TempObj = {
        "order_id": this.TutopiaAppObj.Subscription_Txn_ID,
        "payment_detail": "Paid",
        "payment_txn_id": this.TutopiaAppObj.Doc_No
      };
      this.$http
        .post("https://api.tutopia.in/api/crm/v1/subscription/confirm", TempObj, httpOptions)
        .subscribe((data: any) => {
          console.log(data)
          if (data.status) {
            this.onConfirm();
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
  //  DELETE
  onConfirm() {
    if (this.VoucherNo) {
      this.$http
        .post("/Tutopia_Receive_Voucher/Update_Confirm_Subscription", {
          Voucher_No: this.VoucherNo
        })
        .subscribe((data: any) => {
          if (data.success === true) {
            this.SearchVoucher(true,'CONFIRM');
            this.onReject();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: this.VoucherNo,
              detail: "Succesfully Approve."
            });
          }
        });
    }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  ConfirmBill(obj) {
    this.VoucherNo = undefined;
    this.TutopiaAppObj = {};
    if (obj.Voucher_No) {
      this.VoucherNo = obj.Voucher_No;
      this.TutopiaAppObj = obj;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }
  // PDF
  GetPDF(obj) {
    if (obj.Adj_with_Doc_No) {
      window.open("/Report/Crystal_Files/Finance/SaleBill/tutopia_final.aspx?Doc_No=" + obj.Adj_with_Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

      );
    }
  }
}
class VoucherSearch {
  st_dt_time: string;
  end_dt_time: string;
  Cost_Cen_ID: string;
  Voucher_Type_ID: string;
}
