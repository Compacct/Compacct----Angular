import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SubledgerReportForFranchiseComponent implements OnInit {
  tabIndexToView: any = 0;
  objSubledger: Subledger = new Subledger();
  initDate: any = [];
  ReportTypeList: any = [];
  FinyearList: any = [];
  seachSpinner: boolean = false;
  SearchFormSubmit: boolean = false;
  SubData: any = [];
  constructor(
    private http: HttpClient,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi
){}
ngOnInit(){
    this.Header.pushHeader({
      Header: " Subledger Report ",
      Link: "  FinancialManagement ->Master ->Subledger Report For Franchise"
    });
    this.ReportTypeList = ["Summery", "Detail"];
    this.getFinYear();
    this.getSubledger();
}
onReject(){}
TabClick(e){}
getDateRange(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.objSubledger.from_date = dateRangeObj[0];
      this.objSubledger.to_date = dateRangeObj[1];
    }
}
getFinYear() {
    this.http.get("SubledgerReport/Get_Fin_Year")
      .subscribe((res: any) => {
        let data = JSON.parse(res)
        this.FinyearList = data;
        //console.log('FinyearList=', this.FinyearList);
      });
}
getSubledger() {
    this.SubData = [];
    const tempobj = {
      Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    }
    const obj = {
      "SP_String": "SP_Add_ON",
      "Report_Name_String": "Get Sub Ledger ID against Cost Center",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        this.SubData = data[0];
      // console.log("Subledger===",data)
     }
    })     
}
getAlldata(valid){
this.SearchFormSubmit = true;
if (valid) {  
 const start = this.objSubledger.from_date
? this.DateService.dateConvert(new Date(this.objSubledger.from_date))
: this.DateService.dateConvert(new Date());
const end = this.objSubledger.to_date
? this.DateService.dateConvert(new Date(this.objSubledger.to_date))
: this.DateService.dateConvert(new Date());

  const url =  'Report_type=' + this.objSubledger.Report_type + ' Print' +
                '&from_date=' + start +
                '&to_date=' + end +
                '&Cost_Cen_ID=' + this.$CompacctAPI.CompacctCookies.Cost_Cen_ID +
                '&Cost_Cen_Name=' + this.$CompacctAPI.CompacctCookies.Company_Name +
                '&Sub_LedgerID=' +this.SubData.Sub_Ledger_ID +
                '&Sub_LedgerName='+this.SubData.Sub_Ledger_Name +
                '&SelectedFinYearID='+this.$CompacctAPI.CompacctCookies.Fin_Year_ID +
    '&State=';
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    this.http.post("/SubledgerReport/Sub_Ledger_Crystal?"+url,httpOptions).subscribe((data:any)=>{
       //console.log(data)
      if (data.success == true) {
            window.open("/AspxPage/Report/CrystalFiles/Accounts/REP_CR_SubLedger_New.aspx", 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
        }
      }); 
    }
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
