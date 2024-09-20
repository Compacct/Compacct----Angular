import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ExportExcelService } from '../../../shared/compacct.services/export-excel.service';

@Component({
  selector: 'app-weekly-reporting',
  templateUrl: './weekly-reporting.component.html',
  styleUrls: ['./weekly-reporting.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class WeeklyReportingComponent implements OnInit {
  tabIndexToView: number= 0;
  ObjWeeklyFootball : WeeklyFootball = new WeeklyFootball();
  CostCenterList:any = [];
  EnqSourceList:any = [];
  WeeklyFootballList: any= [];
  BackupWeeklyFootballList:any = [];
  WeeklyFootballListHeader: any= [];
  col:any;
  costcentid:any;
  rowofcalcol:any = [];
  WFDPopup:boolean = false;
  WeekFootFallDetailsList:any = [];
  WeekFootFallDetailsListHeader:any = [];
  WeekFootCol : any;
  WeekFootRow : any;

  ObjAppoWithSrc : AppoWithSrc = new AppoWithSrc();
  AppoWithSrcList:any = [];
  AppoWithSrcListHeader:any = [];
  AppoWithSrcDetailsList:any = [];
  AppoWithSrcDetailsListHeader:any = [];
  AppowithSrcFormSubmitted:boolean = false;
  tab2seachSpinner:boolean = false;
  totalcount:any
  status:any;

  ObjWeeklySales : WeeklySales = new WeeklySales();
  seachSpinnerWeeklySales:boolean=false;
  WeeklySalesList:any=[];
  BackupWeeklySalesList:any = [];
  WeeklySalesListHeader: any= [];

  ObjWeeklySalesDetails : WeeklySalesDetails = new WeeklySalesDetails();
  seachSpinnerWeeklySalesdetails:boolean=false;
  WeeklySalesDetailsList:any=[];
  BackupWeeklySalesDetailsList:any = [];
  WeeklySalesDetailsListHeader: any= [];

  buttonname: any= "Create";
  Spinner: boolean = false;
  seachSpinner: boolean = false;
  items: any= [];


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
      Header: "Weekly Reporting",
      Link: "Report -> Weekly Reporting"
    });
    this.items = ["FOOTFALL", "APPOINTMENT WITH SOURCES", "SALES", "SALES IN DETAILS"];
    this.GetCostCenter();
    // this.GetEnqSource();
  }
  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["FOOTFALL", "APPOINTMENT WITH SOURCES", "SALES", "SALES IN DETAILS"];
  }
  GetCostCenter(){
    this.CostCenterList = [];
    const obj = {
      "SP_String": "sp_weekly_report",
      "Report_Name_String": "Get_cost_center"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.CostCenterList = data;
    });
    
  }
  GetEnqSource(){
    this.EnqSourceList = [];
    const obj = {
      "SP_String": "sp_weekly_report",
      "Report_Name_String": "get_enq_source"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.EnqSourceList = data;
    });
    
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjWeeklyFootball.From_Date = dateRangeObj[0];
      this.ObjWeeklyFootball.To_Date = dateRangeObj[1];
    }
  }
  GetWeeklyFootball() {
    this.WeeklyFootballList = [];
    this.BackupWeeklyFootballList = [];
    this.WeeklyFootballListHeader = [];
    const start = this.ObjWeeklyFootball.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklyFootball.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjWeeklyFootball.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklyFootball.To_Date))
      : this.DateService.dateConvert(new Date());
      this.seachSpinner = true;
  if (start && end) {
    const tempobj = {
      start_date: start,
      end_date: end,
      // Cost_Cen_ID: 
      // Enq_Source_ID:
    }
    const obj = {
      "SP_String": "sp_weekly_report",
      "Report_Name_String": "weekly_footfall",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('data daata',data);
      if(data.length){
      this.GetRowsTotal(data);
      this.WeeklyFootballList = data;
      this.BackupWeeklyFootballList = data;
      // this.GetDistinct();
      this.WeeklyFootballListHeader = Object.keys(data[0]);
      this.seachSpinner = false;
      this.GetTotalForDynamicColumns();
    }
    else {
      this.seachSpinner = false;
    }
    });
  }
  }
  GetRowsTotal(data){
    data.forEach((element:any) => {
      let getvalues:any = Object.values(element)
      // console.log('getvalues',getvalues);

      let calculatetotal=0;
      getvalues.forEach((ele:any)=>{
          // console.log('typeof elu',typeof ele)
          
          if((typeof ele=='number')){
            calculatetotal=calculatetotal+ele
          }

      })
      element['Total'] = Number(calculatetotal.toFixed(2));
    });
  }
  GetTotalForDynamicColumns() {
    // Initialize an empty object to hold column totals
    let columnTotals: any = {};
  
    // Loop through each row in the list
    this.WeeklyFootballList.forEach((element: any) => {
      // Loop through each key in the current row
      for (const key in element) {
        // Check if the value is a number and add to the column total
        if (typeof element[key] === 'number') {
          if (!columnTotals[key]) {
            columnTotals[key] = 0; // Initialize the column if not already present
          }
          columnTotals[key] += element[key];
        }
      }
    });
    this.WeeklyFootballList.push({ 'Cost_Cen_Name': 'Total', ...columnTotals });
    // console.log('Column Totals:', columnTotals);
    // this.rowofcalcol = Object.values(columnTotals);
    // console.log(this.rowofcalcol)
    // // Log the totals for each dynamic column
    // console.log('Column Totals:', columnTotals);
    // return columnTotals;
  }
  onrightclick(col,row){
    this.WeekFootCol = undefined
    this.WeekFootRow = undefined
    if(col != "Cost_Cen_Name" && col != "Total"){
    console.log("col",col)
    console.log("Row",row.Cost_Cen_Name)
    this.WeekFootCol = col
    this.WeekFootRow = row.Cost_Cen_Name
    this.GetWeeklyFootDetails();
    }
  }
  GetWeeklyFootDetails(){
    this.WeekFootFallDetailsList = [];
    if (this.WeekFootCol && this.WeekFootRow) {
      const start = this.ObjWeeklyFootball.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklyFootball.From_Date))
      : this.DateService.dateConvert(new Date());
      const end = this.ObjWeeklyFootball.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklyFootball.To_Date))
      : this.DateService.dateConvert(new Date());
      const sendobj = {
        start_date: start,             
			  end_date: end,        
			  Cost_Cen_Name : this.WeekFootRow,          
			  Enq_Source_Name : this.WeekFootCol
      }
    const obj = {
      "SP_String": "sp_weekly_report",
      "Report_Name_String": "weekly_footfall_details",
      "Json_Param_String": JSON.stringify(sendobj)
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.WeekFootFallDetailsList = data;
        this.WeekFootFallDetailsListHeader = Object.keys(data[0]);
        console.log("WeekFootFallDetailsList", this.WeekFootFallDetailsList);
        this.WFDPopup = true;
      } else {
        this.WeekFootFallDetailsList = [];
        this.WeekFootFallDetailsListHeader = [];
      }
    });
    }
  }
  ExportToExcelWeekFootFall(){
    const start = this.ObjWeeklyFootball.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklyFootball.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjWeeklyFootball.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklyFootball.To_Date))
      : this.DateService.dateConvert(new Date());
     let tempobj = {}
  if (start && end) {
   tempobj = {
    From_Date: start,
    To_Date: end,
  }
  }
    this.excelservice.exporttoExcelWeeklyFootfallDetails(this.WeeklyFootballList,tempobj);
  }

  getDateRangeAppowithSrc(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjAppoWithSrc.From_Date = dateRangeObj[0];
      this.ObjAppoWithSrc.To_Date = dateRangeObj[1];
    }
  }
  GetAppowithSrc(valid) {
    this.AppoWithSrcList = [];
    // this.BackupWeeklyFootballList = [];
    this.AppoWithSrcListHeader = [];
    this.AppoWithSrcDetailsList = [];
    this.AppoWithSrcDetailsListHeader = [];
    this.AppowithSrcFormSubmitted = true;
    const start = this.ObjAppoWithSrc.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjAppoWithSrc.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjAppoWithSrc.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjAppoWithSrc.To_Date))
      : this.DateService.dateConvert(new Date());
      this.tab2seachSpinner = true;
  if (valid && start && end) {
    this.AppowithSrcFormSubmitted = false;
    const tempobj = {
      start_date: start,
      end_date: end,
      Cost_Cen_ID: this.ObjAppoWithSrc.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "sp_weekly_report",
      "Report_Name_String": "weekly_appointment_count",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log('data daata',data);
      if(data.length){
      // this.GetRowsTotal(data);
      this.AppoWithSrcList = data;
      // this.BackupWeeklyFootballList = data;
      this.AppoWithSrcListHeader = Object.keys(data[0]);
      this.tab2seachSpinner = false;
      this.getTotalValue();
    }
    else {
      this.AppoWithSrcList = [];
      this.AppoWithSrcListHeader = [];
      this.tab2seachSpinner = false;
    }
    });
  } else {
    this.tab2seachSpinner = false;
  }
  }
  getTotalValue(){
    this.totalcount = 0;
    let Amtval = 0;
    this.AppoWithSrcList.forEach((item)=>{
      Amtval += Number(item.count);
    });

    this.totalcount = Amtval ? Amtval.toFixed(2) : '-';
  }
  GetDoneDetails(obj){
    console.log(obj.remark)
    this.status = undefined;
    if(obj.remark != "Cancel"){
      console.log(obj.count)
      this.status = obj.remark;
      this.GetAppowithSrcDetails();
    }
  }
  GetAppowithSrcDetails(){
    this.AppoWithSrcDetailsList = [];
    this.AppoWithSrcDetailsListHeader = [];
    if (this.status) {
      const start = this.ObjAppoWithSrc.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjAppoWithSrc.From_Date))
      : this.DateService.dateConvert(new Date());
      const end = this.ObjAppoWithSrc.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjAppoWithSrc.To_Date))
      : this.DateService.dateConvert(new Date());
      const sendobj = {
        start_date: start,             
			  end_date: end,        
			  Status: this.status
      }
    const obj = {
      "SP_String": "sp_weekly_report",
      "Report_Name_String": "weekly_appointment_with_source",
      "Json_Param_String": JSON.stringify(sendobj)
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.AppoWithSrcDetailsList = data;
        this.AppoWithSrcDetailsListHeader = Object.keys(data[0]);
        console.log("AppoWithSrcDetailsList", this.AppoWithSrcDetailsList);
      } else {
        this.AppoWithSrcDetailsList = [];
        this.AppoWithSrcDetailsListHeader = [];
      }
    });
    }
  }
  ExportToExcelAppoWithSorce(){
    const start = this.ObjAppoWithSrc.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjAppoWithSrc.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjAppoWithSrc.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjAppoWithSrc.To_Date))
      : this.DateService.dateConvert(new Date());
     let tempobj = {}
     let data1:any = [];
     this.AppoWithSrcList.forEach(element => {
      const obj = {
        remark : element.remark,
        count : element.count
       }
       data1.push(obj);
     });
  if (start && end) {
   tempobj = {
    From_Date: start,
    To_Date: end,
    Cost_Cen_Name: this.AppoWithSrcList[0].Cost_Cen_Name,
    excelData1: data1,
    totalcount: this.totalcount,
    excelData2: this.AppoWithSrcDetailsList
  }
  }
    this.excelservice.exporttoExcelAppoWithSourceDetails(tempobj);
  }
 
  getDateRangeWeeklySales(dateRangeObj){
    if (dateRangeObj.length) {
      this.ObjWeeklySales.From_Date = dateRangeObj[0];
      this.ObjWeeklySales.To_Date = dateRangeObj[1];
    }
  }
  GetWeeklySales() {
    this.WeeklySalesList = [];
    this.BackupWeeklySalesList = [];
    this.WeeklySalesListHeader = [];
    const start = this.ObjWeeklySales.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklySales.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjWeeklySalesDetails.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklySales.To_Date))
      : this.DateService.dateConvert(new Date());
      this.seachSpinnerWeeklySales = true;
  if (start && end) {
    const tempobj = {
      start_date: start,
      end_date: end,
      // Cost_Cen_ID: 
      // Enq_Source_ID:
    }
    const obj = {
      "SP_String": "sp_weekly_report",
      "Report_Name_String": "weekly_sales_count_details",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('data daata',data);
      if(data.length){
      this.GetRowsTotal(data);
      this.WeeklySalesList = data;
      this.BackupWeeklySalesList = data;
      this.WeeklySalesListHeader = Object.keys(data[0]);
      this.seachSpinnerWeeklySales = false;
      this.GetTotalForColumns();
    }
    else {
      this.seachSpinnerWeeklySales = false;
    }
    });
  }
  }
  GetTotalForColumns() {
    // Initialize an empty object to hold column totals
    let columnTotals: any = {};
  
    // Loop through each row in the list
    this.WeeklySalesList.forEach((element: any) => {
      // Loop through each key in the current row
      for (const key in element) {
        // Check if the value is a number and add to the column total
        if (typeof element[key] === 'number') {
          if (!columnTotals[key]) {
            columnTotals[key] = 0; // Initialize the column if not already present
          }
          columnTotals[key] += element[key];
        }
      }
    });
    this.WeeklySalesList.push({ 'Cost_Cen_Name': 'Total', ...columnTotals });
  }
  ExportToExcelWeekSales(){
    const start = this.ObjWeeklySales.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklySales.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjWeeklySales.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklySales.To_Date))
      : this.DateService.dateConvert(new Date());
     let tempobj = {}
  if (start && end) {
   tempobj = {
    From_Date: start,
    To_Date: end,
  }
  }
    this.excelservice.exporttoExcelWeeklyFootfallDetails(this.WeeklySalesList,tempobj);
  }
  // Determine whether to display the first column for a given row
  shouldDisplay(rowIndex: number, field: string): boolean {
    if (rowIndex === 0) {
        return true;
    }
    return this.WeeklySalesList[rowIndex][field] !== this.WeeklySalesList[rowIndex - 1][field];
}

