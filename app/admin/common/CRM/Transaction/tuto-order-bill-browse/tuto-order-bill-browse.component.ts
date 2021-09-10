import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalUrlService } from '../../../../shared/compacct.global/global.service.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tuto-order-bill-browse',
  templateUrl: './tuto-order-bill-browse.component.html',
  styleUrls: ['./tuto-order-bill-browse.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoOrderBillBrowseComponent implements OnInit {
  tabIndexToView = 0;
  seachSpinner = false;
  items = [];

  BrowseBillSearch = new Search();
  PendingBillSearch = new Search();
  BrowseBillList = [];
  BackupBrowseBillList = [];
  PendingBillList = [];
  BackupPendingBillList = [];

  DistCreatedBy1 = [];
  SelectedDistCreatedBy1 = [];
  DistCreatedBy2 = [];
  SelectedDistCreatedBy2 = [];
  OrderNo = undefined;
  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private router : Router,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.items = ["Browse Bill", "Pending Bill"];
     this.Header.pushHeader({
      Header: "Order Bill Browse",
      Link: " CRM -> Transaction -> Order Bill Browse"
     });
  }
  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["Browse Bill", "Pending Bill"];
  }
  getDateRange1(dateRangeObj) {
    if (dateRangeObj.length) {
      this.BrowseBillSearch.Start_Date = dateRangeObj[0];
      this.BrowseBillSearch.End_Date = dateRangeObj[1];
    }
  }
  getDateRange2(dateRangeObj) {
    if (dateRangeObj.length) {
      this.PendingBillSearch.Start_Date = dateRangeObj[0];
      this.PendingBillSearch.End_Date = dateRangeObj[1];
    }
  }

  SearchBrowseBillList() {
    this.DistCreatedBy1 = [];
    this.SelectedDistCreatedBy1 = [];
    this.BrowseBillList =  [];
    this.BackupBrowseBillList = [];
    this.seachSpinner = true;
      const start = this.BrowseBillSearch.Start_Date
        ? this.DateService.dateConvert(new Date(this.BrowseBillSearch.Start_Date))
        : this.DateService.dateConvert(new Date());
      const end = this.BrowseBillSearch.End_Date
        ? this.DateService.dateConvert(new Date(this.BrowseBillSearch.End_Date))
        : this.DateService.dateConvert(new Date());
        const obj = {
          "SP_String": "Tutopia_Subscription_Accounts",
          "Report_Name_String": "GET_Bill_Browse_Confirmed",
          "Json_Param_String": JSON.stringify([{'Start_Date': start,'End_Date':end,'User_ID' :this.$CompacctAPI.CompacctCookies.User_ID}])
        }
        this.GlobalAPI
            .getData(obj)
            .subscribe((data: any) => {
                this.BrowseBillList = data.length ? data : [];
                this.BackupBrowseBillList = data.length ? data : [];
                this.GetDist1();
                this.FilterDist1();
              this.seachSpinner = false;
        });
  }
  SearchPendingBillList() {
    this.DistCreatedBy2 = [];
    this.SelectedDistCreatedBy2 = [];
    this.PendingBillList =  [];
    this.BackupPendingBillList = [];
    this.seachSpinner = true;
      const start = this.PendingBillSearch.Start_Date
        ? this.DateService.dateConvert(new Date(this.PendingBillSearch.Start_Date))
        : this.DateService.dateConvert(new Date());
      const end = this.PendingBillSearch.End_Date
        ? this.DateService.dateConvert(new Date(this.PendingBillSearch.End_Date))
        : this.DateService.dateConvert(new Date());
        const obj = {
          "SP_String": "Tutopia_Subscription_Accounts",
          "Report_Name_String": "GET_Bill_Browse_Not_Confirmed",
          "Json_Param_String": JSON.stringify([{'Start_Date': start,'End_Date':end,'User_ID' :this.$CompacctAPI.CompacctCookies.User_ID}])
        }
        this.GlobalAPI
            .getData(obj)
            .subscribe((data: any) => {
                this.PendingBillList = data.length ? data : [];
                this.BackupPendingBillList = data.length ? data : [];
                this.GetDist2();
                this.FilterDist2();
              this.seachSpinner = false;
        });
  }
  // DISTINCT & FILTER
  GetDist1() {
    let DOrderBy = [];
    this.DistCreatedBy1 = [];
    this.BackupBrowseBillList.forEach((item) => {
      if (DOrderBy.indexOf(item.Bill_Created_By) === -1) {
        DOrderBy.push(item.Bill_Created_By);
        this.DistCreatedBy1.push({ label: item.Bill_Created_By, value: item.Bill_Created_By });
      }
    });
  }
  FilterDist1() {
    let DOrderBy = [];
    if (this.SelectedDistCreatedBy1.length) {
      DOrderBy = this.SelectedDistCreatedBy1;
    }
    this.BrowseBillList = [];
    if (this.SelectedDistCreatedBy1.length) {
      let LeadArr = this.BackupBrowseBillList.filter(function (e) {
        return (DOrderBy.length ? DOrderBy.includes(e['Bill_Created_By']) : true)
      });
      this.BrowseBillList = LeadArr.length ? LeadArr : [];
    } else {
      this.BrowseBillList = this.BackupBrowseBillList;
    }
  }
  GetDist2() {
    let DOrderBy = [];
    this.DistCreatedBy2 = [];
    this.BackupPendingBillList.forEach((item) => {
      if (DOrderBy.indexOf(item.Bill_Created_By) === -1) {
        DOrderBy.push(item.Bill_Created_By);
        this.DistCreatedBy2.push({ label: item.Bill_Created_By, value: item.Bill_Created_By });
      }
    });
  }
  FilterDist2() {
    let DOrderBy = [];
    if (this.SelectedDistCreatedBy2.length) {
      DOrderBy = this.SelectedDistCreatedBy2;
    }
    this.PendingBillList = [];
    if (this.SelectedDistCreatedBy2.length) {
      let LeadArr = this.BackupPendingBillList.filter(function (e) {
        return (DOrderBy.length ? DOrderBy.includes(e['Bill_Created_By']) : true)
      });
      this.PendingBillList = LeadArr.length ? LeadArr : [];
    } else {
      this.PendingBillList = this.BackupPendingBillList;
    }
  }
  // MAKE PAYMENT
  RedirectToPayment(col){
    const obj = {
      Subscription_Txn_ID :  window.btoa(col.Subscription_Txn_ID),
      Menu_Ref_ID : window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID),
      Foot_Fall_ID : window.btoa(col.Foot_Fall_ID)
    }
    const navigationExtras: NavigationExtras = {
      queryParams: obj,
    };
    this.router.navigate(['./Tutopia_Order_Payment'], navigationExtras);
  }
  GetPDF(obj) {
    if (obj.Bill_No) {
      if(obj.Bill_No.startsWith("O")) {
        window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + obj.Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      }else {
        window.open("/Report/Crystal_Files/Finance/SaleBill/tutopia_final.aspx?Doc_No=" + obj.Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      }

    }
  }
  // EXPORT TO EXCEL
  exportexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }

  CancelBil(obj){
    this.OrderNo = undefined;
    if(obj.Bill_No) {
      this.OrderNo = obj.Bill_No;
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
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm() {
    const Tempobj = {
      Order_No : this.OrderNo,
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String" : "Tutopia_Subscription_Accounts",
      "Report_Name_String" : "Cancel_Bill",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log(data);
      if(data[0].message === "success") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Order No : " + this.OrderNo,
          detail:  "Succesfully Cancelled."
        });
        this.OrderNo = undefined;
        this.SearchBrowseBillList();
        this.SearchPendingBillList();
      } else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
    })


  }
}
class Search{
  Start_Date : string;
  End_Date : string;
  User_ID : string;
}