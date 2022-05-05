import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AnyRecord } from 'dns';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-retail-browse',
  templateUrl: './retail-browse.component.html',
  styleUrls: ['./retail-browse.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class RetailBrowseComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  HearingAidFormseachSpinner = false;
  HearingAidFormSubmitted = false;
  AccessoriesBillFormseachSpinner = false;
  AccessoriesBillFormSubmitted = false;
  ServiceBillFormseachSpinner = false;
  ServiceBillFormSubmitted = false;
  CostCenterList = [];

  HearingAidBillList = [];
  AccessoriesBillList = [];
  ServiceBillList = [];

  SEarchFilter = ['Doc_No','Doc_Date','Bill_Type','Contact_Name','Mobile','Cost_Cen_Name','Taxable_Amt',
  'Tax',
  'Net_Amt',
  'Net_Amt1',
  'Fin_Year_Name'];

  ObjSearchHearingAidForm = new Search();
  ObjSearchAccessoriesBillForm = new Search();
  ObjSearchServiceBillForm = new Search();
  aspxFileName:any;
  BillDocId = undefined;
  constructor(private $http: HttpClient,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.items =  ['Hearing Aid Bill','Accessories Bill','Service Bill'];
    this.Header.pushHeader({
      Header: "Retail Browse",
      Link: "Patient Management -> Transaction -> Retail Browse"
    });
    this.GetAllCostCenter();
    this.GetaspxFileName();
  }
  TabClick(e){}
  GetAllCostCenter() {
    this.$http
      .get("/Common/Get_Cost_Center")
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
        temp.forEach(obj=>{
          obj['label'] = obj.Cost_Cen_Name;
          obj['value'] = obj.Cost_Cen_ID;
        });
        if(this.$CompacctAPI.CompacctCookies.User_Type === 'U') {
          this.CostCenterList = temp.filter(obj=> obj.Cost_Cen_ID == this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
        }else {
          this.CostCenterList = temp;
        }
        this.ObjSearchHearingAidForm.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
        this.ObjSearchAccessoriesBillForm.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
        this.ObjSearchServiceBillForm.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      });
  }
  GetaspxFileName() {
    this.$http
      .get("/Retail_Txn_SALE_Bill_cum_challan_GST/Get_Product_Bill_Aspx")
      .subscribe((data: any) => {
        this.aspxFileName = data;
      });
  }
  getDateRange1(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearchHearingAidForm.from_date = dateRangeObj[0];
      this.ObjSearchHearingAidForm.to_date = dateRangeObj[1];
    }
  }
  getDateRange2(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearchAccessoriesBillForm.from_date = dateRangeObj[0];
      this.ObjSearchAccessoriesBillForm.to_date = dateRangeObj[1];
    }
  }
  getDateRange3(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearchServiceBillForm.from_date = dateRangeObj[0];
      this.ObjSearchServiceBillForm.to_date = dateRangeObj[1];
    }
  }
  // SEARCH
  Search(form,name) {
      form.name = name;
      if (form.name === 'HearingAidForm') {
        this.HearingAidBillList = [];
        this.HearingAidFormSubmitted = true;
      } else if (form.name === 'AccessoriesBillForm') {
        this.AccessoriesBillList = [];
        this.AccessoriesBillFormSubmitted = true;
      } else {
        this.ServiceBillList = [];
        this.ServiceBillFormSubmitted = true;
      }
      if (form.valid) {
        let QueryStr;
        if (form.name === 'HearingAidForm') {
          this.HearingAidFormseachSpinner = true;
          this.ObjSearchHearingAidForm.from_date = this.ObjSearchHearingAidForm.from_date
          ? this.DateService.dateConvert(new Date(this.ObjSearchHearingAidForm.from_date))
          : this.DateService.dateConvert(new Date());
          this.ObjSearchHearingAidForm.to_date = this.ObjSearchHearingAidForm.to_date
          ? this.DateService.dateConvert(new Date(this.ObjSearchHearingAidForm.to_date))
          : this.DateService.dateConvert(new Date());
          this.ObjSearchHearingAidForm.Cost_Cen_ID = this.ObjSearchHearingAidForm.Cost_Cen_ID ? this.ObjSearchHearingAidForm.Cost_Cen_ID : '0';
          QueryStr = Object.entries(this.ObjSearchHearingAidForm).map(([key, val]) => `${key}=${val}`).join('&');
        } else if (form.name === 'AccessoriesBillForm') {
          this.AccessoriesBillFormseachSpinner = true;
          this.ObjSearchAccessoriesBillForm.from_date = this.ObjSearchAccessoriesBillForm.from_date
          ? this.DateService.dateConvert(new Date(this.ObjSearchAccessoriesBillForm.from_date))
          : this.DateService.dateConvert(new Date());
          this.ObjSearchAccessoriesBillForm.to_date = this.ObjSearchAccessoriesBillForm.to_date
          ? this.DateService.dateConvert(new Date(this.ObjSearchAccessoriesBillForm.to_date))
          : this.DateService.dateConvert(new Date());
          this.ObjSearchAccessoriesBillForm.Cost_Cen_ID = this.ObjSearchAccessoriesBillForm.Cost_Cen_ID ? this.ObjSearchAccessoriesBillForm.Cost_Cen_ID : '0';
          QueryStr = Object.entries(this.ObjSearchAccessoriesBillForm).map(([key, val]) => `${key}=${val}`).join('&');
        } else {
          this.ServiceBillFormseachSpinner = true;
          this.ObjSearchServiceBillForm.from_date = this.ObjSearchServiceBillForm.from_date
          ? this.DateService.dateConvert(new Date(this.ObjSearchServiceBillForm.from_date))
          : this.DateService.dateConvert(new Date());
          this.ObjSearchServiceBillForm.to_date = this.ObjSearchServiceBillForm.to_date
          ? this.DateService.dateConvert(new Date(this.ObjSearchServiceBillForm.to_date))
          : this.DateService.dateConvert(new Date());
          this.ObjSearchServiceBillForm.Cost_Cen_ID = this.ObjSearchServiceBillForm.Cost_Cen_ID ? this.ObjSearchServiceBillForm.Cost_Cen_ID : '0';
          QueryStr = Object.entries(this.ObjSearchServiceBillForm).map(([key, val]) => `${key}=${val}`).join('&');
        }
        this.$http
        .get("/Retail_Txn_SALE_Bill_cum_challan_GST/GetAllData?"+QueryStr)
        .subscribe((data: any) => {
          const temp = data ? JSON.parse(data) : [];
          if (form.name === 'HearingAidForm'){
            this.HearingAidBillList = temp.filter(obj=> obj.Bill_Type == 'Hearing Aid');
            this.HearingAidFormSubmitted = false;
            this.HearingAidFormseachSpinner = false;
          }else if (form.name === 'AccessoriesBillForm'){
            this.AccessoriesBillList = temp.filter(obj=> obj.Bill_Type == 'Hearing Accessories');
            this.AccessoriesBillFormSubmitted = false; 
            this.AccessoriesBillFormseachSpinner = false;
          }else {
            this.ServiceBillList =   temp.filter(obj=> obj.Bill_Type == 'Service Bill');
            this.ServiceBillFormSubmitted = false;
            this.ServiceBillFormseachSpinner = false;
          }
        });
      }
  }
  
  GetTotal(arr,field) {
    return arr.reduce((n,obj) => n + Number(obj[field]), 0).toFixed(2)
  }
  PdfPrint (obj) {
    if (obj) {
            window.open("/Report/Crystal_Files/Finance/SaleBill/" + this.aspxFileName + "?Doc_No=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }
  saleBillUpdate(docID,name){
    let url;
    if (name === 'HearingAidForm') {
      url= '/Retail_Txn_SALE_Bill_cum_challan_GST?subledger_id=14899&salesman=Y&checkAppo=N&cat_id=121,122,123,125,127,128,129,130,131,132,133,152,155&salesman_type=Doctor&salesRefCap=Audiologist&Bill_Type=Hearing Aid'
    } else if (name === 'AccessoriesBillForm') {
      url ='/Retail_Txn_SALE_Bill_cum_challan_GST?subledger_id=14899&salesman=N&checkAppo=N&cat_id=125,128,129,130,131,132,155&salesman_type=Doctor&salesRefCap=Audiologist&Bill_Type=Hearing%20Accessories'     
    } else {
      url = '/Retail_Txn_SALE_Bill_cum_challan_GST?subledger_id=14899&salesman=S&checkAppo=N&cat_id=126,154,156&salesman_type=Doctor&salesRefCap=Audiologist&Bill_Type=Service Bill'
    }
    window.open(url+'&FmBrowseDoc='+docID, '_blank').focus();
  }


  onReject() {
    this.compacctToast.clear("c");
  }
  DeleteSaleBill(docID){
    this.BillDocId = undefined;
    if(docID){
      this.BillDocId = docID;
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
  DelteBill() {
  if (this.BillDocId) {
    this.$http
      .post('/Retail_Txn_SALE_Bill_cum_challan_GST/Delete', { id: this.BillDocId })
      .subscribe((data: any) => {
        if (data.success === true) {
          
          this.Search({valid : true},'HearingAidForm');
          this.Search({valid : true},'AccessoriesBillForm');
          this.Search({valid : true},'ServiceBillForm');
          this.onReject();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Doc ID : ' + this.BillDocId,
            detail: "Succesfully Deleted"
          });
        }
      });
  }
  }
}
class Search{
  Cost_Cen_ID: any;
  DC = '';
  from_date:  any;
  to_date:  any;
}