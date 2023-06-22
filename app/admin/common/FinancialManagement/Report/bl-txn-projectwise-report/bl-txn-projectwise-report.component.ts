import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ExportExcelService } from '../../../../shared/compacct.services/export-excel.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
@Component({
  selector: 'app-bl-txn-projectwise-report',
  templateUrl: './bl-txn-projectwise-report.component.html',
  styleUrls: ['./bl-txn-projectwise-report.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BlTxnProjectwiseReportComponent implements OnInit {
  BrowseFromSubmit: boolean = false;
  Project_Id: any = undefined;
  From_Date: any = undefined;
  To_Date: any = undefined;
  initDate2: any = [];
  ProjectList: any = [];
  tabIndexToView: number = 0;
  purchaseBill: any = [];
  purchesTotal: any = undefined;
  ExpenseList: any = [];
  expenseTotal: any = undefined;
  Salelist: any = [];
  SaleTotal: any = undefined;
  Filterproject: any = undefined;
  outFolwlist: any =[];
  outFolwlistTotal:any = undefined;
  Inflowlist: any =[];
  InflowTotal:any = undefined;
  constructor(
    public Header: CompacctHeader,
    public DateService: DateTimeConvertService,
    public $http: HttpClient,
    public compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private _exportExcel: ExportExcelService,
    private GlobalAPI:CompacctGlobalApiService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Project Wise Report",
      Link: " Financial Management -> Report-> Project Wise Report"
    });
    this.getProject();
  }
  getDateRange(dateRangeObj:any) {
    if(dateRangeObj.length){
      this.From_Date = dateRangeObj[0];
      this.To_Date = dateRangeObj[1];
    }
  }
  getProject(){
  this.ProjectList = [];
    const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_Project",
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Project_Description;
        el['value'] = el.Project_ID;
      });
      this.ProjectList = data;
      //console.log("ProjectList",this.ProjectList);
      
   
    })
  }
  BrowseExcel(valid:any) {
    this.BrowseFromSubmit = true;
    this.Filterproject = undefined;
    this.purchesTotal = undefined;
    if (valid) {
      let Filterr = this.ProjectList.filter((el: any) => Number(el.Project_ID) === Number(this.Project_Id));
      this.Filterproject = Filterr[0].Project_Description;
      this.From_Date = this.From_Date ? this.DateService.dateConvert(this.From_Date) : this.DateService.dateConvert(new Date());
      this.To_Date = this.To_Date ? this.DateService.dateConvert(this.To_Date) : this.DateService.dateConvert(new Date());
      } 
      const File = {
        Project_ID: this.Project_Id,
        From_Date:  this.From_Date,
        To_Date: this.To_Date
      } 
     const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Purchase",
      "Json_Param_String": JSON.stringify([File]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.purchaseBill = data;
      this.purchesTotal =  this.purchaseBill.reduce((total, obj) => obj.Amount + total,0)
      //console.log("purchaseBill", data);
      //console.log("jkhdf", this.purchesTotal)
      this.getDirectExpense(this.Project_Id,this.From_Date,this.To_Date,)
    })
  }
  getDirectExpense(pro_id: any, Fr_DAte: any, To_Date: any) {
    this.ExpenseList = []
    this.expenseTotal = undefined;
    if (pro_id) {
      const File1 = {
        Project_ID: pro_id,
        From_Date:  Fr_DAte,
        To_Date: To_Date
      }
      const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Expenses",
      "Json_Param_String": JSON.stringify([File1]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ExpenseList = data;
      this.expenseTotal =  this.ExpenseList.reduce((total, obj) => obj.Amount + total,0)
      //console.log("ExpenseList", this.ExpenseList);
      //console.log("this.expenseTotal", this.expenseTotal);
      this.getSaleBill(this.Project_Id,this.From_Date,this.To_Date)
        })
      }
  }
  getSaleBill(Proj_id, From_Date,To_Datee) {
    this.Salelist = [];
    this.SaleTotal = undefined;
    if (Proj_id) {
      const File2 = {
        Project_ID: Proj_id,
        From_Date:  From_Date,
        To_Date: To_Datee
      }
      const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Sales",
      "Json_Param_String": JSON.stringify([File2]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Salelist = data;
      this.SaleTotal =  this.Salelist.reduce((total, obj) => obj.Amount + total,0)
      //console.log("Salelist", this.Salelist);
      //console.log("this.SaleTotal", this.SaleTotal);
      this.getInflow(this.Project_Id,this.From_Date,this.To_Date)
        })
      } 
  }
  getInflow(Proj_idd, From_Datee,To_Dateee) {
    this.Inflowlist = [];
    this.InflowTotal = undefined;
    if (Proj_idd) {
      const File2 = {
        Project_ID: Proj_idd,
        From_Date:  From_Datee,
        To_Date: To_Dateee
      }
      const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Inflow",
      "Json_Param_String": JSON.stringify([File2]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Inflowlist = data;
      this.InflowTotal =  this.Inflowlist.reduce((total, obj) => obj.Amount + total,0)
      //console.log("Inflowlist", this.Inflowlist);
      //console.log("this.InflowTotal", this.InflowTotal);
      this.getOutflow(Proj_idd, From_Datee,To_Dateee)
        })
      } 
  }
  getOutflow(Proj, From_D,To_D) {
    this.outFolwlist = [];
    this.outFolwlistTotal = undefined;
    if (Proj) {
      const File2 = {
        Project_ID: Proj,
        From_Date:  From_D,
        To_Date: To_D
      }
      const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Outflow",
      "Json_Param_String": JSON.stringify([File2]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.outFolwlist = data;
      this.outFolwlistTotal =  this.outFolwlist.reduce((total, obj) => obj.Amount + total,0)
      //console.log("outFolwlist", this.outFolwlist);
      //console.log("this.outFolwlistTotal", this.outFolwlistTotal);
      this._exportExcel.DownloadExcelReportHB(this.Filterproject ,this.From_Date,this.To_Date,this.purchaseBill,this.ExpenseList,this.Salelist,this.Inflowlist,this.outFolwlist,this.purchesTotal,this.expenseTotal,this.SaleTotal,this.InflowTotal,this.outFolwlistTotal) 
        })
      } 
  }
   
  }
