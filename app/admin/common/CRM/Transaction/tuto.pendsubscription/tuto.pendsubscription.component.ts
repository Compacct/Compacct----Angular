import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctGetDistinctService } from '../../../../shared/compacct.services/compacct-get-distinct.service';
import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-tuto.pendsubscription',
  templateUrl: './tuto.pendsubscription.component.html',
  styleUrls: ['./tuto.pendsubscription.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoPendsubscriptionComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  AllPendingsubList = [];
  Acnotconflist = [];
  confirmedlist = [];
  Backupconfirmedlist = [];
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
  DistPaymentStatus =[];
  SelectedDistPaymentStatus =[];
  DistISBlocked =[];
  DistClaimID =[];
  SelectedDistISBlocked =[];
  SelectedDistClaimID =[];
  searchFields =[];
  OrderNo = undefined;
  constructor(
    private $http: HttpClient,
    private router : Router,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private GetDistinctItems :CompacctGetDistinctService
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
      "Report_Name": "Get_Channel_Students_Date_Wise",
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
    this.DistPaymentStatus =[];
    this.Backupconfirmedlist = [];
    this.SelectedDistPaymentStatus =[];
    this.DistISBlocked =[];
    this.DistClaimID =[];
    this.SelectedDistISBlocked =[];
    this.SelectedDistClaimID =[];
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
                this.Backupconfirmedlist = data.length ? data : [];
                this.DistPaymentStatus = this.GetDistinctItems.GetMultipleDistinct(this.Backupconfirmedlist,['Payment_Status'])[0];
                this.DistISBlocked = this.GetDistinctItems.GetMultipleDistinct(this.Backupconfirmedlist,['IS_Blocked'])[0];
                this.DistClaimID = this.GetDistinctItems.GetMultipleDistinct(this.Backupconfirmedlist,['Clam_Status'])[0];
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
  FilterDist2() {
    let DPaymentStatus = [];
    let DISBlocked = [];
    let DClaimID = [];
    let searchFields = [];
    if (this.SelectedDistPaymentStatus.length) {
      searchFields.push('Payment_Status');
      DPaymentStatus = this.SelectedDistPaymentStatus;
    }
    if (this.SelectedDistISBlocked.length) {
      searchFields.push('IS_Blocked');
      DISBlocked = this.SelectedDistISBlocked;
    }
    if (this.SelectedDistClaimID.length) {
      searchFields.push('Clam_Status');
      DClaimID = this.SelectedDistClaimID;
    }
    this.confirmedlist = [];
    if (searchFields.length) {
      let LeadArr = this.Backupconfirmedlist.filter(function (e) {
        return ((DPaymentStatus.length ? DPaymentStatus.includes(e['Payment_Status']) : true)
        && (DISBlocked.length ? DISBlocked.includes(e['IS_Blocked']) : true)
        && (DClaimID.length ? DClaimID.includes(e['Clam_Status']) : true)
        )
      });
      this.confirmedlist = LeadArr.length ? LeadArr : [];
    } else {
      this.confirmedlist = this.Backupconfirmedlist;
    }
  }
  Billcreation(col) {
    // const CommonLink = "/Tutopia_Retail_Txn_SALE_Bill_cum_challan_GST/Index?subledger_id=14899&salesman=N&checkAppo=N&cat_id=0&salesman_type=Doctor&salesRefCap=Audiologist&Bill_Type=Others&recordid=" + window.btoa(col.Foot_Fall_ID) + '&Subscription_Txn_ID='+ window.btoa(col.Subscription_Txn_ID)
    // const DirectSalesLink = "/Tutopia_Retail_Txn_SALE_Bill_cum_challan_GST/Index?subledger_id=14899&salesman=N&checkAppo=N&cat_id=0&salesman_type=Doctor&salesRefCap=Audiologist&Bill_Type=Others&recordid=" + window.btoa(col.Foot_Fall_ID) + '&Subscription_Txn_ID='+ window.btoa(col.Subscription_Txn_ID) +'&TutopiaDirect=true'
    // const Link = this.WithFootFall ? DirectSalesLink : CommonLink;
    // const Link = '/Tutopia_Student_Order?Subscription_Txn_ID='+ window.btoa(col.Subscription_Txn_ID)+'&Menu_Ref_ID='+window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID);
    //  window.open(Link);
    const obj = {
      Subscription_Txn_ID :  window.btoa(col.Subscription_Txn_ID),
      Menu_Ref_ID : window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID)
    }
    this.DynamicRedirectTo(obj,'./Tutopia_Student_Order')
  }
  MakePayement(col) {
   // const Link = '/Tutopia_Order_Payment?Subscription_Txn_ID='+ window.btoa(col.Subscription_Txn_ID)+'&Menu_Ref_ID='+window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID)+'&Foot_Fall_ID='+window.btoa(col.Foot_Fall_ID);
   // window.open(Link);
    const obj = {
      Subscription_Txn_ID :  window.btoa(col.Subscription_Txn_ID),
      Menu_Ref_ID : window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID),
      Foot_Fall_ID : window.btoa(col.Foot_Fall_ID)
    }
    this.DynamicRedirectTo(obj,'./Tutopia_Order_Payment')
  }
  PrintOrderAspx(obj){
    if(obj.Order_No) {
      window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + obj.Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }
  DynamicRedirectTo (obj,Redirect_To){
    const navigationExtras: NavigationExtras = {
      queryParams: obj,
    };
    this.router.navigate([Redirect_To], navigationExtras);
  }
// EXPORT TO EXCEL
exportexcel(Arr,fileName): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, fileName+'.xlsx');
}

  GetPDF(obj) {
    if (obj.Doc_No) {
      if(obj.Doc_No.startsWith("O")) {
        const obj2 = {
          Order_No : obj.Doc_No
        }
        this.PrintOrderAspx(obj2);
      } else {
        window.open("/Report/Crystal_Files/Finance/SaleBill/tutopia_final.aspx?Doc_No=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      }

    }
  }


  Searchsubscription(){

  }

  clearData(){

  }

  CancelBil(obj){
    this.OrderNo = undefined;
    if(obj.Doc_No) {
      this.OrderNo = obj.Doc_No;
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
        this.getAllPendingsubList(2,0);
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
