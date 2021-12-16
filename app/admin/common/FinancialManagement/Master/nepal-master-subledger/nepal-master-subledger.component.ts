import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-nepal-master-subledger',
  templateUrl: './nepal-master-subledger.component.html',
  styleUrls: ['./nepal-master-subledger.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalMasterSubledgerComponent implements OnInit {
  urlService = window["config"];
  tabIndexToView = 0;
  items = [];
  seachSpinner = false;

  SubLedgerList = [];
  SubledgerSubmitted = false;

  ObjSubledger = new Subledger();

  SelectedSubledgerCategory = [];
  SelectedTagLedger =[];

  LedgerList = [];
  UserList = [];
  SalesmanList = [];
  CustomerRouteList = [];
  SubledgerClassList = [];
  ParentSubledgerList = [];
  EnqSrcList = [];
  CountryList = [];
  StateList = [];
  DistrictList =[];
  SubledgerCategoryList = [];
  constructor(private $http: HttpClient,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Master Sub Ledger",
      Link: "Financial Management --> Master -> Master Sub Ledger"
    });
    this.GetUserList();
    this.GetLedgerList();
    this.GetSalesmanList();
    this.GetCustomerRouteList();
    this.GetSubledgerClassList();
    this.GetParentSubledgerList();
    this.GetCountryList();
    this.GetEnqSrcList();  
    this.GetSubLedgerList();
  }
  TabClick(e){}
  // Init Data --
  GetLedgerList() {
    this.LedgerList = [];
    this.$http.get('/Common/Get_Acc_Ledger_List_With_Subledger').subscribe((data: any) => {
      const resDta = data.length ? data : [];
      resDta.forEach(el => {
        el.label=el.Ledger_Name;
        el.value= el.Ledger_ID;
      });
      this.LedgerList = resDta;
    });
  }
  GetUserList() {
    this.UserList = [];
    this.$http.get(this.urlService.apiGetUserLists).subscribe((data: any) => {
      const resDta = data.length ? data : [];
      resDta.forEach(el => {
        el.label=el.Name;
        el.value= el.User_ID;
      });
      this.UserList = resDta;
    });
  }
  GetSalesmanList() {
    this.SalesmanList = [];
    this.$http.get(this.urlService.apiGetSalesManList).subscribe((data: any) => {
      const resDta = data.length ? data : [];
      resDta.forEach(el => {
        el.label=el.Member_Name;
        el.value= el.Sales_Man_ID;
      });
      this.SalesmanList = resDta;
    });
  }
  GetCustomerRouteList() {
    this.CustomerRouteList = [];
    this.$http.get('/Customer_Route/Customer_Route_Browse').subscribe((data: any) => {
      this.CustomerRouteList =  data ? JSON.parse(data) : [];
    });
  }
  GetSubledgerClassList() {
    this.SubledgerClassList = [];
    this.$http.get('/Master_Acctonting_Subledger/Get_Sub_Ledger_Class').subscribe((data: any) => {
      const resDta = data.length ? data : [];
      resDta.forEach(el => {
        el.label=el.Sub_Ledger_Class;
        el.value= el.Sub_Ledger_Class_ID;
      });
      this.SubledgerClassList = resDta;
    });
  }
  GetParentSubledgerList() {
    this.ParentSubledgerList = [];
    this.$http.get('/Master_Acctonting_Subledger/GetAllData').subscribe((data: any) => {
      const resDta =  data ? JSON.parse(data) : [];
      resDta.forEach(el => {
        el.label=el.Sub_Ledger_Name;
        el.value= el.Sub_Ledger_ID;
      });
      this.ParentSubledgerList = resDta;
    });
  }
  GetCountryList() {
    this.CountryList = [];
    this.$http.get('/Common/Get_Country_List').subscribe((data: any) => {
      const resDta = data ? JSON.parse(data) : [];
      this.CountryList = resDta;
    });
  }
  GetEnqSrcList() {
    this.EnqSrcList = [];
    this.$http.get(this.urlService.apiGetEnquerySource).subscribe((data: any) => {
      const resDta = data.length ? data : [];
      this.EnqSrcList = resDta;
    });
  }


  GetSubLedgerList(){
    this.ngxService.start();
    this.seachSpinner = true;
    this.SubLedgerList = [];
    var obj = { 'ledgerids': 'All' };
    this.$http.get(this.urlService.apiGetAllDataMasterAccountingSubledger+'?ledgerids=All').subscribe((data: any) => {
      this.SubLedgerList = data ? JSON.parse(data) : [];
      this.ngxService.stop();
      this.seachSpinner = false;
    });
  }
}
class Subledger{
  Address_1:String;
  Address_2:String;
  Address_3:String;
  Billing_Name:String;

  CR_Days:String;
  CR_Limit:String;
  CST_No:String;
  Country:String;
  District:String;
  EXID_NO:String;
  Email:String;
  Land_Mark:String;
  Ledger_ID:String;

  Mobile_No:String;
  Parent_Sub_Ledger_ID:String;
  PAN_No:String;
  Phone:String;
  Pin:String;
  SERV_REG_NO:String;
  Sales_Man_ID:String;
  State:String;

  Sub_Ledger_Cat_ID:String;
  Sub_Ledger_ID:String;
  Sub_Ledger_Name:String;
  TIN_No:String;
  UID_NO:String;
  User_ID:String;
  GST:String;
  Batch_Code:String;
  IS_SEZ:String;
  KYC_ID:String;
  Recurring_Order_Days:String;
  Brand:String;
  Website:String;
  Vcard:String;
  Amount_Business_Expected:String;
  PerYear_Onetime:String;
  Special_Note:String;
  Client_Brief_Description:String;
  Remarks:String;
  Composite_GST:String;
  Subledger_Type :String;
  Export_Domestic:String;
  FSSAI_No:String;
  WORLD_WIDE_REGION:String;
  Enq_Source_ID:String;
  TDS_Deduction:String;
  CIRCLE:String;

  Is_Sale_Bill_Enabled:String;
  Is_Purchase_Bill_Enabled:String;
  Is_Payment_Enabled:String;
  Is_Reciept_Enabled:String;
  Is_Journal_Enabled:String;
  Is_CR_Note_Enabled:String;
  Is_DR_Enabled:String;
  Is_Adj_Enabled:String;
  Route_ID:String;
  Weekly_Closing:String;
  Sub_Ledger_Class_ID:String;
}