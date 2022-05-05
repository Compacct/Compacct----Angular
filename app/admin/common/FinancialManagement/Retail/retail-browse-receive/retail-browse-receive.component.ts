import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-retail-browse-receive',
  templateUrl: './retail-browse-receive.component.html',
  styleUrls: ['./retail-browse-receive.component.css'],
  providers: [MessageService]
})
export class RetailBrowseReceiveComponent implements OnInit {
  HearingReceiveVFormseachSpinner = false;
  HearingReceiveVFormSubmitted = false;
  HearingReceiveVBillList = [];
  ObjSearch = new Search();
  ReceiveBillDocId = undefined;
  aspxFileName = undefined;

  items = [];
  CostCenterList =[];
  CostCenterListAll = [];
  SEarchFilter = ['Voucher_No','Voucher_Date', 'Patient_Name','Mobile','Adj_with_Doc_No','Adj_Amount','Rec_Amt','Bank_Txn_Type','Fin_Year_Name']
  constructor(private $http: HttpClient,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.items =  ['Hearing Recieve Voucher Browse'];
    this.Header.pushHeader({
      Header: "Hearing Recieve Voucher Browse",
      Link: "Patient Management -> Transaction -> Hearing Recieve Voucher Browse"
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
  getCostCenName(id){
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
      this.ObjSearch.st_dt_time = dateRangeObj[0];
      this.ObjSearch.end_dt_time = dateRangeObj[1];
    }
  }


  // SEARCH
  Search(valid) {
      this.HearingReceiveVBillList = [];
      this.HearingReceiveVFormSubmitted = true;
    if (valid) {
        this.HearingReceiveVFormseachSpinner = true;
        this.ObjSearch.st_dt_time = this.ObjSearch.st_dt_time
        ? this.DateService.dateConvert(new Date(this.ObjSearch.st_dt_time))
        : this.DateService.dateConvert(new Date());
        this.ObjSearch.end_dt_time = this.ObjSearch.end_dt_time
        ? this.DateService.dateConvert(new Date(this.ObjSearch.end_dt_time))
        : this.DateService.dateConvert(new Date());
        this.ObjSearch.Cost_Cen_ID = this.ObjSearch.Cost_Cen_ID ? this.ObjSearch.Cost_Cen_ID : '0';
        const QueryStr = Object.entries(this.ObjSearch).map(([key, val]) => `${key}=${val}`).join('&');
      
      this.$http
      .get("/Retail_ACC_Txn_Acc_Journal/GetAllData?"+QueryStr)
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
          this.HearingReceiveVBillList =   temp;
          this.HearingReceiveVFormSubmitted = false;
          this.HearingReceiveVFormseachSpinner = false;
      });
    }
  }
  
  GetTotal(arr,field) {
    return arr.reduce((n,obj) => n + Number(obj[field]), 0).toFixed(2)
  }
  PdfPrint (obj) {
    if (obj) {
      window.open("/Report/Crystal_Files/Finance/Voucher/report_voucher_print.aspx?Doc_No=" + obj.Voucher_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }

  onReject() {
    this.compacctToast.clear("c");
  }
  DeleteRecvBill(docID){
    this.ReceiveBillDocId = undefined;
    if(docID){
      this.ReceiveBillDocId = docID;
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
  if (this.ReceiveBillDocId) {
    this.$http
      .post('/Retail_ACC_Txn_Acc_Journal/Delete', { id: this.ReceiveBillDocId })
      .subscribe((data: any) => {
        if (data.success === true) {
          
          this.Search(true);
          this.onReject();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Doc ID : ' + this.ReceiveBillDocId,
            detail: "Succesfully Deleted"
          });
        }
      });
  }
  }
}

class Search{
  Cost_Cen_ID: any;
Voucher_Type_ID = '1';
end_dt_time: any;
st_dt_time: any;
}