// Calculate rowSpan for grouped rows
calculateRowSpan(rowIndex: number, field: string): number {
    let currentValue = this.WeeklySalesList[rowIndex][field];
    let rowSpan = 1;

    for (let i = rowIndex + 1; i < this.WeeklySalesList.length; i++) {
        if (this.WeeklySalesList[i][field] === currentValue) {
            rowSpan++;
        } else {
            break;
        }
    }
    return rowSpan;
}

  getDateRange17(dateRangeObj){
    if (dateRangeObj.length) {
      this.ObjWeeklySalesDetails.From_Date = dateRangeObj[0];
      this.ObjWeeklySalesDetails.To_Date = dateRangeObj[1];
    }
  }
  GetWeeklySalesDetaild(){
    this.WeeklySalesDetailsList = [];
    this.BackupWeeklySalesDetailsList = [];
    this.WeeklySalesDetailsListHeader = [];
    const start = this.ObjWeeklySalesDetails.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklySalesDetails.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjWeeklySalesDetails.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjWeeklySalesDetails.To_Date))
      : this.DateService.dateConvert(new Date());
      this.seachSpinnerWeeklySalesdetails = true;
  if (start && end) {
    const tempobj = {
      start_date: start,
      end_date: end
    }
    const obj = {
      "SP_String": "sp_weekly_report",
      "Report_Name_String": "weekly_sales_details",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log('data sales',data);
  
      if(data.length){
        let sata:any =[];
  
        data.forEach((element:any) => {
          sata.push(
            {
              'Cost_Cen_Name': element.Cost_Cen_Name,
              'amount': element.amount,
              'Enq_deatils': JSON.parse(element.Enq_deatils)
            }
          )
        });
        console.log('sata',sata)
  
      this.WeeklySalesDetailsList = sata;
      this.BackupWeeklySalesDetailsList = sata;
      this.WeeklySalesDetailsListHeader = Object.keys(sata[0]);
      this.seachSpinnerWeeklySalesdetails = false;
    }
    else {
      this.seachSpinnerWeeklySalesdetails = false;
    }
    });
  }
  }
  ExportToExcelWeeklySalesDetails(){
    let tempobj = {
     From_Date: this.ObjWeeklySalesDetails.From_Date ? this.DateService.dateConvert(new Date(this.ObjWeeklySalesDetails.From_Date)) : this.DateService.dateConvert(new Date()),
     To_Date: this.ObjWeeklySalesDetails.To_Date ? this.DateService.dateConvert(new Date(this.ObjWeeklySalesDetails.To_Date)) : this.DateService.dateConvert(new Date())
     }
     this.excelservice.exporttoExcelWeeklySalesDetails(this.WeeklySalesDetailsList,tempobj);
  }

}

class WeeklyFootball {
  From_Date: any;
  To_Date: any;
}
class AppoWithSrc {
  From_Date: any;
  To_Date: any;
  Cost_Cen_ID: any;
}
class WeeklySales {
  From_Date: any;
  To_Date: any;
}
class WeeklySalesDetails {
  From_Date: any;
  To_Date: any;
}