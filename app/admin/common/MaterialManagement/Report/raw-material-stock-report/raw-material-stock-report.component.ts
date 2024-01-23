import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-raw-material-stock-report',
  templateUrl: './raw-material-stock-report.component.html',
  styleUrls: ['./raw-material-stock-report.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class RawMaterialStockReportComponent implements OnInit {
  items:any = [];
  seachSpinner = false
  tabIndexToView = 0;
  ObjBrowse : Browse = new Browse ();
  
  // RDBPandingSearchFormSubmitted =false;
  SearchedStockReplist :any =[];
  DynamicHeader:any = [];
  initDate:any = [];
  initDate2:any =[];
  

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    // this.items = ["BROWSE", "CREATE","PENDING RDB"];
    this.Header.pushHeader({
      Header: "Raw Material Stock Report",
      Link: "Production Management -> Transaction -> Raw Material Stock Report"
    });
    this.Finyear();
  }
  Finyear(){
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)];
     this.initDate2 = [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.From_date = dateRangeObj[0];
      this.ObjBrowse.To_date = dateRangeObj[1];
    }
  }
  GetSearchedRMstockreplist(){
    // this.RDBPandingSearchFormSubmitted = true;
    this.seachSpinner = true;
    this.SearchedStockReplist = [];
    this.ngxService.start();
    const start = this.ObjBrowse.From_date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_date))
    : this.DateService.dateConvert(new Date());
    const End = this.ObjBrowse.To_date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.To_date))
    : this.DateService.dateConvert(new Date());
   if (start && End) {
    window.open("/Report/Crystal_Files/MICL/Raw_Material_Stock_Report.aspx?From_Date=" + start + "&" + "To_Date=" + End, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      this.seachSpinner = false;
      this.ngxService.stop();
  
    }
  }

}
class Browse {
  From_date : any;
  To_date : any;
}
