import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ExportExcelService } from '../../../shared/compacct.services/export-excel.service';

@Component({
  selector: 'app-weekly-audiologist-report',
  templateUrl: './weekly-audiologist-report.component.html',
  styleUrls: ['./weekly-audiologist-report.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class WeeklyAudiologistReportComponent implements OnInit {
  tabIndexToView: number= 0;
  Spinner: boolean = false;
  seachSpinner: boolean = false;
  items: any= [];
  loading:boolean = false;
  ObjWeeklyAudiologistReport : WeeklyAudiologistReport = new WeeklyAudiologistReport();
  WeeklyAudiologistReportlList:any = [];
  WeeklyAudiologistReportlListHeader:any = [];

  tab2seachSpinner:boolean = false;
  ObjBrandWiseSale : BrandWiseSale = new BrandWiseSale();
  BrandWiseSaleList:any = [];
  BrandWiseSaleListHeader:any = [];

  tab3seachSpinner:boolean = false;
  ObjDiagnosticsIncome : DiagnosticsIncome = new DiagnosticsIncome();
  DiagnosticIncomeList:any = [];
  DiagnosticIncomeListHeader:any = [];

  constructor(
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private $http: HttpClient,
    private excelservice: ExportExcelService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Weekly Audiologist Report",
      Link: "Report -> Weekly Audiologist Report"
    });
    this.items = ["WEEKLY AUDIOLOGIST REPORT", "BRAND WISE SALES", "DIAGNOSTICS INCOME"];
    
  }
  TabClick(e:any){
    this.tabIndexToView = e.index;
    this.items = ["WEEKLY AUDIOLOGIST REPORT", "BRAND WISE SALES", "DIAGNOSTICS INCOME"];
  }
  getDateRange(dateRangeObj:any) {
    if (dateRangeObj.length) {
      this.ObjWeeklyAudiologistReport.From_Date = dateRangeObj[0];
      this.ObjWeeklyAudiologistReport.To_Date = dateRangeObj[1];
    }
  }
  GetWeeklyAudiologistReport() {
    this.WeeklyAudiologistReportlList = [];
    this.WeeklyAudiologistReportlListHeader = [];
    const start = this.ObjWeeklyAudiologistReport.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklyAudiologistReport.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjWeeklyAudiologistReport.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklyAudiologistReport.To_Date))
      : this.DateService.dateConvert(new Date());
      this.seachSpinner = true;
  if (start && end) {
    const tempobj = {
      start_date: start,
      end_date: end,
    }
    const obj = {
      "SP_String": "sp_weekly_report",
      "Report_Name_String": "Audiologist_Performance",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('data daata',data);
      if(data.length){
      this.WeeklyAudiologistReportlList = data
      this.WeeklyAudiologistReportlListHeader = Object.keys(data[0]);
      this.seachSpinner = false;
    }
    else {
      this.seachSpinner = false;
    }
    });
  }
  }
  ExportToExcel1(){
    const exceldata = {
      worksheetName: "Weekly Audiologist Performance",
      title: "Weekly_Audiologist_Performance",
      header: this.WeeklyAudiologistReportlListHeader,
      data: this.WeeklyAudiologistReportlList
    }
    this.excelservice.exportExcelForAudiologist(exceldata)
  }
  getDateRangeBrandWiseSale(dateRangeObj:any) {
    if (dateRangeObj.length) {
      this.ObjBrandWiseSale.From_Date = dateRangeObj[0];
      this.ObjBrandWiseSale.To_Date = dateRangeObj[1];
    }
  }
  GetWeeklyBrandWiseSale() {
    this.BrandWiseSaleList = [];
    this.BrandWiseSaleListHeader = [];
    const start = this.ObjBrandWiseSale.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjBrandWiseSale.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrandWiseSale.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjBrandWiseSale.To_Date))
      : this.DateService.dateConvert(new Date());
      this.tab2seachSpinner = true;
  if (start && end) {
    const tempobj = {
      start_date: start,
      end_date: end,
    }
    const obj = {
      "SP_String": "sp_weekly_report",
      "Report_Name_String": "Brandwise_sale",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('data daata',data);
      if(data.length){
      this.BrandWiseSaleList = data
      this.BrandWiseSaleListHeader = Object.keys(data[0]);
      this.tab2seachSpinner = false;
    }
    else {
      this.tab2seachSpinner = false;
    }
    });
  }
  }
  ExportToExcel2(){
    const exceldata = {
      worksheetName: "Brand Wise Sales",
      title: "Brand_Wise_Sales",
      header: this.BrandWiseSaleListHeader,
      data: this.BrandWiseSaleList
    }
    this.excelservice.exportExcelForAudiologist(exceldata)
  }
  getDateRangeDiagnosticIncome(dateRangeObj:any) {
    if (dateRangeObj.length) {
      this.ObjDiagnosticsIncome.From_Date = dateRangeObj[0];
      this.ObjDiagnosticsIncome.To_Date = dateRangeObj[1];
    }
  }
  GetDateRangeDiagnosticIncome() {
    this.DiagnosticIncomeList = [];
    this.DiagnosticIncomeListHeader = [];
    const start = this.ObjDiagnosticsIncome.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjDiagnosticsIncome.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjDiagnosticsIncome.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjDiagnosticsIncome.To_Date))
      : this.DateService.dateConvert(new Date());
      this.tab3seachSpinner = true;
  if (start && end) {
    const tempobj = {
      start_date: start,
      end_date: end,
    }
    const obj = {
      "SP_String": "sp_weekly_report",
      "Report_Name_String": "Dignostic Income",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('data daata',data);
      if(data.length){
      this.DiagnosticIncomeList = data
      this.DiagnosticIncomeListHeader = Object.keys(data[0]);
      this.tab3seachSpinner = false;
    }
    else {
      this.tab3seachSpinner = false;
    }
    });
  }
  }
  ExportToExcel3(){
    const exceldata = {
      worksheetName: "Diagnostics Income",
      title: "Diagnostics_Income",
      header: this.DiagnosticIncomeListHeader,
      data: this.DiagnosticIncomeList
    }
    this.excelservice.exportExcelForAudiologist(exceldata)
  }

}
class WeeklyAudiologistReport {
  From_Date: any;
  To_Date: any;
}
class BrandWiseSale {
  From_Date: any;
  To_Date: any;
}
class DiagnosticsIncome {
  From_Date: any;
  To_Date: any;
}
