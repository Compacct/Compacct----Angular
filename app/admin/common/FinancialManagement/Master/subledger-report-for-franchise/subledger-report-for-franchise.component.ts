import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-subledger-report-for-franchise',
  templateUrl: './subledger-report-for-franchise.component.html',
  styleUrls: ['./subledger-report-for-franchise.component.css'],
  providers:[MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SubledgerReportForFranchiseComponent implements OnInit {
  tabIndexToView:any = 0;
  objSubledger : Subledger = new Subledger(); 
  initDate : any = [];
  ReportTypeList : any = [];
  FinyearList : any = [];
  seachSpinner : any = false;
  SearchFormSubmit : any = false;

  constructor(
    private http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header:  " Subledger Report " ,
      Link: "  FinancialManagement ->Master ->Subledger Report For Franchise" 
    });
    this.ReportTypeList = ["Summery", "Detail"];
    this.getFinYear();
  }

  getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.objSubledger.from_date = dateRangeObj[0];
      this.objSubledger.to_date = dateRangeObj[1];
    }
   
  }

  getFinYear(){
    

    this.http
    .get("SubledgerReport/Get_Fin_Year")
    .subscribe((res: any) => {
    let data = JSON.parse(res)
   
    this.FinyearList = data;
    console.log('FinyearList=', this.FinyearList);
    });

  }

  getAlldata(valid){
    this.SearchFormSubmit = true;
    if(valid){

    }

  }

  onConfirm(){

  }

  onConfirm2(){

  }

  onReject(){
    this.compacctToast.clear("c");
  }
  TabClick(e){
    
  }

}

class Subledger{
  SelectedFinYearID : any;
  from_date : any;
  to_date : any;
  Report_type : any;
  Fin_Year_ID : any;
  Cost_Cen_ID : any;
  Cost_Cen_Name : any;
  Sub_LedgerName : any;
  Sub_LedgerID : any;
  State : any;
}
