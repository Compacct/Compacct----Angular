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
  HearingFormseachSpinner = false;
  HearingFormSubmitted = false;
  CostCenterList = [];

  HearingBillList = [];
  HearingBillListBackup = [];
  SEarchFilter = ['Doc_No','Doc_Date','Bill_Type','Contact_Name','Mobile','Cost_Cen_Name','Taxable_Amt',
  'Tax',
  'Net_Amt',
  'Net_Amt1',
  'Fin_Year_Name'];
  FilterByBillList = [
    { label: 'Hearing Aid Bill', value: 'Hearing Aid' },
    { label: 'Accessories Bill', value: 'Hearing Accessories' },
    { label: 'Service Bill', value: 'Service Bill' }
  ];
  SelectedFilterType = []; 
  ObjSearchHearingForm = new Search();
  aspxFileName:any;
  BillDocId = undefined;
  RedirectUrlList:any;
  constructor(private $http: HttpClient,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) {
      this.$CompacctAPI.getClientData().then((data: any) => {
        let returnedObj:any = {};
        data.countryInformation.forEach(el => {
          if (el.CompanyName === this.$CompacctAPI.CompacctCookies.Company_Name) {
            returnedObj = el;
          }
        });
        this.RedirectUrlList = returnedObj.Details[15].BillingType[0];
      });
     }

  ngOnInit() {
    this.items =  ['Hearing Bill'];
    this.Header.pushHeader({
      Header: "Retail Browse",
      Link: "Patient Management -> Transaction -> Retail Browse"
    });
    this.GetAllCostCenter();
    this.GetaspxFileName();
    console.log(this.RedirectUrlList);
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
        this.ObjSearchHearingForm.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
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
      this.ObjSearchHearingForm.from_date = dateRangeObj[0];
      this.ObjSearchHearingForm.to_date = dateRangeObj[1];
    }
  }
  // SEARCH
  Search(valid) {
    this.HearingBillListBackup = [];
        this.HearingBillList = [];
        this.HearingFormSubmitted = true;
      if (valid) {
        let QueryStr;
          this.HearingFormseachSpinner = true;
          this.ObjSearchHearingForm.from_date = this.ObjSearchHearingForm.from_date
          ? this.DateService.dateConvert(new Date(this.ObjSearchHearingForm.from_date))
          : this.DateService.dateConvert(new Date());
          this.ObjSearchHearingForm.to_date = this.ObjSearchHearingForm.to_date
          ? this.DateService.dateConvert(new Date(this.ObjSearchHearingForm.to_date))
          : this.DateService.dateConvert(new Date());
          this.ObjSearchHearingForm.Cost_Cen_ID = this.ObjSearchHearingForm.Cost_Cen_ID ? this.ObjSearchHearingForm.Cost_Cen_ID : '0';
          QueryStr = Object.entries(this.ObjSearchHearingForm).map(([key, val]) => `${key}=${val}`).join('&');
       
        this.$http
        .get("/Retail_Txn_SALE_Bill_cum_challan_GST/GetAllData?"+QueryStr)
        .subscribe((data: any) => {
          const temp = data ? JSON.parse(data) : [];
          this.HearingBillListBackup = temp;
              this.HearingBillList = temp;
            this.HearingFormseachSpinner = false;
            this.HearingFormSubmitted = false;
          
        });
      }
  }
  
  FilterDist1() {
    let DFilterType = [];
    if (this.SelectedFilterType.length) {
      DFilterType = this.SelectedFilterType;
    }
    this.HearingBillList = [];
    if (this.SelectedFilterType.length) {
    let LeadArr = this.HearingBillListBackup.filter(function (e) {
    return (DFilterType.length ? DFilterType.includes(e['Bill_Type']) : true)
    });
    this.HearingBillList = LeadArr.length ? LeadArr : [];
    } else {
    this.HearingBillList = this.HearingBillListBackup;
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
  saleBillUpdate(obj){
    let url;
    if (obj.Bill_Type === 'Hearing Aid') {
      url= this.RedirectUrlList.HearingAidBill;
    } else if (obj.Bill_Type === 'Hearing Accessories') {
      url =this.RedirectUrlList.AccessoriesBill;
    } else {
      url = this.RedirectUrlList.ServiceBill;
    }
    window.open(url+'&FmBrowseDoc='+obj.Doc_No, '_blank').focus();
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
          
          this.Search(true);
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