import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AnyRecord } from 'dns';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-bl-crm-lsq-bill-management',
  templateUrl: './bl-crm-lsq-bill-management.component.html',
  styleUrls: ['./bl-crm-lsq-bill-management.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BlCrmLsqBillManagementComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  Spinner:boolean = false;
  LSQFormseachSpinner = false;
  SearchFormSubmitted = false; 
  ObjSearch = new Search();
  BillTypeList:any = [];
  LSQbillList:any = [];
  check_all:boolean = false;
  SEarchFilter = [
    'Bill_Type',
    'Contact_Name',
    'Cost_Cen_Name',
    'Doc_Date',
    'Doc_No',
    'Foot_Fall_ID',
    'LSQ_Inv_Sent',
    'LSQ_Inv_sent_on',
    'LSQ_Lead_Id',
    'LSQ_Remarks',
    'Mobile',
    'Net_Amt',
    'Sub_Ledger_Name'
  ];
  initDate:any = [];
  confirmlsqlist:any = [];
  afterSave:any = [];
  BillDocId = undefined;

  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit() {
    this.Header.pushHeader({
      Header: "LSQ Bill Management",
      Link: "Patient Management -> Transaction -> LSQ Bill Management"
    });
    this.Finyear();
    this.getBillType();
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }
  getBillType(){
    this.BillTypeList = ['All', 'Hearing Aid', 'Hearing Accessories', 'Service Bill'];
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearch.From_Date = dateRangeObj[0];
      this.ObjSearch.End_date = dateRangeObj[1];
    }
  }
  // SEARCH
  Search(valid) {
    this.LSQbillList = [];
    this.check_all = false;
    this.Spinner = false;
    this.LSQFormseachSpinner = true;
    this.SearchFormSubmitted = true;
    this.ObjSearch.From_Date = this.ObjSearch.From_Date
    ? this.DateService.dateConvert(new Date(this.ObjSearch.From_Date))
    : this.DateService.dateConvert(new Date());
    this.ObjSearch.End_date = this.ObjSearch.End_date
    ? this.DateService.dateConvert(new Date(this.ObjSearch.End_date))
    : this.DateService.dateConvert(new Date());
    if(valid){
    this.SearchFormSubmitted = false;
  const obj = {
    "SP_String": "Sp_LSQ_Bill_Management",
    "Report_Name_String": "Get_All_Browse",
    "Json_Param_String": JSON.stringify(this.ObjSearch)
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log(typeof data)
     this.LSQbillList = data;
     this.LSQFormseachSpinner = false;
    //  console.log('LSQbillList =====',data)
     for(let i = 0; i < this.LSQbillList.length ; i++ ) {
      if(this.LSQbillList[i].LSQ_Inv_Sent === "Y") {
        this.LSQbillList[i].confirmLSQdisabled = true;
      } else{
        this.LSQbillList[i].confirmLSQdisabled = false;
      }
    if(new Date(this.LSQbillList[i].LSQ_Inv_sent_on).getFullYear() === 1900){
      this.LSQbillList[i].LSQ_Inv_sent_on = '';
    } else {
      this.LSQbillList[i].LSQ_Inv_sent_on = this.LSQbillList[i].LSQ_Inv_sent_on;
    }
     }
   })
   }
  }
  checkall(){
    for(let i = 0; i < this.LSQbillList.length ; i++ ) {
      if(this.check_all && this.LSQbillList[i].LSQ_Inv_Sent != "Y") { 
        this.LSQbillList[i].confirm_LSQ = true;
      } else{
        this.LSQbillList[i].confirm_LSQ = false;
      }
    }
  }
  async Save(){
    this.confirmlsqlist = [];
    this.afterSave = [];
    let reportnamepeninv = "";
    if(Object.keys(this.LSQbillList).length){
      this.confirmlsqlist = this.LSQbillList.filter(el=>el.confirm_LSQ === true)
      console.log(this.confirmlsqlist)
      if(this.confirmlsqlist.length){
          for(let i = 0; i < this.confirmlsqlist.length ; i++ ) {
            console.log(this.confirmlsqlist[i].Doc_No)
    this.Spinner = true;
    reportnamepeninv = "https://bshplcallcenteraz.azurewebsites.net/api/LSQ_Manual_Update?code=uBUjXb45p9I0QG5_2i2NxKR6irii2KwoShigslc4PWiNAzFuoBjuYA==&billno=";
    if (this.confirmlsqlist[i].Doc_No) {
      await this.$http.post(reportnamepeninv+this.confirmlsqlist[i].Doc_No, {}).toPromise().then((data: any) => {
        // console.log(data)
        this.Search(true);
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Invoice ",
          detail: data[0].msg
        });
      }).catch(e=>{
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error ",
          detail: e.error[0].msg
        });
       })
    } 
    else {
           this.Spinner = false;
           this.ngxService.stop();
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "error",
             summary: "Error ",
             detail: 'No Document found.'
           });
          }
          }
      }
      else {
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error ",
          detail: 'No Data Select'
        });
      }
    }
    else {
      this.Spinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error ",
        detail: 'No Data Select'
      });
    }
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
  Bill_Type: any = 'All';
  From_Date:  any;
  End_date:  any;
}
