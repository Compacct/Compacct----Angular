import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tuto.pendsubscription',
  templateUrl: './tuto.pendsubscription.component.html',
  styleUrls: ['./tuto.pendsubscription.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TutoPendsubscriptionComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  AllPendingsubList = [];
  Acnotconflist = [];
  confirmedlist = [];
  seachSpinner = false;
  ConfirmSearchFormSubmitted = false;
  start_date:any;
  end_date:any;
  PendingsearchObj = new searchObj();
  ConfirmsearchObj = new searchObj();
  RegisStudentsearchObj = new RegisStudentsearchObj();
  NotConfirmsearchObj = new searchObj();
  SaleType = undefined;
  aspxFileName:any;
  saletypevalue:any;
  WithFootFall = false;
  RegisteredStudentList =[];
  BackupRegisteredStudentList = [];
  DistSubscribed =[];
  SelectedDistSubscribed =[];
  searchFields =[];
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
  ) { }

  ngOnInit() {
    this.items = ["CONFIRMED", "PENDING", "A/C NOT CONF", "Registered Students"];
    this.Header.pushHeader({
      Header: "Subscription",
      Link: " Channel Sale -> Subscription"

    });
    // this.GetRegisteredStudentList();
    this.GetReportType();

    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.WithFootFall = false;
      if (params['recordid']) {
        this.WithFootFall = true;
        this.getAllPendingsubList(2,window.atob(params['recordid']));
      }
    });
  }

  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["CONFIRMED", "PENDING", "A/C Not Conf", "Registered Students"];
  }
  getSalesData(){
    if (this.$CompacctAPI.CompacctCookies.Menu_Ref_ID  == 6){
      this.saletypevalue =[
        'All',
        'Distributor',
        'Affiliate',
        'Channel Sale',
        'Direct Sale'
      ];
     } else {
       this.saletypevalue =['MySale'];
     };
  }
  getPendingDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.PendingsearchObj.start_date = dateRangeObj[0];
      this.PendingsearchObj.end_date = dateRangeObj[1];
    }
  }
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ConfirmsearchObj.start_date = dateRangeObj[0];
      this.ConfirmsearchObj.end_date = dateRangeObj[1];
    }
  }
  getNotConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.NotConfirmsearchObj.start_date = dateRangeObj[0];
      this.NotConfirmsearchObj.end_date = dateRangeObj[1];
    }
  }
  getRegisteredStdntDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.RegisStudentsearchObj.Start_Date = dateRangeObj[0];
      this.RegisStudentsearchObj.End_Date = dateRangeObj[1];
    }
  }
  // REGISTERED STUDENT
  GetRegisteredStudentList() {
    this.RegisteredStudentList = [];
    this.DistSubscribed =[];
    this.SelectedDistSubscribed =[];
    this.searchFields =[];
    const start = this.RegisStudentsearchObj.Start_Date
    ? this.DateService.dateConvert(new Date(this.RegisStudentsearchObj.Start_Date))
    : this.DateService.dateConvert(new Date());
  const end = this.RegisStudentsearchObj.End_Date
    ? this.DateService.dateConvert(new Date(this.RegisStudentsearchObj.End_Date))
    : this.DateService.dateConvert(new Date());
    const tempObj = {
      'User_ID' :this.$CompacctAPI.CompacctCookies.User_ID,
      'Start_Date' : start,
      'End_Date' : end
    }
    const obj = {
      "Report_Name": "Get_channel_sales_date",
      "Json_Param_String" : JSON.stringify([tempObj])
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
         console.log(data);
         this.RegisteredStudentList = data.length ? data : [];
         this.BackupRegisteredStudentList = data;
         this.GetDistinct();
        });
  }
  GetDistinct() {
    let DSubscribed = [];
  this.DistSubscribed =[];
  this.SelectedDistSubscribed =[];
  this.searchFields =[];
    this.RegisteredStudentList.forEach((item) => {
      if (DSubscribed.indexOf(item.Subscribed) === -1) {
        DSubscribed.push(item.Subscribed);
        this.DistSubscribed.push({ label: item.Subscribed, value: item.Subscribed });
      }
    });
    this.BackupRegisteredStudentList = [...this.RegisteredStudentList];
  }
  FilterDist() {
    let DSubscribed = [];
    this.searchFields = [];
    if (this.SelectedDistSubscribed.length) {
      this.searchFields.push('Subscribed');
      DSubscribed = this.SelectedDistSubscribed;
    }
    this.RegisteredStudentList = [];
    if (this.searchFields.length) {
      let LeadArr = this.BackupRegisteredStudentList.filter(function (e) {
        return (DSubscribed.length ? DSubscribed.includes(e['Subscribed']) : true)
      });
      this.RegisteredStudentList = LeadArr.length ? LeadArr : [];
    } else {
      this.RegisteredStudentList = this.BackupRegisteredStudentList;
    }
  }
  // PENDING / NOT CONFIRM
  getAllPendingsubList(tabName,recordID) {
    this.seachSpinner = true;
    this.AllPendingsubList = [];
    this.Acnotconflist = [];
    let querystring = {
      USER_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      Report_type : '',
      Start_Date : '',
      End_Date : '',
      menu_ref_id : this.$CompacctAPI.CompacctCookies.Menu_Ref_ID,
      Foot_Fall_ID : ''
    };

    if(tabName === 2) {
      const start = this.PendingsearchObj.start_date
        ? this.DateService.dateConvert(new Date(this.PendingsearchObj.start_date))
        : this.DateService.dateConvert(new Date());
      const end = this.PendingsearchObj.end_date
        ? this.DateService.dateConvert(new Date(this.PendingsearchObj.end_date))
        : this.DateService.dateConvert(new Date());
        querystring.Start_Date = start;
        querystring.End_Date = end;
        querystring.Report_type = 'PENDING SALE';
    } else if (tabName === 3) {
      const start = this.NotConfirmsearchObj.start_date
        ? this.DateService.dateConvert(new Date(this.NotConfirmsearchObj.start_date))
        : this.DateService.dateConvert(new Date());
      const end = this.NotConfirmsearchObj.end_date
        ? this.DateService.dateConvert(new Date(this.NotConfirmsearchObj.end_date))
        : this.DateService.dateConvert(new Date());
        querystring.Start_Date = start;
        querystring.End_Date = end;
        querystring.Report_type = 'PENDING ACCOUNTS';
    }
    querystring.Foot_Fall_ID = recordID ? recordID : '';
    const obj = {
      "Report_Name": "Get_Channel_Pending ",
      "Json_Param_String" : JSON.stringify([querystring])
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
         console.log(data);
         if(tabName === 2) {
            this.AllPendingsubList = data.length ? data : [];
          } else if (tabName === 3) {
            this.Acnotconflist = data.length ? data : [];
          }
          this.seachSpinner = false;
        });
    // const url = recordID  ? 'Tutopia_Pending_Subscription/Get_Subscription_with_Foot_Fall_ID?Foot_Fall_ID=' + recordID : 'Tutopia_Pending_Subscription/Get_Pending_details?User_ID='+this.$CompacctAPI.CompacctCookies.User_ID;
    // this.$http
    //   .get(url + querystring)
    //   .subscribe((data: any) => {
    //     if(tabName === 2) {
    //       this.AllPendingsubList = data ? JSON.parse(data) : [];
    //     } else if (tabName === 3) {
    //       this.Acnotconflist = data ? JSON.parse(data) : [];
    //     }

    //     this.seachSpinner = false;
    //     console.log("pendinsubList =", this.AllPendingsubList);
    //   });
  }
  // CONFIRM
  GetReportType(){
    const obj = {
      "Report_Name": "Get_Channel_Sale_Type ",
      "Json_Param_String" : JSON.stringify([{Menu_Ref_ID : this.$CompacctAPI.CompacctCookies.Menu_Ref_ID}])
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
         console.log(data);
         this.saletypevalue = data.length ? data : [];
        });
  }
  GetConfirmList(recordID){
    this.confirmedlist = [];
    this.ConfirmSearchFormSubmitted = true;
    if(this.SaleType) {
      this.seachSpinner = true;
      this.ConfirmSearchFormSubmitted = false;
      const start = this.ConfirmsearchObj.start_date
          ? this.DateService.dateConvert(new Date(this.ConfirmsearchObj.start_date))
          : this.DateService.dateConvert(new Date());
        const end = this.ConfirmsearchObj.end_date
          ? this.DateService.dateConvert(new Date(this.ConfirmsearchObj.end_date))
          : this.DateService.dateConvert(new Date());
          let querystring= {
            USER_ID : this.$CompacctAPI.CompacctCookies.User_ID,
            Report_type : this.SaleType,
            Start_Date : start,
            End_Date : end,
            Foot_Fall_ID : recordID ? recordID : ''
          };

          const obj = {
            "Report_Name": "Get_Channel_Confirmed ",
            "Json_Param_String" : JSON.stringify([querystring])
          }
          this.GlobalAPI
              .CommonTaskData(obj)
              .subscribe((data: any) => {
               console.log(data);
                this.confirmedlist = data.length ? data : [];
                this.seachSpinner = false;
              });
      // const url = recordID  ? 'Tutopia_Pending_Subscription/Get_Confirm_details_With_Foot_fall_ID?Foot_Fall_ID=' + recordID : 'Tutopia_Pending_Subscription/Get_Confirm_details?User_ID='+this.$CompacctAPI.CompacctCookies.User_ID;
      // this.$http
      //   .get(url + querystring)
      //   .subscribe((data: any) => {
      //       this.confirmedlist = data ? JSON.parse(data) : [];
      //     this.seachSpinner = false;
      //     console.log("pendinsubList =", this.AllPendingsubList);
      //   });
    }

  }

  Billcreation(col) {
    const CommonLink = "/Tutopia_Retail_Txn_SALE_Bill_cum_challan_GST/Index?subledger_id=14899&salesman=N&checkAppo=N&cat_id=0&salesman_type=Doctor&salesRefCap=Audiologist&Bill_Type=Others&recordid=" + window.btoa(col.Foot_Fall_ID) + '&Subscription_Txn_ID='+ window.btoa(col.Subscription_Txn_ID)
    const DirectSalesLink = "/Tutopia_Retail_Txn_SALE_Bill_cum_challan_GST/Index?subledger_id=14899&salesman=N&checkAppo=N&cat_id=0&salesman_type=Doctor&salesRefCap=Audiologist&Bill_Type=Others&recordid=" + window.btoa(col.Foot_Fall_ID) + '&Subscription_Txn_ID='+ window.btoa(col.Subscription_Txn_ID) +'&TutopiaDirect=true'
    const Link = this.WithFootFall ? DirectSalesLink : CommonLink;
    // const Link = '/Tutopia_Student_Order?Subscription_Txn_ID='+ window.btoa(col.Subscription_Txn_ID)+'&Menu_Ref_ID='+window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID);
     window.open(Link);
  }
  MakePayement(obj) {

  }
// EXPORT TO EXCEL
exportexcel(Arr,fileName): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, fileName+'.xlsx');
}

  GetPDF(obj) {
    if (obj.Doc_No) {
      window.open("/Report/Crystal_Files/Finance/SaleBill/tutopia_final.aspx?Doc_No=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }


  Searchsubscription(){

  }

  clearData(){

  }


}
class searchObj {
  Foot_Fall_ID : string;
  bl : string;
  pd : string;
  cn : string;
  start_date : string;
  end_date : string;
}
class RegisStudentsearchObj {
  Start_Date : string;
  End_Date : string;
  User_ID : any;
}
