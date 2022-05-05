import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-retail-browse-advance',
  templateUrl: './retail-browse-advance.component.html',
  styleUrls: ['./retail-browse-advance.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class RetailBrowseAdvanceComponent implements OnInit {
  HearingAdvanceFormseachSpinner = false;
  HearingAdvanceFormSubmitted = false;
  HearingAdvanceBillList = [];
  ObjSearch = new Search();
  AdvBillDocId = undefined;
  aspxFileName = undefined;

  items = [];
  CostCenterList =[];
  CostCenterListAll = [];
  SEarchFilter = ['Doc_No','Doc_Date','Contact_Name','Amount','Discount','Remarks','Received_Amount','Bill_No']
  constructor(private $http: HttpClient,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.items =  ['Hearing Advance'];
    this.Header.pushHeader({
      Header: "Hearing Advance Browse",
      Link: "Patient Management -> Transaction -> Hearing Advance Browse"
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
        this.CostCenterListAll = temp;
        temp.forEach(obj=>{
          obj['label'] = obj.Cost_Cen_Name;
          obj['value'] = obj.Cost_Cen_ID;
        });
        if(this.$CompacctAPI.CompacctCookies.User_Type === 'U') {
          this.CostCenterList = temp.filter(obj=> obj.Cost_Cen_ID == this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
        }else {
          this.CostCenterList = temp;
        }
        this.ObjSearch.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      });
  }
  getCostCenterName(id){
    return id ? this.CostCenterListAll.filter(obj=> obj.Cost_Cen_ID == id)[0].Cost_Cen_Name : '-'
  }
  GetaspxFileName() {
    this.$http
      .get("/Hearing_Advance_Order/Get_Advance_Order_Aspx")
      .subscribe((data: any) => {
        this.aspxFileName = data;
      });
  }
  getDateRange1(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearch.from_date = dateRangeObj[0];
      this.ObjSearch.to_date = dateRangeObj[1];
    }
  }


  // SEARCH
  Search(valid) {
      this.HearingAdvanceBillList = [];
      this.HearingAdvanceFormSubmitted = true;
    if (valid) {
        this.HearingAdvanceFormseachSpinner = true;
        this.ObjSearch.from_date = this.ObjSearch.from_date
        ? this.DateService.dateConvert(new Date(this.ObjSearch.from_date))
        : this.DateService.dateConvert(new Date());
        this.ObjSearch.to_date = this.ObjSearch.to_date
        ? this.DateService.dateConvert(new Date(this.ObjSearch.to_date))
        : this.DateService.dateConvert(new Date());
        this.ObjSearch.Cost_Cen_ID = this.ObjSearch.Cost_Cen_ID ? this.ObjSearch.Cost_Cen_ID : '0';
        const QueryStr = Object.entries(this.ObjSearch).map(([key, val]) => `${key}=${val}`).join('&');
      
      this.$http
      .get("/Hearing_Advance_Order/Get_All_Data?"+QueryStr)
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
          this.HearingAdvanceBillList =   temp;
          this.HearingAdvanceFormSubmitted = false;
          this.HearingAdvanceFormseachSpinner = false;
      });
    }
  }
  GetTotal(arr,field) {
    return arr.reduce((n,obj) => n + Number(obj[field]), 0).toFixed(2)
  }
  PdfPrint (obj) {
    if (obj) {
      window.open('Report/Crystal_Files/Finance/SaleBill/' + this.aspxFileName + '?Doc_No=' + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }

  onReject() {
    this.compacctToast.clear("c");
  }
  DeleteAdvanceBill(docID){
    this.AdvBillDocId = undefined;
    if(docID){
      this.AdvBillDocId = docID;
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
  if (this.AdvBillDocId) {
    this.$http
      .post('/Hearing_Advance_Order/Delete', { id: this.AdvBillDocId })
      .subscribe((data: any) => {
        if (data.success === true) {
          
          this.Search(true);
          this.onReject();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Doc ID : ' + this.AdvBillDocId,
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